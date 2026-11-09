-- T48 ledger, payment intents, provider events, refunds, transactional outbox. All money is integer IDR (bigint).
-- Sandbox fixtures only: D06, D15 and D17 production policy is not approved. Every table is tenant scoped.
CREATE FUNCTION t48_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'restrict_violation';
END $$;

CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  source_event text NOT NULL CHECK (length(source_event) BETWEEN 1 AND 200),
  kind text NOT NULL CHECK (kind IN ('manual', 'reversal', 'payment_settlement', 'payment_late_settlement')),
  reversal_of uuid REFERENCES ledger_transactions (id),
  reason text,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, source_event),
  UNIQUE (reversal_of),
  CHECK ((kind = 'reversal') = (reversal_of IS NOT NULL))
);

CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY,
  transaction_id uuid NOT NULL REFERENCES ledger_transactions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  seq integer NOT NULL CHECK (seq >= 1),
  account text NOT NULL CHECK (account IN ('cash', 'provider_clearing', 'sales_revenue', 'refund_payable')),
  debit_idr bigint NOT NULL CHECK (debit_idr >= 0),
  credit_idr bigint NOT NULL CHECK (credit_idr >= 0),
  UNIQUE (transaction_id, seq),
  CHECK ((debit_idr > 0) <> (credit_idr > 0))
);

-- Running balance in the account's normal-side terms (cash and clearing are debit-normal, revenue and payable are
-- credit-normal). The CHECK is the database-level "no negative balance" rule.
CREATE TABLE ledger_balances (
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  account text NOT NULL,
  balance bigint NOT NULL CHECK (balance >= 0),
  PRIMARY KEY (tenant_id, outlet_id, account)
);

CREATE FUNCTION t48_check_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE txn uuid; d numeric; c numeric; n integer;
BEGIN
  IF TG_TABLE_NAME = 'ledger_transactions' THEN txn := NEW.id; ELSE txn := NEW.transaction_id; END IF;
  SELECT coalesce(sum(debit_idr), 0), coalesce(sum(credit_idr), 0), count(*) INTO d, c, n FROM ledger_entries WHERE transaction_id = txn;
  IF n < 2 OR d <> c THEN
    RAISE EXCEPTION 'ledger transaction % is not balanced (debit %, credit %, lines %)', txn, d, c, n USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER ledger_transactions_balanced AFTER INSERT ON ledger_transactions DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION t48_check_balanced();
CREATE CONSTRAINT TRIGGER ledger_entries_balanced AFTER INSERT ON ledger_entries DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION t48_check_balanced();
CREATE TRIGGER ledger_transactions_append_only BEFORE UPDATE OR DELETE ON ledger_transactions FOR EACH ROW EXECUTE FUNCTION t48_append_only();
CREATE TRIGGER ledger_entries_append_only BEFORE UPDATE OR DELETE ON ledger_entries FOR EACH ROW EXECUTE FUNCTION t48_append_only();

CREATE TABLE payment_intents (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  quote_id uuid NOT NULL REFERENCES quotes (id),
  station_id uuid NOT NULL,
  provider text NOT NULL DEFAULT 'midtrans' CHECK (provider = 'midtrans'),
  provider_order_id text NOT NULL,
  merchant_id text NOT NULL,
  amount_idr bigint NOT NULL CHECK (amount_idr > 0),
  currency text NOT NULL DEFAULT 'IDR' CHECK (currency = 'IDR'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'expired', 'failed', 'abandoned', 'refund_pending')),
  qr_string text,
  station_reserved_by uuid NOT NULL,
  station_reserved_at timestamptz NOT NULL,
  created_by uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  settled_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, outlet_id, station_id) REFERENCES stations (tenant_id, outlet_id, id),
  UNIQUE (provider, provider_order_id),
  UNIQUE (tenant_id, outlet_id, id)
);
-- One live (pending or settled) intent per quote: the split-brain guard.
CREATE UNIQUE INDEX payment_intents_live_quote ON payment_intents (quote_id) WHERE status IN ('pending', 'settled');

CREATE FUNCTION t48_intent_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tenant_id <> OLD.tenant_id OR NEW.outlet_id <> OLD.outlet_id OR NEW.quote_id <> OLD.quote_id OR NEW.station_id <> OLD.station_id
     OR NEW.provider_order_id <> OLD.provider_order_id OR NEW.merchant_id <> OLD.merchant_id OR NEW.amount_idr <> OLD.amount_idr
     OR NEW.currency <> OLD.currency OR NEW.created_by <> OLD.created_by THEN
    RAISE EXCEPTION 'payment intent fields are immutable' USING ERRCODE = 'restrict_violation';
  END IF;
  IF NEW.status <> OLD.status AND NOT (
       (OLD.status = 'pending' AND NEW.status IN ('settled', 'expired', 'failed', 'abandoned', 'refund_pending'))
    OR (OLD.status IN ('expired', 'failed', 'abandoned') AND NEW.status = 'refund_pending')) THEN
    RAISE EXCEPTION 'invalid payment intent transition % -> %', OLD.status, NEW.status USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER payment_intents_guard BEFORE UPDATE ON payment_intents FOR EACH ROW EXECUTE FUNCTION t48_intent_guard();
CREATE TRIGGER payment_intents_no_delete BEFORE DELETE ON payment_intents FOR EACH ROW EXECUTE FUNCTION t48_append_only();

CREATE TABLE payment_allocations (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  intent_id uuid NOT NULL UNIQUE REFERENCES payment_intents (id),
  quote_id uuid NOT NULL UNIQUE REFERENCES quotes (id),
  amount_idr bigint NOT NULL CHECK (amount_idr > 0),
  ledger_transaction_id uuid NOT NULL REFERENCES ledger_transactions (id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER payment_allocations_append_only BEFORE UPDATE OR DELETE ON payment_allocations FOR EACH ROW EXECUTE FUNCTION t48_append_only();

-- A refund is only ever pending here. 'refunded' needs a provider proof reference, which no code path in T48 sets.
CREATE TABLE refunds (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  intent_id uuid NOT NULL UNIQUE REFERENCES payment_intents (id),
  amount_idr bigint NOT NULL CHECK (amount_idr > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'refunded')),
  reason text NOT NULL,
  provider_proof_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'refunded') = (provider_proof_ref IS NOT NULL))
);

CREATE TABLE provider_events (
  id uuid PRIMARY KEY,
  tenant_id uuid,
  intent_id uuid REFERENCES payment_intents (id),
  provider_order_id text NOT NULL,
  raw_hash text NOT NULL,
  body jsonb NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('queued', 'unknown_order', 'rejected_mismatch')),
  received_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_order_id, raw_hash)
);
CREATE TRIGGER provider_events_append_only BEFORE UPDATE OR DELETE ON provider_events FOR EACH ROW EXECUTE FUNCTION t48_append_only();

CREATE TABLE outbox (
  id bigserial PRIMARY KEY,
  tenant_id uuid,
  topic text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  available_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  processed_at timestamptz,
  dead_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- At most one open job per topic and aggregate; a new request pulls its availability forward instead of piling up.
CREATE UNIQUE INDEX outbox_open_job ON outbox (topic, aggregate_id) WHERE processed_at IS NULL AND dead_at IS NULL;

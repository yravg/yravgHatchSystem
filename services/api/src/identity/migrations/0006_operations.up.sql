-- T53 stock, orders and X/Z shift close. Every table is tenant + outlet scoped. Money is integer IDR (bigint), stock is an
-- integer base-unit quantity (bigint). SANDBOX FIXTURES only: D08 (Asia/Jakarta, 04:00 cut), D17 (moving average) and
-- D30 (open-shift policy) are NOT owner-approved production policy.
CREATE FUNCTION t53_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'restrict_violation';
END $$;

-- The T48 journal gains three kinds for order sales and refunds (the chart of accounts is unchanged).
ALTER TABLE ledger_transactions DROP CONSTRAINT ledger_transactions_kind_check;
ALTER TABLE ledger_transactions ADD CONSTRAINT ledger_transactions_kind_check
  CHECK (kind IN ('manual', 'reversal', 'payment_settlement', 'payment_late_settlement', 'order_sale', 'order_refund', 'order_refund_paid'));

CREATE TABLE stock_items (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  base_uom text NOT NULL CHECK (base_uom IN ('ml', 'g', 'pcs')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, name)
);

-- Running quantity and value (moving average basis). The CHECKs are the database-level "no negative stock" rule.
CREATE TABLE stock_balances (
  stock_item_id uuid PRIMARY KEY REFERENCES stock_items (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  qty bigint NOT NULL DEFAULT 0 CHECK (qty >= 0),
  value_idr bigint NOT NULL DEFAULT 0 CHECK (value_idr >= 0)
);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  price_idr bigint NOT NULL CHECK (price_idr >= 0),
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, name)
);

-- A recipe is versioned and never edited: a new version applies to new orders only.
CREATE TABLE recipe_versions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  menu_item_id uuid NOT NULL REFERENCES menu_items (id),
  version integer NOT NULL CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  UNIQUE (menu_item_id, version)
);
CREATE TABLE recipe_lines (
  recipe_version_id uuid NOT NULL REFERENCES recipe_versions (id),
  stock_item_id uuid NOT NULL REFERENCES stock_items (id),
  qty_base bigint NOT NULL CHECK (qty_base > 0),
  PRIMARY KEY (recipe_version_id, stock_item_id)
);
CREATE TRIGGER recipe_versions_append_only BEFORE UPDATE OR DELETE ON recipe_versions FOR EACH ROW EXECUTE FUNCTION t53_append_only();
CREATE TRIGGER recipe_lines_append_only BEFORE UPDATE OR DELETE ON recipe_lines FOR EACH ROW EXECUTE FUNCTION t53_append_only();

CREATE TABLE orders (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  session_id uuid,
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'cancelled')),
  total_idr bigint NOT NULL CHECK (total_idr >= 0),
  revision integer NOT NULL DEFAULT 1,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  cancelled_at timestamptz,
  cancel_reason text,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  FOREIGN KEY (tenant_id, outlet_id, session_id) REFERENCES sessions (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  CHECK ((status = 'cancelled') = (cancelled_at IS NOT NULL))
);
CREATE TABLE order_lines (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  menu_item_id uuid NOT NULL REFERENCES menu_items (id),
  recipe_version_id uuid REFERENCES recipe_versions (id),
  qty integer NOT NULL CHECK (qty >= 1),
  unit_price_idr bigint NOT NULL CHECK (unit_price_idr >= 0),
  line_total_idr bigint NOT NULL CHECK (line_total_idr >= 0)
);
CREATE TRIGGER order_lines_append_only BEFORE UPDATE OR DELETE ON order_lines FOR EACH ROW EXECUTE FUNCTION t53_append_only();

-- Append-only stock events. A correction is a reversal move (unique per original), never an edit or a delete.
-- The source event is unique per tenant: a duplicate or retried event cannot move stock twice.
CREATE TABLE stock_moves (
  id uuid PRIMARY KEY,
  seq bigserial NOT NULL UNIQUE,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  stock_item_id uuid NOT NULL REFERENCES stock_items (id),
  kind text NOT NULL CHECK (kind IN ('receipt', 'consume', 'reversal')),
  qty_delta bigint NOT NULL CHECK (qty_delta <> 0),
  cost_idr bigint NOT NULL CHECK (cost_idr >= 0),
  source_event text NOT NULL CHECK (length(source_event) BETWEEN 1 AND 200),
  reversal_of uuid UNIQUE REFERENCES stock_moves (id),
  order_id uuid REFERENCES orders (id),
  reason text,
  actor_id uuid,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, source_event),
  CHECK ((kind = 'reversal') = (reversal_of IS NOT NULL)),
  CHECK ((kind <> 'receipt' OR qty_delta > 0) AND (kind <> 'consume' OR qty_delta < 0))
);
CREATE INDEX stock_moves_item ON stock_moves (stock_item_id, seq);
CREATE TRIGGER stock_moves_append_only BEFORE UPDATE OR DELETE ON stock_moves FOR EACH ROW EXECUTE FUNCTION t53_append_only();

CREATE TABLE registers (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, name)
);

CREATE TABLE shifts (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  register_id uuid NOT NULL,
  cashier_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  business_day date NOT NULL,
  opening_float_idr bigint NOT NULL CHECK (opening_float_idr >= 0),
  expected_cash_idr bigint,
  actual_cash_idr bigint CHECK (actual_cash_idr IS NULL OR actual_cash_idr >= 0),
  variance_idr bigint,
  handover_to uuid,
  opened_at timestamptz NOT NULL,
  closed_at timestamptz,
  closed_by uuid,
  FOREIGN KEY (tenant_id, outlet_id, register_id) REFERENCES registers (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  CHECK ((status = 'closed') = (closed_at IS NOT NULL))
);
CREATE UNIQUE INDEX shifts_one_open_per_cashier ON shifts (register_id, cashier_id) WHERE status = 'open';
CREATE INDEX shifts_scope ON shifts (register_id, business_day);
-- A closed shift is immutable.
CREATE FUNCTION t53_shift_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'shifts is append-only' USING ERRCODE = 'restrict_violation'; END IF;
  IF OLD.status = 'closed' THEN RAISE EXCEPTION 'a closed shift is immutable' USING ERRCODE = 'restrict_violation'; END IF;
  IF NEW.tenant_id <> OLD.tenant_id OR NEW.outlet_id <> OLD.outlet_id OR NEW.register_id <> OLD.register_id OR NEW.cashier_id <> OLD.cashier_id
     OR NEW.business_day <> OLD.business_day OR NEW.opening_float_idr <> OLD.opening_float_idr THEN
    RAISE EXCEPTION 'shift scope is immutable' USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER shifts_guard BEFORE UPDATE OR DELETE ON shifts FOR EACH ROW EXECUTE FUNCTION t53_shift_guard();

CREATE TABLE order_payments (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  order_id uuid NOT NULL REFERENCES orders (id),
  shift_id uuid NOT NULL REFERENCES shifts (id),
  method text NOT NULL CHECK (method IN ('cash', 'qris')),
  amount_idr bigint NOT NULL CHECK (amount_idr > 0),
  tender_idr bigint CHECK (tender_idr IS NULL OR tender_idr >= 0),
  change_idr bigint CHECK (change_idr IS NULL OR change_idr >= 0),
  status text NOT NULL CHECK (status IN ('pending', 'settled', 'failed')),
  provider_order_id text UNIQUE,
  merchant_id text,
  qr_string text,
  ledger_transaction_id uuid REFERENCES ledger_transactions (id),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  settled_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  CHECK ((method = 'qris') = (provider_order_id IS NOT NULL)),
  CHECK ((status = 'settled') = (ledger_transaction_id IS NOT NULL))
);
-- One live (pending or settled) payment per order: the split-brain guard.
CREATE UNIQUE INDEX order_payments_live ON order_payments (order_id) WHERE status IN ('pending', 'settled');
CREATE INDEX order_payments_shift ON order_payments (shift_id);
CREATE TRIGGER order_payments_no_delete BEFORE DELETE ON order_payments FOR EACH ROW EXECUTE FUNCTION t53_append_only();

-- A refund is pending until a proof reference exists (D15: no provider refund call is made here).
CREATE TABLE order_refunds (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  order_id uuid NOT NULL REFERENCES orders (id),
  payment_id uuid NOT NULL UNIQUE REFERENCES order_payments (id),
  amount_idr bigint NOT NULL CHECK (amount_idr > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'refunded')),
  reason text NOT NULL,
  proof_ref text,
  proof_shift_id uuid REFERENCES shifts (id),
  request_ledger_transaction_id uuid NOT NULL REFERENCES ledger_transactions (id),
  paid_ledger_transaction_id uuid REFERENCES ledger_transactions (id),
  requested_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  paid_at timestamptz,
  CHECK ((status = 'refunded') = (proof_ref IS NOT NULL))
);
CREATE TRIGGER order_refunds_no_delete BEFORE DELETE ON order_refunds FOR EACH ROW EXECUTE FUNCTION t53_append_only();

-- D30 open-shift policy: tenant scoped, versioned, never edited. NOT owner approved: every row is a labelled fixture.
CREATE TABLE shift_close_policies (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants (id),
  version integer NOT NULL CHECK (version >= 1),
  mode text NOT NULL CHECK (mode IN ('block_if_other_open')),
  fixture boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  UNIQUE (tenant_id, version)
);
CREATE TRIGGER shift_close_policies_append_only BEFORE UPDATE OR DELETE ON shift_close_policies FOR EACH ROW EXECUTE FUNCTION t53_append_only();

-- Z close: one immutable snapshot per register and business day (the unique key makes a duplicate Z the same close).
CREATE TABLE day_closes (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  register_id uuid NOT NULL,
  business_day date NOT NULL,
  policy_version integer NOT NULL,
  closing_shift_id uuid NOT NULL REFERENCES shifts (id),
  snapshot jsonb NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id, register_id) REFERENCES registers (tenant_id, outlet_id, id),
  UNIQUE (register_id, business_day)
);
CREATE TRIGGER day_closes_append_only BEFORE UPDATE OR DELETE ON day_closes FOR EACH ROW EXECUTE FUNCTION t53_append_only();

CREATE TABLE ops_audit_events (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  kind text NOT NULL,
  actor_id uuid,
  data jsonb NOT NULL DEFAULT '{}',
  at timestamptz NOT NULL
);
CREATE INDEX ops_audit_kind ON ops_audit_events (tenant_id, kind, id);
CREATE TRIGGER ops_audit_events_append_only BEFORE UPDATE OR DELETE ON ops_audit_events FOR EACH ROW EXECUTE FUNCTION t53_append_only();

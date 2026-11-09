-- T49 session coordinator: sessions, append-only events, fenced commands, leases, transfers, own transactional outbox.
-- Every table carries tenant_id and outlet_id. Money is integer IDR (bigint). All timings and amounts are SANDBOX fixtures:
-- D01, D06, D07 and D26 production policy is not approved.
CREATE FUNCTION t49_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'restrict_violation';
END $$;

-- Per-zone hourly rate overrides (effective rate of a destination station on transfer). Versions are never updated.
CREATE TABLE zone_rate_versions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  zone text NOT NULL CHECK (length(zone) BETWEEN 1 AND 40),
  rate_per_hour_idr bigint NOT NULL CHECK (rate_per_hour_idr >= 0),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id)
);
CREATE INDEX zone_rate_versions_lookup ON zone_rate_versions (tenant_id, outlet_id, zone, created_at);
CREATE TRIGGER zone_rate_versions_append_only BEFORE UPDATE OR DELETE ON zone_rate_versions FOR EACH ROW EXECUTE FUNCTION t49_append_only();

CREATE TABLE sessions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid NOT NULL,
  origin_station_id uuid NOT NULL,
  device_id uuid NOT NULL,
  quote_id uuid NOT NULL UNIQUE REFERENCES quotes (id),
  payment_intent_id uuid UNIQUE REFERENCES payment_intents (id),
  payment_mode text NOT NULL CHECK (payment_mode IN ('payment', 'postpaid')),
  mode text NOT NULL CHECK (mode IN ('FIXED', 'OPEN')),
  state text NOT NULL CHECK (state IN ('AVAILABLE', 'RESERVED', 'STARTING', 'ACTIVE', 'PAUSED', 'FINISHED', 'CHECKOUT_PENDING', 'CLEANING', 'ACTIVATION_FAILED', 'RECOVERY')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision >= 1),
  fixed_seconds bigint CHECK (fixed_seconds IS NULL OR fixed_seconds >= 0),
  accrued_seconds bigint NOT NULL DEFAULT 0 CHECK (accrued_seconds >= 0),
  running_since timestamptz,
  amount_idr bigint NOT NULL CHECK (amount_idr >= 0),
  tariff_delta_idr bigint NOT NULL DEFAULT 0,
  minimum_applied boolean NOT NULL DEFAULT false,
  final_amount_idr bigint CHECK (final_amount_idr IS NULL OR final_amount_idr >= 0),
  verification_level text,
  recovery_reason text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id, station_id) REFERENCES stations (tenant_id, outlet_id, id),
  FOREIGN KEY (tenant_id, outlet_id, device_id) REFERENCES devices (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  CHECK ((mode = 'FIXED') = (fixed_seconds IS NOT NULL))
);
-- One live session per station: the database, not only the code, refuses a second one.
CREATE UNIQUE INDEX sessions_one_live_per_station ON sessions (station_id) WHERE state NOT IN ('AVAILABLE', 'ACTIVATION_FAILED');
CREATE INDEX sessions_sweep ON sessions (tenant_id, outlet_id, state) WHERE state IN ('STARTING', 'ACTIVE', 'PAUSED', 'RECOVERY');

CREATE TABLE session_events (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  kind text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  at timestamptz NOT NULL
);
CREATE INDEX session_events_session ON session_events (session_id, id);
CREATE TRIGGER session_events_append_only BEFORE UPDATE OR DELETE ON session_events FOR EACH ROW EXECUTE FUNCTION t49_append_only();

-- Operational columns (status, epoch, sequence, expiry, retries, ack cursor) change; history is in session_events.
CREATE TABLE session_commands (
  command_id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid NOT NULL,
  device_id uuid NOT NULL,
  authority_epoch bigint NOT NULL,
  sequence bigint NOT NULL,
  expected_revision integer NOT NULL,
  desired_revision integer NOT NULL,
  action text NOT NULL CHECK (action IN ('PREPARE', 'START', 'PAUSE', 'RESUME', 'EXTEND', 'END', 'LOCK', 'SAFE_CONTROL')),
  purpose text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'APPLIED', 'FAILED', 'TIMED_OUT', 'SUPERSEDED', 'CANCELLED')),
  issued_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  applied_level text,
  retries integer NOT NULL DEFAULT 0,
  ack_cursor bigint NOT NULL DEFAULT 0,
  lease_id uuid,
  transfer_id uuid,
  actor_ref text NOT NULL,
  FOREIGN KEY (tenant_id, outlet_id, station_id) REFERENCES stations (tenant_id, outlet_id, id)
);
CREATE INDEX session_commands_session ON session_commands (session_id, desired_revision);

CREATE TABLE session_leases (
  lease_id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid NOT NULL,
  device_id uuid NOT NULL,
  revision integer NOT NULL,
  mode text NOT NULL CHECK (mode IN ('FIXED', 'OPEN')),
  remaining_seconds_at_issue bigint NOT NULL CHECK (remaining_seconds_at_issue >= 0),
  issued_at timestamptz NOT NULL,
  not_after timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('granted', 'superseded', 'revoked', 'expired')),
  authority_epoch bigint,
  command_id uuid,
  applied_at timestamptz,
  CHECK (not_after > issued_at)
);
-- At most one playable (granted) lease per session and per station. This is the split-brain / crash guard.
CREATE UNIQUE INDEX session_leases_one_granted_per_session ON session_leases (session_id) WHERE status = 'granted';
CREATE UNIQUE INDEX session_leases_one_granted_per_station ON session_leases (station_id) WHERE status = 'granted';

CREATE TABLE session_transfer_quotes (
  id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  from_station_id uuid NOT NULL,
  to_station_id uuid NOT NULL,
  session_revision integer NOT NULL,
  elapsed_seconds bigint NOT NULL,
  total_seconds bigint,
  source_rate_idr bigint NOT NULL,
  target_rate_idr bigint NOT NULL,
  base_amount_idr bigint NOT NULL,
  new_amount_idr bigint NOT NULL,
  delta_idr bigint NOT NULL,
  minimum_applied boolean NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE TRIGGER session_transfer_quotes_append_only BEFORE UPDATE OR DELETE ON session_transfer_quotes FOR EACH ROW EXECUTE FUNCTION t49_append_only();

CREATE TABLE session_transfers (
  id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  from_station_id uuid NOT NULL,
  to_station_id uuid NOT NULL,
  from_device_id uuid NOT NULL,
  to_device_id uuid NOT NULL,
  transfer_quote_id uuid NOT NULL UNIQUE REFERENCES session_transfer_quotes (id),
  status text NOT NULL CHECK (status IN ('LOCKING_SOURCE', 'ACTIVATING_TARGET', 'COMMITTED', 'SOURCE_UNPROVEN', 'TARGET_FAILED', 'ABORTED')),
  tariff_delta_idr bigint NOT NULL,
  lock_command_id uuid NOT NULL,
  start_command_id uuid,
  failure_reason text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  completed_at timestamptz,
  CHECK (from_station_id <> to_station_id)
);
CREATE UNIQUE INDEX session_transfers_one_open ON session_transfers (session_id) WHERE status IN ('LOCKING_SOURCE', 'ACTIVATING_TARGET', 'SOURCE_UNPROVEN', 'TARGET_FAILED');

-- A station that cannot be released until a device lock is proven (activation failed, aborted transfer).
CREATE TABLE session_station_holds (
  id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions (id),
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid NOT NULL,
  release_after_command_id uuid,
  created_at timestamptz NOT NULL,
  released_at timestamptz
);
CREATE UNIQUE INDEX session_station_holds_open ON session_station_holds (station_id) WHERE released_at IS NULL;

-- Transactional outbox for the edge transport (T20 consumes it). Its own table: the T48 payments runner claims every
-- row of the shared outbox and would dead-letter a topic it does not know.
CREATE TABLE session_outbox (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  session_id uuid NOT NULL REFERENCES sessions (id),
  command_id uuid,
  topic text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  available_at timestamptz NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL
);
CREATE INDEX session_outbox_open ON session_outbox (available_at) WHERE processed_at IS NULL;

CREATE TABLE session_counters (
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  seq bigint NOT NULL,
  PRIMARY KEY (tenant_id, outlet_id)
);

-- T48's intent guard refused settled -> refund_pending. A settled payment whose session start fails must be able to go
-- there (CONTRACTS section 3, step 5); this is the only change to the T48 rule. The down file restores the T48 body.
CREATE OR REPLACE FUNCTION t48_intent_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tenant_id <> OLD.tenant_id OR NEW.outlet_id <> OLD.outlet_id OR NEW.quote_id <> OLD.quote_id OR NEW.station_id <> OLD.station_id
     OR NEW.provider_order_id <> OLD.provider_order_id OR NEW.merchant_id <> OLD.merchant_id OR NEW.amount_idr <> OLD.amount_idr
     OR NEW.currency <> OLD.currency OR NEW.created_by <> OLD.created_by THEN
    RAISE EXCEPTION 'payment intent fields are immutable' USING ERRCODE = 'restrict_violation';
  END IF;
  IF NEW.status <> OLD.status AND NOT (
       (OLD.status = 'pending' AND NEW.status IN ('settled', 'expired', 'failed', 'abandoned', 'refund_pending'))
    OR (OLD.status IN ('expired', 'failed', 'abandoned') AND NEW.status = 'refund_pending')
    OR (OLD.status = 'settled' AND NEW.status = 'refund_pending')) THEN
    RAISE EXCEPTION 'invalid payment intent transition % -> %', OLD.status, NEW.status USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END $$;

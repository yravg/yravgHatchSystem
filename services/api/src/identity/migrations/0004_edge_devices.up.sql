-- T50 device identity, pairing challenges, one fenced authority epoch per outlet, and ACK intake.
-- A pairing code is stored only as an HMAC; a device public key is pinned at approval and never changes.
CREATE TABLE devices (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid,
  kind text NOT NULL CHECK (kind IN ('edge', 'seat', 'tv')),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  public_key text,
  revision integer NOT NULL DEFAULT 1,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_at timestamptz,
  revoked_by uuid,
  revoked_at timestamptz,
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  FOREIGN KEY (tenant_id, outlet_id, station_id) REFERENCES stations (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  CHECK ((status = 'revoked') = (revoked_at IS NOT NULL)),
  CHECK (status <> 'active' OR (public_key IS NOT NULL AND approved_by IS NOT NULL))
);
CREATE UNIQUE INDEX devices_public_key_unique ON devices (public_key) WHERE public_key IS NOT NULL;

CREATE TABLE pairing_challenges (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  device_id uuid NOT NULL REFERENCES devices (id),
  code_hash text NOT NULL,
  public_key text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'approved', 'revoked', 'expired')),
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE UNIQUE INDEX pairing_one_active_per_device ON pairing_challenges (device_id) WHERE status = 'active';

-- Only wrong codes and challenge requests are stored; the 5 per minute window is evaluated against these rows.
CREATE TABLE pairing_attempts (
  id bigserial PRIMARY KEY,
  device_id uuid NOT NULL REFERENCES devices (id),
  kind text NOT NULL CHECK (kind IN ('wrong_code', 'challenge')),
  at timestamptz NOT NULL
);
CREATE INDEX pairing_attempts_device_at ON pairing_attempts (device_id, kind, at);

CREATE TABLE outlet_authority (
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  epoch bigint NOT NULL CHECK (epoch >= 1),
  edge_device_id uuid REFERENCES devices (id),
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, outlet_id),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id)
);

CREATE TABLE edge_acks (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  device_id uuid NOT NULL REFERENCES devices (id),
  command_id uuid NOT NULL,
  status text NOT NULL,
  sequence bigint NOT NULL,
  authority_epoch bigint NOT NULL,
  body jsonb NOT NULL,
  received_at timestamptz NOT NULL,
  UNIQUE (device_id, command_id, status)
);

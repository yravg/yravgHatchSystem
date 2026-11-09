-- T46 identity, tenancy, staff 2FA. Every table carries tenant_id; composite FKs keep children in the parent's tenant.
CREATE TABLE tenants (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outlets (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants (id),
  name text NOT NULL,
  timezone text NOT NULL,                       -- IANA zone, e.g. Asia/Jakarta (fixture outlet only)
  business_day_cutoff text NOT NULL DEFAULT '04:00',
  config_version integer NOT NULL DEFAULT 1,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);

CREATE TABLE staff (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants (id),
  email text NOT NULL,
  display_name text NOT NULL,
  password_hash text NOT NULL,                  -- scrypt, never the password
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id)
);
CREATE UNIQUE INDEX staff_email_key ON staff (lower(email));

-- outlet_id NULL means every outlet of the tenant and is allowed for owner only (D02).
CREATE TABLE role_grants (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  staff_id uuid NOT NULL,
  outlet_id uuid,
  role text NOT NULL CHECK (role IN ('owner', 'manager', 'cashier', 'kitchen', 'technician')),
  granted_by uuid,
  revoked_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, staff_id) REFERENCES staff (tenant_id, id),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  CHECK ((role = 'owner') = (outlet_id IS NULL))
);
CREATE UNIQUE INDEX role_grants_active_key
  ON role_grants (staff_id, role, COALESCE(outlet_id, '00000000-0000-0000-0000-000000000000'::uuid))
  WHERE revoked_at IS NULL;

CREATE TABLE staff_sessions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  staff_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  token_hash text NOT NULL UNIQUE,              -- sha256 of the opaque cookie token
  csrf_hash text NOT NULL,
  mfa_state text NOT NULL CHECK (mfa_state IN ('pending', 'enrollment_required', 'verified', 'not_required')),
  step_up_until timestamptz,
  source text NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  FOREIGN KEY (tenant_id, staff_id) REFERENCES staff (tenant_id, id),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id)
);
CREATE INDEX staff_sessions_staff_idx ON staff_sessions (staff_id);

CREATE TABLE mfa_factors (
  staff_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  secret_enc text NOT NULL,                     -- AES-256-GCM sealed, bound to staff_id
  status text NOT NULL CHECK (status IN ('pending', 'active')),
  last_used_step bigint NOT NULL DEFAULT 0,     -- replay guard: a step is accepted once, later steps only
  created_at timestamptz NOT NULL,
  confirmed_at timestamptz,
  FOREIGN KEY (tenant_id, staff_id) REFERENCES staff (tenant_id, id)
);

CREATE TABLE mfa_recovery_codes (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  staff_id uuid NOT NULL,
  code_hash text NOT NULL,                      -- HMAC-SHA256, never the code
  used_at timestamptz,
  created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, staff_id) REFERENCES staff (tenant_id, id),
  UNIQUE (staff_id, code_hash)
);

CREATE TABLE auth_attempts (
  id bigserial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('password', 'mfa')),
  staff_id uuid,
  source text NOT NULL,
  at timestamptz NOT NULL
);
CREATE INDEX auth_attempts_staff_idx ON auth_attempts (kind, staff_id, at);
CREATE INDEX auth_attempts_source_idx ON auth_attempts (kind, source, at);

CREATE TABLE idempotency_keys (
  tenant_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  route text NOT NULL,
  key uuid NOT NULL,
  request_hash text NOT NULL,
  response_enc text NOT NULL,                   -- sealed: MFA responses carry one-time secrets
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, actor_id, route, key)
);

CREATE TABLE identity_audit_events (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid,
  actor_id uuid,
  subject_staff_id uuid,
  kind text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,    -- reason codes only; never secrets, codes or tokens
  at timestamptz NOT NULL
);
CREATE FUNCTION identity_audit_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'identity_audit_events is append-only'; END $$;
CREATE TRIGGER identity_audit_no_update BEFORE UPDATE OR DELETE ON identity_audit_events
  FOR EACH ROW EXECUTE FUNCTION identity_audit_immutable();

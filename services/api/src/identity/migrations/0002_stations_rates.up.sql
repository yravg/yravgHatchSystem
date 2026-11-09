-- T47 stations, immutable rate-rule versions, immutable quotes. Every table carries tenant_id and outlet_id.
-- All money columns are integer IDR (bigint). Fixture values only: production money policy (D01, D26) is not approved.
CREATE TABLE stations (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  name text NOT NULL,
  zone text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'retired')),
  reserved_by uuid,
  reserved_at timestamptz,
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, name),
  CHECK ((status = 'reserved') = (reserved_by IS NOT NULL))
);

-- A rule version is never updated or deleted; a change is a new version with a later effective_from.
CREATE TABLE rate_rule_versions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  version integer NOT NULL CHECK (version >= 1),
  effective_from timestamptz NOT NULL,
  rate_per_hour_idr bigint NOT NULL CHECK (rate_per_hour_idr >= 0),
  minimum_enabled boolean NOT NULL DEFAULT false,           -- D26: disabled by default
  minimum_amount_idr bigint,
  minimum_covered_seconds integer,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, outlet_id) REFERENCES outlets (tenant_id, id),
  UNIQUE (tenant_id, outlet_id, id),
  UNIQUE (tenant_id, outlet_id, version),
  CHECK (minimum_enabled = (minimum_amount_idr IS NOT NULL AND minimum_covered_seconds IS NOT NULL)),
  CHECK (minimum_amount_idr IS NULL OR minimum_amount_idr >= 0),
  CHECK (minimum_covered_seconds IS NULL OR minimum_covered_seconds >= 0)
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  outlet_id uuid NOT NULL,
  station_id uuid NOT NULL,
  rule_version_id uuid NOT NULL,
  segments jsonb NOT NULL,
  billable_seconds bigint NOT NULL CHECK (billable_seconds >= 0),
  exact_numerator text NOT NULL,
  exact_denominator text NOT NULL,
  amount_idr bigint NOT NULL CHECK (amount_idr >= 0),
  minimum_applied boolean NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, outlet_id, station_id) REFERENCES stations (tenant_id, outlet_id, id),
  FOREIGN KEY (tenant_id, outlet_id, rule_version_id) REFERENCES rate_rule_versions (tenant_id, outlet_id, id)
);

CREATE FUNCTION t47_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'restrict_violation';
END $$;
CREATE TRIGGER rate_rule_versions_append_only BEFORE UPDATE OR DELETE ON rate_rule_versions FOR EACH ROW EXECUTE FUNCTION t47_append_only();
CREATE TRIGGER quotes_append_only BEFORE UPDATE OR DELETE ON quotes FOR EACH ROW EXECUTE FUNCTION t47_append_only();

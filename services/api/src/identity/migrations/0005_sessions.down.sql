CREATE OR REPLACE FUNCTION t48_intent_guard() RETURNS trigger LANGUAGE plpgsql AS $$
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
DROP TABLE session_counters;
DROP TABLE session_outbox;
DROP TABLE session_station_holds;
DROP TABLE session_transfers;
DROP TABLE session_transfer_quotes;
DROP TABLE session_leases;
DROP TABLE session_commands;
DROP TABLE session_events;
DROP TABLE sessions;
DROP TABLE zone_rate_versions;
DROP FUNCTION t49_append_only();

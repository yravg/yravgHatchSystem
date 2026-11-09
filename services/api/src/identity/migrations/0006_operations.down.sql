-- Rolls T53 back. Restoring the T48 ledger kind CHECK fails (by design) if the journal already holds T53 kinds:
-- the journal is append-only and a posted order sale is never deleted to make a roll-back pass.
DROP TABLE ops_audit_events;
DROP TABLE day_closes;
DROP TABLE shift_close_policies;
DROP TABLE order_refunds;
DROP TABLE order_payments;
DROP TABLE shifts;
DROP FUNCTION t53_shift_guard();
DROP TABLE registers;
DROP TABLE stock_moves;
DROP TABLE order_lines;
DROP TABLE orders;
DROP TABLE recipe_lines;
DROP TABLE recipe_versions;
DROP TABLE menu_items;
DROP TABLE stock_balances;
DROP TABLE stock_items;
ALTER TABLE ledger_transactions DROP CONSTRAINT ledger_transactions_kind_check;
ALTER TABLE ledger_transactions ADD CONSTRAINT ledger_transactions_kind_check
  CHECK (kind IN ('manual', 'reversal', 'payment_settlement', 'payment_late_settlement'));
DROP FUNCTION t53_append_only();

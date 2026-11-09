// Contract: public surface of T53 (stock, orders, X/Z shift close). app.ts calls registerOperations once.
import type { FastifyInstance } from "fastify";
import type { IdentityDeps } from "../identity/service.ts";
import { registerInventory } from "../inventory/routes.ts";
import type { PaymentsConfig } from "../payments/config.ts";
import { registerShifts } from "../shifts/routes.ts";
import { registerOrders } from "./routes.ts";

export { OperationsError } from "./errors.ts";

export function registerOperations(app: FastifyInstance, deps: IdentityDeps, payments?: PaymentsConfig): void {
  registerInventory(app, deps);
  registerOrders(app, deps, payments);
  registerShifts(app, deps);
}

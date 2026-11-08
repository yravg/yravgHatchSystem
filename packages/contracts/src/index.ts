import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../schema/protocol.schema.json" with { type: "json" };
import type { DeviceAck, ErrorEnvelope, PaymentAmount, SessionCommand, SessionLease } from "../generated/typescript/protocol.ts";

export * from "../generated/typescript/protocol.ts";
export { canonicalJson } from "./canonical.ts";

const ajv = new Ajv2020({ strict: true, allErrors: false });
ajv.addSchema(schema);

function validator<T>(def: string): (v: unknown) => T {
  const run = ajv.getSchema(`${schema.$id}#/$defs/${def}`);
  if (!run) throw new Error(`no schema def ${def}`);
  return (v) => {
    if (run(v)) return v as T;
    const e = run.errors?.[0];
    const where = e?.params["missingProperty"] ?? e?.params["additionalProperty"] ?? e?.instancePath ?? "";
    throw new Error(`${def}: ${e?.message ?? "invalid"} (${String(where)})`);
  };
}

export const validateLease = validator<SessionLease>("SessionLease");
export const validateCommand = validator<SessionCommand>("SessionCommand");
export const validateAck = validator<DeviceAck>("DeviceAck");
export const validateError = validator<ErrorEnvelope>("ErrorEnvelope");
export const validatePayment = validator<PaymentAmount>("PaymentAmount");

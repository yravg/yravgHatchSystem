// Contract: dev/preview entry. Reads env, migrates up, builds the app with real identity deps and listens on HOST:PORT.
// Fails closed: HOST must be a specific address (never 0.0.0.0, ::, or empty). Payment routes exist only when every Midtrans
// sandbox value is present. Neither the connection string nor any key is ever logged. Run: node src/server.ts
import { randomBytes } from "node:crypto";
import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { buildApp } from "./app.ts";
import { parseKey } from "./identity/crypto.ts";
import { createPool, migrateUp } from "./identity/migrate.ts";
import { loadPaymentsConfig, type PaymentsConfig } from "./payments/config.ts";

export interface ServerConfig {
  host: string;
  port: number;
  databaseUrl: string;
  identityKey: Buffer;
  payments: PaymentsConfig | undefined;
}

type Env = Record<string, string | undefined>;
const MIDTRANS_KEYS = ["MIDTRANS_MERCHANT_ID", "MIDTRANS_SERVER_KEY", "MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT", "MIDTRANS_BASE_URL"] as const;

/** HATCH_IDENTITY_KEY (base64, 32 bytes) or HATCH_IDENTITY_KEY_FILE (created mode 600 on first start, so restarts keep the key). */
function identityKey(env: Env): Buffer {
  const file = env["HATCH_IDENTITY_KEY_FILE"];
  if (env["HATCH_IDENTITY_KEY"]) return parseKey(env["HATCH_IDENTITY_KEY"]);
  if (!file) throw new Error("set HATCH_IDENTITY_KEY or HATCH_IDENTITY_KEY_FILE");
  if (!existsSync(file)) {
    writeFileSync(file, randomBytes(32).toString("base64"), { mode: 0o600 });
    chmodSync(file, 0o600);
  }
  return parseKey(readFileSync(file, "utf8").trim());
}

export function loadServerConfig(env: Env): ServerConfig {
  const host = env["HOST"]?.trim() ?? "";
  if (!host || host === "0.0.0.0" || host === "::" || host === "[::]") throw new Error("HOST must be a specific address; empty, 0.0.0.0 and :: are refused");
  const port = Number(env["PORT"]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer 1-65535");
  const databaseUrl = env["DATABASE_URL"] ?? env["HATCH_PG_URL"];
  if (!databaseUrl) throw new Error("DATABASE_URL (or HATCH_PG_URL) is not set");
  const present = MIDTRANS_KEYS.filter((k) => env[k]);
  // all four or none: a partial set is a mistake, so loadPaymentsConfig runs and throws on it rather than silently turning payments off
  const payments = present.length === 0 ? undefined : loadPaymentsConfig(env);
  return { host, port, databaseUrl, identityKey: identityKey(env), payments };
}

async function main(): Promise<void> {
  const cfg = loadServerConfig(process.env);
  const pool = createPool(cfg.databaseUrl);
  const ran = await migrateUp(pool);
  const app = buildApp({
    identity: { pool, key: cfg.identityKey },
    ...(cfg.payments ? { payments: cfg.payments } : {}),
    logger: { level: "info", stream: process.stdout },
  });
  const stop = async () => { await app.close(); await pool.end(); process.exit(0); };
  process.once("SIGTERM", () => void stop());
  process.once("SIGINT", () => void stop());
  await app.listen({ host: cfg.host, port: cfg.port });
  app.log.info(`migrations applied: ${ran.length ? ran.join(", ") : "none new"}`);
  if (!cfg.payments) app.log.info("payments: OFF (no Midtrans sandbox settings; payment routes are not registered)");
  else app.log.info("payments: ON (Midtrans sandbox)");
}

if (import.meta.main) {
  main().catch((e: unknown) => {
    console.error("startup failed:", e instanceof Error ? e.message : "unknown error"); // message only; never the env or the URL
    process.exit(1);
  });
}

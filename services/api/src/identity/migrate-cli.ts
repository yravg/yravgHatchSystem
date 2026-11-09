// usage: node src/identity/migrate-cli.ts up|down   (connection from DATABASE_URL, never printed)
import { createPool, migrateDown, migrateUp } from "./migrate.ts";

const url = process.env["DATABASE_URL"] ?? process.env["HATCH_PG_URL"];
const cmd = process.argv[2];
if (!url || (cmd !== "up" && cmd !== "down")) {
  console.error("usage: DATABASE_URL=... node src/identity/migrate-cli.ts up|down");
  process.exit(2);
}
const pool = createPool(url);
try {
  const ran = cmd === "up" ? await migrateUp(pool) : await migrateDown(pool);
  console.log(`${cmd}: ${ran.length ? ran.join(", ") : "nothing to do"}`);
} finally {
  await pool.end();
}

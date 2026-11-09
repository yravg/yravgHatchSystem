// Contract: Ed25519 SessionLease signing (CONTRACTS section 5). The vector is verified here and, byte for byte, by the
// .NET edge tests, so the two runtimes agree on the canonical payload and on the signature.
import { generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { leasePayload, signLease, verifyLease, verifyText } from "../../packages/contracts/leases/index.ts";
import type { SessionLease } from "../../packages/contracts/src/index.ts";

const vector = JSON.parse(readFileSync(new URL("../../packages/contracts/leases/vector.json", import.meta.url), "utf8")) as {
  keyId: string; publicKey: string; canonicalPayload: string; lease: SessionLease;
};
const trust = { [vector.keyId]: vector.publicKey };
const inside = new Date("2026-11-08T14:10:00Z");

describe("lease signing", () => {
  it("the committed vector verifies against the pinned key", () => {
    expect(leasePayload(vector.lease)).toBe(vector.canonicalPayload);
    expect(vector.canonicalPayload).not.toContain("signature");
    expect(verifyLease(vector.lease, trust, inside, 7)).toBeNull();
  });
  it("a changed second, a changed device or a wrong key is BAD_SIGNATURE / UNKNOWN_SIGNER", () => {
    expect(verifyLease({ ...vector.lease, remainingSecondsAtIssue: 1801 }, trust, inside, 7)).toBe("BAD_SIGNATURE");
    expect(verifyLease({ ...vector.lease, deviceId: "44444444-4444-4444-8444-444444444445" }, trust, inside, 7)).toBe("BAD_SIGNATURE");
    expect(verifyLease(vector.lease, {}, inside, 7)).toBe("UNKNOWN_SIGNER");
    const other = generateKeyPairSync("ed25519");
    const raw = other.publicKey.export({ format: "der", type: "spki" }).subarray(-32).toString("base64url");
    expect(verifyLease(vector.lease, { [vector.keyId]: raw }, inside, 7)).toBe("BAD_SIGNATURE");
  });
  it("rejects a stale epoch, an expired lease and a lease from the future", () => {
    expect(verifyLease(vector.lease, trust, inside, 8)).toBe("STALE_EPOCH");
    expect(verifyLease(vector.lease, trust, new Date("2026-11-08T14:30:00Z"), 7)).toBe("EXPIRED");
    expect(verifyLease(vector.lease, trust, new Date("2026-11-08T13:59:59Z"), 7)).toBe("NOT_YET_VALID");
  });
  it("garbage signatures never throw", () => {
    expect(verifyLease({ ...vector.lease, signature: "!!" }, trust, inside, 7)).toBe("BAD_SIGNATURE");
    expect(verifyText("short", "x", "y")).toBe(false);
  });
  it("sign then verify round-trips with a runtime key", () => {
    const k = generateKeyPairSync("ed25519");
    const { signature: _s, ...unsigned } = vector.lease; void _s;
    const signed = signLease(unsigned, k.privateKey);
    const raw = k.publicKey.export({ format: "der", type: "spki" }).subarray(-32).toString("base64url");
    expect(verifyLease(signed, { [vector.keyId]: raw }, inside, 7)).toBeNull();
  });
});

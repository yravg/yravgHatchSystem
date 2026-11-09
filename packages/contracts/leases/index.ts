// Ed25519 SessionLease signing and verification (CONTRACTS section 5), pure node:crypto.
// The signed payload is the RFC 8785 canonical JSON of the lease WITHOUT its signature member; the signature is
// detached, base64url, 64 bytes. A device pins signers in a trust bundle (keyId -> raw public key); the keyId inside a
// payload alone is never trusted. Private keys never live here: callers pass a KeyObject they created at runtime.
import { createPublicKey, sign, verify, type KeyObject } from "node:crypto";
import { canonicalJson } from "../src/canonical.ts";
import type { SessionLease } from "../generated/typescript/protocol.ts";

const SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

export const publicKeyFromRaw = (rawB64u: string): KeyObject => {
  const raw = Buffer.from(rawB64u, "base64url");
  if (raw.length !== 32) throw new Error("ed25519 public key must be 32 bytes");
  return createPublicKey({ key: Buffer.concat([SPKI_PREFIX, raw]), format: "der", type: "spki" });
};

export const leasePayload = (lease: Omit<SessionLease, "signature"> | SessionLease): string => {
  const { signature: _omit, ...rest } = lease as SessionLease;
  void _omit;
  return canonicalJson(rest);
};

export const signLease = (lease: Omit<SessionLease, "signature">, priv: KeyObject): SessionLease => ({
  ...lease,
  signature: sign(null, Buffer.from(leasePayload(lease)), priv).toString("base64url"),
});

export type TrustBundle = Readonly<Record<string, string>>; // keyId -> raw base64url public key

export type LeaseRejection = "UNKNOWN_SIGNER" | "BAD_SIGNATURE" | "STALE_EPOCH" | "EXPIRED" | "NOT_YET_VALID";

/** Returns null when the lease is acceptable, otherwise the reason. Never throws on malformed signatures. */
export function verifyLease(lease: SessionLease, trust: TrustBundle, now: Date, currentEpoch: number): LeaseRejection | null {
  const pinned = trust[lease.keyId];
  if (pinned === undefined) return "UNKNOWN_SIGNER";
  let ok = false;
  try {
    ok = verify(null, Buffer.from(leasePayload(lease)), publicKeyFromRaw(pinned), Buffer.from(lease.signature, "base64url"));
  } catch {
    ok = false;
  }
  if (!ok) return "BAD_SIGNATURE";
  if (lease.authorityEpoch < currentEpoch) return "STALE_EPOCH";
  if (now.getTime() >= Date.parse(lease.notAfter)) return "EXPIRED";
  if (now.getTime() < Date.parse(lease.issuedAt)) return "NOT_YET_VALID";
  return null;
}

/** Detached verification of arbitrary text (pairing proof, request signatures). */
export function verifyText(rawPublicKeyB64u: string, text: string, sigB64u: string): boolean {
  try {
    return verify(null, Buffer.from(text), publicKeyFromRaw(rawPublicKeyB64u), Buffer.from(sigB64u, "base64url"));
  } catch {
    return false;
  }
}

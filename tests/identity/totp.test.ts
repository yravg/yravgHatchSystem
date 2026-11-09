import { describe, expect, it } from "vitest";
import { open, seal, verifyPassword, hashPassword } from "../../services/api/src/identity/crypto.ts";
import { base32Decode, base32Encode, matchTotp, totpCode } from "../../services/api/src/identity/totp.ts";

// FIXTURE: the RFC 6238 appendix B secret, not a credential.
const SECRET = Buffer.from("12345678901234567890");

describe("TOTP (RFC 6238, fixture secret)", () => {
  it("matches the RFC 6238 SHA1 vectors truncated to 6 digits", () => {
    const vectors: [number, string][] = [[59, "287082"], [1111111109, "081804"], [1111111111, "050471"], [1234567890, "005924"], [2000000000, "279037"]];
    for (const [seconds, want] of vectors) expect(totpCode(SECRET, Math.floor(seconds / 30))).toBe(want);
  });

  it("accepts one step of skew either side and rejects two", () => {
    const now = new Date(Date.UTC(2026, 10, 9, 3, 0, 15));
    const step = Math.floor(now.getTime() / 30000);
    expect(matchTotp(SECRET, totpCode(SECRET, step), now)).toBe(step);
    expect(matchTotp(SECRET, totpCode(SECRET, step - 1), now)).toBe(step - 1);
    expect(matchTotp(SECRET, totpCode(SECRET, step + 1), now)).toBe(step + 1);
    expect(matchTotp(SECRET, totpCode(SECRET, step - 2), now)).toBeUndefined();
    expect(matchTotp(SECRET, totpCode(SECRET, step + 2), now)).toBeUndefined();
  });

  it("rejects codes that are not exactly 6 digits", () => {
    const now = new Date(Date.UTC(2026, 10, 9, 3, 0, 0));
    for (const bad of ["", "12345", "1234567", "12345a", " 123456"]) expect(matchTotp(SECRET, bad, now)).toBeUndefined();
  });

  it("round-trips base32", () => {
    expect(base32Encode(SECRET)).toBe("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
    expect(base32Decode(base32Encode(SECRET)).equals(SECRET)).toBe(true);
  });
});

describe("sealing and password hashing", () => {
  const key = Buffer.alloc(32, 9); // FIXTURE key
  it("a sealed value opens only with its own key and owner binding", () => {
    const sealed = seal(key, "payload", "mfa:staff-1");
    expect(sealed).not.toContain("payload");
    expect(open(key, sealed, "mfa:staff-1")).toBe("payload");
    expect(() => open(key, sealed, "mfa:staff-2")).toThrow();
    expect(() => open(Buffer.alloc(32, 1), sealed, "mfa:staff-1")).toThrow();
  });

  it("a tampered sealed value does not open", () => {
    const parts = seal(key, "payload", "a").split(".");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(() => open(key, parts.join("."), "a")).toThrow();
  });

  it("password hashes verify and are salted", async () => {
    const a = await hashPassword("fixture-pw");
    const b = await hashPassword("fixture-pw");
    expect(a).not.toBe(b);
    expect(await verifyPassword("fixture-pw", a)).toBe(true);
    expect(await verifyPassword("other", a)).toBe(false);
  });
});

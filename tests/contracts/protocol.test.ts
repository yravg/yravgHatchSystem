import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  canonicalJson,
  validateAck,
  validateCommand,
  validateError,
  validateLease,
  validatePayment,
} from "@yravg/contracts";

const root = join(import.meta.dirname, "..", "..", "packages", "contracts", "fixtures");
const load = (name: string): unknown => JSON.parse(readFileSync(join(root, name), "utf8"));
const golden = (name: string): string => readFileSync(join(root, "canonical", name), "utf8").trim();

describe("canonical JSON (RFC 8785 subset)", () => {
  it("sorts keys by UTF-16 code unit at every depth", () => {
    expect(canonicalJson({ b: 1, a: [true, null, "x"], B: { z: 0, y: 1 } })).toBe(
      '{"B":{"y":1,"z":0},"a":[true,null,"x"],"b":1}',
    );
  });
  it("escapes only quote, backslash and control characters; keeps non-ASCII raw", () => {
    expect(canonicalJson({ k: 'a"b\\c\u0007é' })).toBe('{"k":"a\\"b\\\\c\\u0007é"}');
  });
  it("omits undefined members and rejects non-integer or unsafe numbers", () => {
    expect(canonicalJson({ a: undefined, b: 2 })).toBe('{"b":2}');
    expect(() => canonicalJson({ a: 1.5 })).toThrow(/integer/);
    expect(() => canonicalJson({ a: 2 ** 53 })).toThrow(/integer/);
  });
});

describe("protocol fixtures: schema-valid and canonical-identical to hand-computed golden", () => {
  const cases: [string, (v: unknown) => unknown][] = [
    ["lease.json", validateLease],
    ["command.json", validateCommand],
    ["ack.json", validateAck],
    ["error.json", validateError],
    ["payment.json", validatePayment],
  ];
  for (const [name, validate] of cases) {
    it(`${name} canonical form equals the golden`, () => {
      const typed = validate(load(name));
      expect(canonicalJson(typed)).toBe(golden(name));
    });
  }
  it("every fixture file has a golden and a validator case", () => {
    expect(readdirSync(root).filter((f) => f.endsWith(".json")).sort()).toEqual(
      cases.map(([n]) => n).sort(),
    );
    expect(readdirSync(join(root, "canonical")).sort()).toEqual(cases.map(([n]) => n).sort());
  });
  it("keeps IDR above 2^53 exact because money is a decimal string", () => {
    const p = validatePayment(load("payment.json"));
    expect(p.amountIDR).toBe("9007199254740993");
  });
});

describe("schema rejects invalid payloads (no silent acceptance)", () => {
  const lease = load("lease.json") as Record<string, unknown>;
  it("missing required field", () => {
    const { signature: _s, ...rest } = lease;
    expect(() => validateLease(rest)).toThrow(/signature/);
  });
  it("unknown member (strict, so Kotlin/.NET parsers behave the same)", () => {
    expect(() => validateLease({ ...lease, extra: 1 })).toThrow(/additional/i);
  });
  it("bad enum value", () => {
    expect(() => validateLease({ ...lease, mode: "UNLIMITED" })).toThrow(/mode/);
  });
  it("money must be a decimal string: number, negative, fractional, leading zero all fail", () => {
    for (const bad of [18000, "-5", "12.5", "007", "1e3", ""]) {
      expect(() => validatePayment({ amountIDR: bad, currency: "IDR" })).toThrow();
    }
  });
  it("timestamps must be UTC with Z", () => {
    expect(() => validateLease({ ...lease, issuedAt: "2026-11-08T14:00:00+07:00" })).toThrow();
  });
});

import { createHmac, timingSafeEqual } from "node:crypto";

// RFC 6238 TOTP: HMAC-SHA1, 30 s step, 6 digits. The window is deliberately narrow (one step either side).
export const TOTP_STEP_SECONDS = 30;
export const TOTP_DIGITS = 6;
export const TOTP_SKEW_STEPS = 1;

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Buffer {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of text) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error("invalid base32");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export const stepAt = (now: Date): number => Math.floor(now.getTime() / 1000 / TOTP_STEP_SECONDS);

export function totpCode(secret: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const mac = createHmac("sha1", secret).update(counter).digest();
  const offset = (mac[mac.length - 1] ?? 0) & 15;
  const bin = mac.readUInt32BE(offset) & 0x7fffffff;
  return String(bin % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

/** Returns the matching step inside the skew window, or undefined. Compares every candidate in constant time. */
export function matchTotp(secret: Buffer, code: string, now: Date): number | undefined {
  if (!/^[0-9]{6}$/.test(code)) return undefined;
  const given = Buffer.from(code);
  const current = stepAt(now);
  let hit: number | undefined;
  for (let d = -TOTP_SKEW_STEPS; d <= TOTP_SKEW_STEPS; d++) {
    const step = current + d;
    if (step > 0 && timingSafeEqual(Buffer.from(totpCode(secret, step)), given)) hit = step;
  }
  return hit;
}

export const otpauthUri = (secretBase32: string, account: string, issuer = "yravg HatchSystem"): string =>
  `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secretBase32}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_STEP_SECONDS}`;

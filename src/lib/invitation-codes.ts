/**
 * Generator kode invitasi sisi klien + hashing.
 *
 * Kode dihasilkan dengan crypto.getRandomValues (CSPRNG), alfabet tanpa
 * karakter ambigu (tanpa I, L, O, 0, 1). Plaintext ditampilkan sekali ke
 * Owner, lalu hanya sha256(code) yang dikirim ke database. DB tidak pernah
 * menyimpan nilai plaintext.
 */

// Alfabet aman: tanpa I, L, O, 0, 1 (mudah tertukar).
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LEN = 16; // 16 char → ~80 bit entropy, cukup untuk 7 hari.
const GROUP = 4;

/** Hasilkan kode plaintext format XXXX-XXXX-XXXX-XXXX. */
export function generateInvitationCode(): string {
  const bytes = new Uint8Array(CODE_LEN);
  crypto.getRandomValues(bytes);
  const chars: string[] = [];
  for (let i = 0; i < CODE_LEN; i++) {
    chars.push(ALPHABET[bytes[i]! % ALPHABET.length]!);
  }
  // sisip dash tiap GROUP char
  return chars
    .map((c, i) => (i > 0 && i % GROUP === 0 ? `-${c}` : c))
    .join("");
}

/** Awalan 4 char pertama untuk identifikasi Owner di tabel. */
export function codePrefix(displayCode: string): string {
  return displayCode.replace(/-/g, "").slice(0, 4);
}

/** sha256 hex dari nilai kode (dash dihapus dulu). Tidak pakai salt. */
export async function hashCode(displayCode: string): Promise<string> {
  const normalized = displayCode.replace(/-/g, "").toUpperCase();
  const enc = new TextEncoder().encode(normalized);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Normalisasi input user: uppercase, hapus dash/spasi. */
export function normalizeCodeInput(raw: string): string {
  return raw.replace(/[-\s]/g, "").toUpperCase();
}

/** Tampilkan kode normalized dengan dash untuk input box preview. */
export function displayNormalized(normalized: string): string {
  return normalized
    .split("")
    .map((c, i) => (i > 0 && i % GROUP === 0 ? `-${c}` : c))
    .join("");
}

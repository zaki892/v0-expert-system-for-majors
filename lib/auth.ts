// lib/auth.ts

import crypto from "crypto"

/**
 * Hash password dengan SHA-256
 * @param password - plain text password
 * @returns string - hasil hash hex
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

/**
 * Verifikasi password dengan membandingkan hash SHA-256
 * @param password - plain text password dari user
 * @param hash - hash dari database
 * @returns boolean - true kalau cocok
 */
export function verifyPassword(password: string, hash: string): boolean {
  const hashedInput = hashPassword(password)
  return hashedInput === hash
}

/**
 * Generate token acak 64 karakter hex (misalnya untuk session, reset password, dsb)
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

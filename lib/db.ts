import { neon } from "@neondatabase/serverless"

const databaseUrl =
  process.env.NEON_DATABASE_URL || // pakai ini aja untuk konsistensi
  process.env.NEON_POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL

if (!databaseUrl) {
  console.error("[v0] Database URL not found! Available env vars:", {
    NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
    NEON_POSTGRES_URL: !!process.env.NEON_POSTGRES_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
  })
}

const sql = neon(databaseUrl || "")

/**
 * Fungsi universal untuk menjalankan query Neon
 * @param text - SQL query
 * @param params - parameter query (opsional)
 */
export async function query(text: string, params?: any[]) {
  try {
    console.log("[v0] Executing query:", text.substring(0, 100))

    // Gunakan cara panggil sesuai dengan library neon
    const result = params ? await sql(text, params) : await sql(text)

    console.log("[v0] Query successful, rows returned:", result.length)
    return result
  } catch (error: any) {
    console.error("[v0] Database error:", error.message)
    console.error("[v0] Error details:", error)
    throw error
  }
}

export { sql }

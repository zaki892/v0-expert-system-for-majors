import { neon } from "@neondatabase/serverless"

const databaseUrl =
  process.env.NEON_NEON_DATABASE_URL ||
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

export async function query(text: string, params?: any[]) {
  try {
    console.log("[v0] Executing query:", text.substring(0, 100))
    const result = await sql.query(text, params)
    console.log("[v0] Query successful, rows returned:", result.length)
    return result
  } catch (error: any) {
    console.error("[v0] Database error:", error.message)
    console.error("[v0] Error details:", error)
    throw error
  }
}

export { sql }

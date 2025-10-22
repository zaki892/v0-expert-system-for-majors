import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Health check started")

    console.log("[v0] Checking environment variables...")
    const hasDbUrl = !!(
      process.env.NEON_NEON_DATABASE_URL ||
      process.env.NEON_POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL
    )
    console.log("[v0] Database URL available:", hasDbUrl)

    const connectionTest = await sql.query("SELECT 1 as health")
    console.log("[v0] Connection test passed")

    // Check if users table exists
    const tableCheck = await sql.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists`,
    )
    console.log("[v0] Table check result:", tableCheck)

    const tableExists = tableCheck[0]?.exists || false

    if (!tableExists) {
      return NextResponse.json(
        {
          status: "warning",
          message: "Database connected but tables not initialized",
          hint: "Jalankan script SQL di folder /scripts: 01-init-database.sql terlebih dahulu",
          details: {
            connection: "ok",
            tables_initialized: false,
          },
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "Database siap digunakan",
      timestamp: new Date().toISOString(),
      details: {
        connection: "ok",
        tables_initialized: true,
      },
    })
  } catch (error: any) {
    console.error("[v0] Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Database connection failed",
        hint: "Pastikan NEON_DATABASE_URL atau NEON_POSTGRES_URL sudah dikonfigurasi di environment variables",
        error_details: error.message,
      },
      { status: 500 },
    )
  }
}

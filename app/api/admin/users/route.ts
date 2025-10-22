import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

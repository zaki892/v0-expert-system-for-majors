import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const criteria = await query("SELECT * FROM criteria ORDER BY name")
    return NextResponse.json(criteria)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch criteria" }, { status: 500 })
  }
}

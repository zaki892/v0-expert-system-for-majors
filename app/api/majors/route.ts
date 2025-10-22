import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const majors = await query("SELECT * FROM majors ORDER BY name")
    return NextResponse.json(majors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch majors" }, { status: 500 })
  }
}

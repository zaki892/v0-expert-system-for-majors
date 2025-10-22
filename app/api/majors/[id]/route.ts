import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const major = await query("SELECT * FROM majors WHERE id = $1", [Number.parseInt(params.id)])

    if (major.length === 0) {
      return NextResponse.json({ error: "Major not found" }, { status: 404 })
    }

    return NextResponse.json(major[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch major" }, { status: 500 })
  }
}

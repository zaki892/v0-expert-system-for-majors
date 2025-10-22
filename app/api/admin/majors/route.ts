import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const majors = await query("SELECT * FROM majors ORDER BY name")
    return NextResponse.json(majors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch majors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])
    if (user.length === 0 || user[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, description, requirements, career_prospects } = await request.json()

    const result = await query(
      "INSERT INTO majors (name, description, requirements, career_prospects) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, requirements, career_prospects],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create major" }, { status: 500 })
  }
}

import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      "UPDATE majors SET name = $1, description = $2, requirements = $3, career_prospects = $4 WHERE id = $5 RETURNING *",
      [name, description, requirements, career_prospects, Number.parseInt(params.id)],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Major not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update major" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])
    if (user.length === 0 || user[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await query("DELETE FROM majors WHERE id = $1", [Number.parseInt(params.id)])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete major" }, { status: 500 })
  }
}

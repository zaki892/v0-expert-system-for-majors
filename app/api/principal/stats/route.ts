import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])

    if (user.length === 0 || user[0].role !== "principal") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Total students
    const totalStudents = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'")

    // Total tests
    const totalTests = await query("SELECT COUNT(*) as count FROM test_results")

    // Total majors
    const totalMajors = await query("SELECT COUNT(*) as count FROM majors")

    // Top majors
    const topMajors = await query(`
      SELECT m.name, COUNT(r.id) as count
      FROM recommendations r
      JOIN majors m ON r.major_id = m.id
      WHERE r.rank = 1
      GROUP BY m.id, m.name
      ORDER BY count DESC
      LIMIT 5
    `)

    // Class distribution
    const classDistribution = await query(`
      SELECT c.name, COUNT(s.id) as count
      FROM classes c
      LEFT JOIN students s ON c.id = s.class_id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `)

    return NextResponse.json({
      totalStudents: totalStudents[0]?.count || 0,
      totalTests: totalTests[0]?.count || 0,
      totalMajors: totalMajors[0]?.count || 0,
      topMajors: topMajors || [],
      classDistribution: classDistribution || [],
    })
  } catch (error) {
    console.error("Error fetching principal stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

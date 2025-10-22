import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])

    if (user.length === 0 || (user[0].role !== "teacher" && user[0].role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Total students
    const totalStudents = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'")

    // Total classes
    const totalClasses = await query("SELECT COUNT(*) as count FROM classes")

    // Recent tests
    const recentTests = await query(`
      SELECT 
        tr.id,
        u.name as studentName,
        tr.completed_at as testDate,
        m.name as topMajor
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      LEFT JOIN recommendations r ON tr.id = r.test_result_id AND r.rank = 1
      LEFT JOIN majors m ON r.major_id = m.id
      ORDER BY tr.completed_at DESC
      LIMIT 10
    `)

    return NextResponse.json({
      totalStudents: totalStudents[0]?.count || 0,
      totalClasses: totalClasses[0]?.count || 0,
      recentTests: recentTests || [],
    })
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

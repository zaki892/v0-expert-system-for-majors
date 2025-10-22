import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])
    if (user.length === 0 || (user[0].role !== "admin" && user[0].role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get statistics
    const totalStudents = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'")
    const totalTests = await query("SELECT COUNT(*) as count FROM test_results")
    const totalMajors = await query("SELECT COUNT(*) as count FROM majors")

    // Get top recommended majors
    const topMajors = await query(`
      SELECT 
        m.id,
        m.name,
        COUNT(r.id) as recommendation_count,
        AVG(r.score) as avg_score
      FROM majors m
      LEFT JOIN recommendations r ON m.id = r.major_id
      GROUP BY m.id, m.name
      ORDER BY recommendation_count DESC
      LIMIT 5
    `)

    // Get recent test results
    const recentTests = await query(`
      SELECT 
        tr.id,
        u.name as student_name,
        tr.completed_at,
        m.name as top_major,
        r.score
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      LEFT JOIN recommendations r ON tr.id = r.test_result_id AND r.rank = 1
      LEFT JOIN majors m ON r.major_id = m.id
      ORDER BY tr.completed_at DESC
      LIMIT 10
    `)

    return NextResponse.json({
      totalStudents: totalStudents[0].count,
      totalTests: totalTests[0].count,
      totalMajors: totalMajors[0].count,
      topMajors,
      recentTests,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}

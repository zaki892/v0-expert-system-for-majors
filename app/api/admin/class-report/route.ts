import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query("SELECT role FROM users WHERE id = $1", [Number.parseInt(userId)])
    if (user.length === 0 || (user[0].role !== "admin" && user[0].role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all students with their top recommendation
    const classReport = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(tr.id) as test_count,
        MAX(tr.completed_at) as last_test_date,
        m.name as top_major,
        r.score as top_score
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      LEFT JOIN recommendations r ON tr.id = r.test_result_id AND r.rank = 1
      LEFT JOIN majors m ON r.major_id = m.id
      WHERE u.role = 'student'
      GROUP BY u.id, u.name, u.email, m.name, r.score
      ORDER BY u.name
    `)

    return NextResponse.json(classReport)
  } catch (error) {
    console.error("Error fetching class report:", error)
    return NextResponse.json({ error: "Failed to fetch class report" }, { status: 500 })
  }
}

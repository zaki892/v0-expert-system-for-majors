import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await query(
      `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.created_at,
        u.nisn,
        u.nis,
        u.gender,
        u.date_of_birth,
        c.name as class_name,
        c.grade_level,
        c.major_track,
        s.name as school_name,
        s.npsn
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      LEFT JOIN schools s ON c.school_id = s.id
      WHERE u.id = $1
      `,
      [Number.parseInt(userId)],
    )

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get test statistics
    const stats = await query(
      `
      SELECT 
        COUNT(*) as total_tests,
        MAX(completed_at) as last_test_date
      FROM test_results
      WHERE user_id = $1
    `,
      [Number.parseInt(userId)],
    )

    return NextResponse.json({
      ...user[0],
      testStats: stats[0],
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const schoolId = request.nextUrl.searchParams.get("schoolId")
    const academicYearId = request.nextUrl.searchParams.get("academicYearId")

    if (!schoolId) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 })
    }

    let query = `
      SELECT c.*, ay.year_start, ay.year_end, u.name as homeroom_teacher_name,
             COUNT(DISTINCT us.id) as student_count
      FROM classes c
      JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN users u ON c.homeroom_teacher_id = u.id
      LEFT JOIN users us ON c.id = us.class_id
      WHERE c.school_id = $1
    `

    const params: any[] = [Number.parseInt(schoolId)]

    if (academicYearId) {
      query += ` AND c.academic_year_id = $2`
      params.push(Number.parseInt(academicYearId))
    }

    query += ` GROUP BY c.id, ay.id, u.id ORDER BY c.name ASC`

    const result = await sql(query, params)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

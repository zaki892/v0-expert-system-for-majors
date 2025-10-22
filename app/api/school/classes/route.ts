import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const schoolId = request.nextUrl.searchParams.get("schoolId")
    const academicYearId = request.nextUrl.searchParams.get("academicYearId")

    if (!schoolId) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 })
    }

    // Base query
    let sqlText = `
      SELECT 
        c.*, 
        ay.year_start, 
        ay.year_end, 
        u.name AS homeroom_teacher_name,
        COUNT(DISTINCT us.id) AS student_count
      FROM classes c
      JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN users u ON c.homeroom_teacher_id = u.id
      LEFT JOIN users us ON c.id = us.class_id
      WHERE c.school_id = $1
    `

    const params: any[] = [Number.parseInt(schoolId)]

    // Tambahkan filter jika ada academicYearId
    if (academicYearId) {
      sqlText += ` AND c.academic_year_id = $2`
      params.push(Number.parseInt(academicYearId))
    }

    sqlText += `
      GROUP BY c.id, ay.id, u.id
      ORDER BY c.name ASC
    `

    // Jalankan query
    const result = await query(sqlText, params)

    // Result dari Neon bisa berbentuk array atau object { rows: [] }
    const data = Array.isArray(result) ? result : result.rows || []

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const schoolId = request.nextUrl.searchParams.get("schoolId")
    const academicYearId = request.nextUrl.searchParams.get("academicYearId")

    // Validasi parameter
    if (!schoolId) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 })
    }

    // Query dasar
    let result
    if (academicYearId) {
      result = await sql`
        SELECT 
          c.id, 
          c.name, 
          ay.year_start, 
          ay.year_end, 
          u.name AS homeroom_teacher_name,
          COUNT(DISTINCT us.id) AS student_count
        FROM classes c
        JOIN academic_years ay ON c.academic_year_id = ay.id
        LEFT JOIN users u ON c.homeroom_teacher_id = u.id
        LEFT JOIN users us ON c.id = us.class_id
        WHERE c.school_id = ${Number(schoolId)} 
          AND c.academic_year_id = ${Number(academicYearId)}
        GROUP BY c.id, ay.id, u.id
        ORDER BY c.name ASC
      `
    } else {
      result = await sql`
        SELECT 
          c.id, 
          c.name, 
          ay.year_start, 
          ay.year_end, 
          u.name AS homeroom_teacher_name,
          COUNT(DISTINCT us.id) AS student_count
        FROM classes c
        JOIN academic_years ay ON c.academic_year_id = ay.id
        LEFT JOIN users u ON c.homeroom_teacher_id = u.id
        LEFT JOIN users us ON c.id = us.class_id
        WHERE c.school_id = ${Number(schoolId)}
        GROUP BY c.id, ay.id, u.id
        ORDER BY c.name ASC
      `
    }

    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("Error fetching classes:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

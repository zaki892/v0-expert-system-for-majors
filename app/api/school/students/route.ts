import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const classId = request.nextUrl.searchParams.get("classId")
    const nisn = request.nextUrl.searchParams.get("nisn")

    if (nisn) {
      // Get student by NISN
      const result = await sql`
        SELECT u.*, c.name as class_name, s.name as school_name, 
               json_agg(json_build_object('guardian_type', g.guardian_type, 'name', g.name, 'phone', g.phone)) as guardians
        FROM users u
        LEFT JOIN classes c ON u.class_id = c.id
        LEFT JOIN schools s ON c.school_id = s.id
        LEFT JOIN guardians g ON u.id = g.student_id
        WHERE u.nisn = ${nisn}
        GROUP BY u.id, c.id, s.id
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    }

    if (classId) {
      // Get all students in a class
      const result = await sql`
        SELECT u.id, u.name, u.nisn, u.nis, u.email, u.gender, u.date_of_birth,
               sar.gpa, sar.rank
        FROM users u
        LEFT JOIN student_academic_records sar ON u.id = sar.student_id
        WHERE u.class_id = ${Number.parseInt(classId)}
        ORDER BY u.name ASC
      `

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

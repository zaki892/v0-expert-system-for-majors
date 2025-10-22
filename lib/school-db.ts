import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function getSchoolById(schoolId: number) {
  const result = await sql`
    SELECT * FROM schools WHERE id = ${schoolId}
  `
  return result[0]
}

export async function getClassesBySchool(schoolId: number, academicYearId?: number) {
  let query = sql`
    SELECT c.*, ay.year_start, ay.year_end, u.name as homeroom_teacher_name
    FROM classes c
    JOIN academic_years ay ON c.academic_year_id = ay.id
    LEFT JOIN users u ON c.homeroom_teacher_id = u.id
    WHERE c.school_id = ${schoolId}
  `

  if (academicYearId) {
    query = sql`
      SELECT c.*, ay.year_start, ay.year_end, u.name as homeroom_teacher_name
      FROM classes c
      JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN users u ON c.homeroom_teacher_id = u.id
      WHERE c.school_id = ${schoolId} AND c.academic_year_id = ${academicYearId}
    `
  }

  return query
}

export async function getStudentByNISN(nisn: string) {
  const result = await sql`
    SELECT u.*, c.name as class_name, s.name as school_name
    FROM users u
    LEFT JOIN classes c ON u.class_id = c.id
    LEFT JOIN schools s ON c.school_id = s.id
    WHERE u.nisn = ${nisn}
  `
  return result[0]
}

export async function getStudentGuardians(studentId: number) {
  return await sql`
    SELECT * FROM guardians WHERE student_id = ${studentId}
  `
}

export async function getStudentAcademicRecord(studentId: number, academicYearId: number) {
  const result = await sql`
    SELECT * FROM student_academic_records 
    WHERE student_id = ${studentId} AND academic_year_id = ${academicYearId}
  `
  return result[0]
}

export async function getClassStudents(classId: number) {
  return await sql`
    SELECT u.*, c.name as class_name, sar.gpa, sar.rank
    FROM users u
    JOIN classes c ON u.class_id = c.id
    LEFT JOIN student_academic_records sar ON u.id = sar.student_id
    WHERE u.class_id = ${classId}
    ORDER BY u.name ASC
  `
}

export async function getActiveAcademicYear(schoolId: number) {
  const result = await sql`
    SELECT * FROM academic_years 
    WHERE school_id = ${schoolId} AND is_active = TRUE
  `
  return result[0]
}

export async function getTestResultsByClass(classId: number, academicYearId: number) {
  return await sql`
    SELECT tr.*, u.name, u.nisn, u.nis, c.name as class_name,
           json_agg(json_build_object('major_id', r.major_id, 'major_name', m.name, 'score', r.score, 'rank', r.rank)) as recommendations
    FROM test_results tr
    JOIN users u ON tr.user_id = u.id
    JOIN classes c ON tr.class_id = c.id
    LEFT JOIN recommendations r ON tr.id = r.test_result_id
    LEFT JOIN majors m ON r.major_id = m.id
    WHERE tr.class_id = ${classId} AND tr.academic_year_id = ${academicYearId}
    GROUP BY tr.id, u.id, c.id
    ORDER BY u.name ASC
  `
}

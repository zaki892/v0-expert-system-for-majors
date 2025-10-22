import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Ambil user ID dari header
    const fetchStats = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const response = await fetch("/api/teacher/stats", {
      headers: { "x-user-id": user.id?.toString() },
    })

    if (!response.ok) {
      console.error("Stats fetch failed:", await response.text())
      return
    }

    const data = await response.json()
    setStats(data)
  } catch (error) {
    console.error("Error fetching stats:", error)
  } finally {
    setLoading(false)
  }
}


    // Cek apakah user adalah teacher atau admin
    const user = await query("SELECT role FROM users WHERE id = $1", [Number(userId)])

    if (user.length === 0 || (user[0].role !== "teacher" && user[0].role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Hitung total siswa
    const totalStudents = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'")

    // Hitung total kelas
    const totalClasses = await query("SELECT COUNT(*) as count FROM classes")

    // Ambil 10 hasil tes terbaru
    const recentTests = await query(`
      SELECT 
        tr.id,
        u.name AS studentName,
        tr.completed_at AS testDate,
        m.name AS topMajor
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      LEFT JOIN recommendations r ON tr.id = r.test_result_id AND r.rank = 1
      LEFT JOIN majors m ON r.major_id = m.id
      ORDER BY tr.completed_at DESC
      LIMIT 10
    `)

    // Pastikan hasilnya dikembalikan dalam format angka yang valid
    return NextResponse.json({
      totalStudents: Number(totalStudents[0]?.count) || 0,
      totalClasses: Number(totalClasses[0]?.count) || 0,
      recentTests: recentTests || [],
    })
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

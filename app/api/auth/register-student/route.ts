import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, nisn, nis, classId, role } = await request.json()

    if (!email || !password || !name || !nisn || !nis || !classId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Register user
    const result = await query(
      "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
      [email, hashedPassword, name, role || "student"],
    )

    const userId = result[0].id

    // Add student details
    await query("INSERT INTO students (user_id, nisn, nis, class_id) VALUES ($1, $2, $3, $4)", [
      userId,
      nisn,
      nis,
      classId,
    ])

    return NextResponse.json(
      {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
        role: result[0].role,
        message: "Siswa berhasil didaftarkan",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 500 })
  }
}

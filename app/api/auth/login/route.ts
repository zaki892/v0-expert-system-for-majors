import { query } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // Ambil semua data user, termasuk password
    const users = await query("SELECT id, email, name, role, password FROM users WHERE email = $1", [email])

    if (users.length === 0) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const user = users[0]

    // Verifikasi password
    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Cek role
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { error: `Hanya pengguna dengan role ${role} yang dapat login di halaman ini` },
        { status: 403 },
      )
    }

    // Login sukses
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    response.cookies.set("user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login gagal" }, { status: 500 })
  }
}

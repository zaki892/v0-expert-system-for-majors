import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      console.log("[v0] Registration validation failed:", { email: !!email, password: !!password, name: !!name })
      return NextResponse.json({ error: "Email, password, dan nama harus diisi" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)

    try {
      console.log("[v0] Attempting to insert user:", email)
      const result = await query(
        "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
        [email, hashedPassword, name, role || "student"],
      )

      console.log("[v0] User registered successfully:", result[0]?.id)
      return NextResponse.json(result[0], { status: 201 })
    } catch (dbError: any) {
      console.error("[v0] Database error during registration:", dbError.message)
      console.error("[v0] Full error:", dbError)

      if (dbError.message?.includes("duplicate") || dbError.message?.includes("UNIQUE")) {
        return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
      }

      if (dbError.message?.includes("relation") || dbError.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Tabel database tidak ditemukan. Jalankan script 01-init-database.sql terlebih dahulu.",
          },
          { status: 500 },
        )
      }

      throw dbError
    }
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      {
        error: error.message || "Registrasi gagal. Silakan coba lagi.",
      },
      { status: 500 },
    )
  }
}

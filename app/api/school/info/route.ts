import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the first active school (or any school if none are active)
    const schools = await query(`SELECT id, name, npsn, city, principal_name FROM schools LIMIT 1`)

    if (schools.length === 0) {
      return NextResponse.json({
        name: "Sekolah Menengah Atas",
        npsn: "20123456",
        city: "Jakarta",
        principal_name: "Kepala Sekolah",
      })
    }

    return NextResponse.json(schools[0])
  } catch (error) {
    console.error("Error fetching school info:", error)
    return NextResponse.json({
      name: "Sekolah Menengah Atas",
      npsn: "20123456",
      city: "Jakarta",
      principal_name: "Kepala Sekolah",
    })
  }
}

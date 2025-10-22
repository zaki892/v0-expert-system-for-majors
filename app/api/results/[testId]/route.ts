import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { testId: string } }) {
  try {
    const recommendations = await query(
      `
      SELECT 
        r.id,
        r.major_id,
        r.score,
        r.rank,
        m.name as major_name,
        m.description,
        m.career_prospects
      FROM recommendations r
      JOIN majors m ON r.major_id = m.id
      WHERE r.test_result_id = $1
      ORDER BY r.rank
    `,
      [Number.parseInt(params.testId)],
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

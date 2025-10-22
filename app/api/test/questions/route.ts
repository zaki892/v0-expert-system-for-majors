import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const questions = await query(`
      SELECT 
        tq.id,
        tq.question,
        tq.criteria_id,
        c.name as criteria_name,
        json_agg(json_build_object('id', qo.id, 'text', qo.option_text, 'value', qo.option_value) ORDER BY qo.display_order) as options
      FROM test_questions tq
      JOIN criteria c ON tq.criteria_id = c.id
      LEFT JOIN question_options qo ON tq.id = qo.question_id
      GROUP BY tq.id, tq.question, tq.criteria_id, c.name
      ORDER BY tq.id
    `)

    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

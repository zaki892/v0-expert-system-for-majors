import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, answers } = await request.json()

    if (!userId || !answers) {
      return NextResponse.json({ error: "User ID and answers are required" }, { status: 400 })
    }

    // Create test result
    const testResult = await query("INSERT INTO test_results (user_id) VALUES ($1) RETURNING id", [userId])

    const testResultId = testResult[0].id

    // Insert answers
    for (const [questionId, answerValue] of Object.entries(answers)) {
      await query("INSERT INTO test_answers (test_result_id, question_id, answer_value) VALUES ($1, $2, $3)", [
        testResultId,
        Number.parseInt(questionId),
        answerValue,
      ])
    }

    // Calculate recommendations using SAW
    const criteriaScores = await query(
      `
      SELECT 
        c.id as criteria_id,
        AVG(ta.answer_value) as avg_score
      FROM test_answers ta
      JOIN test_questions tq ON ta.question_id = tq.id
      JOIN criteria c ON tq.criteria_id = c.id
      WHERE ta.test_result_id = $1
      GROUP BY c.id
    `,
      [testResultId],
    )

    const majorCriteria = await query(`
      SELECT 
        mc.major_id,
        mc.criteria_id,
        mc.score,
        c.weight,
        m.name as major_name
      FROM major_criteria mc
      JOIN criteria c ON mc.criteria_id = c.id
      JOIN majors m ON mc.major_id = m.id
    `)

    // Calculate SAW scores
    const criteriaMap = new Map(criteriaScores.map((cs: any) => [cs.criteria_id, cs.avg_score]))
    const majorScores = new Map<number, { name: string; totalScore: number; count: number }>()

    majorCriteria.forEach((mc: any) => {
      const userScore = criteriaMap.get(mc.criteria_id) || 0
      const normalizedUserScore = userScore / 5
      const normalizedMajorScore = mc.score / 100
      const weightedScore = normalizedUserScore * normalizedMajorScore * mc.weight

      if (!majorScores.has(mc.major_id)) {
        majorScores.set(mc.major_id, { name: mc.major_name, totalScore: 0, count: 0 })
      }
      const current = majorScores.get(mc.major_id)!
      current.totalScore += weightedScore
      current.count += 1
    })

    // Create recommendations
    const recommendations = Array.from(majorScores.entries())
      .map(([majorId, data]) => ({
        majorId,
        score: Math.min(100, (data.totalScore / data.count) * 100),
      }))
      .sort((a, b) => b.score - a.score)

    for (let i = 0; i < recommendations.length; i++) {
      await query("INSERT INTO recommendations (test_result_id, major_id, score, rank) VALUES ($1, $2, $3, $4)", [
        testResultId,
        recommendations[i].majorId,
        recommendations[i].score,
        i + 1,
      ])
    }

    return NextResponse.json({ testResultId, recommendations })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}

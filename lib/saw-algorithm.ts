// SAW (Simple Additive Weighting) Algorithm Implementation

interface CriteriaScore {
  criteriaId: number
  criteriaName: string
  weight: number
  userScore: number
}

interface MajorScore {
  majorId: number
  majorName: string
  score: number
}

export function calculateSAWScore(
  userAnswers: Map<number, number>, // criteriaId -> userScore
  majorCriteria: Array<{ criteriaId: number; majorId: number; score: number; weight: number }>,
  allCriteria: Array<{ id: number; weight: number }>,
): MajorScore[] {
  // Group by major
  const majorMap = new Map<number, { name: string; scores: number[] }>()

  majorCriteria.forEach((mc) => {
    const userScore = userAnswers.get(mc.criteriaId) || 0
    const normalizedUserScore = userScore / 5 // Normalize to 0-1
    const normalizedMajorScore = mc.score / 100 // Normalize to 0-1

    // Calculate weighted score
    const weightedScore = normalizedUserScore * normalizedMajorScore * mc.weight

    if (!majorMap.has(mc.majorId)) {
      majorMap.set(mc.majorId, { name: "", scores: [] })
    }
    majorMap.get(mc.majorId)!.scores.push(weightedScore)
  })

  // Calculate final scores and sort
  const results: MajorScore[] = Array.from(majorMap.entries()).map(([majorId, data]) => ({
    majorId,
    majorName: data.name,
    score: Math.min(100, (data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 100),
  }))

  return results.sort((a, b) => b.score - a.score)
}

export function normalizeScores(scores: MajorScore[]): MajorScore[] {
  const maxScore = Math.max(...scores.map((s) => s.score))
  return scores.map((s) => ({
    ...s,
    score: (s.score / maxScore) * 100,
  }))
}

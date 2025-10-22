"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  question: string
  criteria_id: number
  criteria_name: string
  options: Array<{ id: number; text: string; value: number }>
}

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchQuestions()
  }, [router])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/test/questions")
      const data = await response.json()
      setQuestions(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          answers,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/student/results/${data.testResultId}`)
      }
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Tidak ada pertanyaan tersedia</p>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isAnswered = answers[currentQuestion.id] !== undefined

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tes Minat dan Bakat</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Pertanyaan {currentIndex + 1} dari {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            <CardDescription>Kategori: {currentQuestion.criteria_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.value}
                    checked={answers[currentQuestion.id] === option.value}
                    onChange={() => handleAnswer(currentQuestion.id, option.value)}
                    className="mr-3"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
            Sebelumnya
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!isAnswered || submitting}>
              {submitting ? "Mengirim..." : "Selesai"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isAnswered}>
              Selanjutnya
            </Button>
          )}
        </div>

        {/* Answered Count */}
        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          Sudah menjawab: {Object.keys(answers).length} dari {questions.length} pertanyaan
        </div>
      </div>
    </main>
  )
}

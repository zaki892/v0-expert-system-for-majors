"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Recommendation {
  id: number
  major_id: number
  major_name: string
  description: string
  career_prospects: string
  score: number
  rank: number
}

export default function ResultsPage({
  params,
}: {
  params: { testId: string }
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchResults()
  }, [router, params.testId])

  const fetchResults = async () => {
    try {
      console.log("[v0] Fetching results for testId:", params.testId)
      const response = await fetch(`/api/results/${params.testId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Results data:", data)
      setRecommendations(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching results:", error)
      setError("Gagal memuat hasil tes. Silakan coba lagi.")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Memproses hasil tes...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 shadow-lg border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Link href="/student/test">
                <Button>Coba Tes Lagi</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (recommendations.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Tidak Ada Hasil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">Hasil tes tidak ditemukan.</p>
              <Link href="/student/test">
                <Button>Mulai Tes Baru</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hasil Rekomendasi Jurusan</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Berdasarkan hasil tes Anda, berikut adalah rekomendasi jurusan yang paling sesuai
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-4 mb-8">
          {recommendations.map((rec, index) => {
            const scoreValue = typeof rec.score === "string" ? Number.parseFloat(rec.score) : rec.score
            const validScore = isNaN(scoreValue) ? 0 : Math.min(100, Math.max(0, scoreValue))

            return (
              <Card key={rec.id} className={`border-0 shadow-lg ${index === 0 ? "ring-2 ring-blue-500" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-blue-600">#{rec.rank}</span>
                        <CardTitle>{rec.major_name}</CardTitle>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{validScore.toFixed(1)}%</div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Kecocokan</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${validScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Prospek Karir:</h4>
                    <p className="text-slate-600 dark:text-slate-300">{rec.career_prospects}</p>
                  </div>
                  <Link href={`/student/majors/${rec.major_id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Detail Jurusan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/student/dashboard">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Kembali ke Dashboard
            </Button>
          </Link>
          <Link href="/student/test">
            <Button className="w-full sm:w-auto">Tes Ulang</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

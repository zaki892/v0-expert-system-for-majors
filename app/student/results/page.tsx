"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TestResult {
  id: number
  completed_at: string
  top_major: string
  score: number
}

export default function ResultsHistoryPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    // Placeholder for fetching user's test results
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Riwayat Tes</h1>
          <p className="text-slate-600 dark:text-slate-300">Lihat semua tes yang telah Anda ikuti</p>
        </div>

        {/* Results List */}
        {results.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-4">Anda belum mengikuti tes apapun</p>
              <Link href="/student/test">
                <Button>Mulai Tes Sekarang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{result.top_major}</CardTitle>
                      <CardDescription>{new Date(result.completed_at).toLocaleDateString("id-ID")}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{result.score.toFixed(1)}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/student/results/${result.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link href="/student/dashboard">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Major {
  id: number
  name: string
  description: string
  requirements: string
  career_prospects: string
}

export default function MajorDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [major, setMajor] = useState<Major | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchMajor()
  }, [router, params.id])

  const fetchMajor = async () => {
    try {
      const response = await fetch(`/api/majors/${params.id}`)
      const data = await response.json()
      setMajor(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching major:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      </main>
    )
  }

  if (!major) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Jurusan tidak ditemukan</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/student/majors">
            <Button variant="outline" className="mb-4 bg-transparent">
              ← Kembali
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{major.name}</h1>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          {/* Description */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{major.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Persyaratan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{major.requirements}</p>
            </CardContent>
          </Card>

          {/* Career Prospects */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Prospek Karir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{major.career_prospects}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/student/majors">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Lihat Jurusan Lain
            </Button>
          </Link>
          <Link href="/student/test">
            <Button className="w-full sm:w-auto">Mulai Tes</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

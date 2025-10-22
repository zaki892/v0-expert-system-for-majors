"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Major {
  id: number
  name: string
  description: string
  requirements: string
  career_prospects: string
}

export default function MajorsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchMajors()
  }, [router])

  const fetchMajors = async () => {
    try {
      const response = await fetch("/api/majors")
      const data = await response.json()
      setMajors(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching majors:", error)
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Jelajahi Semua Jurusan</h1>
          <p className="text-slate-600 dark:text-slate-300">Pelajari detail tentang setiap jurusan yang tersedia</p>
        </div>

        {/* Majors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {majors.map((major) => (
            <Card key={major.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{major.name}</CardTitle>
                <CardDescription className="line-clamp-2">{major.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/student/majors/${major.id}`}>
                  <Button className="w-full">Lihat Detail</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link href="/student/dashboard">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

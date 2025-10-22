"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Criteria {
  id: number
  name: string
  description: string
  weight: number
  type: string
}

export default function CriteriaManagementPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "admin") {
      router.push("/student/dashboard")
      return
    }

    fetchCriteria()
  }, [router])

  const fetchCriteria = async () => {
    try {
      const response = await fetch("/api/admin/criteria")
      const data = await response.json()
      setCriteria(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching criteria:", error)
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Kriteria</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">Kembali</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {criteria.map((crit) => (
            <Card key={crit.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{crit.name}</CardTitle>
                <CardDescription>{crit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Bobot:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{crit.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Tipe:</span>
                    <span className="font-semibold text-slate-900 dark:text-white capitalize">{crit.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Stats {
  totalStudents: number
  totalTests: number
  totalMajors: number
  topMajors: Array<{ id: number; name: string; recommendation_count: number; avg_score: number }>
  recentTests: Array<{ id: number; student_name: string; completed_at: string; top_major: string; score: number }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "admin" && userData.role !== "teacher") {
      router.push("/student/dashboard")
      return
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/admin/stats", {
        headers: { "x-user-id": user.id.toString() },
      })
      const data = await response.json()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 dark:text-slate-300">Admin</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">Total Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats?.totalStudents || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-indigo-600">Total Tes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats?.totalTests || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-600">Total Jurusan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats?.totalMajors || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Majors */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Jurusan Paling Direkomendasikan</CardTitle>
              <CardDescription>Top 5 jurusan berdasarkan rekomendasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topMajors.map((major, index) => (
                  <div
                    key={major.id}
                    className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {index + 1}. {major.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {major.recommendation_count} rekomendasi
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{major.avg_score.toFixed(1)}%</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Rata-rata</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola sistem pakar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/majors" className="block">
                <Button className="w-full justify-start">Kelola Jurusan</Button>
              </Link>
              <Link href="/admin/class-report" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Laporan Per Kelas
                </Button>
              </Link>
              <Link href="/admin/criteria" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Kelola Kriteria
                </Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Kelola Pengguna
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Tes Terbaru</CardTitle>
            <CardDescription>10 tes terakhir yang dikerjakan siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Nama Siswa</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Tanggal</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Jurusan Top</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentTests.map((test) => (
                    <tr
                      key={test.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{test.student_name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {new Date(test.completed_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{test.top_major || "-"}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{test.score?.toFixed(1) || "-"}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

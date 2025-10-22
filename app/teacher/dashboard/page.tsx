"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TeacherStats {
  totalStudents: number
  totalClasses: number
  recentTests: Array<{ id: number; studentName: string; testDate: string; topMajor: string }>
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(user)
    if (parsedUser.role !== "teacher" && parsedUser.role !== "admin") {
      router.push("/student/dashboard")
      return
    }

    setUserData(parsedUser)
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/teacher/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Memuat dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Guru/Admin</h1>
          <p className="text-slate-600 dark:text-slate-300">Selamat datang, {userData?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.totalStudents || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.totalClasses || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Tes Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.recentTests?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Tes Terbaru Siswa</CardTitle>
            <CardDescription>Hasil tes siswa yang baru diselesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentTests && stats.recentTests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Nama Siswa</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Tanggal Tes</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        Jurusan Teratas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTests.map((test) => (
                      <tr
                        key={test.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">{test.studentName}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {new Date(test.testDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{test.topMajor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">Tidak ada tes terbaru</p>
            )}
          </CardContent>
        </Card>

        {/* Management Links */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Menu Manajemen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  Dashboard Admin
                </Button>
              </Link>
              <Link href="/admin/class-report">
                <Button variant="outline" className="w-full bg-transparent">
                  Laporan Kelas
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full bg-transparent">
                  Kelola Pengguna
                </Button>
              </Link>
              <Link href="/admin/school-management">
                <Button variant="outline" className="w-full bg-transparent">
                  Kelola Sekolah
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Stats {
  totalStudents: number
  totalTests: number
  totalMajors: number
  topMajors: Array<{ name: string; count: number }>
  classDistribution: Array<{ name: string; count: number }>
}

export default function PrincipalDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
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
    if (parsedUser.role !== "principal") {
      router.push("/student/dashboard")
      return
    }

    setUserData(parsedUser)
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/principal/stats")
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

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Kepala Sekolah</h1>
          <p className="text-slate-600 dark:text-slate-300">Selamat datang, {userData?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Tes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.totalTests || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Jurusan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.totalMajors || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Tingkat Penyelesaian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats?.totalStudents ? Math.round((stats.totalTests / stats.totalStudents) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Majors Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Jurusan Teratas</CardTitle>
              <CardDescription>Jurusan yang paling banyak direkomendasikan</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.topMajors && stats.topMajors.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topMajors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">Tidak ada data</p>
              )}
            </CardContent>
          </Card>

          {/* Class Distribution Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Distribusi Kelas</CardTitle>
              <CardDescription>Jumlah siswa per kelas</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.classDistribution && stats.classDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.classDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">Tidak ada data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/principal/reports">
                <Button variant="outline" className="w-full bg-transparent">
                  Lihat Laporan
                </Button>
              </Link>
              <Link href="/principal/students">
                <Button variant="outline" className="w-full bg-transparent">
                  Kelola Siswa
                </Button>
              </Link>
              <Link href="/principal/teachers">
                <Button variant="outline" className="w-full bg-transparent">
                  Kelola Guru
                </Button>
              </Link>
              <Link href="/principal/settings">
                <Button variant="outline" className="w-full bg-transparent">
                  Pengaturan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

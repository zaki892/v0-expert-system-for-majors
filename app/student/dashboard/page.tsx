"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Siswa</h1>
          <div className="flex items-center gap-4">
            <Link href="/student/profile">
              <Button variant="outline" size="sm">
                Profil
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Selamat datang, {user.name}!</h2>
          <p className="text-slate-600 dark:text-slate-300">Temukan jurusan kuliah yang tepat untuk masa depan Anda</p>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Start Test Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Mulai Tes</CardTitle>
              <CardDescription>Ikuti tes minat dan bakat untuk mendapatkan rekomendasi jurusan</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/test">
                <Button className="w-full">Mulai Tes Sekarang</Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Results Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-indigo-600">Lihat Hasil</CardTitle>
              <CardDescription>Lihat riwayat tes dan rekomendasi jurusan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/results">
                <Button variant="outline" className="w-full bg-transparent">
                  Lihat Hasil Tes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Majors Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-purple-600">Jelajahi Jurusan</CardTitle>
              <CardDescription>Pelajari detail tentang setiap jurusan yang tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/majors">
                <Button variant="outline" className="w-full bg-transparent">
                  Lihat Semua Jurusan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Chat Bot Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600">Tanya Bot</CardTitle>
              <CardDescription>Tanyakan pertanyaan tentang jurusan dan karir</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student/chat">
                <Button variant="outline" className="w-full bg-transparent">
                  Buka Chat Bot
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Tentang Tes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>✓ Tes terdiri dari 14 pertanyaan</p>
              <p>✓ Waktu pengerjaan: ~10 menit</p>
              <p>✓ Hasil instan setelah selesai</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Metode SAW</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>✓ Analisis berbasis kriteria</p>
              <p>✓ Pembobotan otomatis</p>
              <p>✓ Rekomendasi akurat</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Fitur Tersedia</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>✓ Chat bot asisten</p>
              <p>✓ Profil pengguna</p>
              <p>✓ Riwayat tes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

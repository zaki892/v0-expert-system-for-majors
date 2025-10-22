"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  nisn: string
  nis: string
  gender: string
  date_of_birth: string
  class_name: string
  grade_level: number
  major_track: string
  school_name: string
  npsn: string
  testStats: {
    total_tests: number
    last_test_date: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/profile", {
        headers: { "x-user-id": user.id.toString() },
      })
      const data = await response.json()
      setProfile(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile:", error)
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

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Profil tidak ditemukan</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profil Saya</h1>
          <p className="text-slate-600 dark:text-slate-300">Informasi lengkap akun dan data sekolah Anda</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Data akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Nama Lengkap</label>
                  <p className="text-lg text-slate-900 dark:text-white">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email</label>
                  <p className="text-lg text-slate-900 dark:text-white">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Jenis Kelamin</label>
                  <p className="text-lg text-slate-900 dark:text-white capitalize">{profile.gender || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tanggal Lahir</label>
                  <p className="text-lg text-slate-900 dark:text-white">
                    {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informasi Sekolah</CardTitle>
              <CardDescription>Data sekolah dan kelas Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Nama Sekolah</label>
                  <p className="text-lg text-slate-900 dark:text-white">{profile.school_name || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">NPSN</label>
                  <p className="text-lg font-mono text-blue-600">{profile.npsn || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student ID Information */}
          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Nomor Identitas Siswa</CardTitle>
              <CardDescription>Identitas resmi Anda di sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">NISN</label>
                  <p className="text-2xl font-mono font-bold text-blue-600 mt-2">{profile.nisn || "-"}</p>
                  <p className="text-xs text-slate-500 mt-1">Nomor Induk Siswa Nasional</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">NIS</label>
                  <p className="text-2xl font-mono font-bold text-blue-600 mt-2">{profile.nis || "-"}</p>
                  <p className="text-xs text-slate-500 mt-1">Nomor Induk Sekolah</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Information */}
          <Card className="border-0 shadow-lg bg-indigo-50 dark:bg-indigo-900/20">
            <CardHeader>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">Informasi Kelas</CardTitle>
              <CardDescription>Kelas dan program studi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Kelas</label>
                  <p className="text-xl font-bold text-indigo-600 mt-2">{profile.class_name || "-"}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tingkat</label>
                  <p className="text-xl font-bold text-indigo-600 mt-2">Kelas {profile.grade_level || "-"}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Program</label>
                  <p className="text-xl font-bold text-indigo-600 mt-2">{profile.major_track || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Statistik Tes</CardTitle>
              <CardDescription>Ringkasan aktivitas tes Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Tes Dikerjakan</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{profile.testStats.total_tests}</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tes Terakhir</p>
                  <p className="text-lg text-indigo-600 font-semibold mt-2">
                    {profile.testStats.last_test_date
                      ? new Date(profile.testStats.last_test_date).toLocaleDateString("id-ID")
                      : "Belum ada"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/student/test" className="block">
                <Button className="w-full justify-start">Mulai Tes Baru</Button>
              </Link>
              <Link href="/student/results" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Lihat Riwayat Tes
                </Button>
              </Link>
              <Link href="/student/majors" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Jelajahi Jurusan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

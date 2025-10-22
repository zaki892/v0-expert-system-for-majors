"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StudentReport {
  id: number
  name: string
  email: string
  test_count: number
  last_test_date: string
  top_major: string
  top_score: number
}

export default function ClassReportPage() {
  const [report, setReport] = useState<StudentReport[]>([])
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

    fetchReport()
  }, [router])

  const fetchReport = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/admin/class-report", {
        headers: { "x-user-id": user.id.toString() },
      })
      const data = await response.json()
      setReport(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching report:", error)
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
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
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:border-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan Per Kelas</h1>
          <div className="flex gap-4">
            <Button onClick={handlePrint} variant="outline">
              Cetak
            </Button>
            <Link href="/admin/dashboard">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg print:shadow-none">
          <CardHeader className="print:pb-4">
            <CardTitle>Laporan Hasil Tes Siswa</CardTitle>
            <CardDescription>Data lengkap hasil tes minat dan bakat semua siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">No</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Nama Siswa</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Jumlah Tes</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Tes Terakhir</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Jurusan Top</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{index + 1}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{student.email}</td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">{student.test_count}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {student.last_test_date ? new Date(student.last_test_date).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{student.top_major || "-"}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-600">
                        {student.top_score?.toFixed(1) || "-"}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
              <p>Total Siswa: {report.length}</p>
              <p>Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

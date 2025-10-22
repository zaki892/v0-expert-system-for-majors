"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Major {
  id: number
  name: string
  description: string
  requirements: string
  career_prospects: string
}

export default function MajorsManagementPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", requirements: "", career_prospects: "" })
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

    fetchMajors()
  }, [router])

  const fetchMajors = async () => {
    try {
      const response = await fetch("/api/admin/majors")
      const data = await response.json()
      setMajors(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching majors:", error)
      setLoading(false)
    }
  }

  const handleAddMajor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/admin/majors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id.toString(),
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", description: "", requirements: "", career_prospects: "" })
        setShowForm(false)
        fetchMajors()
      }
    } catch (error) {
      console.error("Error adding major:", error)
    }
  }

  const handleDeleteMajor = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) return

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`/api/admin/majors/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id.toString() },
      })

      if (response.ok) {
        fetchMajors()
      }
    } catch (error) {
      console.error("Error deleting major:", error)
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Jurusan</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">Kembali</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Add Major Form */}
        {showForm && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Tambah Jurusan Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMajor} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nama Jurusan</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Teknik Informatika"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi jurusan"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Persyaratan</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Persyaratan masuk"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prospek Karir</label>
                  <textarea
                    value={formData.career_prospects}
                    onChange={(e) => setFormData({ ...formData, career_prospects: e.target.value })}
                    placeholder="Prospek karir"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit">Simpan</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <div className="mb-8">
            <Button onClick={() => setShowForm(true)}>Tambah Jurusan</Button>
          </div>
        )}

        {/* Majors List */}
        <div className="grid md:grid-cols-2 gap-6">
          {majors.map((major) => (
            <Card key={major.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{major.name}</CardTitle>
                <CardDescription className="line-clamp-2">{major.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Persyaratan:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{major.requirements}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Prospek Karir:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{major.career_prospects}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" disabled>
                    Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDeleteMajor(major.id)}>
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

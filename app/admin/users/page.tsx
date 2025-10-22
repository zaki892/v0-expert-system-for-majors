"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nisn: "",
    nis: "",
    classId: "",
  })
  const [registering, setRegistering] = useState(false)
  const [message, setMessage] = useState("")
  const [classes, setClasses] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login/teacher")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "admin" && userData.role !== "teacher") {
      router.push("/student/dashboard")
      return
    }

    fetchUsers()
    fetchClasses()
  }, [router])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/school/classes")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          nisn: formData.nisn,
          nis: formData.nis,
          classId: Number.parseInt(formData.classId),
          role: "student",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(`Error: ${data.error}`)
        return
      }

      setMessage("Siswa berhasil didaftarkan!")
      setFormData({ name: "", email: "", password: "", nisn: "", nis: "", classId: "" })
      setShowRegisterForm(false)
      fetchUsers()
    } catch (error) {
      setMessage("Terjadi kesalahan saat mendaftarkan siswa")
    } finally {
      setRegistering(false)
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Pengguna</h1>
          <Link href="/teacher/dashboard">
            <Button variant="outline">Kembali</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Daftar Pengguna</h2>
          <Button onClick={() => setShowRegisterForm(!showRegisterForm)} className="bg-blue-600 hover:bg-blue-700">
            {showRegisterForm ? "Batal" : "Daftarkan Siswa Baru"}
          </Button>
        </div>

        {/* Registration Form */}
        {showRegisterForm && (
          <Card className="border-0 shadow-lg mb-6 bg-blue-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Daftarkan Siswa Baru</CardTitle>
              <CardDescription>Isi form di bawah untuk menambahkan siswa baru</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div
                  className={`p-3 rounded-md text-sm mb-4 ${
                    message.includes("Error")
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleRegisterStudent} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      type="text"
                      placeholder="Nama siswa"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NISN</label>
                    <Input
                      type="text"
                      placeholder="Nomor Induk Siswa Nasional"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NIS</label>
                    <Input
                      type="text"
                      placeholder="Nomor Induk Sekolah"
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kelas</label>
                    <select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.grade_level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={registering}>
                  {registering ? "Mendaftarkan..." : "Daftarkan Siswa"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>Total pengguna: {users.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : user.role === "teacher"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : user.role === "principal"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </td>
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

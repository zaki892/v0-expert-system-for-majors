"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: number
  name: string
  nisn: string
  nis: string
  email: string
  gender: string
  gpa?: number
  rank?: number
}

interface Class {
  id: number
  name: string
  grade_level: number
  major_track: string
  homeroom_teacher_name: string
  student_count: number
  year_start: number
  year_end: number
}

export default function SchoolManagementPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [searchNISN, setSearchNISN] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/school/classes?schoolId=1")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsByClass = async (classId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/school/students?classId=${classId}`)
      const data = await response.json()
      setStudents(data)
      setSelectedClass(classId)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchStudentByNISN = async () => {
    if (!searchNISN.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/school/students?nisn=${searchNISN}`)
      if (response.ok) {
        const data = await response.json()
        setStudents([data])
      } else {
        setStudents([])
        alert("Siswa tidak ditemukan")
      }
    } catch (error) {
      console.error("Error searching student:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Manajemen Data Sekolah</h1>
          <p className="text-slate-600">Kelola data siswa, kelas, dan informasi akademik</p>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classes">Daftar Kelas</TabsTrigger>
            <TabsTrigger value="search">Cari Siswa</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => fetchStudentsByClass(cls.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription>
                      {cls.major_track} - Kelas {cls.grade_level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Wali Kelas:</span> {cls.homeroom_teacher_name || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Jumlah Siswa:</span> {cls.student_count}
                      </p>
                      <p>
                        <span className="font-semibold">Tahun Ajaran:</span> {cls.year_start}/{cls.year_end}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedClass && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Daftar Siswa</CardTitle>
                  <CardDescription>Total: {students.length} siswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-left">NISN</th>
                          <th className="px-4 py-2 text-left">NIS</th>
                          <th className="px-4 py-2 text-left">Nama</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Jenis Kelamin</th>
                          <th className="px-4 py-2 text-center">IPK</th>
                          <th className="px-4 py-2 text-center">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-2 font-mono text-blue-600">{student.nisn}</td>
                            <td className="px-4 py-2 font-mono">{student.nis}</td>
                            <td className="px-4 py-2">{student.name}</td>
                            <td className="px-4 py-2 text-slate-600">{student.email}</td>
                            <td className="px-4 py-2">{student.gender}</td>
                            <td className="px-4 py-2 text-center">{student.gpa?.toFixed(2) || "-"}</td>
                            <td className="px-4 py-2 text-center">{student.rank || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cari Siswa Berdasarkan NISN</CardTitle>
                <CardDescription>Masukkan Nomor Induk Siswa Nasional (NISN) untuk mencari data siswa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan NISN (contoh: 0012345678901)"
                    value={searchNISN}
                    onChange={(e) => setSearchNISN(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchStudentByNISN()}
                  />
                  <Button onClick={searchStudentByNISN} disabled={loading}>
                    {loading ? "Mencari..." : "Cari"}
                  </Button>
                </div>

                {students.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {students.map((student) => (
                      <Card key={student.id} className="bg-blue-50">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600">NISN</p>
                              <p className="font-mono font-bold text-lg">{student.nisn}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">NIS</p>
                              <p className="font-mono font-bold text-lg">{student.nis}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Nama Lengkap</p>
                              <p className="font-semibold">{student.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Email</p>
                              <p>{student.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Jenis Kelamin</p>
                              <p>{student.gender}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">IPK</p>
                              <p className="font-semibold">{student.gpa?.toFixed(2) || "-"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

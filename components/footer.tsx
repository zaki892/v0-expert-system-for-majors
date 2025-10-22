"use client"

import { useEffect, useState } from "react"

interface SchoolInfo {
  name: string
  npsn: string
  city: string
  principal_name: string
}

export function Footer() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    name: "Sekolah Menengah Atas",
    npsn: "20123456",
    city: "Jakarta",
    principal_name: "Kepala Sekolah",
  })

  useEffect(() => {
    fetchSchoolInfo()
  }, [])

  const fetchSchoolInfo = async () => {
    try {
      const response = await fetch("/api/school/info")
      const data = await response.json()
      setSchoolInfo(data)
    } catch (error) {
      console.error("Error fetching school info:", error)
    }
  }

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white mt-12 border-t border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* School Info */}
          <div>
            <h3 className="font-bold text-lg mb-3">Informasi Sekolah</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>
                <span className="font-semibold">Nama:</span> {schoolInfo.name}
              </p>
              <p>
                <span className="font-semibold">NPSN:</span> {schoolInfo.npsn}
              </p>
              <p>
                <span className="font-semibold">Kota:</span> {schoolInfo.city}
              </p>
              <p>
                <span className="font-semibold">Kepala Sekolah:</span> {schoolInfo.principal_name}
              </p>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h3 className="font-bold text-lg mb-3">Tentang Sistem</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>Sistem Pakar Penentuan Jurusan Kuliah</p>
              <p>Menggunakan metode Simple Additive Weighting (SAW)</p>
              <p>Membantu siswa menemukan jurusan yang tepat</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Tautan Cepat</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>
                <a href="/student/dashboard" className="hover:text-blue-400 transition">
                  Dashboard Siswa
                </a>
              </p>
              <p>
                <a href="/student/test" className="hover:text-blue-400 transition">
                  Mulai Tes
                </a>
              </p>
              <p>
                <a href="/student/majors" className="hover:text-blue-400 transition">
                  Jelajahi Jurusan
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2025 Sistem Pakar Penentuan Jurusan. All rights reserved.</p>
            <p>Dikembangkan dengan teknologi Next.js dan Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Sistem Pakar Penentuan Jurusan Kuliah
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Temukan jurusan kuliah yang tepat berdasarkan minat dan bakat Anda menggunakan metode SAW
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">Tes Komprehensif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Ikuti tes yang dirancang untuk mengidentifikasi minat dan bakat Anda secara menyeluruh
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-indigo-600">Analisis SAW</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Hasil tes dianalisis menggunakan metode Simple Additive Weighting untuk rekomendasi akurat
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-600">Rekomendasi Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Dapatkan rekomendasi jurusan yang dipersonalisasi dengan skor kecocokan untuk setiap jurusan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login/student">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Login Siswa
            </Button>
          </Link>
          <Link href="/login/teacher">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Login Guru/Admin
            </Button>
          </Link>
          <Link href="/login/principal">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Login Kepala Sekolah
            </Button>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Untuk Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Ikuti tes minat dan bakat</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Lihat rekomendasi jurusan</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Pelajari detail setiap jurusan</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Simpan riwayat tes Anda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Untuk Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Kelola data jurusan</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Lihat statistik hasil tes</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Cetak laporan per kelas</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">✓ Kelola pengguna sistem</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

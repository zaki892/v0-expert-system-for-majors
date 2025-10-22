import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function StudentLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Login Siswa</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Masuk untuk mengikuti tes dan melihat rekomendasi jurusan
          </p>
        </div>
        <LoginForm role="student" />
        <p className="text-center mt-6 text-slate-600 dark:text-slate-300">
          Hubungi guru atau admin sekolah untuk mendapatkan akun
        </p>
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </main>
  )
}

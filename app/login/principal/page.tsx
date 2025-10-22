import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function PrincipalLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Login Kepala Sekolah</h1>
          <p className="text-slate-600 dark:text-slate-300">Lihat statistik dan laporan sekolah</p>
        </div>
        <LoginForm role="principal" />
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </main>
  )
}

import Link from "next/link"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Pendaftaran Siswa</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Siswa tidak dapat mendaftar sendiri. Hubungi guru atau admin sekolah Anda untuk membuat akun.
          </p>
          <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Untuk Guru/Admin:</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Anda dapat mendaftarkan siswa melalui dashboard admin
            </p>
            <Link
              href="/login/teacher"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Login Guru/Admin
            </Link>
          </div>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          Kembali ke halaman utama
        </Link>
      </div>
    </main>
  )
}

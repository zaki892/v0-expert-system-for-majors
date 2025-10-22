import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sistem Pakar Jurusan</h1>
          <p className="text-slate-600 dark:text-slate-300">Temukan jurusan yang tepat untuk Anda</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

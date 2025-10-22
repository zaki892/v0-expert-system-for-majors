"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dbReady, setDbReady] = useState<boolean | null>(null)
  const [dbMessage, setDbMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        console.log("[v0] Checking database health...")
        const response = await fetch("/api/health")
        const data = await response.json()

        console.log("[v0] Health check response:", data)

        if (response.ok && data.status === "ok") {
          setDbReady(true)
          setDbMessage("Database siap digunakan ✓")
        } else if (response.status === 503) {
          setDbReady(false)
          setDbMessage(data.hint || "Database belum diinisialisasi")
        } else {
          setDbReady(false)
          setDbMessage(data.hint || data.message || "Database tidak siap")
        }
      } catch (err) {
        console.error("[v0] Health check error:", err)
        setDbReady(false)
        setDbMessage("Tidak dapat terhubung ke database. Periksa koneksi internet Anda.")
      }
    }

    checkDatabase()
    const interval = setInterval(checkDatabase, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role: "student" }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registrasi gagal")
        return
      }

      router.push("/login")
    } catch (err) {
      console.error("[v0] Registration error:", err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Daftar</CardTitle>
        <CardDescription>Buat akun baru untuk mengikuti tes</CardDescription>
      </CardHeader>
      <CardContent>
        {dbReady === false && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm mb-4">
            <div className="font-semibold mb-1">⚠️ Database Belum Siap</div>
            <div className="text-xs">{dbMessage}</div>
            <div className="text-xs mt-2">
              Langkah-langkah:
              <ol className="list-decimal list-inside mt-1">
                <li>Buka folder /scripts</li>
                <li>Jalankan: 01-init-database.sql</li>
                <li>Jalankan: 02-seed-data.sql</li>
                <li>Refresh halaman ini</li>
              </ol>
            </div>
          </div>
        )}
        {dbReady === true && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm mb-4">
            ✓ {dbMessage}
          </div>
        )}
        {dbReady === null && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm mb-4">
            ⏳ Memeriksa status database...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nama Lengkap
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || !dbReady}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || !dbReady}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || !dbReady}
            />
            <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !dbReady}>
            {loading ? "Loading..." : "Daftar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkHealth = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthStatus({
        status: response.status,
        data,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Database Diagnostic</CardTitle>
            <CardDescription>Periksa status koneksi database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkHealth} disabled={loading}>
              {loading ? "Checking..." : "Check Database"}
            </Button>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

            {healthStatus && (
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-semibold mb-2">Status: {healthStatus.status}</div>
                  <pre className="text-xs overflow-auto bg-background p-2 rounded border">
                    {JSON.stringify(healthStatus.data, null, 2)}
                  </pre>
                </div>

                {healthStatus.status === 503 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                    <div className="font-semibold mb-2">⚠️ Database Belum Diinisialisasi</div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Buka folder /scripts di Code Project</li>
                      <li>Jalankan script: 01-init-database.sql</li>
                      <li>Jalankan script: 02-seed-data.sql</li>
                      <li>Jalankan script: 03-add-school-tables.sql</li>
                      <li>Jalankan script: 04-seed-school-data.sql</li>
                      <li>Refresh halaman ini</li>
                    </ol>
                  </div>
                )}

                {healthStatus.status === 200 && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
                    ✓ Database siap digunakan! Anda bisa mulai mendaftar.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

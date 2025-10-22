"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Home, User, BookOpen } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:inline">Sistem Pakar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user.role === "student" && (
              <>
                <Link
                  href="/student/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-2"
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/student/test"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  <span>Tes</span>
                </Link>
                <Link
                  href="/student/profile"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-2"
                >
                  <User size={18} />
                  <span>Profil</span>
                </Link>
              </>
            )}
            {user.role === "admin" && (
              <>
                <Link href="/admin/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/admin/majors" className="text-slate-600 dark:text-slate-300 hover:text-blue-600">
                  Jurusan
                </Link>
                <Link href="/admin/class-report" className="text-slate-600 dark:text-slate-300 hover:text-blue-600">
                  Laporan
                </Link>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user.role === "student" && (
              <>
                <Link
                  href="/student/dashboard"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  href="/student/test"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Tes
                </Link>
                <Link
                  href="/student/profile"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Profil
                </Link>
              </>
            )}
            {user.role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/majors"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Jurusan
                </Link>
                <Link
                  href="/admin/class-report"
                  className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  Laporan
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation

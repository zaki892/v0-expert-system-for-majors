"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(user)
    if (parsedUser.role !== "teacher" && parsedUser.role !== "admin") {
      router.push("/student/dashboard")
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

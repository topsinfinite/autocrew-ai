"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and has super_admin role
    const checkAuth = () => {
      const mockUser = localStorage.getItem("mockUser")

      if (!mockUser) {
        // Not logged in, redirect to login
        router.push("/login")
        return
      }

      try {
        const user = JSON.parse(mockUser)
        if (user.role !== "super_admin") {
          // Not a super admin, redirect to dashboard
          router.push("/dashboard")
          return
        }
      } catch (error) {
        // Invalid user data, redirect to login
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ClientProvider } from "@/lib/contexts/client-context"
import { useAuth } from "@/lib/hooks/use-auth"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading && !isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return null // or a loading spinner
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ClientProvider>
  );
}

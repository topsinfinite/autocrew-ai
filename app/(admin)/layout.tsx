import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { verifyAuth } from "@/lib/dal"
import { redirect } from "next/navigation"

/**
 * Admin Layout - Server Component
 *
 * SECURITY: This layout validates authentication AND authorization server-side.
 * The proxy.ts file only does cookie checking. Real role verification happens here.
 *
 * Authorization Flow:
 * 1. Proxy checks cookie existence
 * 2. This component verifies session validity
 * 3. This component checks super_admin role
 * 4. Non-SuperAdmin users are redirected to /dashboard
 *
 * @see CODE_REVIEW_REPORT.md for security rationale
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify authentication (redirects to /login if not authenticated)
  const session = await verifyAuth();

  // Verify SuperAdmin role
  if (session.user.role !== 'super_admin') {
    // Not a SuperAdmin - redirect to their dashboard
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

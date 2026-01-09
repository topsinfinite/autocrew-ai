import { Sidebar } from "@/components/sidebar"
import { ClientProvider } from "@/lib/contexts/client-context"
import { verifyAuth, getAvailableClients } from "@/lib/dal"

/**
 * Dashboard Layout - Server Component
 *
 * SECURITY: This layout validates authentication server-side following
 * Next.js 16 best practices. The proxy.ts file only does coarse-grained
 * cookie checking. Real session validation happens here.
 *
 * Authentication Flow (Defense in Depth):
 * 1. Proxy checks cookie existence (coarse)
 * 2. This component verifies session validity (fine-grained)
 * 3. User data fetched securely on server
 * 4. Client components receive only necessary data
 *
 * @see CODE_REVIEW_REPORT.md for security rationale
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication and get session
  // This will redirect to /login if session is invalid
  const session = await verifyAuth();

  // Fetch available clients for this user (server-side only)
  // SuperAdmin gets all clients, Client Admin gets their organization(s)
  const availableClients = await getAvailableClients();

  return (
    <ClientProvider initialClients={availableClients}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </ClientProvider>
  );
}

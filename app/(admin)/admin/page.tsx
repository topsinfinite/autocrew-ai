export const dynamic = 'force-dynamic';

import Link from "next/link"
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid"
import { ClientOverviewCard } from "@/components/admin/client-overview-card"
import { ClientOnboardingForm } from "@/components/admin/client-onboarding-form"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { db } from "@/db"
import { member } from "@/db/schema"
import { getClients, getCrews, getUsers, getConversations } from "@/lib/dal"

async function getDashboardData() {
  // Use DAL to fetch data (auth checks handled in DAL)
  const [allClients, allCrews, allUsers, allConversations, allMembers] = await Promise.all([
    getClients(), // SuperAdmin only
    getCrews(), // No filter - SuperAdmin sees all
    getUsers(), // SuperAdmin only
    getConversations(), // No filter - SuperAdmin sees all
    db.select().from(member), // Members table - not tenant-specific
  ]);

  return {
    clients: allClients,
    crews: allCrews,
    users: allUsers.filter((u) => u.role === 'client_admin'),
    conversations: allConversations,
    members: allMembers,
  }
}

export default async function AdminDashboardPage() {
  const { clients: allClients, crews: allCrews, users: allUsers, conversations: allConversations, members: allMembers } = await getDashboardData()

  const totalClients = allClients.length
  const activeClients = allClients.filter((c) => c.status === "active").length
  const totalCrews = allCrews.length
  const totalUsers = allUsers.length

  // Get recent clients (last 3)
  const recentClients = [...allClients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            SuperAdmin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage clients, crews, and platform operations
          </p>
        </div>
        <ClientOnboardingForm />
      </div>

      {/* Stats Grid */}
      <AdminStatsGrid
        totalClients={totalClients}
        activeClients={activeClients}
        totalCrews={totalCrews}
        totalUsers={totalUsers}
      />

      {/* Recent Clients */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Clients
          </h2>
          <Link href="/admin/clients">
            <Button variant="ghost">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentClients.map((client) => {
            // Count crews for this client
            const clientCrews = allCrews.filter((c) => c.clientId === client.clientCode)

            // Count users (members) for this client organization
            const clientMembers = allMembers.filter((m) => m.organizationId === client.id)

            // Count conversations for this client
            const clientConversations = allConversations.filter((c) => c.clientId === client.clientCode)

            return (
              <ClientOverviewCard
                key={client.id}
                id={client.id}
                clientCode={client.clientCode}
                contactPersonName={client.contactPersonName}
                companyName={client.companyName}
                plan={client.plan}
                status={client.status}
                crewsCount={clientCrews.length}
                usersCount={clientMembers.length}
                conversationsCount={clientConversations.length}
              />
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/admin/clients">
          <div className="cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Manage Clients
            </h3>
            <p className="text-sm text-muted-foreground">
              View and manage all client organizations
            </p>
          </div>
        </Link>
        <Link href="/admin/crews">
          <div className="cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Assign Crews
            </h3>
            <p className="text-sm text-muted-foreground">
              Assign AI crews to client organizations
            </p>
          </div>
        </Link>
        <Link href="/admin/users">
          <div className="cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Invite Users
            </h3>
            <p className="text-sm text-muted-foreground">
              Invite new client admin users to the platform
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

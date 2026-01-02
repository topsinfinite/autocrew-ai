import Link from "next/link"
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid"
import { ClientOverviewCard } from "@/components/admin/client-overview-card"
import { ClientOnboardingForm } from "@/components/admin/client-onboarding-form"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {
  mockClients,
  mockAdminUsers,
  mockCrewAssignments,
  getCrewAssignmentsByClientId,
  getAdminUsersByClientId,
} from "@/lib/mock-data/multi-tenant-data"
import { dummyConversations } from "@/lib/dummy-data"

export default function AdminDashboardPage() {
  const totalClients = mockClients.length
  const activeClients = mockClients.filter((c) => c.status === "active").length
  const totalCrews = mockCrewAssignments.length
  const totalUsers = mockAdminUsers.filter((u) => u.role === "client_admin").length

  // Get recent clients (last 3)
  const recentClients = [...mockClients]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
            const crewAssignments = getCrewAssignmentsByClientId(client.id)
            const users = getAdminUsersByClientId(client.id)
            const conversations = dummyConversations.filter(
              (c) => c.clientId === client.id
            )

            return (
              <ClientOverviewCard
                key={client.id}
                id={client.id}
                clientCode={client.clientCode}
                contactPersonName={client.contactPersonName}
                companyName={client.companyName}
                plan={client.plan}
                status={client.status}
                crewsCount={crewAssignments.length}
                usersCount={users.length}
                conversationsCount={conversations.length}
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

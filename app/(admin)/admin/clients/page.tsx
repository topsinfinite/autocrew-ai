import { ClientOnboardingForm } from "@/components/admin/client-onboarding-form"
import { ClientActions } from "@/components/admin/client-actions"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Bot } from "lucide-react"
import { format } from "date-fns"
import type { Client } from "@/types"
import { db } from "@/db"
import { member } from "@/db/schema"
import { getClients, getCrews } from "@/lib/dal"

async function getClientsWithCounts() {
  try {
    // Use DAL to fetch data (auth checks handled in DAL)
    const [allClients, allCrews, allMembers] = await Promise.all([
      getClients(), // SuperAdmin only
      getCrews(), // No filter - SuperAdmin sees all
      db.select().from(member), // Members table - not tenant-specific
    ]);

    return {
      clients: allClients,
      crews: allCrews,
      members: allMembers,
    }
  } catch (error) {
    console.error('Error fetching clients:', error)
    return {
      clients: [],
      crews: [],
      members: [],
    }
  }
}

export default async function ClientsPage() {
  const { clients: allClients, crews: allCrews, members: allMembers } = await getClientsWithCounts()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "trial":
        return "bg-blue-500/10 text-blue-500"
      case "inactive":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-500"
      case "professional":
        return "bg-primary/10 text-primary"
      case "starter":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Clients" },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage all client organizations and their subscriptions
          </p>
        </div>
        <ClientOnboardingForm />
      </div>

      {/* Clients Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Client Code</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Crews</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              allClients.map((client) => {
                // Count crews for this client
                const crewCount = allCrews.filter((c) => c.clientId === client.clientCode).length
                // Count members for this client organization
                const userCount = allMembers.filter((m) => m.organizationId === client.id).length

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {client.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.contactPersonName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {client.clientCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.contactEmail}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(client.plan)}>
                        {client.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bot className="h-4 w-4" />
                        <span>{crewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(client.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <ClientActions
                        client={client}
                        crewCount={crewCount}
                        userCount={userCount}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

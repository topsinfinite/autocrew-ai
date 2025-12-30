import Link from "next/link"
import { ClientOnboardingForm } from "@/components/admin/client-onboarding-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight, Users, Bot } from "lucide-react"
import {
  getCrewAssignmentsByClientId,
  getAdminUsersByClientId,
} from "@/lib/mock-data/multi-tenant-data"
import { format } from "date-fns"
import type { Client } from "@/types"

async function getClients(): Promise<Client[]> {
  try {
    const response = await fetch('http://localhost:3000/api/clients', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
}

export default async function ClientsPage() {
  const clients = await getClients()

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
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => {
                const crewCount = getCrewAssignmentsByClientId(client.id).length
                const userCount = getAdminUsersByClientId(client.id).length

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
                      <Link href={`/admin/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
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

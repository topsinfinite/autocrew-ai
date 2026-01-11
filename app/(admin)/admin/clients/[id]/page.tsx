export const dynamic = 'force-dynamic';

import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Bot, Users, TrendingUp, Calendar } from "lucide-react"
import { format } from "date-fns"
import { db } from "@/db"
import { member } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getClient, getCrews, getOrganizationUsers, getConversations } from "@/lib/dal"

async function getClientWithData(id: string) {
  try {
    // Use DAL to fetch client (auth check handled in DAL)
    const client = await getClient(id)

    if (!client) {
      return null
    }

    // Use DAL to fetch related data (auth checks handled in DAL)
    const [clientCrews, users, clientConversations, clientMembers] = await Promise.all([
      getCrews({ clientId: id }), // Filtered by clientId
      getOrganizationUsers(id), // Users for this organization
      getConversations({ clientId: id }), // Filtered by clientId
      db.select().from(member).where(eq(member.organizationId, id)), // Members table
    ]);

    return {
      client,
      crews: clientCrews,
      members: clientMembers,
      users: users,
      conversations: clientConversations,
    }
  } catch (error) {
    console.error('Error fetching client:', error)
    return null
  }
}

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getClientWithData(id)

  if (!data) {
    notFound()
  }

  const { client, crews: clientCrews, members, users: memberUsers, conversations: clientConversations } = data

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
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/clients">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {client.companyName}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                {client.clientCode}
              </Badge>
            </div>
            <p className="text-muted-foreground">{client.contactPersonName}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getPlanColor(client.plan)}>{client.plan}</Badge>
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Crews
            </CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clientCrews.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned AI crews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {members.length}
            </div>
            <p className="text-xs text-muted-foreground">Client admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversations
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clientConversations.length}
            </div>
            <p className="text-xs text-muted-foreground">Total handled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Member Since
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {format(new Date(client.createdAt), "MMM yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(
                (Date.now() - new Date(client.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Client Code
              </p>
              <Badge variant="outline" className="font-mono">
                {client.clientCode}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Company Name
              </p>
              <p className="text-foreground">{client.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Person
              </p>
              <p className="text-foreground">{client.contactPersonName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Email
              </p>
              <p className="text-foreground">{client.contactEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone
              </p>
              <p className="text-foreground">
                {client.phone || <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Subscription Plan
              </p>
              <Badge className={getPlanColor(client.plan)}>
                {client.plan}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account Status
              </p>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-foreground">
                {format(new Date(client.createdAt), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-foreground">
                {format(new Date(client.updatedAt), "PPP")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-foreground">
                {client.address || <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                City
              </p>
              <p className="text-foreground">
                {client.city || <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Country
              </p>
              <p className="text-foreground">
                {client.country || <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Assigned Crews */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Crews</CardTitle>
          </CardHeader>
          <CardContent>
            {clientCrews.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crew Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCrews.map((crew) => (
                    <TableRow key={crew.id}>
                      <TableCell className="font-medium">
                        {crew.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{crew.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-500">
                          {crew.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No crews assigned yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            {memberUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No users found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

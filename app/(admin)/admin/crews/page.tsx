import { CrewAssignmentDialog } from "@/components/admin/crew-assignment-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bot } from "lucide-react"
import {
  mockClients,
  mockCrewAssignments,
  getClientById,
} from "@/lib/mock-data/multi-tenant-data"
import { dummyCrews } from "@/lib/dummy-data"
import { format } from "date-fns"

export default function CrewsPage() {
  // Prepare client data for the dialog
  const clientsForDialog = mockClients.map((c) => ({
    id: c.id,
    name: c.companyName,
  }))

  // Prepare crew data for the dialog
  const crewsForDialog = dummyCrews.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crew Assignments</h1>
          <p className="text-muted-foreground">
            Manage AI crew assignments across client organizations
          </p>
        </div>
        <CrewAssignmentDialog
          clients={clientsForDialog}
          crews={crewsForDialog}
        />
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {mockCrewAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Crews
            </CardTitle>
            <Bot className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dummyCrews.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to assign
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <Bot className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Set(mockCrewAssignments.map((a) => a.clientId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              With assigned crews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Current Assignments
          </h2>
          <p className="text-sm text-muted-foreground">
            View all crew-to-client assignments
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Crew Name</TableHead>
              <TableHead>Crew Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCrewAssignments.map((assignment) => {
              const client = getClientById(assignment.clientId)
              const crew = dummyCrews.find((c) => c.id === assignment.crewId)

              if (!client || !crew) return null

              return (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {client.companyName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {client.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
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
                  <TableCell className="text-muted-foreground">
                    {format(assignment.assignedAt, "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import { getUsers, getClients } from "@/lib/dal";
import { db } from "@/db";
import { member, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateClientAdminDialog } from "@/components/admin/create-client-admin-dialog";
import { ResendInvitationButton } from "@/components/admin/resend-invitation-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Building2, Shield, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface UserWithOrganization {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  organizationId?: string | null;
  organizationName?: string | null;
  hasPassword: boolean;
}

async function getUsersWithOrganizations(): Promise<UserWithOrganization[]> {
  // Use DAL to fetch all users (auth check handled in DAL)
  const usersData = await getUsers();

  // Fetch memberships (no auth needed - filtered by users we have access to)
  const memberships = await db.select().from(member);

  // Fetch accounts to check password status
  const accounts = await db.select().from(account);

  // Use DAL to fetch all clients (auth check handled in DAL)
  const allClients = await getClients();

  // Map users to include organization info and password status
  const usersWithOrgs = usersData.map((u) => {
    const membership = memberships.find((m) => m.userId === u.id);
    const organization = membership
      ? allClients.find((c) => c.id === membership.organizationId)
      : null;

    // Check if user has a password set
    const userAccount = accounts.find(
      (a) => a.userId === u.id && a.providerId === 'credential'
    );
    const hasPassword = !!(userAccount?.password);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
      organizationId: membership?.organizationId,
      organizationName: organization?.companyName,
      hasPassword,
    };
  });

  return usersWithOrgs;
}

export default async function UsersPage() {
  // Auth and role checks handled by AdminLayout
  // Fetch data using DAL (auth checks included)
  const users = await getUsersWithOrganizations();
  const allClients = await getClients();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500/10 text-purple-500";
      case "client_admin":
        return "bg-primary/10 text-primary";
      case "viewer":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const clientAdmins = users.filter((u) => u.role === "client_admin");
  const superAdmins = users.filter((u) => u.role === "super_admin");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage client admin users and their access
          </p>
        </div>
        <CreateClientAdminDialog clients={allClients} />
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All platform users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Client Admins
            </CardTitle>
            <UserCheck className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clientAdmins.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active administrators
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Super Admins
            </CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {superAdmins.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform administrators
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            All Platform Users
          </h2>
          <p className="text-sm text-muted-foreground">
            View and manage all user accounts
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Password Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground">
                    {user.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === "super_admin"
                        ? "Super Admin"
                        : user.role === "client_admin"
                        ? "Client Admin"
                        : "Viewer"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.organizationName ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {user.organizationName}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Platform Admin
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.hasPassword ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-600">
                        ✓ Password Set
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-600">
                        ⏳ Pending Setup
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {!user.hasPassword && user.role !== "super_admin" && (
                      <ResendInvitationButton
                        email={user.email}
                        userName={user.name}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

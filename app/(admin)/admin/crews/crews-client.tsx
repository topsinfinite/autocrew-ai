"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCrew, deleteCrew } from "@/lib/api/crews";
import { Crew, CrewType, CrewStatus, NewCrewInput, Client } from "@/types";
import { Plus, Trash2, AlertCircle, Users, Link, Settings, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

interface AdminCrewsClientProps {
  initialCrews: Crew[];
  initialClients: Client[];
}

export function AdminCrewsClient({
  initialCrews,
  initialClients,
}: AdminCrewsClientProps) {
  const [crews, setCrews] = useState<Crew[]>(initialCrews);
  const [clients] = useState<Client[]>(initialClients);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [formData, setFormData] = useState<NewCrewInput>({
    name: "",
    clientId: "",
    type: "customer_support",
    webhookUrl: "",
    status: "inactive",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Export the create button handler for the parent component
  const handleOpenCreate = () => setIsCreateOpen(true);

  const handleCreate = async () => {
    if (!formData.name || !formData.clientId || !formData.webhookUrl) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const newCrew = await createCrew(formData);
      setCrews([...crews, newCrew]);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create crew"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCrew) return;

    try {
      setSubmitting(true);
      setError(null);

      await deleteCrew(selectedCrew.id);
      setCrews(crews.filter((crew) => crew.id !== selectedCrew.id));
      setIsDeleteOpen(false);
      setSelectedCrew(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete crew"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      clientId: "",
      type: "customer_support",
      webhookUrl: "",
      status: "inactive",
    });
    setError(null);
  };

  const openDeleteDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsDeleteOpen(true);
    setError(null);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.clientCode === clientId);
    return client?.companyName || clientId;
  };

  // Calculate stats
  const stats = {
    total: crews.length,
    active: crews.filter((c) => c.status === "active").length,
    byType: {
      customer_support: crews.filter((c) => c.type === "customer_support")
        .length,
      lead_generation: crews.filter((c) => c.type === "lead_generation")
        .length,
    },
  };

  return (
    <>
      {/* Page Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Crew Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage AI agent crews for your clients
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Crew
        </Button>
      </div>

      {/* Error Alert */}
      {error && !isCreateOpen && !isDeleteOpen && (
        <Card className="border-destructive mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Support Crews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byType.customer_support}
            </div>
            <p className="text-xs text-muted-foreground">Customer support</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lead Gen Crews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byType.lead_generation}
            </div>
            <p className="text-xs text-muted-foreground">Lead generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Crews Table or Empty State */}
      {crews.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Crews Created Yet"
          description="Create your first AI agent crew and assign it to a client. Crews can handle customer support or lead generation tasks via n8n workflows."
          actionLabel="Create Your First Crew"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Crews ({crews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crew Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Crew Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crews.map((crew) => (
                  <TableRow key={crew.id}>
                    <TableCell className="font-medium">{crew.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getClientName(crew.clientId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {crew.clientId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {crew.crewCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          crew.type === "customer_support"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {crew.type === "customer_support"
                          ? "Customer Support"
                          : "Lead Generation"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          crew.status === "active"
                            ? "success"
                            : crew.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {crew.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Managed by client admin
                      </p>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {crew.webhookUrl}
                      </code>
                    </TableCell>
                    <TableCell>
                      {new Date(crew.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(crew)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Crew Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl p-0">
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Create New Crew</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    Configure a new AI agent crew for a client
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Client Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Client & Crew Details</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium">
                  Client <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                >
                  <SelectTrigger id="client" className="h-10">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.clientCode}>
                        <div>
                          <div className="font-medium text-foreground">{client.companyName}</div>
                          <div className="text-xs text-muted-foreground">
                            {client.clientCode}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Crew Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., ACME Customer Support Crew"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Crew Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as CrewType })
                  }
                >
                  <SelectTrigger id="type" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_support">
                      Customer Support
                    </SelectItem>
                    <SelectItem value="lead_generation">
                      Lead Generation
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.type === "customer_support"
                    ? "Creates vector and histories tables for conversation storage"
                    : "No database tables created for lead generation crews"}
                </p>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Link className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Webhook Configuration</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-sm font-medium">
                  n8n Webhook URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://n8n.example.com/webhook/..."
                  value={formData.webhookUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, webhookUrl: e.target.value })
                  }
                  className="h-10 font-mono text-sm"
                />
              </div>
            </div>

            {/* Initial Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Initial Status</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as CrewStatus })
                  }
                >
                  <SelectTrigger id="status" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Testing Only)</SelectItem>
                    <SelectItem value="inactive">Inactive (Recommended)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Set to &apos;Active&apos; only for testing. Client admins will activate crews after configuration.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Crew
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {/* Elegant Header with Destructive Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent dark:from-destructive/20 dark:via-destructive/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/20">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Delete Crew</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    This action cannot be undone
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {selectedCrew && (
              <div className="p-4 bg-muted/50 border border-border rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Users className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{selectedCrew.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedCrew.crewCode} • {getClientName(selectedCrew.clientId)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-destructive font-medium">
                    This will permanently delete:
                  </p>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      The crew configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      Associated database tables (vector & histories)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedCrew(null);
                  setError(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
                className="gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Crew
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}

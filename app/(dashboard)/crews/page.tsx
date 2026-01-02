"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCrews, updateCrew } from "@/lib/api/crews";
import { Crew } from "@/types";
import { Pencil, Users, Loader2, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useClient } from "@/lib/hooks/use-client";

export default function CrewsPage() {
  const { selectedClient } = useClient();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch crews when client changes
  useEffect(() => {
    async function fetchCrews() {
      try {
        setLoading(true);
        setError(null);

        const crewsData = await getCrews({
          clientId: selectedClient?.clientCode,
        });

        setCrews(crewsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load crews"
        );
        console.error("Failed to fetch crews:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedClient) {
      fetchCrews();
    } else {
      setCrews([]);
      setLoading(false);
    }
  }, [selectedClient]);

  // Toggle crew status (active/inactive)
  const handleToggleStatus = async (crew: Crew) => {
    const newStatus = crew.status === "active" ? "inactive" : "active";

    try {
      const updatedCrew = await updateCrew(crew.id, { status: newStatus });

      setCrews(
        crews.map((c) => (c.id === crew.id ? updatedCrew : c))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update crew status"
      );
    }
  };

  // Open edit webhook URL dialog
  const openEditDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setWebhookUrl(crew.webhookUrl);
    setIsEditOpen(true);
    setError(null);
  };

  // Save webhook URL
  const handleSaveWebhook = async () => {
    if (!selectedCrew) return;

    if (!webhookUrl.trim()) {
      setError("Webhook URL cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updatedCrew = await updateCrew(selectedCrew.id, {
        webhookUrl: webhookUrl.trim(),
      });

      setCrews(
        crews.map((c) => (c.id === selectedCrew.id ? updatedCrew : c))
      );

      setIsEditOpen(false);
      setSelectedCrew(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update webhook URL"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate stats
  const stats = {
    totalCrews: crews.length,
    activeCrews: crews.filter((c) => c.status === "active").length,
    supportCrews: crews.filter((c) => c.type === "customer_support").length,
    leadGenCrews: crews.filter((c) => c.type === "lead_generation").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Crews</h1>
          <p className="text-muted-foreground">
            {selectedClient
              ? `Manage your AI agent crews for ${selectedClient.companyName}`
              : "Select a client to view their crews"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && !isEditOpen && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrews}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCrews}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supportCrews}</div>
            <p className="text-xs text-muted-foreground">Customer support</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Gen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leadGenCrews}</div>
            <p className="text-xs text-muted-foreground">Lead generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Crews Table or Empty State */}
      {!loading && !selectedClient ? (
        <EmptyState
          icon={Users}
          title="No Client Selected"
          description="Please select a client from the dropdown above to view and manage their crews."
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : !loading && crews.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Crews Assigned"
          description="No AI agent crews have been assigned to your organization yet. Contact your administrator to request crew assignment."
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : !loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Crews ({crews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Crew Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crews.map((crew) => (
                  <TableRow key={crew.id}>
                    <TableCell className="font-medium">{crew.name}</TableCell>
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
                    <TableCell className="max-w-xs truncate">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {crew.webhookUrl}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={crew.status === "active"}
                          onCheckedChange={() => handleToggleStatus(crew)}
                        />
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
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(crew.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(crew)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit URL
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {/* Edit Webhook URL Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Webhook URL</DialogTitle>
            <DialogDescription>
              Update the n8n webhook URL for this crew
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {selectedCrew && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Crew
                </Label>
                <p className="text-sm font-medium">{selectedCrew.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCrew.crewCode}
                </p>
              </div>

              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://n8n.example.com/webhook/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedCrew(null);
                setError(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

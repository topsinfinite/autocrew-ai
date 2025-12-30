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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dummyCrews } from "@/lib/dummy-data";
import { Crew, CrewType } from "@/types";
import { Plus, Pencil, Trash2, AlertCircle, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function CrewsPage() {
  const [crews, setCrews] = useState<Crew[]>(dummyCrews);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Support" as CrewType,
    n8nWebhookUrl: "",
    status: "active" as "active" | "inactive" | "error",
  });

  const handleCreate = () => {
    const newCrew: Crew = {
      id: `crew-${Date.now()}`,
      clientId: "client-1", // TODO: Get from current client context
      userId: "user-1",
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCrews([...crews, newCrew]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCrew) return;
    setCrews(
      crews.map((crew) =>
        crew.id === selectedCrew.id
          ? { ...crew, ...formData, updatedAt: new Date() }
          : crew
      )
    );
    setIsEditOpen(false);
    resetForm();
    setSelectedCrew(null);
  };

  const handleDelete = () => {
    if (!selectedCrew) return;
    setCrews(crews.filter((crew) => crew.id !== selectedCrew.id));
    setIsDeleteOpen(false);
    setSelectedCrew(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Support",
      n8nWebhookUrl: "",
      status: "active",
    });
  };

  const openEditDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setFormData({
      name: crew.name,
      type: crew.type,
      n8nWebhookUrl: crew.n8nWebhookUrl,
      status: crew.status,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Crews</h1>
          <p className="text-muted-foreground">
            Manage your AI agent crews and configurations
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Crew
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crews.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crews.filter((c) => c.status === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crews Table or Empty State */}
      {crews.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Agent Crews Yet"
          description="Get started by creating your first AI agent crew. Configure n8n workflows to automate customer support or lead generation."
          actionLabel="Create Your First Crew"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
                    <Badge
                      variant={crew.type === "Support" ? "default" : "secondary"}
                    >
                      {crew.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {crew.n8nWebhookUrl}
                    </code>
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
                  </TableCell>
                  <TableCell>
                    {new Date(crew.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(crew)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(crew)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Crew</DialogTitle>
            <DialogDescription>
              Configure a new AI agent crew for your business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Customer Support Crew"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as CrewType })
                }
              >
                <option value="Support">Support</option>
                <option value="LeadGen">Lead Generation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">n8n Webhook URL</label>
              <Input
                placeholder="https://n8n.example.com/webhook/..."
                value={formData.n8nWebhookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, n8nWebhookUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive" | "error",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Crew</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Crew</DialogTitle>
            <DialogDescription>
              Update the crew configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Customer Support Crew"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as CrewType })
                }
              >
                <option value="Support">Support</option>
                <option value="LeadGen">Lead Generation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">n8n Webhook URL</label>
              <Input
                placeholder="https://n8n.example.com/webhook/..."
                value={formData.n8nWebhookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, n8nWebhookUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive" | "error",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Crew</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this crew? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedCrew && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">{selectedCrew.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCrew.type}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Crew
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

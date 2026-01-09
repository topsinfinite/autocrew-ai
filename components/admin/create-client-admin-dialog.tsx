"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Client {
  id: string;
  companyName: string;
  clientCode: string;
}

interface CreateClientAdminDialogProps {
  clients: Client[];
  onSuccess?: () => void;
}

export function CreateClientAdminDialog({
  clients,
  onSuccess,
}: CreateClientAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clientId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/create-client-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create client admin");
        setIsLoading(false);
        return;
      }

      setSuccess(
        `Client admin created successfully! ${result.message || ""}`
      );
      setFormData({ name: "", email: "", clientId: "" });

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setFormData({ name: "", email: "", clientId: "" });
        setError(null);
        setSuccess(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Client Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Client Admin</DialogTitle>
          <DialogDescription>
            Create a new Client Admin user and assign them to an organization.
            They will receive an email to set their password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Success Alert */}
            {success && (
              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Client Selection */}
            <div className="grid gap-2">
              <Label htmlFor="clientId">Organization *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName} ({client.clientCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isLoading}
                required
              />
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                The user will receive an email to set their password
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Admin
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

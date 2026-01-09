"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteClient } from "@/lib/api/clients";
import type { Client } from "@/types";

interface ClientActionsProps {
  client: Client;
  crewCount: number;
  userCount: number;
  onDelete?: () => void;
}

export function ClientActions({
  client,
  crewCount,
  userCount,
  onDelete,
}: ClientActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      await deleteClient(client.id);

      // Close dialog and notify parent
      setIsDeleteOpen(false);
      if (onDelete) {
        onDelete();
      } else {
        // Refresh the page if no callback provided
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link href={`/admin/clients/${client.id}`}>
          <Button variant="ghost" size="sm">
            View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delete Client Organization</DialogTitle>
            <DialogDescription>
              This action will permanently delete all data associated with this
              client. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Client Info Card */}
          <div className="p-4 bg-muted border border-white dark:border-border rounded-lg space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-semibold text-lg text-foreground">
                {client.companyName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Client Code</p>
                <code className="text-foreground font-mono">
                  {client.clientCode}
                </code>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="text-foreground">{client.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Warning Card */}
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-destructive">
                  The following data will be permanently deleted:
                </p>
                <ul className="space-y-1 text-sm text-destructive/90">
                  <li>• {crewCount} AI crew{crewCount !== 1 ? "s" : ""} (including database tables)</li>
                  <li>• All conversation history</li>
                  <li>
                    • {userCount} user account{userCount !== 1 ? "s" : ""} (if they
                    only belong to this organization)
                  </li>
                  <li>• All organization settings and configurations</li>
                </ul>
                <p className="text-sm text-destructive font-semibold mt-3">
                  This action is irreversible and complies with data deletion
                  requests (GDPR/CCPA).
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Client & All Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

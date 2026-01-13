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
        <DialogContent className="max-w-2xl p-0">
          {/* Elegant Header with Destructive Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent dark:from-destructive/20 dark:via-destructive/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/20">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Delete Client Organization</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    This action will permanently delete all data
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Client Info Card */}
            <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Company</p>
                <p className="font-semibold text-lg text-foreground">
                  {client.companyName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Client Code</p>
                  <code className="text-foreground font-mono text-sm">
                    {client.clientCode}
                  </code>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-foreground">{client.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-destructive">
                    The following data will be permanently deleted:
                  </p>
                  <ul className="space-y-1.5 text-sm text-destructive/90">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      {crewCount} AI crew{crewCount !== 1 ? "s" : ""} (including database tables)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      All conversation history
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      {userCount} user account{userCount !== 1 ? "s" : ""} (if they only belong to this organization)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      All organization settings and configurations
                    </li>
                  </ul>
                  <p className="text-sm text-destructive font-semibold mt-3 pt-3 border-t border-destructive/20">
                    This action is irreversible and complies with data deletion
                    requests (GDPR/CCPA).
                  </p>
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
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Client & All Data
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

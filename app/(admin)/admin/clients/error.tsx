"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AdminClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin clients page error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">
          Manage all clients and organizations
        </p>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              An error occurred while loading clients. This might be a temporary issue.
            </p>
            {error.message && (
              <p className="text-sm font-mono bg-muted p-3 rounded">
                {error.message}
              </p>
            )}
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => window.location.href = '/admin'} variant="outline">
              Go to Admin Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

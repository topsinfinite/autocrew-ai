"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResendInvitationButtonProps {
  email: string;
  userName: string;
}

export function ResendInvitationButton({ email, userName }: ResendInvitationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('[Resend Invitation Button] Sending request for:', email);

      const response = await fetch('/api/admin/resend-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('[Resend Invitation Button] Response status:', response.status);

      const data = await response.json();
      console.log('[Resend Invitation Button] Response data:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to resend invitation';
        const errorDetails = data.details ? ` (${JSON.stringify(data.details)})` : '';
        console.error('[Resend Invitation Button] Error:', errorMessage, errorDetails);
        setError(errorMessage + errorDetails);
        setIsLoading(false);
        return;
      }

      console.log('[Resend Invitation Button] Success!');
      setSuccess(true);
      // Refresh the page data
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('[Resend Invitation Button] Unexpected error:', err);
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">Sent!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleResend}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-3 w-3" />
            Resend Invitation
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

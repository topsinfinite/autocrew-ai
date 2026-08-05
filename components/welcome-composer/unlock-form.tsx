"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UnlockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/internal/welcome-composer";
  const configError = searchParams.get("error") === "misconfigured";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    configError
      ? "WELCOME_COMPOSER_SECRET is not set on the server."
      : null,
  );
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/internal/welcome-composer/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? "Unlock failed");
      return;
    }

    startTransition(() => {
      router.replace(nextPath);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-sm space-y-4 rounded-lg border border-border bg-background/40 p-6"
    >
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          Unlock Welcome Composer
        </h1>
        <p className="text-sm text-muted-foreground">
          Sales / CS only. Enter the shared secret from{" "}
          <code className="text-xs">WELCOME_COMPOSER_SECRET</code>.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending || !password}>
        {pending ? "Unlocking…" : "Unlock"}
      </Button>
    </form>
  );
}

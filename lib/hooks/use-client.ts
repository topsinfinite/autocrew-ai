"use client";

import { useClientContext } from "@/lib/contexts/client-context";

export function useClient() {
  return useClientContext();
}

export const dynamic = 'force-dynamic';

import { getCrews, getClients } from "@/lib/dal";
import { AdminCrewsClient } from "./crews-client";
import type { Crew, Client, CrewConfig } from "@/types";

// This is now a Server Component - no "use client" directive
export default async function AdminCrewsPage() {
  // Use DAL to fetch data (auth checks handled in DAL)
  const [crewsDataRaw, clientsData] = await Promise.all([
    getCrews(), // SuperAdmin sees all crews
    getClients(), // SuperAdmin only
  ]);

  // Transform database results to match application types
  const crewsData: Crew[] = crewsDataRaw.map((crew) => ({
    ...crew,
    config: crew.config as CrewConfig,
  }));

  return (
    <div className="p-8">
      {/* Client Component with server-fetched data */}
      <AdminCrewsClient
        initialCrews={crewsData}
        initialClients={clientsData}
      />
    </div>
  );
}

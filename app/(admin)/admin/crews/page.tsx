import { db } from "@/db";
import { crews, clients } from "@/db/schema";
import { desc } from "drizzle-orm";
import { AdminCrewsClient } from "./crews-client";
import type { Crew, Client, CrewConfig } from "@/types";

// This is now a Server Component - no "use client" directive
export default async function AdminCrewsPage() {
  // Fetch data on the server using async/await
  const [crewsDataRaw, clientsDataRaw] = await Promise.all([
    db.select().from(crews).orderBy(desc(crews.createdAt)),
    db.select().from(clients).orderBy(clients.companyName),
  ]);

  // Transform database results to match application types
  const crewsData: Crew[] = crewsDataRaw.map((crew) => ({
    ...crew,
    config: crew.config as CrewConfig,
  }));

  const clientsData: Client[] = clientsDataRaw.map((client) => ({
    ...client,
    phone: client.phone ?? undefined,
    address: client.address ?? undefined,
    city: client.city ?? undefined,
    country: client.country ?? undefined,
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

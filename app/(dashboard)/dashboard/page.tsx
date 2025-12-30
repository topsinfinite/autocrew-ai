"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  dummyDashboardStats,
  dummyCrews,
  dummyConversations,
  dummyLeads,
} from "@/lib/dummy-data";
import { Activity, Users, MessageSquare, TrendingUp, Plus, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { useClient } from "@/lib/hooks/use-client";

export default function DashboardPage() {
  const { selectedClient } = useClient();

  // Filter data by selected client
  const clientCrews = selectedClient
    ? dummyCrews.filter((crew) => crew.clientId === selectedClient.id)
    : [];
  const clientConversations = selectedClient
    ? dummyConversations.filter((conv) => conv.clientId === selectedClient.id)
    : [];
  const clientLeads = selectedClient
    ? dummyLeads.filter((lead) => lead.clientId === selectedClient.id)
    : [];

  // Calculate client-specific stats
  const stats = {
    totalCrews: clientCrews.length,
    activeCrews: clientCrews.filter((c) => c.status === "active").length,
    totalConversations: clientConversations.length,
    totalLeads: clientLeads.length,
  };

  const recentConversations = clientConversations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Dashboard
            <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your AI agent crews and performance metrics
          </p>
        </div>
        <Link href="/crews">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Crew
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCrews} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leads Generated
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {clientLeads.filter((l) => l.status === "qualified").length}{" "}
              qualified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Crews
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCrews}</div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Crews */}
      {clientCrews.filter((crew) => crew.status === "active").length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Active Crews"
          description="Create and activate your first AI agent crew to start automating customer interactions and generating leads."
          actionLabel="Create Your First Crew"
          onAction={() => window.location.href = '/crews'}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Agent Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientCrews
                .filter((crew) => crew.status === "active")
                .map((crew) => (
                <div
                  key={crew.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{crew.name}</h3>
                      <Badge
                        variant={
                          crew.type === "Support" ? "default" : "secondary"
                        }
                      >
                        {crew.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {crew.n8nWebhookUrl}
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Conversations */}
      {recentConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Conversations Yet"
          description="Once your agent crews start handling customer interactions, their conversations will appear here with full transcripts and analytics."
          actionLabel="View All Conversations"
          onAction={() => window.location.href = '/conversations'}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {conv.metadata.customerName || "Anonymous"}
                    </h3>
                    {conv.metadata.sentiment && (
                      <Badge
                        variant={
                          conv.metadata.sentiment === "positive"
                            ? "success"
                            : conv.metadata.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {conv.metadata.sentiment}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {conv.transcript[0]?.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conv.createdAt).toLocaleDateString()} at{" "}
                    {new Date(conv.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {conv.metadata.resolved && (
                  <Badge variant="outline">Resolved</Badge>
                )}
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

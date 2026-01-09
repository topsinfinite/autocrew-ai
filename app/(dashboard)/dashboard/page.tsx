"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getConversations } from "@/lib/api/conversations";
import { Conversation, Crew, Lead } from "@/types";
import { Activity, Users, MessageSquare, TrendingUp, Plus, Sparkles, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { useClient } from "@/lib/hooks/use-client";
import { useAuth } from "@/lib/hooks/use-auth";

export default function DashboardPage() {
  const { selectedClient } = useClient();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingCrews, setLoadingCrews] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Fetch data when client changes
  useEffect(() => {
    async function fetchData() {
      if (!selectedClient) return;

      try {
        // Fetch conversations
        setLoadingConversations(true);
        const conversationsRes = await getConversations({
          clientId: selectedClient?.clientCode,
        });
        setConversations(conversationsRes.conversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]);
      } finally {
        setLoadingConversations(false);
      }

      try {
        // Fetch crews
        setLoadingCrews(true);
        const crewsRes = await fetch(`/api/crews?clientId=${selectedClient.id}`);
        const crewsData = await crewsRes.json();
        setCrews(crewsData.success ? crewsData.data : []);
      } catch (error) {
        console.error('Failed to fetch crews:', error);
        setCrews([]);
      } finally {
        setLoadingCrews(false);
      }

      try {
        // Fetch leads
        setLoadingLeads(true);
        const leadsRes = await fetch(`/api/leads?clientId=${selectedClient.id}`);
        const leadsData = await leadsRes.json();
        setLeads(leadsData.success ? leadsData.data : []);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        setLeads([]);
      } finally {
        setLoadingLeads(false);
      }
    }

    fetchData();
  }, [selectedClient]);

  // Calculate client-specific stats
  const stats = {
    totalCrews: crews.length,
    activeCrews: crews.filter((c) => c.status === "active").length,
    totalConversations: conversations.length,
    totalLeads: leads.length,
  };

  const recentConversations = conversations.slice(0, 5);

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
        {user?.role === "super_admin" && (
          <Link href="/admin/crews">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Crew
            </Button>
          </Link>
        )}
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
              {leads.filter((l) => l.status === "qualified").length}{" "}
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
      {loadingCrews ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : crews.filter((crew) => crew.status === "active").length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Active Crews"
          description={
            user?.role === "super_admin"
              ? "Create and activate your first AI agent crew to start automating customer interactions and generating leads."
              : "No AI agent crews are currently active. Contact your administrator to activate crews for your organization."
          }
          actionLabel={user?.role === "super_admin" ? "Create Your First Crew" : undefined}
          onAction={user?.role === "super_admin" ? () => window.location.href = '/admin/crews' : undefined}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Agent Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crews
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
                          crew.type === "customer_support" ? "default" : "secondary"
                        }
                      >
                        {crew.type === "customer_support" ? "Customer Support" : "Lead Generation"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {crew.webhookUrl}
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
      {loadingConversations ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : recentConversations.length === 0 ? (
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
                    {conv.metadata.customerEmail || 'No email'} •
                    {conv.metadata.duration ? ` ${Math.floor(conv.metadata.duration / 60)}m ${conv.metadata.duration % 60}s` : ' Unknown duration'}
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

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { dummyDashboardStats, dummyConversations, dummyLeads } from "@/lib/dummy-data";
import { DateRange } from "react-day-picker";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subDays } from "date-fns";
import { useClient } from "@/lib/hooks/use-client";

export default function AnalyticsPage() {
  const { selectedClient } = useClient();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Filter data based on client and date range
  const filteredData = useMemo(() => {
    // First filter by client
    const clientConversations = selectedClient
      ? dummyConversations.filter((conv) => conv.clientId === selectedClient.id)
      : dummyConversations;
    const clientLeads = selectedClient
      ? dummyLeads.filter((lead) => lead.clientId === selectedClient.id)
      : dummyLeads;

    if (!dateRange?.from || !dateRange?.to) {
      return {
        conversations: clientConversations,
        leads: clientLeads,
        conversationVolume: dummyDashboardStats.conversationVolume,
        leadsGenerated: dummyDashboardStats.leadsGenerated,
      };
    }

    const conversations = clientConversations.filter((conv) => {
      const date = new Date(conv.createdAt);
      return date >= dateRange.from! && date <= dateRange.to!;
    });

    const leads = clientLeads.filter((lead) => {
      const date = new Date(lead.createdAt);
      return date >= dateRange.from! && date <= dateRange.to!;
    });

    return {
      conversations,
      leads,
      conversationVolume: dummyDashboardStats.conversationVolume,
      leadsGenerated: dummyDashboardStats.leadsGenerated,
    };
  }, [dateRange, selectedClient]);

  // Combine conversation and lead data for chart
  const chartData = useMemo(() => {
    const dataMap = new Map();

    filteredData.conversationVolume.forEach(item => {
      dataMap.set(item.date, { date: item.date, conversations: item.count, leads: 0 });
    });

    filteredData.leadsGenerated.forEach(item => {
      const existing = dataMap.get(item.date) || { date: item.date, conversations: 0 };
      dataMap.set(item.date, { ...existing, leads: item.count });
    });

    return Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Track performance metrics and gain actionable insights
          </p>
        </div>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.conversations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.leads.length}
            </div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45s</div>
            <p className="text-xs text-muted-foreground">
              -12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (filteredData.conversations.filter((c) => c.metadata.resolved)
                  .length /
                  filteredData.conversations.length) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversation Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation Volume Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversations"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Conversations"
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leads Generated Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Generated Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Bar
                dataKey="leads"
                fill="hsl(var(--secondary))"
                name="Leads"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["positive", "neutral", "negative"].map((sentiment) => {
              const count = filteredData.conversations.filter(
                (c) => c.metadata.sentiment === sentiment
              ).length;
              const percentage =
                filteredData.conversations.length > 0
                  ? (count / filteredData.conversations.length) * 100
                  : 0;

              return (
                <div key={sentiment} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {sentiment}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${
                        sentiment === "positive"
                          ? "bg-green-500"
                          : sentiment === "negative"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

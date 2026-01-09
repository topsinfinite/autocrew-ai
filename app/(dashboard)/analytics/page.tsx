"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subDays, format as formatDate, eachDayOfInterval } from "date-fns";
import { useClient } from "@/lib/hooks/use-client";
import { Conversation, Lead } from "@/types";
import { getConversations } from "@/lib/api/conversations";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { selectedClient } = useClient();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when client or date range changes
  useEffect(() => {
    async function fetchData() {
      if (!selectedClient) return;

      try {
        setLoading(true);

        // Fetch conversations
        const conversationsRes = await getConversations({
          clientId: selectedClient?.clientCode,
        });
        setConversations(conversationsRes.conversations);

        // Fetch leads
        const leadsRes = await fetch(`/api/leads?clientId=${selectedClient.id}`);
        const leadsData = await leadsRes.json();
        setLeads(leadsData.success ? leadsData.data : []);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setConversations([]);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClient]);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return {
        conversations,
        leads,
      };
    }

    const filteredConversations = conversations.filter((conv) => {
      const date = new Date(conv.createdAt);
      return date >= dateRange.from! && date <= dateRange.to!;
    });

    const filteredLeads = leads.filter((lead) => {
      const date = new Date(lead.createdAt);
      return date >= dateRange.from! && date <= dateRange.to!;
    });

    return {
      conversations: filteredConversations,
      leads: filteredLeads,
    };
  }, [conversations, leads, dateRange]);

  // Generate chart data from actual conversations and leads
  const chartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    // Get all dates in range
    const dates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    // Count conversations and leads per date
    const dataMap = new Map();

    dates.forEach(date => {
      const dateStr = formatDate(date, 'yyyy-MM-dd');
      dataMap.set(dateStr, { date: dateStr, conversations: 0, leads: 0 });
    });

    filteredData.conversations.forEach(conv => {
      const dateStr = formatDate(new Date(conv.createdAt), 'yyyy-MM-dd');
      const existing = dataMap.get(dateStr);
      if (existing) {
        existing.conversations++;
      }
    });

    filteredData.leads.forEach(lead => {
      const dateStr = formatDate(new Date(lead.createdAt), 'yyyy-MM-dd');
      const existing = dataMap.get(dateStr);
      if (existing) {
        existing.leads++;
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

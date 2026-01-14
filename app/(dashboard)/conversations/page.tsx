"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getConversations, getConversationById } from "@/lib/api/conversations";
import { getCrews } from "@/lib/api/crews";
import { useClient } from "@/lib/hooks/use-client";
import { Conversation, Crew } from "@/types";
import { Eye, Search, MessageSquare, Loader2, ChevronLeft, ChevronRight, X, User, Users, Clock, Info } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

export default function ConversationsPage() {
  const { selectedClient } = useClient();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Date filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch conversations and crews on mount or when filters/pagination change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Calculate offset for pagination
        const offset = (currentPage - 1) * itemsPerPage;

        // Fetch conversations and crews in parallel
        const [{ conversations: conversationsData, count }, crewsData] = await Promise.all([
          getConversations({
            clientId: selectedClient?.clientCode,
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            limit: itemsPerPage,
            offset,
          }),
          getCrews({
            clientId: selectedClient?.clientCode,
          }),
        ]);

        setConversations(conversationsData);
        setTotalCount(count);
        setCrews(crewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClient, currentPage, dateRange]);

  // Reset to page 1 when date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange]);

  const filteredConversations = conversations.filter((conv) => {
    // If no search query, show all conversations
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      conv.metadata.customerName?.toLowerCase().includes(searchLower) ||
      conv.metadata.customerEmail?.toLowerCase().includes(searchLower)
    );
  });

  // Get crew name from crewId using the crews state
  const getCrewName = (crewId: string) => {
    const crew = crews.find((c) => c.id === crewId);
    return crew?.name || "Unknown Crew";
  };

  // Handle viewing conversation - fetch full transcript
  const handleViewConversation = async (conv: Conversation) => {
    setSelectedConversation(conv); // Show dialog immediately with metadata
    setLoadingTranscript(true);

    try {
      const fullConv = await getConversationById(conv.id);
      if (fullConv) {
        setSelectedConversation(fullConv); // Update with full transcript
      }
    } catch (err) {
      console.error('Failed to load transcript:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transcript');
    } finally {
      setLoadingTranscript(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          View and analyze all customer conversations
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateRange(undefined)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Conversations Table or Empty State */}
      {!loading && !error && filteredConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={searchQuery ? "No Conversations Found" : "No Conversations Yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "Once your agent crews start interacting with customers, their conversations will appear here. You'll be able to view transcripts, sentiment analysis, and resolution status."
          }
          actionLabel={!searchQuery ? "Create Your First Crew" : undefined}
          onAction={!searchQuery ? () => window.location.href = '/crews' : undefined}
        />
      ) : !loading && !error ? (
        <Card>
          <CardHeader>
            <CardTitle>All Conversations ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {conversation.metadata.customerName || "Anonymous"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {conversation.metadata.customerEmail || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCrewName(conversation.crewId)}</TableCell>
                  <TableCell>
                    {conversation.metadata.sentiment && (
                      <Badge
                        variant={
                          conversation.metadata.sentiment === "positive"
                            ? "success"
                            : conversation.metadata.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {conversation.metadata.sentiment}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {conversation.metadata.resolved ? (
                      <Badge variant="outline">Resolved</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {new Date(conversation.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(conversation.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {conversation.metadata.duration
                      ? `${Math.floor(conversation.metadata.duration / 60)}m ${
                          conversation.metadata.duration % 60
                        }s`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewConversation(conversation)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalCount > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} conversations
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      const totalPages = Math.ceil(totalCount / itemsPerPage);
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      ) : null}

      {/* Conversation Detail Dialog */}
      <Dialog
        open={!!selectedConversation}
        onOpenChange={() => setSelectedConversation(null)}
      >
        <DialogContent className="max-w-3xl w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-0">
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Conversation Details</DialogTitle>
                  {selectedConversation && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedConversation.metadata.customerName || "Anonymous"} • {new Date(selectedConversation.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          {selectedConversation && (
            <div className="p-6 space-y-6 overflow-hidden">
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</span>
                  </div>
                  <p className="font-semibold text-foreground truncate">
                    {selectedConversation.metadata.customerName || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedConversation.metadata.customerEmail || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Crew</span>
                  </div>
                  <p className="font-semibold text-foreground truncate">
                    {getCrewName(selectedConversation.crewId)}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</span>
                  </div>
                  <p className="text-foreground">
                    {new Date(selectedConversation.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-foreground">
                    {selectedConversation.metadata.duration
                      ? `${Math.floor(selectedConversation.metadata.duration / 60)}m ${selectedConversation.metadata.duration % 60}s`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedConversation.metadata.sentiment && (
                  <Badge
                    variant={
                      selectedConversation.metadata.sentiment === "positive"
                        ? "success"
                        : selectedConversation.metadata.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedConversation.metadata.sentiment}
                  </Badge>
                )}
                {selectedConversation.metadata.resolved ? (
                  <Badge variant="outline">Resolved</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                )}
              </div>

              {/* Transcript */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Conversation Transcript</h4>
                </div>

                {loadingTranscript ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : selectedConversation.transcript.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No transcript available</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedConversation.transcript.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-4 ${
                            message.role === "user"
                              ? "bg-muted/50 border border-border text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1.5 opacity-80">
                            {message.role === "user" ? "Customer" : "Assistant"}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                          <div className="text-xs opacity-60 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end">
              <Button onClick={() => setSelectedConversation(null)} className="px-6">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

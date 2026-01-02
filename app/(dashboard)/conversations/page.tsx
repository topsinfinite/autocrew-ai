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
import { Eye, Search, MessageSquare, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

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

  // Fetch conversations and crews on mount or when client changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch conversations and crews in parallel
        const [{ conversations: conversationsData }, crewsData] = await Promise.all([
          getConversations({
            clientId: selectedClient?.clientCode,
          }),
          getCrews({
            clientId: selectedClient?.clientCode,
          }),
        ]);

        setConversations(conversationsData);
        setCrews(crewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClient]);

  const filteredConversations = conversations.filter((conv) => {
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

      {/* Search */}
      {!loading && !error && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
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
            <CardTitle>All Conversations ({filteredConversations.length})</CardTitle>
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
        </CardContent>
      </Card>
      ) : null}

      {/* Conversation Detail Dialog */}
      <Dialog
        open={!!selectedConversation}
        onOpenChange={() => setSelectedConversation(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conversation Details</DialogTitle>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Customer
                  </h3>
                  <p className="text-sm">
                    {selectedConversation.metadata.customerName || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.metadata.customerEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Crew
                  </h3>
                  <p className="text-sm">
                    {getCrewName(selectedConversation.crewId)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Date & Time
                  </h3>
                  <p className="text-sm">
                    {new Date(
                      selectedConversation.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Duration
                  </h3>
                  <p className="text-sm">
                    {selectedConversation.metadata.duration
                      ? `${Math.floor(
                          selectedConversation.metadata.duration / 60
                        )}m ${selectedConversation.metadata.duration % 60}s`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2">
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
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Conversation Transcript
                </h3>
                {loadingTranscript ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : selectedConversation.transcript.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No transcript available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedConversation.transcript.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="text-xs font-medium mb-1">
                            {message.role === "user" ? "Customer" : "Assistant"}
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

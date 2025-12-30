"use client";

import { useState } from "react";
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
import { dummyConversations, dummyCrews } from "@/lib/dummy-data";
import { Conversation } from "@/types";
import { Eye, Search, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = dummyConversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.metadata.customerName?.toLowerCase().includes(searchLower) ||
      conv.metadata.customerEmail?.toLowerCase().includes(searchLower) ||
      conv.transcript.some((msg) =>
        msg.content.toLowerCase().includes(searchLower)
      )
    );
  });

  const getCrewName = (crewId: string) => {
    return dummyCrews.find((c) => c.id === crewId)?.name || "Unknown";
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

      {/* Search */}
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

      {/* Conversations Table or Empty State */}
      {filteredConversations.length === 0 ? (
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
      ) : (
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
                      onClick={() => setSelectedConversation(conversation)}
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
      )}

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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

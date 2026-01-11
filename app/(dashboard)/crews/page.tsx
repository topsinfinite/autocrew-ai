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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCrews, updateCrew, updateCrewConfig } from "@/lib/api/crews";
import { Crew } from "@/types";
import { Pencil, Users, Loader2, AlertCircle, Mail, Check, Copy, Code2, MessageCircle, Upload } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useClient } from "@/lib/hooks/use-client";
import { ActivationWizard } from "@/components/crews/activation-wizard";
import { KnowledgeBaseManagerDialog } from "@/components/crews/knowledge-base-manager-dialog";

export default function CrewsPage() {
  const { selectedClient } = useClient();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportClientName, setSupportClientName] = useState("");
  const [allowedDomain, setAllowedDomain] = useState("");
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedCrewForWizard, setSelectedCrewForWizard] = useState<Crew | null>(null);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [selectedCrewForKB, setSelectedCrewForKB] = useState<Crew | null>(null);

  // Fetch crews when client changes
  useEffect(() => {
    async function fetchCrews() {
      try {
        setLoading(true);
        setError(null);

        const crewsData = await getCrews({
          clientId: selectedClient?.clientCode,
        });

        setCrews(crewsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load crews"
        );
        console.error("Failed to fetch crews:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedClient) {
      fetchCrews();
    } else {
      setCrews([]);
      setLoading(false);
    }
  }, [selectedClient]);

  // Toggle crew status (active/inactive)
  const handleToggleStatus = async (crew: Crew) => {
    const newStatus = crew.status === "active" ? "inactive" : "active";

    // FOR CUSTOMER SUPPORT ACTIVATION: Use wizard
    if (newStatus === "active" && crew.type === "customer_support") {
      setSelectedCrewForWizard(crew);
      setIsWizardOpen(true);
      return; // Don't proceed with direct toggle
    }

    // FOR DEACTIVATION or LEAD GEN: Direct toggle
    try {
      const updatedCrew = await updateCrew(crew.id, { status: newStatus });
      setCrews(crews.map((c) => (c.id === crew.id ? updatedCrew : c)));

      // If activated, show integration code
      if (newStatus === "active") {
        setSelectedCrew(updatedCrew);
        setIsIntegrationOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update crew status"
      );
    }
  };

  // Open edit webhook URL dialog
  const openEditDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setWebhookUrl(crew.webhookUrl);
    setIsEditOpen(true);
    setError(null);
  };

  // Save webhook URL
  const handleSaveWebhook = async () => {
    if (!selectedCrew) return;

    if (!webhookUrl.trim()) {
      setError("Webhook URL cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updatedCrew = await updateCrew(selectedCrew.id, {
        webhookUrl: webhookUrl.trim(),
      });

      setCrews(
        crews.map((c) => (c.id === selectedCrew.id ? updatedCrew : c))
      );

      setIsEditOpen(false);
      setSelectedCrew(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update webhook URL"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Save support email, client name, and allowed domain configuration
  const handleSaveSupportEmail = async () => {
    if (!selectedCrew) return;

    if (!supportEmail.trim()) {
      setError("Support email is required");
      return;
    }

    if (!supportClientName.trim()) {
      setError("Support client name is required");
      return;
    }

    if (!allowedDomain.trim()) {
      setError("Allowed domain is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supportEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(allowedDomain.trim())) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updatedCrew = await updateCrewConfig(
        selectedCrew.id,
        supportEmail.trim(),
        supportClientName.trim(),
        allowedDomain.trim()
      );

      setCrews(crews.map(c => c.id === selectedCrew.id ? updatedCrew : c));
      setIsConfigOpen(false);
      setSelectedCrew(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate integration code snippet
  const generateIntegrationCode = (crew: Crew): string => {
    return `createChat({
  webhookUrl: '${crew.webhookUrl}',
  metadata: {
    client_id: '${crew.clientId}',
    crew_code: '${crew.crewCode}',
    environment: 'production'
  }
});`;
  };

  // Calculate stats
  const stats = {
    totalCrews: crews.length,
    activeCrews: crews.filter((c) => c.status === "active").length,
    supportCrews: crews.filter((c) => c.type === "customer_support").length,
    leadGenCrews: crews.filter((c) => c.type === "lead_generation").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Crews</h1>
          <p className="text-muted-foreground">
            {selectedClient
              ? `Manage your AI agent crews for ${selectedClient.companyName}`
              : "Select a client to view their crews"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && !isEditOpen && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrews}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCrews}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supportCrews}</div>
            <p className="text-xs text-muted-foreground">Customer support</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Gen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leadGenCrews}</div>
            <p className="text-xs text-muted-foreground">Lead generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Crews Table or Empty State */}
      {!loading && !selectedClient ? (
        <EmptyState
          icon={Users}
          title="No Client Selected"
          description="Please select a client from the dropdown above to view and manage their crews."
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : !loading && crews.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Crews Assigned"
          description="No AI agent crews have been assigned to your organization yet. Contact your administrator to request crew assignment."
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : !loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Crews ({crews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Crew Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crews.map((crew) => (
                  <TableRow key={crew.id}>
                    <TableCell className="font-medium">{crew.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {crew.crewCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          crew.type === "customer_support"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {crew.type === "customer_support"
                          ? "Customer Support"
                          : "Lead Generation"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {crew.webhookUrl}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={crew.status === "active"}
                          onCheckedChange={() => handleToggleStatus(crew)}
                        />
                        <Badge
                          variant={
                            crew.status === "active"
                              ? "success"
                              : crew.status === "error"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {crew.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(crew.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {crew.status === "active" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedCrew(crew);
                            setIsIntegrationOpen(true);
                          }}
                          className="mr-2"
                        >
                          <Code2 className="h-4 w-4 mr-1" />
                          Integration
                        </Button>
                      )}
                      {crew.type === "customer_support" && crew.status === "active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCrewForKB(crew);
                            setIsKnowledgeBaseOpen(true);
                          }}
                          className="mr-2"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                      )}
                      {crew.type === "customer_support" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCrew(crew);
                            setSupportEmail(crew.config.metadata?.support_email || "");
                            setSupportClientName(crew.config.metadata?.support_client_name || "");
                            setAllowedDomain(crew.config.metadata?.allowed_domain || "");
                            setIsConfigOpen(true);
                          }}
                          className="mr-2"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {crew.config.metadata?.support_email ? "Edit" : "Set"} Support
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(crew)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit URL
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {/* Edit Webhook URL Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Webhook URL</DialogTitle>
            <DialogDescription>
              Update the n8n webhook URL for this crew
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {selectedCrew && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Crew
                </Label>
                <p className="text-sm font-medium text-foreground">{selectedCrew.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCrew.crewCode}
                </p>
              </div>

              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://n8n.example.com/webhook/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedCrew(null);
                setError(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Support Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Support Details</DialogTitle>
            <DialogDescription>
              Set the support email, client name, and allowed domain for this customer support crew.
              All fields are required before the crew can be activated.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {selectedCrew && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Crew
                </Label>
                <p className="text-sm font-medium text-foreground">{selectedCrew.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCrew.crewCode}
                </p>
              </div>

              <div>
                <Label htmlFor="supportEmail">Support Email *</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@company.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Customer messages will reference this email address
                </p>
              </div>

              <div>
                <Label htmlFor="supportClientName">Support Client Name *</Label>
                <Input
                  id="supportClientName"
                  type="text"
                  placeholder="ACME Corporation"
                  value={supportClientName}
                  onChange={(e) => setSupportClientName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The company name shown to customers
                </p>
              </div>

              <div>
                <Label htmlFor="allowedDomain">Allowed Domain *</Label>
                <Input
                  id="allowedDomain"
                  type="text"
                  placeholder="example.com"
                  value={allowedDomain}
                  onChange={(e) => setAllowedDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Domain allowed to embed the chatbot widget
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfigOpen(false);
                setSelectedCrew(null);
                setError(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSupportEmail} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Code Dialog - Multi-Channel Support */}
      <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Integration Options</DialogTitle>
            <DialogDescription>
              Choose how you want to integrate {selectedCrew?.name} into your channels
            </DialogDescription>
          </DialogHeader>

          {selectedCrew && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="flex items-start gap-3 p-4 bg-green-500/10 dark:bg-green-500/10 border border-green-500/50 dark:border-green-500/30 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-5 w-5 text-green-700 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-800 dark:text-green-400">Crew Active!</p>
                  <p className="text-sm text-green-700 dark:text-green-400/90 mt-0.5">
                    {selectedCrew.name} is ready to handle {selectedCrew.type === "customer_support" ? "customer support" : "lead generation"} requests
                  </p>
                </div>
              </div>

              {/* Multi-Channel Tabs */}
              <Tabs defaultValue="webchat" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-100 dark:bg-muted border border-white dark:border-border">
                  <TabsTrigger
                    value="webchat"
                    className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <Code2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Web Chat</span>
                    <span className="sm:hidden">Web</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="whatsapp"
                    disabled
                    className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WA</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="other"
                    disabled
                    className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <span className="hidden sm:inline">More Channels</span>
                    <span className="sm:hidden">More</span>
                  </TabsTrigger>
                </TabsList>

                {/* Web Chat Integration */}
                <TabsContent value="webchat" className="space-y-5 mt-6">
                  {/* Code Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">JavaScript Integration Code</Label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generateIntegrationCode(selectedCrew));
                        }}
                        className="gap-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                    </div>
                    <div className="relative rounded-lg bg-slate-50 dark:bg-slate-900 border border-white dark:border-slate-800 p-4 overflow-hidden">
                      <pre className="text-sm text-slate-900 dark:text-slate-50 overflow-x-auto">
                        <code>{generateIntegrationCode(selectedCrew)}</code>
                      </pre>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-muted-foreground">
                      Add this code to your website&apos;s HTML to enable the chat widget
                    </p>
                  </div>

                  {/* Integration Details */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Integration Details</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-muted border border-white dark:border-border rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-muted-foreground mb-1.5">Crew Code</p>
                        <code className="text-sm font-mono font-semibold text-slate-900 dark:text-foreground break-all">
                          {selectedCrew.crewCode}
                        </code>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-muted border border-white dark:border-border rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-muted-foreground mb-1.5">Client ID</p>
                        <code className="text-sm font-mono font-semibold text-slate-900 dark:text-foreground break-all">
                          {selectedCrew.clientId}
                        </code>
                      </div>
                      <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 dark:bg-muted border border-white dark:border-border rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-muted-foreground mb-1.5">Webhook URL</p>
                        <code className="text-xs font-mono text-slate-900 dark:text-foreground break-all">
                          {selectedCrew.webhookUrl}
                        </code>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* WhatsApp Integration (Coming Soon) */}
                <TabsContent value="whatsapp" className="mt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">WhatsApp Integration</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Connect your support crew to WhatsApp Business API.
                      This feature is coming soon!
                    </p>
                  </div>
                </TabsContent>

                {/* Other Channels (Coming Soon) */}
                <TabsContent value="other" className="mt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <Code2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">More Integration Options</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Additional channels like Slack, Teams, and custom integrations coming soon!
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={() => setIsIntegrationOpen(false)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activation Wizard for Customer Support Crews */}
      {selectedCrewForWizard && (
        <ActivationWizard
          crew={selectedCrewForWizard}
          isOpen={isWizardOpen}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedCrewForWizard(null);
          }}
          onActivationComplete={(updatedCrew) => {
            setCrews(crews.map((c) => (c.id === updatedCrew.id ? updatedCrew : c)));
            setIsWizardOpen(false);
            setSelectedCrewForWizard(null);
            // Optionally show integration dialog after activation
            setSelectedCrew(updatedCrew);
            setIsIntegrationOpen(true);
          }}
        />
      )}

      {/* Knowledge Base Manager Dialog */}
      {selectedCrewForKB && (
        <KnowledgeBaseManagerDialog
          crew={selectedCrewForKB}
          isOpen={isKnowledgeBaseOpen}
          onClose={() => {
            setIsKnowledgeBaseOpen(false);
            setSelectedCrewForKB(null);
          }}
        />
      )}
    </div>
  );
}

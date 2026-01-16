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
import { getCrews, updateCrew, updateCrewConfig, updateCrewWidgetSettings } from "@/lib/api/crews";
import { Crew, WidgetSettings } from "@/types";
import { Pencil, Users, Loader2, AlertCircle, Mail, Check, Copy, Code2, MessageCircle, Upload, Settings2, Globe, Sparkles, Zap, CheckCircle2, ExternalLink, Link, Bot } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useClient } from "@/lib/hooks/use-client";
import { ActivationWizard } from "@/components/crews/activation-wizard";
import { KnowledgeBaseManagerDialog } from "@/components/crews/knowledge-base-manager-dialog";
import { WidgetCustomizationForm } from "@/components/crews/widget-customization-form";
import { WordPressIntegration } from "@/components/crews/wordpress-integration";
import { WIDGET_DEFAULTS, WIDGET_SCRIPT_URL } from "@/lib/constants";

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
  const [agentName, setAgentName] = useState("");
  const [allowedDomain, setAllowedDomain] = useState("");
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedCrewForWizard, setSelectedCrewForWizard] = useState<Crew | null>(null);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [selectedCrewForKB, setSelectedCrewForKB] = useState<Crew | null>(null);

  // Widget customization state
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({});
  const [widgetSaving, setWidgetSaving] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

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

  // Save support email, client name, agent name, and allowed domain configuration
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

    if (!agentName.trim() || agentName.trim().length < 2) {
      setError("Agent name is required (at least 2 characters)");
      return;
    }

    if (agentName.trim().length > 50) {
      setError("Agent name must be at most 50 characters");
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
        agentName.trim(),
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

  // Generate integration code snippet with widget settings
  const generateIntegrationCode = (crew: Crew, settings: WidgetSettings): string => {
    const config: Record<string, unknown> = {
      webhookUrl: crew.webhookUrl,
      crewCode: crew.crewCode,
      clientId: crew.clientId,
      primaryColor: settings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR,
      position: settings.position || WIDGET_DEFAULTS.POSITION,
      theme: settings.theme || WIDGET_DEFAULTS.THEME,
      title: settings.widgetTitle || WIDGET_DEFAULTS.TITLE,
      subtitle: settings.widgetSubtitle || WIDGET_DEFAULTS.SUBTITLE,
      welcomeMessage: settings.welcomeMessage || WIDGET_DEFAULTS.WELCOME_MESSAGE,
      firstLaunchAction: settings.firstLaunchAction || WIDGET_DEFAULTS.FIRST_LAUNCH_ACTION,
      greetingDelay: settings.greetingDelay || WIDGET_DEFAULTS.GREETING_DELAY,
    };

    // Add suggested actions if configured (filter out empty ones)
    if (settings.suggestedActions && settings.suggestedActions.length > 0) {
      const validActions = settings.suggestedActions.filter(
        (a) => a.label.trim() && a.message.trim()
      );
      if (validActions.length > 0) {
        config.suggestedActions = validActions;
      }
    }

    // Add disclaimer if configured
    if (settings.disclaimer) {
      config.disclaimer = settings.disclaimer;
    }

    return `<!-- AutoCrew Chat Widget -->
<script>
  window.AutoCrewConfig = ${JSON.stringify(config, null, 4).replace(/\n/g, '\n  ')};
</script>
<script src="${WIDGET_SCRIPT_URL}" async></script>`;
  };

  // Handle copy integration code
  const handleCopyCode = async (crew: Crew) => {
    const code = generateIntegrationCode(crew, widgetSettings);
    await navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Handle save widget settings
  const handleSaveWidgetSettings = async () => {
    if (!selectedCrew) return;

    try {
      setWidgetSaving(true);
      setWidgetError(null);

      const updatedCrew = await updateCrewWidgetSettings(selectedCrew.id, widgetSettings);
      setCrews(crews.map((c) => (c.id === updatedCrew.id ? updatedCrew : c)));
      setSelectedCrew(updatedCrew);
    } catch (err) {
      setWidgetError(err instanceof Error ? err.message : "Failed to save widget settings");
    } finally {
      setWidgetSaving(false);
    }
  };

  // Load widget settings when opening integration dialog
  const openIntegrationDialog = (crew: Crew) => {
    setSelectedCrew(crew);
    setWidgetSettings(crew.config.widgetSettings || {});
    setWidgetError(null);
    setIsIntegrationOpen(true);
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
                          onClick={() => openIntegrationDialog(crew)}
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
                            setAgentName(crew.config.metadata?.agent_name || "");
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
        <DialogContent className="sm:max-w-[550px] p-0">
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Link className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Edit Webhook URL</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    Update the n8n webhook URL for this crew
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {selectedCrew && (
              <div className="space-y-6">
                {/* Crew Info */}
                <div className="p-4 bg-muted/50 border border-border rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Selected Crew</p>
                  <p className="font-semibold text-foreground">{selectedCrew.name}</p>
                  <code className="text-xs text-muted-foreground font-mono">
                    {selectedCrew.crewCode}
                  </code>
                </div>

                {/* Webhook URL Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Link className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">Webhook Configuration</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl" className="text-sm font-medium">
                      Webhook URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://n8n.example.com/webhook/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="h-10 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      The n8n webhook endpoint for this crew&apos;s workflow
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end gap-3">
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
              <Button onClick={handleSaveWebhook} disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure Support Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[550px] p-0">
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Settings2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Configure Support Details</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    All fields required before crew activation
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {selectedCrew && (
              <div className="space-y-6">
                {/* Crew Info */}
                <div className="p-4 bg-muted/50 border border-border rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Selected Crew</p>
                  <p className="font-semibold text-foreground">{selectedCrew.name}</p>
                  <code className="text-xs text-muted-foreground font-mono">
                    {selectedCrew.crewCode}
                  </code>
                </div>

                {/* Support Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">Support Configuration</h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="text-sm font-medium">
                      Support Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      placeholder="support@company.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Customer messages will reference this email address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportClientName" className="text-sm font-medium">
                      Support Client Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="supportClientName"
                      type="text"
                      placeholder="ACME Corporation"
                      value={supportClientName}
                      onChange={(e) => setSupportClientName(e.target.value)}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      The company name shown to customers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agentName" className="text-sm font-medium">
                      Agent Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="agentName"
                        type="text"
                        placeholder="Sarah"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="h-10 pl-10"
                        maxLength={50}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Name displayed for the AI support agent (2-50 characters)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowedDomain" className="text-sm font-medium">
                      Allowed Domain <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="allowedDomain"
                      type="text"
                      placeholder="example.com"
                      value={allowedDomain}
                      onChange={(e) => setAllowedDomain(e.target.value)}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Domain allowed to embed the chatbot widget
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-end gap-3">
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
              <Button onClick={handleSaveSupportEmail} disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Integration Code Dialog - Multi-Channel Support */}
      <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Elegant Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Integration Center</DialogTitle>
                  <DialogDescription className="text-sm mt-0.5">
                    Deploy {selectedCrew?.name} across your channels
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {selectedCrew && (
            <div className="p-6 space-y-6">
              {/* Status Banner - More Elegant */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 border border-emerald-500/20 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Crew Active & Ready</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                      {selectedCrew.name} is handling {selectedCrew.type === "customer_support" ? "customer support" : "lead generation"} requests
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Tabs - Enhanced Design */}
              <Tabs defaultValue="webchat" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1.5 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border/50">
                  <TabsTrigger
                    value="webchat"
                    className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Web Chat</span>
                    <span className="sm:hidden">Web</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="wordpress"
                    className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50"
                  >
                    <Code2 className="h-4 w-4" />
                    <span className="hidden sm:inline">WordPress</span>
                    <span className="sm:hidden">WP</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="customize"
                    className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Customize</span>
                    <span className="sm:hidden">Style</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="whatsapp"
                    disabled
                    className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50 disabled:opacity-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WA</span>
                  </TabsTrigger>
                </TabsList>

                {/* Web Chat Integration - Enhanced */}
                <TabsContent value="webchat" className="space-y-6 mt-6">
                  {/* Code Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-semibold">JavaScript Integration Code</Label>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyCode(selectedCrew)}
                        className="gap-2 h-8 px-3 text-xs font-medium transition-all"
                      >
                        {codeCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative rounded-xl bg-slate-950 dark:bg-slate-900/80 border border-slate-800/50 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800/50">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-red-500/80" />
                              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                              <div className="h-3 w-3 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-xs text-slate-500 ml-2 font-mono">index.html</span>
                          </div>
                        </div>
                        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                          <code className="font-mono text-[13px] leading-relaxed">{generateIntegrationCode(selectedCrew, widgetSettings)}</code>
                        </pre>
                      </div>
                    </div>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Add this code to your website&apos;s HTML before the closing &lt;/body&gt; tag
                    </p>
                  </div>

                  {/* Integration Details - Card Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-semibold">Configuration Details</Label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="group relative p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Crew Code</p>
                            <code className="text-sm font-mono font-semibold text-foreground break-all">
                              {selectedCrew.crewCode}
                            </code>
                          </div>
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <Code2 className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="group relative p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Client ID</p>
                            <code className="text-sm font-mono font-semibold text-foreground break-all">
                              {selectedCrew.clientId}
                            </code>
                          </div>
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <Users className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 group relative p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Webhook URL</p>
                            <code className="text-xs font-mono text-foreground break-all leading-relaxed">
                              {selectedCrew.webhookUrl}
                            </code>
                          </div>
                          <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* WordPress Integration */}
                <TabsContent value="wordpress" className="mt-6">
                  <WordPressIntegration
                    crew={selectedCrew}
                    widgetSettings={widgetSettings}
                  />
                </TabsContent>

                {/* Customize Widget */}
                <TabsContent value="customize" className="mt-6">
                  <WidgetCustomizationForm
                    settings={widgetSettings}
                    onSettingsChange={setWidgetSettings}
                    onSave={handleSaveWidgetSettings}
                    isSaving={widgetSaving}
                    error={widgetError}
                  />
                </TabsContent>

                {/* WhatsApp Integration (Coming Soon) - Enhanced */}
                <TabsContent value="whatsapp" className="mt-6">
                  <div className="relative flex flex-col items-center justify-center py-16 text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent rounded-xl" />
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/20 mb-6">
                        <MessageCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">WhatsApp Integration</h3>
                      <p className="text-muted-foreground text-sm max-w-md mb-6">
                        Connect your support crew to WhatsApp Business API for seamless customer communication.
                      </p>
                      <Badge variant="secondary" className="px-4 py-1.5 text-xs font-medium">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Need help? Check our <a href="#" className="text-primary hover:underline">integration docs</a>
              </p>
              <Button
                onClick={() => setIsIntegrationOpen(false)}
                className="px-6"
              >
                Done
              </Button>
            </div>
          </div>
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
            // Show integration dialog after activation
            openIntegrationDialog(updatedCrew);
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

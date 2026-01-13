'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, RefreshCw, Rocket, Upload, Mail, Settings, Globe, FileText } from 'lucide-react';
import { WizardStepper } from './wizard-stepper';
import { KnowledgeBaseUpload } from './knowledge-base-upload';
import { KnowledgeBaseList } from './knowledge-base-list';
import { getKnowledgeBaseDocuments } from '@/lib/api/knowledge-base';
import { updateCrewConfig } from '@/lib/api/crews';
import { updateCrew } from '@/lib/api/crews';
import type { Crew, KnowledgeBaseDocument } from '@/types';

interface ActivationWizardProps {
  crew: Crew;
  isOpen: boolean;
  onClose: () => void;
  onActivationComplete: (crew: Crew) => void;
}

const WIZARD_STEPS = [
  { number: 1, title: 'Upload Knowledge Base' },
  { number: 2, title: 'Configure Support' },
  { number: 3, title: 'Review & Activate' },
];

export function ActivationWizard({
  crew,
  isOpen,
  onClose,
  onActivationComplete,
}: ActivationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [supportEmail, setSupportEmail] = useState(
    crew.config.metadata?.support_email || ''
  );
  const [supportClientName, setSupportClientName] = useState(
    crew.config.metadata?.support_client_name || ''
  );
  const [allowedDomain, setAllowedDomain] = useState(
    crew.config.metadata?.allowed_domain || ''
  );
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get indexed documents count
  const indexedDocuments = documents.filter(doc => doc.status === 'indexed');
  const processingDocuments = documents.filter(doc => doc.status === 'processing');
  const hasIndexedDocuments = indexedDocuments.length > 0;

  // Memoized function to load documents from vector table
  const loadDocuments = useCallback(async () => {
    console.log('[Wizard] Loading documents for crew:', crew.id);
    setIsLoadingDocuments(true);
    setError(null);

    try {
      const result = await getKnowledgeBaseDocuments(crew.id);
      console.log('[Wizard] Documents loaded:', result);

      if (result.success && result.data) {
        console.log('[Wizard] Setting documents:', result.data.length, 'documents');
        setDocuments(result.data);
      } else {
        console.error('[Wizard] Failed to load documents:', result.error);
        setError(result.error || 'Failed to load documents');
      }
    } catch (err) {
      console.error('[Wizard] Error loading documents:', err);
      setError('Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [crew.id]);

  // Handle upload success with delay to allow n8n processing
  const handleUploadSuccess = useCallback(() => {
    // N8n needs time to process (parse, chunk, embed, insert to vector table)
    // Wait 4 seconds before refreshing to allow processing to complete
    // Then retry every 2 seconds for up to 3 attempts
    let attempts = 0;
    const maxAttempts = 3;

    const checkForDocument = () => {
      attempts++;
      console.log(`[Wizard] Refreshing documents (attempt ${attempts}/${maxAttempts})`);
      loadDocuments();

      if (attempts < maxAttempts) {
        setTimeout(checkForDocument, 2000);
      }
    };

    // Start first check after 3 seconds
    setTimeout(checkForDocument, 3000);
  }, [loadDocuments]);

  // Load documents when wizard opens
  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, loadDocuments]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDomain = (domain: string): boolean => {
    // Allow domain names like example.com, sub.example.com, localhost
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    return domain.trim() !== '' && domainRegex.test(domain.trim());
  };

  const canProceedFromStep2 = (): boolean => {
    return (
      supportEmail.trim() !== '' &&
      validateEmail(supportEmail) &&
      supportClientName.trim() !== '' &&
      validateDomain(allowedDomain)
    );
  };

  const handleConfigureSupportAndContinue = async () => {
    if (!canProceedFromStep2()) {
      setError('Please provide a valid support email, client name, and allowed domain');
      return;
    }

    setError(null);

    try {
      // Update crew config with support details and allowed domain
      await updateCrewConfig(crew.id, supportEmail, supportClientName, allowedDomain);
      handleNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    }
  };

  const handleActivate = async () => {
    setIsActivating(true);
    setError(null);

    try {
      // Activate the crew (updateCrew returns Crew directly, not ApiResponse)
      const updatedCrew = await updateCrew(crew.id, { status: 'active' });
      console.log('[Wizard] Crew activated successfully:', updatedCrew);
      onActivationComplete(updatedCrew);
    } catch (err) {
      console.error('[Wizard] Activation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate crew';
      setError(errorMessage);
    } finally {
      setIsActivating(false);
    }
  };

  const handleCloseWizard = () => {
    if (!isActivating) {
      // Reset wizard state
      setCurrentStep(1);
      setError(null);
      setDocuments([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseWizard}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Elegant Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Activate Support Crew</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{crew.name}</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Wizard Stepper */}
          <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Step 1: Upload Knowledge Base */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Upload Knowledge Base Documents</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload documents to train your support crew. These will be processed and
                  indexed for AI-powered responses. <span className="text-destructive font-medium">At least one document is required</span> to activate the crew.
                </p>
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Processing Time</p>
                    <p className="text-blue-600/80 dark:text-blue-400/80 text-xs mt-1">
                      Documents appear in the list below after n8n finishes processing
                      (parsing, chunking, and embedding). This usually takes 3-10 seconds.
                      The list will refresh automatically.
                    </p>
                  </div>
                </div>
              </div>

              <KnowledgeBaseUpload
                crewId={crew.id}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(err) => setError(err)}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Uploaded Documents</h4>
                </div>
                <KnowledgeBaseList
                  crewId={crew.id}
                  documents={documents}
                  onDelete={loadDocuments}
                  onRefresh={loadDocuments}
                  isLoading={isLoadingDocuments}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleCloseWizard}>
                  Cancel
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  Continue to Configuration
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configure Support */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Configure Support Settings</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provide essential support configuration for your crew.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-email" className="text-sm font-medium">
                    Support Email <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="support-email"
                      type="email"
                      placeholder="support@example.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="h-10 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address for customer support inquiries
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-client-name" className="text-sm font-medium">
                    Support Client Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="support-client-name"
                    type="text"
                    placeholder="ACME Support"
                    value={supportClientName}
                    onChange={(e) => setSupportClientName(e.target.value)}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Display name for your support service
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-domain" className="text-sm font-medium">
                    Allowed Domain <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="allowed-domain"
                      type="text"
                      placeholder="example.com"
                      value={allowedDomain}
                      onChange={(e) => setAllowedDomain(e.target.value)}
                      className="h-10 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Domain allowed to embed the chatbot widget (e.g., example.com, app.example.com)
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleConfigureSupportAndContinue}
                  disabled={!canProceedFromStep2()}
                  className="gap-2"
                >
                  Review & Activate
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Activate */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Rocket className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">Review & Activate</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    Review your configuration before activating the crew.
                  </p>
                </div>
                {processingDocuments.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDocuments}
                    disabled={isLoadingDocuments}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingDocuments ? 'animate-spin' : ''}`} />
                    Refresh Status
                  </Button>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-4">
                {/* Knowledge Base Summary */}
                <div className={`p-4 border rounded-xl ${!hasIndexedDocuments ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-border'}`}>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {!hasIndexedDocuments ? (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                    Knowledge Base {!hasIndexedDocuments && <span className="text-destructive text-sm font-normal">(Required)</span>}
                  </h4>
                  {documents.length === 0 ? (
                    <p className="text-sm text-destructive">
                      No documents uploaded. At least one indexed document is required to activate the crew.
                      Please go back to Step 1 to upload documents.
                    </p>
                  ) : !hasIndexedDocuments ? (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive">
                        No indexed documents available. {processingDocuments.length} document{processingDocuments.length !== 1 ? 's are' : ' is'} still processing.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Documents must finish processing and be indexed before activation. This usually takes 10-30 seconds.
                        Please refresh and wait for processing to complete.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {indexedDocuments.length} indexed document{indexedDocuments.length > 1 ? 's' : ''}
                        {' '}with {indexedDocuments.reduce((sum, doc) => sum + doc.chunkCount, 0)} total chunks
                      </p>
                      {processingDocuments.length > 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          {processingDocuments.length} document{processingDocuments.length !== 1 ? 's' : ''} still processing
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Support Configuration Summary */}
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Support Configuration
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{supportEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client Name:</span>
                      <span className="font-medium">{supportClientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowed Domain:</span>
                      <span className="font-medium">{allowedDomain}</span>
                    </div>
                  </div>
                </div>

                {/* Crew Details */}
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Crew Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crew Code:</span>
                      <code className="font-mono text-xs bg-background/50 px-2 py-1 rounded">{crew.crewCode}</code>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Webhook URL:</span>
                      <code className="font-mono text-xs bg-background/50 px-2 py-1 rounded max-w-[60%] truncate">{crew.webhookUrl}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning if requirements not met */}
              {!hasIndexedDocuments && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    {documents.length === 0
                      ? 'Cannot activate crew: At least one knowledge base document is required.'
                      : `Cannot activate crew: Waiting for ${processingDocuments.length} document${processingDocuments.length !== 1 ? 's' : ''} to finish processing.`
                    }
                  </p>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleBack} disabled={isActivating}>
                  Back
                </Button>
                <Button
                  onClick={handleActivate}
                  disabled={isActivating || !hasIndexedDocuments}
                  className="gap-2"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Activate Crew
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  Lightbulb,
  AlertTriangle,
  Puzzle,
  FileCode2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import type { Crew, WidgetSettings } from "@/types";
import { WIDGET_DEFAULTS, WIDGET_SCRIPT_URL } from "@/lib/constants";

interface WordPressIntegrationProps {
  crew: Crew;
  widgetSettings: WidgetSettings;
}

export function WordPressIntegration({
  crew,
  widgetSettings,
}: WordPressIntegrationProps) {
  const [copiedPlugin, setCopiedPlugin] = useState(false);
  const [copiedTheme, setCopiedTheme] = useState(false);

  // Generate the JavaScript config object
  const generateConfigObject = () => {
    const config = {
      webhookUrl: crew.webhookUrl,
      crewCode: crew.crewCode,
      clientId: crew.clientId,
      primaryColor: widgetSettings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR,
      position: widgetSettings.position || WIDGET_DEFAULTS.POSITION,
      theme: widgetSettings.theme || WIDGET_DEFAULTS.THEME,
      title: widgetSettings.widgetTitle || WIDGET_DEFAULTS.TITLE,
      subtitle: widgetSettings.widgetSubtitle || WIDGET_DEFAULTS.SUBTITLE,
      welcomeMessage: widgetSettings.welcomeMessage || WIDGET_DEFAULTS.WELCOME_MESSAGE,
      firstLaunchAction: widgetSettings.firstLaunchAction || WIDGET_DEFAULTS.FIRST_LAUNCH_ACTION,
      greetingDelay: widgetSettings.greetingDelay || WIDGET_DEFAULTS.GREETING_DELAY,
    };

    return JSON.stringify(config, null, 4);
  };

  // Plugin method code
  const pluginCode = `<!-- AutoCrew Chat Widget -->
<!-- Add this code using "Insert Headers and Footers" plugin -->
<!-- Go to: Settings > Insert Headers and Footers > Scripts in Footer -->

<script>
  window.AutoCrewConfig = ${generateConfigObject().replace(/\n/g, '\n  ')};
</script>
<script src="${WIDGET_SCRIPT_URL}" async></script>`;

  // Theme method code (PHP)
  const themeCode = `<?php
/**
 * AutoCrew Chat Widget Integration
 * Add this code to your theme's functions.php file
 */
function autocrew_enqueue_widget() {
    ?>
    <script>
      window.AutoCrewConfig = {
        webhookUrl: '${crew.webhookUrl}',
        crewCode: '${crew.crewCode}',
        clientId: '${crew.clientId}',
        primaryColor: '${widgetSettings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR}',
        position: '${widgetSettings.position || WIDGET_DEFAULTS.POSITION}',
        theme: '${widgetSettings.theme || WIDGET_DEFAULTS.THEME}',
        title: <?php echo json_encode('${widgetSettings.widgetTitle || WIDGET_DEFAULTS.TITLE}'); ?>,
        subtitle: <?php echo json_encode('${widgetSettings.widgetSubtitle || WIDGET_DEFAULTS.SUBTITLE}'); ?>,
        welcomeMessage: <?php echo json_encode('${widgetSettings.welcomeMessage || WIDGET_DEFAULTS.WELCOME_MESSAGE}'); ?>,
        firstLaunchAction: '${widgetSettings.firstLaunchAction || WIDGET_DEFAULTS.FIRST_LAUNCH_ACTION}',
        greetingDelay: ${widgetSettings.greetingDelay || WIDGET_DEFAULTS.GREETING_DELAY}
      };
    </script>
    <script src="${WIDGET_SCRIPT_URL}" async></script>
    <?php
}
add_action('wp_footer', 'autocrew_enqueue_widget');`;

  const handleCopyPlugin = async () => {
    await navigator.clipboard.writeText(pluginCode);
    setCopiedPlugin(true);
    setTimeout(() => setCopiedPlugin(false), 2000);
  };

  const handleCopyTheme = async () => {
    await navigator.clipboard.writeText(themeCode);
    setCopiedTheme(true);
    setTimeout(() => setCopiedTheme(false), 2000);
  };

  return (
    <Tabs defaultValue="plugin" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-auto p-1.5 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border/50">
        <TabsTrigger
          value="plugin"
          className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50"
        >
          <Puzzle className="h-4 w-4" />
          <span className="hidden sm:inline">Plugin Method</span>
          <span className="sm:hidden">Plugin</span>
          <span className="hidden sm:inline-flex ml-1 items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
            Recommended
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="theme"
          className="flex items-center gap-2 py-3 px-4 rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/50"
        >
          <FileCode2 className="h-4 w-4" />
          <span className="hidden sm:inline">Theme functions.php</span>
          <span className="sm:hidden">Theme</span>
        </TabsTrigger>
      </TabsList>

      {/* Plugin Method */}
      <TabsContent value="plugin" className="space-y-5 mt-6">
        {/* Info Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-amber-500/5 border border-amber-500/20 p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-500/30 flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400 text-sm">Safest Method</p>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                Uses the &quot;Insert Headers and Footers&quot; plugin - no theme modifications required.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                1
              </span>
              <h4 className="font-semibold text-sm">Install the Plugin</h4>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Go to <strong className="text-foreground">Plugins → Add New</strong> in your WordPress admin</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Search for &quot;Insert Headers and Footers&quot; by WPCode</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Install and activate the plugin</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                2
              </span>
              <h4 className="font-semibold text-sm">Add the Code</h4>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Go to <strong className="text-foreground">Settings → Insert Headers and Footers</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Paste the code below into &quot;Scripts in Footer&quot;</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Click <strong className="text-foreground">Save</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Integration Code</h4>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyPlugin}
              className="gap-2 h-8 px-3 text-xs font-medium transition-all"
            >
              {copiedPlugin ? (
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
                  <span className="text-xs text-slate-500 ml-2 font-mono">footer-scripts.html</span>
                </div>
              </div>
              <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                <code className="font-mono text-[13px] leading-relaxed">{pluginCode}</code>
              </pre>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            The widget will appear on all pages of your WordPress site
          </p>
        </div>
      </TabsContent>

      {/* Theme Method */}
      <TabsContent value="theme" className="space-y-5 mt-6">
        {/* Warning Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent dark:from-red-500/15 dark:via-red-500/5 border border-red-500/20 p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-500/30 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-red-700 dark:text-red-400 text-sm">Caution Required</p>
              <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-0.5">
                Editing theme files can break your site. Create a backup first and consider using a child theme.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Instructions</h4>
          </div>
          <div className="ml-0 space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground flex-shrink-0">1</span>
              <span>Go to <strong className="text-foreground">Appearance → Theme File Editor</strong> (or use FTP)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground flex-shrink-0">2</span>
              <span>Open your theme&apos;s <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs font-mono">functions.php</code> file</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground flex-shrink-0">3</span>
              <span>Add the code below at the end of the file (before <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs font-mono">?&gt;</code> if present)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground flex-shrink-0">4</span>
              <span>Click <strong className="text-foreground">Update File</strong></span>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">PHP Code</h4>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyTheme}
              className="gap-2 h-8 px-3 text-xs font-medium transition-all"
            >
              {copiedTheme ? (
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
                  <span className="text-xs text-slate-500 ml-2 font-mono">functions.php</span>
                </div>
              </div>
              <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                <code className="font-mono text-[13px] leading-relaxed">{themeCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

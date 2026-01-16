"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  Palette,
  Type,
  Sparkles,
  Save,
  Zap,
  Plus,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import type { WidgetSettings, SuggestedAction } from "@/types";
import { WIDGET_DEFAULTS } from "@/lib/constants";
import { WidgetPreview } from "./widget-preview";

interface WidgetCustomizationFormProps {
  settings: WidgetSettings;
  onSettingsChange: (settings: WidgetSettings) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  error?: string | null;
}

export function WidgetCustomizationForm({
  settings,
  onSettingsChange,
  onSave,
  isSaving,
  error,
}: WidgetCustomizationFormProps) {
  const updateSetting = <K extends keyof WidgetSettings>(
    key: K,
    value: WidgetSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Settings Panel */}
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Appearance Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Palette className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Appearance</h4>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor" className="text-sm font-medium">
              Primary Color
            </Label>
            <div className="flex gap-3">
              <div className="relative group">
                <input
                  type="color"
                  id="primaryColor"
                  value={settings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR}
                  onChange={(e) => updateSetting("primaryColor", e.target.value)}
                  className="w-14 h-10 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  style={{
                    backgroundColor:
                      settings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR,
                  }}
                />
              </div>
              <Input
                value={settings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR}
                onChange={(e) => updateSetting("primaryColor", e.target.value)}
                placeholder="#0891b2"
                className="flex-1 font-mono text-sm"
                maxLength={7}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Accent color for buttons and interactive elements
            </p>
          </div>

          {/* Position & Theme Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">
                Position
              </Label>
              <Select
                value={settings.position || WIDGET_DEFAULTS.POSITION}
                onValueChange={(value) =>
                  updateSetting("position", value as WidgetSettings["position"])
                }
              >
                <SelectTrigger id="position" className="h-10">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm font-medium">
                Theme
              </Label>
              <Select
                value={settings.theme || WIDGET_DEFAULTS.THEME}
                onValueChange={(value) =>
                  updateSetting("theme", value as WidgetSettings["theme"])
                }
              >
                <SelectTrigger id="theme" className="h-10">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Branding Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Type className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Branding</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="widgetTitle" className="text-sm font-medium">
              Widget Title
            </Label>
            <Input
              id="widgetTitle"
              value={settings.widgetTitle || ""}
              onChange={(e) => updateSetting("widgetTitle", e.target.value)}
              placeholder={WIDGET_DEFAULTS.TITLE}
              maxLength={50}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="widgetSubtitle" className="text-sm font-medium">
              Widget Subtitle
            </Label>
            <Input
              id="widgetSubtitle"
              value={settings.widgetSubtitle || ""}
              onChange={(e) => updateSetting("widgetSubtitle", e.target.value)}
              placeholder="We typically reply within minutes"
              maxLength={100}
              className="h-10"
            />
          </div>
        </div>

        {/* Behavior Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Behavior</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeMessage" className="text-sm font-medium">
              Welcome Message
            </Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage || ""}
              onChange={(e) => updateSetting("welcomeMessage", e.target.value)}
              placeholder={WIDGET_DEFAULTS.WELCOME_MESSAGE}
              maxLength={500}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              First message shown when visitors open the chat
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstLaunchAction" className="text-sm font-medium">
              First Visit Action
            </Label>
            <Select
              value={
                settings.firstLaunchAction || WIDGET_DEFAULTS.FIRST_LAUNCH_ACTION
              }
              onValueChange={(value) =>
                updateSetting(
                  "firstLaunchAction",
                  value as WidgetSettings["firstLaunchAction"]
                )
              }
            >
              <SelectTrigger id="firstLaunchAction" className="h-10">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Widget stays closed</SelectItem>
                <SelectItem value="show-greeting">
                  Show greeting bubble
                </SelectItem>
                <SelectItem value="auto-open">Auto-open chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.firstLaunchAction === "show-greeting" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label htmlFor="greetingDelay" className="text-sm font-medium">
                Greeting Delay
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="greetingDelay"
                  type="number"
                  value={settings.greetingDelay || WIDGET_DEFAULTS.GREETING_DELAY}
                  onChange={(e) =>
                    updateSetting("greetingDelay", parseInt(e.target.value) || 0)
                  }
                  min={0}
                  max={30000}
                  step={500}
                  className="h-10 w-32"
                />
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Quick Actions</h4>
          </div>

          <p className="text-xs text-muted-foreground">
            Add buttons that appear when the chat opens. Clicking sends the
            associated message automatically.
          </p>

          {/* Existing Actions */}
          <div className="space-y-3">
            {(settings.suggestedActions || []).map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    value={action.label}
                    onChange={(e) => {
                      const newActions = [...(settings.suggestedActions || [])];
                      newActions[index] = { ...action, label: e.target.value };
                      updateSetting("suggestedActions", newActions);
                    }}
                    placeholder="Button label"
                    maxLength={30}
                    className="h-9 text-sm"
                  />
                  <Input
                    value={action.message}
                    onChange={(e) => {
                      const newActions = [...(settings.suggestedActions || [])];
                      newActions[index] = { ...action, message: e.target.value };
                      updateSetting("suggestedActions", newActions);
                    }}
                    placeholder="Message to send"
                    maxLength={200}
                    className="h-9 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    const newActions = (settings.suggestedActions || []).filter(
                      (_, i) => i !== index
                    );
                    updateSetting("suggestedActions", newActions);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Action Button */}
          {(settings.suggestedActions?.length || 0) <
            WIDGET_DEFAULTS.MAX_SUGGESTED_ACTIONS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                const newAction: SuggestedAction = { label: "", message: "" };
                const newActions = [...(settings.suggestedActions || []), newAction];
                updateSetting("suggestedActions", newActions);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Quick Action
            </Button>
          )}

          {(settings.suggestedActions?.length || 0) >=
            WIDGET_DEFAULTS.MAX_SUGGESTED_ACTIONS && (
            <p className="text-xs text-muted-foreground text-center">
              Maximum {WIDGET_DEFAULTS.MAX_SUGGESTED_ACTIONS} quick actions
              allowed
            </p>
          )}
        </div>

        {/* Disclaimer Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Disclaimer</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disclaimer" className="text-sm font-medium">
              Disclaimer Text
            </Label>
            <Textarea
              id="disclaimer"
              value={settings.disclaimer || ""}
              onChange={(e) => updateSetting("disclaimer", e.target.value)}
              placeholder={WIDGET_DEFAULTS.DEFAULT_DISCLAIMER}
              maxLength={300}
              rows={3}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Shown above the input field. Leave empty to hide.
              </p>
              {!settings.disclaimer && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() =>
                    updateSetting("disclaimer", WIDGET_DEFAULTS.DEFAULT_DISCLAIMER)
                  }
                >
                  Use default
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="w-full h-11 gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Customizations
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-4 self-start">
        <WidgetPreview settings={settings} />
      </div>
    </div>
  );
}

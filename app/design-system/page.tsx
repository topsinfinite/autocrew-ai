"use client";

import { useState, useCallback } from "react";
import {
  Check,
  Copy,
  Activity,
  PhoneCall,
  Database,
  UserCheck,
  BarChart3,
  Shield,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Mail,
  Calendar,
  Github,
  Linkedin,
  Sun,
  Moon,
  Heart,
  Target,
  Rocket,
  Users,
  Play,
  Pause,
  Zap,
  MessageSquare,
  Clock,
  Star,
  Globe,
  Lock,
  Settings,
  Search,
  Bell,
  Home,
  FileText,
  HelpCircle,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionBadge } from "@/components/landing/section-badge";

// ============================================================================
// COPY-TO-CLIPBOARD HOOK
// ============================================================================

function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  }, []);

  return { copiedValue, copy };
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "buttons", label: "Buttons" },
  { id: "glass", label: "Glass Effects" },
  { id: "shadows", label: "Shadows" },
  { id: "animations", label: "Animations" },
  { id: "icons", label: "Icons" },
  { id: "variables", label: "CSS Variables" },
];

interface ColorToken {
  name: string;
  cssVar: string;
  hsl: string;
  hex: string;
  description?: string;
}

const COLORS_BRAND: ColorToken[] = [
  { name: "Primary", cssVar: "--primary", hsl: "16 100% 60%", hex: "#FF6B35", description: "Burnt orange - main accent" },
  { name: "Secondary", cssVar: "--secondary", hsl: "199 89% 48%", hex: "#17B8D1", description: "Cool cyan - secondary accent" },
];

const COLORS_BACKGROUNDS: ColorToken[] = [
  { name: "Background", cssVar: "--background", hsl: "224 65% 3%", hex: "#03060e", description: "Page background" },
  { name: "Card", cssVar: "--card", hsl: "228 33% 6%", hex: "#0A0C14", description: "Card surfaces" },
  { name: "Muted", cssVar: "--muted", hsl: "217 33% 17%", hex: "#1e293b", description: "Muted backgrounds" },
  { name: "Popover", cssVar: "--popover", hsl: "228 33% 6%", hex: "#0A0C14", description: "Popover surfaces" },
];

const COLORS_TEXT: ColorToken[] = [
  { name: "Foreground", cssVar: "--foreground", hsl: "0 0% 93%", hex: "#EDEDED", description: "Primary text" },
  { name: "Card Foreground", cssVar: "--card-foreground", hsl: "0 0% 93%", hex: "#EDEDED", description: "Text on cards" },
  { name: "Muted Foreground", cssVar: "--muted-foreground", hsl: "215 20% 65%", hex: "#94A3B8", description: "Secondary text" },
];

const COLORS_SEMANTIC: ColorToken[] = [
  { name: "Accent", cssVar: "--accent", hsl: "18 100% 60%", hex: "#FF6A35", description: "Accent color" },
  { name: "Destructive", cssVar: "--destructive", hsl: "0 84.2% 60.2%", hex: "#EF4444", description: "Error / destructive" },
  { name: "Success", cssVar: "--success", hsl: "142 71% 45%", hex: "#10B981", description: "Success state" },
  { name: "Warning", cssVar: "--warning", hsl: "38 92% 50%", hex: "#F59E0B", description: "Warning state" },
];

const COLORS_CHART: ColorToken[] = [
  { name: "Chart 1", cssVar: "--chart-1", hsl: "18 100% 60%", hex: "#FF6A35" },
  { name: "Chart 2", cssVar: "--chart-2", hsl: "199 89% 48%", hex: "#17B8D1" },
  { name: "Chart 3", cssVar: "--chart-3", hsl: "142 71% 45%", hex: "#10B981" },
  { name: "Chart 4", cssVar: "--chart-4", hsl: "280 65% 60%", hex: "#A78BFA" },
  { name: "Chart 5", cssVar: "--chart-5", hsl: "38 92% 50%", hex: "#F59E0B" },
];

const COLORS_BORDER: ColorToken[] = [
  { name: "Border", cssVar: "--border", hsl: "215 20% 18%", hex: "#1E293B", description: "Default borders" },
  { name: "Input", cssVar: "--input", hsl: "215 20% 18%", hex: "#1E293B", description: "Input borders" },
  { name: "Ring", cssVar: "--ring", hsl: "18 100% 60%", hex: "#FF6A35", description: "Focus rings" },
];

interface GlassToken {
  name: string;
  cssVar: string;
  value: string;
}

const GLASS_TOKENS: GlassToken[] = [
  { name: "Glass Border", cssVar: "--glass-border", value: "rgba(255, 255, 255, 0.08)" },
  { name: "Glass Surface", cssVar: "--glass-surface", value: "rgba(255, 255, 255, 0.03)" },
  { name: "Surface Subtle", cssVar: "--surface-subtle", value: "rgba(255, 255, 255, 0.02)" },
  { name: "Border Subtle", cssVar: "--border-subtle", value: "rgba(255, 255, 255, 0.08)" },
  { name: "Surface Hover", cssVar: "--surface-hover", value: "rgba(255, 255, 255, 0.05)" },
  { name: "Section Glow", cssVar: "--section-glow", value: "rgba(255, 107, 53, 0.04)" },
];

interface TypoSample {
  level: string;
  classes: string;
  font: string;
  fontClass: string;
  sampleText: string;
}

const TYPOGRAPHY_SAMPLES: TypoSample[] = [
  { level: "H1", classes: "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]", font: "Space Grotesk", fontClass: "font-space-grotesk", sampleText: "The quick brown fox" },
  { level: "H2", classes: "text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight", font: "Space Grotesk", fontClass: "font-space-grotesk", sampleText: "The quick brown fox" },
  { level: "H3", classes: "text-2xl font-semibold", font: "Space Grotesk", fontClass: "font-space-grotesk", sampleText: "The quick brown fox jumps" },
  { level: "H4", classes: "text-lg font-medium tracking-tight", font: "Geist Sans", fontClass: "font-geist", sampleText: "The quick brown fox jumps over the lazy dog" },
  { level: "Body", classes: "text-base leading-relaxed", font: "Geist Sans", fontClass: "font-geist", sampleText: "AutoCrew helps businesses automate customer interactions at scale. Our AI-powered crews handle support, lead generation, and more with human-like precision and empathy." },
  { level: "Small", classes: "text-sm leading-relaxed", font: "Geist Sans", fontClass: "font-geist", sampleText: "Secondary body text used for descriptions, card content, and supporting information throughout the interface." },
  { level: "Caption", classes: "text-xs font-medium", font: "Geist Sans", fontClass: "font-geist", sampleText: "Caption text for metadata and labels" },
  { level: "Label", classes: "text-xs uppercase tracking-wider font-semibold", font: "Space Mono", fontClass: "font-space-mono", sampleText: "System Status" },
];

interface RadiusValue {
  name: string;
  class: string;
  value: string;
}

const RADII: RadiusValue[] = [
  { name: "Pill", class: "rounded-full", value: "9999px" },
  { name: "3XL", class: "rounded-3xl", value: "24px" },
  { name: "2XL", class: "rounded-2xl", value: "16px" },
  { name: "XL", class: "rounded-xl", value: "12px" },
  { name: "LG", class: "rounded-lg", value: "8px" },
  { name: "MD", class: "rounded-md", value: "6px" },
];

interface AnimationDef {
  name: string;
  class: string;
  duration: string;
  type: string;
}

const ANIMATIONS: AnimationDef[] = [
  { name: "Fade Up", class: "animate-fade-up", duration: "0.6s", type: "entrance" },
  { name: "Fade In", class: "animate-fade-in", duration: "0.6s", type: "entrance" },
  { name: "Scale In", class: "animate-scale-in", duration: "0.6s", type: "entrance" },
  { name: "Pulse Glow", class: "animate-pulse-glow", duration: "2s", type: "infinite" },
  { name: "Spin Slow", class: "animate-spin-slow", duration: "8s", type: "infinite" },
  { name: "Morph Blob", class: "animate-morph-blob", duration: "5s", type: "infinite" },
  { name: "Sonar", class: "animate-sonar", duration: "2s", type: "infinite" },
  { name: "Dot Bounce", class: "animate-dot-bounce", duration: "1.4s", type: "infinite" },
  { name: "Pulse Ring", class: "animate-pulse-ring", duration: "2.5s", type: "infinite" },
];

interface IconEntry {
  name: string;
  icon: LucideIcon;
  category: string;
}

const ICONS: IconEntry[] = [
  { name: "Activity", icon: Activity, category: "Features" },
  { name: "PhoneCall", icon: PhoneCall, category: "Features" },
  { name: "Database", icon: Database, category: "Features" },
  { name: "UserCheck", icon: UserCheck, category: "Features" },
  { name: "BarChart3", icon: BarChart3, category: "Features" },
  { name: "Shield", icon: Shield, category: "Features" },
  { name: "ShieldCheck", icon: ShieldCheck, category: "Status" },
  { name: "ArrowRight", icon: ArrowRight, category: "Navigation" },
  { name: "ChevronRight", icon: ChevronRight, category: "Navigation" },
  { name: "ExternalLink", icon: ExternalLink, category: "Navigation" },
  { name: "Menu", icon: Menu, category: "Navigation" },
  { name: "X", icon: X, category: "Navigation" },
  { name: "PlayCircle", icon: PlayCircle, category: "Actions" },
  { name: "Mail", icon: Mail, category: "Actions" },
  { name: "Calendar", icon: Calendar, category: "Actions" },
  { name: "Search", icon: Search, category: "Actions" },
  { name: "Bell", icon: Bell, category: "Actions" },
  { name: "Settings", icon: Settings, category: "Actions" },
  { name: "Github", icon: Github, category: "Social" },
  { name: "Linkedin", icon: Linkedin, category: "Social" },
  { name: "Sun", icon: Sun, category: "Theme" },
  { name: "Moon", icon: Moon, category: "Theme" },
  { name: "Heart", icon: Heart, category: "Misc" },
  { name: "Target", icon: Target, category: "Misc" },
  { name: "Rocket", icon: Rocket, category: "Misc" },
  { name: "Users", icon: Users, category: "Misc" },
  { name: "Zap", icon: Zap, category: "Misc" },
  { name: "MessageSquare", icon: MessageSquare, category: "Misc" },
  { name: "Clock", icon: Clock, category: "Misc" },
  { name: "Star", icon: Star, category: "Misc" },
  { name: "Globe", icon: Globe, category: "Misc" },
  { name: "Lock", icon: Lock, category: "Misc" },
  { name: "Home", icon: Home, category: "Misc" },
  { name: "FileText", icon: FileText, category: "Misc" },
  { name: "HelpCircle", icon: HelpCircle, category: "Misc" },
];

interface CSSVarRef {
  variable: string;
  darkValue: string;
  lightValue: string;
  usage: string;
}

const CSS_VARIABLES: CSSVarRef[] = [
  { variable: "--background", darkValue: "224 65% 3%", lightValue: "0 0% 100%", usage: "Page background" },
  { variable: "--foreground", darkValue: "0 0% 93%", lightValue: "222 47% 11%", usage: "Primary text" },
  { variable: "--card", darkValue: "228 33% 6%", lightValue: "0 0% 100%", usage: "Card background" },
  { variable: "--card-foreground", darkValue: "0 0% 93%", lightValue: "222 47% 11%", usage: "Card text" },
  { variable: "--popover", darkValue: "228 33% 6%", lightValue: "0 0% 100%", usage: "Popover bg" },
  { variable: "--popover-foreground", darkValue: "0 0% 93%", lightValue: "222 47% 11%", usage: "Popover text" },
  { variable: "--primary", darkValue: "16 100% 60%", lightValue: "18 100% 55%", usage: "Primary accent" },
  { variable: "--primary-foreground", darkValue: "224 65% 3%", lightValue: "0 0% 100%", usage: "Text on primary" },
  { variable: "--secondary", darkValue: "199 89% 48%", lightValue: "199 89% 45%", usage: "Secondary accent" },
  { variable: "--secondary-foreground", darkValue: "0 0% 100%", lightValue: "199 89% 10%", usage: "Text on secondary" },
  { variable: "--muted", darkValue: "217 33% 17%", lightValue: "210 40% 96%", usage: "Muted background" },
  { variable: "--muted-foreground", darkValue: "215 20% 65%", lightValue: "215 16% 47%", usage: "Muted text" },
  { variable: "--accent", darkValue: "18 100% 60%", lightValue: "18 100% 55%", usage: "Accent color" },
  { variable: "--accent-foreground", darkValue: "222 69% 3%", lightValue: "222 47% 11%", usage: "Text on accent" },
  { variable: "--destructive", darkValue: "0 84.2% 60.2%", lightValue: "0 84.2% 60.2%", usage: "Destructive" },
  { variable: "--success", darkValue: "142 71% 45%", lightValue: "142 71% 45%", usage: "Success state" },
  { variable: "--warning", darkValue: "38 92% 50%", lightValue: "38 92% 50%", usage: "Warning state" },
  { variable: "--border", darkValue: "215 20% 18%", lightValue: "214 32% 91%", usage: "Borders" },
  { variable: "--input", darkValue: "215 20% 18%", lightValue: "214 32% 91%", usage: "Input borders" },
  { variable: "--ring", darkValue: "18 100% 60%", lightValue: "18 100% 55%", usage: "Focus rings" },
  { variable: "--radius", darkValue: "0.75rem", lightValue: "0.75rem", usage: "Base radius" },
  { variable: "--chart-1", darkValue: "18 100% 60%", lightValue: "18 100% 55%", usage: "Chart primary" },
  { variable: "--chart-2", darkValue: "199 89% 48%", lightValue: "199 89% 45%", usage: "Chart secondary" },
  { variable: "--chart-3", darkValue: "142 71% 45%", lightValue: "142 71% 45%", usage: "Chart tertiary" },
  { variable: "--chart-4", darkValue: "280 65% 60%", lightValue: "280 65% 55%", usage: "Chart quaternary" },
  { variable: "--chart-5", darkValue: "38 92% 50%", lightValue: "38 92% 50%", usage: "Chart quinary" },
];

// ============================================================================
// INLINE COMPONENTS
// ============================================================================

function SectionHeader({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-12 sm:mb-16">
      <SectionBadge className="mb-6">{title}</SectionBadge>
      <h2
        id={id}
        className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 font-space-grotesk font-semibold text-foreground scroll-mt-24"
      >
        {title}
      </h2>
      <p className="text-lg font-geist text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ColorSwatch({
  color,
  onCopy,
  copiedValue,
}: {
  color: ColorToken;
  onCopy: (text: string) => void;
  copiedValue: string | null;
}) {
  const isCopied = copiedValue === color.hex;

  return (
    <button
      type="button"
      onClick={() => onCopy(color.hex)}
      className="group text-left rounded-xl border border-border bg-card p-4 hover:border-[#FF6B35]/30 transition-all duration-300 cursor-pointer"
    >
      <div
        className="w-full h-16 rounded-lg mb-3 border border-white/10"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground font-geist truncate">
            {color.name}
          </p>
          <p className="text-xs text-muted-foreground font-space-mono mt-0.5">
            {color.hex}
          </p>
          <p className="text-xs text-muted-foreground/60 font-space-mono mt-0.5">
            {color.cssVar}
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
      {color.description && (
        <p className="text-xs text-muted-foreground/50 mt-1.5 font-geist">
          {color.description}
        </p>
      )}
    </button>
  );
}

function GlassSwatch({
  token,
  onCopy,
  copiedValue,
}: {
  token: GlassToken;
  onCopy: (text: string) => void;
  copiedValue: string | null;
}) {
  const isCopied = copiedValue === token.value;

  return (
    <button
      type="button"
      onClick={() => onCopy(token.value)}
      className="group text-left rounded-xl border border-border bg-card p-4 hover:border-[#FF6B35]/30 transition-all duration-300 cursor-pointer"
    >
      {/* Checkered background to show transparency */}
      <div className="w-full h-16 rounded-lg mb-3 relative overflow-hidden border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #1a1a2e 25%, transparent 25%), linear-gradient(-45deg, #1a1a2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a2e 75%), linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)",
            backgroundSize: "12px 12px",
            backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: token.value }}
        />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground font-geist truncate">
            {token.name}
          </p>
          <p className="text-xs text-muted-foreground font-space-mono mt-0.5 truncate">
            {token.value}
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </button>
  );
}

function CodeBlock({
  code,
  onCopy,
  copiedValue,
}: {
  code: string;
  onCopy: (text: string) => void;
  copiedValue: string | null;
}) {
  const isCopied = copiedValue === code;

  return (
    <div className="relative group">
      <pre className="bg-card/50 border border-border rounded-xl p-4 overflow-x-auto">
        <code className="text-xs font-space-mono text-muted-foreground">
          {code}
        </code>
      </pre>
      <button
        type="button"
        onClick={() => onCopy(code)}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-foreground/5 hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        {isCopied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

function AnimationDemo({
  animation,
}: {
  animation: AnimationDef;
}) {
  const [playing, setPlaying] = useState(animation.type === "infinite");

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-foreground font-geist">
            {animation.name}
          </p>
          <p className="text-xs text-muted-foreground font-space-mono mt-0.5">
            {animation.class}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="p-1.5 rounded-md bg-foreground/5 hover:bg-foreground/10 transition-colors"
        >
          {playing ? (
            <Pause className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <Play className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="h-20 flex items-center justify-center bg-foreground/[0.02] rounded-lg border border-border/50">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/30",
            playing && animation.class
          )}
          style={{
            animationPlayState: playing ? "running" : "paused",
            animationFillMode: "forwards",
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground font-space-mono">
        <span>{animation.duration}</span>
        <span className="text-muted-foreground/30">|</span>
        <span>{animation.type}</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DesignSystemPage() {
  const { copiedValue, copy } = useCopyToClipboard();

  return (
    <div className="relative">
      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            <SectionBadge className="mb-6">Design System</SectionBadge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]">
              AutoCrew{" "}
              <span className="text-[#FF6B35]">Design System</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground font-geist leading-relaxed max-w-2xl">
              A comprehensive reference of every design token, typography
              scale, color, spacing value, and component pattern used across
              the AutoCrew brand. Use this guide to maintain visual
              consistency across all products.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STICKY NAV */}
      {/* ================================================================ */}
      <nav className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-y border-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 whitespace-nowrap transition-colors font-geist"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ================================================================ */}
      {/* SECTION 1: COLORS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="colors"
            title="Color Palette"
            description="The complete color system built on HSL CSS variables. Click any swatch to copy its hex value. Dark mode is the primary theme."
          />

          {/* Core Brand */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Core Brand
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {COLORS_BRAND.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Backgrounds & Surfaces */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Backgrounds & Surfaces
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COLORS_BACKGROUNDS.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Text Colors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COLORS_TEXT.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Semantic Colors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COLORS_SEMANTIC.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Chart Colors */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Chart Colors
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {COLORS_CHART.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Border & Ring */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Borders & Focus
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COLORS_BORDER.map((c) => (
                <ColorSwatch key={c.cssVar} color={c} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Glass/Opacity Tokens */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Glass & Opacity Tokens
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {GLASS_TOKENS.map((t) => (
                <GlassSwatch key={t.cssVar} token={t} onCopy={copy} copiedValue={copiedValue} />
              ))}
            </div>
          </div>

          {/* Gradient Combos */}
          <div>
            <h3 className="text-lg font-medium font-geist text-foreground mb-4 tracking-tight">
              Gradient Patterns
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A]" />
                <p className="text-sm font-medium text-foreground font-geist">Primary Gradient</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">from-[#FF6B35] to-[#FF8C5A]</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 bg-gradient-to-r from-[#FF6B35] to-[#FF4444]" />
                <p className="text-sm font-medium text-foreground font-geist">Warm Gradient</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">from-[#FF6B35] to-[#FF4444]</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 gradient-text text-3xl font-bold font-space-grotesk flex items-center justify-center">Aa</div>
                <p className="text-sm font-medium text-foreground font-geist">Gradient Text</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">.gradient-text (primary to secondary)</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
                <p className="text-sm font-medium text-foreground font-geist">Subtle Background</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">from-primary/5 via-transparent to-secondary/5</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent" />
                <p className="text-sm font-medium text-foreground font-geist">Beam Line</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">from-transparent via-[#FF6B35] to-transparent</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="w-full h-16 rounded-lg mb-3 bg-[radial-gradient(1000px_400px_at_50%_50%,rgba(255,107,53,0.12),transparent_100%)]" />
                <p className="text-sm font-medium text-foreground font-geist">Section Glow</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">radial-gradient with primary/12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: TYPOGRAPHY */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="typography"
            title="Typography"
            description="Three font families form the type system. Space Grotesk for headlines, Geist Sans for body text, and Space Mono for code and labels."
          />

          {/* Font Families */}
          <div className="mb-16">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Font Families
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#FF6B35] font-space-mono mb-4">
                  Display
                </p>
                <p className="text-4xl font-space-grotesk font-bold text-foreground mb-2">
                  Space Grotesk
                </p>
                <p className="text-sm text-muted-foreground font-geist mb-4">
                  Used for headlines, section titles, and stat values
                </p>
                <div className="space-y-1 text-sm font-space-grotesk text-foreground/80">
                  <p className="font-light">Light 300</p>
                  <p className="font-normal">Regular 400</p>
                  <p className="font-medium">Medium 500</p>
                  <p className="font-semibold">Semibold 600</p>
                  <p className="font-bold">Bold 700</p>
                </div>
                <CodeBlock
                  code="font-space-grotesk"
                  onCopy={copy}
                  copiedValue={copiedValue}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#FF6B35] font-space-mono mb-4">
                  Body
                </p>
                <p className="text-4xl font-geist font-bold text-foreground mb-2">
                  Geist Sans
                </p>
                <p className="text-sm text-muted-foreground font-geist mb-4">
                  Used for body text, descriptions, navigation, and UI elements
                </p>
                <div className="space-y-1 text-sm font-geist text-foreground/80">
                  <p className="font-light">Light 300</p>
                  <p className="font-normal">Regular 400</p>
                  <p className="font-medium">Medium 500</p>
                  <p className="font-semibold">Semibold 600</p>
                  <p className="font-bold">Bold 700</p>
                </div>
                <CodeBlock
                  code="font-geist"
                  onCopy={copy}
                  copiedValue={copiedValue}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#FF6B35] font-space-mono mb-4">
                  Monospace
                </p>
                <p className="text-4xl font-space-mono font-bold text-foreground mb-2">
                  Space Mono
                </p>
                <p className="text-sm text-muted-foreground font-geist mb-4">
                  Used for labels, code snippets, timestamps, and technical content
                </p>
                <div className="space-y-1 text-sm font-space-mono text-foreground/80">
                  <p className="font-normal">Regular 400</p>
                  <p className="font-bold">Bold 700</p>
                </div>
                <CodeBlock
                  code="font-space-mono"
                  onCopy={copy}
                  copiedValue={copiedValue}
                />
              </div>
            </div>
          </div>

          {/* Type Scale */}
          <div>
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Type Scale
            </h3>
            <div className="space-y-8">
              {TYPOGRAPHY_SAMPLES.map((sample) => (
                <div
                  key={sample.level}
                  className="rounded-xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-[#FF6B35] font-space-mono bg-[#FF6B35]/10 px-2 py-0.5 rounded">
                      {sample.level}
                    </span>
                    <span className="text-xs text-muted-foreground font-geist">
                      {sample.font}
                    </span>
                  </div>

                  <div className={cn(sample.fontClass, sample.classes, "text-foreground mb-4")}>
                    {sample.sampleText}
                  </div>

                  <CodeBlock
                    code={`${sample.fontClass} ${sample.classes}`}
                    onCopy={copy}
                    copiedValue={copiedValue}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: SPACING & LAYOUT */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="spacing"
            title="Spacing & Layout"
            description="Consistent spacing tiers for sections, cards, and elements. All values follow a mobile-first responsive pattern."
          />

          {/* Section Padding */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Section Padding
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { bp: "Mobile", classes: "pt-16 pb-16", value: "64px" },
                { bp: "Tablet (sm:)", classes: "sm:pt-24 sm:pb-24", value: "96px" },
                { bp: "Desktop (md:)", classes: "md:pt-32 md:pb-32", value: "128px" },
              ].map((tier) => (
                <div key={tier.bp} className="rounded-xl border border-border bg-card p-6">
                  <p className="text-sm font-medium text-foreground font-geist mb-2">{tier.bp}</p>
                  <p className="text-3xl font-bold font-space-grotesk text-foreground mb-1">{tier.value}</p>
                  <p className="text-xs text-muted-foreground font-space-mono">{tier.classes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Container */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Container
            </h3>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="border-2 border-dashed border-[#FF6B35]/20 rounded-xl p-4 sm:p-6 relative">
                <div className="absolute top-2 left-4 text-xs text-[#FF6B35] font-space-mono">
                  max-w-7xl (1280px)
                </div>
                <div className="border border-dashed border-muted-foreground/20 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-space-mono">
                    <span>px-4 (16px)</span>
                    <span>Content Area</span>
                    <span>px-4 (16px)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/60 font-space-mono mt-3">
                  sm: px-6 (24px) side padding
                </p>
              </div>
              <CodeBlock
                code="max-w-7xl mx-auto px-4 sm:px-6"
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>

          {/* Card Padding */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Card Padding
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { bp: "Default", classes: "p-6", value: "24px" },
                { bp: "Tablet (sm:)", classes: "sm:p-8", value: "32px" },
                { bp: "Desktop (md:)", classes: "md:p-10", value: "40px" },
              ].map((tier) => (
                <div key={tier.bp} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div
                    className="border-2 border-dashed border-[#FF6B35]/20 m-1"
                    style={{ padding: tier.value }}
                  >
                    <div className="bg-foreground/5 rounded-lg h-12 flex items-center justify-center text-xs text-muted-foreground font-space-mono">
                      Content
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground font-geist">{tier.bp}</p>
                    <p className="text-xs text-muted-foreground font-space-mono">{tier.classes} = {tier.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Gaps */}
          <div>
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Common Gaps
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { class: "gap-4", value: "16px" },
                { class: "gap-6", value: "24px" },
                { class: "gap-8", value: "32px" },
                { class: "gap-12", value: "48px" },
              ].map((gap) => (
                <div key={gap.class} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-end mb-3" style={{ gap: gap.value }}>
                    <div className="w-8 h-8 rounded bg-[#FF6B35]/20 border border-[#FF6B35]/30 shrink-0" />
                    <div className="w-8 h-8 rounded bg-[#FF6B35]/20 border border-[#FF6B35]/30 shrink-0" />
                  </div>
                  <p className="text-sm font-medium text-foreground font-geist">{gap.value}</p>
                  <p className="text-xs text-muted-foreground font-space-mono">{gap.class}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: BORDER RADIUS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="radius"
            title="Border Radius"
            description="A consistent radius scale from pill-shaped buttons to subtle card corners. Larger radii for outer containers, smaller for nested elements."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {RADII.map((r) => (
              <div key={r.name} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={cn(
                      "w-20 h-20 bg-[#FF6B35]/15 border-2 border-[#FF6B35]/30",
                      r.class
                    )}
                  />
                </div>
                <p className="text-sm font-medium text-foreground font-geist">{r.name}</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5">{r.class}</p>
                <p className="text-xs text-muted-foreground/60 font-space-mono">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 5: BUTTONS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="buttons"
            title="Buttons"
            description="Unified button system with pill variants for landing page CTAs and standard Shadcn UI variants for application interfaces. All landing CTAs now use the Button component for consistency."
          />

          {/* Pill Buttons — Landing Page CTAs */}
          <div className="mb-16">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Pill Buttons (Landing Page CTAs)
            </h3>
            <div className="rounded-xl border border-border bg-card p-8">
              <h4 className="text-sm font-medium text-foreground font-geist mb-4">variant=&quot;pill&quot;</h4>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button variant="pill" size="pill-lg">
                  Large CTA
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="pill" size="pill-md">
                  Medium CTA
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="pill" size="pill-sm">
                  Small CTA
                </Button>
              </div>

              <h4 className="text-sm font-medium text-foreground font-geist mb-4">variant=&quot;pill-outline&quot;</h4>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button variant="pill-outline" size="pill-lg">
                  <PlayCircle className="w-4 h-4 text-[#FF6B35]" />
                  Large Outline
                </Button>
                <Button variant="pill-outline" size="pill-md">
                  <MessageSquare className="w-4 h-4" />
                  Medium Outline
                </Button>
                <Button variant="pill-outline" size="pill-sm">
                  Small Outline
                </Button>
              </div>

              <CodeBlock
                code={`import { Button } from "@/components/ui/button"

// Primary pill CTA (hero, main actions)
<Button variant="pill" size="pill-lg">Start for free</Button>

// Medium pill CTA (section CTAs)
<Button variant="pill" size="pill-md">View full FAQ</Button>

// Small pill CTA (nav buttons)
<Button variant="pill" size="pill-sm">Start for free</Button>

// Outline pill (secondary actions)
<Button variant="pill-outline" size="pill-lg">Watch demo</Button>
<Button variant="pill-outline" size="pill-md">Contact support</Button>
<Button variant="pill-outline" size="pill-sm">Sign In</Button>

// As link (with Next.js Link)
<Button variant="pill" size="pill-md" asChild>
  <Link href="/signup">Get started</Link>
</Button>`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>

          {/* Shadcn Buttons */}
          <div className="mb-16">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Shadcn UI Variants
            </h3>
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>

              <h4 className="text-sm font-medium text-foreground font-geist mb-4 mt-8">Sizes</h4>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><ArrowRight className="w-4 h-4" /></Button>
              </div>

              <CodeBlock
                code={`import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg"`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>

          {/* Badge Variants */}
          <div className="mb-16">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Badge Variants
            </h3>
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>

              <CodeBlock
                code={`import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>

          {/* Section Badge */}
          <div>
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Section Badge (Landing Page)
            </h3>
            <div className="rounded-xl border border-border bg-card p-8">
              <p className="text-sm text-muted-foreground font-geist mb-6">
                Unified badge component used across all landing page sections. Replaces the previous inconsistent inline implementations.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <SectionBadge>Default with pulse dot</SectionBadge>
                <SectionBadge icon={<HelpCircle className="w-3.5 h-3.5" />}>
                  With custom icon
                </SectionBadge>
                <SectionBadge icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Announcement badge
                </SectionBadge>
              </div>

              <CodeBlock
                code={`import { SectionBadge } from "@/components/landing/section-badge"

// Default (animated pulse dot)
<SectionBadge>System Capabilities</SectionBadge>

// With custom icon
<SectionBadge icon={<HelpCircle className="w-3.5 h-3.5" />}>
  Frequently Asked Questions
</SectionBadge>

// Consistent styles across ALL sections:
// px-3 py-1 rounded-full bg-[#FF6B35]/5 border-[#FF6B35]/20
// text-xs font-medium text-[#FF6B35] font-space`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 6: GLASS EFFECTS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="glass"
            title="Glass Effects & Surfaces"
            description="Glassmorphism effects used throughout the interface for depth and visual hierarchy. All use backdrop-blur with subtle borders and shadows."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Glass Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="text-sm font-medium text-foreground font-geist mb-4">.glass-card</h4>
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/30 via-[#17B8D1]/20 to-[#FF6B35]/10" />
                <div className="absolute inset-4 glass-card rounded-xl p-4 flex items-center justify-center">
                  <p className="text-sm text-foreground font-geist">Glass card content</p>
                </div>
              </div>
              <CodeBlock
                code={`.glass-card {
  background: hsl(var(--card) / 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
}`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>

            {/* Glass Nav */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="text-sm font-medium text-foreground font-geist mb-4">.glass-nav</h4>
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/20 to-transparent" />
                <div className="absolute top-4 inset-x-4 glass-nav rounded-full px-6 py-3 flex items-center justify-between border border-white/[0.08]">
                  <p className="text-sm font-medium text-foreground font-space-grotesk">Logo</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-geist">Nav Item</span>
                    <span className="text-xs text-muted-foreground font-geist">Nav Item</span>
                  </div>
                </div>
              </div>
              <CodeBlock
                code={`.glass-nav {
  background: linear-gradient(180deg, rgba(14,16,26,0.55), rgba(14,16,26,0.35));
  backdrop-filter: blur(16px) saturate(120%);
  border-color: var(--glass-border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04);
}`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>

            {/* Border Beam */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="text-sm font-medium text-foreground font-geist mb-4">.border-beam</h4>
              <div className="flex items-center justify-center h-40 mb-4">
                <div className="border-beam w-32 h-32 rounded-2xl bg-card border border-border flex items-center justify-center">
                  <p className="text-xs text-muted-foreground font-geist">Rotating beam</p>
                </div>
              </div>
              <CodeBlock
                code={`// Rotating conic gradient border
<div className="border-beam rounded-2xl">
  Content
</div>`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>

            {/* Hover Lift */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="text-sm font-medium text-foreground font-geist mb-4">.hover-lift</h4>
              <div className="flex items-center justify-center h-40 mb-4">
                <div className="hover-lift w-32 h-32 rounded-2xl bg-card border border-border flex items-center justify-center cursor-pointer">
                  <p className="text-xs text-muted-foreground font-geist">Hover me</p>
                </div>
              </div>
              <CodeBlock
                code={`.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px hsl(var(--primary) / 0.15);
}`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 7: SHADOWS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="shadows"
            title="Shadows & Elevation"
            description="Shadow tokens for creating visual depth. From subtle card shadows to prominent glow effects using the primary color."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Flat", class: "", shadow: "none" },
              { name: "Shadow SM", class: "shadow-sm", shadow: "shadow-sm" },
              { name: "Shadow LG", class: "shadow-lg shadow-black/20", shadow: "shadow-lg shadow-black/20" },
              { name: "Primary Glow", class: "shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)]", shadow: "shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)]" },
              { name: "CTA Card Shadow", class: "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]", shadow: "shadow-[0_20px_40px_-15px_...]" },
              { name: "Glow Hover", class: "shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]", shadow: "shadow-[0_0_15px_-3px_...]" },
            ].map((s) => (
              <div key={s.name} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-center h-28 mb-4">
                  <div
                    className={cn(
                      "w-24 h-24 rounded-2xl bg-card border border-border",
                      s.class
                    )}
                  />
                </div>
                <p className="text-sm font-medium text-foreground font-geist">{s.name}</p>
                <p className="text-xs text-muted-foreground font-space-mono mt-0.5 truncate">{s.shadow}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 8: ANIMATIONS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="animations"
            title="Animations & Motion"
            description="Entrance animations, infinite loops, and interactive effects. All animations respect prefers-reduced-motion. Click play/pause to toggle."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {ANIMATIONS.map((anim) => (
              <AnimationDemo key={anim.name} animation={anim} />
            ))}
          </div>

          {/* Section Transition Effects */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Section Transition Effects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h4 className="text-sm font-medium text-foreground font-geist mb-2">.section-glow-top</h4>
                <div className="relative h-24 bg-background rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(255,107,53,0.08),transparent_70%)]" />
                </div>
                <p className="text-xs text-muted-foreground font-space-mono mt-2">Radial gradient glow at section top</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h4 className="text-sm font-medium text-foreground font-geist mb-2">.section-divider</h4>
                <div className="relative h-24 bg-background rounded-lg flex items-start justify-center overflow-hidden">
                  <div className="w-[60%] h-px bg-gradient-to-r from-transparent via-[#FF6B35]/15 to-transparent mt-8" />
                </div>
                <p className="text-xs text-muted-foreground font-space-mono mt-2">Gradient line with primary accent center</p>
              </div>
            </div>
          </div>

          {/* Reduced Motion Note */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground font-geist mb-1">
                  Reduced Motion Support
                </p>
                <p className="text-sm text-muted-foreground font-geist leading-relaxed">
                  All animations are disabled for users with{" "}
                  <code className="text-xs bg-foreground/5 px-1.5 py-0.5 rounded font-space-mono">
                    prefers-reduced-motion: reduce
                  </code>
                  . The global media query sets all{" "}
                  <code className="text-xs bg-foreground/5 px-1.5 py-0.5 rounded font-space-mono">
                    .animate-*
                  </code>{" "}
                  classes to{" "}
                  <code className="text-xs bg-foreground/5 px-1.5 py-0.5 rounded font-space-mono">
                    animation: none
                  </code>{" "}
                  with default opacity of 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 9: ICONS */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="icons"
            title="Icons"
            description="Lucide React is the icon library. Common sizes are w-4 h-4 (inline), w-5 h-5 (medium), w-6 h-6 (feature cards), and w-8 h-8 (large)."
          />

          {/* Size Examples */}
          <div className="mb-12">
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Icon Sizes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { size: "w-4 h-4", px: "16px", label: "Inline" },
                { size: "w-5 h-5", px: "20px", label: "Medium" },
                { size: "w-6 h-6", px: "24px", label: "Feature" },
                { size: "w-8 h-8", px: "32px", label: "Large" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className={cn(s.size, "text-[#FF6B35]")} />
                  </div>
                  <p className="text-sm font-medium text-foreground font-geist">{s.label}</p>
                  <p className="text-xs text-muted-foreground font-space-mono">{s.size}</p>
                  <p className="text-xs text-muted-foreground/60 font-space-mono">{s.px}</p>
                </div>
              ))}
            </div>
          </div>

          {/* All Icons Grid */}
          <div>
            <h3 className="text-lg font-medium font-geist text-foreground mb-6 tracking-tight">
              Icon Library
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
              {ICONS.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div
                    key={entry.name}
                    className="rounded-xl border border-border bg-card p-4 text-center hover:border-[#FF6B35]/30 transition-colors"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground font-geist truncate">
                      {entry.name}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <CodeBlock
                code={`import { Activity, ArrowRight, Shield } from "lucide-react"

<Activity className="w-6 h-6 text-[#FF6B35]" />
<ArrowRight className="w-4 h-4 text-muted-foreground" />`}
                onCopy={copy}
                copiedValue={copiedValue}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 10: CSS VARIABLES REFERENCE */}
      {/* ================================================================ */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            id="variables"
            title="CSS Variables Reference"
            description="Complete reference of every CSS custom property. All colors use HSL format without the hsl() wrapper, enabling opacity modifiers via Tailwind."
          />

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-foreground/[0.02]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground font-geist uppercase tracking-wider">
                      Variable
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground font-geist uppercase tracking-wider">
                      Dark Value
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground font-geist uppercase tracking-wider hidden sm:table-cell">
                      Light Value
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground font-geist uppercase tracking-wider hidden md:table-cell">
                      Usage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CSS_VARIABLES.map((v, i) => (
                    <tr
                      key={v.variable}
                      className={cn(
                        "border-b border-border/50 hover:bg-foreground/[0.02] transition-colors cursor-pointer",
                        i % 2 === 0 && "bg-foreground/[0.01]"
                      )}
                      onClick={() => copy(`var(${v.variable})`)}
                    >
                      <td className="px-4 py-2.5">
                        <code className="text-xs font-space-mono text-[#FF6B35]">
                          {v.variable}
                        </code>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm border border-white/10 shrink-0"
                            style={{
                              backgroundColor: v.variable === "--radius"
                                ? "transparent"
                                : `hsl(${v.darkValue})`,
                            }}
                          />
                          <code className="text-xs font-space-mono text-muted-foreground">
                            {v.darkValue}
                          </code>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm border border-black/10 shrink-0"
                            style={{
                              backgroundColor: v.variable === "--radius"
                                ? "transparent"
                                : `hsl(${v.lightValue})`,
                            }}
                          />
                          <code className="text-xs font-space-mono text-muted-foreground">
                            {v.lightValue}
                          </code>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground font-geist">
                          {v.usage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border bg-foreground/[0.02]">
              <p className="text-xs text-muted-foreground font-geist">
                Click any row to copy the CSS variable reference. Usage:{" "}
                <code className="font-space-mono bg-foreground/5 px-1 py-0.5 rounded">
                  hsl(var(--primary))
                </code>{" "}
                or with Tailwind:{" "}
                <code className="font-space-mono bg-foreground/5 px-1 py-0.5 rounded">
                  bg-primary text-primary-foreground
                </code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Toast */}
      {copiedValue && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg shadow-black/20">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-foreground font-geist">
              Copied to clipboard
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

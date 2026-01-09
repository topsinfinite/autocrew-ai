"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  Building2,
  Shield,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useClient } from "@/lib/hooks/use-client";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
  { name: "Agent Crews", href: "/crews", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { selectedClient, setSelectedClient, availableClients } = useClient();
  const { isSuperAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SECURITY: Validate that selectedClient is in availableClients
  // This prevents showing cached/stale organization data
  useEffect(() => {
    if (selectedClient && availableClients.length > 0) {
      const isValid = availableClients.some(c => c.id === selectedClient.id);
      if (!isValid) {
        console.error(
          '[Sidebar] SECURITY WARNING: Selected client is not in available clients!',
          {
            selectedClient: selectedClient.id,
            availableClients: availableClients.map(c => c.id)
          }
        );
      }
    }
  }, [selectedClient, availableClients]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Image
          src="/images/logo.png"
          alt="AutoCrew"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">AutoCrew</span>
          <span className="text-xs text-muted-foreground">Agent Platform</span>
        </div>
      </div>

      {/* Client Selector for SuperAdmin ONLY */}
      {isSuperAdmin && selectedClient && availableClients.length > 0 &&
       availableClients.some(c => c.id === selectedClient.id) && (
        <div className="border-b border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>SuperAdmin View</span>
          </div>
          <Select
            value={selectedClient.id}
            onValueChange={(value) => {
              const client = availableClients.find((c) => c.id === value);
              if (client) setSelectedClient(client);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{selectedClient.companyName}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Current Organization Display for Client Admins (Read-Only) */}
      {!isSuperAdmin && selectedClient &&
       availableClients.some(c => c.id === selectedClient.id) && (
        <div className="border-b border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span>Your Organization</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">
                {selectedClient.companyName}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedClient.plan} plan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link
          href="/settings"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>

        {/* Theme Toggle */}
        <div className="mt-3 flex items-center justify-between px-3">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            setMobileMenuOpen(false);
          }}
          className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>

        <div className="mt-4 px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-card">
            {sidebarContent}
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-card">
        {sidebarContent}
      </div>
    </>
  );
}

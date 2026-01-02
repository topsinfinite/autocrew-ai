"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { mockClients } from "@/lib/mock-data/multi-tenant-data";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"super_admin" | "client_admin">("client_admin");
  const [selectedClientId, setSelectedClientId] = useState(mockClients[0].id);

  const handleLogin = () => {
    if (selectedRole === "super_admin") {
      login("super_admin", undefined, {
        email: "superadmin@autocrew.com",
        name: "Super Admin",
      });
      router.push("/admin");
    } else {
      const client = mockClients.find(c => c.id === selectedClientId);
      // Use clientCode instead of id for database compatibility
      login("client_admin", client?.clientCode, {
        email: `admin@${client?.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        name: `${client?.companyName} Admin`,
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">AutoCrew</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Select your role to continue
          </p>

          {/* Role Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Login As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("client_admin")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "client_admin"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold">Client Admin</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Manage your organization
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("super_admin")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "super_admin"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold">SuperAdmin</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Manage all clients
                  </div>
                </button>
              </div>
            </div>

            {/* Client Selection (only for client_admin) */}
            {selectedRole === "client_admin" && (
              <div>
                <label htmlFor="client" className="block text-sm font-medium mb-2">
                  Select Organization
                </label>
                <select
                  id="client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName} - {client.plan}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mock Email Display */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="text-xs text-muted-foreground mb-1">Mock Login Details</div>
              <div className="text-sm font-mono">
                {selectedRole === "super_admin" ? (
                  <>
                    <div>Email: superadmin@autocrew.com</div>
                    <div>Role: Super Administrator</div>
                  </>
                ) : (
                  <>
                    <div>
                      Email: admin@{mockClients.find(c => c.id === selectedClientId)?.companyName.toLowerCase().replace(/\s+/g, '')}.com
                    </div>
                    <div>Role: Client Administrator</div>
                    <div>Organization: {mockClients.find(c => c.id === selectedClientId)?.companyName}</div>
                  </>
                )}
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full"
            >
              Continue to Dashboard
            </Button>

            {/* Info */}
            <p className="text-xs text-center text-muted-foreground">
              This is a mock login. No password required.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}

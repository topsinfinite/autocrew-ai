"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { AdminUser } from "@/types";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "client_admin" | "viewer";
  clientId?: string;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<MockUser | null>("mockUser", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setIsLoading(false);
  }, []);

  const login = (
    role: "super_admin" | "client_admin" | "viewer",
    clientId?: string,
    userData?: { email: string; name: string }
  ) => {
    const mockUser: MockUser = {
      id: role === "super_admin" ? "super-admin-1" : `admin-${clientId}`,
      email: userData?.email || `${role}@autocrew.com`,
      name: userData?.name || role.replace("_", " ").toUpperCase(),
      role,
      clientId: role === "super_admin" ? undefined : clientId,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isSuperAdmin = user?.role === "super_admin";
  const isClientAdmin = user?.role === "client_admin";

  return {
    user,
    isLoggedIn,
    isLoading,
    isSuperAdmin,
    isClientAdmin,
    login,
    logout,
  };
}

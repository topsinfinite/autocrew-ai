// Authentication and user-related types

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  clientId: string;
  email: string;
  name: string;
  role: "super_admin" | "client_admin" | "viewer";
  createdAt: Date;
}

export type UserRole = "super_admin" | "client_admin" | "viewer";

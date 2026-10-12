import type { Role } from "@/types";

export const AUTH_COOKIE = "rentnest_token";

export const DASHBOARD_HOME: Record<Role, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export const COMMON_AMENITIES = ["wifi", "parking", "lift", "security", "generator", "furnished", "air conditioning", "garden", "gym", "pool"];

export const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@rentnest.com", password: "admin123" },
  { label: "Landlord", email: "landlord@rentnest.com", password: "landlord123" },
  { label: "Tenant", email: "tenant@rentnest.com", password: "tenant123" },
];

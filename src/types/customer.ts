import type { Address } from "./order";

export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  cf: string | null;
  piva: string | null;
  sdi_code: string | null;
  billing_address: Address | null;
  shipping_address: Address | null;
  created_at: string;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cf?: string;
  piva?: string;
  sdi_code?: string;
  shipping_address: Address;
  billing_address?: Address;
}

export type AuthMode = "signup" | "login" | "magic_link";

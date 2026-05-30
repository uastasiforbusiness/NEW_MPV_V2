export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "nexi" | "paypal" | "klarna";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  iva_amount: number;
  total: number;
  shipping_method: string;
  shipping_cost: number;
  tracking_code: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_address: Address;
  billing_address: Address;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  cap: string;
  country: string;
  phone: string;
}

export interface Invoice {
  id: string;
  order_id: string;
  sdi_status: SdiStatus;
  xml_url: string | null;
  pdf_url: string | null;
  invoice_number: string;
  created_at: string;
}

export type SdiStatus =
  | "INVIATA"
  | "ACCETTAZIONE"
  | "RIFIUTO"
  | "SCARTO"
  | "CONSEGNA";

export type OrderTransition =
  | "pending_to_paid"
  | "pending_to_cancelled"
  | "paid_to_processing"
  | "paid_to_cancelled"
  | "processing_to_shipped"
  | "shipped_to_delivered";

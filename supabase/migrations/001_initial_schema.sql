-- MPV Italia E-Commerce — Initial Schema
-- All tables for luxury pet furniture e-commerce platform

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price_eur numeric(10,2) NOT NULL CHECK (price_eur > 0),
  iva_rate numeric(4,3) NOT NULL DEFAULT 0.22,
  stock_status text NOT NULL CHECK (stock_status IN ('disponibile', 'su_ordinazione', 'esaurito')),
  images jsonb NOT NULL DEFAULT '[]',
  materials text NOT NULL DEFAULT '',
  dimensions text NOT NULL DEFAULT '',
  weight_kg numeric(6,2),
  category text NOT NULL DEFAULT 'divani',
  color text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Customers table (1:1 with auth.users)
CREATE TABLE customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  cf text,
  piva text,
  sdi_code text,
  billing_address jsonb,
  shipping_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) NOT NULL CHECK (subtotal >= 0),
  iva_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  shipping_method text NOT NULL DEFAULT 'standard',
  shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  tracking_code text,
  payment_method text CHECK (payment_method IN ('nexi', 'paypal', 'klarna')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address jsonb NOT NULL,
  billing_address jsonb NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price numeric(10,2) NOT NULL CHECK (total_price >= 0),
  product_name text NOT NULL DEFAULT '',
  product_slug text NOT NULL DEFAULT ''
);

-- Invoices table
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sdi_status text NOT NULL DEFAULT 'INVIATA' CHECK (sdi_status IN ('INVIATA', 'ACCETTAZIONE', 'RIFIUTO', 'SCARTO', 'CONSEGNA')),
  xml_url text,
  pdf_url text,
  invoice_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Order transitions lookup table (state machine)
CREATE TABLE order_transitions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_status text NOT NULL,
  to_status text NOT NULL,
  allowed boolean NOT NULL DEFAULT false,
  trigger text NOT NULL,
  UNIQUE(from_status, to_status)
);

-- Webhook log table
CREATE TABLE webhook_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  signature text,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed', 'dead')),
  error_message text,
  order_id uuid REFERENCES orders(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_webhook_log_status ON webhook_log(status);
CREATE INDEX idx_webhook_log_provider ON webhook_log(provider);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);

-- Insert valid order transitions (state machine)
INSERT INTO order_transitions (from_status, to_status, allowed, trigger) VALUES
  ('pending', 'paid', true, 'payment_webhook'),
  ('pending', 'cancelled', true, 'user_cancellation'),
  ('paid', 'processing', true, 'admin_action'),
  ('paid', 'cancelled', true, 'admin_refund'),
  ('processing', 'shipped', true, 'admin_tracking'),
  ('shipped', 'delivered', true, 'admin_delivery'),
  ('delivered', 'returned', false, 'post_mvp'),
  ('cancelled', 'paid', false, 'cannot_reactivate');

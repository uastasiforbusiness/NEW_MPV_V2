-- MPV Italia E-Commerce — RLS Policies
-- Row Level Security for all tables

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_log ENABLE ROW LEVEL SECURITY;

-- Products: Public read, service role full access
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Service role full access products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Customers: Users can read/update own profile
CREATE POLICY "Users can read own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role full access customers"
  ON customers FOR ALL
  USING (auth.role() = 'service_role');

-- Orders: Users can view own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Service role full access orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- Order items: Users can view items from own orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access order_items"
  ON order_items FOR ALL
  USING (auth.role() = 'service_role');

-- Invoices: Users can view invoices from own orders
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access invoices"
  ON invoices FOR ALL
  USING (auth.role() = 'service_role');

-- Order transitions: Readable by all authenticated, admin only for write
CREATE POLICY "Order transitions are publicly readable"
  ON order_transitions FOR SELECT
  USING (true);

CREATE POLICY "Service role full access order_transitions"
  ON order_transitions FOR ALL
  USING (auth.role() = 'service_role');

-- Webhook log: Service role only
CREATE POLICY "Service role full access webhook_log"
  ON webhook_log FOR ALL
  USING (auth.role() = 'service_role');

-- Create the auth schema trigger to auto-create customer on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.customers (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

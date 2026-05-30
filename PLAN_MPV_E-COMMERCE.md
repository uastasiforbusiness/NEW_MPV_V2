# MPV Italia E-Commerce — Especificación Técnica de Desarrollo (v4.0 Consensus)

**Stack:** Next.js 15 (App Router) + Supabase + Nexi XPay + Invoicetronic
**Segmento:** Luxury Pet Furniture (€3.8k–4.5k) | **Mercado:** Italia | **Alcance:** Opción A (Completa ~114h)
**Estado:** Aprobado vía consenso Planner → Architect → Critic (2 iteraciones)

---

## Principios

1. **Spec-Driven Development** — Este documento es la única fuente de verdad técnica
2. **Compliance First** — Legal italiano (FatturaPA/SDI, IVA 22%, GDPR, Diritto di Recesso) construido desde el inicio
3. **Luxury UX Standard** — Cada decisión UI refleja el segmento €3.8k–4.5k
4. **Server-First Architecture** — 80%+ Server Components, `use client` solo para carrito/checkout/pagos
5. **Idempotent & Verifiable** — Todos los webhooks, facturas, transiciones de estado idempotentes y firmados

## Decision Drivers

1. **Italian Market Compliance** — XML FatturaPA, flujo async SDI, validación CF/P.IVA, desglose IVA
2. **Payment Security** — Nexi MAC SHA256, delegación PCI DSS, idempotencia webhooks
3. **Performance at Luxury Tier** — LCP <1.5s, INP <200ms

## Análisis de Alternativas

| Opción | Descripción | Pros | Contras | Decisión |
|:---|:---|:---|:---|:---|
| **A: Secuencial Fase por Fase** | Construir 1→11 en orden | Dependencias claras, debugging fácil | Descubrimiento tardío de riesgos | **ELEGIDA** — mitigada por spike Fase 2.5 |
| B: Orden por Riesgo | Construir Pagos+Facturación antes que UI | Valida las partes más difíciles primero | Requiere mocks, bloquea demos | RECHAZADA |
| C: Tracks Paralelos | Frontend + Backend simultáneamente | Más rápido con 2+ devs | Cuellos de botella de integración | RECHAZADA — asume equipo de 3+ |
| D: MVP Incremental | Lanzar checkout antes que AI | Ingresos más rápido | Divide el spec en dos entregas | PARCIAL — redistribución de horas |

---

## Máquina de Estados de Órdenes

```
pending → paid          (webhook: Nexi/PayPal pago confirmado)
pending → cancelled     (acción usuario o timeout: 30min)
paid → processing       (acción admin: inicio de cumplimiento)
paid → cancelled        (acción admin: reembolso emitido)
processing → shipped    (acción admin: código de seguimiento asignado)
shipped → delivered     (acción admin o webhook transportista)
delivered → returned    (post-MVP: flujo diritto di recesso)
```

- Estados terminales (`delivered`, `cancelled`) son irreversibles
- Webhook duplicado para orden ya pagada = no-op (idempotente)
- Cancelación después de pago requiere nota di credito vía Invoicetronic
- Forzado via tabla PostgreSQL `order_transitions` (no IF statements hardcodeados)

## Decisión Guest Checkout

**Opción A — Forzar Creación de Cuenta** (elegida para segmento luxury)
- Razón: Confianza, trazabilidad, historial de pedidos, entrega de facturas
- Implementación: Carrito guest vía Zustand+localStorage; checkout requiere Supabase Auth (magic link o password)
- FK `customers.id` → `auth.users` mantenida; RLS funciona correctamente
- Post-compra: email con magic link para activación de cuenta en un click

## Estrategia de Recuperación de Errores Webhook

- Tabla `webhook_log`: almacena cada webhook antes de procesar
- En fallo: marcar `failed`, reintentar 3x con backoff exponencial
- Después de 3 fallos: estado `dead`, alerta admin vía Resend
- Cron Supabase Edge Function cada 5min procesa dead letters
- Condición de carrera: webhooks para órdenes inexistentes se reintentan después de 5s

## Contrato de Consistencia IVA

- `lib/iva.ts` es la **fuente única de verdad** para cálculos de IVA
- Server Components importan directamente; Client Components importan la misma función
- Zod valida que totales del carrito coincidan con `ivaBreakdown(subtotal)` en hidratación

## Estrategia de Imágenes de Producto

- Convertir PNGs existentes a WebP: productos <200KB, heroes <500KB
- Originales en `public/images/originals/`, convertidos en `public/images/`
- Conversión via `sharp` CLI o script de build
- `next/image` sizing: PLP card `sizes="(max-width: 768px) 100vw, 33vw"`, PDP gallery `sizes="(max-width: 768px) 100vw, 50vw"`
- Vercel Image Optimization como entrega principal

## Operaciones Admin

Operaciones admin (actualización de estado de órdenes, procesamiento de reembolsos, gestión de facturas, ingreso de códigos de seguimiento) se realizan via **Supabase dashboard** hasta que se construya una interfaz admin post-MVP. Limitación conocida con ruta de migración.

---

## Arquitectura & Stack Tecnológico

| Capa | Tecnología | Versión | Notas Críticas |
|:---|:---|:---|:---|
| Framework | Next.js 15 (App Router) | 15.x | PPR activado, ISR 5min para PLP, React 19, Turbopack default |
| UI/Styling | Tailwind CSS v4 + React 19 | v4 | Server Components por defecto, `use client` solo donde sea estrictamente necesario |
| Estado Carrito | Zustand + `persist` middleware | 5.x | localStorage (guest) + sync Supabase (auth). Validación Zod en hidratación. `skipHydration` para evitar mismatch SSR |
| Backend/DB | Supabase | Latest | PostgreSQL, Auth, Storage, Realtime, RLS obligatorio, región `eu-central-1` |
| Pagos IT | Nexi XPay Pro | REST API | Firma MAC SHA256, liquidación T+1, webhooks verificados |
| Pagos INTL | PayPal Business | JS SDK v3 | `@paypal/react-paypal-js`, Pay in 3 activado |
| BNPL | Klarna | Vía Nexi | Solo visible si total ≥ €1.500 (evaluado en render time) |
| Facturación SDI | Invoicetronic | REST API | XML FatturaPA, envío asíncrono a SDI, conservación 10 años |
| Email | Resend + React Email | Latest | Plantillas transactional, dominio verificado, DKIM/SPF |
| Analytics | Umami Self-Hosted | v2 | Desplegado en Supabase Edge Function, sin cookies, GDPR native |
| CMP/Legal | Iubenda | Latest | Consent Mode v2, reject-all 1-click, no dark patterns |
| Hosting | Vercel | Hobby → Pro | Edge Network, Image Optimization, automatic PPR |

---

## Estructura de Proyecto

```
src/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                  # Home (SSG)
│   │   ├── prodotti/
│   │   │   ├── page.tsx              # PLP (ISR 5min)
│   │   │   └── [slug]/page.tsx       # PDP (PPR + streaming stock/cart)
│   │   ├── carrello/page.tsx         # Carrito completo (CSR)
│   │   └── checkout/
│   │       ├── page.tsx              # Checkout multi-step (CSR, requiere auth)
│   │       └── conferma/page.tsx     # Confirmación + polling estado
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── nexi/route.ts         # Verifica MAC, actualiza order.status, webhook_log
│   │   │   ├── paypal/route.ts       # Verifica signature, idempotency, webhook_log
│   │   │   └── invoicetronic/route.ts# Recibe estado SDI, webhook_log
│   │   ├── payments/
│   │   │   └── create-session/route.ts# Genera sesión Nexi/PayPal + rate limiting
│   │   ├── orders/
│   │   │   └── [id]/status/route.ts  # Polling endpoint para página confirmación
│   │   └── fatturazione/route.ts     # Dispara envío XML a SDI
│   ├── layout.tsx                    # Root layout (fonts, metadata, CMP)
│   ├── globals.css                   # Tailwind v4 + tokens luxury
│   ├── error.tsx                     # Root error boundary
│   ├── sitemap.ts                    # Dinámico (productos + legales)
│   └── robots.ts                     # Allow + sitemap reference
├── components/
│   ├── ui/                           # Button, Input, Select, Modal, Toast, Breadcrumb, Accordion
│   ├── cart/                         # CartItem, CartSummary, AddToCartButton, CartEmpty
│   ├── checkout/                     # CheckoutStepper, ShippingStep, BillingStep, PaymentStep, OrderReview
│   ├── product/                      # ProductGallery, ProductInfo, Accordion, JSONLD, RecommendationCarousel
│   └── legal/                        # CookieBanner, PrivacyLinks, RecessoModule
├── lib/
│   ├── supabase/                     # client.ts, server.ts, middleware.ts (cookies)
│   ├── nexi.ts                       # MAC signature, session creation, webhook verification
│   ├── paypal.ts                     # SDK init, order creation, capture
│   ├── invoicetronic.ts              # XML builder, API client, SDI status mapper
│   ├── resend.ts                     # Templates: order_confirm, invoice, shipping
│   ├── iva.ts                        # Fuente única de verdad: formatCurrency, ivaBreakdown, slugify
│   └── validation.ts                 # CF, P.IVA, CAP, email, phone, address
├── store/
│   └── cart.ts                       # Zustand + persist + Zod + skipHydration
├── types/
│   ├── product.ts
│   ├── order.ts
│   └── customer.ts
├── data/
│   └── products.ts                   # Seed data (Supabase es fuente de verdad en runtime)
└── emails/
    ├── order-confirmation.tsx        # Stub en Phase 1, completo en Phase 8
    ├── invoice-delivery.tsx
    └── shipping-update.tsx
```

---

## Modelo de Datos (Supabase PostgreSQL)

### Tablas Principales

```sql
-- products
id uuid PK, slug text UNIQUE, name text, description text,
price_eur numeric, iva_rate numeric DEFAULT 0.22,
stock_status text CHECK (stock_status IN ('disponibile','su_ordinazione','esaurito')),
images jsonb, materials text, dimensions text, weight_kg numeric, created_at timestamptz

-- customers (1:1 con auth.users)
id uuid PK REFERENCES auth.users(id), email text, phone text,
cf text, piva text, sdi_code text,
billing_address jsonb, shipping_address jsonb, created_at timestamptz

-- orders
id uuid PK, customer_id uuid REFERENCES customers(id),
status text CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
subtotal numeric, iva_amount numeric, total numeric,
shipping_method text, tracking_code text,
payment_method text, payment_status text, created_at timestamptz

-- order_items
id uuid PK, order_id uuid REFERENCES orders(id), product_id uuid REFERENCES products(id),
quantity int, unit_price numeric, total_price numeric

-- invoices
id uuid PK, order_id uuid REFERENCES orders(id),
sdi_status text, xml_url text, invoice_number text, created_at timestamptz

-- order_transitions (tabla lookup para máquina de estados)
from_status text, to_status text, allowed boolean, trigger text

-- webhook_log
id uuid PK, provider text, event_type text, payload jsonb,
signature text, status text CHECK (status IN ('received','processing','processed','failed','dead')),
error_message text, order_id uuid, created_at timestamptz
```

### RLS Policies (Obligatorio)

```sql
-- Clients solo ven sus propios datos
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can view own items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
);
CREATE POLICY "Users can update own profile" ON customers FOR UPDATE USING (auth.uid() = id);

-- Admin/Service role bypass
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON products FOR ALL USING (auth.role() = 'service_role');
-- (Repetir para orders, order_items, invoices, customers, webhook_log)
```

### Estrategia de Migración

Migraciones en `supabase/migrations/`, aplicadas via `supabase db push`

---

## Integraciones Críticas & Flujos

### Nexi XPay Pro

- **Creación sesión:** `POST /api/payments/create-session` → genera `paymentId`, `mac`, redirige a Nexi Hosted Page. **Rate limiting activo.**
- **Webhook:** `POST /api/webhooks/nexi` → verifica firma MAC SHA256, actualiza `orders.payment_status = 'paid'`, dispara facturación. **Webhook_log entry.**
- **Idempotencia:** Guardar `paymentId` en `orders`, rechazar duplicados
- **Polling confirmación:** `GET /api/orders/{id}/status` — Poll cada 2s por 30s después de redirect Nexi
- **Nota:** Nunca almacenar datos de tarjeta. PCI DSS delegado a Nexi.

### Invoicetronic (SDI)

- **Trigger:** Tras `payment_status = 'paid'`
- **Flujo:**
  1. Generar XML FatturaPA (B2B o B2C con `codice_destinatario = "0000000"`)
  2. `POST https://api.invoicetronic.com/v1/invoices` → recibe `invoice_id`
  3. Webhook SDI → actualiza `invoices.sdi_status` (`ACCETTAZIONE`, `RIFIUTO`, `SCARTO`)
  4. Si `ACCETTAZIONE` → enviar PDF al cliente vía Resend
  5. Si `RIFIUTO`/`SCARTO` → log, alertar admin, marcar `failed`
- **Conservación:** Almacenar XML + PDF en Supabase Storage (`/invoices/{order_id}/`)

### Resend + React Email

- Plantillas: `order-confirmation`, `invoice-delivery`, `shipping-update`, `cart-recovery`
- Dominio verificado + DKIM/SPF configurado
- Rate limit: 3K/mes (Free tier suficiente para inicio)

### Umami Self-Hosted

- Desplegado en Supabase Edge Function o Vercel
- Script inyectado en `layout.tsx` con `defer`
- Sin cookies, sin consentimiento previo requerido
- Eventos custom: `add_to_cart`, `begin_checkout`, `purchase`, `view_item`

### Patrón de Manejo de Webhooks

```
1. Log a webhook_log (estado: 'received')
2. Verificar firma → fallo = log, return 401
3. Verificar idempotencia (ya en estado destino?) → sí = 200 (no-op)
4. Validar transición de estado → inválida = log, return 400
5. Actualizar orden + log (estado: 'processed')
6. En error DB: 'failed', reintentar 3x, alertar después de 3 fallos
```

---

## Fases de Implementación (12 fases, ~114h)

### Fase 1: Setup & Infra (8h) — Complejidad: S

**Archivos:**
- `package.json` — Next.js 15, Tailwind v4, Zustand 5, Supabase, Zod
- `next.config.ts` — **Headers de seguridad** (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- `tsconfig.json` — strict mode, path aliases
- `src/app/layout.tsx` — Root layout con fonts, metadata, placeholder CMP
- `src/app/globals.css` — Config Tailwind v4 + tokens luxury
- `src/lib/supabase/client.ts` — Browser client (`@supabase/ssr`)
- `src/lib/supabase/server.ts` — Server client con manejo de cookies
- `src/lib/supabase/middleware.ts` — Auth middleware
- `src/emails/order-confirmation.tsx` — Stub con placeholder `{orderId}`
- `src/emails/invoice-delivery.tsx` — Stub con placeholder `{invoiceId}`
- `.env.example` / `.env.local`

**Criterios de Aceptación:**
- [ ] `next build` completa sin errores
- [ ] Supabase client conecta desde server y client components
- [ ] Auth middleware redirige usuarios no autenticados de rutas protegidas
- [ ] Headers de seguridad presentes en respuesta (verificar via `curl -I`)
- [ ] `.env.example` coincide con variables requeridas
- [ ] Imágenes de producto convertidas a WebP, <200KB cada una

---

### Fase 2: Data Layer (6h) — Complejidad: S

**Archivos:**
- `supabase/migrations/001_initial_schema.sql` — Todas las 5 tablas + `webhook_log` + `order_transitions`
- `supabase/migrations/002_rls_policies.sql` — RLS para todas las tablas
- `supabase/seed.sql` — Catálogo inicial (3 productos)
- `src/types/product.ts`, `src/types/order.ts`, `src/types/customer.ts`
- `src/data/products.ts` — Datos seed; **Supabase es fuente de verdad en runtime**

**Criterios de Aceptación:**
- [ ] Todas las tablas creadas con constraints correctos
- [ ] Máquina de estados rechaza transiciones inválidas (test: `paid → pending` lanza error)
- [ ] RLS bloquea acceso no autorizado (test: usuario anónimo no puede leer órdenes)
- [ ] Datos seed cargan correctamente
- [ ] Tipos TypeScript coinciden con schema DB
- [ ] Tablas `webhook_log` y `order_transitions` existen

---

### Fase 2.5: Compliance Spike (4h) — Complejidad: M

**Propósito:** Validar componentes de mayor riesgo antes de trabajo UI.

**Entregables:**
1. **XML FatturaPA** — Generar muestra desde datos seed, validar contra XSD SDI
2. **Nexi MAC** — Implementar calculadora, verificar contra vectores de prueba
3. **Tests RLS** — 3 escenarios: anónimo bloqueado, propios datos visibles, service role acceso total
4. **Guest Checkout** — Documentar decisión (forzar creación de cuenta)

**Criterios de Aceptación:**
- [ ] XML FatturaPA valida contra XSD SDI (cero errores)
- [ ] Firma MAC Nexi coincide con vectores de prueba
- [ ] Tests RLS pasan para los 3 escenarios
- [ ] Decisión guest checkout documentada

---

### Fase 3: Design System (8h) — Complejidad: M

**Archivos:**
- `src/components/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, `Modal.tsx`, `Toast.tsx`, `Breadcrumb.tsx`, `Accordion.tsx`
- `src/app/globals.css` — Tipografía luxury extendida, escala de espaciado
- `src/app/error.tsx` — Root error boundary

**Criterios de Aceptación:**
- [ ] Todos los componentes renderizan en 320px, 768px, 1024px, 1440px
- [ ] Touch target mínimo de 44px en elementos interactivos
- [ ] Estética luxury: títulos serif, whitespace generoso, acentos dorados
- [ ] Error boundary muestra fallback elegante, no pantalla blanca

---

### Fase 4: PLP & PDP (16h) — Complejidad: L

**Archivos:**
- `src/app/(shop)/page.tsx` — Home SSG con hero, productos destacados
- `src/app/(shop)/prodotti/page.tsx` — PLP con **ISR revalidate: 300** (5min)
- `src/app/(shop)/prodotti/[slug]/page.tsx` — PDP con PPR + Suspense
- `src/app/(shop)/error.tsx` — Error boundary del shop
- `src/components/product/ProductCard.tsx`, `ProductGallery.tsx`, `ProductInfo.tsx`, `ProductAccordion.tsx`, `ProductJSONLD.tsx`
- `src/lib/iva.ts` — Fuente única de verdad: `formatCurrency()`, `ivaBreakdown()`, `slugify()`

**Suspense Boundaries para PPR:**
- Shell estático: Nombre, descripción, imágenes, materiales
- Stream dinámico (Suspense): Estado de stock, botón Add to Cart, precio

**Criterios de Aceptación:**
- [ ] PLP carga con ISR 5min, muestra todos los productos
- [ ] PDP transmite estado de stock via Suspense
- [ ] JSON-LD valida en Google Rich Results Test
- [ ] IVA 22% mostrado correctamente: `€4.500,00 (IVA inclusa €810,00)`
- [ ] Imágenes optimizadas, LCP <1.5s

---

### Fase 5: Carrito (10h) — Complejidad: M

**Archivos:**
- `src/store/cart.ts` — Zustand + persist + Zod + `skipHydration` para prevenir mismatch SSR
- `src/app/(shop)/carrello/page.tsx` — Página completa de carrito (CSR)
- `src/components/cart/CartItem.tsx`, `CartSummary.tsx`, `AddToCartButton.tsx`, `CartEmpty.tsx`

**Criterios de Aceptación:**
- [ ] Carrito persiste en localStorage (guest)
- [ ] Carrito sincroniza a Supabase cuando autenticado
- [ ] Desglose IVA correcto en todas las cantidades (validado contra `lib/iva.ts`)
- [ ] Zod valida estado del carrito en hidratación

---

### Fase 6: Checkout (16h) — Complejidad: L

**Archivos:**
- `src/app/(shop)/checkout/page.tsx` — Multi-step (CSR), **requiere auth**
- `src/components/checkout/CheckoutStepper.tsx`, `ShippingStep.tsx`, `BillingStep.tsx`, `PaymentStep.tsx`, `OrderReview.tsx`
- `src/lib/validation.ts` — CF (Luhn 16 chars), P.IVA (IT+11), CAP (5 dígitos), teléfono, email

**Phase Gate (antes de Fase 7):**
- Formulario multi-step completa sin errores
- Desglose IVA correcto para B2B y B2C
- Validación CF/P.IVA bloquea input inválido
- Modelo de datos puede representar todos los estados de pago

**Criterios de Aceptación:**
- [ ] Validación CF bloquea códigos inválidos
- [ ] P.IVA valida formato IT+11
- [ ] CAP restringido a códigos postales italianos de 5 dígitos
- [ ] Checkout en tema claro
- [ ] Usable en 320px
- [ ] Auth requerida: no autenticados redirigidos a signup

---

### Fase 7: Pagos (12h) — Complejidad: L

**Archivos:**
- `src/lib/nexi.ts` — Firma MAC (SHA256), creación de sesión, verificación webhook
- `src/lib/paypal.ts` — Init SDK, creación de orden, capture
- `src/app/api/payments/create-session/route.ts` — **con rate limiting**
- `src/app/api/orders/[id]/status/route.ts` — Endpoint de polling para página de confirmación
- `src/app/api/webhooks/nexi/route.ts` — Verificación MAC, actualización orden, webhook_log
- `src/app/api/webhooks/paypal/route.ts` — Verificación firma, idempotencia, webhook_log
- `src/components/checkout/PayPalButton.tsx`, `KlarnaToggle.tsx`

**Polling Página Confirmación:** Poll `/api/orders/{id}/status` cada 2s por 30s después de redirect Nexi

**Criterios de Aceptación:**
- [ ] MAC Nexi verificado correctamente
- [ ] Flujo sandbox PayPal completa
- [ ] Klarna visible solo si total >= €1,500
- [ ] Pago duplicado rechazado
- [ ] Webhook logueado en cada request
- [ ] Webhook fallido dispara reintento + alerta
- [ ] Rate limiting activo en endpoint de sesión de pago

---

### Fase 8: Post-Purchase (10h) — Complejidad: M

**Archivos:**
- `src/lib/invoicetronic.ts` — Builder XML FatturaPA, cliente API, mapeador estado SDI
- `src/lib/resend.ts` — Plantillas de email
- `src/emails/order-confirmation.tsx` — Plantilla completa (reemplaza stub)
- `src/emails/invoice-delivery.tsx`, `shipping-update.tsx`
- `src/app/api/fatturazione/route.ts` — Disparador envío SDI
- `src/app/api/webhooks/invoicetronic/route.ts` — Actualización estado SDI, webhook_log
- `src/app/(shop)/checkout/conferma/page.tsx` — Confirmación de orden + polling estado

**Manejo Rechazo SDI:**
- En `RIFIUTO`/`SCARTO`: log, alertar admin, marcar factura `failed`
- Admin corrige via Supabase dashboard, reenvía
- Nota de crédito para cancelaciones después de pago

**Criterios de Aceptación:**
- [ ] XML FatturaPA valida (verificado en Fase 2.5)
- [ ] B2C usa `codice_destinatario = "0000000"`
- [ ] Webhook SDI actualiza estado correctamente
- [ ] PDF enviado solo después de `ACCETTAZIONE`
- [ ] XML + PDF almacenados en Supabase Storage
- [ ] Rechazo SDI dispara alerta admin

---

### Fase 9: AI Features (4h) — Complejidad: M

**Archivos:**
- `src/app/api/ai/recommendations/route.ts` — Recomendaciones básicas
- `src/app/api/ai/chat/route.ts` — Endpoint chatbot RAG
- `src/components/product/RecommendationCarousel.tsx`
- `src/components/chat/ChatWidget.tsx` — Lazy-loaded

**Criterios de Aceptación:**
- [ ] Recomendaciones basadas en categoría/material
- [ ] Chatbot responde preguntas de producto
- [ ] Chatbot lazy-load (no en bundle inicial)

---

### Fase 10: SEO & Legal (4h) — Complejidad: S

**Archivos:**
- `src/app/sitemap.ts` — Dinámico (productos + legales)
- `src/app/robots.ts` — Allow + referencia sitemap
- `src/components/legal/CookieBanner.tsx` — CMP Iubenda
- `src/components/legal/PrivacyLinks.tsx`, `RecessoModule.tsx`
- `src/app/recesso/modulo/page.tsx` — Accesible sin auth

**Criterios de Aceptación:**
- [ ] Sitemap incluye todas las páginas de producto
- [ ] CMP Iubenda bloquea scripts hasta consentimiento
- [ ] Reject-all en 1 click
- [ ] `/recesso/modulo` accesible sin auth

---

### Fase 11: Testing E2E (12h) — Complejidad: M

**Archivos:**
- `playwright.config.ts`
- `tests/e2e/new-customer-flow.spec.ts` — Signup → PDP → Cart → Checkout → Nexi → Email → Invoice
- `tests/e2e/authenticated-flow.spec.ts` — Login → Cart → Checkout → PayPal → Order history
- `tests/e2e/italian-compliance.spec.ts` — Validación CF/P.IVA, IVA B2B/B2C
- `tests/e2e/webhook-idempotency.spec.ts` — Rechazo duplicados, MAC inválido
- `tests/e2e/edge-cases.spec.ts` — RLS null auth, cart qty > stock, Klarna threshold
- `tests/performance/lighthouse.spec.ts` — LCP <1.5s, Lighthouse >90

**Cobertura de Tests:**
- Happy path: signup nuevo cliente → checkout → test Nexi → email → FatturaPA sandbox SDI
- Happy path: cliente autenticado → pago PayPal
- Edge cases: IVA B2B/B2C, visibilidad Klarna, rechazo SDI, webhooks duplicados
- Regresión: Lighthouse >=90, checkout mobile 320px

**Criterios de Aceptación:**
- [ ] Todos los tests E2E pasan en sandbox
- [ ] Lighthouse: Performance >=90, SEO >=95, Accessibility >=90
- [ ] Rich Results Test pasa para JSON-LD PDP

---

## Resumen de Horas

| Fase | Horas | Complejidad |
|:---|:---|:---|
| 1. Setup & Infra | 8h | S |
| 2. Data Layer | 6h | S |
| 2.5. Compliance Spike | 4h | M |
| 3. Design System | 8h | M |
| 4. PLP & PDP | 16h | L |
| 5. Carrito | 10h | M |
| 6. Checkout | 16h | L |
| 7. Pagos | 12h | L |
| 8. Post-Purchase | 10h | M |
| 9. AI Features | 4h | M |
| 10. SEO & Legal | 4h | S |
| 11. Testing E2E | 12h | M |
| **TOTAL** | **114h** | |

> **MVP sin AI + E2E:** 98h (eliminar fases 9 y 11)

---

## Mitigación de Riesgos

| Riesgo | Impacto | Mitigación |
|:---|:---|:---|
| Sandbox Nexi no disponible | Bloquea Fase 7 | Construir con respuestas mock primero |
| Complejidad XML FatturaPA | Retrasa Fase 8 | Spike Fase 2.5 valida contra XSD SDI |
| RLS Supabase mal configurado | Agujero de seguridad | Spike Fase 2.5 prueba todos los escenarios |
| Condición de carrera webhook | Cliente ve estado incorrecto | Endpoint de polling en página de confirmación |
| Payload de imagen muy grande | LCP >1.5s | Conversión WebP en Fase 1 |
| Rechazo SDI después de horas | Retrabajo manual | Recuperación de errores webhook + alerta admin |

---

## Checklist Pre-Lanzamiento

- [ ] `next build` compila sin warnings TS/ESLint
- [ ] Flujo completo nuevo cliente: Signup → PDP → Carrello → Checkout → Nexi test → Email → Factura SDI sandbox
- [ ] Flujo completo auth: Sync Supabase, historial pedidos, RLS verificado
- [ ] IVA 22% desglosada correctamente en todas las vistas
- [ ] Validación CF (16 chars) y P.IVA (IT+11) activa y bloqueante
- [ ] Link `/recesso/modulo` funcional
- [ ] JSON-LD válido en PDP (Google Rich Results Test)
- [ ] Umami trackea sin cookies ni consentimiento previo
- [ ] Lighthouse: Performance >=90, SEO >=95, Accessibility >=90
- [ ] Webhooks Nexi/PayPal/Invoicetronic verificados con firmas
- [ ] Mobile-first: Checkout usable en 320px, botones >=44px
- [ ] Headers de seguridad configurados en `next.config.js`

---

## Variables de Entorno (`.env.example`)

```env
# Next.js
NEXT_PUBLIC_SITE_URL=https://www.mpvitalia.it
NEXT_PUBLIC_UMAMI_SCRIPT_URL=/umami/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Nexi XPay
NEXI_MERCHANT_ID=your_merchant_id
NEXI_API_KEY=your_api_key
NEXI_MAC_SECRET=your_mac_secret
NEXI_ENV=sandbox

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_ENV=sandbox

# Invoicetronic
INVOICETRONIC_API_KEY=your_key
INVOICETRONIC_ENV=sandbox

# Resend
RESEND_API_KEY=re_...
RESEND_FROM=noreply@mpvitalia.it

# Iubenda (CMP)
NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID=your_id
NEXT_PUBLIC_IUBENDA_SITE_ID=your_site_id
```

---

## Notas Críticas para el Equipo de Desarrollo

1. **Next.js 15 Caching:** `fetch` es `force-cache` por defecto. Usar `cache: 'no-store'` o `revalidate` explícito para datos de stock/precio. PPR activado: envolver componentes dinámicos en `Suspense`.
2. **Server vs Client:** 80% Server Components. `use client` solo para: carrito, checkout, formularios interactivos, SDKs de pago.
3. **Supabase SSR:** Usar `@supabase/ssr` para cookies. Nunca exponer `service_role` en el cliente. RLS obligatorio.
4. **Nexi MAC:** La firma se calcula sobre parámetros ordenados alfabéticamente + `MAC_SECRET`. Usar `crypto.createHmac('sha256', secret).update(string).digest('hex')`. Verificar siempre en webhook.
5. **Invoicetronic SDI:** La respuesta del SDI es asíncrona (minutos/horas). No bloquear el flujo de compra. Notificar al cliente solo tras `ACCETTAZIONE`.
6. **Luxury UX:** Checkout siempre en tema claro. Carrito como página completa, no drawer. Tipografía serif/elegante, espaciado generoso, cero clutter.
7. **Performance:** `next/image` con `priority` solo en hero/PDP gallery. Fuentes con `next/font`. Lazy load accordions y chatbot. Objetivo: LCP <1.5s, INP <200ms.
8. **Zustand Hydration:** Usar patrón `skipHydration` + `useEffect` para prevenir mismatch de hidratación SSR.

---

*Este documento fue validado mediante flujo de consenso Planner → Architect → Critic (2 iteraciones). El Architect aprobó con 6 enmiendas menores (todas incorporadas). El Critic aprobó en iteración 2.*

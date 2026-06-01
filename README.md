# ✦ MPV Italia — Luxury Pet Furniture E-Commerce ✦

[![Next.js](https://img.shields.io/badge/Next.js-15.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Italian Compliance](https://img.shields.io/badge/Italian_Compliance-SDI%20%2F%20FatturaPA-C9A96E?style=for-the-badge)](https://invoicetronic.com)

E-commerce Greenfield de alta gama para **MPV Italia**, una marca de lujo dedicada al mobiliario artesanal para mascotas (sofás en el segmento de €3.8k–4.5k) diseñado con la elegancia de la *Riviera Italiana*. 

Este sistema ha sido diseñado desde cero bajo estándares de ultra-lujo y cumplimiento legal absoluto con las normativas fiscales italianas (Facturación Electrónica SDI, IVA del 22%, validación estricta de Codice Fiscale/Partita IVA y GDPR).

---

## 🎨 Principios de Diseño & Identidad Visual (Luxury UX)

La estética visual del e-commerce fusiona la sofisticación editorial italiana clásica con la precisión digital moderna:

- **Paleta de Colores:** 
  - `Oro Premium (#C9A96E)` como único color de acento para elementos interactivos, llamadas a la acción (CTAs) y detalles decorativos.
  - `Charcoal (#1A1A1A)` como superficie oscura principal y color de tipografías contrastadas. Evita negros puros para mantener la calidez.
  - `Mármol Crema (#FAF8F5)` como fondo base limpio y cálido para simular un atelier de alta costura.
- **Tipografía Exclusiva:**
  - `Cormorant Garamond (Serif):` Reservada para titulares, citas editoriales y momentos emotivos de la marca.
  - `Montserrat (Sans-Serif):` Utilizada para la interfaz de compra, textos de descripción de producto, navegación, etiquetas y botones interactivos (tamaños optimizados para legibilidad y targets táctiles de mínimo 44px).
- **Detalles de Lujo:**
  - **Efecto de grano (Grain Overlay):** Ruido SVG sutil (2.5% de opacidad) inyectado globalmente para prevenir texturas planas y dar sensación de papel premium.
  - **Brillo Dorado (Sweep shimmer):** CTAs principales dotados de un barrido de luz metálica al pasar el cursor.
  - **Varianza cinemática:** Galerías de productos con transiciones suaves estilo Ken Burns.

---

## 🛠️ Stack Tecnológico & Infraestructura

El proyecto aprovecha las tecnologías más avanzadas del ecosistema de React y la web moderna para ofrecer velocidades de carga instantáneas (LCP < 1.5s):

| Capa | Tecnología | Propósito y Notas Críticas |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15.2 (App Router)** | Renderizado híbrido con soporte para PPR (Partial Prerendering) y streaming. |
| **Estilos** | **Tailwind CSS v4** | Configuración mediante tokens nativos en `globals.css` para rendimiento óptimo. |
| **Base de Datos** | **Supabase (PostgreSQL)** | Almacenamiento relacional de catálogo, logs de webhooks y datos de clientes con **RLS (Row Level Security)** obligatorio. |
| **Autenticación** | **Supabase Auth** | Flujo seguro de login con Magic Links. Requerido para Checkout. |
| **Estado Local** | **Zustand 5** | Gestión del carrito con persistencia local y sincronización asíncrona tras el inicio de sesión. |
| **Pasarelas de Pago** | **Nexi XPay Pro** + **PayPal** | Nexi (Tarjetas italianas) con firma digital MAC SHA256 y PayPal (Internacional) con soporte para pago en 3 plazos (Klarna activo a partir de €1.500). |
| **Facturación SDI** | **Invoicetronic** | Generador de XML FatturaPA y envío automático asíncrono al Sistema de Intercambio gubernamental italiano. |
| **Correos** | **Resend** + **React Email** | Plantillas transaccionales dinámicas en HTML para confirmaciones de órdenes, facturas y envíos. |

---

## 🇮🇹 Cumplimiento del Mercado Italiano (Compliance First)

El e-commerce está preparado desde su núcleo para operar legalmente en el mercado italiano:

1. **Desglose de IVA (22%):** Fuente de cálculo centralizada e inmutable en `src/lib/iva.ts`. El precio se muestra siempre con IVA incluido, desglosando la cuantía de manera transparente en el carrito y durante el checkout (`€4.500,00 (IVA inclusa €810,00)`).
2. **Validación CF / P.IVA:** Implementada en `src/lib/validation.ts`. Bloquea códigos fiscales que no cumplan el algoritmo de Luhn (16 caracteres) o Partite IVA que no sigan el formato oficial italiano (IT + 11 dígitos).
3. **Flujo Asíncrono de Factura Electrónica:** Al confirmarse un pago, se genera el XML estructurado del SDI. B2C utiliza el `codice_destinatario = "0000000"` y B2B requiere el canal SDI correspondiente. El PDF y el XML oficial de la factura se almacenan de forma segura en Supabase Storage tras la aceptación del SDI.
4. **GDPR / Privacidad:** Consentimiento sin fricciones usando Iubenda con Consent Mode v2 y rechazo en un solo clic, sin patrones oscuros. Umami Analytics integrado sin el uso de cookies persistentes.
5. **Diritto di Recesso:** Módulo legal oficial accesible sin autenticación en `/recesso/modulo` que permite al comprador iniciar el desistimiento formal en 14 días.

---

## 📁 Arquitectura del Proyecto

El código está estructurado siguiendo los mejores patrones de Next.js y TypeScript:

```
├── .gemini/            # Configuración de asistentes
├── public/             # Archivos estáticos y WebP convertidos
├── src/
│   ├── __tests__/      # Suite de pruebas unitarias y de integración (Vitest)
│   ├── app/            # Next.js App Router (Páginas, Layouts y Endpoints de API)
│   │   ├── [locale]/   # Rutas internacionalizadas (it, en, es)
│   │   │   └── (shop)/ # Rutas del flujo de la tienda (PLP, PDP, Checkout, Recesso)
│   │   └── api/        # Endpoints (Payments, Webhooks, AI, Fatturazione)
│   ├── components/     # Componentes de UI modulares y reactivos
│   │   ├── cart/       # Estado del Carrito y resumen
│   │   ├── checkout/   # Pasos interactivos del pago multi-step
│   │   ├── legal/      # Módulos legales, CMP y Diritto di Recesso
│   │   ├── product/    # Fichas de producto, JSON-LD estructurado y galerías
│   │   └── ui/         # Componentes base de alta fidelidad (Botones, Modales, Inputs)
│   ├── data/           # Catálogo de productos semilla (Semilla de Base de Datos)
│   ├── emails/         # Plantillas HTML responsivas de React Email
│   ├── i18n/           # Configuración de localización (Next-intl)
│   ├── lib/            # Librerías de utilidades e integraciones (Supabase, Nexi, Invoicetronic)
│   ├── store/          # Zustand Store persistente con validación Zod
│   └── types/          # Declaraciones de tipos para TypeScript (Product, Order, Customer)
```

---

## 🚀 Inicio Rápido para Desarrolladores

### 1. Requisitos Previos
Asegúrate de tener instalado Node.js (v18+), npm o pnpm, y una instancia activa de Supabase.

### 2. Configuración de Variables de Entorno
Copia el archivo de ejemplo y rellena tus claves de desarrollo:
```bash
cp .env.example .env.local
```

### 3. Instalación de Dependencias
```bash
npm install
```

### 4. Servidor de Desarrollo
Inicia el entorno de desarrollo local con recarga en tiempo real:
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

### 5. Compilación y Validación de Producción
Para verificar la integridad del código, TypeScript, ESLint y generar el bundle optimizado:
```bash
npm run build
```

### 6. Ejecución de Pruebas Unitarias
El proyecto utiliza Vitest para validar los componentes del carrito, selectores de idioma y el Header:
```bash
npm run test
```

---

## 📈 Fases de Implementación del Proyecto

El desarrollo está organizado en 12 fases detalladas y medibles (según `PLAN_MPV_E-COMMERCE.md`):

- **Fase 1:** Setup de Infraestructura, Headers de seguridad (CSP) y tipografía de lujo. *(Completado)*
- **Fase 2:** Modelo de Datos en Supabase (Schema PostgreSQL, RLS y Seed). *(Completado)*
- **Fase 2.5:** Spike de Cumplimiento Técnico (Vectores de Firma MAC Nexi, XML FatturaPA y pruebas RLS). *(Completado)*
- **Fase 3:** Sistema de Diseño Luxury (Componentes interactivos premium y Error Boundary). *(Completado)*
- **Fase 4:** Páginas de Catálogo (PLP con ISR de 5min, PDP con PPR y marcado estructurado JSON-LD). *(Completado)*
- **Fase 5:** Gestión del Carrito (Zustand con persistencia local hidratada con Zod). *(Completado)*
- **Fase 6:** Formulario de Checkout Multi-step (Validaciones italianas de CF/P.IVA, CAP de 5 dígitos y modo claro). *(Completado)*
- **Fase 7:** Integración de Pagos (Creación de sesión rate-limited, webhook Nexi MAC SHA256 y PayPal). *(Completado)*
- **Fase 8:** Post-Venta y Facturación SDI (Integración con Invoicetronic, Webhooks asíncronos y PDFs por correo). *(Completado)*
- **Fase 9:** Características de Inteligencia Artificial (Chatbot de asesoría y carrusel inteligente). *(Completado)*
- **Fase 10:** SEO & Cumplimiento Legal (Iubenda CMP Consent Mode v2 y módulo de desistimiento). *(Completado)*
- **Fase 11:** Pruebas de Calidad E2E (Cobertura crítica de flujos con Playwright y auditorías Lighthouse >= 90). *(Pendiente)*

---

*Handcrafted with absolute passion for luxury and pixel-perfection. MPV Italia SRL. All rights reserved © 2026.*

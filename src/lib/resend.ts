import { Resend } from "resend";
import { routing } from "@/i18n/routing";
import itMessages from "../../messages/it.json";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";

// Load email translations from statically imported JSON files
const messagesByLocale: Record<string, { emails: Record<string, Record<string, string>> }> = {
  it: itMessages as unknown as { emails: Record<string, Record<string, string>> },
  en: enMessages as unknown as { emails: Record<string, Record<string, string>> },
  es: esMessages as unknown as { emails: Record<string, Record<string, string>> },
};

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = process.env.RESEND_FROM || "noreply@mpvitalia.it";

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Resend send error:", error);
    throw error;
  }
}

/**
 * Load email translations for a given locale from the messages JSON files.
 */
function loadEmailTranslations(locale: string): Record<string, Record<string, string>> {
  const validLocale = routing.locales.includes(locale as typeof routing.locales[number]) ? locale : routing.defaultLocale;

  const messages = messagesByLocale[validLocale] || messagesByLocale[routing.defaultLocale];
  return messages.emails;
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  customerName: string,
  total: string,
  locale: string = routing.defaultLocale
) {
  const { OrderConfirmationEmail } = await import("@/emails");
  const t = loadEmailTranslations(locale).orderConfirmation;

  const subject = t.preview.replace("{orderId}", orderId);

  return sendEmail({
    to: email,
    subject,
    react: OrderConfirmationEmail({
      orderId,
      customerName,
      total,
      preview: t.preview.replace("{orderId}", orderId),
      heading: t.heading,
      greeting: t.greeting.replace("{name}", customerName),
      confirmed: t.confirmed.replace("{orderId}", orderId),
      totalLabel: t.total.replace("{total}", total),
      trackingNotice: t.trackingNotice,
      footer: t.footer,
    }),
  });
}

export async function sendInvoiceDelivery(
  email: string,
  orderId: string,
  invoiceNumber: string,
  customerName: string,
  downloadUrl: string,
  locale: string = routing.defaultLocale
) {
  const { InvoiceDeliveryEmail } = await import("@/emails");
  const t = loadEmailTranslations(locale).invoiceDelivery;

  const subject = t.preview.replace("{number}", invoiceNumber);

  return sendEmail({
    to: email,
    subject,
    react: InvoiceDeliveryEmail({
      orderId,
      invoiceNumber,
      customerName,
      downloadUrl,
      preview: t.preview.replace("{number}", invoiceNumber),
      heading: t.heading,
      greeting: t.greeting.replace("{name}", customerName),
      body: t.body
        .replace("{orderId}", orderId)
        .replace("{number}", invoiceNumber),
      downloadButton: t.downloadButton,
      note: t.note,
      footer: t.footer,
    }),
  });
}

export async function sendShippingUpdate(
  email: string,
  orderId: string,
  customerName: string,
  trackingCode: string,
  trackingUrl: string,
  estimatedDelivery: string,
  locale: string = routing.defaultLocale
) {
  const { ShippingUpdateEmail } = await import("@/emails");
  const t = loadEmailTranslations(locale).shippingUpdate;
  const year = new Date().getFullYear().toString();

  const contactEmail = "spedizioni@mpvitalia.it";
  const subject = t.preview.replace("{orderId}", orderId);

  return sendEmail({
    to: email,
    subject,
    react: ShippingUpdateEmail({
      orderId,
      customerName,
      trackingCode,
      trackingUrl,
      estimatedDelivery,
      preview: t.preview.replace("{orderId}", orderId),
      headerTitle: t.headerTitle,
      headerSubtitle: t.headerSubtitle,
      heading: t.heading,
      greeting: t.greeting.replace("{name}", customerName),
      body: t.body.replace("{orderId}", orderId),
      trackingTitle: t.trackingTitle,
      trackingCodeLabel: t.trackingCode.replace("{code}", trackingCode),
      estimatedDeliveryLabel: t.estimatedDelivery.replace("{date}", estimatedDelivery),
      trackButton: t.trackButton,
      contact: t.contact.replace("{email}", contactEmail),
      footer: t.footer.replace("{year}", year),
      footerSub: t.footerSub,
      contactEmail,
    }),
  });
}

export { resend };

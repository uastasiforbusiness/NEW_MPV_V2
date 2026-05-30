import { createHmac } from "crypto";

const NEXI_MERCHANT_ID = process.env.NEXI_MERCHANT_ID!;
const NEXI_API_KEY = process.env.NEXI_API_KEY!;
const NEXI_MAC_SECRET = process.env.NEXI_MAC_SECRET!;
const NEXI_ENV = process.env.NEXI_ENV || "sandbox";

const NEXI_BASE_URL =
  NEXI_ENV === "production"
    ? "https://xpay.nexigroup.com"
    : "https://sandbox.xpay.nexigroup.com";

interface NexiSessionParams {
  orderId: string;
  amount: number; // In euro cents (e.g., €42.00 = 4200)
  currency?: string;
  description?: string;
  customerEmail: string;
  customerName: string;
  language?: string;
  urlRedirect?: string;
  urlBack?: string;
  urlPost?: string;
}

interface NexiSessionResponse {
  paymentId: string;
  mac: string;
  redirectUrl: string;
}

export interface NexiWebhookPayload {
  paymentId: string;
  amount: string;
  currency: string;
  outcome: "OK" | "KO";
  timestamp: string;
  mac: string;
  [key: string]: string | undefined;
}

/**
 * Generate MAC SHA256 signature for Nexi XPay
 * The signature is calculated on parameters sorted alphabetically + MAC secret
 */
export function generateMac(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHmac("sha256", NEXI_MAC_SECRET)
    .update(signatureString)
    .digest("hex");
}

/**
 * Verify a Nexi webhook MAC signature
 */
export function verifyWebhookMac(payload: NexiWebhookPayload): boolean {
  const { mac, ...params } = payload;
  const calculatedMac = generateMac(params as Record<string, string>);
  return calculatedMac === mac;
}

/**
 * Create a Nexi XPay payment session
 */
export async function createPaymentSession(
  params: NexiSessionParams
): Promise<NexiSessionResponse> {
  const paymentParams: Record<string, string> = {
    apiKey: NEXI_API_KEY,
    amount: String(params.amount),
    currency: params.currency || "EUR",
    merchantId: NEXI_MERCHANT_ID,
    orderId: params.orderId,
    ...(params.description && { description: params.description }),
    ...(params.customerEmail && { customerEmail: params.customerEmail }),
    ...(params.customerName && { customerName: params.customerName }),
    ...(params.language && { language: params.language }),
    ...(params.urlRedirect && { urlRedirect: params.urlRedirect }),
    ...(params.urlBack && { urlBack: params.urlBack }),
    ...(params.urlPost && { urlPost: params.urlPost }),
  };

  const mac = generateMac(paymentParams);

  const response = await fetch(
    `${NEXI_BASE_URL}/api/v1/payments/${NEXI_MERCHANT_ID}/pay`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": NEXI_API_KEY,
      },
      body: JSON.stringify({
        ...paymentParams,
        mac,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Nexi session creation failed: ${error}`);
  }

  const data = await response.json();

  return {
    paymentId: data.paymentId,
    mac: data.mac,
    redirectUrl: `${NEXI_BASE_URL}/api/v1/payments/${NEXI_MERCHANT_ID}/pay/${data.paymentId}`,
  };
}

export { NEXI_BASE_URL, NEXI_MERCHANT_ID, NEXI_API_KEY };

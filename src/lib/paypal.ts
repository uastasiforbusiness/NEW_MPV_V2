const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";

const PAYPAL_BASE_URL =
  PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

interface PayPalOrderParams {
  orderId: string;
  amount: number;
  description?: string;
  customerEmail: string;
}

interface PayPalCaptureResponse {
  status: string;
  id: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { value: string; currency_code: string };
      }>;
    };
  }>;
}

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(params: PayPalOrderParams) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.orderId,
          description: params.description || `MPV Italia Ordine #${params.orderId}`,
          amount: {
            currency_code: "EUR",
            value: String(params.amount),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal order creation failed: ${error}`);
  }

  return response.json();
}

/**
 * Capture a PayPal order after approval
 */
export async function capturePayPalOrder(
  orderId: string
): Promise<PayPalCaptureResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal capture failed: ${error}`);
  }

  return response.json();
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(
  webhookId: string,
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  if (!response.ok) return false;

  const data = await response.json();
  return data.verification_status === "SUCCESS";
}

export { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID };

import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Creates a payment session (Nexi or PayPal)
 * Rate limited to prevent abuse
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova più tardi." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { method, orderId, amount, customerEmail, customerName } = body;

    if (!method || !orderId || !amount) {
      return NextResponse.json(
        { error: "Metodo di pagamento, ID ordine e importo sono obbligatori" },
        { status: 400 }
      );
    }

    // In production:
    // if (method === 'nexi') {
    //   return createNexiSession({ orderId, amount, customerEmail, customerName });
    // } else if (method === 'paypal') {
    //   return createPayPalOrder({ orderId, amount, customerEmail });
    // }

    // Mock response for development
    console.log("[Payment Session] Created:", { method, orderId, amount });

    return NextResponse.json({
      sessionId: `sess_${Date.now()}`,
      method,
      redirectUrl: method === "nexi"
        ? `https://sandbox.xpay.nexigroup.com/pay/${orderId}`
        : `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
    });
  } catch (error) {
    console.error("[Payment Session] Error:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della sessione di pagamento" },
      { status: 500 }
    );
  }
}

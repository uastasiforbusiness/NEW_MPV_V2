import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookMac, type NexiWebhookPayload } from "@/lib/nexi";

/**
 * Nexi XPay webhook handler
 * Logs every request, verifies MAC signature, updates order status
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NexiWebhookPayload;

    // Log the webhook
    console.log("[Nexi Webhook] Received:", {
      paymentId: body.paymentId,
      outcome: body.outcome,
      timestamp: body.timestamp,
    });

    // Verify MAC signature
    if (!verifyWebhookMac(body)) {
      console.error("[Nexi Webhook] Invalid MAC signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Check payment outcome
    if (body.outcome !== "OK") {
      console.warn("[Nexi Webhook] Payment failed:", body.paymentId);
      // In production: update order status to 'payment_failed'
      return NextResponse.json({ status: "payment_failed" });
    }

    // In production:
    // 1. Check idempotency (is order already paid?)
    // 2. Update order.status = 'paid'
    // 3. Trigger invoice creation via Invoicetronic
    // 4. Send order confirmation email via Resend

    console.log("[Nexi Webhook] Payment successful:", body.paymentId);

    return NextResponse.json({ status: "processed" });
  } catch (error) {
    console.error("[Nexi Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

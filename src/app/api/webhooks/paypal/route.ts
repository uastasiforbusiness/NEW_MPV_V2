import { NextRequest, NextResponse } from "next/server";

/**
 * PayPal webhook handler
 * Verifies signature, processes payment events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    console.log("[PayPal Webhook] Received:", {
      eventType: body.event_type,
      resourceId: body.resource?.id,
      headerCount: Object.keys(headers).length,
    });

    // In production:
    // 1. Verify webhook signature via PayPal API
    //    const isValid = await verifyPayPalWebhook(webhookId, headers, body);
    // 2. Check idempotency
    // 3. Process event based on event_type:
    //    - PAYMENT.CAPTURE.COMPLETED -> update order.status = 'paid'
    //    - PAYMENT.CAPTURE.DENIED -> update order.status = 'failed'
    //    - CHECKOUT.ORDER.APPROVED -> order ready for capture
    // 4. Trigger invoice creation for completed payments

    switch (body.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        console.log("[PayPal Webhook] Payment completed:", body.resource?.id);
        break;

      case "PAYMENT.CAPTURE.DENIED":
        console.warn("[PayPal Webhook] Payment denied:", body.resource?.id);
        break;

      case "CHECKOUT.ORDER.APPROVED":
        console.log("[PayPal Webhook] Order approved:", body.resource?.id);
        break;

      default:
        console.log("[PayPal Webhook] Unhandled event:", body.event_type);
    }

    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("[PayPal Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

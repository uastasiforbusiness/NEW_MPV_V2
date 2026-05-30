import { NextRequest, NextResponse } from "next/server";
import { mapSdiStatus } from "@/lib/invoicetronic";

/**
 * Invoicetronic (SDI) webhook handler
 * Updates invoice status when SDI processes the invoice
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[Invoicetronic Webhook] Received:", {
      invoiceId: body.id,
      status: body.status,
    });

    // Map SDI status to our internal status
    const sdiStatus = mapSdiStatus(body.status);
    console.log("[Invoicetronic Webhook] Mapped status:", sdiStatus);

    // Handle different SDI statuses
    switch (sdiStatus) {
      case "ACCETTAZIONE":
        // Invoice accepted by SDI
        // 1. Update invoices.sdi_status = 'ACCETTAZIONE'
        // 2. Store PDF URL
        // 3. Send invoice email to customer via Resend
        console.log("[Invoicetronic Webhook] Invoice accepted");
        break;

      case "RIFIUTO":
        // Invoice rejected by SDI
        // 1. Update invoices.sdi_status = 'RIFIUTO'
        // 2. Log error for admin review
        // 3. Alert admin via email
        console.error("[Invoicetronic Webhook] Invoice rejected");
        break;

      case "SCARTO":
        // Invoice discarded (technical error)
        // 1. Update invoices.sdi_status = 'SCARTO'
        // 2. Log error for admin review
        // 3. Alert admin to fix and resend
        console.error("[Invoicetronic Webhook] Invoice discarded");
        break;

      default:
        console.log("[Invoicetronic Webhook] Status update:", sdiStatus);
    }

    return NextResponse.json({ status: "processed" });
  } catch (error) {
    console.error("[Invoicetronic Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

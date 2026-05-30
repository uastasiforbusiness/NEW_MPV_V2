import { NextRequest, NextResponse } from "next/server";
import { buildFatturaPAXml, sendInvoiceToSDI } from "@/lib/invoicetronic";

/**
 * Triggers invoice creation and SDI submission
 * Called after payment is confirmed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, invoiceNumber } = body;

    if (!orderId || !invoiceNumber) {
      return NextResponse.json(
        { error: "Order ID and invoice number are required" },
        { status: 400 }
      );
    }

    // In production:
    // 1. Fetch order data from Supabase
    // 2. Generate XML FatturaPA
    // 3. Send to Invoicetronic
    // 4. Store in invoices table
    // 5. Store XML in Supabase Storage

    // Mock invoice data for development
    const mockInvoiceData = {
      invoiceNumber,
      invoiceDate: new Date().toISOString().split("T")[0],
      sender: {
        country: "IT",
        fiscalCode: "01234567890",
        vatCode: "01234567890",
        name: "MPV ITALIA SRL",
        street: "Via Roma 1",
        city: "Milano",
        province: "MI",
        cap: "20121",
      },
      receiver: {
        country: "IT",
        fiscalCode: "RSSMRA85M01H501Z",
        name: "Mario Rossi",
        street: "Via Dante 10",
        city: "Firenze",
        province: "FI",
        cap: "50100",
        sdiCode: "0000000",
      },
      items: [
        {
          description: "Divano MPV - Nero",
          quantity: 1,
          unitPrice: 4200,
          vatPercent: 0.22,
          total: 4200,
        },
      ],
      paymentTerm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    // Build XML
    const xml = buildFatturaPAXml(mockInvoiceData);
    console.log("[Fatturazione] XML generated for invoice:", invoiceNumber);

    // In production: send to Invoicetronic
    // const result = await sendInvoiceToSDI(xml, invoiceNumber);

    return NextResponse.json({
      status: "inviata",
      invoiceNumber,
      message: "Fattura inviata con successo",
    });
  } catch (error) {
    console.error("[Fatturazione] Error:", error);
    return NextResponse.json(
      { error: "Errore nell'invio della fattura" },
      { status: 500 }
    );
  }
}

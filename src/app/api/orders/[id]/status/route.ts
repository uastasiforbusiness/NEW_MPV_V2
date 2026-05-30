import { NextRequest, NextResponse } from "next/server";

/**
 * Order status polling endpoint
 * Used by the confirmation page to check payment status after redirect
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: query Supabase for order status
    // const { data: order } = await supabase
    //   .from('orders')
    //   .select('status, payment_status')
    //   .eq('id', id)
    //   .single();

    // Mock response for development
    console.log("[Order Status] Polling:", id);

    return NextResponse.json({
      orderId: id,
      status: "paid",
      paymentStatus: "paid",
    });
  } catch (error) {
    console.error("[Order Status] Error:", error);
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }
}

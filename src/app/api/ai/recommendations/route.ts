import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";

/**
 * Basic product recommendations endpoint
 * Returns products based on category or material similarity
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || "";
    const category = searchParams.get("category") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "3"), 6);

    const products = getAllProducts();

    // Filter by category if provided
    let recommendations = category
      ? products.filter((p) => p.category === category && p.id !== productId)
      : products.filter((p) => p.id !== productId);

    // Sort by availability (disponibile first)
    recommendations.sort((a, b) => {
      const order = { disponibile: 0, su_ordinazione: 1, esaurito: 2 };
      return order[a.stock_status] - order[b.stock_status];
    });

    recommendations = recommendations.slice(0, limit);

    return NextResponse.json({
      recommendations: recommendations.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price_eur,
        image: p.images[0]?.src,
        color: p.color,
        stockStatus: p.stock_status,
      })),
    });
  } catch (error) {
    console.error("[AI Recommendations] Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}

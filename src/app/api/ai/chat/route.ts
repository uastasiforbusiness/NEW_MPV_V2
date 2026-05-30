import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";

/**
 * Basic chatbot endpoint for product Q&A
 * Uses keyword matching to answer common questions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const lowerMessage = message.toLowerCase();
    const products = getAllProducts();

    // Simple rule-based responses
    let response = "";

    if (
      lowerMessage.includes("spedizione") ||
      lowerMessage.includes("consegna") ||
      lowerMessage.includes("tempi")
    ) {
      response =
        "La spedizione in Italia è gratuita per tutti gli ordini. I tempi di consegna sono di 5-7 giorni lavorativi per i prodotti disponibili e 2-3 settimane per i prodotti su ordinazione. La consegna viene effettuata da corriere espresso con appuntamento.";
    } else if (
      lowerMessage.includes("reso") ||
      lowerMessage.includes("recesso") ||
      lowerMessage.includes("restituzione")
    ) {
      response =
        "Hai diritto di recesso entro 14 giorni dalla ricezione del prodotto, ai sensi del D.Lgs. 21/2014. Puoi compilare il modulo di recesso sul nostro sito nella sezione 'Diritto di Recesso'. Il prodotto deve essere restituito nelle condizioni originali, completo di imballaggio e accessori.";
    } else if (
      lowerMessage.includes("pagamento") ||
      lowerMessage.includes("carta") ||
      lowerMessage.includes("paypal") ||
      lowerMessage.includes("rate")
    ) {
      response =
        "Accettiamo pagamenti con carta di credito/debito (Visa, Mastercard, American Express) tramite Nexi XPay e PayPal. Con PayPal puoi anche pagare in 3 rate senza interessi. Per ordini sopra €1.500 è disponibile anche Klarna.";
    } else if (
      lowerMessage.includes("garanzia") ||
      lowerMessage.includes("difetto")
    ) {
      response =
        "Tutti i prodotti MPV Italia sono coperti da garanzia legale di 2 anni ai sensi del D.Lgs. 24/2002. La garanzia copre difetti di fabbricazione e materiali. Per richiedere assistenza, contattaci via email a assistenza@mpvitalia.it.";
    } else if (
      lowerMessage.includes("misure") ||
      lowerMessage.includes("dimensioni") ||
      lowerMessage.includes("peso")
    ) {
      const product = products.find(
        (p) =>
          p.name.toLowerCase().includes(lowerMessage) ||
          p.color.toLowerCase().includes(lowerMessage)
      );
      if (product) {
        response = `Il ${product.name} ha dimensioni ${product.dimensions} e pesa ${product.weight_kg} kg.`;
      } else {
        response =
          "I nostri divani hanno dimensioni di 120 cm (L) x 70 cm (P) x 50 cm (H) con area letto di 80 cm x 60 cm. Il peso è di circa 25 kg. Per informazioni più specifiche su un modello, consulta la pagina prodotto.";
      }
    } else if (
      lowerMessage.includes("materiali") ||
      lowerMessage.includes("tessuto") ||
      lowerMessage.includes("pulizia")
    ) {
      const product = products.find(
        (p) =>
          p.name.toLowerCase().includes(lowerMessage) ||
          p.color.toLowerCase().includes(lowerMessage)
      );
      if (product) {
        response = `Il ${product.name} è realizzato in ${product.materials}. Il rivestimento è idrorepellente e facile da pulire con un panno umido.`;
      } else {
        response =
          "I nostri divani sono realizzati con velluto idrorepellente premium, memory foam ad alta densità e legno massello di faggio. Il rivestimento è facile da pulire con un panno umido e sapone neutro.";
      }
    } else if (
      lowerMessage.includes("prezzo") ||
      lowerMessage.includes("costa") ||
      lowerMessage.includes("quanto")
    ) {
      const product = products.find(
        (p) =>
          p.name.toLowerCase().includes(lowerMessage) ||
          p.color.toLowerCase().includes(lowerMessage)
      );
      if (product) {
        const price = product.price_eur.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
        });
        response = `Il ${product.name} ha un prezzo di ${price} IVA inclusa. La spedizione in Italia è gratuita.`;
      } else {
        response =
          "I nostri divani hanno prezzi che vanno da €3.800 a €4.500 IVA inclusa, a seconda del modello. La spedizione in Italia è gratuita.";
      }
    } else {
      response =
        "Grazie per il tuo interesse in MPV Italia! Sono qui per aiutarti con informazioni sui nostri prodotti, spedizione, pagamenti, resi e garanzia. Cosa vorresti sapere?";
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

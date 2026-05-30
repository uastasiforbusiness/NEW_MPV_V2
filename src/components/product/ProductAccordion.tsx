import { Accordion } from "@/components/ui";
import type { ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface ProductAccordionProps {
  items?: AccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const defaultItems: AccordionItem[] = [
    {
      title: "Spedizione e Consegna",
      content: (
        <div className="space-y-2">
          <p>
            La spedizione in Italia è gratuita per tutti gli ordini. I tempi di
            consegna sono di 5-7 giorni lavorativi per i prodotti disponibili e
            2-3 settimane per i prodotti su ordinazione.
          </p>
          <p>
            La consegna viene effettuata da corriere espresso con appuntamento.
            Il corriere contatterà il cliente per organizzare la consegna.
          </p>
          <p className="font-medium">
            Spedizioni internazionali: contattaci per un preventivo
            personalizzato.
          </p>
        </div>
      ),
    },
    {
      title: "Resi e Diritto di Recesso",
      content: (
        <div className="space-y-2">
          <p>
            Hai diritto di recesso entro 14 giorni dalla ricezione del prodotto,
            ai sensi del D.Lgs. 21/2014.
          </p>
          <p>
            Per esercitare il diritto di recesso, compila il modulo disponibile{" "}
            <a href="/recesso/modulo" className="text-[var(--accent)] underline">
              qui
            </a>{" "}
            e inviacelo entro 14 giorni.
          </p>
          <p>
            Il prodotto deve essere restituito nelle condizioni originali,
            completo di imballaggio e accessori. Le spese di restituzione sono a
            carico del cliente.
          </p>
          <p>
            Il rimborso verrà effettuato entro 14 giorni dalla ricezione del
            reso.
          </p>
        </div>
      ),
    },
    {
      title: "Garanzia",
      content: (
        <div className="space-y-2">
          <p>
            Tutti i prodotti MPV Italia sono coperti da garanzia legale di 2
            anni ai sensi del D.Lgs. 24/2002.
          </p>
          <p>
            La garanzia copre difetti di fabbricazione e materiali. Non copre
            danni derivanti da uso improprio o usura normale.
          </p>
          <p>
            Per richiedere assistenza in garanzia, contattaci via email a{" "}
            <a
              href="mailto:assistenza@mpvitalia.it"
              className="text-[var(--accent)] underline"
            >
              assistenza@mpvitalia.it
            </a>
          </p>
        </div>
      ),
    },
    {
      title: "Manutenzione e Cura",
      content: (
        <div className="space-y-2">
          <p>
            Il rivestimento in velluto idrorepellente può essere pulito con un
            panno umido e sapone neutro. Per macchie ostinate, utilizzare un
            prodotto specifico per tessuti.
          </p>
          <p>
            Il cuscino rimovibile può essere lavato a 30°C seguendo le
            istruzioni riportate sull&apos;etichetta.
          </p>
          <p>
            Passare regolarmente l&apos;aspirapolvere per rimuovere peli e
            polvere. Evitare l&apos;esposizione prolungata alla luce solare
            diretta.
          </p>
        </div>
      ),
    },
  ];

  const accordionItems = items || defaultItems;

  return (
    <div className="mt-8">
      <Accordion items={accordionItems} />
    </div>
  );
}

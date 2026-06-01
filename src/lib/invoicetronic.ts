const INVOICETRONIC_API_KEY = process.env.INVOICETRONIC_API_KEY!;
const INVOICETRONIC_ENV = process.env.INVOICETRONIC_ENV || "sandbox";

const INVOICETRONIC_BASE_URL =
  INVOICETRONIC_ENV === "production"
    ? "https://api.invoicetronic.com/v1"
    : "https://api.sandbox.invoicetronic.com/v1";

interface SenderData {
  country: string;
  fiscalCode: string;
  vatCode?: string;
  name: string;
  street: string;
  city: string;
  province: string;
  cap: string;
}

interface ReceiverData {
  country: string;
  fiscalCode?: string;
  vatCode?: string;
  name: string;
  street?: string;
  city?: string;
  province?: string;
  cap?: string;
  sdiCode?: string;
  pec?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatPercent: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  sender: SenderData;
  receiver: ReceiverData;
  items: InvoiceItem[];
  paymentTerm: string;
  bankInfo?: string;
}

/**
 * Build XML FatturaPA from invoice data
 */
export function buildFatturaPAXml(data: InvoiceData): string {
  const isB2C = !data.receiver.vatCode;

  const electronicInvoicing = `<?xml version="1.0" encoding="UTF-8"?>
<FatturaElettronica versione="${
    isB2C ? "FPR12" : "FPA12"
  }" xmlns="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>${data.sender.country}</IdPaese>
        <IdCodice>${data.sender.vatCode || data.sender.fiscalCode}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${data.invoiceNumber}</ProgressivoInvio>
      <FormatoTrasmissione>${isB2C ? "FPR12" : "FPA12"}</FormatoTrasmissione>
      <CodiceDestinatario>${data.receiver.sdiCode || "0000000"}</CodiceDestinatario>
      ${
        data.receiver.pec
          ? `<PECDestinatario>${data.receiver.pec}</PECDestinatario>`
          : ""
      }
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        ${
          data.sender.vatCode
            ? `<IdFiscaleIVA><IdPaese>${data.sender.country}</IdPaese><IdCodice>${data.sender.vatCode}</IdCodice></IdFiscaleIVA>`
            : ""
        }
        <CodiceFiscale>${data.sender.fiscalCode}</CodiceFiscale>
        <Anagrafica><Denominazione>${escapeXml(
          data.sender.name
        )}</Denominazione></Anagrafica>
        <RegimeFiscale>RF01</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${escapeXml(data.sender.street)}</Indirizzo>
        <Comune>${escapeXml(data.sender.city)}</Comune>
        <Provincia>${data.sender.province}</Provincia>
        <CAP>${data.sender.cap}</CAP>
        <Nazione>${data.sender.country}</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
        ${
          data.receiver.vatCode
            ? `<IdFiscaleIVA><IdPaese>${data.receiver.country}</IdPaese><IdCodice>${data.receiver.vatCode}</IdCodice></IdFiscaleIVA>`
            : `<CodiceFiscale>${data.receiver.fiscalCode}</CodiceFiscale>`
        }
        <Anagrafica><Denominazione>${escapeXml(
          data.receiver.name
        )}</Denominazione></Anagrafica>
      </DatiAnagrafici>
      ${
        data.receiver.street
          ? `<Sede>
        <Indirizzo>${escapeXml(data.receiver.street)}</Indirizzo>
        <Comune>${escapeXml(data.receiver.city || "")}</Comune>
        <Provincia>${data.receiver.province || ""}</Provincia>
        <CAP>${data.receiver.cap || ""}</CAP>
        <Nazione>${data.receiver.country}</Nazione>
      </Sede>`
          : ""
      }
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>${data.invoiceDate}</Data>
        <Numero>${data.invoiceNumber}</Numero>
        ${data.items
          .map(
            (item) =>
              `<DatiRiepilogo>
            <ImponibileImporto>${item.total.toFixed(2)}</ImponibileImporto>
            <AliquotaIVA>${(item.vatPercent * 100).toFixed(2)}</AliquotaIVA>
            <Importo>${(item.total * item.vatPercent).toFixed(2)}</Importo>
          </DatiRiepilogo>`
          )
          .join("\n        ")}
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiPagamento>
      <CondizioniPagamento>TP02</CondizioniPagamento>
      <DettaglioPagamento>
        <ModalitaPagamento>MP01</ModalitaPagamento>
        <DataScadenzaPagamento>${data.paymentTerm}</DataScadenzaPagamento>
        ${
          data.bankInfo
            ? `<IstitutoFinanziario>${escapeXml(data.bankInfo)}</IstitutoFinanziario>`
            : ""
        }
      </DettaglioPagamento>
    </DatiPagamento>
  </FatturaElettronicaBody>
</FatturaElettronica>`;

  return electronicInvoicing;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Send invoice to Invoicetronic API
 */
export async function sendInvoiceToSDI(
  xmlContent: string,
  invoiceNumber: string
) {
  console.log(`[Invoicetronic] Sending invoice ${invoiceNumber} to SDI...`);
  const response = await fetch(`${INVOICETRONIC_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${INVOICETRONIC_API_KEY}`,
      "Content-Type": "application/xml",
      Accept: "application/json",
    },
    body: xmlContent,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Invoicetronic API error: ${error}`);
  }

  return response.json();
}

/**
 * Get invoice status from Invoicetronic
 */
export async function getInvoiceStatus(invoiceId: string) {
  const response = await fetch(
    `${INVOICETRONIC_BASE_URL}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization: `Bearer ${INVOICETRONIC_API_KEY}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get invoice status: ${error}`);
  }

  return response.json();
}

/**
 * Map SDI status to our internal enum
 */
export function mapSdiStatus(sdiStatus: string): string {
  switch (sdiStatus) {
    case "Consegnato":
      return "CONSEGNA";
    case "Accettato":
      return "ACCETTAZIONE";
    case "Rifiutato":
      return "RIFIUTO";
    case "Scarto":
      return "SCARTO";
    case "Invio":
    default:
      return "INVIATA";
  }
}

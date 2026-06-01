import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface InvoiceDeliveryEmailProps {
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  downloadUrl: string;
  preview: string;
  heading: string;
  greeting: string;
  body: string;
  downloadButton: string;
  note: string;
  footer: string;
}

export default function InvoiceDeliveryEmail({
  orderId,
  invoiceNumber,
  customerName,
  downloadUrl,
  preview,
  heading,
  greeting,
  body,
  downloadButton,
  note,
  footer,
}: InvoiceDeliveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>{body}</Text>
          
          <Section style={detailsContainer}>
            <Text style={detailsHeader}>Dettagli Documento</Text>
            <Text style={detailsText}>
              <strong>Cliente:</strong> {customerName}<br />
              <strong>Numero Fattura:</strong> {invoiceNumber}<br />
              <strong>ID Ordine:</strong> {orderId}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button href={downloadUrl} style={button}>
              {downloadButton}
            </Button>
          </Section>
          <Text style={text}>{note}</Text>
          <Text style={footerStyle}>{footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#FAF8F5",
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1A1A1A",
  fontFamily: 'Playfair Display, Georgia, serif',
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.2",
  marginBottom: "24px",
};

const text = {
  color: "#1A1A1A",
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#C9A96E",
  color: "#FFFFFF",
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: "6px",
};

const footerStyle = {
  color: "#737373",
  fontSize: "14px",
  marginTop: "32px",
  paddingTop: "16px",
  borderTop: "1px solid #E5E5E5",
};

const detailsContainer = {
  backgroundColor: "#F5F0E8",
  padding: "16px",
  borderRadius: "6px",
  border: "1px solid #E7E5DF",
  margin: "24px 0",
};

const detailsHeader = {
  color: "#1A1A1A",
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const detailsText = {
  color: "#403E3A",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

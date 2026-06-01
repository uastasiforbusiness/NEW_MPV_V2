import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  total: string;
  preview: string;
  heading: string;
  greeting: string;
  confirmed: string;
  totalLabel: string;
  trackingNotice: string;
  footer: string;
}

export default function OrderConfirmationEmail({
  orderId,
  customerName,
  total,
  preview,
  heading,
  greeting,
  confirmed,
  totalLabel,
  trackingNotice,
  footer,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>{confirmed}</Text>
          <Section style={summary}>
            <Text style={summaryTitle}>Riepilogo Ordine</Text>
            <Text style={summaryDetail}>
              <strong>ID Ordine:</strong> {orderId}<br />
              <strong>Cliente:</strong> {customerName}<br />
              <strong>Totale:</strong> {total}
            </Text>
            <Text style={summaryText} className="mt-2">{totalLabel}: {total}</Text>
          </Section>
          <Text style={text}>{trackingNotice}</Text>
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

const summary = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E5E5",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const summaryText = {
  color: "#1A1A1A",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};

const summaryTitle = {
  color: "#1A1A1A",
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const summaryDetail = {
  color: "#403E3A",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "16px",
};

const footerStyle = {
  color: "#737373",
  fontSize: "14px",
  marginTop: "32px",
  paddingTop: "16px",
  borderTop: "1px solid #E5E5E5",
};

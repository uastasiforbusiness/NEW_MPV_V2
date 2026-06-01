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

interface ShippingUpdateEmailProps {
  orderId: string;
  customerName: string;
  trackingCode: string;
  trackingUrl: string;
  estimatedDelivery: string;
  preview: string;
  headerTitle: string;
  headerSubtitle: string;
  heading: string;
  greeting: string;
  body: string;
  trackingTitle: string;
  trackingCodeLabel: string;
  estimatedDeliveryLabel: string;
  trackButton: string;
  contact: string;
  footer: string;
  footerSub: string;
  contactEmail: string;
}

export default function ShippingUpdateEmail({
  orderId = "ORD-000000",
  customerName = "Cliente",
  trackingCode = "",
  trackingUrl = "#",
  estimatedDelivery = "",
  preview,
  headerTitle,
  headerSubtitle,
  heading,
  greeting,
  body,
  trackingTitle,
  trackingCodeLabel,
  estimatedDeliveryLabel,
  trackButton,
  contact,
  footer,
  footerSub,
  contactEmail,
}: ShippingUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{headerTitle}</Heading>
            <Text style={subtitle}>{headerSubtitle}</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>{heading}</Heading>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>{body}</Text>

            {/* Tracking Info */}
            {trackingCode && (
              <Section style={trackingBox}>
                <Text style={trackingTitleStyle}>{trackingTitle}</Text>
                <Text style={trackingItem}>
                  <strong>ID Ordine:</strong> {orderId}
                </Text>
                <Text style={trackingItem}>
                  <strong>Cliente:</strong> {customerName}
                </Text>
                <Text style={trackingItem}>
                  <strong>{trackingCodeLabel}</strong> {trackingCode}
                </Text>
                {estimatedDelivery && (
                  <Text style={trackingItem}>
                    <strong>{estimatedDeliveryLabel}</strong> {estimatedDelivery}
                  </Text>
                )}
              </Section>
            )}

            {/* Track Button */}
            {trackingUrl && (
              <Section style={buttonContainer}>
                <Button href={trackingUrl} style={button}>
                  {trackButton}
                </Button>
              </Section>
            )}

            <Text style={text}>
              {contact}{" "}
              <a href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerText}>{footer}</Text>
            <Text style={footerText}>{footerSub}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#FAF8F5",
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  textAlign: "center" as const,
  backgroundColor: "#1A1A1A",
};

const h1 = {
  color: "#C9A96E",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0 0 8px",
  fontFamily: "'Playfair Display', Georgia, serif",
};

const subtitle = {
  color: "#A3A3A3",
  fontSize: "14px",
  margin: "0",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
};

const content = {
  padding: "32px 24px",
  backgroundColor: "#FFFFFF",
};

const h2 = {
  color: "#1A1A1A",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 24px",
  fontFamily: "'Playfair Display', Georgia, serif",
};

const text = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const link = {
  color: "#C9A96E",
  textDecoration: "underline",
};

const trackingBox = {
  backgroundColor: "#FAF8F5",
  border: "1px solid #E5E5E5",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const trackingTitleStyle = {
  color: "#1A1A1A",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const trackingItem = {
  color: "#404040",
  fontSize: "14px",
  margin: "0 0 8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#C9A96E",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const footerSectionStyle = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#737373",
  fontSize: "12px",
  margin: "0 0 8px",
};

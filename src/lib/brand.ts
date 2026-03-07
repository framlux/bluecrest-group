// lib/brand.ts
export function getBrand() {
  // BlueCrest Group brand colors from the style guide
  const COLORS = {
    primary: '#1E3A8A', // Brand blue
    gold: '#D4AF37', // Brand gold
    coral: '#FF6B6B', // Brand coral
    dark: '#1F2937', // Dark background
  };

  return {
    // Email template fields
    subject: "We received your CFO services inquiry",
    preheader: "Thank you for your interest in BlueCrest Group's fractional CFO services. We have received your request and will contact you within 24 hours.",
    company_name: 'BlueCrest Group',
    logo_url: 'https://bluecrest-group.com/images/bluecrest-group-logo.png',
    city_state: "Orange County, CA",
    brand_accent: COLORS.primary,
    brand_gold: COLORS.gold,
    cta_dark_bg: COLORS.dark,
    bg_color: "#F9FAFB",
    text_dark: "#111827",
    text_muted: "#6B7280",
    text_body: "#374151",
    text_faint: "#9CA3AF",
    border_color: "#E5E7EB",
    card_header_bg: "#FEF3C7",

    // Hero content
    hero_title: "Thank you for your inquiry",
    hero_subtitle: "Our team will review your details and reach out within 24 hours to discuss how BlueCrest Group can support your business's financial strategy.",
    details_title: "Inquiry Details",

    // CTA buttons
    call_cta_label: "Call Our Team",
    site_cta_label: "Visit Website",
    site_url: "https://bluecrest-group.com",

    // Address and footer
    address_line: "Orange County, California",
    footer_note: "This confirmation is a transactional email related to your inquiry. We respect your privacy and will never share your information.",

    // Legacy fields for backward compatibility
    brand_title: 'BlueCrest Group',
    brand_tagline: 'Strategic CFO Services for Growing Businesses',
    brand_dark_bg: COLORS.dark,
    supportEmail: 'info@bluecrest-group.com',
    service_area: 'Serving Orange County and Southern California',
    portfolio_url: 'https://bluecrest-group.com/about',
    portfolio_blurb: 'Strategic financial leadership for growing businesses.',
    intro_copy: 'Delivering expert financial guidance and CFO services to help your business grow and thrive.',
  };
}

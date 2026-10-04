import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import { CurrencyProvider } from "../context/CurrencyContext";
import { EnquiryProvider } from "../context/EnquiryContext";
import GlobalEnquiryDrawer from "../components/GlobalEnquiryDrawer";
import GlobalEnquiryFloatingButton from "../components/GlobalEnquiryFloatingButton";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "hair&nature® - Natural Human Hair Extension Manufacturer & Exporter",
  description: "Ethically sourced, high-quality, chemical-free extensions known for strength, luster, and durability. Experience premium hair extensions.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable}`}>
      <body>
        <CurrencyProvider>
          <EnquiryProvider>
            <Navigation />
            <main>{children}</main>
          <footer id="contact-section" style={{ backgroundColor: '#111', color: 'white', padding: 'clamp(50px, 8vh, 80px) 0 30px' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 'clamp(25px, 4vw, 40px)', marginBottom: '30px' }}>
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: 'clamp(1.6rem, 4vw, 2rem)', color: 'var(--color-primary)' }}>hair&nature®</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.8, fontSize: '0.95rem' }}>Top natural human hair extensions manufacturer & exporter. We offer ethically sourced, chemical-free, 100% natural Remy hair extensions.</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Quick Links</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', opacity: 0.8 }}>
                  <li><a href="/#hero-section">Home</a></li>
                  <li><a href="/#products-section">Products</a></li>
                  <li><a href="/#about-section">About Us</a></li>
                  <li><a href="/#contact-section">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Factory & Contact</h4>
                <div style={{ marginBottom: '14px', lineHeight: 1.6, fontSize: '0.95rem', opacity: 0.85 }}>
                  <span style={{ display: 'block', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Factory Address:</span>
                  WZ 81/1A Guru Nanak Nagar,<br />
                  New Delhi 110018, India
                </div>
                <p style={{ opacity: 0.8, marginBottom: '8px', fontSize: '0.95rem' }}>📞 +91-9871171978 (India)</p>
                <p style={{ opacity: 0.8, marginBottom: '8px', fontSize: '0.95rem' }}>📞 +1-9292450936 (USA)</p>
                <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>✉️ info@hairandnature.com</p>
              </div>
            </div>
            <div className="container" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', opacity: 0.5, fontSize: '0.85rem' }}>
              <p>© 2026 hair&nature®. All rights reserved.</p>
            </div>
          </footer>
            <GlobalEnquiryDrawer />
            <GlobalEnquiryFloatingButton />
          </EnquiryProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

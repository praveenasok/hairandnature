import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "hair&nature® - Natural Human Hair Extension Manufacturer & Exporter",
  description: "Ethically sourced, high-quality, chemical-free extensions known for strength, luster, and durability. Experience premium hair extensions.",
  icons: {
    icon: '/favicon.svg',
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
        <Navigation />
        <main>{children}</main>
        <footer style={{ backgroundColor: '#111', color: 'white', padding: '80px 0 40px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ marginBottom: '20px', fontSize: '2rem', color: 'var(--color-primary)' }}>hair&nature®</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.8, fontSize: '0.95rem' }}>Top natural human hair extensions manufacturer & exporter. We offer ethically sourced, chemical-free, 100% natural Remy hair extensions.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '25px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', opacity: 0.8 }}>
                <li><a href="#hero-section">Home</a></li>
                <li><a href="#products-section">Products</a></li>
                <li><a href="#about-section">About Us</a></li>
                <li><a href="#contact-section">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '25px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</h4>
              <p style={{ opacity: 0.8, marginBottom: '10px', fontSize: '0.95rem' }}>+91-9871171978 (India)</p>
              <p style={{ opacity: 0.8, marginBottom: '10px', fontSize: '0.95rem' }}>+1-9292450936 (USA)</p>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>info@hairandnature.com</p>
            </div>
          </div>
          <div className="container" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', opacity: 0.5, fontSize: '0.9rem' }}>
            <p>© 2026 hair&nature®. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

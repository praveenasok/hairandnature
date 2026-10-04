"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MiniImageSlider from "./MiniImageSlider";
import CurrencySelector from "./CurrencySelector";
import { useEnquiry } from "../context/EnquiryContext";

const PRODUCTS = [
  { name: "Tape Extensions", href: "/tape-extensions", imgs: ["/images/products/tapeextensions.webp", "/images/products/tapeextensions2.webp"] },
  { name: "K Tips", href: "/k-tips", imgs: ["/images/products/KTip2.png", "/images/products/KTip.jpg"] },
  { name: "Genius Wefts", href: "/genius-wefts", imgs: ["/images/products/geniusweft.jpg", "/images/products/geniusweft2.webp", "/images/products/geniusweft3.jpeg", "/images/products/geniusweft4.webp"] },
  { name: "Butterfly Wefts", href: "/butterfly-wefts", imgs: ["/images/products/butterflyweft.jpg", "/images/products/butterflyweft2.jpg", "/images/products/butterflyweft3.webp"] },
  { name: "ClipOn Extensions", href: "/seamless-clipon-extensions", imgs: ["/images/products/clipon.webp", "/images/products/clipon2.jpeg", "/images/products/clipon3.jpeg"] },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { setIsOpen: setEnquiryOpen, totalCount } = useEnquiry();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '15px' }} onClick={() => setIsOpen(false)}>
            {/* If you have a specific logo, replace this text with it */}
            <h1 className="brand-name" style={{ margin: 0, fontWeight: 500, fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)' }}>hair&nature®</h1>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <Link href="/" className="nav-link">Home</Link>
            
            {/* Products Dropdown */}
            <div 
              style={{ position: 'static' }} 
              onMouseEnter={() => setProductsOpen(true)} 
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link href="/#products-section" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                Products <ChevronDown size={14} />
              </Link>
              
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 15px)',
                      left: '24px',
                      right: '24px',
                      width: 'calc(100% - 48px)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                      padding: '30px',
                      zIndex: 100,
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 2fr',
                      gap: '30px'
                    }}
                  >
                    {/* Featured Left Panel */}
                    <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '20px', minHeight: '200px' }}>
                      <MiniImageSlider 
                        images={["/images/hero_general_1.jpg", "/images/genius_wefts_light.jpg", "/images/hero_general_2.jpg", "/images/k_tips_light.jpg"]} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', filter: 'brightness(0.6)' }} 
                      />
                      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>Premium Collection</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.5 }}>Discover ethically sourced, 100% natural Indian Remy human hair.</p>
                      </div>
                    </div>

                    {/* Products Grid Right Panel */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {PRODUCTS.map(product => (
                        <Link 
                          key={product.href} 
                          href={product.href}
                          style={{ padding: '20px', color: '#333', fontSize: '1.2rem', fontWeight: 600, transition: 'all 0.3s ease', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '16px' }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(228, 82, 88, 0.05)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <MiniImageSlider images={product.imgs} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #eee', boxShadow: '0 6px 15px rgba(0,0,0,0.08)', flexShrink: 0 }} />
                          {product.name}
                        </Link>
                      ))}

                      {/* Bottom-Right Slot: Logo & Authentic Rubber Stamp */}
                      <div 
                        style={{ 
                          padding: '14px 20px', 
                          borderRadius: '16px', 
                          background: 'linear-gradient(135deg, #fffdfa 0%, #fbf5ed 60%, #f6ebdc 100%)', 
                          border: '1px solid rgba(197, 148, 58, 0.35)', 
                          boxShadow: '0 4px 20px rgba(197, 148, 58, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          gap: '16px',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(197, 148, 58, 0.55)';
                          e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 148, 58, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(197, 148, 58, 0.35)';
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(197, 148, 58, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Brand Logo & Provenance Subtitle */}
                        <div>
                          <span style={{ 
                            fontFamily: 'var(--font-serif)', 
                            fontSize: '1.65rem', 
                            fontWeight: 600, 
                            color: '#b83238', 
                            lineHeight: 1.1,
                            letterSpacing: '-0.4px',
                            display: 'block'
                          }}>
                            hair&nature®
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c5943a', display: 'inline-block' }}></span>
                            <span style={{ 
                              fontSize: '0.68rem', 
                              letterSpacing: '1px', 
                              textTransform: 'uppercase', 
                              color: '#8c7662', 
                              fontWeight: 600 
                            }}>
                              100% Remy Hair Guarantee
                            </span>
                          </div>
                        </div>

                        {/* Luxury Certified Medallion Seal */}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 120 120" 
                          width="92" 
                          height="92" 
                          style={{ 
                            flexShrink: 0,
                            transition: 'transform 0.4s ease, filter 0.4s ease',
                            filter: 'drop-shadow(0 3px 8px rgba(197, 148, 58, 0.18))'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                          }}
                          aria-label="Certified 100% Pure Natural Remy Human Hair Seal"
                        >
                          <defs>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f7e5b2" />
                              <stop offset="30%" stopColor="#dfb76c" />
                              <stop offset="65%" stopColor="#c5943a" />
                              <stop offset="100%" stopColor="#966d21" />
                            </linearGradient>
                            <radialGradient id="sealBackdrop" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#fffdf9" />
                              <stop offset="70%" stopColor="#fbf3e6" />
                              <stop offset="100%" stopColor="#f1e0ca" />
                            </radialGradient>
                            <linearGradient id="roseAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#e45258" />
                              <stop offset="100%" stopColor="#ad252b" />
                            </linearGradient>
                            {/* Clockwise Upper Arc for Top Text */}
                            <path id="medallionUpperArc" d="M 21,60 A 39,39 0 0,1 99,60" fill="none" />
                            {/* Clockwise Lower Arc for Bottom Text */}
                            <path id="medallionLowerArc" d="M 99,60 A 39,39 0 0,1 21,60" fill="none" />
                          </defs>

                          {/* Outer Medallion Body */}
                          <circle cx="60" cy="60" r="57" fill="url(#sealBackdrop)" />

                          {/* Outer Luxury Dual Rings & Notches */}
                          <circle cx="60" cy="60" r="56" fill="none" stroke="url(#goldGradient)" strokeWidth="1.8" />
                          <circle cx="60" cy="60" r="52.5" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="2, 2.5" />
                          <circle cx="60" cy="60" r="48.5" fill="none" stroke="url(#goldGradient)" strokeWidth="0.8" />

                          {/* Curved Typography: Top Arc */}
                          <text fontSize="7" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.8" fill="#7a5518">
                            <textPath href="#medallionUpperArc" startOffset="50%" textAnchor="middle">★ 100% PURE NATURAL ★</textPath>
                          </text>

                          {/* Curved Typography: Bottom Arc */}
                          <text fontSize="7" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.8" fill="#7a5518">
                            <textPath href="#medallionLowerArc" startOffset="50%" textAnchor="middle">★ REMY HUMAN HAIR ★</textPath>
                          </text>

                          {/* Inner Medallion Separation Ring */}
                          <circle cx="60" cy="60" r="30.5" fill="url(#sealBackdrop)" stroke="url(#goldGradient)" strokeWidth="1.4" />
                          <circle cx="60" cy="60" r="28" fill="none" stroke="url(#goldGradient)" strokeWidth="0.6" strokeDasharray="1.5, 2" />

                          {/* Center Medallion Elements */}
                          <text x="60" y="45.5" textAnchor="middle" fontSize="6.5" fill="url(#goldGradient)" letterSpacing="2">★★★</text>

                          <text 
                            x="60" 
                            y="59" 
                            textAnchor="middle" 
                            fontSize="15.5" 
                            fontWeight="800" 
                            fontFamily="var(--font-serif), Georgia, 'Playfair Display', serif" 
                            fill="url(#roseAccent)" 
                            letterSpacing="0.3"
                          >
                            100%
                          </text>

                          <text 
                            x="60" 
                            y="68" 
                            textAnchor="middle" 
                            fontSize="6.2" 
                            fontWeight="800" 
                            fontFamily="system-ui, -apple-system, sans-serif" 
                            letterSpacing="2.2" 
                            fill="#7a5518"
                          >
                            NATURAL
                          </text>

                          <text 
                            x="60" 
                            y="75" 
                            textAnchor="middle" 
                            fontSize="4.8" 
                            fontWeight="700" 
                            fontFamily="system-ui, -apple-system, sans-serif" 
                            letterSpacing="1.4" 
                            fill="#966d21"
                          >
                            VIRGIN REMY
                          </text>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/#about-section" className="nav-link">About Us</Link>
            <Link href="/#contact-section" className="nav-link">Contact</Link>
            <div style={{ marginLeft: '4px', marginRight: '4px' }}>
              <CurrencySelector />
            </div>
            
            {/* Global Enquiry Button */}
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{
                background: totalCount > 0 ? 'rgba(228,82,88,0.08)' : '#ffffff',
                border: totalCount > 0 ? '1.5px solid var(--color-primary)' : '1px solid #d5ceca',
                color: totalCount > 0 ? 'var(--color-primary)' : '#444',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: totalCount > 0 ? '0 3px 12px rgba(228,82,88,0.15)' : 'none'
              }}
              title="Show Global Enquiries"
            >
              <span style={{ fontSize: '1rem' }}>📋</span>
              <span>Global Enquiry</span>
              {totalCount > 0 && (
                <span style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  padding: '2px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {totalCount}
                </span>
              )}
            </button>

            <a href="https://wa.me/919871171978" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
               Inquire Now
            </a>
          </nav>

          {/* Mobile Right Controls */}
          <div className="mobile-header-actions" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{
                background: totalCount > 0 ? 'rgba(228,82,88,0.1)' : '#f5f5f5',
                border: totalCount > 0 ? '1px solid var(--color-primary)' : '1px solid #ddd',
                color: totalCount > 0 ? 'var(--color-primary)' : '#444',
                padding: '6px 10px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span>📋</span>
              {totalCount > 0 && <span>{totalCount}</span>}
            </button>
            <CurrencySelector compact />
            <button 
              className="mobile-menu-btn" 
              style={{ color: 'var(--color-text)' }} 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav-overlay"
            style={{ overflow: 'hidden' }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Currency</span>
                <CurrencySelector />
              </div>
              <Link href="/" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>Home</Link>
              
              <div style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Products</span>
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px', gap: '14px' }}>
                  {PRODUCTS.map(product => (
                    <Link 
                      key={product.href} 
                      href={product.href} 
                      style={{ color: '#444', fontWeight: 500, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 0' }} 
                      onClick={() => setIsOpen(false)}
                    >
                      <MiniImageSlider images={product.imgs} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #eee', flexShrink: 0 }} />
                      <span>{product.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/#about-section" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>About Us</Link>
              <Link href="/#contact-section" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>Contact</Link>
              
              <div style={{ paddingTop: '20px', paddingBottom: '10px' }}>
                <a 
                  href="https://wa.me/919871171978" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '0.95rem' }}
                  onClick={() => setIsOpen(false)}
                >
                  Inquire Now on WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

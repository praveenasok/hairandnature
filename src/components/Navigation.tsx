"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MiniImageSlider from "./MiniImageSlider";

const PRODUCTS = [
  { name: "Tape Extensions", href: "/tape-extensions", imgs: ["/images/products/tapeextensions.webp", "/images/products/tapeextensions2.webp"] },
  { name: "K Tips", href: "/k-tips", imgs: ["/images/products/KTip.webp", "/images/products/KTip.jpg", "/images/products/KTip2.png"] },
  { name: "Genius Wefts", href: "/genius-wefts", imgs: ["/images/products/geniusweft.jpg", "/images/products/geniusweft2.webp", "/images/products/geniusweft3.jpeg", "/images/products/geniusweft4.webp"] },
  { name: "Butterfly Wefts", href: "/butterfly-wefts", imgs: ["/images/products/butterflyweft.jpg", "/images/products/butterflyweft2.jpg", "/images/products/butterflyweft3.webp"] },
  { name: "ClipOn Extensions", href: "/seamless-clipon-extensions", imgs: ["/images/products/clipon.webp", "/images/products/clipon2.jpeg", "/images/products/clipon3.jpeg"] },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

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
            <h1 className="brand-name" style={{ margin: 0, fontWeight: 500 }}>hair&nature®</h1>
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/#about-section" className="nav-link">About Us</Link>
            <Link href="/#contact-section" className="nav-link">Contact</Link>
            <a href="https://wa.me/919871171978" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
               Inquire Now
            </a>
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="mobile-menu-btn" 
            style={{ color: scrolled ? 'var(--color-text)' : 'white' }} 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
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
              <Link href="/" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>Home</Link>
              
              <div style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Products</span>
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px', gap: '15px' }}>
                  {PRODUCTS.map(product => (
                    <Link 
                      key={product.href} 
                      href={product.href} 
                      style={{ color: '#555', fontWeight: 500, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px' }} 
                      onClick={() => setIsOpen(false)}
                    >
                      <MiniImageSlider images={product.imgs} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid #eee', flexShrink: 0 }} />
                      {product.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/#about-section" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>About Us</Link>
              <Link href="/#contact-section" style={{ padding: '15px 0', borderBottom: '1px solid #eee', color: '#1a1a1a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setIsOpen(false)}>Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

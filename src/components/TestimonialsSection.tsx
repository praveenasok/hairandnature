"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  salon: string;
  location: string;
  rating: number;
  product: string;
  image: string;
  content: string;
  date: string;
  verified: boolean;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Master Stylist & Salon Director",
    salon: "Mane Allure Studio",
    location: "Mayfair, London, UK",
    rating: 5,
    product: "Tape Extensions (Frost & Polar Ash)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    content: "The quality of hair&nature tape extensions has completely elevated our salon offering. The cuticle alignment is genuine single-donor, zero tangling after 8 months of client wear, and the shades bleach and tone like a dream.",
    date: "September 2026",
    verified: true
  },
  {
    id: "2",
    name: "Chloé Dubois",
    role: "Celebrity Hair Extensionist",
    salon: "Atelier Chloé",
    location: "Paris, France",
    rating: 5,
    product: "Genius Wefts (Natural Wave)",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    content: "Zero return hair (mustache-free) Genius Wefts from hair&nature are the thinnest and most durable on the global market. My clients experience absolutely zero scalp irritation, and the blend is completely invisible.",
    date: "August 2026",
    verified: true
  },
  {
    id: "3",
    name: "Marcus Vance",
    role: "Creative Director",
    salon: "Vance Hair Lounge",
    location: "SoHo, New York, USA",
    rating: 5,
    product: "K-Tips (Italian Keratin Matrix)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    content: "Direct factory export pricing combined with luxury temple remy hair is unheard of. Their K-Tips fuse cleanly at 180°C and maintain their fullness right down to the ends without tapering or shedding.",
    date: "August 2026",
    verified: true
  },
  {
    id: "4",
    name: "Jessica Taylor",
    role: "Extension Specialist & Educator",
    salon: "Crown & Glory Extensions",
    location: "Sydney, Australia",
    rating: 5,
    product: "Butterfly Wefts (Body Wave)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    content: "The density of the hair from root to tip is phenomenal. Even our most demanding bridal clients are in awe of the softness and natural wave luster. Fast international dispatch directly from Delhi.",
    date: "July 2026",
    verified: true
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error("Could not fetch testimonials:", err));
  }, []);

  const locations = ['All', ...Array.from(new Set(testimonials.map(t => {
    const parts = t.location.split(',');
    return parts[parts.length - 1]?.trim() || t.location;
  })))];

  const filtered = activeFilter === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.location.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <section id="testimonials-section" className="section" style={{ background: '#fbf9f6', borderTop: '1px solid #efeae4', borderBottom: '1px solid #efeae4' }}>
      <div className="container">
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(36px, 6vw, 54px) auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 16px', 
              background: 'rgba(228, 82, 88, 0.08)', 
              borderRadius: '30px', 
              color: 'var(--color-primary)', 
              fontWeight: 700, 
              fontSize: '0.84rem', 
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            <span>★</span> 4.9 / 5.0 Rating Across 500+ Luxury Salons
          </motion.div>
          
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: '14px', lineHeight: 1.2 }}
          >
            Trusted by Master Stylists & Global Salons
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ margin: '0 auto', fontSize: '1.05rem', color: '#666', lineHeight: 1.6 }}
          >
            Hear directly from verified salon owners, certified extensionists, and celebrity hair artists about their experience with our 100% temple remy human hair extensions.
          </motion.p>

          {/* Filter Pills */}
          {locations.length > 2 && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {locations.map(loc => {
                const isActive = activeFilter === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setActiveFilter(loc)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: isActive ? '1px solid var(--color-primary)' : '1px solid #e0dad3',
                      background: isActive ? 'var(--color-primary)' : '#ffffff',
                      color: isActive ? '#ffffff' : '#555',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(228, 82, 88, 0.25)' : 'none'
                    }}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Testimonials Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
          gap: '24px',
          marginBottom: 'clamp(40px, 6vw, 60px)'
        }}>
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: 'clamp(22px, 3.5vw, 30px)',
                border: '1px solid #ebe5df',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              whileHover={{ translateY: -4, boxShadow: '0 18px 40px rgba(0,0,0,0.07)' }}
            >
              <div>
                {/* Top Row: Stars & Verified Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', fontSize: '1.1rem' }}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  {item.verified && (
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      background: 'rgba(74, 222, 128, 0.12)', 
                      color: '#15803d', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.74rem', 
                      fontWeight: 700 
                    }}>
                      ✓ Verified Salon
                    </span>
                  )}
                </div>

                {/* Product Mention Tag */}
                {item.product && (
                  <div style={{ 
                    display: 'inline-block',
                    background: '#f8f6f4',
                    border: '1px solid #eee8e2',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#666',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}>
                    Featured: {item.product}
                  </div>
                )}

                {/* Quote Content */}
                <p style={{ 
                  fontSize: '0.96rem', 
                  lineHeight: 1.68, 
                  color: '#333', 
                  fontStyle: 'normal',
                  marginBottom: '24px'
                }}>
                  “{item.content}”
                </p>
              </div>

              {/* Author Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid #f4f0ec' }}>
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={item.name} 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '2px solid rgba(228,82,88,0.2)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    flexShrink: 0
                  }} 
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.96rem', color: '#1a1a1a', fontWeight: 700, lineHeight: 1.2 }}>
                    {item.name}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                    {item.role} {item.salon ? `• ${item.salon}` : ''}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.74rem', color: '#888', marginTop: '1px' }}>
                    📍 {item.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Salon Trust Metrics Ribbon */}
        <div style={{
          background: 'linear-gradient(135deg, #1f1d1b 0%, #2a2522 100%)',
          borderRadius: '24px',
          padding: 'clamp(24px, 4vw, 36px)',
          color: '#ffffff',
          boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
              500+
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block', marginTop: '6px' }}>
              Certified Partner Salons
            </span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#f59e0b', lineHeight: 1.1 }}>
              100%
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block', marginTop: '6px' }}>
              Cuticle-Aligned Temple Remy
            </span>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#4ade80', lineHeight: 1.1 }}>
              99.4%
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block', marginTop: '6px' }}>
              Salon Repeat Reorder Rate
            </span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#60a5fa', lineHeight: 1.1 }}>
              35+
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block', marginTop: '6px' }}>
              Export Countries Served
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

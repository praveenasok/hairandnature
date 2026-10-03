"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, Paperclip, Maximize2, RefreshCw, Star } from "lucide-react";

const images = [
  "/images/new_hair_bun.png",
  "/images/new_hair_highlights.png",
  "/images/new_flatclip_ponytail.png"
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ 
      position: 'relative', 
      height: '100vh', 
      minHeight: '800px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            zIndex: 0,
            top: 0,
            left: 0
          }}
          alt="Hero background"
        />
      </AnimatePresence>
      
      {/* Overlay subtle dark gradient for better contrast globally */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
        zIndex: 1
      }} />

      {/* Top Pill Nav */}
      <div style={{ position: 'relative', zIndex: 2, padding: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <span className="pill-tag">buns</span>
        <span className="pill-tag">highlights</span>
        <span className="pill-tag">ponytails</span>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        
        {/* Main Glass Design Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative', maxWidth: '500px', width: '100%', margin: '0 20px' }}
        >
          <div className="glass-design-card">
            <h2 style={{ fontSize: '3.2rem', fontWeight: 700, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'rgba(255,255,255,0.95)' }}>
              nature<br/>meets beauty.
            </h2>
            
            <p style={{ fontSize: '0.95rem', marginBottom: '30px', opacity: 0.8, lineHeight: 1.5, color: '#eee' }}>
              discover premium DIY hair extensions tailored for Indian hair. effortlessly enhance your look with our luxurious buns, ponytails, and highlights.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', background: 'rgba(0,0,0,0.25)', padding: '6px 16px', borderRadius: '20px', width: 'fit-content' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>4.9/5</span>
              <div style={{ display: 'flex', gap: '2px', color: 'rgba(255,255,255,0.9)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '5px' }}>customer favorites</span>
            </div>
            
            <p style={{ fontSize: '0.8rem', opacity: 0.6, maxWidth: '200px', lineHeight: 1.4 }}>
              embrace your natural beauty, enhanced with our premium collection.
            </p>
          </div>

          {/* Floating Left Button (Aligned with cutout) */}
          <button className="floating-btn" style={{ position: 'absolute', left: '-35px', top: '55%', transform: 'translateY(-50%)', width: '50px', height: '50px', zIndex: 3 }}>
            <LayoutGrid size={22} />
          </button>

          {/* Bottom Pill Button (Aligned with cutout) */}
          <div style={{ position: 'absolute', bottom: '-15px', left: '65%', transform: 'translateX(-50%)', zIndex: 3 }}>
            <Link href="/shop" className="pill-btn">
              <Paperclip size={14} />
              view collection
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Floating Right Actions */}
      <div style={{ position: 'absolute', bottom: '40px', right: '30px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="floating-btn" style={{ width: '55px', height: '55px' }}>
          <Maximize2 size={24} />
        </button>
        <button className="floating-btn" style={{ width: '55px', height: '55px' }} onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}>
          <RefreshCw size={24} />
        </button>
      </div>

    </section>
  );
}

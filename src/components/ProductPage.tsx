"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const WEIGHTS = ['50 Grams', '100 Grams', '150 Grams', '200 Grams'];
const STYLES = ['Natural Straight', 'Natural Wave', 'Body Wave', 'Deep Wave', 'Kinky Curls', 'Afro Curls'];
const COLORS = [
  { name: '#1 Jet Black', hex: '#0e0d12' },
  { name: '#1b Off Black', hex: '#19171d' },
  { name: '#2 Darkest Brown', hex: '#231812' },
  { name: '#4 Medium Brown', hex: '#442f23' },
  { name: '#8 Light Ash Brown', hex: '#5e5549' },
  { name: '#22 Light Blonde', hex: '#f0e6c8' },
  { name: '#613 Bleach Blonde', hex: '#fef5ce' }
];

const DEFAULT_PRODUCT_IMAGES: Record<string, string[]> = {
  "Tape Extensions": [
    "/images/tape_extensions.jpg",
    "/images/products/tapeextensions.webp",
    "/images/products/tapeextensions2.webp"
  ],
  "K Tips": [
    "/images/k_tips_light.jpg",
    "/images/products/KTip2.png",
    "/images/products/KTip.jpg",
    "/images/k_tips.jpg"
  ],
  "Genius Wefts": [
    "/images/genius_wefts_light.jpg",
    "/images/products/geniusweft.jpg",
    "/images/products/geniusweft2.webp",
    "/images/products/geniusweft3.jpeg",
    "/images/products/geniusweft4.webp",
    "/images/genius_wefts.jpg"
  ],
  "Butterfly Wefts": [
    "/images/butterfly_wefts.jpg",
    "/images/products/butterflyweft.jpg",
    "/images/products/butterflyweft2.jpg",
    "/images/products/butterflyweft3.webp"
  ],
  "ClipOn Extensions": [
    "/images/seamless_clipon.jpg",
    "/images/products/clipon.webp",
    "/images/products/clipon2.jpeg",
    "/images/products/clipon3.jpeg"
  ]
};

const PRODUCT_IMAGE_CONFIG: Record<string, { position: string; transform?: string }> = {
  // Tape Extensions
  "/images/tape_extensions.jpg": { position: "center 20%" },
  "/images/products/tapeextensions.webp": { position: "center 56%", transform: "scale(1.05)" },
  "/images/products/tapeextensions2.webp": { position: "18% 45%", transform: "scale(1.05)" },

  // K-Tips
  "/images/k_tips_light.jpg": { position: "center 18%" },
  "/images/k_tips.jpg": { position: "center 15%" },
  "/images/products/KTip.jpg": { position: "22% 50%", transform: "scale(1.08)" },
  "/images/products/KTip2.png": { position: "center 20%", transform: "scale(1.05)" },

  // Genius Wefts
  "/images/genius_wefts_light.jpg": { position: "center 20%" },
  "/images/genius_wefts.jpg": { position: "center 18%" },
  "/images/products/geniusweft.jpg": { position: "center 42%" },
  "/images/products/geniusweft2.webp": { position: "center 40%" },
  "/images/products/geniusweft3.jpeg": { position: "center 65%" },
  "/images/products/geniusweft4.webp": { position: "center 18%" },

  // Butterfly Wefts
  "/images/butterfly_wefts.jpg": { position: "center 20%" },
  "/images/products/butterflyweft.jpg": { position: "58% 36%", transform: "scale(1.08)" },
  "/images/products/butterflyweft2.jpg": { position: "30% 65%" },
  "/images/products/butterflyweft3.webp": { position: "45% 65%" },

  // ClipOn Extensions
  "/images/seamless_clipon.jpg": { position: "center 20%" },
  "/images/products/clipon.webp": { position: "center 22%" },
  "/images/products/clipon2.jpeg": { position: "28% 28%" },
  "/images/products/clipon3.jpeg": { position: "center 22%" }
};

interface ProductPageProps {
  title: string;
  desc: string;
  img: string;
  images?: string[];
  specs?: { label: string; value: string }[];
}

export default function ProductPage({ title, desc, img, images = [], specs = [] }: ProductPageProps) {
  const { formatPrice, currency } = useCurrency();
  const [length, setLength] = useState(LENGTHS[0]);
  const [weight, setWeight] = useState(WEIGHTS[1]);
  const [style, setStyle] = useState(STYLES[0]);
  const [color, setColor] = useState(COLORS[0].name);
  const [description, setDescription] = useState(desc);
  
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [unit, setUnit] = useState<string>('unit');

  // Slider State
  const slideImages = useMemo(() => {
    if (images && images.length > 0) return images;
    if (DEFAULT_PRODUCT_IMAGES[title]) return DEFAULT_PRODUCT_IMAGES[title];
    return [img];
  }, [images, title, img]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slideImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideImages.length, isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slideImages.length);
  };
  
  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => setPrices(data || {}))
      .catch(err => console.error("Could not load prices", err));

    fetch('/api/units')
      .then(res => res.json())
      .then(data => {
        if (data && data[title]) {
          setUnit(data[title]);
        }
      })
      .catch(err => console.error("Could not load units", err));

    fetch('/api/descriptions')
      .then(res => res.json())
      .then(data => {
        if (data && data[title]) {
          setDescription(data[title]);
        }
      })
      .catch(err => console.error("Could not load descriptions", err));
  }, [title]);

  const keyWithWeight = `${title}|${length}|${style}|${color}|${weight}`;
  const keyLegacy = `${title}|${length}|${style}|${color}`;

  let currentPrice = prices[keyWithWeight];
  if (currentPrice === undefined && prices[keyLegacy] !== undefined) {
    const base = prices[keyLegacy];
    const mults: Record<string, number> = {
      '50 Grams': 0.55,
      '100 Grams': 1.0,
      '150 Grams': 1.48,
      '200 Grams': 1.95
    };
    currentPrice = Math.round(base * (mults[weight] || 1.0));
  }

  // Minimum base starting price for this product
  const startingPriceUSD = useMemo(() => {
    const matches = Object.entries(prices)
      .filter(([k]) => k.startsWith(`${title}|`))
      .map(([, v]) => v);
    if (matches.length > 0) return Math.min(...matches);
    return currentPrice || 45;
  }, [prices, title, currentPrice]);

  const formattedPriceWithUnit = currentPrice !== undefined ? formatPrice(currentPrice, unit) : '';
  const priceText = currentPrice !== undefined ? ` - ${formattedPriceWithUnit}` : '';
  const whatsappMessage = `Hi, I am interested in ordering the ${title}. \nLength: ${length}\nWeight: ${weight}\nStyle: ${style}\nColor: ${color}${currentPrice ? `\nPrice: ${formattedPriceWithUnit} (${currency})` : ''}`;
  const whatsappUrl = `https://wa.me/919871171978?text=${encodeURIComponent(whatsappMessage)}`;

  const scrollToBuilder = () => {
    const el = document.getElementById('builder-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION WITH PRODUCT IMAGE SLIDER */}
      <section 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: 'relative',
          height: 'clamp(490px, 66vh, 660px)',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#111',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Sliding Background Images */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0
            }}
          >
            <img
              src={slideImages[currentSlide]}
              alt={`${title} hero view ${currentSlide + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: PRODUCT_IMAGE_CONFIG[slideImages[currentSlide]]?.position || 'center 20%',
                transform: PRODUCT_IMAGE_CONFIG[slideImages[currentSlide]]?.transform || 'none'
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated Dark Gradient Overlays for Readability */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.75) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: 'clamp(320px, 58vw, 820px)',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Slider Navigation Arrows (Left / Right) */}
        {slideImages.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: 'clamp(12px, 2.5vw, 32px)',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(42px, 5vw, 52px)',
                height: 'clamp(42px, 5vw, 52px)',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 4,
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <button
              onClick={handleNextSlide}
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: 'clamp(12px, 2.5vw, 32px)',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(42px, 5vw, 52px)',
                height: 'clamp(42px, 5vw, 52px)',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 4,
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </>
        )}

        {/* Hero Content Overlay */}
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%', paddingTop: 'clamp(60px, 8vh, 80px)' }}>
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            style={{ maxWidth: '640px' }}
          >
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginBottom: '14px' }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.75)' }}>Home</a>
              <span>/</span>
              <a href="/shop" style={{ color: 'rgba(255,255,255,0.75)' }}>Products</a>
              <span>/</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{title}</span>
            </div>

            {/* Pill Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(228, 82, 88, 0.25)', border: '1px solid rgba(228, 82, 88, 0.5)', color: '#ffb3b8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', backdropFilter: 'blur(6px)' }}>
              <span>✨ 100% Remy Human Hair • Factory Direct</span>
            </div>

            {/* Hero Title */}
            <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', color: '#ffffff', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.5px' }}>
              {title}
            </h1>

            {/* Subtitle / Excerpt */}
            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', lineHeight: 1.6, color: 'rgba(255,255,255,0.88)', marginBottom: '22px', maxWidth: '560px' }}>
              {description}
            </p>

            {/* Price & Action Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.22)', padding: '10px 18px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting From</span>
                <span style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: 'var(--color-primary-light, #ff8b94)' }}>
                  {formatPrice(startingPriceUSD, unit)}
                </span>
              </div>

              <button 
                onClick={scrollToBuilder}
                className="btn-gold"
                style={{ padding: '14px 24px', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '10px', border: 'none' }}
              >
                <span>Customize Length & Weight</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
              </button>
            </div>

          </motion.div>
        </div>

        {/* Bottom Hero Thumbnails Strip */}
        {slideImages.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '18px',
            left: 0,
            right: 0,
            zIndex: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            padding: '0 20px'
          }}>
            {slideImages.map((sImg, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentSlide ? '52px' : '40px',
                  height: '36px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: idx === currentSlide ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.4)',
                  padding: 0,
                  background: 'rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  opacity: idx === currentSlide ? 1 : 0.65,
                  boxShadow: idx === currentSlide ? '0 0 12px rgba(228, 82, 88, 0.6)' : 'none'
                }}
              >
                <img src={sImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '6px', background: 'rgba(0,0,0,0.45)', padding: '4px 10px', borderRadius: '12px' }}>
              {String(currentSlide + 1).padStart(2, '0')} / {String(slideImages.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </section>

      {/* 2. PRODUCT DETAILS & CONFIGURATOR SECTION */}
      <div id="builder-section" style={{ paddingTop: 'clamp(40px, 6vh, 60px)', paddingBottom: 'clamp(50px, 8vh, 80px)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(30px, 5vw, 60px)', alignItems: 'flex-start' }}>
          
          {/* Left Column: Interactive Product Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            
            {/* Main Interactive Product Image Frame */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '16px', background: '#f5f5f5' }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={slideImages[currentSlide]} 
                  alt={`${title} detail`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: PRODUCT_IMAGE_CONFIG[slideImages[currentSlide]]?.position || 'center center'
                  }} 
                />
              </AnimatePresence>

              {/* Gallery Overlay Prev / Next Buttons */}
              {slideImages.length > 1 && (
                <div style={{ position: 'absolute', bottom: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 2 }}>
                  <button 
                    onClick={handlePrevSlide}
                    aria-label="Previous image"
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button 
                    onClick={handleNextSlide}
                    aria-label="Next image"
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails Row */}
            {slideImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slideImages.length}, 1fr)`, gap: '8px', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
                {slideImages.map((sImg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      height: '70px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: idx === currentSlide ? '2px solid var(--color-primary)' : '1px solid #ddd',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#fff',
                      opacity: idx === currentSlide ? 1 : 0.7,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={sImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
            
            <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '20px', color: 'var(--color-primary)', fontWeight: 700 }}>The {title} Experience</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#222' }}>Premium Quality</h3>
                  <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.92rem' }}>Sourced directly from Indian temples, ensuring 100% natural, healthy, and lustrous hair.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="6.5"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#222' }}>Seamless Blend</h3>
                  <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.92rem' }}>Designed for maximum comfort and a flawless finish that mimics your natural hair growth.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Product Details & Builder */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--color-primary)', fontWeight: 700, lineHeight: 1.15, margin: 0 }}>{title}</h2>
              {currentPrice !== undefined && (
                <div style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  {formattedPriceWithUnit}
                </div>
              )}
            </div>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', lineHeight: 1.7, marginBottom: '24px', color: '#555' }}>{description}</p>
            
            <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '24px 0' }} />

            {/* Length Options */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Length</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{length}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {LENGTHS.map(len => (
                  <button 
                    key={len} 
                    onClick={() => setLength(len)}
                    style={{ 
                      padding: '8px 14px', 
                      borderRadius: '8px', 
                      border: len === length ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                      background: len === length ? 'rgba(228, 82, 88, 0.05)' : 'white',
                      color: len === length ? 'var(--color-primary)' : '#444',
                      fontWeight: len === length ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      minHeight: '40px'
                    }}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Options */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Weight</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{weight}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WEIGHTS.map(w => (
                  <button 
                    key={w} 
                    onClick={() => setWeight(w)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      border: w === weight ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                      background: w === weight ? 'rgba(228, 82, 88, 0.05)' : 'white',
                      color: w === weight ? 'var(--color-primary)' : '#444',
                      fontWeight: w === weight ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      minHeight: '40px'
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Options */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Style / Texture</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{style}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {STYLES.map(st => (
                  <button 
                    key={st} 
                    onClick={() => setStyle(st)}
                    style={{ 
                      padding: '8px 14px', 
                      borderRadius: '8px', 
                      border: st === style ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                      background: st === style ? 'rgba(228, 82, 88, 0.05)' : 'white',
                      color: st === style ? 'var(--color-primary)' : '#444',
                      fontWeight: st === style ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      minHeight: '40px'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Premium Color</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{color}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {COLORS.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    aria-label={c.name}
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '50%', 
                      background: c.hex,
                      border: c.name === color ? '3px solid white' : 'none', 
                      boxShadow: c.name === color ? '0 0 0 2px var(--color-primary)' : '0 2px 5px rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Specs Table */}
            {specs.length > 0 && (
              <div style={{ marginBottom: '30px', background: 'white', borderRadius: '12px', padding: ' clamp(16px, 3vw, 20px)', border: '1px solid #eaeaea' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333' }}>Product Specifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {specs.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: i === specs.length - 1 ? 'none' : '1px solid #f0f0f0', gap: '10px' }}>
                      <span style={{ color: '#666', fontSize: '0.92rem' }}>{spec.label}</span>
                      <span style={{ color: '#222', fontWeight: 500, fontSize: '0.92rem', textAlign: 'right' }}>
                        {spec.label.toLowerCase().includes('weight') ? weight : spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary Box */}
            <div style={{ background: '#f8f8f8', padding: 'clamp(18px, 4vw, 25px)', borderRadius: '16px', border: '1px solid #e0e0e0' }}>
              <div style={{ marginBottom: '20px', fontSize: '1rem', lineHeight: 1.6, color: '#444' }}>
                Summary: Premium <strong>{title}</strong> in length <strong>{length}</strong>, weight <strong>{weight}</strong>, style <strong>{style}</strong>, and color <strong>{color}</strong>{priceText}.
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-gold" style={{ width: '100%', padding: '16px 20px', fontSize: 'clamp(1rem, 3.5vw, 1.15rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span>Inquire & Order on WhatsApp</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.1 8.1 0 0 1-1.24-4.38c0-4.49 3.66-8.15 8.15-8.15c2.18 0 4.22.85 5.76 2.38a8.09 8.09 0 0 1 2.38 5.77c0 4.49-3.66 8.15-8.15 8.15m4.47-6.09c-.24-.12-1.45-.72-1.68-.8c-.23-.08-.39-.12-.56.12c-.17.25-.66.8-.81.98c-.15.17-.3.2-.54.08c-.24-.12-1.01-.37-1.92-1.18c-.71-.63-1.19-1.42-1.33-1.66c-.14-.24-.02-.37.1-.49c.11-.12.24-.29.37-.43c.12-.14.17-.24.25-.41c.08-.17.04-.31-.02-.43c-.06-.12-.56-1.35-.77-1.85c-.2-.5-.4-.43-.56-.43c-.14 0-.31-.02-.47-.02c-.17 0-.44.06-.67.31c-.23.25-.88.86-.88 2.1c0 1.24.9 2.44 1.02 2.6c.12.17 1.77 2.7 4.29 3.79c.6.26 1.07.41 1.43.53c.6.19 1.15.16 1.58.1c.48-.07 1.45-.6 1.65-1.17c.2-.57.2-1.07.14-1.17c-.06-.1-.22-.18-.46-.3M12 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8"/></svg>
              </a>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

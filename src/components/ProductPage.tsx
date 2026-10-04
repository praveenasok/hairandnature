"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useEnquiry } from '@/context/EnquiryContext';

import { SPECTRUM_COLORS, COLOR_CATEGORIES, HairColor } from '@/data/colors';
import { HAIR_STYLES, STYLE_NAMES, HairStyle } from '@/data/styles';

const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const WEIGHTS = ['50 Grams', '100 Grams', '150 Grams', '200 Grams'];
const STYLES = STYLE_NAMES;

const DEFAULT_PRODUCT_IMAGES: Record<string, string[]> = {
  "Tape Extensions": [
    "/images/tape_extensions.jpg",
    "/images/products/tapeextensions.webp",
    "/images/products/tapeextensions2.webp",
    "/images/products/tape_application.jpg"
  ],
  "K Tips": [
    "/images/k_tips_light.jpg",
    "/images/products/KTip2.png",
    "/images/products/KTip.jpg",
    "/images/products/ktip_application.jpg",
    "/images/k_tips.jpg"
  ],
  "Genius Wefts": [
    "/images/genius_wefts_light.jpg",
    "/images/products/geniusweft.jpg",
    "/images/products/geniusweft2.webp",
    "/images/products/genius_weft_application.jpg",
    "/images/products/geniusweft3.jpeg",
    "/images/products/geniusweft4.webp",
    "/images/genius_wefts.jpg"
  ],
  "Butterfly Wefts": [
    "/images/butterfly_wefts.jpg",
    "/images/products/butterflyweft.jpg",
    "/images/products/butterfly_weft_application.jpg",
    "/images/products/butterflyweft2.jpg",
    "/images/products/butterflyweft3.webp"
  ],
  "ClipOn Extensions": [
    "/images/seamless_clipon.jpg",
    "/images/products/clipon.webp",
    "/images/products/clipon_application.jpg",
    "/images/products/clipon2.jpeg",
    "/images/products/clipon3.jpeg"
  ]
};

const PRODUCT_IMAGE_CONFIG: Record<string, { position: string; transform?: string }> = {
  // Tape Extensions
  "/images/tape_extensions.jpg": { position: "center 20%" },
  "/images/products/tapeextensions.webp": { position: "center 56%", transform: "scale(1.05)" },
  "/images/products/tapeextensions2.webp": { position: "18% 45%", transform: "scale(1.05)" },
  "/images/products/tape_application.jpg": { position: "center center" },

  // K-Tips
  "/images/k_tips_light.jpg": { position: "center 18%" },
  "/images/k_tips.jpg": { position: "center 15%" },
  "/images/products/KTip.jpg": { position: "22% 50%", transform: "scale(1.08)" },
  "/images/products/KTip2.png": { position: "center 20%", transform: "scale(1.05)" },
  "/images/products/ktip_application.jpg": { position: "center 30%" },

  // Genius Wefts
  "/images/genius_wefts_light.jpg": { position: "center 20%" },
  "/images/genius_wefts.jpg": { position: "center 18%" },
  "/images/products/geniusweft.jpg": { position: "center 42%" },
  "/images/products/geniusweft2.webp": { position: "center 40%" },
  "/images/products/geniusweft3.jpeg": { position: "center 65%" },
  "/images/products/geniusweft4.webp": { position: "center 18%" },
  "/images/products/genius_weft_application.jpg": { position: "center center" },

  // Butterfly Wefts
  "/images/butterfly_wefts.jpg": { position: "center 20%" },
  "/images/products/butterflyweft.jpg": { position: "58% 36%", transform: "scale(1.08)" },
  "/images/products/butterflyweft2.jpg": { position: "30% 65%" },
  "/images/products/butterflyweft3.webp": { position: "45% 65%" },
  "/images/products/butterfly_weft_application.jpg": { position: "center center" },

  // ClipOn Extensions
  "/images/seamless_clipon.jpg": { position: "center 20%" },
  "/images/products/clipon.webp": { position: "center 22%" },
  "/images/products/clipon2.jpeg": { position: "28% 28%" },
  "/images/products/clipon3.jpeg": { position: "center 22%" },
  "/images/products/clipon_application.jpg": { position: "center center" }
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
  const { addItem, totalCount, setIsOpen: openGlobalEnquiry } = useEnquiry();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [length, setLength] = useState(LENGTHS[0]);
  const [weight, setWeight] = useState(WEIGHTS[1]);
  const [style, setStyle] = useState(STYLES[0]);
  const [color, setColor] = useState(SPECTRUM_COLORS[0].name);
  const [colorCategory, setColorCategory] = useState<string>('All');
  const [description, setDescription] = useState(desc);

  const filteredColors = useMemo(() => {
    if (colorCategory === 'All') return SPECTRUM_COLORS;
    return SPECTRUM_COLORS.filter(c => c.category === colorCategory);
  }, [colorCategory]);

  const selectedColorObj = useMemo(() => {
    return SPECTRUM_COLORS.find(c => c.name === color) || SPECTRUM_COLORS[0];
  }, [color]);

  const selectedStyleObj = useMemo(() => {
    return HAIR_STYLES.find(s => s.name === style) || HAIR_STYLES[0];
  }, [style]);
  
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

  const formattedPriceWithUnit = currentPrice !== undefined ? formatPrice(currentPrice, unit) : '';
  const priceText = currentPrice !== undefined ? ` - ${formattedPriceWithUnit}` : '';
  const whatsappMessage = `Hi, I am interested in ordering the ${title}. \nLength: ${length}\nWeight: ${weight}\nStyle: ${style}\nColor: ${color}${currentPrice ? `\nPrice: ${formattedPriceWithUnit} (${currency})` : ''}`;
  const whatsappUrl = `https://wa.me/919871171978?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToGlobalEnquiry = () => {
    addItem({
      productId: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      image: slideImages[0] || img,
      length,
      weight,
      style,
      color,
      unit,
      quantity,
      basePriceUsd: currentPrice
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 4500);
  };

  return (
    <div style={{ paddingTop: 'clamp(90px, 12vh, 130px)', paddingBottom: 'clamp(50px, 8vh, 80px)', background: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="container">
             {/* Clean Breadcrumb & Trust Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#666' }}>
            <a href="/" style={{ color: '#666', transition: 'color 0.2s' }}>Home</a>
            <span style={{ color: '#bbb' }}>/</span>
            <a href="/#products-section" style={{ color: '#666', transition: 'color 0.2s' }}>Products</a>
            <span style={{ color: '#bbb' }}>/</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{title}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(228, 82, 88, 0.08)', color: 'var(--color-primary)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>✨</span> 100% Virgin Temple Remy Hair • Direct Factory Floor
          </div>
        </div>

        {/* Main 2-Column Luxury Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start' }}>
          
          {/* Left Column: Sticky Luxury Product Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: '100px' }}
          >
            
            {/* Main Interactive Product Image Frame */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '4 / 4.8', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 45px rgba(0,0,0,0.08)', 
              marginBottom: '16px', 
              background: '#f8f6f4',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={slideImages[currentSlide]} 
                  alt={`${title} detail view`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: PRODUCT_IMAGE_CONFIG[slideImages[currentSlide]]?.position || 'center center'
                  }} 
                />
              </AnimatePresence>

              {/* Floating Quality Tag */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '30px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#222',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                Factory Direct • Export Grade
              </div>

              {/* Slide Counter Indicator */}
              {slideImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.55)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {currentSlide + 1} / {slideImages.length}
                </div>
              )}

              {/* Gallery Overlay Prev / Next Buttons */}
              {slideImages.length > 1 && (
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
                  <button 
                    onClick={handlePrevSlide}
                    aria-label="Previous image"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.9)', 
                      color: '#222', 
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button 
                    onClick={handleNextSlide}
                    aria-label="Next image"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.9)', 
                      color: '#222', 
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails Strip */}
            {slideImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slideImages.length}, 1fr)`, gap: '10px', marginBottom: '22px' }}>
                {slideImages.map((sImg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      height: '74px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: idx === currentSlide ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.08)',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#fff',
                      opacity: idx === currentSlide ? 1 : 0.65,
                      transform: idx === currentSlide ? 'scale(1.02)' : 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: idx === currentSlide ? '0 4px 12px rgba(228, 82, 88, 0.18)' : 'none'
                    }}
                  >
                    <img src={sImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Luxury Trust & Craftsmanship Highlights */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '16px 20px', 
              border: '1px solid rgba(0,0,0,0.06)', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>💎</div>
                <strong style={{ display: 'block', fontSize: '0.82rem', color: '#1a1a1a', fontWeight: 700 }}>100% Remy Hair</strong>
                <span style={{ fontSize: '0.72rem', color: '#777' }}>Cuticle Aligned Flow</span>
              </div>
              <div style={{ borderLeft: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⚡</div>
                <strong style={{ display: 'block', fontSize: '0.82rem', color: '#1a1a1a', fontWeight: 700 }}>Heat & Color Safe</strong>
                <span style={{ fontSize: '0.72rem', color: '#777' }}>Up to 200°C Styling</span>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🌍</div>
                <strong style={{ display: 'block', fontSize: '0.82rem', color: '#1a1a1a', fontWeight: 700 }}>Worldwide Direct</strong>
                <span style={{ fontSize: '0.72rem', color: '#777' }}>Express DHL / FedEx</span>
              </div>
            </div>

          </motion.div>
          
          {/* Right Column: Luxury Product Details & Configurator Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ 
              background: '#ffffff', 
              borderRadius: '24px', 
              padding: 'clamp(24px, 4vw, 36px)', 
              border: '1px solid rgba(0,0,0,0.06)', 
              boxShadow: '0 12px 35px rgba(0,0,0,0.03)' 
            }}
          >
            {/* Pre-header Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--color-primary)' }}>
                Professional Salon Grade
              </span>
              <span style={{ color: '#ccc' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: '#888' }}>
                ★★★★★ (5.0) Verified Reviews
              </span>
            </div>

            {/* Title & Live Pricing Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#1a1a1a', fontWeight: 700, lineHeight: 1.15, margin: 0, flex: 1, minWidth: '220px' }}>
                {title}
              </h1>
              {currentPrice !== undefined && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {formattedPriceWithUnit}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginTop: '4px' }}>
                    Direct Wholesale Price ({currency})
                  </span>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '22px', color: '#555' }}>
              {description}
            </p>
            
            <div style={{ height: '1px', background: '#f0edea', margin: '20px 0' }} />

            {/* 1. Length Options */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#222' }}>1. Select Length</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.08)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {length}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {LENGTHS.map(len => {
                  const isSelected = len === length;
                  return (
                    <button 
                      key={len} 
                      onClick={() => setLength(len)}
                      style={{ 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0', 
                        background: isSelected ? 'rgba(228, 82, 88, 0.05)' : '#ffffff',
                        color: isSelected ? 'var(--color-primary)' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Weight Options */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#222' }}>2. Select Weight / Density</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.08)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {weight}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WEIGHTS.map(w => {
                  const isSelected = w === weight;
                  return (
                    <button 
                      key={w} 
                      onClick={() => setWeight(w)}
                      style={{ 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0', 
                        background: isSelected ? 'rgba(228, 82, 88, 0.05)' : '#ffffff',
                        color: isSelected ? 'var(--color-primary)' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Style / Texture Options */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#222' }}>3. Select Style & Texture</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.08)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {selectedStyleObj.name} ({selectedStyleObj.curlType})
                </span>
              </div>

              {/* Style Cards Compact Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '8px',
                marginBottom: '10px'
              }}>
                {HAIR_STYLES.map(st => {
                  const isSelected = st.name === style;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setStyle(st.name)}
                      type="button"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '8px 6px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(228, 82, 88, 0.04)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 3px 10px rgba(228, 82, 88, 0.12)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: '#f8fafc',
                        marginBottom: '6px',
                        position: 'relative'
                      }}>
                        <img 
                          src={st.image} 
                          alt={st.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }} 
                        />
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'var(--color-primary)',
                            color: '#fff',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700
                          }}>
                            ✓
                          </div>
                        )}
                      </div>

                      <span style={{ 
                        fontWeight: isSelected ? 700 : 600, 
                        fontSize: '0.8rem', 
                        color: isSelected ? 'var(--color-primary)' : '#1e293b',
                        lineHeight: 1.2
                      }}>
                        {st.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Texture Detail Note */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>•</span>
                <span><strong>{selectedStyleObj.name}:</strong> {selectedStyleObj.description}</span>
              </div>
            </div>

            {/* 4. Color Options */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#222' }}>4. Select Premium Shade</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.08)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {selectedColorObj.name}
                </span>
              </div>

              {/* Active Color Preview Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '8px 12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', background: '#fff' }}>
                  <img src={selectedColorObj.image} alt={selectedColorObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111' }}>{selectedColorObj.name}</span>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', padding: '1px 6px', borderRadius: '6px', fontWeight: 600 }}>{selectedColorObj.category}</span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#777' }}>100% Remy Human Hair • Organic Tone Swatch</span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {COLOR_CATEGORIES.map(cat => {
                  const count = cat === 'All' ? SPECTRUM_COLORS.length : SPECTRUM_COLORS.filter(c => c.category === cat).length;
                  const isActive = colorCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setColorCategory(cat)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: isActive ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isActive ? 'rgba(228, 82, 88, 0.08)' : '#fff',
                        color: isActive ? 'var(--color-primary)' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Color Swatches Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', 
                gap: '6px', 
                maxHeight: '230px', 
                overflowY: 'auto', 
                padding: '8px',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: '#fafafa'
              }}>
                {filteredColors.map(c => {
                  const isSelected = c.name === color;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      aria-label={c.name}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 2px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(228, 82, 88, 0.06)' : '#fff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 0 1px var(--color-primary)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#eee' }}>
                        <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: isSelected ? 700 : 500, 
                        color: isSelected ? 'var(--color-primary)' : '#444',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        maxWidth: '64px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Specifications Box */}
            {specs.length > 0 && (
              <div style={{ marginBottom: '24px', background: '#faf8f6', borderRadius: '12px', padding: '16px', border: '1px solid #ebe5df' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#333', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Technical Specifications
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {specs.map((spec, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e5dfd8' }}>
                      <span style={{ color: '#777' }}>{spec.label}:</span>
                      <span style={{ color: '#222', fontWeight: 600 }}>
                        {spec.label.toLowerCase().includes('weight') ? weight : spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary & WhatsApp Action Card */}
            <div style={{ 
              background: '#1a1a1a', 
              color: '#ffffff', 
              padding: 'clamp(20px, 3vw, 24px)', 
              borderRadius: '16px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', fontWeight: 600 }}>
                  Order Summary
                </span>
                <span style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></span>
                  Factory In-Stock
                </span>
              </div>

              <div style={{ fontSize: '0.92rem', lineHeight: 1.5, color: '#ddd', marginBottom: '16px' }}>
                <strong style={{ color: '#fff' }}>{title}</strong> • {length} • {weight} • {style} • {color}
              </div>

              {/* Quantity Stepper Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.86rem', color: '#bbb' }}>Quantity ({unit}s):</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ border: 'none', background: 'transparent', color: '#fff', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ border: 'none', background: 'transparent', color: '#fff', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <div>
                  <span style={{ fontSize: '0.88rem', color: '#bbb' }}>Estimated Total:</span>
                  {quantity > 1 && (
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#888' }}>
                      ({quantity} x {formattedPriceWithUnit})
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {currentPrice !== undefined ? formatPrice(currentPrice * quantity) : 'Wholesale Quote'}
                </span>
              </div>

              {/* Toast Feedback */}
              {addedToast && (
                <div style={{
                  background: 'rgba(74, 222, 128, 0.15)',
                  border: '1px solid #4ade80',
                  color: '#4ade80',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span>✓ Added to Global Enquiry ({totalCount} in bag)</span>
                  <button
                    type="button"
                    onClick={() => openGlobalEnquiry(true)}
                    style={{ background: '#4ade80', color: '#000', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Review All →
                  </button>
                </div>
              )}

              {/* Two Main Enquiry Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Add to Global Enquiry (Primary) */}
                <button 
                  type="button"
                  onClick={handleAddToGlobalEnquiry}
                  className="btn-gold" 
                  style={{ 
                    width: '100%', 
                    padding: '15px 20px', 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(228, 82, 88, 0.35)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>➕ Add to Global Enquiry</span>
                  {totalCount > 0 && (
                    <span style={{ background: '#ffffff', color: 'var(--color-primary)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {totalCount} in List
                    </span>
                  )}
                </button>

                {/* 2. Show Global Enquiries Drawer */}
                <button
                  type="button"
                  onClick={() => openGlobalEnquiry(true)}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <span>📋 Show Global Enquiries ({totalCount}) • Send 1 Message</span>
                </button>
              </div>

              {/* Secondary single-item quick WhatsApp link */}
              <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ fontSize: '0.8rem', color: '#bbb', textDecoration: 'underline', transition: 'color 0.2s' }}
                >
                  ⚡ Or send instant WhatsApp inquiry for this single item only
                </a>
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.74rem', color: '#888' }}>
                🌍 Combine multiple lengths & styles across products into 1 single wholesale message
              </div>
            </div>

          </motion.div>
        </div>


      </div>
    </div>
  );
}

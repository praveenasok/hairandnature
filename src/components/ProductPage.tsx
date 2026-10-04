"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

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

interface ApplicationStep {
  num: string;
  title: string;
  desc: string;
}

interface ProductApplicationInfo {
  image: string;
  videoUrl: string;
  videoTitle: string;
  technique: string;
  duration: string;
  difficulty: string;
  toolsNeeded: string[];
  steps: ApplicationStep[];
  proTip: string;
}

const APPLICATION_GUIDES: Record<string, ProductApplicationInfo> = {
  "Tape Extensions": {
    image: "/images/products/tape_application.jpg",
    videoUrl: "https://www.youtube-nocookie.com/embed/Cng9CAcmOhc",
    videoTitle: "Tape-In Hair Extensions Application & Sandwich Technique",
    technique: "Horizontal Micro-Sandwich Bonding",
    duration: "45 - 60 Minutes",
    difficulty: "Intermediate / Salon Pro",
    toolsNeeded: ["Rat-Tail Sectioning Comb", "Crocodile Styling Clips", "Extension Sealing Pliers", "Clarifying Prep Shampoo"],
    steps: [
      {
        num: "01",
        title: "Cleanse & Clarify",
        desc: "Wash client's natural hair with a clarifying shampoo to eliminate sebum and product buildup. Blow-dry 100% smooth without conditioner or oils at the roots."
      },
      {
        num: "02",
        title: "Precision Parting",
        desc: "Create a razor-sharp horizontal part 2-3mm from the scalp using a metal tail comb. Pin all excess hair upward with professional crocodile clips."
      },
      {
        num: "03",
        title: "Bottom Weft Placement",
        desc: "Peel the protective backing from the bottom tape weft. Place it beneath a micro-veil of natural hair with the medical-grade adhesive facing upwards."
      },
      {
        num: "04",
        title: "Sandwich & Pliers Seal",
        desc: "Align the matching top tape weft precisely over the natural hair. Press firmly and clamp with extension pliers for 3 seconds to guarantee a watertight bond."
      }
    ],
    proTip: "Keep the section of natural hair between the tabs translucent—over-saturating the sandwich prevents adhesive-to-adhesive contact and causes slippage."
  },
  "K Tips": {
    image: "/images/products/ktip_application.jpg",
    videoUrl: "https://www.youtube-nocookie.com/embed/QMdkbjbAf1E",
    videoTitle: "Keratin Tip (K-Tip) Hot Fusion Application Masterclass",
    technique: "Thermal Keratin Matrix Rolling",
    duration: "2 - 3.5 Hours",
    difficulty: "Advanced Certified Stylist",
    toolsNeeded: ["Digital Fusion Wand (180°C)", "Clear Scalp Protection Disc", "Heat Finger Shields", "Fine Sectioning Comb"],
    steps: [
      {
        num: "01",
        title: "Micro-Strand Isolation",
        desc: "Isolate a clean, cylindrical natural hair strand matching the extension strand weight (approx 1g) using the scalp protection disc."
      },
      {
        num: "02",
        title: "Root Clearance Alignment",
        desc: "Position the Italian keratin tip 1cm below the scalp directly under the natural hair strand to ensure complete 360-degree free hair movement."
      },
      {
        num: "03",
        title: "Thermal Melting",
        desc: "Clamp the digital heat wand over the keratin bond for 2-3 seconds at 180°C until the keratin softens into a clear, malleable gel."
      },
      {
        num: "04",
        title: "Cylindrical Rice-Grain Seal",
        desc: "Roll the melted keratin firmly between protected fingertips into a seamless, airtight cylindrical seal that is undetectable to the touch."
      }
    ],
    proTip: "Never fuse closer than 1cm from the scalp. Leaving adequate root clearance prevents tension alopecia and allows flexible styling in high ponytails."
  },
  "Genius Wefts": {
    image: "/images/products/genius_weft_application.jpg",
    videoUrl: "https://www.youtube-nocookie.com/embed/qBJkRTZqzAc",
    videoTitle: "Genius Weft Installation & Invisible Beaded Row Method",
    technique: "Seamless Beaded Foundation & Blanket Stitch",
    duration: "1.5 - 2.5 Hours",
    difficulty: "Professional Extensionist",
    toolsNeeded: ["Curved C-Needle", "Nylon Extension Thread", "Silicone Micro-Beads", "Loop Bead Threader & Pliers"],
    steps: [
      {
        num: "01",
        title: "Beaded Track Foundation",
        desc: "Create a horizontal track of silicone-lined micro-beads along the scalp curvature, spacing beads 1/2 inch apart with balanced natural hair tension."
      },
      {
        num: "02",
        title: "Zero-Mustache Custom Sizing",
        desc: "Measure and cut the Genius Weft to the exact track width. Unlike hand-tied wefts, the ultra-thin PU seam can be cut anywhere with zero unraveling."
      },
      {
        num: "03",
        title: "Flush Track Alignment",
        desc: "Pin the 0.8mm paper-thin weft flush against the scalp, aligning it directly over the beaded row with zero bulk or return hair."
      },
      {
        num: "04",
        title: "Reinforced Blanket Stitching",
        desc: "Sew through the weft and beneath each micro-bead using strong nylon thread and secure loop lock-stitches for an invisible, durable hold."
      }
    ],
    proTip: "Genius wefts have zero mustache return hair, eliminating irritation against sensitive scalps and preventing matting around the seam."
  },
  "Butterfly Wefts": {
    image: "/images/products/butterfly_weft_application.jpg",
    videoUrl: "https://www.youtube-nocookie.com/embed/MGRczz9R1mg",
    videoTitle: "Butterfly Weft Full-Volume Installation & Bead Concealment",
    technique: "Dual-Wing Beaded Track Encapsulation",
    duration: "1.5 - 2.5 Hours",
    difficulty: "Professional Extensionist",
    toolsNeeded: ["Curved Needle", "Heavy-Duty Thread", "Silicone Micro-Rings", "Bead Clamping Pliers"],
    steps: [
      {
        num: "01",
        title: "Foundation Row Mapping",
        desc: "Map horizontal foundation tracks along the occipital and parietal bones, ensuring clean weight distribution for thick, luxurious volume."
      },
      {
        num: "02",
        title: "Beaded Track Placement",
        desc: "Clamp silicone-lined micro-beads along the parted line to establish the secure, non-slip foundation."
      },
      {
        num: "03",
        title: "Winged Track Encapsulation",
        desc: "Place the butterfly weft so its upper and lower winged edges fold over the beaded track, completely encasing the hardware inside the center channel."
      },
      {
        num: "04",
        title: "Spine Lock Stitching",
        desc: "Sew through the center seam with curved needle and thread, anchoring the weft firmly while keeping beads 100% hidden from all angles."
      }
    ],
    proTip: "The winged flap design keeps the beads completely concealed even when styling the hair into high updos or dramatic parted looks."
  },
  "ClipOn Extensions": {
    image: "/images/products/clipon_application.jpg",
    videoUrl: "https://www.youtube-nocookie.com/embed/FKzN5DDJJ70",
    videoTitle: "Seamless Clip-In Hair Extensions Application & Blending Tutorial",
    technique: "Multi-Tier Root Lock Placement",
    duration: "5 - 10 Minutes",
    difficulty: "Beginner Friendly / At-Home",
    toolsNeeded: ["Fine-Tooth Tail Comb", "2 Sectioning Clips", "Root Teasing Brush / Texturizing Spray"],
    steps: [
      {
        num: "01",
        title: "Nape Section Anchor",
        desc: "Part natural hair horizontally at the nape of the neck and clip upper hair away. Lightly tease the roots for extra clip grip."
      },
      {
        num: "02",
        title: "Center-Out Snap Locking",
        desc: "Open silicone-cushioned clips on the 3-clip weft. Slide the center clip teeth into the teased root area and snap shut, followed by both outer clips."
      },
      {
        num: "03",
        title: "Ascending Tier Installation",
        desc: "Work upwards: place the 4-clip weft across the widest part of the head, 3-clip weft below crown, and 1-clip or 2-clip side pieces near temples."
      },
      {
        num: "04",
        title: "Brush & Style Blend",
        desc: "Release the top natural hair, gently brush through with an extension loop brush, and blend seamlessly using a curling wand or flat iron."
      }
    ],
    proTip: "Always snap the center clip first before snapping the outer clips to guarantee that the thin silicone band lies perfectly flat without buckling."
  }
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

  return (
    <div style={{ paddingTop: 'clamp(90px, 12vh, 130px)', paddingBottom: 'clamp(50px, 8vh, 80px)', background: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Clean Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#777', marginBottom: '24px' }}>
          <a href="/" style={{ color: '#777' }}>Home</a>
          <span>/</span>
          <a href="/#products-section" style={{ color: '#777' }}>Products</a>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(30px, 5vw, 60px)', alignItems: 'flex-start' }}>
          
          {/* Left Column: Product Hero Image with Slider */}
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
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--color-primary)', fontWeight: 700, lineHeight: 1.15, margin: 0 }}>{title}</h1>
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
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Style / Texture</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '3px 12px', borderRadius: '12px', fontSize: '0.88rem' }}>
                  {selectedStyleObj.name} • {selectedStyleObj.curlType}
                </span>
              </div>

              {/* Selected Style Visual Preview Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#fff' }}>
                  <img src={selectedStyleObj.image} alt={selectedStyleObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.02rem', color: '#111' }}>{selectedStyleObj.name}</span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{selectedStyleObj.pattern}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', lineHeight: 1.35 }}>{selectedStyleObj.description}</span>
                </div>
              </div>

              {/* Style Cards Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: '10px' 
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
                        padding: '10px 8px 8px 8px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(228, 82, 88, 0.04)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? '0 4px 14px rgba(228, 82, 88, 0.16)' : '0 1px 3px rgba(0,0,0,0.02)',
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#f8fafc',
                        marginBottom: '8px',
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
                            top: '6px',
                            right: '6px',
                            background: 'var(--color-primary)',
                            color: '#fff',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>

                      <span style={{ 
                        fontWeight: isSelected ? 700 : 600, 
                        fontSize: '0.85rem', 
                        color: isSelected ? 'var(--color-primary)' : '#1e293b',
                        lineHeight: 1.25,
                        marginBottom: '3px'
                      }}>
                        {st.name}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: '#64748b', 
                        lineHeight: 1.2 
                      }}>
                        {st.pattern}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Options with Spectrum One Images & Names */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Premium Shade / Color</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '3px 12px', borderRadius: '12px', fontSize: '0.88rem' }}>
                  {selectedColorObj.name}
                </span>
              </div>

              {/* Selected Color Visual Preview Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#fff' }}>
                  <img src={selectedColorObj.image} alt={selectedColorObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>{selectedColorObj.name}</span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{selectedColorObj.category}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#666', display: 'block' }}>100% Remy Human Hair • Organic Tone Swatch</span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {COLOR_CATEGORIES.map(cat => {
                  const count = cat === 'All' ? SPECTRUM_COLORS.length : SPECTRUM_COLORS.filter(c => c.category === cat).length;
                  const isActive = colorCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setColorCategory(cat)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        border: isActive ? '1px solid var(--color-primary)' : '1px solid #e0e0e0',
                        background: isActive ? 'rgba(228, 82, 88, 0.08)' : '#fff',
                        color: isActive ? 'var(--color-primary)' : '#666',
                        fontSize: '0.78rem',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Color Swatches Grid with Real Images */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', 
                gap: '8px', 
                maxHeight: '260px', 
                overflowY: 'auto', 
                padding: '8px',
                border: '1px solid #eaeaea',
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
                        borderRadius: '10px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e0e0e0',
                        background: isSelected ? 'rgba(228, 82, 88, 0.06)' : '#fff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 0 1px var(--color-primary)' : '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#eee' }}>
                        <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: isSelected ? 700 : 500, 
                        color: isSelected ? 'var(--color-primary)' : '#444',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        maxWidth: '68px',
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

        {/* Salon Masterclass & Application Guide Section */}
        {APPLICATION_GUIDES[title] && (() => {
          const guide = APPLICATION_GUIDES[title];
          return (
            <div style={{ marginTop: 'clamp(60px, 9vh, 90px)', borderTop: '1px solid #eaeaea', paddingTop: 'clamp(50px, 8vh, 70px)' }}>
              
              {/* Section Header */}
              <div style={{ textAlign: 'center', marginBottom: 'clamp(35px, 6vw, 55px)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(228, 82, 88, 0.08)', borderRadius: '30px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '14px' }}>
                  <span>✨</span> Professional Salon Masterclass
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#222', fontWeight: 700, marginBottom: '12px', lineHeight: 1.2 }}>
                  How It's Applied: Application Guide & Masterclass
                </h2>
                <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#666', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
                  Deep-dive visual demonstration and expert tutorial on how {title} are installed for maximum longevity, seamless root blending, and complete hair health.
                </p>
              </div>

              {/* 2-Column Presentation Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 'clamp(30px, 4vw, 50px)', alignItems: 'stretch' }}>
                
                {/* Left Card: Application Photography & Step-by-Step Breakdown */}
                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #eaeaea', padding: 'clamp(20px, 3.5vw, 32px)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Photo Container */}
                  <div style={{ position: 'relative', width: '100%', height: 'clamp(260px, 35vh, 320px)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                    <img 
                      src={guide.image} 
                      alt={`${title} application technique`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
                      Application Technique
                    </div>
                  </div>

                  {/* Quick Meta Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px', background: '#fafafa', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technique</span>
                      <strong style={{ fontSize: '0.9rem', color: '#222' }}>{guide.technique}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est. Time</span>
                      <strong style={{ fontSize: '0.9rem', color: '#222' }}>{guide.duration}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skill Level</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{guide.difficulty}</strong>
                    </div>
                  </div>

                  {/* Tools Needed */}
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Tools Recommended:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {guide.toolsNeeded.map((tool, idx) => (
                        <span key={idx} style={{ background: '#f3f4f6', color: '#444', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #e5e7eb' }}>
                          ✓ {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', flex: 1 }}>
                    {guide.steps.map((step, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {step.num}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#222', marginBottom: '3px' }}>{step.title}</h4>
                          <p style={{ fontSize: '0.86rem', color: '#666', lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pro Stylist Tip Callout */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>💡</span>
                    <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.55 }}>
                      <strong>Master Stylist Tip:</strong> {guide.proTip}
                    </div>
                  </div>

                </div>

                {/* Right Card: Masterclass Video Player & Stylist Training */}
                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #eaeaea', padding: 'clamp(20px, 3.5vw, 32px)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Video Player Frame */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', background: '#000', marginBottom: '20px', boxShadow: '0 12px 28px rgba(0,0,0,0.15)' }}>
                    <iframe 
                      src={guide.videoUrl} 
                      title={guide.videoTitle} 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen 
                      style={{ width: '100%', height: '100%', border: 'none' }} 
                    />
                  </div>

                  {/* Video Header Details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ display: 'inline-block', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
                        HD Application Video
                      </span>
                      <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', color: '#222', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                        {guide.videoTitle}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
                    Watch this certified professional walkthrough demonstrating the exact handling, root positioning, sectioning line, and sealing methods for flawless salon results.
                  </p>

                  {/* Masterclass Syllabus / Highlights */}
                  <div style={{ background: '#fafafa', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0', marginBottom: '24px', flex: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#444', marginBottom: '10px' }}>
                      Key Technique Breakdown in this Video:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#555' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>▶</span> Sectioning line curvature & tension balancing
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>▶</span> Root clearance to avoid follicle stress
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>▶</span> Complete hardware concealment for undetectable movement
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>▶</span> Post-installation blending, razor feathering & maintenance
                      </li>
                    </ul>
                  </div>

                  {/* Salon Wholesale / Stylist Inquiry Box */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(228,82,88,0.06), rgba(212,175,55,0.06))', padding: '18px', borderRadius: '12px', border: '1px solid rgba(228,82,88,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.92rem', color: '#222' }}>Salon Stylist or Studio Owner?</strong>
                        <span style={{ fontSize: '0.82rem', color: '#666' }}>Inquire for wholesale salon kits, sample swatches & master stylist support.</span>
                      </div>
                      <a 
                        href={`https://wa.me/919871171978?text=${encodeURIComponent(`Hi, I am interested in salon wholesale orders and technical training for ${title}.`)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-gold" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
                      >
                        Inquire for Salons
                      </a>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          );
        })()}
      </div>
    </div>
  );
}

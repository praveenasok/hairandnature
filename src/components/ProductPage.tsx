"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useEnquiry } from '@/context/EnquiryContext';

import { SPECTRUM_COLORS, COLOR_CATEGORIES, HairColor } from '@/data/colors';
import { HAIR_STYLES, STYLE_NAMES, HairStyle } from '@/data/styles';
import { getProductThumbnail } from '@/data/productImages';
import { Plus, ShoppingBag, Check } from 'lucide-react';

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
  const { formatPrice, convertPrice, currency, symbols } = useCurrency();
  const { addItem, totalCount, setIsOpen: openGlobalEnquiry } = useEnquiry();
  const [quantity, setQuantity] = useState<number>(1);
  const [length, setLength] = useState(LENGTHS[0]);
  const [weight, setWeight] = useState(WEIGHTS[1]);
  const [allColors, setAllColors] = useState<HairColor[]>(SPECTRUM_COLORS);
  const [style, setStyle] = useState(STYLES[0]);
  const [color, setColor] = useState(SPECTRUM_COLORS[0].name);
  const [description, setDescription] = useState(desc);
  const [metadata, setMetadata] = useState<any>(null);

  const availableColors = useMemo(() => {
    if (metadata && Array.isArray(metadata.availableColors) && metadata.availableColors.length > 0) {
      const filtered = allColors.filter(c => metadata.availableColors.includes(c.name) || metadata.availableColors.includes(c.id));
      if (filtered.length > 0) return filtered;
    }
    return allColors;
  }, [metadata, allColors]);



  const selectedColorObj = useMemo(() => {
    return availableColors.find(c => c.name === color) || availableColors[0] || allColors[0];
  }, [color, availableColors, allColors]);

  const selectedStyleObj = useMemo(() => {
    return HAIR_STYLES.find(s => s.name === style) || HAIR_STYLES[0];
  }, [style]);
  
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [unit, setUnit] = useState<string>('unit');

  // Slider State
  const slideImages = useMemo(() => {
    if (metadata && (metadata.modelImage || (metadata.productImages && metadata.productImages.length > 0))) {
      const arr = [];
      if (metadata.modelImage) arr.push(metadata.modelImage);
      if (metadata.productImages) arr.push(...metadata.productImages);
      return arr;
    }
    if (images && images.length > 0) return images;
    if (DEFAULT_PRODUCT_IMAGES[title]) return DEFAULT_PRODUCT_IMAGES[title];
    return [img];
  }, [images, title, img, metadata]);

  // Unified Gallery Views (Product Slides + Active Texture + Active Shade)
  const [activeView, setActiveView] = useState<{ type: 'product'; index: number } | { type: 'style' } | { type: 'color' }>({ type: 'product', index: 0 });
  const [isPaused, setIsPaused] = useState(false);

  const allGalleryItems = useMemo(() => {
    const items: Array<{
      id: string;
      src: string;
      alt: string;
      tag: string;
      title: string;
      subtitle: string;
      type: 'product' | 'style' | 'color';
      index?: number;
    }> = slideImages.map((src, idx) => ({
      id: `product-${idx}`,
      src,
      alt: `${title} view ${idx + 1}`,
      tag: 'Product View',
      title: title,
      subtitle: idx === 0 ? 'Model Showcase' : 'Product Detail',
      type: 'product',
      index: idx
    }));

    if (selectedStyleObj) {
      items.push({
        id: `style-${selectedStyleObj.id}`,
        src: selectedStyleObj.image,
        alt: `${selectedStyleObj.name} hair texture`,
        tag: 'Texture View',
        title: selectedStyleObj.name,
        subtitle: `${selectedStyleObj.pattern} • ${selectedStyleObj.curlType}`,
        type: 'style'
      });
    }

    if (selectedColorObj) {
      items.push({
        id: `color-${selectedColorObj.id}`,
        src: selectedColorObj.image,
        alt: `${selectedColorObj.name} hair shade`,
        tag: 'Shade View',
        title: selectedColorObj.name,
        subtitle: `${selectedColorObj.category} • 100% Remy`,
        type: 'color'
      });
    }

    return items;
  }, [slideImages, title, selectedStyleObj, selectedColorObj]);

  const currentItemIndex = useMemo(() => {
    if (activeView.type === 'style') {
      const idx = allGalleryItems.findIndex(item => item.type === 'style');
      return idx !== -1 ? idx : 0;
    }
    if (activeView.type === 'color') {
      const idx = allGalleryItems.findIndex(item => item.type === 'color');
      return idx !== -1 ? idx : 0;
    }
    const idx = allGalleryItems.findIndex(item => item.type === 'product' && item.index === activeView.index);
    return idx !== -1 ? idx : 0;
  }, [activeView, allGalleryItems]);

  const currentDisplay = allGalleryItems[currentItemIndex] || allGalleryItems[0];

  const handlePrevSlide = () => {
    const nextIdx = (currentItemIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
    const item = allGalleryItems[nextIdx];
    if (item.type === 'product') {
      setActiveView({ type: 'product', index: item.index || 0 });
    } else {
      setActiveView({ type: item.type });
    }
  };

  const handleNextSlide = () => {
    const nextIdx = (currentItemIndex + 1) % allGalleryItems.length;
    const item = allGalleryItems[nextIdx];
    if (item.type === 'product') {
      setActiveView({ type: 'product', index: item.index || 0 });
    } else {
      setActiveView({ type: item.type });
    }
  };

  useEffect(() => {
    if (activeView.type !== 'product' || slideImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveView(prev => {
        if (prev.type !== 'product') return prev;
        return { type: 'product', index: (prev.index + 1) % slideImages.length };
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [slideImages.length, isPaused, activeView]);
  
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

    fetch('/api/colors')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.colors) && data.colors.length > 0) {
          setAllColors(data.colors);
        }
      })
      .catch(err => console.error("Could not load colors", err));

    fetch('/api/product-metadata')
      .then(res => res.json())
      .then(data => {
        if (data && data[title]) {
          setMetadata(data[title]);
        }
      })
      .catch(err => console.error("Could not load product metadata", err));
  }, [title]);

  const availableLengths = useMemo(() => {
    if (metadata && metadata.availableLengths && metadata.availableLengths.length > 0) return metadata.availableLengths;
    return LENGTHS;
  }, [metadata]);

  const availableWeights = useMemo(() => {
    if (metadata && metadata.availableWeights && metadata.availableWeights.length > 0) return metadata.availableWeights;
    return WEIGHTS;
  }, [metadata]);

  const availableStyles = useMemo(() => {
    if (metadata && metadata.availableStyles && metadata.availableStyles.length > 0) {
      return HAIR_STYLES.filter(s => metadata.availableStyles.includes(s.name));
    }
    return HAIR_STYLES;
  }, [metadata]);

  useEffect(() => {
    if (metadata) {
      if (metadata.availableLengths && metadata.availableLengths.length > 0 && !metadata.availableLengths.includes(length)) {
        setLength(metadata.availableLengths[0]);
      }
      if (metadata.availableWeights && metadata.availableWeights.length > 0 && !metadata.availableWeights.includes(weight)) {
        setWeight(metadata.availableWeights[0]);
      }
      if (metadata.availableStyles && metadata.availableStyles.length > 0 && !metadata.availableStyles.includes(style)) {
        setStyle(metadata.availableStyles[0]);
      }
      if (metadata.availableColors && metadata.availableColors.length > 0 && !metadata.availableColors.includes(color)) {
        setColor(metadata.availableColors[0]);
      }
    }
  }, [metadata, length, weight, style, color]);


  useEffect(() => {
    if (availableColors.length > 0 && !availableColors.some(c => c.name === color)) {
      setColor(availableColors[0].name);
    }
  }, [availableColors, color]);

  const currentColorObj = availableColors.find(c => c.name === color) || allColors.find(c => c.name === color) || SPECTRUM_COLORS[0];
  const currentColorCategory = currentColorObj ? currentColorObj.category : 'Unknown';

  const mults: Record<string, number> = {
    '50 Grams': 0.55,
    '100 Grams': 1.0,
    '150 Grams': 1.48,
    '200 Grams': 1.95
  };

  // Robust Pricing Lookup Hierarchy:
  // 1. Exact Color Name + Selected Weight (e.g. "Tape Extensions|16 Inches|Natural Straight|Frost|100 Grams")
  // 2. Color Category + Selected Weight (e.g. "Tape Extensions|16 Inches|Natural Straight|Blondes & Ash|100 Grams")
  // 3. Exact Color Name + 100g base price (with weight multiplier)
  // 4. Color Category + 100g base price (with weight multiplier)
  // 5. Legacy 4-part key with Color Name (with weight multiplier)
  // 6. Legacy 4-part key with Color Category (with weight multiplier)
  // 7. Fallback to any style defined for this product, length, and color/category
  let currentPrice: number | undefined = undefined;

  const keyColorWeight = `${title}|${length}|${style}|${color}|${weight}`;
  const keyCatWeight = `${title}|${length}|${style}|${currentColorCategory}|${weight}`;
  const keyColor100g = `${title}|${length}|${style}|${color}|100 Grams`;
  const keyCat100g = `${title}|${length}|${style}|${currentColorCategory}|100 Grams`;
  const keyColorLegacy = `${title}|${length}|${style}|${color}`;
  const keyCatLegacy = `${title}|${length}|${style}|${currentColorCategory}`;

  if (prices[keyColorWeight] !== undefined) {
    currentPrice = prices[keyColorWeight];
  } else if (prices[keyCatWeight] !== undefined) {
    currentPrice = prices[keyCatWeight];
  } else if (prices[keyColor100g] !== undefined) {
    currentPrice = Math.round(prices[keyColor100g] * (mults[weight] || 1.0));
  } else if (prices[keyCat100g] !== undefined) {
    currentPrice = Math.round(prices[keyCat100g] * (mults[weight] || 1.0));
  } else if (prices[keyColorLegacy] !== undefined) {
    currentPrice = Math.round(prices[keyColorLegacy] * (mults[weight] || 1.0));
  } else if (prices[keyCatLegacy] !== undefined) {
    currentPrice = Math.round(prices[keyCatLegacy] * (mults[weight] || 1.0));
  } else {
    // Style fallback: check if another style has a price defined for this length, color/category, and weight
    for (const altStyle of STYLE_NAMES) {
      if (altStyle === style) continue;
      const altColorWeight = `${title}|${length}|${altStyle}|${color}|${weight}`;
      const altCatWeight = `${title}|${length}|${altStyle}|${currentColorCategory}|${weight}`;
      const altColor100g = `${title}|${length}|${altStyle}|${color}|100 Grams`;
      const altCat100g = `${title}|${length}|${altStyle}|${currentColorCategory}|100 Grams`;
      
      if (prices[altColorWeight] !== undefined) {
        currentPrice = prices[altColorWeight];
        break;
      } else if (prices[altCatWeight] !== undefined) {
        currentPrice = prices[altCatWeight];
        break;
      } else if (prices[altColor100g] !== undefined) {
        currentPrice = Math.round(prices[altColor100g] * (mults[weight] || 1.0));
        break;
      } else if (prices[altCat100g] !== undefined) {
        currentPrice = Math.round(prices[altCat100g] * (mults[weight] || 1.0));
        break;
      }
    }
  }

  const formattedPriceWithUnit = currentPrice !== undefined ? formatPrice(currentPrice, unit) : '';

  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleAddToGlobalEnquiry = () => {
    // Select authentic physical product photo instead of model image
    const productThumbnail = getProductThumbnail(title, slideImages[1] || slideImages[0]);
    addItem({
      productId: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      image: productThumbnail,
      length,
      weight,
      style,
      color,
      unit,
      quantity,
      basePriceUsd: currentPrice
    });
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 2200);
    openGlobalEnquiry(true);
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))', color: 'var(--color-primary)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>✨</span> 100% Virgin Temple Remy Hair • Direct Factory Floor
          </div>
        </div>

        {/* Main 2-Column Luxury Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start' }}>
          
          {/* Left Column: Sticky Luxury Product Gallery (desktop only) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="product-gallery-sticky"
          >
                     {/* Main Interactive Product Image Frame */}
            <div 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '4 / 4.8', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                boxShadow: '0 20px 45px rgba(0,0,0,0.08)', 
                marginBottom: '16px', 
                background: '#f8f6f4',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentDisplay.id + currentDisplay.src}
                  src={currentDisplay.src} 
                  alt={currentDisplay.alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: PRODUCT_IMAGE_CONFIG[currentDisplay.src]?.position || 'center center',
                    transform: PRODUCT_IMAGE_CONFIG[currentDisplay.src]?.transform || undefined
                  }} 
                />
              </AnimatePresence>

              {/* Floating Quality / Mode Tag */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                padding: '6px 14px',
                borderRadius: '30px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1a1a1a',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 2,
                border: '1px solid rgba(255,255,255,0.7)',
                maxWidth: 'calc(100% - 110px)'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  flexShrink: 0,
                  background: currentDisplay.type === 'color' ? '#d97706' : (currentDisplay.type === 'style' ? '#7c3aed' : 'var(--color-primary)') 
                }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentDisplay.type === 'color' && `Shade: ${currentDisplay.title}`}
                  {currentDisplay.type === 'style' && `Texture: ${currentDisplay.title}`}
                  {currentDisplay.type === 'product' && 'Factory Direct • Export Grade'}
                </span>
                {currentDisplay.type !== 'product' && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    ({currentDisplay.subtitle})
                  </span>
                )}
              </div>

              {/* Quick Return to Product Photos Button */}
              {currentDisplay.type !== 'product' && (
                <button
                  type="button"
                  onClick={() => setActiveView({ type: 'product', index: 0 })}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    zIndex: 2,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>↩</span> View Product Photos
                </button>
              )}

              {/* Slide Counter Indicator */}
              {allGalleryItems.length > 1 && (
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
                  fontWeight: 600,
                  zIndex: 2
                }}>
                  {currentItemIndex + 1} / {allGalleryItems.length}
                </div>
              )}

              {/* Gallery Overlay Prev / Next Buttons */}
              {allGalleryItems.length > 1 && (
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
                  <button 
                    onClick={handlePrevSlide}
                    aria-label="Previous image"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.92)', 
                      color: '#222', 
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: 'none',
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
                      background: 'rgba(255,255,255,0.92)', 
                      color: '#222', 
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails Strip */}
            {allGalleryItems.length > 1 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${allGalleryItems.length}, 1fr)`, 
                gap: '8px', 
                marginBottom: '22px' 
              }}>
                {allGalleryItems.map((item, idx) => {
                  const isActive = idx === currentItemIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.type === 'product') {
                          setActiveView({ type: 'product', index: item.index || 0 });
                        } else {
                          setActiveView({ type: item.type });
                        }
                      }}
                      title={item.title}
                      style={{
                        position: 'relative',
                        height: '74px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: isActive ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.08)',
                        padding: 0,
                        cursor: 'pointer',
                        background: '#fff',
                        opacity: isActive ? 1 : 0.65,
                        transform: isActive ? 'scale(1.03)' : 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px var(--color-primary-glow, rgba(143, 35, 43, 0.22))' : 'none'
                      }}
                    >
                      <img src={item.src} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {item.type !== 'product' && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: item.type === 'color' ? 'rgba(217, 119, 6, 0.9)' : 'rgba(124, 58, 237, 0.9)',
                          color: '#fff',
                          fontSize: '8.5px',
                          fontWeight: 800,
                          textAlign: 'center',
                          padding: '2px 0',
                          letterSpacing: '0.4px',
                          textTransform: 'uppercase'
                        }}>
                          {item.type === 'color' ? 'Shade' : 'Texture'}
                        </div>
                      )}
                    </button>
                  );
                })}
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
                <span style={{ fontSize: '0.72rem', color: '#777' }}>DHL • FedEx • UPS • Aramex</span>
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
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', color: 'var(--color-primary)', lineHeight: 1 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, marginRight: '2px' }}>
                      {symbols ? (symbols[currency] || '$') : '$'}
                    </span>
                    <span style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>
                      {convertPrice(currentPrice)}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500, marginLeft: '3px', opacity: 0.85 }}>
                      / {unit}
                    </span>
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
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {length}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableLengths.map((len: string) => {
                  const isSelected = len === length;
                  return (
                    <button 
                      key={len} 
                      onClick={() => setLength(len)}
                      style={{ 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0', 
                        background: isSelected ? 'var(--color-primary-subtle, rgba(143, 35, 43, 0.05))' : '#ffffff',
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
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {weight}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableWeights.map((w: string) => {
                  const isSelected = w === weight;
                  return (
                    <button 
                      key={w} 
                      onClick={() => setWeight(w)}
                      style={{ 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0', 
                        background: isSelected ? 'var(--color-primary-subtle, rgba(143, 35, 43, 0.05))' : '#ffffff',
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
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
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
                {availableStyles.map(st => {
                  const isSelected = st.name === style;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setStyle(st.name);
                        setActiveView({ type: 'style' });
                      }}
                      type="button"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '8px 6px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'var(--color-primary-subtle, rgba(143, 35, 43, 0.04))' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 3px 10px var(--color-primary-glow, rgba(143, 35, 43, 0.12))' : 'none',
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
            </div>

            {/* 4. Color Options */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#222' }}>4. Select Premium Shade</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                  {selectedColorObj.name}
                </span>
              </div>

              {/* Color Swatches Grid with In-Place Zoom on Selected Swatch */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', 
                gap: '10px', 
                maxHeight: '260px', 
                overflowY: 'auto', 
                padding: '14px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: '#fafafa'
              }}>
                {availableColors.map(c => {
                  const isSelected = c.name === color;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setColor(c.name);
                        setActiveView({ type: 'color' });
                      }}
                      title={c.name}
                      aria-label={c.name}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 2px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? '#ffffff' : '#fff',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: isSelected ? 20 : 1,
                        transform: isSelected ? 'scale(1.24)' : 'scale(1)',
                        transformOrigin: 'center center',
                        boxShadow: isSelected 
                          ? '0 12px 26px -2px var(--color-primary-glow, rgba(143, 35, 43, 0.42)), 0 0 0 2px var(--color-primary)' 
                          : '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, border-color 0.2s ease'
                      }}
                    >
                      {/* Selected In-Place Checkmark Badge */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          zIndex: 25
                        }}>
                          ✓
                        </div>
                      )}

                      {/* Swatch Hair Image with In-Place Zoom */}
                      <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        border: isSelected ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.08)', 
                        background: '#eee',
                        boxShadow: isSelected ? '0 0 0 1.5px var(--color-primary)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        <img 
                          src={c.image} 
                          alt={c.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transform: isSelected ? 'scale(1.35)' : 'scale(1)',
                            transition: 'transform 0.28s ease'
                          }} 
                        />
                      </div>

                      {/* Swatch Label */}
                      <span style={{ 
                        fontSize: isSelected ? '0.73rem' : '0.68rem', 
                        fontWeight: isSelected ? 800 : 500, 
                        color: isSelected ? 'var(--color-primary)' : '#444',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        maxWidth: '68px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
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

            {/* Luxury Order Summary & Wholesale Enquiry Action Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, #fffdfa 0%, #fbf5ed 60%, #f6ebdc 100%)', 
              border: '1.5px solid rgba(197, 148, 58, 0.35)', 
              borderRadius: '20px', 
              padding: 'clamp(20px, 3.5vw, 26px)', 
              boxShadow: '0 10px 32px rgba(197, 148, 58, 0.09), inset 0 1px 0 rgba(255,255,255,0.95)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ 
                  fontSize: '0.74rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.2px', 
                  color: '#8c7662', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c5943a' }}></span>
                  Wholesale Summary
                </span>
                <span style={{ 
                  fontSize: '0.74rem', 
                  background: '#dcfce7', 
                  color: '#15803d', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }}></span>
                  Factory In-Stock
                </span>
              </div>

              {/* Active Selection Ribbon */}
              <div style={{ 
                background: '#ffffff', 
                border: '1px solid #ebdcd0', 
                borderRadius: '12px', 
                padding: '12px 14px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--color-primary)', flexShrink: 0 }}>
                  <img src={selectedColorObj.image} alt={selectedColorObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '3px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    <span>{length}</span>
                    <span>•</span>
                    <span>{weight}</span>
                    <span>•</span>
                    <span>{style}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{color}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(197, 148, 58, 0.2)' }}>
                <span style={{ fontSize: '0.86rem', color: '#555', fontWeight: 600 }}>Order Quantity ({unit}s):</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ffffff', borderRadius: '8px', border: '1px solid #d9d0c7', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ border: 'none', background: 'transparent', color: '#444', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a' }}>
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ border: 'none', background: 'transparent', color: '#444', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(197, 148, 58, 0.2)' }}>
                <div>
                  <span style={{ fontSize: '0.86rem', color: '#666', fontWeight: 600 }}>Estimated Rate:</span>
                  {quantity > 1 && (
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#888' }}>
                      ({quantity} x {symbols ? (symbols[currency] || '$') : '$'}{convertPrice(currentPrice || 0)} / {unit})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {symbols ? (symbols[currency] || '$') : '$'}
                  </span>
                  <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {currentPrice !== undefined ? convertPrice(currentPrice * quantity) : 'Quote'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginLeft: '3px' }}>
                    ({currency})
                  </span>
                </div>
              </div>

              {/* Primary Enquiry Action */}
              <button 
                type="button"
                onClick={handleAddToGlobalEnquiry}
                className="wholesale-cta-btn" 
                style={{ 
                  width: '100%', 
                  padding: '16px 22px', 
                  fontSize: '0.98rem', 
                  fontWeight: 600,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  borderRadius: '14px',
                  background: isJustAdded 
                    ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                    : 'linear-gradient(135deg, #1c1917 0%, #110f0e 100%)',
                  color: '#ffffff',
                  border: isJustAdded 
                    ? '1.5px solid rgba(74, 222, 128, 0.6)'
                    : '1.5px solid rgba(197, 148, 58, 0.45)',
                  boxShadow: isJustAdded
                    ? '0 8px 24px rgba(22, 101, 52, 0.35)'
                    : '0 8px 26px rgba(18, 16, 14, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  textTransform: 'none',
                  letterSpacing: '0.2px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isJustAdded ? 'rgba(74, 222, 128, 0.2)' : 'rgba(197, 148, 58, 0.2)',
                  border: isJustAdded ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(197, 148, 58, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isJustAdded ? (
                    <Check size={15} strokeWidth={2.6} color="#4ade80" />
                  ) : (
                    <Plus size={15} strokeWidth={2.6} color="#e5c07b" />
                  )}
                </div>

                <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.2px' }}>
                  {isJustAdded ? 'Added to Wholesale Enquiry!' : 'Add to Wholesale Enquiry'}
                </span>

                {totalCount > 0 && !isJustAdded && (
                  <div style={{
                    marginLeft: 'auto',
                    background: 'rgba(212, 175, 55, 0.18)',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    color: '#f5e6c8',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <ShoppingBag size={12} strokeWidth={2.4} color="#e5c07b" />
                    <span>{totalCount} in portfolio</span>
                  </div>
                )}
              </button>


            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Specific focal positions and zoom optimizations so key product features (clips, seams, tabs, tips) are always centered without cropping
const PRODUCT_IMAGE_CONFIG: Record<string, { position: string; transform?: string }> = {
  // ClipOn Extensions - focus on clips & weft track
  "/images/products/clipon.webp": { position: "center 22%" },
  "/images/products/clipon2.jpeg": { position: "28% 28%" },
  "/images/products/clipon3.jpeg": { position: "center 22%" },

  // Genius Wefts - focus on ultra-flat seamless seam
  "/images/products/geniusweft.jpg": { position: "center 42%" },
  "/images/products/geniusweft2.webp": { position: "center 40%" },
  "/images/products/geniusweft3.jpeg": { position: "center 68%" },
  "/images/products/geniusweft4.webp": { position: "center 18%" },

  // Tape Extensions - focus on polyurethane tape tabs
  "/images/products/tapeextensions.webp": { position: "center 56%", transform: "scale(1.08)" },
  "/images/products/tapeextensions2.webp": { position: "18% 45%", transform: "scale(1.08)" },

  // K-Tips - focus on keratin tipped bonds
  "/images/products/KTip.jpg": { position: "22% 50%", transform: "scale(1.1)" },
  "/images/products/KTip2.png": { position: "center 20%", transform: "scale(1.08)" },
  "/images/products/KTip.webp": { position: "25% 25%" },

  // Butterfly Wefts - focus on signature perforated butterfly band
  "/images/products/butterflyweft.jpg": { position: "58% 36%", transform: "scale(1.1)" },
  "/images/products/butterflyweft2.jpg": { position: "30% 65%" },
  "/images/products/butterflyweft3.webp": { position: "45% 65%" },
};

export default function MiniImageSlider({ 
  images, 
  style, 
  className,
  imgStyle,
  onImageChange
}: { 
  images: string[]; 
  style?: React.CSSProperties; 
  className?: string;
  imgStyle?: React.CSSProperties;
  onImageChange?: (src: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const changeSlide = (next: number) => {
    setPrevIndex(currentIndex);
    setCurrentIndex(next);
    if (onImageChange) onImageChange(images[next]);
    setTimeout(() => {
      setPrevIndex(null);
    }, 800);
  };

  useEffect(() => {
    if (images.length <= 1) {
      if (images.length === 1 && onImageChange) onImageChange(images[0]);
      return;
    }
    const timer = setInterval(() => {
      changeSlide((currentIndex + 1) % images.length);
    }, 3000);
    // Initial call
    if (onImageChange) onImageChange(images[currentIndex]);
    return () => clearInterval(timer);
  }, [images, onImageChange, currentIndex]);

  if (!images || images.length === 0) return null;

  const currentSrc = images[currentIndex];
  const config = PRODUCT_IMAGE_CONFIG[currentSrc] || { position: "center center" };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      {images.map((src, index) => {
        const conf = PRODUCT_IMAGE_CONFIG[src] || { position: "center center" };
        return (
          <img
            key={src + index}
            src={src}
            alt="Product thumbnail"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: conf.position,
              transform: conf.transform || 'none',
              position: 'absolute', 
              top: 0, 
              left: 0,
              zIndex: currentIndex === index ? 1 : 0,
              pointerEvents: currentIndex === index ? 'auto' : 'none',
              opacity: currentIndex === index || prevIndex === index ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              ...imgStyle
            }}
          />
        );
      })}
    </div>
  );
}

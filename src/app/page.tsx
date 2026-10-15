"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TestimonialsSection from '../components/TestimonialsSection';

const heroProducts = [
  { 
    name: "ClipOn", 
    fullName: "ClipOn Extensions",
    tagline: "Instant Length & Volume",
    badge: "✨ 100% Temple",
    price: "CA$ 76",
    slideIdx: 1, 
    link: "/seamless-clipon-extensions", 
    thumb: "/images/products/clipon.webp",
    image: "/images/products/clipon.webp",
    objectPosition: "center 22%"
  },
  { 
    name: "Genius Wefts", 
    fullName: "Genius Wefts",
    tagline: "Ultra-Flat Seamless Lay",
    badge: "✨ Bestseller",
    price: "CA$ 84",
    slideIdx: 2, 
    link: "/genius-wefts", 
    thumb: "/images/products/geniusweft.jpg",
    image: "/images/products/geniusweft.jpg",
    objectPosition: "center 42%"
  },
  { 
    name: "Tape Extensions", 
    fullName: "Tape Extensions",
    tagline: "Discreet & Featherlight",
    badge: "✨ Invisible",
    price: "CA$ 54",
    slideIdx: 3, 
    link: "/tape-extensions", 
    thumb: "/images/products/tapeextensions.webp",
    image: "/images/products/tapeextensions.webp",
    objectPosition: "center center"
  },
  { 
    name: "K Tips", 
    fullName: "K Tips Extensions",
    tagline: "Individual 360° Movement",
    badge: "✨ Italian Keratin",
    price: "CA$ 74",
    slideIdx: 4, 
    link: "/k-tips", 
    thumb: "/images/products/KTip2.png",
    image: "/images/products/KTip2.png",
    objectPosition: "center center"
  },
  { 
    name: "Butterfly Wefts", 
    fullName: "Butterfly Wefts",
    tagline: "Max Volume & Comfort",
    badge: "✨ Innovation",
    price: "CA$ 76",
    slideIdx: 5, 
    link: "/butterfly-wefts", 
    thumb: "/images/products/butterflyweft.jpg",
    image: "/images/products/butterflyweft.jpg",
    objectPosition: "58% 36%"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [pinnedBalloon, setPinnedBalloon] = useState<string | null>(null);
  const activeProduct = heroProducts.find(p => p.slideIdx === currentSlide) || heroProducts[0];
  const heroSlides = [
    { 
      img: "/images/hero_general_1.jpg", 
      align: "flex-end", 
      textAlign: "right" as const,
      title: "Natural Indian Human Hair Extension Manufacturer & Exporter",
      subtitle: "Ethically sourced, high-quality, chemical-free extensions known for strength, luster, and durability.",
      link: null,
      buttonText: null,
      titleNowrap: false,
      productImg: "/images/products/geniusweft.jpg",
      badge: "✨ 100% TEMPLE",
      thumbs: null
    },
    { 
      img: "/images/seamless_clipon.jpg", 
      align: "flex-start", 
      textAlign: "left" as const,
      title: "ClipOn Extensions",
      subtitle: "Instantly add length and volume with our easy-to-use, damage-free clip-on extensions.",
      link: "/seamless-clipon-extensions",
      buttonText: "View Product",
      titleNowrap: true,
      productImg: "/images/products/clipon.webp",
      badge: "✨ 100% TEMPLE",
      thumbs: ["/images/products/clipon.webp", "/images/products/clipon2.jpeg", "/images/products/clipon3.jpeg"]
    },
    { 
      img: "/images/genius_wefts_light.jpg", 
      align: "flex-end", 
      textAlign: "right" as const,
      title: "Genius Wefts",
      subtitle: "Ultra-thin and flexible wefts that lay perfectly flat against your scalp for seamless blending.",
      link: "/genius-wefts",
      buttonText: "View Product",
      titleNowrap: true,
      productImg: "/images/products/geniusweft.jpg",
      badge: "✨ BESTSELLER",
      thumbs: ["/images/products/geniusweft.jpg", "/images/products/geniusweft2.webp", "/images/products/geniusweft3.jpeg", "/images/products/geniusweft4.webp"]
    },
    { 
      img: "/images/tape_extensions.jpg", 
      align: "flex-start", 
      textAlign: "left" as const,
      title: "Tape Extensions",
      subtitle: "Lightweight and discreet tape-ins that provide a natural, full-bodied look with long-lasting hold.",
      link: "/tape-extensions",
      buttonText: "View Product",
      titleNowrap: true,
      productImg: "/images/products/tapeextensions.webp",
      badge: "✨ INVISIBLE",
      thumbs: ["/images/products/tapeextensions.webp", "/images/products/tapeextensions2.webp"]
    },
    { 
      img: "/images/k_tips_light.jpg", 
      align: "flex-start", 
      textAlign: "left" as const,
      title: "K Tips",
      subtitle: "Premium keratin-tipped extensions for individual strand-by-strand application and natural movement.",
      link: "/k-tips",
      buttonText: "View Product",
      titleNowrap: true,
      productImg: "/images/products/KTip2.png",
      badge: "✨ ITALIAN KERATIN",
      thumbs: ["/images/products/KTip2.png", "/images/products/KTip.jpg"]
    },
    { 
      img: "/images/butterfly_wefts.jpg", 
      align: "flex-start", 
      textAlign: "left" as const,
      title: "Butterfly Wefts",
      subtitle: "Innovative weft design providing maximum volume with incredible comfort and durability.",
      link: "/butterfly-wefts",
      buttonText: "View Product",
      titleNowrap: true,
      productImg: "/images/products/butterflyweft.jpg",
      badge: "✨ INNOVATION",
      thumbs: ["/images/products/butterflyweft.jpg", "/images/products/butterflyweft2.jpg", "/images/products/butterflyweft3.webp"]
    },
    { 
      img: "/images/hero_general_2.jpg", 
      align: "flex-end", 
      textAlign: "right" as const,
      title: "Premium Indian Remy Hair Extensions",
      subtitle: "Experience the ultimate in luxury and seamless blending with our signature collection.",
      link: null,
      buttonText: null,
      titleNowrap: false,
      productImg: "/images/products/clipon.webp",
      badge: "✨ REMY LUXURY",
      thumbs: null
    }
  ];

  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isCategoryDrawerOpen || pinnedBalloon) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCategoryDrawerOpen, pinnedBalloon]);

  useEffect(() => {
    if (dockRef.current) {
      const activeItem = dockRef.current.querySelector('.hero-dock-item.active') as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryDrawerOpen(false);
        setPinnedBalloon(null);
      }
    };
    if (isCategoryDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryDrawerOpen]);

  // Click outside dock to close active balloon
  useEffect(() => {
    if (!pinnedBalloon) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.hero-dock-wrapper')) {
        setPinnedBalloon(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [pinnedBalloon]);

  const currentProductImg = heroSlides[currentSlide]?.productImg || activeProduct.image;
  const currentProductBadge = heroSlides[currentSlide]?.badge || activeProduct.badge;

  return (
    <>
      <style>{`
        /* Minimal custom styling for page specific components */
        .hero-section {
          height: calc(100vh - 80px);
          margin-top: 80px;
          position: relative;
          overflow: hidden;
          color: white;
          background: #111;
        }

        .hero-content-body {
          display: block;
        }

        .hero-card-product-img-wrap {
          display: none;
        }
        
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          z-index: 1;
        }
        
        .hero-content {
          position: absolute;
          z-index: 10;
          padding: 22px 26px;
          background: rgba(14, 14, 16, 0.52);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
          max-width: clamp(320px, 28vw, 440px);
          top: clamp(26px, 6vh, 60px);
        }

        .hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--color-accent-gold, #C5943A);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hero-title {
          font-size: clamp(1.7rem, 2.2vw, 2.2rem);
          margin-bottom: 8px;
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-size: clamp(0.84rem, 0.92vw, 0.92rem);
          font-family: var(--font-sans);
          opacity: 0.88;
          margin-bottom: 18px;
          line-height: 1.5;
          font-weight: 300;
        }

        .hero-content .btn-gold {
          padding: 9px 20px;
          font-size: 0.82rem;
          letter-spacing: 0.6px;
        }

        .section-title {
          text-align: center;
          font-size: 3rem;
          margin-bottom: 20px;
          color: var(--color-text);
        }

        .section-subtitle {
          text-align: center;
          font-family: var(--font-sans);
          color: var(--color-text-light);
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        .product-card {
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 350px;
          perspective: 1200px;
          -webkit-perspective: 1200px;
          overflow: hidden;
          background-color: #fbf8f5;
        }

        .product-image-flipper {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }

        .product-card:hover .product-image-flipper,
        .product-card.flipped .product-image-flipper {
          transform: rotateY(180deg);
        }

        .product-image-face {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .product-image-front {
          transform: rotateY(0deg) translateZ(1px);
          z-index: 2;
        }

        .product-image-back {
          transform: rotateY(180deg) translateZ(1px);
          z-index: 1;
        }


        .product-info {
          padding: 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-grow: 1;
        }

        .product-info h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: var(--color-primary-dark);
        }

        .product-info p {
          color: var(--color-text-light);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        /* Sleek Luxury Hero Category Dock */
        .hero-dock-wrapper {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: min(92vw, 760px);
          width: auto;
        }

        .hero-dock {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(14, 14, 16, 0.68);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 40px;
          padding: 5px 8px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .hero-dock-item {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 30px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.22s ease;
          white-space: nowrap;
        }

        .hero-dock-item:hover,
        .hero-dock-item:focus-visible,
        .hero-dock-item.balloon-open {
          z-index: 95;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .hero-dock-item.active {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          border-color: var(--color-accent-gold, #C5943A);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        /* Luxury Hover & Persistent Click Balloon Popover */
        .dock-balloon {
          position: absolute;
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%) translateY(10px) scale(0.9);
          transform-origin: bottom center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          z-index: 120;
          transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.28s cubic-bezier(0.34, 1.45, 0.64, 1),
                      visibility 0.24s ease;
          background: linear-gradient(168deg, rgba(28, 28, 34, 0.98) 0%, rgba(14, 14, 18, 0.99) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(212, 175, 55, 0.45);
          border-radius: 18px;
          padding: 9px 9px 11px 9px;
          box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.85),
                      0 0 28px rgba(212, 175, 55, 0.25),
                      inset 0 1px 0 rgba(255, 255, 255, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px;
          text-decoration: none;
          cursor: pointer;
        }

        /* Invisible bridge area between balloon and dock item so cursor travel is continuous */
        .dock-balloon-bridge {
          position: absolute;
          top: 100%;
          left: -15px;
          right: -15px;
          height: 22px;
          background: transparent;
          pointer-events: auto;
        }

        /* Persistent Click Active & Hover States */
        .dock-balloon.is-active,
        .hero-dock-item:hover .dock-balloon,
        .hero-dock-item:focus-within .dock-balloon {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translateX(-50%) translateY(0) scale(1) !important;
        }

        /* Balloon downward arrow pointer */
        .dock-balloon::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 9px 0 9px;
          border-style: solid;
          border-color: rgba(212, 175, 55, 0.55) transparent transparent transparent;
          pointer-events: none;
        }

        .dock-balloon::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 9px 8px 0 8px;
          border-style: solid;
          border-color: #141418 transparent transparent transparent;
          pointer-events: none;
        }

        /* First item alignment to avoid left screen edge clipping */
        .hero-dock-item:first-child .dock-balloon {
          left: 0;
          transform: translateX(0) translateY(10px) scale(0.9);
        }
        .hero-dock-item:first-child .dock-balloon.is-active,
        .hero-dock-item:first-child:hover .dock-balloon,
        .hero-dock-item:first-child:focus-within .dock-balloon {
          transform: translateX(0) translateY(0) scale(1) !important;
        }
        .hero-dock-item:first-child .dock-balloon::before,
        .hero-dock-item:first-child .dock-balloon::after {
          left: 28px;
          transform: none;
        }

        /* Last item alignment to avoid right screen edge clipping */
        .hero-dock-item:last-child .dock-balloon {
          left: auto;
          right: 0;
          transform: translateX(0) translateY(10px) scale(0.9);
        }
        .hero-dock-item:last-child .dock-balloon.is-active,
        .hero-dock-item:last-child:hover .dock-balloon,
        .hero-dock-item:last-child:focus-within .dock-balloon {
          transform: translateX(0) translateY(0) scale(1) !important;
        }
        .hero-dock-item:last-child .dock-balloon::before,
        .hero-dock-item:last-child .dock-balloon::after {
          left: auto;
          right: 30px;
          transform: none;
        }

        /* Subtle close button on pinned balloon */
        .dock-balloon-close {
          position: absolute;
          top: 6px;
          right: 6px;
          z-index: 5;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.85);
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
          line-height: 1;
        }

        .dock-balloon-close:hover {
          background: rgba(212, 175, 55, 0.85);
          color: #000000;
          border-color: #ffd88a;
          transform: scale(1.1);
        }

        /* Frame inside the balloon */
        .dock-balloon-frame {
          width: 182px;
          height: 160px;
          border-radius: 14px;
          overflow: hidden;
          background: #fbf9f6;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Diagonal light shimmer sweep on hover */
        .dock-balloon-frame::after {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          transform: skewX(-20deg);
          transition: left 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          z-index: 2;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-dock-item:hover .dock-balloon-frame::after,
          .dock-balloon:hover .dock-balloon-frame::after {
            left: 170%;
          }
        }

        .dock-balloon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-dock-item:hover .dock-balloon-img,
          .dock-balloon:hover .dock-balloon-img {
            transform: scale(1.08);
          }
        }

        /* Floating luxury chip over the frame */
        .dock-balloon-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 3;
          background: rgba(14, 14, 18, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.55);
          border-radius: 20px;
          padding: 3px 8px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: var(--color-accent-gold, #C5943A);
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        }

        .dock-balloon-caption {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
          width: 100%;
          padding: 0 4px;
        }

        .dock-balloon-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.3px;
          line-height: 1.2;
          white-space: nowrap;
        }

        .dock-balloon-tagline {
          font-size: 0.67rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.2;
          white-space: nowrap;
          font-weight: 400;
        }

        .dock-balloon-footer {
          margin-top: 7px;
          padding-top: 7px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-left: 2px;
          padding-right: 2px;
        }

        .dock-balloon-price {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.68rem;
        }

        .dock-balloon-price strong {
          color: var(--color-accent-gold, #C5943A);
          font-weight: 700;
          font-size: 0.8rem;
          margin-left: 2px;
        }

        .dock-balloon-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #ffffff;
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          background: rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: all 0.22s ease;
        }

        .dock-balloon-arrow {
          transition: transform 0.22s ease;
          display: inline-block;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-dock-item:hover .dock-balloon-cta,
          .dock-balloon:hover .dock-balloon-cta {
            background: rgba(212, 175, 55, 0.3);
            border-color: rgba(212, 175, 55, 0.7);
            color: #ffd88a;
          }
          .hero-dock-item:hover .dock-balloon-arrow,
          .dock-balloon:hover .dock-balloon-arrow {
            transform: translateX(3px);
          }
        }

        @media (max-width: 768px) {
          .dock-balloon {
            display: none !important;
          }
        }

        .dock-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: #fff;
          display: flex;
        }

        .dock-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dock-indicator {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-accent-gold, #C5943A);
          margin-left: 2px;
        }

        /* Mobile Category Bar (Hidden on desktop by default) */
        .mobile-category-bar-wrapper {
          display: none;
        }

        /* Slide-up Visual Drawer / Sheet Base Styles */
        .category-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 4, 8, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9998;
        }

        .category-drawer-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 88vh;
          background: linear-gradient(180deg, #1c1c24 0%, #101015 100%);
          border-radius: 28px 28px 0 0;
          border-top: 1px solid rgba(212, 175, 55, 0.45);
          box-shadow: 0 -24px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding-bottom: max(18px, env(safe-area-inset-bottom));
        }

        .drawer-handle-bar {
          width: 44px;
          height: 4px;
          background: rgba(255, 255, 255, 0.28);
          border-radius: 3px;
          margin: 10px auto 4px auto;
          cursor: pointer;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drawer-eyebrow {
          font-size: 0.65rem;
          color: var(--color-accent-gold, #C5943A);
          letter-spacing: 1.2px;
          font-weight: 700;
          display: block;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .drawer-title {
          font-size: 1.24rem;
          font-family: var(--font-serif);
          color: #ffffff;
          margin: 0;
          font-weight: 500;
          letter-spacing: -0.3px;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .drawer-close-btn:active {
          transform: scale(0.92);
          background: rgba(255, 255, 255, 0.2);
        }

        .drawer-body {
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          max-height: calc(88vh - 190px);
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .drawer-product-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          width: 100%;
          color: inherit;
        }

        .drawer-product-card:active {
          transform: scale(0.98);
        }

        .drawer-product-card.active {
          background: rgba(212, 175, 55, 0.14);
          border-color: rgba(212, 175, 55, 0.7);
          box-shadow: 0 4px 22px rgba(197, 148, 58, 0.22);
        }

        .drawer-card-img-wrap {
          width: 58px;
          height: 58px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          background: #202026;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .drawer-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .drawer-card-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .drawer-card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .drawer-card-badge {
          font-size: 0.62rem;
          color: var(--color-accent-gold, #C5943A);
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .drawer-card-price {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 500;
        }

        .drawer-card-title {
          font-size: 0.94rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.25;
        }

        .drawer-card-tagline {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.64);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drawer-card-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding-left: 6px;
        }

        .drawer-active-pill {
          font-size: 0.68rem;
          font-weight: 700;
          color: #111;
          background: var(--color-accent-gold, #C5943A);
          padding: 4px 9px;
          border-radius: 12px;
          letter-spacing: 0.4px;
        }

        .drawer-select-arrow {
          color: rgba(255, 255, 255, 0.45);
          font-size: 1.15rem;
          font-weight: 600;
        }

        .drawer-footer {
          padding: 10px 18px 6px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
        }

        .drawer-cta-btn {
          width: 100%;
          text-align: center;
          justify-content: center;
          padding: 11px 18px;
          font-size: 0.86rem;
          border-radius: 22px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 4px 18px rgba(197, 148, 58, 0.35);
        }

        @media (max-width: 992px) {
          .hero-section {
            height: calc(100vh - 70px);
            min-height: 560px;
            margin-top: 70px;
          }

          .hero-bg {
            object-position: center 16% !important;
          }

          .hero-content {
            left: 14px !important;
            right: 14px !important;
            margin: 0 auto !important;
            max-width: min(440px, calc(100% - 28px)) !important;
            top: auto !important;
            bottom: 74px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 14px !important;
            gap: 6px !important;
            border-radius: 18px !important;
            min-height: auto !important;
            background: rgba(14, 14, 16, 0.78) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            border: 1px solid rgba(255, 255, 255, 0.16) !important;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45) !important;
            z-index: 10 !important;
          }

          .hero-eyebrow {
            font-size: 0.62rem !important;
            letter-spacing: 0.8px !important;
            margin-bottom: 2px !important;
          }

          .hero-content-body {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 12px !important;
            width: 100% !important;
          }

          .hero-card-product-img-wrap {
            display: flex !important;
            flex-direction: column !important;
            width: 78px !important;
            height: 78px !important;
            flex-shrink: 0 !important;
            border-radius: 14px !important;
            overflow: hidden !important;
            border: 1.5px solid rgba(212, 175, 55, 0.55) !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45), 0 0 14px rgba(197, 148, 58, 0.28) !important;
            background: #18181e !important;
            position: relative !important;
          }

          .hero-card-product-img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
          }

          .hero-card-img-badge {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: rgba(14, 14, 18, 0.9) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            font-size: 0.48rem !important;
            color: #ffd88a !important;
            text-align: center !important;
            padding: 2px 2px !important;
            font-weight: 700 !important;
            letter-spacing: 0.3px !important;
            border-top: 1px solid rgba(212, 175, 55, 0.4) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .hero-text-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
            flex: 1 !important;
            min-width: 0 !important;
            text-align: left !important;
          }

          .hero-title { 
            font-size: clamp(0.96rem, 3.8vw, 1.22rem) !important; 
            margin-bottom: 2px !important; 
            line-height: 1.22 !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            font-weight: 600 !important;
            color: #ffffff !important;
          }

          .hero-subtitle { 
            font-size: 0.74rem !important; 
            margin-bottom: 4px !important; 
            line-height: 1.38 !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            opacity: 0.88 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }

          .hero-cta-btn {
            flex-shrink: 0 !important;
            padding: 7px 16px !important;
            font-size: 0.78rem !important;
            letter-spacing: 0.4px !important;
            border-radius: 20px !important;
            white-space: nowrap !important;
            height: auto !important;
            display: inline-flex !important;
            align-self: flex-start !important;
          }

          /* Hide desktop horizontal dock on mobile */
          .desktop-only-dock {
            display: none !important;
          }

          /* Show mobile category bar contained in frame */
          .mobile-category-bar-wrapper {
            display: flex !important;
            position: absolute !important;
            bottom: 14px !important;
            left: 14px !important;
            right: 14px !important;
            margin: 0 auto !important;
            max-width: min(440px, calc(100% - 28px)) !important;
            z-index: 25 !important;
            box-sizing: border-box !important;
          }

          .mobile-category-bar {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            background: rgba(14, 14, 18, 0.9);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 35px;
            padding: 6px 8px 6px 10px;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06);
            cursor: pointer;
            outline: none;
            color: inherit;
            transition: transform 0.18s ease, border-color 0.2s ease, background 0.2s ease;
          }

          .mobile-category-bar:active {
            transform: scale(0.98);
            border-color: rgba(212, 175, 55, 0.55);
          }

          .mobile-bar-product-info {
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 0;
            flex: 1;
            text-align: left;
          }

          .mobile-bar-thumb {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            border: 1.5px solid var(--color-accent-gold, #C5943A);
            box-shadow: 0 0 10px rgba(197, 148, 58, 0.35);
            flex-shrink: 0;
            background: #222;
          }

          .mobile-bar-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-bar-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-width: 0;
          }

          .mobile-bar-badge {
            font-size: 0.62rem;
            color: var(--color-accent-gold, #C5943A);
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.1;
          }

          .mobile-bar-name {
            font-size: 0.85rem;
            color: #ffffff;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
          }

          .mobile-bar-trigger {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(197, 148, 58, 0.42) 100%);
            border: 1px solid rgba(212, 175, 55, 0.65);
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.74rem;
            font-weight: 600;
            letter-spacing: 0.2px;
            flex-shrink: 0;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
          }

          .mobile-bar-chevron {
            stroke: #ffd88a;
            transition: transform 0.2s ease;
          }

          .dock-balloon {
            display: none !important;
          }

          .section-title { font-size: clamp(1.75rem, 5vw, 2.2rem) !important; }
        }

        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      
      <section id="hero-section" className="hero-section" style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentSlide}
            src={heroSlides[currentSlide].img} 
            alt="Hair background" 
            className="hero-bg" 
            style={{ filter: 'brightness(1)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <motion.div 
            key={currentSlide}
            className="hero-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
            style={{ 
              textAlign: heroSlides[currentSlide].textAlign, 
              left: heroSlides[currentSlide].align === 'flex-start' ? 'clamp(20px, 5vw, 60px)' : 'auto',
              right: heroSlides[currentSlide].align === 'flex-end' ? 'clamp(20px, 5vw, 60px)' : 'auto',
            }}
          >
            <div className="hero-eyebrow">
              <span>✨</span>
              <span>100% TEMPLE REMY HAIR • DIRECT FACTORY FLOOR</span>
            </div>
            
            <div className="hero-content-body">
              {/* Product Image Frame (Displayed on Mobile) */}
              <div className="hero-card-product-img-wrap">
                <img 
                  src={currentProductImg} 
                  alt={heroSlides[currentSlide].title} 
                  className="hero-card-product-img"
                />
                <span className="hero-card-img-badge">
                  {currentProductBadge}
                </span>
              </div>

              <div className="hero-text-content">
                <h1 className="hero-title">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
                {heroSlides[currentSlide].buttonText && heroSlides[currentSlide].link && (
                  <a href={heroSlides[currentSlide].link} className="btn-gold hero-cta-btn">
                    {heroSlides[currentSlide].buttonText} →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Sleek Luxury Category Dock (Desktop > 992px) */}
        <div className="hero-dock-wrapper desktop-only-dock">
          <nav ref={dockRef} className="hero-dock" aria-label="Hero Product Categories">
            {heroProducts.map((prod) => {
              const isActive = currentSlide === prod.slideIdx;
              const isPinned = pinnedBalloon === prod.name;
              return (
                <div
                  key={prod.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setCurrentSlide(prod.slideIdx);
                    setPinnedBalloon(prev => prev === prod.name ? null : prod.name);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCurrentSlide(prod.slideIdx);
                      setPinnedBalloon(prev => prev === prod.name ? null : prod.name);
                    }
                  }}
                  className={`hero-dock-item ${isActive ? 'active' : ''} ${isPinned ? 'balloon-open' : ''}`}
                  title={`View ${prod.name}`}
                >
                  {/* Luxury Balloon Popover with Bigger Product Image Frame */}
                  <Link
                    href={prod.link}
                    className={`dock-balloon ${isPinned ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label={`View ${prod.fullName} product details`}
                  >
                    <div className="dock-balloon-bridge" />
                    {isPinned && (
                      <button 
                        type="button" 
                        className="dock-balloon-close" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPinnedBalloon(null);
                        }}
                        aria-label="Close popup"
                        title="Close popup"
                      >
                        ✕
                      </button>
                    )}
                    <div className="dock-balloon-frame">
                      <span className="dock-balloon-badge">{prod.badge}</span>
                      <img 
                        src={prod.image} 
                        alt={prod.fullName} 
                        className="dock-balloon-img"
                        style={{ objectPosition: prod.objectPosition }}
                      />
                    </div>
                    <div className="dock-balloon-caption">
                      <span className="dock-balloon-title">{prod.fullName}</span>
                      <span className="dock-balloon-tagline">{prod.tagline}</span>
                    </div>
                    <div className="dock-balloon-footer">
                      <span className="dock-balloon-price">from <strong>{prod.price}</strong></span>
                      <span className="dock-balloon-cta">
                        <span>Quick View</span>
                        <span className="dock-balloon-arrow">→</span>
                      </span>
                    </div>
                  </Link>

                  <span className="dock-thumb">
                    <img src={prod.thumb} alt={prod.name} />
                  </span>
                  <span>{prod.name}</span>
                  {isActive && <span className="dock-indicator" />}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Mobile Compact Category Bar (<= 992px) - Contained in Frame */}
        <div className="mobile-category-bar-wrapper">
          <button 
            type="button"
            className="mobile-category-bar"
            onClick={() => setIsCategoryDrawerOpen(true)}
            aria-label="Open product categories drawer"
            aria-expanded={isCategoryDrawerOpen}
          >
            <div className="mobile-bar-product-info">
              <span className="mobile-bar-thumb">
                <img src={activeProduct.thumb} alt={activeProduct.name} />
              </span>
              <div className="mobile-bar-text">
                <span className="mobile-bar-badge">{activeProduct.badge}</span>
                <span className="mobile-bar-name">{activeProduct.fullName}</span>
              </div>
            </div>
            
            <div className="mobile-bar-trigger">
              <span>All Categories (5)</span>
              <svg className="mobile-bar-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile Slide-Up Visual Category Drawer / Sheet */}
        <AnimatePresence>
          {isCategoryDrawerOpen && (
            <>
              <motion.div 
                className="category-drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setIsCategoryDrawerOpen(false)}
              />
              <motion.div 
                className="category-drawer-sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
              >
                <div className="drawer-handle-bar" onClick={() => setIsCategoryDrawerOpen(false)} />
                
                <div className="drawer-header">
                  <div>
                    <span className="drawer-eyebrow">✨ 100% TEMPLE RAW INDIAN HAIR</span>
                    <h2 className="drawer-title">Explore Categories</h2>
                  </div>
                  <button 
                    type="button" 
                    className="drawer-close-btn"
                    onClick={() => setIsCategoryDrawerOpen(false)}
                    aria-label="Close categories drawer"
                  >
                    ✕
                  </button>
                </div>

                <div className="drawer-body">
                  {heroProducts.map((prod) => {
                    const isActive = currentSlide === prod.slideIdx;
                    return (
                      <div 
                        key={prod.name}
                        className={`drawer-product-card ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentSlide(prod.slideIdx);
                          setIsCategoryDrawerOpen(false);
                        }}
                      >
                        <div className="drawer-card-img-wrap">
                          <img 
                            src={prod.image} 
                            alt={prod.fullName} 
                            style={{ objectPosition: prod.objectPosition }}
                          />
                        </div>
                        
                        <div className="drawer-card-details">
                          <div className="drawer-card-header-row">
                            <span className="drawer-card-badge">{prod.badge}</span>
                            <span className="drawer-card-price">from {prod.price}</span>
                          </div>
                          <h3 className="drawer-card-title">{prod.fullName}</h3>
                          <p className="drawer-card-tagline">{prod.tagline}</p>
                        </div>

                        <div className="drawer-card-action">
                          {isActive ? (
                            <span className="drawer-active-pill">Active</span>
                          ) : (
                            <span className="drawer-select-arrow">→</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="drawer-footer">
                  <Link 
                    href={activeProduct.link}
                    className="btn-gold drawer-cta-btn"
                    onClick={() => setIsCategoryDrawerOpen(false)}
                  >
                    View {activeProduct.name} Details →
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      <section id="products-section" className="section" style={{ background: '#fcfcfc' }}>
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Premium Products
          </motion.h2>
          <p className="section-subtitle">Discover our exclusive range of 100% natural human hair extensions, carefully crafted to blend seamlessly with your natural hair.</p>
          
          <div className="product-grid">
            {[
              { 
                title: "ClipOn Extensions", 
                desc: "Instantly add length and volume with our easy-to-use, damage-free clip-on extensions.", 
                img: "/images/seamless_clipon.jpg",
                hoverImg: "/images/products/clipon.webp",
                link: "/seamless-clipon-extensions",
                objectPosition: "center center",
                hoverObjectPosition: "center 22%"
              },
              { 
                title: "Genius Wefts", 
                desc: "Ultra-thin and flexible wefts that lay perfectly flat against your scalp for seamless blending.", 
                img: "/images/genius_wefts_light.jpg",
                hoverImg: "/images/products/geniusweft.jpg",
                link: "/genius-wefts",
                objectPosition: "center center",
                hoverObjectPosition: "center 42%"
              },
              { 
                title: "Tape Extensions", 
                desc: "Lightweight and discreet tape-ins that provide a natural, full-bodied look with long-lasting hold.", 
                img: "/images/tape_extensions.jpg",
                hoverImg: "/images/products/tapeextensions.webp",
                link: "/tape-extensions",
                objectPosition: "center center",
                hoverObjectPosition: "center 56%"
              },
              { 
                title: "K Tips", 
                desc: "Premium keratin-tipped extensions for individual strand-by-strand application and natural movement.", 
                img: "/images/k_tips_light.jpg",
                hoverImg: "/images/products/KTip2.png",
                link: "/k-tips",
                objectPosition: "center center",
                hoverObjectPosition: "center 25%"
              },
              { 
                title: "Butterfly Wefts", 
                desc: "Innovative weft design providing maximum volume with incredible comfort and durability.", 
                img: "/images/butterfly_wefts.jpg",
                hoverImg: "/images/products/butterflyweft.jpg",
                link: "/butterfly-wefts",
                objectPosition: "center center",
                hoverObjectPosition: "58% 36%"
              }
            ].map((product, idx) => (
              <motion.div 
                className="product-card" 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={product.link} style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}>
                  <div className="product-image-container">
                    <div className="product-image-flipper">
                      {/* Front Face: Model View (Default) */}
                      <div className="product-image-face product-image-front">
                        <img 
                          src={product.img} 
                          alt={product.title} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            objectPosition: product.objectPosition || 'center' 
                          }} 
                        />
                      </div>

                      {/* Back Face: Product Package (On Hover) */}
                      <div className="product-image-face product-image-back">
                        <img 
                          src={product.hoverImg} 
                          alt={`${product.title} product package`} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            objectPosition: product.hoverObjectPosition || 'center' 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="product-info">
                  <Link href={product.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{product.title}</h3>
                  </Link>
                  <p>{product.desc}</p>
                  <a 
                    href={`https://wa.me/919871171978?text=${encodeURIComponent(`Hello hair&nature, I am inquiring about ${product.title}.`)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-outline" 
                    style={{ display: 'inline-block', fontSize: '0.85rem', padding: '10px 20px' }}
                  >
                    Inquire Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <TestimonialsSection />

      <section id="about-section" className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(30px, 5vw, 60px)', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/caucasian_models_hair.jpg" alt="Our Hair Extensions Collection - Three Models" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', objectFit: 'cover' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Our Heritage & Commitment</h2>
              <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '16px' }}>
                At hair&nature®, we pride ourselves on delivering the finest, ethically sourced Remy human hair directly from the temples of India to you.
              </p>
              <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '26px' }}>
                With decades of expertise as a manufacturer and exporter, we ensure every strand undergoes rigorous quality checks. Our extensions remain chemical-free, retaining their natural strength, bounce, and luster for unparalleled longevity.
              </p>
              <a href="/#contact-section" className="btn-gold">Get in Touch</a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

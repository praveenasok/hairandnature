"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
      thumbs: null
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

        .hero-dock-item:hover {
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

        @media (max-width: 992px) {
          .hero-dock-wrapper {
            bottom: 14px;
            width: calc(100% - 24px);
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: flex-start;
          }
          .hero-dock-wrapper::-webkit-scrollbar {
            display: none;
          }
          .hero-dock {
            width: max-content;
            padding: 4px 6px;
            gap: 4px;
          }
          .hero-dock-item {
            padding: 6px 11px;
            font-size: 0.76rem;
            gap: 6px;
          }
          .dock-thumb {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 992px) {
          .hero-section {
            height: calc(100vh - 70px);
            min-height: 540px;
            margin-top: 70px;
          }
          .hero-bg {
            object-position: center 6% !important;
          }
          .hero-content {
            left: 14px !important;
            right: 14px !important;
            margin: 0 auto !important;
            max-width: min(440px, calc(100% - 28px)) !important;
            top: auto !important;
            bottom: 110px !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 8px 12px 8px 10px !important;
            gap: 10px !important;
            border-radius: 18px !important;
            min-height: 52px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
          }
          .hero-thumb-wrapper {
            flex-shrink: 0;
            display: flex;
            align-items: center;
          }
          .hero-slider-thumb {
            width: 38px !important;
            height: 38px !important;
          }
          .hero-text-content {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 10px !important;
            flex: 1 !important;
            min-width: 0 !important;
            text-align: left !important;
          }
          .hero-title-group {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .hero-title { 
            font-size: 0.98rem !important; 
            margin-bottom: 1px !important; 
            line-height: 1.15 !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600 !important;
          }
          .hero-subtitle { 
            font-size: 0.72rem !important; 
            margin-bottom: 0 !important; 
            line-height: 1.25 !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            opacity: 0.82;
          }
          .hero-cta-btn {
            flex-shrink: 0 !important;
            padding: 6px 14px !important;
            font-size: 0.74rem !important;
            letter-spacing: 0.4px !important;
            border-radius: 20px !important;
            white-space: nowrap !important;
            height: 32px !important;
          }
          .hero-product-cards-wrapper {
            bottom: 12px !important;
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
          </motion.div>
        </AnimatePresence>
        
        {/* Sleek Minimalist Luxury Category Dock */}
        <div className="hero-dock-wrapper">
          <nav className="hero-dock" aria-label="Hero Product Categories">
            {[
              { name: "ClipOn", slideIdx: 1, link: "/seamless-clipon-extensions", thumb: "/images/products/clipon.webp" },
              { name: "Genius Wefts", slideIdx: 2, link: "/genius-wefts", thumb: "/images/products/geniusweft.jpg" },
              { name: "Tape Extensions", slideIdx: 3, link: "/tape-extensions", thumb: "/images/products/tapeextensions.webp" },
              { name: "K Tips", slideIdx: 4, link: "/k-tips", thumb: "/images/products/KTip2.png" },
              { name: "Butterfly Wefts", slideIdx: 5, link: "/butterfly-wefts", thumb: "/images/products/butterflyweft.jpg" }
            ].map(prod => {
              const isActive = currentSlide === prod.slideIdx;
              return (
                <button
                  key={prod.name}
                  onClick={() => setCurrentSlide(prod.slideIdx)}
                  className={`hero-dock-item ${isActive ? 'active' : ''}`}
                  title={`View ${prod.name}`}
                >
                  <span className="dock-thumb">
                    <img src={prod.thumb} alt={prod.name} />
                  </span>
                  <span>{prod.name}</span>
                  {isActive && <span className="dock-indicator" />}
                </button>
              );
            })}
          </nav>
        </div>
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

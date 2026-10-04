"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import MiniImageSlider from '../components/MiniImageSlider';
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
          padding: 24px 28px;
          background: rgba(15, 15, 15, 0.52);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 24px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
          max-width: clamp(320px, 26vw, 420px);
          top: clamp(24px, 5.5vh, 55px);
        }

        .hero-title {
          font-size: clamp(1.8rem, 2.3vw, 2.3rem);
          margin-bottom: 10px;
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-size: clamp(0.85rem, 0.95vw, 0.95rem);
          font-family: var(--font-sans);
          opacity: 0.9;
          margin-bottom: 20px;
          line-height: 1.5;
          font-weight: 300;
        }

        .hero-content .btn-gold {
          padding: 10px 24px;
          font-size: 0.85rem;
          letter-spacing: 0.8px;
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
          transform: translateY(-10px);
        }

        .product-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
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

        .hero-product-cards-wrapper {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: calc(100% - 48px);
          max-width: 1280px;
          padding: 0 8px 8px 0;
        }

        .hero-product-cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          width: 100%;
        }

        .mobile-clone {
          display: none !important;
        }

        .hero-card-container {
          position: relative;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          min-width: 0;
        }

        .hero-card-container:hover {
          transform: translateY(-4px);
        }

        .hero-card {
          flex-grow: 1;
          background: rgba(18, 18, 18, 0.58);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 16px;
          padding: 10px 14px;
          text-align: center;
          color: white;
          min-height: 68px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          -webkit-mask-image: radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), transparent 25px, black 26px);
          mask-image: radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), transparent 25px, black 26px);
        }

        .hero-card .eyebrow {
          font-size: clamp(0.78rem, 0.9vw, 0.86rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          opacity: 0.92;
          margin-bottom: 3px;
          line-height: 1.15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .hero-card h3 {
          font-size: clamp(1.14rem, 1.35vw, 1.32rem);
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .arrow-btn {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2.5px solid #e45258;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        
        .hero-card-container:hover .arrow-btn {
          transform: scale(1.12);
          box-shadow: 0 6px 16px rgba(228, 82, 88, 0.55);
          border-color: white;
        }

        .arrow-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .hero-slider-thumb {
          width: 90px;
          height: 90px;
        }

        @media (max-width: 992px) {
          .hero-product-cards-wrapper {
            bottom: 18px;
            width: 100%;
            left: 0;
            transform: none;
            padding: 0 0 10px 0;
            overflow: hidden;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hero-product-cards-wrapper::-webkit-scrollbar {
            display: none;
          }
          .hero-product-cards {
            display: flex;
            grid-template-columns: none;
            justify-content: flex-start;
            width: max-content;
            gap: 12px;
            animation: marquee 25s linear infinite;
            padding: 0 16px 10px 16px;
          }
          .hero-card-container {
            width: 185px;
            flex-shrink: 0;
          }
          .hero-card {
            min-height: 64px;
            padding: 8px 12px;
          }
          .hero-card .eyebrow {
            font-size: 0.74rem;
          }
          .hero-card h3 {
            font-size: 1.05rem;
          }
          .mobile-clone {
            display: flex !important;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 7px)); }
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
              display: 'flex',
              flexDirection: heroSlides[currentSlide].align === 'flex-start' ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            {heroSlides[currentSlide].thumbs && (
              <div className="hero-thumb-wrapper" style={{ flexShrink: 0 }}>
                <MiniImageSlider 
                  images={heroSlides[currentSlide].thumbs!} 
                  className="hero-slider-thumb"
                  style={{ borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', boxShadow: '0 8px 25px rgba(0,0,0,0.35)' }}
                />
              </div>
            )}
            <div className="hero-text-content">
              <div className="hero-title-group">
                <h1 className="hero-title">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
              </div>
              {heroSlides[currentSlide].buttonText && heroSlides[currentSlide].link && (
                <a href={heroSlides[currentSlide].link} className="btn-gold hero-cta-btn">{heroSlides[currentSlide].buttonText}</a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="hero-product-cards-wrapper">
          <div className="hero-product-cards">
            {[
              { title: "ClipOn Extensions", link: "/seamless-clipon-extensions", eyebrow: "Instantly Add Volume", iconImgs: ["/images/products/clipon.webp", "/images/products/clipon2.jpeg", "/images/products/clipon3.jpeg"] },
              { title: "Genius Wefts", link: "/genius-wefts", eyebrow: "Ultra-Thin & Flexible", iconImgs: ["/images/products/geniusweft.jpg", "/images/products/geniusweft2.webp", "/images/products/geniusweft3.jpeg", "/images/products/geniusweft4.webp"] },
              { title: "Tape Extensions", link: "/tape-extensions", eyebrow: "Lightweight & Discreet", iconImgs: ["/images/products/tapeextensions.webp", "/images/products/tapeextensions2.webp"] },
              { title: "K Tips", link: "/k-tips", eyebrow: "Premium Keratin", iconImgs: ["/images/products/KTip2.png", "/images/products/KTip.jpg"] },
              { title: "Butterfly Wefts", link: "/butterfly-wefts", eyebrow: "Maximum Volume", iconImgs: ["/images/products/butterflyweft.jpg", "/images/products/butterflyweft2.jpg", "/images/products/butterflyweft3.webp"] }
            ].map(prod => (
              <a href={prod.link} className="hero-card-container" key={prod.title}>
                <div className="hero-card">
                  <span className="eyebrow">{prod.eyebrow}</span>
                  <h3>{prod.title}</h3>
                </div>
                <div className="arrow-btn">
                  <MiniImageSlider images={prod.iconImgs} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
              </a>
            ))}
            {/* Clone for seamless infinite scrolling */}
            {[
              { title: "ClipOn Extensions", link: "/seamless-clipon-extensions", eyebrow: "Instantly Add Volume", iconImgs: ["/images/products/clipon.webp", "/images/products/clipon2.jpeg", "/images/products/clipon3.jpeg"] },
              { title: "Genius Wefts", link: "/genius-wefts", eyebrow: "Ultra-Thin & Flexible", iconImgs: ["/images/products/geniusweft.jpg", "/images/products/geniusweft2.webp", "/images/products/geniusweft3.jpeg", "/images/products/geniusweft4.webp"] },
              { title: "Tape Extensions", link: "/tape-extensions", eyebrow: "Lightweight & Discreet", iconImgs: ["/images/products/tapeextensions.webp", "/images/products/tapeextensions2.webp"] },
              { title: "K Tips", link: "/k-tips", eyebrow: "Premium Keratin", iconImgs: ["/images/products/KTip2.png", "/images/products/KTip.jpg"] },
              { title: "Butterfly Wefts", link: "/butterfly-wefts", eyebrow: "Maximum Volume", iconImgs: ["/images/products/butterflyweft.jpg", "/images/products/butterflyweft2.jpg", "/images/products/butterflyweft3.webp"] }
            ].map(prod => (
              <a href={prod.link} className="hero-card-container mobile-clone" key={prod.title + "-clone"}>
                <div className="hero-card">
                  <span className="eyebrow">{prod.eyebrow}</span>
                  <h3>{prod.title}</h3>
                </div>
                <div className="arrow-btn">
                  <MiniImageSlider images={prod.iconImgs} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
              </a>
            ))}
          </div>
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
              { title: "ClipOn Extensions", desc: "Instantly add length and volume with our easy-to-use, damage-free clip-on extensions.", img: "/images/seamless_clipon.jpg" },
              { title: "Genius Wefts", desc: "Ultra-thin and flexible wefts that lay perfectly flat against your scalp for seamless blending.", img: "/images/genius_wefts_light.jpg" },
              { title: "Tape Extensions", desc: "Lightweight and discreet tape-ins that provide a natural, full-bodied look with long-lasting hold.", img: "/images/tape_extensions.jpg" },
              { title: "K Tips", desc: "Premium keratin-tipped extensions for individual strand-by-strand application and natural movement.", img: "/images/k_tips_light.jpg" },
              { title: "Butterfly Wefts", desc: "Innovative weft design providing maximum volume with incredible comfort and durability.", img: "/images/butterfly_wefts.jpg" }
            ].map((product, idx) => (
              <motion.div 
                className="product-card" 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.1 }}
              >
                <img src={product.img} alt={product.title} className="product-image" />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.desc}</p>
                  <a href="https://wa.me/919871171978" target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-block', fontSize: '0.85rem', padding: '10px 20px' }}>Inquire Now</a>
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

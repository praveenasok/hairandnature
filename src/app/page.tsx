"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import MiniImageSlider from '../components/MiniImageSlider';

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
      align: "flex-end", 
      textAlign: "right" as const,
      title: "K Tips",
      subtitle: "Premium keratin-tipped extensions for individual strand-by-strand application and natural movement.",
      link: "/k-tips",
      buttonText: "View Product",
      titleNowrap: true,
      thumbs: ["/images/products/KTip.webp", "/images/products/KTip.jpg", "/images/products/KTip2.png"]
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
          display: flex;
          align-items: center;
          padding: 0 8%;
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
          position: relative;
          z-index: 2;
          padding: 30px 40px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 24px;
        }

        .hero-title {
          font-size: 3rem;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          font-family: var(--font-sans);
          opacity: 0.9;
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 300;
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
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 90%;
          max-width: 1200px;
        }

        .hero-product-cards {
          display: flex;
          gap: 20px;
          justify-content: center;
          width: 100%;
        }

        .mobile-clone {
          display: none !important;
        }

        .hero-card-container {
          position: relative;
          flex: 1;
          max-width: 280px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
        }

        .hero-card-container:hover {
          transform: translateY(-5px);
        }

        .hero-card {
          flex-grow: 1;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 20px 10px;
          text-align: center;
          color: white;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          -webkit-mask-image: radial-gradient(circle at calc(100% - 15px) calc(100% - 15px), transparent 30px, black 31px);
          mask-image: radial-gradient(circle at calc(100% - 15px) calc(100% - 15px), transparent 30px, black 31px);
        }

        .hero-card .eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          opacity: 0.9;
          margin-bottom: 6px;
        }

        .hero-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .arrow-btn {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 3px solid #c43b40;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        
        .hero-card-container:hover .arrow-btn {
          transform: scale(1.1);
          box-shadow: 0 6px 15px rgba(196, 59, 64, 0.5);
          border-color: white;
        }

        .arrow-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .hero-slider-thumb {
          width: 120px;
          height: 120px;
        }

        @media (max-width: 900px) {
          .hero-product-cards-wrapper {
            bottom: 30px;
            width: 100%;
            left: 0;
            transform: none;
            overflow: hidden;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hero-product-cards-wrapper::-webkit-scrollbar {
            display: none;
          }
          .hero-product-cards {
            justify-content: flex-start;
            width: max-content;
            animation: marquee 25s linear infinite;
            padding-bottom: 20px;
          }
          .mobile-clone {
            display: flex !important;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 10px)); }
          }
          .hero-card {
            min-width: 180px;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            left: 5% !important;
            right: 5% !important;
            max-width: 90% !important;
            flex-direction: column !important;
            text-align: center !important;
            padding: 15px 15px !important;
            gap: 10px !important;
            top: auto !important;
            bottom: 200px !important;
          }
          .hero-slider-thumb {
            width: 70px !important;
            height: 70px !important;
          }
          .hero-title { font-size: 1.5rem !important; margin-bottom: 5px !important; }
          .hero-subtitle { display: none !important; }
          .section-title { font-size: 2.2rem; }
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
            initial={{ opacity: 0, x: heroSlides[currentSlide].align === 'flex-start' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: heroSlides[currentSlide].align === 'flex-start' ? -30 : 30 }}
            transition={{ duration: 0.8 }}
            style={{ 
              zIndex: 10, 
              textAlign: heroSlides[currentSlide].textAlign, 
              maxWidth: '680px',
              position: 'absolute',
              left: heroSlides[currentSlide].align === 'flex-start' ? '8%' : 'auto',
              right: heroSlides[currentSlide].align === 'flex-end' ? '8%' : 'auto',
              display: 'flex',
              flexDirection: heroSlides[currentSlide].align === 'flex-start' ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: '35px'
            }}
          >
            {heroSlides[currentSlide].thumbs && (
              <div style={{ flexShrink: 0 }}>
                <MiniImageSlider 
                  images={heroSlides[currentSlide].thumbs!} 
                  className="hero-slider-thumb"
                  style={{ borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                />
              </div>
            )}
            <div>
              <h1 className="hero-title" style={{ margin: '0 0 15px 0' }}>
                {heroSlides[currentSlide].title}
              </h1>
              <p className="hero-subtitle" style={{ margin: '0 0 25px 0' }}>{heroSlides[currentSlide].subtitle}</p>
              {heroSlides[currentSlide].buttonText && heroSlides[currentSlide].link && (
                <a href={heroSlides[currentSlide].link} className="btn-gold">{heroSlides[currentSlide].buttonText}</a>
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
              { title: "K Tips", link: "/k-tips", eyebrow: "Premium Keratin", iconImgs: ["/images/products/KTip.webp", "/images/products/KTip.jpg", "/images/products/KTip2.png"] },
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
              { title: "K Tips", link: "/k-tips", eyebrow: "Premium Keratin", iconImgs: ["/images/products/KTip.webp", "/images/products/KTip.jpg", "/images/products/KTip2.png"] },
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

      <section id="about-section" className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/hair_bun.png" alt="About us" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title" style={{ textAlign: 'left' }}>Our Heritage & Commitment</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '20px' }}>
                At hair&nature®, we pride ourselves on delivering the finest, ethically sourced Remy human hair directly from the temples of India to you.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '30px' }}>
                With decades of expertise as a manufacturer and exporter, we ensure every strand undergoes rigorous quality checks. Our extensions remain chemical-free, retaining their natural strength, bounce, and luster for unparalleled longevity.
              </p>
              <a href="#contact-section" className="btn-gold">Get in Touch</a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

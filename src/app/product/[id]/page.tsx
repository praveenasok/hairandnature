"use client";

import { useParams } from 'next/navigation';
import { products } from '../../../data/products';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [description, setDescription] = useState(product?.description || "");
  const [unit, setUnit] = useState(product?.unit || "piece");
  const { formatPrice, currency } = useCurrency();

  useEffect(() => {
    if (product) {
      fetch('/api/descriptions')
        .then(res => res.json())
        .then(data => {
          if (data && data[product.name]) {
            setDescription(data[product.name]);
          }
        })
        .catch(err => console.error("Error loading descriptions", err));

      fetch('/api/units')
        .then(res => res.json())
        .then(data => {
          if (data && data[product.name]) {
            setUnit(data[product.name]);
          }
        })
        .catch(err => console.error("Error loading units", err));
    }
  }, [product]);

  if (!product) {
    return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><h2>Product not found.</h2></div>;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price })
      });
      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Hair & Nature",
        description: `Purchase of ${product.name}`,
        image: "/logo.svg",
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#AF3644"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed to initialize.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Support multiple images per product for slider
  const productImages: Record<string, string[]> = {
    "hair-bun": ["/images/new_hair_bun.png", "/images/hair_bun.png"],
    "hair-highlights": ["/images/new_hair_highlights.png", "/images/hair_highlights.png"],
    "flatclip-ponytail": ["/images/new_flatclip_ponytail.png", "/images/flatclip_ponytail.png"],
    "clutch-bun": ["/images/clutch_bun.png"],
    "single-clip-patch": ["/images/single_clip_patch.png"]
  };

  const images = (id && productImages[id as string]) ? productImages[id as string] : [product.image];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ paddingTop: 'clamp(90px, 12vh, 120px)', paddingBottom: 'clamp(40px, 8vh, 80px)', backgroundColor: 'var(--color-white)', minHeight: '80vh' }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
          <a href="/" style={{ color: '#888' }}>Home</a>
          <span>/</span>
          <a href="/shop" style={{ color: '#888' }}>Shop</a>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div className="flex-row-mobile-stack" style={{ alignItems: 'flex-start', gap: 'clamp(30px, 5vw, 60px)' }}>
          
          {/* Left: Product Hero Image Slider */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ flex: '1 1 360px', minWidth: 0, width: '100%' }}
          >
            {/* Main Slider Viewport */}
            <div style={{ position: 'relative', width: '100%', height: 'clamp(380px, 50vh, 520px)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', background: '#fafafa', marginBottom: '14px' }}>
              <img 
                key={currentSlide}
                src={images[currentSlide]} 
                alt={`${product.name} - view ${currentSlide + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }} 
              />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', color: '#222', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % images.length)}
                    aria-label="Next image"
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', color: '#222', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: idx === currentSlide ? '2px solid var(--color-primary)' : '1px solid #ddd',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#fff',
                      opacity: idx === currentSlide ? 1 : 0.65
                    }}
                  >
                    <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Details & Purchase */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: '1 1 340px', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div style={{ display: 'inline-block', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, width: 'fit-content', marginBottom: '12px' }}>
              DIY Ready-to-Wear Collection
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-primary)', marginBottom: '10px', lineHeight: 1.15 }}>{product.name}</h1>
            <p style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 700, marginBottom: '15px', color: 'var(--color-primary)' }}>
              {formatPrice(product.price, unit)}
            </p>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', opacity: 0.85, lineHeight: 1.6, marginBottom: 'clamp(24px, 4vw, 36px)', color: '#444' }}>{description}</p>
            
            <button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="btn" 
              style={{ fontSize: 'clamp(1rem, 3vw, 1.15rem)', padding: '14px 28px', width: '100%' }}
            >
              {isProcessing ? 'Processing...' : 'Buy Now'}
            </button>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '12px', textAlign: 'center' }}>Secure checkout via Razorpay</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

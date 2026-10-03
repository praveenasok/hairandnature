"use client";

import { useParams } from 'next/navigation';
import { products } from '../../../data/products';
import Script from 'next/script';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatPrice, currency } = useCurrency();

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

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ paddingTop: 'clamp(90px, 12vh, 120px)', paddingBottom: 'clamp(40px, 8vh, 80px)', backgroundColor: 'var(--color-white)', minHeight: '80vh' }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container">
        <div className="flex-row-mobile-stack">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ flex: '1 1 320px', minWidth: 0, width: '100%' }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', objectFit: 'cover' }} 
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: '1 1 320px', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-primary)', marginBottom: '10px', lineHeight: 1.15 }}>{product.name}</h1>
            <p style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 700, marginBottom: '15px', color: 'var(--color-primary)' }}>
              {formatPrice(product.price, product.unit || 'unit')}
            </p>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', opacity: 0.8, lineHeight: 1.6, marginBottom: 'clamp(24px, 4vw, 36px)' }}>{product.description}</p>
            
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

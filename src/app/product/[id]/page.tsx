"use client";

import { useParams } from 'next/navigation';
import { products } from '../../../data/products';
import Script from 'next/script';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [isProcessing, setIsProcessing] = useState(false);

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
      style={{ padding: '50px 0', backgroundColor: 'var(--color-white)', minHeight: '80vh' }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container">
        <div className="flex-row-mobile-stack">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ flex: '1 1 400px' }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '20px' }}>₹{product.price}</p>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '40px' }}>{product.description}</p>
            
            <button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="btn" 
              style={{ fontSize: '1.2rem', padding: '15px 30px', width: '100%', maxWidth: '100%' }}
            >
              {isProcessing ? 'Processing...' : 'Buy Now'}
            </button>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '15px', textAlign: 'center' }}>Secure checkout via Razorpay</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

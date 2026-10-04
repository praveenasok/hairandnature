"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageSquareText } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

export default function GlobalEnquiryFloatingButton() {
  const { totalCount, setIsOpen, items } = useEnquiry();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9998 }}>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: totalCount > 0 
            ? 'linear-gradient(135deg, var(--color-primary) 0%, #b83238 100%)' 
            : 'linear-gradient(135deg, #1f1d1b 0%, #2a2522 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50px',
          padding: '12px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '0.2px'
        }}
      >
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {totalCount > 0 ? <ShoppingBag size={18} /> : <MessageSquareText size={18} />}
          {totalCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ffffff',
              color: 'var(--color-primary)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              {totalCount}
            </span>
          )}
        </span>
        <span>
          {totalCount > 0 
            ? `Global Enquiry (${totalCount})` 
            : 'Global Enquiries'}
        </span>
      </motion.button>
    </div>
  );
}

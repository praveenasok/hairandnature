"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

export default function GlobalEnquiryFloatingButton() {
  const { totalCount, setIsOpen, sendGeneralEnquiry } = useEnquiry();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`global-enquiry-floating-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <motion.button
        className="global-enquiry-floating-btn"
        onClick={() => {
          if (totalCount > 0) {
            setIsOpen(true);
          } else {
            sendGeneralEnquiry();
          }
        }}
        title={totalCount > 0 ? "Review Wholesale Enquiry Portfolio" : "Send General Wholesale Enquiry"}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        style={{
          background: totalCount > 0 
            ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 60%, var(--color-accent-gold) 100%)' 
            : 'linear-gradient(135deg, #1f1b1a 0%, #2b2523 100%)',
          color: '#ffffff',
          border: totalCount > 0 
            ? '1.5px solid rgba(255,255,255,0.35)' 
            : '1px solid rgba(197, 148, 58, 0.45)',
          borderRadius: '50px',
          padding: '11px 18px',
          boxShadow: totalCount > 0 
            ? '0 10px 28px var(--color-primary-glow, rgba(0,0,0,0.35)), 0 0 0 1px rgba(255,255,255,0.2)' 
            : '0 8px 24px rgba(0,0,0,0.22)',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          cursor: 'pointer',
          fontSize: '0.84rem',
          fontWeight: 700,
          letterSpacing: '0.3px',
          backdropFilter: 'blur(8px)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease'
        }}
      >
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {totalCount > 0 ? (
            <ShoppingBag size={17} />
          ) : (
            <Sparkles size={16} color="var(--color-accent-gold, #dfb76c)" />
          )}

          {totalCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-9px',
              background: '#ffffff',
              color: 'var(--color-primary, #111)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 900,
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
            }}>
              {totalCount}
            </span>
          )}
        </span>

        <span>
          {totalCount > 0 
            ? `Enquiry Portfolio (${totalCount})` 
            : 'Wholesale Enquiry'}
        </span>
      </motion.button>
    </div>
  );
}

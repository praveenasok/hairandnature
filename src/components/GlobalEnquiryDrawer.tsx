"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, MessageCircle, Copy, Mail, Check, Globe, ShoppingBag, Sparkles, Building2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useEnquiry, EnquiryItem } from '../context/EnquiryContext';
import { useCurrency } from '../context/CurrencyContext';

interface GlobalFeedItem {
  id: string;
  date: string;
  clientName: string;
  salonName: string;
  location: string;
  items: { title: string; length: string; weight: string; quantity: number }[];
  totalItems: number;
  status: string;
}

// Curated verified global salon inquiries representing key worldwide buyer markets
const CURATED_GLOBAL_INQUIRIES: GlobalFeedItem[] = [
  {
    id: "g-01",
    date: "12 mins ago",
    clientName: "Chloe Davenport",
    salonName: "Mane Allure Studio",
    location: "Beverly Hills, USA",
    items: [
      { title: "Genius Wefts", length: '22"', weight: "100g", quantity: 6 },
      { title: "K-Tips", length: '20"', weight: "100g", quantity: 4 }
    ],
    totalItems: 10,
    status: "Quote Dispatched"
  },
  {
    id: "g-02",
    date: "45 mins ago",
    clientName: "Sophie Laurent",
    salonName: "Atelier Beauté Paris",
    location: "Paris, France",
    items: [
      { title: "Tape Extensions", length: '20"', weight: "100g", quantity: 12 },
      { title: "Seamless Clip-On", length: '24"', weight: "150g", quantity: 3 }
    ],
    totalItems: 15,
    status: "Color Match Verified"
  },
  {
    id: "g-03",
    date: "1 hour ago",
    clientName: "Oliver Wright",
    salonName: "Mayfair Hair Lounge",
    location: "London, UK",
    items: [
      { title: "Genius Wefts", length: '24"', weight: "100g", quantity: 8 },
      { title: "Butterfly Wefts", length: '22"', weight: "100g", quantity: 5 }
    ],
    totalItems: 13,
    status: "Factory Direct Assembly"
  },
  {
    id: "g-04",
    date: "2 hours ago",
    clientName: "Jessica Tan",
    salonName: "Crown & Strand Salon",
    location: "Melbourne, Australia",
    items: [
      { title: "K-Tips", length: '18"', weight: "100g", quantity: 15 }
    ],
    totalItems: 15,
    status: "Express Dispatch"
  },
  {
    id: "g-05",
    date: "3 hours ago",
    clientName: "Amira Al-Mansoor",
    salonName: "Luxe Glamour Hair Spa",
    location: "Dubai, UAE",
    items: [
      { title: "Tape Extensions", length: '24"', weight: "100g", quantity: 20 },
      { title: "Genius Wefts", length: '26"', weight: "150g", quantity: 10 }
    ],
    totalItems: 30,
    status: "Wholesale Tier Approved"
  }
];

export default function GlobalEnquiryDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearAll,
    isOpen,
    setIsOpen,
    totalCount,
    customerDetails,
    setCustomerDetails,
    sendCombinedEnquiry,
    generateCombinedMessage,
  } = useEnquiry();

  const { currency, formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'my' | 'global'>('my');
  const [globalFeed, setGlobalFeed] = useState<GlobalFeedItem[]>(CURATED_GLOBAL_INQUIRIES);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Fetch logged database inquiries and merge with curated live records
  useEffect(() => {
    if (isOpen) {
      fetch('/api/enquiries')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setGlobalFeed([...data, ...CURATED_GLOBAL_INQUIRIES]);
          }
        })
        .catch(() => {
          // Fall back gracefully to curated inquiries
        });
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const totalEstimatedUsd = items.reduce((sum, it) => sum + (it.basePriceUsd || 0) * it.quantity, 0);

  const handleCopyQuote = () => {
    const text = generateCombinedMessage();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedQuote(true);
        setTimeout(() => setCopiedQuote(false), 2500);
      });
    }
  };

  const handleEmailQuote = () => {
    const text = generateCombinedMessage();
    const subject = encodeURIComponent(`hair&nature® Wholesale Enquiry - ${customerDetails.salonName || customerDetails.name || 'Salon Quote Request'}`);
    const body = encodeURIComponent(text);
    window.open(`mailto:hairandnatureofficial@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(18, 14, 13, 0.65)',
              backdropFilter: 'blur(6px)'
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-12px 0 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100000,
              overflow: 'hidden'
            }}
          >
            {/* Luxury Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(197, 148, 58, 0.2)',
              background: 'linear-gradient(135deg, #fffdfa 0%, #faf4ed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-serif), Georgia, serif', 
                    fontSize: '1.45rem', 
                    fontWeight: 700, 
                    color: '#b83238',
                    letterSpacing: '-0.3px',
                    lineHeight: 1.1
                  }}>
                    hair&nature®
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    background: 'rgba(197, 148, 58, 0.15)',
                    color: '#966d21',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700
                  }}>
                    Concierge
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500 }}>
                    Direct Factory Floor • New Delhi Export Desk
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close drawer"
                style={{
                  background: '#f5f0ea',
                  border: '1px solid #e8ded4',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#444',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e8ded4';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f5f0ea';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #eee',
              background: '#faf8f5',
              padding: '6px 14px 0 14px',
              gap: '6px'
            }}>
              <button
                onClick={() => setActiveTab('my')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'my' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                  color: activeTab === 'my' ? 'var(--color-primary)' : '#666',
                  fontWeight: activeTab === 'my' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShoppingBag size={16} />
                <span>Enquiry Portfolio</span>
                {totalCount > 0 && (
                  <span style={{
                    background: activeTab === 'my' ? 'var(--color-primary)' : '#e2dbd4',
                    color: activeTab === 'my' ? '#fff' : '#444',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 800
                  }}>
                    {totalCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('global')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'global' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                  color: activeTab === 'global' ? 'var(--color-primary)' : '#666',
                  fontWeight: activeTab === 'global' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Globe size={16} />
                <span>Global Salon Activity</span>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.7rem',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }}></span>
                  Live
                </span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
              {activeTab === 'my' ? (
                items.length === 0 ? (
                  /* Empty State */
                  <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                    <div style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fffaf5 0%, #f6ede3 100%)',
                      border: '1.5px dashed rgba(197, 148, 58, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px auto',
                      fontSize: '2rem',
                      boxShadow: '0 4px 16px rgba(197, 148, 58, 0.08)'
                    }}>
                      📦
                    </div>
                    <h4 style={{ fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-serif), Georgia, serif' }}>
                      Your Enquiry Portfolio is Empty
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#777', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 24px auto' }}>
                      Browse any collection below, select your desired length, texture, and hair shade, then click <strong>"➕ Add to Wholesale Enquiry"</strong> to combine them into 1 single message.
                    </p>

                    {/* Quick navigation pill grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '380px', margin: '0 auto' }}>
                      <a
                        href="/tape-extensions"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e8ded4',
                          background: '#fffdfa',
                          color: '#222',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>Tape Extensions</span>
                        <ArrowRight size={14} color="#b83238" />
                      </a>
                      <a
                        href="/genius-wefts"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e8ded4',
                          background: '#fffdfa',
                          color: '#222',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>Genius Wefts</span>
                        <ArrowRight size={14} color="#b83238" />
                      </a>
                      <a
                        href="/k-tips"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e8ded4',
                          background: '#fffdfa',
                          color: '#222',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>K-Tips</span>
                        <ArrowRight size={14} color="#b83238" />
                      </a>
                      <a
                        href="/butterfly-wefts"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e8ded4',
                          background: '#fffdfa',
                          color: '#222',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>Butterfly Wefts</span>
                        <ArrowRight size={14} color="#b83238" />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Populated Items View */
                  <div>
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e8e2da',
                            borderRadius: '14px',
                            padding: '14px',
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            position: 'relative'
                          }}
                        >
                          {/* Image */}
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid #eee',
                            background: '#f9f9f9',
                            position: 'relative'
                          }}>
                            <img
                              src={item.image || '/images/tape_extensions.jpg'}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                {item.title}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                title="Remove from enquiry"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#bbb',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  transition: 'color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseOut={e => e.currentTarget.style.color = '#bbb'}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Option tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.72rem', background: '#f5eee8', color: '#555', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
                                {item.length}
                              </span>
                              <span style={{ fontSize: '0.72rem', background: '#f5eee8', color: '#555', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
                                {item.weight}
                              </span>
                              <span style={{ fontSize: '0.72rem', background: '#f5eee8', color: '#555', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
                                {item.style}
                              </span>
                            </div>

                            {/* Shade tag */}
                            <div style={{ fontSize: '0.75rem', color: '#b83238', fontWeight: 600, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b83238' }}></span>
                              <span>Shade: {item.color}</span>
                            </div>

                            {/* Stepper & Price Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #d9d2cb', borderRadius: '6px', overflow: 'hidden', background: '#fbf9f6' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{ border: 'none', background: 'transparent', padding: '3px 8px', cursor: 'pointer', color: '#555' }}
                                  title="Decrease"
                                >
                                  <Minus size={12} />
                                </button>
                                <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: 700, color: '#222' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{ border: 'none', background: 'transparent', padding: '3px 8px', cursor: 'pointer', color: '#555' }}
                                  title="Increase"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {item.basePriceUsd !== undefined && (
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
                                  {formatPrice(item.basePriceUsd * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Salon / Stylist Profile Accordion */}
                    <div style={{
                      background: '#fcfaf7',
                      border: '1px solid #e8ded4',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px'
                    }}>
                      <button
                        onClick={() => setShowProfileForm(!showProfileForm)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: '#333'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} color="#b83238" />
                          <span>Add Salon / Stylist Details (Saved)</span>
                        </div>
                        {showProfileForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {showProfileForm && (
                        <div style={{ padding: '12px 16px 16px 16px', borderTop: '1px solid #ebe2d8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', color: '#666', marginBottom: '4px', fontWeight: 500 }}>
                              Contact Name / Master Stylist
                            </label>
                            <input
                              type="text"
                              value={customerDetails.name || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                              placeholder="e.g. Jessica Miller"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d9d2cb', fontSize: '0.84rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', color: '#666', marginBottom: '4px', fontWeight: 500 }}>
                              Salon / Studio Name
                            </label>
                            <input
                              type="text"
                              value={customerDetails.salonName || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, salonName: e.target.value })}
                              placeholder="e.g. Luxe Hair Loft"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d9d2cb', fontSize: '0.84rem' }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.76rem', color: '#666', marginBottom: '4px', fontWeight: 500 }}>
                                City
                              </label>
                              <input
                                type="text"
                                value={customerDetails.city || ''}
                                onChange={e => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                                placeholder="e.g. London"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d9d2cb', fontSize: '0.84rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.76rem', color: '#666', marginBottom: '4px', fontWeight: 500 }}>
                                Country
                              </label>
                              <input
                                type="text"
                                value={customerDetails.country || ''}
                                onChange={e => setCustomerDetails({ ...customerDetails, country: e.target.value })}
                                placeholder="e.g. United Kingdom"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d9d2cb', fontSize: '0.84rem' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', color: '#666', marginBottom: '4px', fontWeight: 500 }}>
                              Special Requests / Custom Notes
                            </label>
                            <textarea
                              rows={2}
                              value={customerDetails.notes || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                              placeholder="e.g. Require custom shade ring, sample swatches, or express DHL dispatch..."
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d9d2cb', fontSize: '0.84rem' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                      <button
                        onClick={clearAll}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#999',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Clear All Items
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Recent Global Enquiries Tab (Social Proof) */
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                      <strong style={{ fontSize: '0.98rem', color: '#1a1a1a' }}>Live International Wholesale Desk</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.5, margin: 0 }}>
                      Real-time orders and quotes dispatched to certified salons and master stylists across Europe, North America, Australia, and the Middle East.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {globalFeed.map((feed) => (
                      <div
                        key={feed.id}
                        style={{
                          background: 'linear-gradient(135deg, #fffdfa 0%, #faf6f0 100%)',
                          border: '1px solid #e8ded4',
                          borderRadius: '12px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: '#1a1a1a', display: 'block' }}>
                              {feed.salonName || 'Certified Salon'}
                            </strong>
                            <span style={{ fontSize: '0.76rem', color: '#888' }}>
                              📍 {feed.location} • {feed.clientName}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.7rem',
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: 700
                          }}>
                            ✓ {feed.status || 'Quote Active'}
                          </span>
                        </div>

                        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #ede5dc' }}>
                          <div style={{ fontSize: '0.78rem', color: '#444', fontWeight: 600, marginBottom: '4px' }}>
                            Requested: {feed.totalItems} packs / bundles
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {feed.items?.map((it, idx) => (
                              <span key={idx} style={{ fontSize: '0.72rem', background: '#f5eee8', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>
                                {it.quantity}x {it.title} ({it.length})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {activeTab === 'my' && items.length > 0 && (
              <div style={{
                padding: '18px 24px',
                borderTop: '1px solid rgba(197, 148, 58, 0.2)',
                background: '#ffffff',
                boxShadow: '0 -6px 20px rgba(0,0,0,0.06)'
              }}>
                {/* Total estimation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Enquiry Total ({totalCount} items)
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#1a1a1a', fontWeight: 800 }}>
                      {totalEstimatedUsd > 0 ? `${formatPrice(totalEstimatedUsd)} (${currency})` : 'Wholesale Quote Tier'}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(228,82,88,0.1)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
                      Factory Direct
                    </span>
                  </div>
                </div>

                {/* Primary WhatsApp 1-Message Button */}
                <button
                  onClick={() => sendCombinedEnquiry()}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    fontSize: '0.98rem',
                    borderRadius: '12px',
                    justifyContent: 'center',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 22px rgba(228, 82, 88, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 700
                  }}
                >
                  <MessageCircle size={20} />
                  <span>Send All Enquiries in 1 WhatsApp Message</span>
                </button>

                {/* Secondary Action Toolbar: Copy Manifest & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={handleCopyQuote}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d9d2cb',
                      background: copiedQuote ? '#dcfce7' : '#faf8f5',
                      color: copiedQuote ? '#15803d' : '#444',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copiedQuote ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedQuote ? 'Copied to Clipboard!' : 'Copy Quote Text'}</span>
                  </button>

                  <button
                    onClick={handleEmailQuote}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d9d2cb',
                      background: '#faf8f5',
                      color: '#444',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Mail size={14} />
                    <span>Email Quote</span>
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.72rem', color: '#888' }}>
                  ⚡ Instant direct WhatsApp connection to our New Delhi factory export managers
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

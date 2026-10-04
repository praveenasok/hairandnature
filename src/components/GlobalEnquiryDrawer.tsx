"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, Globe, ShoppingBag, CheckCircle, ChevronRight, MessageCircle } from 'lucide-react';
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
  } = useEnquiry();

  const { currency, formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'my' | 'global'>('my');
  const [globalFeed, setGlobalFeed] = useState<GlobalFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Fetch recent global inquiries for the "Global Inquiries" tab
  useEffect(() => {
    if (isOpen) {
      setLoadingFeed(true);
      fetch('/api/enquiries')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setGlobalFeed(data);
          }
          setLoadingFeed(false);
        })
        .catch(err => {
          console.error('Failed to load global enquiries feed:', err);
          setLoadingFeed(false);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-10px 0 35px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100000
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#fcfbf9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(228,82,88,0.1)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  📋
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                    Global Enquiries
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>
                    Wholesale Quote & Single-Message Order Hub
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#555',
                  transition: 'background 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #eee',
              background: '#fafafa',
              padding: '4px 12px 0 12px'
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
                  gap: '6px'
                }}
              >
                <ShoppingBag size={16} />
                <span>My Enquiry List</span>
                {totalCount > 0 && (
                  <span style={{
                    background: activeTab === 'my' ? 'var(--color-primary)' : '#e5e7eb',
                    color: activeTab === 'my' ? '#fff' : '#444',
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    fontWeight: 700
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
                  gap: '6px'
                }}
              >
                <Globe size={16} />
                <span>Recent Global Enquiries</span>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  fontWeight: 700
                }}>
                  Live
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {activeTab === 'my' ? (
                items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 10px', color: '#666' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: '#fbf7f4',
                      border: '2px dashed #e8ded7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      fontSize: '2rem'
                    }}>
                      📦
                    </div>
                    <h4 style={{ fontSize: '1.15rem', color: '#222', marginBottom: '8px', fontWeight: 700 }}>
                      Your Enquiry List is Empty
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#777', lineHeight: 1.6, maxWidth: '320px', margin: '0 auto 24px auto' }}>
                      Navigate to any product page (Tape Extensions, Genius Wefts, K-Tips, etc.) and click <strong>"➕ Add to Global Enquiry"</strong> to combine multiple items.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
                      <a
                        href="/tape-extensions"
                        onClick={() => setIsOpen(false)}
                        className="btn-gold"
                        style={{ padding: '10px 16px', fontSize: '0.88rem', justifyContent: 'center' }}
                      >
                        Explore Tape Extensions
                      </a>
                      <a
                        href="/genius-wefts"
                        onClick={() => setIsOpen(false)}
                        className="btn-outline"
                        style={{ padding: '10px 16px', fontSize: '0.88rem', justifyContent: 'center' }}
                      >
                        Explore Genius Wefts
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Top notice banner */}
                    <div style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.4 }}>
                        <strong>Single-Message Consolidation:</strong> All {totalCount} items below will be sent as <strong>1 combined WhatsApp enquiry</strong>.
                      </div>
                    </div>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e8e3dc',
                            borderRadius: '14px',
                            padding: '14px',
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                          }}
                        >
                          {/* Thumbnail */}
                          <img
                            src={item.image || '/images/tape_extensions.jpg'}
                            alt={item.title}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                              border: '1px solid #eee',
                              flexShrink: 0
                            }}
                          />

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                {item.title}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                title="Remove item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#aaa',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  transition: 'color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseOut={e => e.currentTarget.style.color = '#aaa'}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Option pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.72rem', background: '#f4f0eb', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>
                                {item.length}
                              </span>
                              <span style={{ fontSize: '0.72rem', background: '#f4f0eb', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>
                                {item.weight}
                              </span>
                              <span style={{ fontSize: '0.72rem', background: '#f4f0eb', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>
                                {item.style}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '4px' }}>
                              Shade: {item.color}
                            </div>

                            {/* Stepper & Price row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{ border: 'none', background: '#fafafa', padding: '3px 8px', cursor: 'pointer', color: '#555' }}
                                >
                                  <Minus size={12} />
                                </button>
                                <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: 600 }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{ border: 'none', background: '#fafafa', padding: '3px 8px', cursor: 'pointer', color: '#555' }}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {item.basePriceUsd !== undefined && (
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a1a' }}>
                                  {formatPrice(item.basePriceUsd * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Optional Stylist / Salon Details Accordion */}
                    <div style={{
                      background: '#fafafa',
                      border: '1px solid #ebebeb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '18px'
                    }}>
                      <button
                        onClick={() => setShowDetailsForm(!showDetailsForm)}
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
                          fontSize: '0.86rem',
                          color: '#333'
                        }}
                      >
                        <span>🏢 Add Salon / Stylist Details (Optional)</span>
                        <ChevronRight size={16} style={{ transform: showDetailsForm ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>

                      {showDetailsForm && (
                        <div style={{ padding: '12px 16px 16px 16px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>Your Name / Stylist Name</label>
                            <input
                              type="text"
                              value={customerDetails.name || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                              placeholder="e.g. Jessica Smith"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>Salon / Studio Name</label>
                            <input
                              type="text"
                              value={customerDetails.salonName || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, salonName: e.target.value })}
                              placeholder="e.g. Mane Allure Hair Studio"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>City</label>
                              <input
                                type="text"
                                value={customerDetails.city || ''}
                                onChange={e => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                                placeholder="e.g. London"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>Country</label>
                              <input
                                type="text"
                                value={customerDetails.country || ''}
                                onChange={e => setCustomerDetails({ ...customerDetails, country: e.target.value })}
                                placeholder="e.g. United Kingdom"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>Special Request / Notes</label>
                            <textarea
                              rows={2}
                              value={customerDetails.notes || ''}
                              onChange={e => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                              placeholder="e.g. Looking for wholesale bulk tier discount or custom color ring..."
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
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
                          color: '#888',
                          fontSize: '0.78rem',
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
                /* Recent Global Enquiries Tab */
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                      <strong style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>Live Global Salon Enquiries</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
                      Real-time wholesale enquiries submitted by certified salons and master stylists across Europe, North America, Australia, and the Middle East.
                    </p>
                  </div>

                  {loadingFeed ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                      Loading global enquiries...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {globalFeed.map(feed => (
                        <div
                          key={feed.id}
                          style={{
                            background: '#faf9f7',
                            border: '1px solid #ebe5df',
                            borderRadius: '12px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: '#1a1a1a', display: 'block' }}>
                                {feed.salonName || 'Luxury Salon'}
                              </strong>
                              <span style={{ fontSize: '0.76rem', color: '#888' }}>
                                📍 {feed.location} • {feed.clientName}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '0.72rem',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontWeight: 700
                            }}>
                              ✓ {feed.status || 'Active Quote'}
                            </span>
                          </div>

                          <div style={{ background: '#ffffff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #eee' }}>
                            <div style={{ fontSize: '0.78rem', color: '#444', fontWeight: 600, marginBottom: '4px' }}>
                              Enquiry: {feed.totalItems} packs requested
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {feed.items?.map((it, idx) => (
                                <span key={idx} style={{ fontSize: '0.72rem', background: '#f3f4f6', color: '#555', padding: '2px 6px', borderRadius: '4px' }}>
                                  {it.quantity}x {it.title} ({it.length})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {activeTab === 'my' && items.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #eee',
                background: '#ffffff',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.05)'
              }}>
                {/* Summary row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Enquiry Total ({totalCount} items)
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#1a1a1a', fontWeight: 800 }}>
                      {totalEstimatedUsd > 0 ? `${formatPrice(totalEstimatedUsd)} (${currency})` : 'Wholesale Quote Tier'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(228,82,88,0.1)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                    Factory Direct
                  </span>
                </div>

                {/* Primary Action Button: 1 Single WhatsApp Message */}
                <button
                  onClick={() => sendCombinedEnquiry()}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    justifyContent: 'center',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(228, 82, 88, 0.35)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <MessageCircle size={20} />
                  <span>Send All Enquiries in 1 WhatsApp Message</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.74rem', color: '#888' }}>
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

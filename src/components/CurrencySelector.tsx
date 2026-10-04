"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';

export default function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = SUPPORTED_CURRENCIES[currency];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Currency"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '5px 10px' : '7px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          fontSize: compact ? '0.82rem' : '0.88rem',
          fontWeight: 600,
          color: '#1a1a1a',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: compact ? '0.92rem' : '1rem', lineHeight: 1 }}>{currentConfig.flag}</span>
        <span>{currentConfig.code}</span>
        {!compact && (
          <span style={{ color: '#888', fontWeight: 500, fontSize: '0.8rem' }}>({currentConfig.symbol.trim()})</span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            marginLeft: '2px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.6,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            minWidth: '160px',
            zIndex: 1000,
            overflow: 'hidden',
            padding: '6px',
            animation: 'fadeInMenu 0.15s ease-out',
          }}
        >
          <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: '#888', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Choose Currency
          </div>
          {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
            const item = SUPPORTED_CURRENCIES[code];
            const isSelected = code === currency;
            return (
              <button
                key={code}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? 'rgba(228, 82, 88, 0.08)' : 'transparent',
                  color: isSelected ? 'var(--color-primary)' : '#222',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'background 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>
                  <span>{item.code}</span>
                  <span style={{ fontSize: '0.78rem', color: '#777' }}>({item.symbol.trim()})</span>
                </div>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

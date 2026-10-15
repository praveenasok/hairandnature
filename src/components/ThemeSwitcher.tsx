'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export type ThemeId = 
  | 'bordeaux' 
  | 'obsidian' 
  | 'espresso' 
  | 'midnight'
  | 'emerald'
  | 'rose-gold'
  | 'amethyst'
  | 'terracotta'
  | 'sage'
  | 'cobalt'
  | 'monochrome'
  | 'copper'
  | 'charcoal'
  | 'champagne';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  badge: string;
  tagline: string;
  primaryColor: string;
  accentGold: string;
  bgColor: string;
  description: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'bordeaux',
    name: 'Regal Bordeaux',
    badge: 'Recommended',
    tagline: 'Velvety Wine & Champagne Gold',
    primaryColor: '#8F232B',
    accentGold: '#C5943A',
    bgColor: '#FAF8F5',
    description: 'Evokes high-end Parisian salons, fine fragrance packaging, and timeless luxury beauty houses.'
  },
  {
    id: 'obsidian',
    name: 'Obsidian Noir',
    badge: 'Couture',
    tagline: 'Monochrome Noir & 24k Gold',
    primaryColor: '#18181B',
    accentGold: '#D4AF37',
    bgColor: '#FBFBFC',
    description: 'Ultra-crisp runway minimalism inspired by Chanel, Tom Ford, and luxury hair ateliers.'
  },
  {
    id: 'espresso',
    name: 'Warm Espresso',
    badge: 'Organic Luxe',
    tagline: 'Roasted Espresso & Honey Bronze',
    primaryColor: '#2E231C',
    accentGold: '#B88746',
    bgColor: '#F8F6F1',
    description: 'Earthy, rich natural hair tones with Mediterranean warmth and artisanal linen textures.'
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    badge: 'Regal Global',
    tagline: 'Deep Sapphire & Platinum Gold',
    primaryColor: '#132238',
    accentGold: '#C99738',
    bgColor: '#F7F9FB',
    description: 'Sovereign, executive international exporter presence with crisp platinum clarity.'
  },
  {
    id: 'emerald',
    name: 'Imperial Emerald',
    badge: 'Botanical',
    tagline: 'Deep Forest Emerald & Antique Gold',
    primaryColor: '#14382B',
    accentGold: '#C89D42',
    bgColor: '#F6F9F7',
    description: 'Prestigious salon heritage, rich botanical alchemy, and timeless royal green opulence.'
  },
  {
    id: 'rose-gold',
    name: 'Cashmere Rose',
    badge: 'Blush Atelier',
    tagline: 'Cashmere Rose Wine & Soft Champagne',
    primaryColor: '#8A3A4E',
    accentGold: '#CCA46D',
    bgColor: '#FAF7F8',
    description: 'Soft bridal couture, Beverly Hills glamor, and ultra-feminine salon refinement.'
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst',
    badge: 'Majestic',
    tagline: 'Imperial Plum & Byzantine Gold',
    primaryColor: '#4A1E42',
    accentGold: '#D4A347',
    bgColor: '#FAF7FA',
    description: 'Coronation velvet, deep aristocratic plum, and warm Byzantine gold accents.'
  },
  {
    id: 'terracotta',
    name: 'Tuscan Terracotta',
    badge: 'Mediterranean',
    tagline: 'Sunbaked Terracotta & Amber Ochre',
    primaryColor: '#9E4327',
    accentGold: '#C9862D',
    bgColor: '#FBFBFC',
    description: 'Milanese atelier warmth, sunlit clay pigments, and organic Mediterranean artisan craft.'
  },
  {
    id: 'sage',
    name: 'Botanical Sage',
    badge: 'Zen Holistic',
    tagline: 'Herbal Deep Sage & Pale Gilt',
    primaryColor: '#2D4739',
    accentGold: '#BE9648',
    bgColor: '#F7F9F7',
    description: 'Holistic clean beauty, restorative Scandinavian salon atmosphere, and calming botanical clarity.'
  },
  {
    id: 'cobalt',
    name: 'Royal Cobalt',
    badge: 'High Impact',
    tagline: 'Versailles Cobalt & Gilded Sun',
    primaryColor: '#0E2F68',
    accentGold: '#D4A838',
    bgColor: '#F6F8FC',
    description: 'Dramatic French royal blue, crisp diamond white contrast, and radiant gilded sun.'
  },
  {
    id: 'monochrome',
    name: 'Minimalist Slate',
    badge: 'Architectural',
    tagline: 'Structural Slate & White Gold',
    primaryColor: '#334155',
    accentGold: '#B59963',
    bgColor: '#F8FAFC',
    description: 'High-tech Swiss precision, graphite structural clean lines, and subtle white gold warmth.'
  },
  {
    id: 'copper',
    name: 'Burnished Copper',
    badge: 'Warm Radiance',
    tagline: 'Molten Copper & Raw Sienna Gold',
    primaryColor: '#8C3B1E',
    accentGold: '#C78834',
    bgColor: '#FBF8F5',
    description: 'Vibrant auburn and copper hair fiber glow, autumnal warmth, and metallic sheen.'
  },
  {
    id: 'charcoal',
    name: 'Velvet Charcoal',
    badge: 'SoHo Chic',
    tagline: 'Anthracite Charcoal & Molten Brass',
    primaryColor: '#24272C',
    accentGold: '#CF9B3C',
    bgColor: '#F8F8F9',
    description: 'Contemporary metropolitan flagship studio, industrial polished brass, and chic unisex appeal.'
  },
  {
    id: 'champagne',
    name: 'Golden Champagne',
    badge: 'Golden Hour',
    tagline: 'Dark Truffle Caramel & Golden Gilt',
    primaryColor: '#6E4D25',
    accentGold: '#CCA246',
    bgColor: '#FAF8F3',
    description: 'Specialist blonde salon luxury, poured champagne warmth, and decadent golden hour tones.'
  }
];

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('bordeaux');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hn-theme') as ThemeId;
    if (saved && THEMES.some(t => t.id === saved)) {
      setActiveTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'bordeaux');
    }
  }, []);

  const handleSelectTheme = (id: ThemeId) => {
    setActiveTheme(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('hn-theme', id);
  };


  return (
    <aside 
      aria-label="Theme Palette Selector"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Collapsed Compact Circular Trigger */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          title={`Active Palette: ${THEMES.find(t => t.id === activeTheme)?.name}. Click to switch.`}
          aria-label="Theme Palette Switcher"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            background: 'rgba(18, 18, 20, 0.88)',
            borderRadius: '50%',
            border: '1.5px solid rgba(197, 148, 58, 0.45)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.08)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.9)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(197, 148, 58, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = 'rgba(197, 148, 58, 0.45)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
          }}
        >
          {/* Active Palette Color Swatch Preview Dot */}
          <div style={{
            display: 'flex',
            position: 'relative',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}>
            <div style={{ flex: 1, height: '100%', background: THEMES.find(t => t.id === activeTheme)?.primaryColor }} />
            <div style={{ flex: 1, height: '100%', background: THEMES.find(t => t.id === activeTheme)?.accentGold }} />
          </div>
        </button>
      ) : (
        /* Expanded Floating Luxury Control Panel */
        <div 
          style={{
            width: '320px',
            background: 'rgba(18, 18, 20, 0.96)',
            borderRadius: '20px',
            padding: '16px',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(197, 148, 58, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: 'fadeInUp 0.22s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🎨</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                Select Color Palette
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '14px', lineHeight: 1.4 }}>
            Click any palette to preview in real-time across this entire site:
          </p>

          {/* Theme Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
            {THEMES.map(theme => {
              const isSelected = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1.5px solid #C5943A' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                >
                  {/* Swatch Pill */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    <div style={{ flex: 2, background: theme.primaryColor }} />
                    <div style={{ flex: 1, background: theme.accentGold }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                        {theme.name}
                      </span>
                      {theme.badge && (
                        <span style={{
                          fontSize: '0.62rem',
                          background: isSelected ? '#C5943A' : 'rgba(255, 255, 255, 0.12)',
                          color: isSelected ? '#121212' : '#d4af37',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontWeight: 800,
                        }}>
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '2px' }}>
                      {theme.tagline}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isSelected && (
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#C5943A',
                      color: '#111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}>
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Link to Comprehensive Comparison Page */}
          <Link
            href="/palette-preview"
            onClick={() => setIsExpanded(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #C5943A 0%, #966D21 100%)',
              color: '#000000',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(197, 148, 58, 0.35)',
              transition: 'transform 0.2s, filter 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.filter = 'brightness(1.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <span>Open Side-by-Side Comparison</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </aside>
  );
}

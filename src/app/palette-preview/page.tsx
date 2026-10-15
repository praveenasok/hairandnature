'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PaletteSpec {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  concept: string;
  industryComparison: string;
  colors: {
    primary: { hex: string; name: string; role: string };
    accent: { hex: string; name: string; role: string };
    background: { hex: string; name: string; role: string };
    surface: { hex: string; name: string; role: string };
    text: { hex: string; name: string; role: string };
    muted: { hex: string; name: string; role: string };
  };
}

const PALETTES: PaletteSpec[] = [
  {
    id: 'bordeaux',
    name: 'Regal Bordeaux & Champagne Gold',
    subtitle: 'Haute Editorial • Parisian Salon Prestige',
    badge: 'Recommended',
    concept: 'Deep velvety wine paired with burnished champagne gold and luminous alabaster ivory. Evokes the heritage of fine French perfumeries and prestigious European hair extension ateliers.',
    industryComparison: 'Similar to high-fashion houses like Cartier, Bvlgari, and Balmain Paris Hair Couture.',
    colors: {
      primary: { hex: '#8F232B', name: 'Regal Bordeaux', role: 'Main Brand Identity & Headers' },
      accent: { hex: '#C5943A', name: 'Champagne Gold', role: 'Badges, Borders & Highlights' },
      background: { hex: '#FAF8F5', name: 'Alabaster Ivory', role: 'Root Page Canvas (Clean & Warm)' },
      surface: { hex: '#FFFFFF', name: 'Pure Porcelain', role: 'Card & Modal Surfaces' },
      text: { hex: '#1C1917', name: 'Obsidian Charcoal', role: 'High-Contrast Typography' },
      muted: { hex: '#57534E', name: 'Warm Slate', role: 'Secondary Metadata & Subtitles' },
    }
  },
  {
    id: 'obsidian',
    name: 'Obsidian Noir & Royal 24k Gold',
    subtitle: 'Runway Minimalist • Ultra-Luxe Atelier',
    badge: 'Couture',
    concept: 'Stripped of non-essential hues, pure deep obsidian black commands absolute authority, accented only by glittering 24k gold leaf and pristine architectural white.',
    industryComparison: 'Similar to Chanel, Tom Ford Beauty, and Dyson Supersonic Hair Care.',
    colors: {
      primary: { hex: '#18181B', name: 'Deep Obsidian', role: 'Main Brand Identity & Primary CTA' },
      accent: { hex: '#D4AF37', name: '24k Royal Gold', role: 'Accents, Icons & Hover States' },
      background: { hex: '#FBFBFC', name: 'Architectural Frost', role: 'Ultra-Clean Crisp Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pure White', role: 'Card & Modal Surfaces' },
      text: { hex: '#09090B', name: 'Jet Black', role: 'High-Impact Crisp Typography' },
      muted: { hex: '#71717A', name: 'Neutral Zinc', role: 'Secondary Metadata' },
    }
  },
  {
    id: 'espresso',
    name: 'Warm Espresso & Honey Bronze',
    subtitle: 'Organic Luxury • Natural Hair Fiber Harmony',
    badge: 'Organic Luxe',
    concept: 'Warm roasted coffee bean and rich dark chocolate undertones, paired with artisanal honey bronze and raw silk linen. Celebrates natural, chemical-free human hair biology.',
    industryComparison: 'Similar to Aveda, Davines, and luxury organic botanical hair care brands.',
    colors: {
      primary: { hex: '#2E231C', name: 'Roasted Espresso', role: 'Main Brand & Heavy Accents' },
      accent: { hex: '#B88746', name: 'Honey Bronze', role: 'Warm Glowing Highlights' },
      background: { hex: '#F8F6F1', name: 'Natural Silk Linen', role: 'Organic Warm Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pure White', role: 'Card Surfaces' },
      text: { hex: '#26211D', name: 'Warm Black', role: 'Comfortable Readable Body' },
      muted: { hex: '#6B6158', name: 'Earthy Taupe', role: 'Secondary Details' },
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Navy & Platinum Gold',
    subtitle: 'Executive Global Exporter • Sovereign Heritage',
    badge: 'Global Trade',
    concept: 'Deep sapphire navy delivers unshakeable international banking, manufacturing, and shipping confidence. Paired with shimmering champagne gold for an aristocratic finish.',
    industryComparison: 'Similar to Rolex, Tiffany & Co. wholesale, and royal charter merchant houses.',
    colors: {
      primary: { hex: '#132238', name: 'Regal Midnight Navy', role: 'Brand Identity & Authority' },
      accent: { hex: '#C99738', name: 'Platinum Champagne', role: 'Prestige Accents & Stars' },
      background: { hex: '#F7F9FB', name: 'Platinum Ice Canvas', role: 'Cool Crisp Professional Canvas' },
      surface: { hex: '#FFFFFF', name: 'Crisp White', role: 'Card Surfaces' },
      text: { hex: '#0F172A', name: 'Navy Slate Ink', role: 'Sharp Contrast Text' },
      muted: { hex: '#475569', name: 'Steel Slate', role: 'Secondary Details' },
    }
  },
  {
    id: 'emerald',
    name: 'Imperial Emerald & Antique Gold',
    subtitle: 'Prestigious Botanical • Royal Heritage Salon',
    badge: 'Botanical Luxe',
    concept: 'Deep regal forest emerald paired with lustrous antique gold and warm silk ivory. Celebrates botanical richness, pure natural hair origins, and timeless royal salon heritage.',
    industryComparison: 'Similar to Harrods Salon de Beauté, Roja Parfums, and luxury organic European apothecary houses.',
    colors: {
      primary: { hex: '#14382B', name: 'Imperial Emerald', role: 'Main Brand Identity & Headers' },
      accent: { hex: '#C89D42', name: 'Antique Gold', role: 'Badges, Accents & Glow' },
      background: { hex: '#F6F9F7', name: 'Botanical Frost', role: 'Calming Clean Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pure White', role: 'Card Surfaces' },
      text: { hex: '#11231B', name: 'Deep Forest Ink', role: 'Sharp Readable Typography' },
      muted: { hex: '#50665B', name: 'Sage Slate', role: 'Secondary Details' },
    }
  },
  {
    id: 'rose-gold',
    name: 'Cashmere Rose & Warm Champagne',
    subtitle: 'Blush Atelier • Bridal & Celebrity Glamour',
    badge: 'Couture Blush',
    concept: 'Dusty cashmere rose wine with warm champagne gold and luminous blush porcelain. Tailored for bridal suites, luxury hair extensions, and celebrity styling studios.',
    industryComparison: 'Similar to Charlotte Tilbury, Jo Malone, and luxury Hollywood blow-dry bars.',
    colors: {
      primary: { hex: '#8A3A4E', name: 'Cashmere Rose', role: 'Brand Identity & Romance' },
      accent: { hex: '#CCA46D', name: 'Warm Champagne', role: 'Lustrous Glow Accents' },
      background: { hex: '#FAF7F8', name: 'Blush Pearl', role: 'Soft Warming Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pure White', role: 'Card Surfaces' },
      text: { hex: '#28161C', name: 'Espresso Berry', role: 'High Contrast Text' },
      muted: { hex: '#6E565F', name: 'Cashmere Taupe', role: 'Secondary Details' },
    }
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst & Byzantine Gold',
    subtitle: 'Sovereign Velvet • Haute Editorial Royalty',
    badge: 'Aristocratic',
    concept: 'Deep coronation plum velvet paired with warm byzantine yellow gold and alabaster. An intensely luxurious statement of sovereign manufacturing mastery.',
    industryComparison: 'Similar to European royal crown jewelers and haute couture runway houses.',
    colors: {
      primary: { hex: '#4A1E42', name: 'Royal Amethyst', role: 'Main Brand & Headlines' },
      accent: { hex: '#D4A347', name: 'Byzantine Gold', role: 'Prestige Stars & Badges' },
      background: { hex: '#FAF7FA', name: 'Alabaster Silk', role: 'Refined Canvas' },
      surface: { hex: '#FFFFFF', name: 'Porcelain White', role: 'Card Surfaces' },
      text: { hex: '#1E0C1B', name: 'Obsidian Plum', role: 'Sharp Typography' },
      muted: { hex: '#63495F', name: 'Velvet Slate', role: 'Secondary Metadata' },
    }
  },
  {
    id: 'terracotta',
    name: 'Tuscan Terracotta & Amber Ochre',
    subtitle: 'Mediterranean Warmth • Artisanal Craft Atelier',
    badge: 'Artisanal Luxe',
    concept: 'Sunbaked Tuscan terracotta clay warmed by glowing amber ochre and soft travertine ivory. Evokes Mediterranean sunshine and natural master craftsmanship.',
    industryComparison: 'Similar to Bottega Veneta, Acqua di Parma, and Italian leather/hair ateliers.',
    colors: {
      primary: { hex: '#9E4327', name: 'Tuscan Terracotta', role: 'Warm Brand Identity' },
      accent: { hex: '#C9862D', name: 'Amber Ochre', role: 'Glowing Accents' },
      background: { hex: '#FBF8F5', name: 'Travertine Canvas', role: 'Warm Earth Canvas' },
      surface: { hex: '#FFFFFF', name: 'Warm White', role: 'Card Surfaces' },
      text: { hex: '#26150F', name: 'Roast Espresso', role: 'High-Impact Text' },
      muted: { hex: '#695046', name: 'Clay Taupe', role: 'Secondary Details' },
    }
  },
  {
    id: 'sage',
    name: 'Botanical Sage & Soft Gilt',
    subtitle: 'Holistic Zen • Clean Scandinavian Aesthetics',
    badge: 'Holistic Zen',
    concept: 'Muted botanical deep sage with subtle champagne gilt and crisp oat linen. Designed for holistic wellness salons and chemical-free pure hair philosophy.',
    industryComparison: 'Similar to Aesop, Le Labo, and minimalist Nordic spa retreats.',
    colors: {
      primary: { hex: '#2D4739', name: 'Botanical Sage', role: 'Calming Authority' },
      accent: { hex: '#BE9648', name: 'Soft Gilt', role: 'Subtle Metallic Accents' },
      background: { hex: '#F7F9F7', name: 'Oat Linen', role: 'Organic Clean Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pristine White', role: 'Card Surfaces' },
      text: { hex: '#18261E', name: 'Forest Charcoal', role: 'Readable Typography' },
      muted: { hex: '#52665B', name: 'Muted Moss', role: 'Secondary Details' },
    }
  },
  {
    id: 'cobalt',
    name: 'Royal Cobalt & Gilded Sun',
    subtitle: 'Dramatic High Impact • Versailles French Blue',
    badge: 'High Impact',
    concept: 'Luminous French royal cobalt with dazzling yellow sun gold and icy diamond white. Commands attention with undeniable editorial power.',
    industryComparison: 'Similar to Hermès silk collections and classic French haute couture.',
    colors: {
      primary: { hex: '#0E2F68', name: 'Royal Cobalt', role: 'Bold Brand Identity' },
      accent: { hex: '#D4A838', name: 'Gilded Sun', role: 'Vibrant Highlights' },
      background: { hex: '#F6F8FC', name: 'Diamond Frost', role: 'Cool Luminous Canvas' },
      surface: { hex: '#FFFFFF', name: 'Crisp White', role: 'Card Surfaces' },
      text: { hex: '#0A1B36', name: 'Midnight Navy', role: 'High Contrast Text' },
      muted: { hex: '#485973', name: 'Steel Blue', role: 'Secondary Details' },
    }
  },
  {
    id: 'monochrome',
    name: 'Minimalist Slate & White Gold',
    subtitle: 'Swiss Architectural Precision • High Tech Modernism',
    badge: 'Architectural',
    concept: 'Refined architectural graphite slate with pale icy white gold. Minimal, clean, precision-engineered aesthetic for cutting-edge salon professionals.',
    industryComparison: 'Similar to Balenciaga, Apple Design, and Swiss luxury watchmakers.',
    colors: {
      primary: { hex: '#334155', name: 'Graphite Slate', role: 'Structural Headers' },
      accent: { hex: '#B59963', name: 'White Gold', role: 'Subtle Luxe Accents' },
      background: { hex: '#F8FAFC', name: 'Architectural Alabaster', role: 'Clean Tech Canvas' },
      surface: { hex: '#FFFFFF', name: 'Porcelain White', role: 'Card Surfaces' },
      text: { hex: '#0F172A', name: 'Slate Carbon', role: 'Precision Typography' },
      muted: { hex: '#64748B', name: 'Cool Zinc', role: 'Secondary Details' },
    }
  },
  {
    id: 'copper',
    name: 'Burnished Copper & Raw Sienna',
    subtitle: 'Auburn Glow • Molten Warmth & Opulence',
    badge: 'Auburn Glow',
    concept: 'Deep burnished copper bronze paired with raw sienna gold. Directly inspired by natural auburn, copper, and warm brunette hair undertones.',
    industryComparison: 'Similar to Clive Christian and autumnal high-jewelry exhibitions.',
    colors: {
      primary: { hex: '#8C3B1E', name: 'Burnished Copper', role: 'Rich Brand Identity' },
      accent: { hex: '#C78834', name: 'Raw Sienna', role: 'Warm Metallic Glow' },
      background: { hex: '#FBF8F5', name: 'Bisque Linen', role: 'Warm Bisque Canvas' },
      surface: { hex: '#FFFFFF', name: 'Warm White', role: 'Card Surfaces' },
      text: { hex: '#28140B', name: 'Mocha Charcoal', role: 'Readable Typography' },
      muted: { hex: '#6B5145', name: 'Copper Taupe', role: 'Secondary Details' },
    }
  },
  {
    id: 'charcoal',
    name: 'Velvet Charcoal & Molten Brass',
    subtitle: 'SoHo Metropolitan • Industrial Brass Atelier',
    badge: 'SoHo Chic',
    concept: 'Deep anthracite charcoal velvet with warm molten brass accents. Sleek, metropolitan, and effortlessly unisex for premier global salon flagships.',
    industryComparison: 'Similar to Ralph Lauren Black Label and luxury Tribeca loft studios.',
    colors: {
      primary: { hex: '#24272C', name: 'Velvet Charcoal', role: 'Sleek Modern Identity' },
      accent: { hex: '#CF9B3C', name: 'Molten Brass', role: 'Warm Industrial Accents' },
      background: { hex: '#F8F8F9', name: 'Warm Concrete Frost', role: 'Modern Canvas' },
      surface: { hex: '#FFFFFF', name: 'Crisp White', role: 'Card Surfaces' },
      text: { hex: '#121316', name: 'Deep Anthracite', role: 'High Contrast Text' },
      muted: { hex: '#5E6470', name: 'Brass Slate', role: 'Secondary Details' },
    }
  },
  {
    id: 'champagne',
    name: 'Golden Champagne & Warm Truffle',
    subtitle: 'Specialist Blonde Luxury • Golden Hour Decadence',
    badge: 'Golden Hour',
    concept: 'Rich dark caramel truffle with sparkling champagne gold. Inspired by sunlit golden hour reflections on master-bleached Russian & European blonde hair fibers.',
    industryComparison: 'Similar to Dom Pérignon and Monte Carlo luxury beach clubs.',
    colors: {
      primary: { hex: '#6E4D25', name: 'Warm Truffle', role: 'Deep Caramel Headers' },
      accent: { hex: '#CCA246', name: 'Golden Champagne', role: 'Sparkling Accents' },
      background: { hex: '#FAF8F3', name: 'Champagne Silk', role: 'Luminous Cream Canvas' },
      surface: { hex: '#FFFFFF', name: 'Pure White', role: 'Card Surfaces' },
      text: { hex: '#24190C', name: 'Dark Roast', role: 'Readable Typography' },
      muted: { hex: '#695743', name: 'Hazelnut Taupe', role: 'Secondary Details' },
    }
  }
];

export default function PalettePreviewPage() {
  const [currentTheme, setCurrentTheme] = useState('bordeaux');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hn-theme') || 'bordeaux';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const handleApplyTheme = (id: string, name: string) => {
    setCurrentTheme(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('hn-theme', id);
    setAppliedNotification(`Applied "${name}" to the entire website!`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const activePalette = PALETTES.find(p => p.id === currentTheme) || PALETTES[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)', paddingTop: '110px', paddingBottom: '100px', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* Toast Notification */}
      {appliedNotification && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: '#18181B',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px #C5943A',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <span style={{ color: '#C5943A', fontSize: '1.1rem' }}>✓</span>
          {appliedNotification}
        </div>
      )}

      <div className="container">

        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', marginBottom: '24px', opacity: 0.75 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/tape-extensions" style={{ textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Brand Palette Showroom</span>
        </div>

        {/* Executive Header */}
        <div style={{ maxWidth: '900px', marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--color-primary-subtle)', 
            color: 'var(--color-primary)', 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '0.82rem', 
            fontWeight: 700,
            marginBottom: '16px' 
          }}>
            <span>👑</span> LUXURY BRAND IDENTITY UPGRADE
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', 
            fontWeight: 400, 
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
            marginBottom: '18px',
            color: 'var(--color-text)'
          }}>
            Curated Professional Color Schemes
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.7, opacity: 0.85, maxWidth: '780px' }}>
            To elevate hair&nature® into an international tier-1 exporter, we replaced the previous casual coral (<code style={{ background: 'rgba(228,82,88,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#c0392b' }}>#e45258</code>) and muddy tan canvas with 4 bespoke luxury color systems. Explore each palette below and click to activate across all pages in real-time.
          </p>
        </div>

        {/* Live Active Bar */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '16px',
          padding: '18px 24px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
              Currently Active Website Palette
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {activePalette.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link 
              href="/tape-extensions"
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text)',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Test on Product Page</span>
              <span>↗</span>
            </Link>
            <Link 
              href="/"
              className="btn"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
              }}
            >
              Test on Homepage →
            </Link>
          </div>
        </div>

        {/* 4 Palette Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', 
          gap: '24px',
          marginBottom: '64px'
        }}>
          {PALETTES.map((palette) => {
            const isSelected = palette.id === currentTheme;
            return (
              <div 
                key={palette.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: '18px',
                  border: isSelected ? '2.5px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.08)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isSelected 
                    ? '0 12px 32px var(--color-primary-glow), 0 0 0 1px var(--color-primary)' 
                    : '0 4px 16px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  {palette.badge ? (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: isSelected ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
                      color: isSelected ? '#ffffff' : 'inherit',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {palette.badge}
                    </span>
                  ) : <span />}

                  {isSelected && (
                    <span style={{ 
                      fontSize: '0.76rem', 
                      color: 'var(--color-primary)', 
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>●</span> ACTIVE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.28rem', fontWeight: 600, marginBottom: '6px', color: isSelected ? 'var(--color-primary)' : 'inherit' }}>
                  {palette.name}
                </h3>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 500, marginBottom: '16px' }}>
                  {palette.subtitle}
                </div>

                {/* Color Swatch Bars */}
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  marginBottom: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', height: '48px' }}>
                    <div style={{ flex: 3, background: palette.colors.primary.hex }} title={`Primary: ${palette.colors.primary.name}`} />
                    <div style={{ flex: 2, background: palette.colors.accent.hex }} title={`Accent Gold: ${palette.colors.accent.name}`} />
                    <div style={{ flex: 2, background: palette.colors.background.hex, borderLeft: '1px solid rgba(0,0,0,0.08)' }} title={`Background: ${palette.colors.background.name}`} />
                    <div style={{ flex: 1.5, background: palette.colors.text.hex }} title={`Text: ${palette.colors.text.name}`} />
                  </div>
                </div>

                {/* Color Details Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: palette.colors.primary.hex, display: 'inline-block' }} />
                      <span>Primary Brand</span>
                    </div>
                    <code style={{ fontWeight: 700, fontSize: '0.8rem' }}>{palette.colors.primary.hex}</code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: palette.colors.accent.hex, display: 'inline-block' }} />
                      <span>Accent Gold</span>
                    </div>
                    <code style={{ fontWeight: 700, fontSize: '0.8rem' }}>{palette.colors.accent.hex}</code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: palette.colors.background.hex, border: '1px solid #ddd', display: 'inline-block' }} />
                      <span>Page Canvas</span>
                    </div>
                    <code style={{ fontWeight: 700, fontSize: '0.8rem' }}>{palette.colors.background.hex}</code>
                  </div>
                </div>

                {/* Concept & Psychological Vibe */}
                <p style={{ fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '14px', flex: 1 }}>
                  {palette.concept}
                </p>

                <div style={{ fontSize: '0.74rem', background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic', opacity: 0.8 }}>
                  💡 {palette.industryComparison}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleApplyTheme(palette.id, palette.name)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isSelected ? 'var(--color-primary)' : 'rgba(0,0,0,0.08)',
                    color: isSelected ? '#ffffff' : 'inherit',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.14)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.08)';
                    }
                  }}
                >
                  <span>{isSelected ? '✓ Currently Applied' : 'Apply This Palette'}</span>
                  {!isSelected && <span>→</span>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Live UI Mock Showcase with the Active Palette */}
        <div style={{ 
          background: 'var(--color-surface)', 
          borderRadius: '24px', 
          border: '1.5px solid var(--color-border)', 
          padding: 'clamp(24px, 4vw, 44px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          marginBottom: '64px'
        }}>
          <div style={{ maxWidth: '700px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>
              Interactive Live UI Sample
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 500, marginBottom: '10px' }}>
              How Components Look in &ldquo;{activePalette.name}&rdquo;
            </h2>
            <p style={{ opacity: 0.75, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Every button, badge, header emblem, and price card updates dynamically across the application:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
            
            {/* Mock 1: Luxury Header & Medallion */}
            <div style={{ background: 'var(--color-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.6, marginBottom: '12px' }}>
                1. Header & Brand Typography
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 900, boxShadow: '0 4px 12px var(--color-primary-glow)' }}>
                  H
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontWeight: 600 }}>
                    hair&nature®
                  </div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 800 }}>
                    Natural Temple Remy
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>
                Warm, authoritative typography with gold foil accents that establish immediate heritage.
              </p>
            </div>

            {/* Mock 2: Product Pricing & Customization */}
            <div style={{ background: 'var(--color-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.6, marginBottom: '12px' }}>
                2. Product Page Pricing Tag
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  $148.50
                </span>
                <span style={{ fontSize: '0.82rem', opacity: 0.65 }}>USD / 100g Pack</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                  22 Inches
                </span>
                <span style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                  Natural Black (#1B)
                </span>
                <span style={{ background: 'rgba(43, 138, 62, 0.1)', color: '#2b8a3e', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>
                  In Stock
                </span>
              </div>
              <button className="btn" style={{ width: '100%', padding: '10px' }}>
                Primary Action Button
              </button>
            </div>

            {/* Mock 3: Wholesale Callout Card */}
            <div style={{ background: 'var(--color-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.6, marginBottom: '12px' }}>
                3. B2B Wholesale Quote Card
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text)' }}>
                Direct Factory Floor Bulk Order
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.75, lineHeight: 1.5, marginBottom: '14px' }}>
                Tiered wholesale pricing starting at 1kg with complimentary custom packaging & salon private labeling.
              </p>
              <button className="btn-gold" style={{ width: '100%', padding: '10px' }}>
                <span>✨ Inquire for B2B Pricing</span>
              </button>
            </div>

          </div>
        </div>

        {/* Why the Previous Colors Failed */}
        <div style={{
          background: 'rgba(0,0,0,0.02)',
          borderRadius: '18px',
          border: '1px solid rgba(0,0,0,0.06)',
          padding: 'clamp(20px, 3vw, 32px)',
          maxWidth: '860px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Color Theory & Brand Value Analysis
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', fontSize: '0.88rem', lineHeight: 1.6 }}>
            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(235, 87, 87, 0.06)', borderLeft: '4px solid #eb5757' }}>
              <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '4px' }}>
                Previous Color Scheme
              </div>
              <p style={{ opacity: 0.85, fontSize: '0.82rem' }}>
                The pinkish bubblegum red (<code style={{ color: '#c0392b' }}>#e45258</code>) paired with muddy tan (<code style={{ color: '#8a6d3b' }}>#ebe1d8</code>) created a casual, low-budget candy-shop feel that eroded the perceived value of $200+ raw virgin temple Remy hair.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(43, 138, 62, 0.06)', borderLeft: '4px solid #2b8a3e' }}>
              <div style={{ fontWeight: 700, color: '#2b8a3e', marginBottom: '4px' }}>
                New Professional Standard
              </div>
              <p style={{ opacity: 0.85, fontSize: '0.82rem' }}>
                Deep, authoritative bordeaux, obsidian, and espresso hues anchored by warm champagne gold and porcelain canvas communicate premium European salon pedigree, factory authority, and high wholesale trust.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

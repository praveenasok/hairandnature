"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const WEIGHTS = ['50 Grams', '100 Grams', '150 Grams', '200 Grams'];
const STYLES = ['Natural Straight', 'Natural Wave', 'Body Wave', 'Deep Wave', 'Kinky Curls', 'Afro Curls'];
const COLORS = [
  { name: '#1 Jet Black', hex: '#0e0d12' },
  { name: '#1b Off Black', hex: '#19171d' },
  { name: '#2 Darkest Brown', hex: '#231812' },
  { name: '#4 Medium Brown', hex: '#442f23' },
  { name: '#8 Light Ash Brown', hex: '#5e5549' },
  { name: '#22 Light Blonde', hex: '#f0e6c8' },
  { name: '#613 Bleach Blonde', hex: '#fef5ce' }
];

export default function ProductPage({ title, desc, img, specs = [] }: { title: string, desc: string, img: string, specs?: {label: string, value: string}[] }) {
  const { formatPrice, currency } = useCurrency();
  const [length, setLength] = useState(LENGTHS[0]);
  const [weight, setWeight] = useState(WEIGHTS[1]);
  const [style, setStyle] = useState(STYLES[0]);
  const [color, setColor] = useState(COLORS[0].name);
  const [description, setDescription] = useState(desc);
  
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [unit, setUnit] = useState<string>('unit');
  
  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => setPrices(data || {}))
      .catch(err => console.error("Could not load prices", err));

    fetch('/api/units')
      .then(res => res.json())
      .then(data => {
        if (data && data[title]) {
          setUnit(data[title]);
        }
      })
      .catch(err => console.error("Could not load units", err));

    fetch('/api/descriptions')
      .then(res => res.json())
      .then(data => {
        if (data && data[title]) {
          setDescription(data[title]);
        }
      })
      .catch(err => console.error("Could not load descriptions", err));
  }, [title]);

  const keyWithWeight = `${title}|${length}|${style}|${color}|${weight}`;
  const keyLegacy = `${title}|${length}|${style}|${color}`;

  let currentPrice = prices[keyWithWeight];
  if (currentPrice === undefined && prices[keyLegacy] !== undefined) {
    const base = prices[keyLegacy];
    const mults: Record<string, number> = {
      '50 Grams': 0.55,
      '100 Grams': 1.0,
      '150 Grams': 1.48,
      '200 Grams': 1.95
    };
    currentPrice = Math.round(base * (mults[weight] || 1.0));
  }

  const formattedPriceWithUnit = currentPrice !== undefined ? formatPrice(currentPrice, unit) : '';
  const priceText = currentPrice !== undefined ? ` - ${formattedPriceWithUnit}` : '';
  const whatsappMessage = `Hi, I am interested in ordering the ${title}. \nLength: ${length}\nWeight: ${weight}\nStyle: ${style}\nColor: ${color}${currentPrice ? `\nPrice: ${formattedPriceWithUnit} (${currency})` : ''}`;
  const whatsappUrl = `https://wa.me/919871171978?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={{ paddingTop: 'clamp(90px, 12vh, 130px)', paddingBottom: 'clamp(40px, 8vh, 80px)', minHeight: '100vh', background: 'var(--color-background)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(30px, 5vw, 60px)', alignItems: 'flex-start' }}>
        
        {/* Left Column: Image & Experience */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <img src={img} alt={title} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover', aspectRatio: '4/5', marginBottom: 'clamp(20px, 4vw, 40px)' }} />
          
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '20px', color: 'var(--color-primary)', fontWeight: 700 }}>The {title} Experience</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#222' }}>Premium Quality</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.92rem' }}>Sourced directly from Indian temples, ensuring 100% natural, healthy, and lustrous hair.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(228, 82, 88, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="6.5"/></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#222' }}>Seamless Blend</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.92rem' }}>Designed for maximum comfort and a flawless finish that mimics your natural hair growth.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right Column: Product Details & Builder */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-primary)', fontWeight: 700, lineHeight: 1.15, margin: 0 }}>{title}</h1>
            {currentPrice !== undefined && (
              <div style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {formattedPriceWithUnit}
              </div>
            )}
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', lineHeight: 1.7, marginBottom: '24px', color: '#555' }}>{description}</p>
          
          <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '24px 0' }} />

          {/* Length Options */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Length</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{length}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LENGTHS.map(len => (
                <button 
                  key={len} 
                  onClick={() => setLength(len)}
                  style={{ 
                    padding: '8px 14px', 
                    borderRadius: '8px', 
                    border: len === length ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                    background: len === length ? 'rgba(228, 82, 88, 0.05)' : 'white',
                    color: len === length ? 'var(--color-primary)' : '#444',
                    fontWeight: len === length ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    minHeight: '40px'
                  }}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Options */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Weight</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{weight}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {WEIGHTS.map(w => (
                <button 
                  key={w} 
                  onClick={() => setWeight(w)}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    border: w === weight ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                    background: w === weight ? 'rgba(228, 82, 88, 0.05)' : 'white',
                    color: w === weight ? 'var(--color-primary)' : '#444',
                    fontWeight: w === weight ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    minHeight: '40px'
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Style Options */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Style / Texture</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{style}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STYLES.map(st => (
                <button 
                  key={st} 
                  onClick={() => setStyle(st)}
                  style={{ 
                    padding: '8px 14px', 
                    borderRadius: '8px', 
                    border: st === style ? '2px solid var(--color-primary)' : '1px solid #ddd', 
                    background: st === style ? 'rgba(228, 82, 88, 0.05)' : 'white',
                    color: st === style ? 'var(--color-primary)' : '#444',
                    fontWeight: st === style ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    minHeight: '40px'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Color Options */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#333' }}>Select Premium Color</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'rgba(228, 82, 88, 0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{color}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {COLORS.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  aria-label={c.name}
                  style={{ 
                    width: '38px', height: '38px', borderRadius: '50%', 
                    background: c.hex,
                    border: c.name === color ? '3px solid white' : 'none', 
                    boxShadow: c.name === color ? '0 0 0 2px var(--color-primary)' : '0 2px 5px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Specs Table */}
          {specs.length > 0 && (
            <div style={{ marginBottom: '30px', background: 'white', borderRadius: '12px', padding: ' clamp(16px, 3vw, 20px)', border: '1px solid #eaeaea' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333' }}>Product Specifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {specs.map((spec, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: i === specs.length - 1 ? 'none' : '1px solid #f0f0f0', gap: '10px' }}>
                    <span style={{ color: '#666', fontSize: '0.92rem' }}>{spec.label}</span>
                    <span style={{ color: '#222', fontWeight: 500, fontSize: '0.92rem', textAlign: 'right' }}>
                      {spec.label.toLowerCase().includes('weight') ? weight : spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary Box */}
          <div style={{ background: '#f8f8f8', padding: 'clamp(18px, 4vw, 25px)', borderRadius: '16px', border: '1px solid #e0e0e0' }}>
            <div style={{ marginBottom: '20px', fontSize: '1rem', lineHeight: 1.6, color: '#444' }}>
              Summary: Premium <strong>{title}</strong> in length <strong>{length}</strong>, weight <strong>{weight}</strong>, style <strong>{style}</strong>, and color <strong>{color}</strong>{priceText}.
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-gold" style={{ width: '100%', padding: '16px 20px', fontSize: 'clamp(1rem, 3.5vw, 1.15rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span>Inquire & Order on WhatsApp</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.1 8.1 0 0 1-1.24-4.38c0-4.49 3.66-8.15 8.15-8.15c2.18 0 4.22.85 5.76 2.38a8.09 8.09 0 0 1 2.38 5.77c0 4.49-3.66 8.15-8.15 8.15m4.47-6.09c-.24-.12-1.45-.72-1.68-.8c-.23-.08-.39-.12-.56.12c-.17.25-.66.8-.81.98c-.15.17-.3.2-.54.08c-.24-.12-1.01-.37-1.92-1.18c-.71-.63-1.19-1.42-1.33-1.66c-.14-.24-.02-.37.1-.49c.11-.12.24-.29.37-.43c.12-.14.17-.24.25-.41c.08-.17.04-.31-.02-.43c-.06-.12-.56-1.35-.77-1.85c-.2-.5-.4-.43-.56-.43c-.14 0-.31-.02-.47-.02c-.17 0-.44.06-.67.31c-.23.25-.88.86-.88 2.1c0 1.24.9 2.44 1.02 2.6c.12.17 1.77 2.7 4.29 3.79c.6.26 1.07.41 1.43.53c.6.19 1.15.16 1.58.1c.48-.07 1.45-.6 1.65-1.17c.2-.57.2-1.07.14-1.17c-.06-.1-.22-.18-.46-.3M12 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8"/></svg>
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

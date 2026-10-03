"use client";

import Link from 'next/link';
import { products } from '../../data/products';
import { useCurrency } from '@/context/CurrencyContext';

export default function Shop() {
  const { formatPrice } = useCurrency();

  return (
    <div className="animate-fade-in" style={{ paddingTop: 'clamp(90px, 12vh, 120px)', paddingBottom: 'clamp(40px, 8vh, 80px)', backgroundColor: 'var(--color-white)', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-primary)', marginBottom: '10px', fontWeight: 600 }}>Shop Collection</h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.8, marginBottom: 'clamp(24px, 4vw, 40px)', lineHeight: 1.6 }}>Discover the perfect DIY hair extensions to match your style.</p>
        
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
              <Link href={`/product/${product.id}`} style={{ display: 'block' }}>
                <div style={{ height: '280px', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 'clamp(18px, 3vw, 24px)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#222' }}>{product.name}</h3>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '18px' }}>
                    {formatPrice(product.price, product.unit || 'unit')}
                  </p>
                  <span className="btn" style={{ width: '100%', padding: '12px 20px', fontSize: '0.95rem' }}>View Details</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

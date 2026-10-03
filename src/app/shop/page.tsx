import Link from 'next/link';
import { products } from '../../data/products';

export default function Shop() {
  return (
    <div className="animate-fade-in" style={{ padding: '60px 0', backgroundColor: 'var(--color-white)', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Shop Collection</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '50px' }}>Discover the perfect DIY hair extensions to match your style.</p>
        
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link href={`/product/${product.id}`} style={{ display: 'block' }}>
                <div style={{ height: '350px', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{product.name}</h3>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '20px' }}>₹{product.price}</p>
                  <span className="btn" style={{ width: '100%' }}>View Details</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

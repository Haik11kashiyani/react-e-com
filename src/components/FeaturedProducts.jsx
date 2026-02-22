import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import './FeaturedProducts.css';

const allProducts = [
  {
    id: 1,
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: '$1,299',
    originalPrice: '$1,419',
    tag: 'Best Seller',
    category: 'phone',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: '$1,199',
    originalPrice: '$1,299',
    tag: 'Popular',
    category: 'phone',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    price: '$2,499',
    originalPrice: '$2,799',
    tag: 'Editor\'s Choice',
    category: 'laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
  },
  {
    id: 4,
    name: 'Dell XPS 15',
    brand: 'Dell',
    price: '$1,899',
    originalPrice: '$2,199',
    tag: 'Hot Deal',
    category: 'laptop',
    image: 'https://images.unsplash.com/photo-1593642702749-b7d2a804c22e?w=500&h=500&fit=crop',
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    price: '$799',
    originalPrice: '$899',
    tag: 'New',
    category: 'smartwatch',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop',
  },
  {
    id: 6,
    name: 'Galaxy Watch 6',
    brand: 'Samsung',
    price: '$399',
    originalPrice: '$449',
    tag: 'Value Pick',
    category: 'smartwatch',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
  },
  {
    id: 7,
    name: 'Pixel 8 Pro',
    brand: 'Google',
    price: '$999',
    originalPrice: '$1,099',
    tag: 'AI Powered',
    category: 'phone',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
  },
  {
    id: 8,
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    price: '$1,099',
    originalPrice: '$1,199',
    tag: 'Creative',
    category: 'tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
  },
  {
    id: 9,
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: '$348',
    originalPrice: '$399',
    tag: 'Top Rated',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
  },
  {
    id: 10,
    name: 'AirPods Pro 2',
    brand: 'Apple',
    price: '$249',
    originalPrice: '$279',
    tag: 'Must Have',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&h=500&fit=crop',
  },
  {
    id: 11,
    name: 'ThinkPad X1 Carbon',
    brand: 'Lenovo',
    price: '$1,549',
    originalPrice: '$1,799',
    tag: 'Business',
    category: 'laptop',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
  },
  {
    id: 12,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: '$799',
    originalPrice: '$899',
    tag: 'Flagship Killer',
    category: 'phone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
  },
];

const ITEMS_PER_PAGE = 6;

function FeaturedProducts() {
  const [page, setPage] = useState(0);
  const [fade, setFade] = useState(false);
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  // Auto-rotate every 6s
  useEffect(() => {
    const id = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setPage((prev) => (prev + 1) % totalPages);
        setFade(false);
      }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, [totalPages]);

  const visibleProducts = allProducts.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section className="featured-section">
      <div className="featured-header">
        <div className="featured-header__left">
          <span className="featured-eyebrow">Curated for You</span>
          <h2 className="featured-title">Featured Products</h2>
        </div>
        <div className="featured-header__right">
          <div className="featured-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`featured-dot ${page === i ? 'active' : ''}`}
                onClick={() => {
                  setFade(true);
                  setTimeout(() => { setPage(i); setFade(false); }, 300);
                }}
              />
            ))}
          </div>
          <button className="featured-view-all">View All <ArrowRight size={14} /></button>
        </div>
      </div>

      {/* Progress */}
      <div className="featured-progress">
        <div className="featured-progress__bar" key={page} />
      </div>

      {/* Grid */}
      <div className={`featured-grid ${fade ? 'fading' : ''}`}>
        {visibleProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card__img-wrap">
              <span className="product-card__tag">{product.tag}</span>
              <img src={product.image} alt={product.name} loading="lazy" />
              <button className="product-card__quick-view">Quick View</button>
            </div>
            <div className="product-card__info">
              <span className="product-card__brand">{product.brand}</span>
              <h3 className="product-card__name">{product.name}</h3>
              <div className="product-card__price-row">
                <span className="product-card__price">{product.price}</span>
                <span className="product-card__old-price">{product.originalPrice}</span>
              </div>
              <button className="product-card__atc">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, SlidersHorizontal, Search, Star, ArrowUpRight } from 'lucide-react';
import { allProducts, categories } from '../data/products';
import { useCart } from '../hooks/useCart';
import { SplitText, FadeIn, StaggerContainer, RevealText } from '../components/common/AnimatedComponents';
import './Products.css';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Products() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const filteredProducts = useMemo(() => {
    let products = activeCategory === 'all'
      ? [...allProducts]
      : allProducts.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low': products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating': products.sort((a, b) => b.rating - a.rating); break;
      case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return products;
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <section className="products-hero">
        <div className="products-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">Our Collection</span>
          </FadeIn>
          <h1 className="products-hero__title">
            <SplitText type="words" stagger={0.06}>Explore Our Products</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="products-hero__sub">
              Discover premium tech curated for the modern lifestyle. Every product handpicked for quality, design, and innovation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="products-filters">
        <div className="products-filters__inner">
          {/* Search */}
          <div className="products-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="products-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon && <cat.icon size={15} />}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & View */}
          <div className="products-sort-row">
            <div className="sort-select-wrap">
              <SlidersHorizontal size={14} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="7" height="7" rx="1" fill="currentColor"/><rect x="9" y="0" width="7" height="7" rx="1" fill="currentColor"/><rect x="0" y="9" width="7" height="7" rx="1" fill="currentColor"/><rect x="9" y="9" width="7" height="7" rx="1" fill="currentColor"/></svg>
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="1" width="16" height="3" rx="1" fill="currentColor"/><rect x="0" y="6.5" width="16" height="3" rx="1" fill="currentColor"/><rect x="0" y="12" width="16" height="3" rx="1" fill="currentColor"/></svg>
              </button>
            </div>
            <span className="products-count">{filteredProducts.length} products</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + sortBy + searchQuery}
            className={`products-grid ${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="p-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link to={`/products/${product.id}`} className="p-card__link">
                    <div className="p-card__img-wrap">
                      <span className="p-card__tag">{product.tag}</span>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <div className="p-card__overlay">
                        <span className="p-card__view">
                          View Details <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-card__info">
                    <span className="p-card__brand">{product.brand}</span>
                    <h3 className="p-card__name">{product.name}</h3>
                    <div className="p-card__rating">
                      <Star size={13} fill="#f1c40f" color="#f1c40f" />
                      <span>{product.rating}</span>
                      <span className="p-card__reviews">({product.reviews.toLocaleString()})</span>
                    </div>
                    <div className="p-card__price-row">
                      <span className="p-card__price">${product.price.toLocaleString()}</span>
                      <span className="p-card__old-price">${product.originalPrice.toLocaleString()}</span>
                      <span className="p-card__discount">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="p-card__actions">
                      <button
                        className="p-card__atc"
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                      <button className="p-card__wish">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

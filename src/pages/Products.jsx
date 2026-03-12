import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'; // eslint-disable-line -- motion used as motion.div
import {
  ShoppingCart, Heart, SlidersHorizontal, Search, Star,
  ArrowUpRight, ArrowRight, Zap, Shield, Truck, Award,
  ChevronRight, TrendingUp, Sparkles, LayoutGrid, Columns3,
  Package, Clock, BadgeCheck
} from 'lucide-react';
import { allProducts, categories } from '../data/products';
import { useCart } from '../hooks/useCart';
import { SplitText, FadeIn, StaggerContainer, RevealText } from '../components/common/AnimatedComponents';
import ProductCompare from '../components/ProductCompare';
import './Products.css';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const trustBadges = [
  { icon: Shield, label: '2-Year Warranty', desc: 'Full coverage' },
  { icon: Truck, label: 'Free Shipping', desc: 'Orders over $99' },
  { icon: Clock, label: '24/7 Support', desc: 'Always available' },
  { icon: BadgeCheck, label: 'Certified Authentic', desc: '100% genuine' },
];

export default function Products() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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

  const topPicks = allProducts.filter(p => p.rating >= 4.7).slice(0, 5);

  return (
    <div className="products-page">
      {/* ===== CINEMATIC HERO ===== */}
      <section className="products-hero" ref={heroRef}>
        <motion.div
          className="products-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="products-hero__inner">
            <FadeIn delay={0.1}>
              <div className="hero-badge">
                <Sparkles size={13} />
                <span>Curated Collection</span>
                <span className="hero-badge__count">{allProducts.length} Products</span>
              </div>
            </FadeIn>
            <h1 className="products-hero__title">
              <SplitText type="words" stagger={0.06}>Premium Tech</SplitText>
              <br />
              <span className="products-hero__title-accent">
                <SplitText type="words" stagger={0.06} delay={0.3}>Curated For You</SplitText>
              </span>
            </h1>
            <FadeIn delay={0.6}>
              <p className="products-hero__sub">
                Every product handpicked for quality, design, and innovation.
                Experience technology that elevates your lifestyle.
              </p>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div className="hero-actions">
                <a href="#products-grid" className="hero-cta">
                  Explore Collection <ArrowRight size={16} />
                </a>
                <a href="#compare-section" className="hero-cta hero-cta--outline">
                  Compare Products
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Floating product showcase */}
          <div className="hero-showcase">
            {topPicks.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                className={`hero-float-card hero-float-card--${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={product.image} alt={product.name} />
                <div className="hero-float-card__info">
                  <span className="hero-float-card__name">{product.name}</span>
                  <span className="hero-float-card__price">${product.price.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated gradient mesh */}
        <div className="hero-mesh" />
        <div className="hero-grain" />
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="trust-bar">
        <div className="trust-bar__inner">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              className="trust-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="trust-item__icon">
                <badge.icon size={20} />
              </div>
              <div className="trust-item__text">
                <span className="trust-item__label">{badge.label}</span>
                <span className="trust-item__desc">{badge.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TRENDING PICKS ===== */}
      <section className="trending-section">
        <div className="trending-header">
          <div className="trending-header__left">
            <span className="section-tag"><TrendingUp size={13} /> Trending Now</span>
            <h2 className="trending-title">Most Popular Picks</h2>
          </div>
          <Link to="/products" className="trending-see-all">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="trending-scroll">
          <div className="trending-track">
            {topPicks.map((product, i) => (
              <motion.div
                key={product.id}
                className="trending-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link to={`/products/${product.id}`} className="trending-card__link">
                  <div className="trending-card__img">
                    <span className="trending-card__rank">#{i + 1}</span>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="trending-card__info">
                    <span className="trending-card__brand">{product.brand}</span>
                    <h4 className="trending-card__name">{product.name}</h4>
                    <div className="trending-card__meta">
                      <Star size={12} fill="#f1c40f" color="#f1c40f" />
                      <span>{product.rating}</span>
                      <span className="trending-card__price">${product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FILTERS BAR ===== */}
      <section className="products-filters" id="products-grid">
        <div className="products-filters__inner">
          <div className="filters-top-row">
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
                  aria-label="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <Columns3 size={15} />
                </button>
              </div>
              <span className="products-count">{filteredProducts.length} products</span>
            </div>
          </div>

          {/* Categories */}
          <div className="products-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon && <cat.icon size={14} />}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS GRID ===== */}
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
                <Package size={48} strokeWidth={1} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`p-card ${index === 0 && viewMode === 'grid' ? 'p-card--featured' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/products/${product.id}`} className="p-card__link">
                    <div className="p-card__img-wrap">
                      <span className="p-card__tag">{product.tag}</span>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <div className="p-card__overlay">
                        <span className="p-card__view">
                          Quick View <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-card__info">
                    <div className="p-card__info-top">
                      <span className="p-card__brand">{product.brand}</span>
                      <div className="p-card__rating">
                        <Star size={12} fill="#f1c40f" color="#f1c40f" />
                        <span>{product.rating}</span>
                        <span className="p-card__reviews">({product.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                    <h3 className="p-card__name">{product.name}</h3>
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
                      <button
                        className={`p-card__wish ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                      >
                        <Heart size={16} fill={isInWishlist(product.id) ? '#ff4d4d' : 'none'} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-banner">
        <motion.div
          className="promo-banner__inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="promo-banner__content">
            <span className="promo-badge"><Zap size={14} /> Limited Offer</span>
            <h2 className="promo-title">Up to 30% Off Premium Tech</h2>
            <p className="promo-sub">
              Free shipping on orders over $99. 2-year warranty included.
              Experience technology that defines tomorrow.
            </p>
            <Link to="/products" className="promo-cta">
              Shop the Sale <ArrowRight size={16} />
            </Link>
          </div>
          <div className="promo-banner__visual">
            <div className="promo-orb promo-orb--1" />
            <div className="promo-orb promo-orb--2" />
          </div>
        </motion.div>
      </section>

      {/* ===== PRODUCT COMPARISON ===== */}
      <div id="compare-section">
        <ProductCompare />
      </div>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-section">
        <div className="why-section__inner">
          <motion.div
            className="why-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag"><Award size={13} /> Why Techorbit</span>
            <h2 className="why-title">The Techorbit Difference</h2>
            <p className="why-sub">
              We obsess over every detail so you can focus on what matters.
            </p>
          </motion.div>
          <div className="why-grid">
            {[
              { icon: Shield, title: 'Authenticated Products', desc: 'Every product goes through a rigorous authentication process to ensure 100% genuineness.' },
              { icon: Truck, title: 'Lightning-Fast Delivery', desc: 'Get your order in 1-3 business days with real-time tracking and premium packaging.' },
              { icon: Zap, title: 'Premium Support', desc: 'Our expert team is available 24/7 via chat, email, or phone to help you.' },
              { icon: Award, title: 'Best Price Guarantee', desc: 'Found it cheaper elsewhere? We will match the price and give you an extra 5% off.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="why-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="why-card__icon">
                  <item.icon size={24} />
                </div>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

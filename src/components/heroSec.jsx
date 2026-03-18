import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { ArrowRight, Sparkles, ShoppingBag, Star, Zap, Shield, Truck } from 'lucide-react';
import { allProducts as staticProducts } from '../data/products';
import { fetchProducts } from '../utils/api';
import './heroSec.css';

const stats = [
  { num: '50K+', label: 'Happy Customers' },
  { num: '500+', label: 'Premium Products' },
  { num: '4.9', label: 'Average Rating' },
  { num: '24/7', label: 'Expert Support' },
];

const badges = [
  { icon: Zap, text: 'Same Day Delivery' },
  { icon: Shield, text: '2-Year Warranty' },
  { icon: Truck, text: 'Free Shipping $99+' },
];

function HeroSec() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [heroProducts, setHeroProducts] = useState(staticProducts.slice(0, 4));
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    fetchProducts({ limit: 4 })
      .then((res) => {
        if (res.data.products?.length) setHeroProducts(res.data.products.slice(0, 4));
      })
      .catch(() => { /* keep static */ });
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setActiveProduct((p) => (p + 1) % heroProducts.length), 4000);
    return () => clearInterval(iv);
  }, [heroProducts.length]);

  const current = heroProducts[activeProduct];

  return (
    <div className="hero-wrap" ref={containerRef}>
      {/* Marquee Banner — only on home */}
      <div className="hero-marquee-banner">
        <div className="hero-marquee-track">
          {[...Array(4)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              <span>New Arrivals Available</span>
              <span className="hero-marquee-dot">&#x2022;</span>
              <span>Free Shipping on $99+</span>
              <span className="hero-marquee-dot">&#x2022;</span>
              <span>Premium Tech Curated For You</span>
              <span className="hero-marquee-dot">&#x2022;</span>
              <span>24/7 Expert Support</span>
              <span className="hero-marquee-dot">&#x2022;</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ===== HERO MAIN ===== */}
      <section className="hero-section">
        <motion.div className="hero-bg-orbs" style={{ opacity }}>
          <div className="hero-orb hero-orb--1" />
          <div className="hero-orb hero-orb--2" />
          <div className="hero-orb hero-orb--3" />
        </motion.div>

        <div className="hero-inner">
          {/* Left Content */}
          <motion.div className="hero-content" style={{ y: y2 }}>
            <motion.div
              className="hero-eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>The Future of Tech Shopping</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover
              <br />
              <span className="hero-title-accent">Tomorrow's</span>
              <br />
              Technology.
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Curated premium gadgets, handpicked for performance,
              design, and innovation. Experience tech that defines the future.
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/products" className="hero-btn-primary">
                <ShoppingBag size={18} />
                <span>Shop Collection</span>
                <ArrowRight size={16} className="hero-btn-arrow" />
              </Link>
              <Link to="/about" className="hero-btn-outline">
                Our Story
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="hero-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {badges.map((b, i) => (
                <div className="hero-badge" key={i}>
                  <b.icon size={14} />
                  <span>{b.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Product Showcase */}
          <motion.div className="hero-showcase" style={{ y: y1 }}>
            <div className="hero-showcase__stage">
              <div className="hero-ring" />
              <div className="hero-ring hero-ring--2" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct}
                  className="hero-product-card"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="hero-product-img">
                    <img src={current.image} alt={current.name} />
                    <span className="hero-product-tag">{current.tag}</span>
                  </div>
                  <div className="hero-product-info">
                    <span className="hero-product-brand">{current.brand}</span>
                    <h3 className="hero-product-name">{current.name}</h3>
                    <div className="hero-product-meta">
                      <div className="hero-product-rating">
                        <Star size={13} fill="#FFB800" stroke="#FFB800" />
                        <span>{current.rating}</span>
                      </div>
                      <span className="hero-product-price">${current.price.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="hero-dots">
                {heroProducts.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-dot ${i === activeProduct ? 'active' : ''}`}
                    onClick={() => setActiveProduct(i)}
                  />
                ))}
              </div>
            </div>


          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="hero-stats">
        <div className="hero-stats__inner">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="hero-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className="hero-stat__num">{s.num}</span>
              <span className="hero-stat__label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HeroSec;

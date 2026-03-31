import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { ArrowRight, ShoppingCart, Star, Sparkles, Heart } from 'lucide-react';
import { fetchProducts } from '../utils/api';
import { useCart } from '../hooks/useCart';
import LazyImage from './common/LazyImage';
import './FeaturedProducts.css';

const VISIBLE = 4;

function FeaturedProducts() {
  const [page, setPage] = useState(0);
  const [featured, setFeatured] = useState([]);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    fetchProducts({ limit: 8 })
      .then((res) => {
        setFeatured(res.data.products?.slice(0, 8) || []);
        setPage(0);
      })
      .catch(() => {
        setFeatured([]);
      });
  }, []);

  const totalPages = Math.max(1, Math.ceil(featured.length / VISIBLE));

  useEffect(() => {
    const iv = setInterval(() => setPage((p) => (p + 1) % totalPages), 7000);
    return () => clearInterval(iv);
  }, [totalPages]);

  const visible = featured.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  return (
    <section className="fp-section">
      <div className="fp-inner">
        {/* Header */}
        <div className="fp-header">
          <motion.div
            className="fp-header__left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="fp-eyebrow"><Sparkles size={13} /> Curated For You</span>
            <h2 className="fp-title">Featured Products</h2>
            <p className="fp-sub">Handpicked tech that stands above the rest.</p>
          </motion.div>
          <motion.div
            className="fp-header__right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="fp-page-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`fp-dot ${page === i ? 'active' : ''}`}
                  onClick={() => setPage(i)}
                />
              ))}
            </div>
            <Link to="/products" className="fp-view-all">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="fp-progress">
          <motion.div
            className="fp-progress__fill"
            key={page}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 7, ease: 'linear' }}
          />
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            className="fp-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {visible.length === 0 ? (
              <div className="fp-empty">No featured products available.</div>
            ) : visible.map((product, i) => (
              <motion.div
                key={product.id}
                className="fp-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link to={`/products/${product.id}`} className="fp-card__img-wrap">
                  <span className="fp-card__tag">{product.tag}</span>
                  <LazyImage src={product.image} alt={product.name} />
                  <div className="fp-card__overlay">
                    <span>View Details <ArrowRight size={14} /></span>
                  </div>
                </Link>
                <div className="fp-card__body">
                  <div className="fp-card__top">
                    <span className="fp-card__brand">{product.brand}</span>
                    <div className="fp-card__rating">
                      <Star size={12} fill="#FFB800" stroke="#FFB800" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="fp-card__name">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="fp-card__bottom">
                    <div className="fp-card__prices">
                      <span className="fp-card__price">${product.price.toLocaleString()}</span>
                      <span className="fp-card__old">${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="fp-card__actions">
                      <button
                        className={`fp-card__wish ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart size={14} fill={isInWishlist(product.id) ? '#ff4d4d' : 'none'} />
                      </button>
                      <button
                        className="fp-card__atc"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FeaturedProducts;

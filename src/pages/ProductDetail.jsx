import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line -- motion used as motion.div/img
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronLeft, Minus, Plus, ArrowUpRight, Sparkles, CheckCircle } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import { useCart } from '../hooks/useCart';
import { FadeIn, SplitText, RevealText, ScaleIn } from '../components/common/AnimatedComponents';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState('features');

  useEffect(() => {
    const p = getProductById(id);
    if (!p) { navigate('/products'); return; }
    setProduct(p);
    setRelated(getRelatedProducts(id));
    setSelectedImage(0);
    setQty(1);
    setSelectedColor(0);
  }, [id, navigate]);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <FadeIn delay={0.1}>
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
      </FadeIn>

      {/* Main Section */}
      <section className="pd-main">
        {/* Gallery */}
        <div className="pd-gallery">
          <FadeIn delay={0.1} direction="left">
            <div className="pd-gallery__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </FadeIn>
          <ScaleIn delay={0.2}>
            <div className="pd-gallery__main">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              <span className="pd-discount-badge">-{discount}%</span>
            </div>
          </ScaleIn>
        </div>

        {/* Info */}
        <div className="pd-info">
          <FadeIn delay={0.2}>
            <span className="pd-info__brand">{product.brand}</span>
          </FadeIn>

          <RevealText delay={0.3}>
            <h1 className="pd-info__name">{product.name}</h1>
          </RevealText>

          <FadeIn delay={0.35}>
            <div className="pd-info__rating">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(product.rating) ? '#f1c40f' : 'none'} color={i < Math.round(product.rating) ? '#f1c40f' : '#ddd'} />
                ))}
              </div>
              <span className="pd-rating-text">{product.rating}</span>
              <span className="pd-review-count">({product.reviews.toLocaleString()} reviews)</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="pd-info__price">
              <span className="pd-price">${product.price.toLocaleString()}</span>
              <span className="pd-old-price">${product.originalPrice.toLocaleString()}</span>
              <span className="pd-save">Save ${(product.originalPrice - product.price).toLocaleString()}</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <p className="pd-info__desc">{product.description}</p>
          </FadeIn>

          {/* Colors */}
          {product.colors && product.colors.length > 1 && (
            <FadeIn delay={0.5}>
              <div className="pd-info__colors">
                <span className="pd-label">Color</span>
                <div className="pd-color-swatches">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      className={`pd-swatch ${selectedColor === i ? 'active' : ''}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(i)}
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Quantity & Add to Cart */}
          <FadeIn delay={0.55}>
            <div className="pd-info__actions">
              <div className="pd-qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
              </div>
              <button className="pd-atc pill-btn pill-btn-primary" onClick={() => addToCart(product, qty)}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                className={`pd-wish-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? '#ff4d4d' : 'none'} />
              </button>
            </div>
          </FadeIn>

          {/* Guarantees */}
          <FadeIn delay={0.6}>
            <div className="pd-guarantees">
              <div className="pd-guarantee">
                <Truck size={18} />
                <div>
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>
              <div className="pd-guarantee">
                <Shield size={18} />
                <div>
                  <strong>2 Year Warranty</strong>
                  <span>Full coverage</span>
                </div>
              </div>
              <div className="pd-guarantee">
                <RefreshCw size={18} />
                <div>
                  <strong>Easy Returns</strong>
                  <span>30 day return policy</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pd-tabs-section">
        <div className="pd-tabs">
          {['features', 'specs', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pd-tab-content"
          >
            {activeTab === 'features' && (
              <div className="pd-features-grid">
                {product.features.map((f, i) => (
                  <div key={i} className="pd-feature-item">
                    <span className="pd-feature-bullet"><Sparkles size={14} /></span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="pd-specs">
                <div className="pd-spec-row"><span>Brand</span><span>{product.brand}</span></div>
                <div className="pd-spec-row"><span>Category</span><span style={{textTransform:'capitalize'}}>{product.category}</span></div>
                <div className="pd-spec-row"><span>Rating</span><span>{product.rating} / 5</span></div>
                <div className="pd-spec-row"><span>In Stock</span><span>{product.inStock ? 'Yes' : 'No'}</span></div>
                {product.features.map((f, i) => (
                  <div key={i} className="pd-spec-row"><span>Feature {i+1}</span><span>{f}</span></div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="pd-reviews-placeholder">
                <p><Star size={15} fill="#FFB800" stroke="#FFB800" style={{verticalAlign:'middle', marginRight: 4}} />{product.reviews.toLocaleString()} verified reviews</p>
                <p>Average rating: {product.rating} out of 5</p>
                <div className="pd-review-bars">
                  {[5,4,3,2,1].map((star) => (
                    <div key={star} className="pd-review-bar">
                      <span>{star}<Star size={12} fill="#FFB800" stroke="#FFB800" style={{verticalAlign:'middle', marginLeft: 2}} /></span>
                      <div className="pd-bar-bg">
                        <motion.div
                          className="pd-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                          transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd-related">
          <FadeIn>
            <h2 className="pd-related__title">You May Also Like</h2>
          </FadeIn>
          <div className="pd-related__grid">
            {related.map((rp, i) => (
              <FadeIn key={rp.id} delay={i * 0.1}>
                <Link to={`/products/${rp.id}`} className="pd-related__card">
                  <div className="pd-related__img">
                    <img src={rp.image} alt={rp.name} loading="lazy" />
                  </div>
                  <div className="pd-related__info">
                    <span className="pd-related__brand">{rp.brand}</span>
                    <h4>{rp.name}</h4>
                    <span className="pd-related__price">${rp.price.toLocaleString()}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

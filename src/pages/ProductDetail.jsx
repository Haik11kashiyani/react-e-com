import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line -- motion used as motion.div/img
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronLeft, Minus, Plus, ArrowUpRight, Sparkles, CheckCircle } from 'lucide-react';
import { fetchProductById, fetchRelatedProducts, fetchReviews, submitReview } from '../utils/api';
import { useCart } from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { FadeIn, SplitText, RevealText, ScaleIn } from '../components/common/AnimatedComponents';
import LazyImage from '../components/common/LazyImage';
import { SkeletonProductDetail as SkeletonPD } from '../components/common/UserSkeleton';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState('features');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([fetchProductById(id), fetchRelatedProducts(id), fetchReviews({ productId: id })])
      .then(([productRes, relatedRes, reviewsRes]) => {
        if (cancelled) return;

        const nextProduct = productRes.data?.product;
        if (!nextProduct) {
          navigate('/products');
          return;
        }

        setProduct(nextProduct);
        setRelated(relatedRes.data?.products || []);
        setReviews(reviewsRes.data?.reviews || []);
        setReviewSummary(reviewsRes.data?.summary || null);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load product right now.');
          setProduct(null);
          setRelated([]);
          setReviews([]);
          setReviewSummary(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    setSelectedImage(0);
    setQty(1);
    setSelectedColor(0);
    return () => { cancelled = true; };
  }, [id, navigate]);

  if (loading) return <SkeletonPD />;
  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="pd-breadcrumb">
          <Link to="/products">Back to Products</Link>
        </div>
        <section className="pd-main">
          <div className="pd-info">
            <h1 className="pd-info__name">{error || 'Product not found'}</h1>
          </div>
        </section>
      </div>
    );
  }

  const galleryImages = product.images?.length ? product.images : [product.image].filter(Boolean);
  const productFeatures = product.features || [];
  const productColors = product.colors || [];
  const originalPrice = product.originalPrice || product.price || 0;
  const price = product.price || 0;

  const discount = originalPrice > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const displayedRating = reviewSummary?.averageRating ?? product.rating;
  const displayedReviewCount = reviewSummary?.totalReviews ?? product.reviews;

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewError('Please login to submit your review');
      return;
    }

    if (!reviewForm.text.trim()) {
      setReviewError('Please write your review');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    try {
      await submitReview({
        productId: id,
        rating: Number(reviewForm.rating),
        text: reviewForm.text.trim(),
      });

      const [productRes, reviewsRes] = await Promise.all([
        fetchProductById(id),
        fetchReviews({ productId: id }),
      ]);
      setProduct(productRes.data?.product || product);
      setReviews(reviewsRes.data?.reviews || []);
      setReviewSummary(reviewsRes.data?.summary || null);
      setReviewForm({ rating: 5, text: '' });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Unable to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

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
              {galleryImages.map((img, i) => (
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
                  src={galleryImages[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {discount > 0 && <span className="pd-discount-badge">-{discount}%</span>}
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
                    <Star key={i} size={16} fill={i < Math.round(displayedRating) ? '#f1c40f' : 'none'} color={i < Math.round(displayedRating) ? '#f1c40f' : '#ddd'} />
                ))}
              </div>
                <span className="pd-rating-text">{displayedRating}</span>
                <span className="pd-review-count">({displayedReviewCount.toLocaleString()} reviews)</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="pd-info__price">
              <span className="pd-price">₹{price.toLocaleString()}</span>
              {originalPrice > price && <span className="pd-old-price">₹{originalPrice.toLocaleString()}</span>}
              {originalPrice > price && <span className="pd-save">Save ₹{(originalPrice - price).toLocaleString()}</span>}
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <p className="pd-info__desc">{product.description}</p>
          </FadeIn>

          {/* Colors */}
          {productColors.length > 1 && (
            <FadeIn delay={0.5}>
              <div className="pd-info__colors">
                <span className="pd-label">Color</span>
                <div className="pd-color-swatches">
                  {productColors.map((color, i) => (
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
                  <span>On orders over ₹50</span>
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
                {productFeatures.map((f, i) => (
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
                <div className="pd-spec-row"><span>Rating</span><span>{displayedRating} / 5</span></div>
                <div className="pd-spec-row"><span>In Stock</span><span>{product.inStock ? 'Yes' : 'No'}</span></div>
                {productFeatures.map((f, i) => (
                  <div key={i} className="pd-spec-row"><span>Feature {i+1}</span><span>{f}</span></div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="pd-reviews-placeholder">
                <p><Star size={15} fill="#FFB800" stroke="#FFB800" style={{verticalAlign:'middle', marginRight: 4}} />{displayedReviewCount.toLocaleString()} reviews</p>
                <p>Average rating: {displayedRating} out of 5</p>
                <div className="pd-review-bars">
                  {[5,4,3,2,1].map((star) => (
                    <div key={star} className="pd-review-bar">
                      <span>{star}<Star size={12} fill="#FFB800" stroke="#FFB800" style={{verticalAlign:'middle', marginLeft: 2}} /></span>
                      <div className="pd-bar-bg">
                        <motion.div
                          className="pd-bar-fill"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${reviewSummary?.totalReviews
                              ? ((reviewSummary?.distribution?.[star] || 0) / reviewSummary.totalReviews) * 100
                              : 0}%`,
                          }}
                          transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 22 }}>
                  <h4 style={{ marginBottom: 10 }}>Write a review</h4>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                    >
                      {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                    <textarea
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder={user ? 'Share your experience with this product...' : 'Login to write a review'}
                      rows={4}
                      style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                    />
                    {reviewError && <p style={{ color: '#ef4444', margin: 0 }}>{reviewError}</p>}
                    <button className="pill-btn pill-btn-primary" onClick={handleSubmitReview} disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
                  {reviews.length ? reviews.slice(0, 8).map((review) => (
                    <div key={review._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                        <strong>{review.name}</strong>
                        <span style={{ color: '#6b7280', fontSize: 12 }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.round(review.rating) ? '#f1c40f' : 'none'} color={i < Math.round(review.rating) ? '#f1c40f' : '#d1d5db'} />
                        ))}
                        {review.isVerifiedPurchase && <span style={{ marginLeft: 8, color: '#16a34a', fontSize: 12 }}>Verified Purchase</span>}
                      </div>
                      <p style={{ margin: 0 }}>{review.text}</p>
                    </div>
                  )) : <p style={{ color: '#6b7280' }}>No reviews yet. Be the first to review this product.</p>}
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
                    <LazyImage src={rp.image} alt={rp.name} />
                  </div>
                  <div className="pd-related__info">
                    <span className="pd-related__brand">{rp.brand}</span>
                    <h4>{rp.name}</h4>
                    <span className="pd-related__price">₹{rp.price.toLocaleString()}</span>
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

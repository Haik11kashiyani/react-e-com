import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line -- used as motion.div in JSX
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { fetchProducts } from '../utils/api';
import { SplitText, FadeIn, StaggerContainer } from '../components/common/AnimatedComponents';
import { staggerItem } from '../components/common/animationVariants';
import LazyImage from '../components/common/LazyImage';
import './Wishlist.css';

export default function Wishlist() {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user } = useAuth();
  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    fetchProducts()
      .then((res) => {
        setAllProducts(res.data.products || []);
      })
      .catch(() => {
        setAllProducts([]);
      });
  }, []);

  const wishItems = allProducts.filter((p) => wishlist.includes(p._id || p.id));

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const removeItem = (id) => toggleWishlist(id);

  if (!user) {
    return (
      <div className="wishlist-page" style={{ paddingTop: '200px', textAlign: 'center' }}>
        <h2>Please log in to view your wishlist</h2>
        <Link to="/login" className="pill-btn pill-btn-primary" style={{ marginTop: '1rem' }}>Login</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* Hero */}
      <section className="wishlist-hero">
        <div className="wishlist-hero__inner">
          <FadeIn delay={0.1}><span className="eyebrow-tag">Wishlist</span></FadeIn>
          <h1 className="wishlist-hero__title">
            <SplitText type="words" stagger={0.06}>Your Wishlist</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="wishlist-hero__sub">{wishItems.length} saved {wishItems.length === 1 ? 'item' : 'items'}</p>
          </FadeIn>
        </div>
      </section>

      {wishItems.length === 0 ? (
        <section className="wishlist-empty section">
          <motion.div className="wishlist-empty__inner" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="wishlist-empty__icon"><Heart size={48} /></div>
            <h2>Your wishlist is empty</h2>
            <p>Browse our products and save the ones you love.</p>
            <Link to="/products" className="pill-btn pill-btn-primary"><ArrowLeft size={16} /> Explore Products</Link>
          </motion.div>
        </section>
      ) : (
        <section className="wishlist-content section">
          <StaggerContainer className="wishlist-grid" stagger={0.08}>
            {wishItems.map((product) => (
              <motion.div key={product.id} variants={staggerItem} className="wishlist-card" layout>
                <div className="wishlist-card__img">
                  <Link to={`/products/${product.id}`}>
                    <LazyImage src={product.image} alt={product.name} />
                  </Link>
                  <button className="wishlist-card__remove" onClick={() => removeItem(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="wishlist-card__body">
                  <span className="wishlist-card__brand">{product.brand}</span>
                  <Link to={`/products/${product.id}`} className="wishlist-card__name">{product.name}</Link>
                  <div className="wishlist-card__rating">
                    <Star size={13} fill="#FFB800" stroke="#FFB800" />
                    <span>{product.rating}</span>
                    <span className="wishlist-card__reviews">({product.reviews})</span>
                  </div>
                  <div className="wishlist-card__bottom">
                    <div className="wishlist-card__price">
                      <span className="wishlist-card__current">₹{product.price}</span>
                      {product.originalPrice && <span className="wishlist-card__original">₹{product.originalPrice}</span>}
                    </div>
                    <button className="pill-btn pill-btn-green pill-btn-sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart size={14} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>
      )}
    </div>
  );
}

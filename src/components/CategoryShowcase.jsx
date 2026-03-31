import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import { X, ChevronRight } from 'lucide-react';
import './CategoryShowcase.css';
import { allProducts } from '../data/products';

const categoryShowcaseData = [
  {
    id: 'phone',
    name: 'Smartphones',
    description: 'Latest flagship devices with cutting-edge technology',
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800&h=600&fit=crop',
    icon: '📱',
  },
  {
    id: 'laptop',
    name: 'Ultra-Thin Laptops',
    description: 'Powerful performance in a slim, portable design',
    image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde08f?w=800&h=600&fit=crop',
    icon: '💻',
  },
  {
    id: 'smartwatch',
    name: 'Smart Wearables',
    description: 'Connected devices for your active lifestyle',
    image: 'https://images.unsplash.com/photo-1523292335684-6eb646ffb429?w=800&h=600&fit=crop',
    icon: '⌚',
  },
  {
    id: 'audio',
    name: '4K Displays',
    description: 'Crystal clear visuals for immersive viewing',
    image: 'https://images.unsplash.com/photo-1593642532400-2682a8a6b979?w=800&h=600&fit=crop',
    icon: '📺',
  },
  {
    id: 'tablet',
    name: 'Tablets',
    description: 'Versatile devices for work and entertainment',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    icon: '📲',
  },
];

function CategoryShowcase() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((p) => p.category === categoryId).slice(0, 6);
  };

  return (
    <>
      <section className="cs-section cs-section--compact">
        <div className="cs-inner">
          <motion.div
            className="cs-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="cs-eyebrow">Browse by Category</span>
            <h2 className="cs-title">Shop What You Love</h2>
          </motion.div>

          <div className="cs-grid">
            {categoryShowcaseData.map((cat, idx) => (
              <motion.button
                key={cat.id}
                className="cs-card"
                onClick={() => setSelectedCategory(cat)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="cs-card__img">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <div className="cs-card__overlay" />
                
                <div className="cs-card__hover-text">
                  <span className="cs-card__click-me">CLICK ME</span>
                </div>

                <div className="cs-card__content">
                  <div className="cs-card__icon">{cat.icon}</div>
                  <div className="cs-card__text">
                    <h3>{cat.name}</h3>
                    <span>{cat.description}</span>
                  </div>
                  <div className="cs-card__arrow">→</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Sidebar */}
      {selectedCategory && (
        <>
          <div className="cs-sidebar-overlay" onClick={() => setSelectedCategory(null)} />
          <div className="cs-sidebar">
            <button className="cs-sidebar__close" onClick={() => setSelectedCategory(null)}>
              <X size={24} />
            </button>

            <div className="cs-sidebar__header">
              <div className="cs-sidebar__icon">{selectedCategory.icon}</div>
              <h2 className="cs-sidebar__title">{selectedCategory.name}</h2>
              <p className="cs-sidebar__description">{selectedCategory.description}</p>
            </div>

            <div className="cs-sidebar__products">
              <h3 className="cs-sidebar__products-title">Featured Products</h3>
              <div className="cs-sidebar__products-grid">
                {getProductsByCategory(selectedCategory.id).length > 0 ? (
                  getProductsByCategory(selectedCategory.id).map((product) => (
                    <motion.div
                      key={product.id}
                      className="cs-sidebar__product-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="cs-sidebar__product-img">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.tag && <span className="cs-sidebar__product-tag">{product.tag}</span>}
                      </div>
                      <div className="cs-sidebar__product-info">
                        <h4>{product.name}</h4>
                        <p className="cs-sidebar__product-brand">{product.brand}</p>
                        <div className="cs-sidebar__product-rating">
                          ⭐ {product.rating} ({product.reviews} reviews)
                        </div>
                        <div className="cs-sidebar__product-price">
                          <span className="price">${product.price}</span>
                          <span className="original-price">${product.originalPrice}</span>
                        </div>
                        <motion.button
                          className="cs-sidebar__product-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details <ChevronRight size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="cs-sidebar__empty">No products in this category</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CategoryShowcase;

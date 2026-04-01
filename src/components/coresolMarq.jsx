
import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { allProducts } from '../data/products';
import { fetchCarouselItems } from '../utils/api';
import './coresolMarq.css';

function CoresolMarq() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselItems()
      .then((res) => {
        let dbItems = res.data;
        if (!dbItems || dbItems.length === 0) {
          // Fallback static items if DB is entirely empty
          dbItems = [
            { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: 'phone' },
            { video: "/assets/videos/3.mp4", text: "Premium Audio", category: 'audio' },
            { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: 'smartwatch' },
            { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: 'laptop' }
          ];
        }

        // We want the wheel to be dense. Let's make sure we have at least 15-18 items total by repeating.
        const repeats = Math.max(2, Math.ceil(18 / dbItems.length));
        const finalItems = Array(repeats).fill(dbItems).flat();
        
        setItems(finalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load carousel items", err);
        setLoading(false);
      });
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setIsClosing(false);
    }, 400); // Wait for the close animation to finish
  };

  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((p) => p.category === categoryId).slice(0, 6);
  };

  return (
    <>
      <div className="marquee-container">
        {!loading && (
          <div className="coresol-marquee-track">
            {items.map((item, index) => (
              <button
                className="marquee-item marquee-item--clickable"
                key={index}
                onClick={() => setSelectedCategory({ text: item.text, category: item.category })}
                style={{ '--i': index, '--total': items.length }}
              >
                <div className="marquee-item__video-wrapper">
                  <video src={item.video} autoPlay loop muted playsInline></video>
                  <div className="marquee-item__overlay"></div>
                </div>

                <div className="marquee-item__hover-text">
                  <div className="hover-click-text">
                    <span>CLICK ME</span>
                  </div>
                </div>

                {item.text && (
                  <div className="marquee-item__text-wrapper">
                    <p className="marquee-item__text">{item.text}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      {selectedCategory && (
        <>
          <div 
            className={`marquee-sidebar-overlay ${isClosing ? 'closing' : ''}`} 
            onClick={handleClose} 
          />
          <div className={`marquee-sidebar ${isClosing ? 'closing' : ''}`}>
            <button className="marquee-sidebar__close" onClick={handleClose}>
              <X size={24} />
            </button>

            <div className={`marquee-sidebar__header sidebar-animate-item ${isClosing ? 'closing' : ''}`} style={{ '--anim-delay': '0.1s' }}>
              <h2 className="marquee-sidebar__title">{selectedCategory.text}</h2>
              <p className="marquee-sidebar__description">Featured products in this category</p>
            </div>

            <div className="marquee-sidebar__products">
              <div className="marquee-sidebar__products-grid">
                {getProductsByCategory(selectedCategory.category).length > 0 ? (
                  getProductsByCategory(selectedCategory.category).map((product, idx) => (
                    <div 
                      key={product.id} 
                      className={`marquee-sidebar__product-card sidebar-animate-item ${isClosing ? 'closing' : ''}`}
                      style={{ '--anim-delay': `${0.15 + (idx * 0.05)}s` }}
                    >
                      <div className="marquee-sidebar__product-img">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.tag && (
                          <span className="marquee-sidebar__product-tag">{product.tag}</span>
                        )}
                      </div>
                      <div className="marquee-sidebar__product-info">
                        <h4>{product.name}</h4>
                        <p className="marquee-sidebar__product-brand">{product.brand}</p>
                        <div className="marquee-sidebar__product-rating">
                          ⭐ {product.rating} ({product.reviews})
                        </div>
                        <div className="marquee-sidebar__product-price">
                          <span className="price">${product.price}</span>
                          {product.originalPrice && (
                            <span className="original-price">${product.originalPrice}</span>
                          )}
                        </div>
                        <button className="marquee-sidebar__product-btn">
                          View Details <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`marquee-sidebar__empty sidebar-animate-item ${isClosing ? 'closing' : ''}`} style={{ '--anim-delay': '0.2s' }}>No products in this category</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CoresolMarq;
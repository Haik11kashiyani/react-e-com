
import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { allProducts } from '../data/products';
import './coresolMarq.css';

function CoresolMarq() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryMap = {
    'Next-Gen Smartphones': 'phone',
    'Premium Audio': 'audio',
    'Smart Wearables': 'smartwatch',
    'Ultra-Thin Laptops': 'laptop',
    '4K Displays': 'audio',
    'Wireless Freedom': 'audio',
    'AI-Powered Tech': 'phone',
    'Gaming Essentials': 'laptop',
    'Future of VR': 'accessories',
  };

  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((p) => p.category === categoryId).slice(0, 6);
  };

  const items = [
    { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: 'phone' },
    { video: "/assets/videos/3.mp4", text: "Premium Audio", category: 'audio' },
    { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: 'smartwatch' },
    { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: 'laptop' },
    { video: "/assets/videos/1.mp4", text: "4K Displays", category: 'audio' },
    { video: "/assets/videos/3.mp4", text: "Wireless Freedom", category: 'audio' },
    { video: "/assets/videos/4.mp4", text: "AI-Powered Tech", category: 'phone' },
    { video: "/assets/videos/5.mp4", text: "Gaming Essentials", category: 'laptop' },
    { video: "/assets/videos/1.mp4", text: "Future of VR", category: 'accessories' },

    /* Duplicates for seamless loop */
    { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: 'phone' },
    { video: "/assets/videos/3.mp4", text: "Premium Audio", category: 'audio' },
    { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: 'smartwatch' },
    { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: 'laptop' },
    { video: "/assets/videos/1.mp4", text: "4K Displays", category: 'audio' },
    { video: "/assets/videos/3.mp4", text: "Wireless Freedom", category: 'audio' },
    { video: "/assets/videos/4.mp4", text: "AI-Powered Tech", category: 'phone' },
    { video: "/assets/videos/5.mp4", text: "Gaming Essentials", category: 'laptop' },
    { video: "/assets/videos/1.mp4", text: "Future of VR", category: 'accessories' },
  ];

  return (
    <>
      <div className="marquee-container">
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
                <span>CLICK ME</span>
              </div>

              {item.text && (
                <p className="marquee-item__text">{item.text}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      {selectedCategory && (
        <>
          <div className="marquee-sidebar-overlay" onClick={() => setSelectedCategory(null)} />
          <div className="marquee-sidebar">
            <button className="marquee-sidebar__close" onClick={() => setSelectedCategory(null)}>
              <X size={24} />
            </button>

            <div className="marquee-sidebar__header">
              <h2 className="marquee-sidebar__title">{selectedCategory.text}</h2>
              <p className="marquee-sidebar__description">Featured products in this category</p>
            </div>

            <div className="marquee-sidebar__products">
              <div className="marquee-sidebar__products-grid">
                {getProductsByCategory(selectedCategory.category).length > 0 ? (
                  getProductsByCategory(selectedCategory.category).map((product) => (
                    <div key={product.id} className="marquee-sidebar__product-card">
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
                  <p className="marquee-sidebar__empty">No products in this category</p>
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
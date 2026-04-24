
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { fetchCarouselItems, fetchProducts } from '../utils/api';
import './coresolMarq.css';

function CoresolMarq() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  // Click vs drag detection refs
  const mouseDownRef = useRef(null);

  useEffect(() => {
    // Load carousel items
    fetchCarouselItems()
      .then((res) => {
        let dbItems = res.data;
        if (!dbItems || dbItems.length === 0) {
          dbItems = [
            { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: 'phone' },
            { video: "/assets/videos/3.mp4", text: "Premium Audio", category: 'audio' },
            { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: 'smartwatch' },
            { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: 'laptop' }
          ];
        }
        const repeats = Math.max(2, Math.ceil(18 / dbItems.length));
        const finalItems = Array(repeats).fill(dbItems).flat();
        setItems(finalItems);
        setLoading(false);
      })
      .catch(() => {
        const fallbackItems = [
          { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: 'phone' },
          { video: "/assets/videos/3.mp4", text: "Premium Audio", category: 'audio' },
          { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: 'smartwatch' },
          { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: 'laptop' }
        ];
        const repeats = Math.max(2, Math.ceil(18 / fallbackItems.length));
        setItems(Array(repeats).fill(fallbackItems).flat());
        setLoading(false);
      });

    // Load products from API (with correct MongoDB _id for navigation)
    fetchProducts()
      .then((res) => setAllProducts(res.data.products || []))
      .catch(() => setAllProducts([]));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setIsClosing(false);
    }, 400);
  };

  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((p) => p.category === categoryId).slice(0, 6);
  };

  // Click vs drag: record mousedown position & time
  const handleMouseDown = useCallback((e) => {
    mouseDownRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, []);

  // Only open sidebar if it was a quick, non-drag click
  const handleItemClick = useCallback((item) => {
    if (!mouseDownRef.current) {
      setSelectedCategory({ text: item.text, category: item.category });
      return;
    }
    const { time } = mouseDownRef.current;
    const elapsed = Date.now() - time;
    // Only open if click was fast (< 300ms) — dragging takes longer
    if (elapsed < 300) {
      setSelectedCategory({ text: item.text, category: item.category });
    }
    mouseDownRef.current = null;
  }, []);

  return (
    <>
      <div className="marquee-container">
        {!loading && (
          <div className="coresol-marquee-track">
            {items.map((item, index) => (
              <button
                className="marquee-item marquee-item--clickable"
                key={index}
                onMouseDown={handleMouseDown}
                onClick={() => handleItemClick(item)}
                style={{
                  transform: `rotate(${(360 / items.length) * index}deg) translateY(var(--radius, -1400px))`
                }}
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
                      key={product._id || product.id} 
                      className={`marquee-sidebar__product-card sidebar-animate-item ${isClosing ? 'closing' : ''}`}
                      style={{ '--anim-delay': `${0.15 + (idx * 0.05)}s` }}
                      onClick={() => {
                        const pid = product._id || product.id;
                        navigate(`/products/${pid}`);
                        handleClose();
                      }}
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
                          <span className="price">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="original-price">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          className="marquee-sidebar__product-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const pid = product._id || product.id;
                            navigate(`/products/${pid}`);
                            handleClose();
                          }}
                        >
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
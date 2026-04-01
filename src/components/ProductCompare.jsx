import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import './ProductCompare.css';

import { fetchComparisons } from '../utils/api';

function ProductCompare() {
  const [comparisons, setComparisons] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons()
      .then((res) => {
        setComparisons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch comparisons:', err);
        setLoading(false);
      });
  }, []);

  // Auto-cycle every 8 seconds
  useEffect(() => {
    if (comparisons.length <= 1) return;
    const id = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % comparisons.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, [comparisons.length]);

  const handleTabClick = (index) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  if (loading) {
    return (
      <section className="compare-section">
        <div style={{ padding: '100px', textAlign: 'center', opacity: 0.5 }}>Loading comparisons...</div>
      </section>
    );
  }

  if (!comparisons || comparisons.length === 0) {
    return null; // Don't render if no comparisons exist
  }

  const data = comparisons[activeIndex];

  return (
    <section className="compare-section">
      <div className="compare-header">
        <span className="compare-eyebrow">Compare</span>
        <h2 className="compare-title">Side by Side</h2>
        <p className="compare-subtitle">
          See how the best products stack up against each other
        </p>
      </div>

      {/* Category Tabs */}
      <div className="compare-tabs">
        {comparisons.map((item, index) => (
          <button
            key={item.category}
            className={`compare-tab ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {item.category}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="compare-progress">
        <div className="compare-progress__bar" key={activeIndex} />
      </div>

      {/* Compare Card */}
      <div className={`compare-card ${isTransitioning ? 'fading' : ''}`}>
        {/* Product A */}
        <div className="compare-side">
          {data.products[0]?.winner && <span className="best-pick"><Award size={13} /> Best Pick</span>}
          <div className="compare-img-wrap">
            <img src={data.products[0]?.image} alt={data.products[0]?.name} />
          </div>
          <h3 className="compare-name">{data.products[0]?.name}</h3>
          <p className="compare-price">
            {data.products[0]?.price}
            <span className="compare-old-price">{data.products[0]?.originalPrice}</span>
          </p>
          <ul className="compare-specs">
            {data.products[0]?.specs.map((spec, i) => (
              <li key={i} className="compare-spec-row">
                <span className="compare-spec-label">{spec.label}</span>
                <span className={`compare-spec-val ${spec.highlight ? 'win' : ''}`}>
                  {spec.value}
                </span>
              </li>
            ))}
          </ul>
          <button className="compare-buy">Add to Cart</button>
        </div>

        {/* VS */}
        <div className="compare-vs-col">
          <div className="compare-vs-line" />
          <div className="compare-vs-badge">VS</div>
          <div className="compare-vs-line" />
        </div>

        {/* Product B */}
        <div className="compare-side">
          {data.products[1]?.winner && <span className="best-pick"><Award size={13} /> Best Pick</span>}
          <div className="compare-img-wrap">
            <img src={data.products[1]?.image} alt={data.products[1]?.name} />
          </div>
          <h3 className="compare-name">{data.products[1]?.name}</h3>
          <p className="compare-price">
            {data.products[1]?.price}
            <span className="compare-old-price">{data.products[1]?.originalPrice}</span>
          </p>
          <ul className="compare-specs">
            {data.products[1]?.specs.map((spec, i) => (
              <li key={i} className="compare-spec-row">
                <span className="compare-spec-label">{spec.label}</span>
                <span className={`compare-spec-val ${spec.highlight ? 'win' : ''}`}>
                  {spec.value}
                </span>
              </li>
            ))}
          </ul>
          <button className="compare-buy">Add to Cart</button>
        </div>
      </div>

    </section>
  );
}

export default ProductCompare;

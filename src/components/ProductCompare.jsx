import React, { useState, useEffect } from 'react';
import './ProductCompare.css';

const comparisons = [
  {
    category: 'Smartphones',
    products: [
      {
        name: 'Galaxy S24 Ultra',
        price: '$1,299',
        originalPrice: '$1,419',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
        winner: true,
        specs: [
          { label: 'Display', value: '6.8" QHD+ AMOLED', highlight: true },
          { label: 'Chip', value: 'Snapdragon 8 Gen 3', highlight: true },
          { label: 'RAM', value: '12 GB', highlight: true },
          { label: 'Camera', value: '200 MP', highlight: true },
          { label: 'Battery', value: '5000 mAh', highlight: true },
          { label: 'Storage', value: 'Up to 1 TB' },
        ],
      },
      {
        name: 'iPhone 15 Pro Max',
        price: '$1,199',
        originalPrice: '$1,299',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        winner: false,
        specs: [
          { label: 'Display', value: '6.7" OLED' },
          { label: 'Chip', value: 'A17 Pro' },
          { label: 'RAM', value: '8 GB' },
          { label: 'Camera', value: '48 MP' },
          { label: 'Battery', value: '4441 mAh' },
          { label: 'Storage', value: 'Up to 1 TB' },
        ],
      },
    ],
  },
  {
    category: 'Laptops',
    products: [
      {
        name: 'MacBook Pro 16"',
        price: '$2,499',
        originalPrice: '$2,799',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        winner: false,
        specs: [
          { label: 'Display', value: '16.2" Retina XDR' },
          { label: 'Chip', value: 'Apple M3 Pro' },
          { label: 'RAM', value: '18 GB' },
          { label: 'Storage', value: '512 GB SSD' },
          { label: 'Battery', value: '22 hrs', highlight: true },
          { label: 'Weight', value: '2.14 kg' },
        ],
      },
      {
        name: 'Dell XPS 15',
        price: '$1,899',
        originalPrice: '$2,199',
        image: 'https://images.unsplash.com/photo-1593642702749-b7d2a804c22e?w=400&h=400&fit=crop',
        winner: true,
        specs: [
          { label: 'Display', value: '15.6" 3.5K OLED', highlight: true },
          { label: 'Chip', value: 'Core i9-13900H', highlight: true },
          { label: 'RAM', value: '32 GB', highlight: true },
          { label: 'Storage', value: '1 TB SSD', highlight: true },
          { label: 'Battery', value: '13 hrs' },
          { label: 'Weight', value: '1.86 kg', highlight: true },
        ],
      },
    ],
  },
  {
    category: 'Smartwatches',
    products: [
      {
        name: 'Apple Watch Ultra 2',
        price: '$799',
        originalPrice: '$899',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
        winner: true,
        specs: [
          { label: 'Display', value: '49mm Always-On', highlight: true },
          { label: 'Battery', value: '36 hrs', highlight: true },
          { label: 'Water', value: '100m Dive', highlight: true },
          { label: 'GPS', value: 'Dual L1/L5', highlight: true },
          { label: 'Health', value: 'Heart, SpO2, Temp' },
          { label: 'Build', value: 'Titanium', highlight: true },
        ],
      },
      {
        name: 'Galaxy Watch 6',
        price: '$399',
        originalPrice: '$449',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        winner: false,
        specs: [
          { label: 'Display', value: '47mm AMOLED' },
          { label: 'Battery', value: '40 hrs' },
          { label: 'Water', value: '5ATM IP68' },
          { label: 'GPS', value: 'GPS / Glonass' },
          { label: 'Health', value: 'Heart, SpO2, BIA' },
          { label: 'Build', value: 'Steel' },
        ],
      },
    ],
  },
  {
    category: 'Tablets',
    products: [
      {
        name: 'iPad Pro 12.9"',
        price: '$1,099',
        originalPrice: '$1,199',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        winner: true,
        specs: [
          { label: 'Display', value: '12.9" Liquid Retina', highlight: true },
          { label: 'Chip', value: 'Apple M2', highlight: true },
          { label: 'RAM', value: '8 GB' },
          { label: 'Camera', value: '12 MP Wide' },
          { label: 'Battery', value: '10 hrs' },
          { label: 'Weight', value: '682 g', highlight: true },
        ],
      },
      {
        name: 'Galaxy Tab S9 Ultra',
        price: '$1,199',
        originalPrice: '$1,299',
        image: 'https://images.unsplash.com/photo-1561154464-82e9aab73b87?w=400&h=400&fit=crop',
        winner: false,
        specs: [
          { label: 'Display', value: '14.6" AMOLED' },
          { label: 'Chip', value: 'Snapdragon 8 Gen 2' },
          { label: 'RAM', value: '12 GB', highlight: true },
          { label: 'Camera', value: '13 MP + 8 MP' },
          { label: 'Battery', value: '11,200 mAh', highlight: true },
          { label: 'Weight', value: '732 g' },
        ],
      },
    ],
  },
];

function ProductCompare() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % comparisons.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleTabClick = (index) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

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
          {data.products[0].winner && <span className="best-pick">★ Best Pick</span>}
          <div className="compare-img-wrap">
            <img src={data.products[0].image} alt={data.products[0].name} />
          </div>
          <h3 className="compare-name">{data.products[0].name}</h3>
          <p className="compare-price">
            {data.products[0].price}
            <span className="compare-old-price">{data.products[0].originalPrice}</span>
          </p>
          <ul className="compare-specs">
            {data.products[0].specs.map((spec, i) => (
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
          {data.products[1].winner && <span className="best-pick">★ Best Pick</span>}
          <div className="compare-img-wrap">
            <img src={data.products[1].image} alt={data.products[1].name} />
          </div>
          <h3 className="compare-name">{data.products[1].name}</h3>
          <p className="compare-price">
            {data.products[1].price}
            <span className="compare-old-price">{data.products[1].originalPrice}</span>
          </p>
          <ul className="compare-specs">
            {data.products[1].specs.map((spec, i) => (
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

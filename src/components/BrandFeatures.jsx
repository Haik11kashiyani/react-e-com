import React from 'react';
import './BrandFeatures.css';
import TrustedByMarquee from './TrustedByMarquee';

function BrandFeatures() {
  const features = [
    {
      title: 'Build faster and better',
      description: 'Our resources save you hours of rebuilding from scratch. Each one is made for real-world projects, so you can focus on shipping work that stands out.'
    },
    {
      title: 'Speed up your process',
      description: 'These aren\'t stripped-down templates. Every resource is built to be fast, flexible, and production-ready, so you can ship beautiful work without trading quality for time.'
    },
    {
      title: 'A living and growing system',
      description: 'We keep adding new resources, ideas, and techniques every week. The Vault evolves with you and your needs, so your toolkit never stops expanding.'
    }
  ];

  return (
    <section className="brand-features-section">
      <div className="bf-container">
        <div className="bf-header">
            <div className="osmo-logo-mark">
                 {/* Placeholder for small Osmo logo/text from screenshot */}
                 <span className="os-text-small">OSMO SUPPLY D.V.</span>
            </div>
            <div className="bf-title-wrapper">
                <span className="handwritten-note">Why Osmo?</span>
                <h2 className="bf-title">
                    Level up your game and join a community of creatives who love building great websites as much as you do.
                </h2>
            </div>
        </div>

        <div className="bf-features-list">
            {features.map((feature, index) => (
                <div key={index} className="bf-feature-item">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.description}</p>
                </div>
            ))}
        </div>

        <TrustedByMarquee />
      </div>
    </section>
  );
}

export default BrandFeatures;

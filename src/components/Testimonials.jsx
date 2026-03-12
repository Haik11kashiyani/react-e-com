import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    text: 'Techorbit completely changed how I shop for tech. The curation is impeccable — every product feels like it was picked just for me. The MacBook Pro arrived in pristine packaging within 24 hours.',
    rating: 5,
    product: 'MacBook Pro 16"',
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    text: 'I was skeptical at first, but the quality of service blew me away. The product comparison tool helped me pick the perfect phone. 10/10 would recommend to anyone looking for premium tech.',
    rating: 5,
    product: 'Galaxy S24 Ultra',
  },
  {
    name: 'Emily Rivera',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
    text: 'The attention to detail is remarkable — from the website experience to the unboxing. It feels like shopping at a luxury boutique but for tech. My AirPods Pro arrived perfectly.',
    rating: 5,
    product: 'AirPods Pro 2',
  },
  {
    name: 'Alex Kim',
    role: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    text: 'Best tech shopping experience I have ever had. The 2-year warranty and free shipping on all my orders makes it a no-brainer. The support team is incredibly responsive and helpful.',
    rating: 5,
    product: 'iPad Pro 12.9"',
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(iv);
  }, []);

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="tm-section">
      <div className="tm-inner">
        {/* Header */}
        <motion.div
          className="tm-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="tm-eyebrow">What Customers Say</span>
          <h2 className="tm-title">Loved by Thousands</h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="tm-stage">
          <div className="tm-quote-icon"><Quote size={32} /></div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="tm-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="tm-card__stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#FFB800" stroke="#FFB800" />
                ))}
              </div>
              <p className="tm-card__text">&ldquo;{t.text}&rdquo;</p>
              <div className="tm-card__author">
                <img src={t.avatar} alt={t.name} className="tm-card__avatar" />
                <div>
                  <span className="tm-card__name">{t.name}</span>
                  <span className="tm-card__role">{t.role}</span>
                </div>
                <span className="tm-card__product">Purchased: {t.product}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="tm-controls">
            <button className="tm-arrow" onClick={prev}><ArrowLeft size={18} /></button>
            <div className="tm-indicators">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`tm-indicator ${i === active ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <button className="tm-arrow" onClick={next}><ArrowRight size={18} /></button>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          className="tm-trust-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="tm-trust-item">
            <span className="tm-trust-num">4.9/5</span>
            <span className="tm-trust-label">Average Rating</span>
          </div>
          <div className="tm-trust-divider" />
          <div className="tm-trust-item">
            <span className="tm-trust-num">15K+</span>
            <span className="tm-trust-label">5-Star Reviews</span>
          </div>
          <div className="tm-trust-divider" />
          <div className="tm-trust-item">
            <span className="tm-trust-num">98%</span>
            <span className="tm-trust-label">Would Recommend</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;

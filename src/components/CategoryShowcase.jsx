import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import './CategoryShowcase.css';

function CategoryShowcase() {
  return (
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
      </div>
    </section>
  );
}

export default CategoryShowcase;

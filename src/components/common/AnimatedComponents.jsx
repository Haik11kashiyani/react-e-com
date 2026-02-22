import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line -- used as motion.div in JSX
import { useScrollReveal } from '../../hooks/useAnimations';

/**
 * SplitText - Animates text character by character or word by word
 */
export function SplitText({ children, className = '', type = 'chars', delay = 0, stagger = 0.03 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
  const text = typeof children === 'string' ? children : '';
  const units = type === 'words' ? text.split(' ') : text.split('');

  return (
    <span ref={ref} className={`split-text ${className}`} style={{ display: 'inline-block' }}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            display: 'inline-block',
            whiteSpace: unit === ' ' ? 'pre' : 'normal',
            transformOrigin: 'bottom',
          }}
        >
          {unit === ' ' ? '\u00A0' : unit}
          {type === 'words' && i < units.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * RevealText - Reveals text with a mask/clip animation
 */
export function RevealText({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <div ref={ref} className={`reveal-text ${className}`} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%' }}
        animate={isVisible ? { y: '0%' } : {}}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * FadeIn - General purpose fade-in with direction
 */
export function FadeIn({ children, className = '', direction = 'up', delay = 0, duration = 0.7, distance = 40 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn - Scale up reveal
 */
export function ScaleIn({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Staggers animation of children
 */
export function StaggerContainer({ children, className = '', stagger = 0.1, delay = 0 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxImage - Image with parallax scroll effect
 */
export function ParallaxImage({ src, alt, className = '' }) {
  return (
    <div className={`parallax-img-wrap ${className}`} style={{ overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

/**
 * HorizontalLine - Animated line reveal
 */
export function HorizontalLine({ className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`h-line ${className}`}
      initial={{ scaleX: 0 }}
      animate={isVisible ? { scaleX: 1 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ transformOrigin: 'left', height: '1px', background: '#e0e0e0' }}
    />
  );
}

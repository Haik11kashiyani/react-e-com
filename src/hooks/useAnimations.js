import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for scroll-triggered animations using IntersectionObserver
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * Hook for staggered children animations
 */
export function useStaggerReveal(count, options = {}) {
  const { delay = 0.08, threshold = 0.1 } = options;
  const [ref, isVisible] = useScrollReveal({ threshold });

  const getDelay = useCallback(
    (index) => (isVisible ? index * delay : 0),
    [isVisible, delay]
  );

  return { ref, isVisible, getDelay };
}

/**
 * Hook for parallax effects on scroll
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed * 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
}

/**
 * Hook for magnetic cursor effect on hover
 */
export function useMagneticHover(strength = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      node.style.transform = 'translate(0, 0)';
      node.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    const handleMouseEnter = () => {
      node.style.transition = 'none';
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [strength]);

  return ref;
}

/**
 * Hook for smooth counter animation
 */
export function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [ref, isVisible] = useScrollReveal({ once: true });

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration, start]);

  return [ref, count];
}

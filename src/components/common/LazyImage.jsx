import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyImage – Uses IntersectionObserver to lazy-load images.
 * Shows a shimmer placeholder until the image enters the viewport and finishes loading.
 */
export default function LazyImage({ src, alt, className = '', style = {}, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`lazy-img-wrap ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="lazy-img-placeholder">
          <div className="lazy-img-shimmer" />
        </div>
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`lazy-img ${loaded ? 'lazy-img--loaded' : ''}`}
          {...props}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import './reviwe-user.css';

const resources = [
  {
    id: 0,
    title: 'Animated Grid Overlay (Columns)',
    category: 'Gimmicks',
    date: 'February 16, 2026',
    daysAgo: '1 day ago',
    image: 'https://osmo.b-cdn.net/resource-img/animated-grid-overlay-columns-1440x900.avif',
    video: 'https://osmo.b-cdn.net/resource-video/animated-grid-overlay-columns-1440x900.mp4'
  },
  {
    id: 1,
    title: 'Draw SVG Page Transition',
    category: 'Page Transitions',
    date: 'February 11, 2026',
    daysAgo: '6 days ago',
    image: 'https://osmo.b-cdn.net/resource-img/draw-svg-page-transition-1440x900.avif',
    video: 'https://osmo.b-cdn.net/resource-video/draw-svg-page-transition-1440x900.mp4'
  },
  {
    id: 2,
    title: 'Side by Side Page Transition',
    category: 'Page Transitions',
    date: 'February 6, 2026',
    daysAgo: '1 week ago',
    image: 'https://osmo.b-cdn.net/resource-img/side-by-side-page-transition-1440x900.avif',
    video: 'https://osmo.b-cdn.net/resource-video/side-by-side-page-transition-1440x900.mp4'
  },
  {
    id: 3,
    title: 'Page Name Transition (Wipe)',
    category: 'Page Transitions',
    date: 'February 5, 2026',
    daysAgo: '1 week ago',
    image: 'https://osmo.b-cdn.net/resource-img/page-name-transition-wipe-1440x900.avif',
    video: 'https://osmo.b-cdn.net/resource-video/page-name-transition-wipe-1440x900.mp4'
  },
  {
    id: 4,
    title: 'Overlapping Parallax Page Transition',
    category: 'Page Transitions',
    date: 'February 4, 2026',
    daysAgo: '1 week ago',
    image: 'https://osmo.b-cdn.net/resource-img/overlapping-parallax-page-transition-1440x900.avif',
    video: 'https://osmo.b-cdn.net/resource-video/overlapping-parallax-page-transition-1440x900.mp4'
  }
];

function ReviweUser() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % resources.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + resources.length) % resources.length);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % resources.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Logic to calculate styles based on distance from current index
  const getSlideStyle = (index) => {
    const total = resources.length;
    let diff = (index - current + total) % total;
    if (diff > total / 2) diff -= total; // Normalize to [-total/2, total/2]

    // Active Slide
    if (diff === 0) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, 0em, 0em)',
        zIndex: 2,
        pointerEvents: 'auto'
      };
    }
    // Next Slide (Bottom)
    else if (diff === 1) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, 30em, -20em) rotateX(-60deg)',
        zIndex: 1,
        pointerEvents: 'none'
      };
    }
    // Previous Slide (Top)
    else if (diff === -1) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, -30em, -20em) rotateX(60deg)',
        zIndex: 1,
        pointerEvents: 'none'
      };
    }
    // Far Next (Below bottom one)
    else if (diff > 1) {
         return {
        opacity: 0,
        transform: 'translate3d(0em, 30em, -20em) rotateX(-60deg)',
        zIndex: 0,
        pointerEvents: 'none'
      };
    }
    // Far Prev (Above top one)
    else {
      return {
        opacity: 0,
        transform: 'translate3d(0em, -30em, -20em) rotateX(60deg)',
        zIndex: 0,
        pointerEvents: 'none'
      };
    }
  };

  return (
    <div className="intro__large-col">
      <div className="latest-resources-slider">
        
        {/* Collection Wrapper */}
        <div className="vertical-slider__collection">
          <div className="vertical-slider__list">
            {resources.map((resource, index) => (
              <div 
                key={resource.id}
                className="vertical-slider__item"
                data-slide-active={index === current}
                style={getSlideStyle(index)}
              >
                <div className="resource-card">
                  <div className="resource-card__inner">
                    <div className="resource-card__start">
                      <div className="button-row">
                        <div className="tag">
                          <div className="button-bg"></div>
                          <span className="eyebrow">{resource.daysAgo}</span>
                        </div>
                        <div className="tag" data-shape="round">
                          <div className="button-bg"></div>
                          <span className="eyebrow">New Resource</span>
                        </div>
                      </div>
                      
                      <div className="resource-card__start-inner">
                        <div className="resource-card__start-h">
                          <h4>{resource.title}</h4>
                        </div>
                        <div className="resource-card__category">
                          <span className="eyebrow">{resource.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="resource-card__end">
                      <div className="resource-visual">
                        <img 
                            src={resource.image} 
                            alt={resource.title} 
                            className="cover-image" 
                            loading="lazy"
                        />
                        <video 
                            src={resource.video} 
                            className="cover-video"
                            muted 
                            loop 
                            playsInline
                            autoPlay
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fades */}
        <div className="latest-resources-slider__fade"></div>
        <div className="latest-resources-slider__fade is--flipped"></div>

        {/* Text */}
        <div className="latest-resources-slider__card-text">
            <p className="p-m u--fw-460">
                <span className="u--color-electric">Latest updates</span><br/>from Osmo
            </p>
            <p className="scribble u--color-electric">
                New stuff is<br/>added every week!
            </p>
        </div>

        {/* Bullets */}
        <div className="vertical-slider__bullets">
            {resources.map((_, index) => (
                <div 
                    key={index}
                    className="vertical-slider__bullet-item"
                    aria-current={index === current}
                ></div>
            ))}
        </div>

        {/* Buttons */}
        <div className="vertical-slider__buttons is--recent-updates">
          <button 
            className="vertical-slider__button" 
            onClick={prevSlide}
            aria-label="previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 9 10" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.0572103 5.87755L-0.000319998 4.13997L4.07325 0.0664059L8.11231 4.10546L8.05771 5.90913L6.05745 3.90887C5.57058 3.422 5.13434 2.9761 4.74872 2.57033L4.71804 9.06641L3.36388 9.00572L3.39471 2.5098C3.01832 2.90654 2.58958 3.34518 2.10892 3.82585L0.0572103 5.87755Z" fill="currentColor"/>
            </svg>
          </button>
          <button 
            className="vertical-slider__button" 
            onClick={nextSlide}
            aria-label="next slide"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 9 10" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.0551 3.25526L8.11263 4.99284L4.03906 9.06641L8.55272e-07 5.02735L0.0545993 3.22368L2.05486 5.22394C2.54173 5.71081 2.97797 6.15671 3.36359 6.56248L3.39427 0.0664057L4.74842 0.127091L4.7176 6.62301C5.09398 6.22627 5.52273 5.78763 6.00339 5.30696L8.0551 3.25526Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

      </div>
      
      <div className="intro-col__micro">
        <img src="https://osmo.b-cdn.net/website/bandwidth/osmo-micrographic-1.avif" alt="" loading="lazy" />
      </div>
    </div>
  );
}

export default ReviweUser;

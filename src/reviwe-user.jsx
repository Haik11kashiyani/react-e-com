import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, User } from 'lucide-react';
import './reviwe-user.css';

const reviews = [
  {
    id: 0,
    productName: 'Sony WH-1000XM5',
    title: 'Best Noise Cancellation!',
    rating: 5,
    userName: 'Sarah Jenkins',
    date: 'February 10, 2026',
    reviewText: 'The noise cancellation is absolutely top-tier. I use these for my daily commute and I can\'t hear a thing. Battery life is also impressive.',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2500&auto=format&fit=crop',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 1,
    productName: 'MacBook Pro M3',
    title: 'A Powerhouse Machine',
    rating: 5,
    userName: 'David Chen',
    date: 'February 12, 2026',
    reviewText: 'I upgraded from an Intel Mac reviews and the difference is night and day. Compiles my code in seconds. The display is gorgeous.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=2500&auto=format&fit=crop',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 2,
    productName: 'Samsung Galaxy S24 Ultra',
    title: 'Incredible Camera Zoom',
    rating: 4,
    userName: 'Maria Rodriguez',
    date: 'February 14, 2026',
    reviewText: 'The 100x zoom is actually usable now! Screen is bright and smooth. Battery lasts all day easily.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2500&auto=format&fit=crop',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 3,
    productName: 'Logitech MX Master 3S',
    title: 'Productivity Booster',
    rating: 5,
    userName: 'James Wilson',
    date: 'February 15, 2026',
    reviewText: 'Silent clicks are weird at first but I love them now. The scrolling wheel is just perfect for long documents.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2500&auto=format&fit=crop',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 4,
    productName: 'Dell XPS 15',
    title: 'Great Design, Hot Running',
    rating: 4,
    userName: 'Emily Blunt',
    date: 'February 16, 2026',
    reviewText: 'Beautiful laptop with a stunning OLED screen. Runs a bit warm under load but performs excellently for creative work.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=2500&auto=format&fit=crop',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
  }
];

function ReviweUser() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const id = setInterval(() => {
    //   setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000); // Slower auto-advance for reading
    return () => clearInterval(id);
  }, []);

  // Logic to calculate styles based on distance from current index
  const getSlideStyle = (index) => {
    const total = reviews.length;
    let diff = (index - current + total) % total;
    if (diff > total / 2) diff -= total; // Normalize to [-total/2, total/2]

    // Active Slide
    if (diff === 0) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, 0em, 0em)',
        zIndex: 10,
        pointerEvents: 'auto'
      };
    }
    // Next Slide (Bottom)
    else if (diff === 1) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, 12em, -10em) rotateX(-10deg)', // Tights spacing
        zIndex: 9,
        pointerEvents: 'none',
        filter: 'brightness(0.9)' /* Subtle depth cue */
      };
    }
    // Previous Slide (Top)
    else if (diff === -1) {
      return {
        opacity: 1,
        transform: 'translate3d(0em, -12em, -10em) rotateX(10deg)', // Tights spacing
        zIndex: 9,
        pointerEvents: 'none',
        filter: 'brightness(0.9)'
      };
    }
    // Far Next (Below bottom one)
    else if (diff > 1) {
         return {
        opacity: 0,
        transform: 'translate3d(0em, 24em, -20em) rotateX(-20deg)',
        zIndex: 0,
        pointerEvents: 'none'
      };
    }
    // Far Prev (Above top one)
    else {
      return {
        opacity: 0,
        transform: 'translate3d(0em, -24em, -20em) rotateX(20deg)',
        zIndex: 0,
        pointerEvents: 'none'
      };
    }
  };

  return (
    <div className="intro__large-col">
      <div className="latest-resources-slider">
        
        {/* Text Section (Left on Desktop) */}
        <div className="latest-resources-slider__card-text">
            <p className="p-m">
                <span className="u--color-electric">What our customers</span><br/>are saying
            </p>
            <p className="scribble">
                Real reviews from<br/>verified buyers
            </p>
            
             {/* Navigation Buttons */}
            <div className="vertical-slider__buttons">
                <button 
                    className="vertical-slider__button" 
                    onClick={prevSlide}
                    aria-label="previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                    className="vertical-slider__button" 
                    onClick={nextSlide}
                    aria-label="next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>

             {/* Bullets (Moved here for better layout) */}
             <div style={{marginTop: '20px', display: 'flex', gap: '8px'}}>
                {reviews.map((_, index) => (
                    <div 
                        key={index}
                        className="vertical-slider__bullet-item"
                        aria-current={index === current}
                    ></div>
                ))}
            </div>
        </div>

        {/* Slider Collection (Right) */}
        <div className="vertical-slider__collection">
          <div className="vertical-slider__list">
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className="vertical-slider__item"
                data-slide-active={index === current}
                style={getSlideStyle(index)}
              >
                <div className="resource-card">
                  <div className="resource-card__inner">
                    
                    {/* Content Side */}
                    <div className="resource-card__start">
                      <div>
                        <div className="button-row">
                            <span className="tag">
                                <CheckCircle size={14} className="text-green-500" />
                                Verified Purchase
                            </span>
                            <span className="tag" data-shape="round">
                                {review.productName}
                            </span>
                        </div>
                        
                        <div className="resource-card__start-h">
                          <h4>{review.title}</h4>
                        </div>
                        
                        <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={16} 
                                    className={`star ${i < review.rating ? 'filled' : ''}`} 
                                    fill={i < review.rating ? "#f1c40f" : "none"} 
                                />
                            ))}
                        </div>

                        <p className="review-text">"{review.reviewText}"</p>
                      </div>

                      <div className="resource-card__category">
                        <img 
                            src={review.userImage} 
                            alt={review.userName} 
                            className="user-avatar"
                        />
                        <div className="user-info">
                            <span className="user-name">{review.userName}</span>
                            <span className="verified-badge" style={{color: '#888', fontWeight: 400}}>
                                {review.date}
                            </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Side */}
                    <div className="resource-card__end">
                      <div className="resource-visual">
                        <img 
                            src={review.image} 
                            alt={review.productName} 
                            className="cover-image" 
                            loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReviweUser;

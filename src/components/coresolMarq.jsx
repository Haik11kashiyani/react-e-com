

import './centerOverlay.css';

function CoresolMarq() {
  const items = [
    { video: "/assets/videos/1.mp4", text: "100% Organic Cotton", link: "#" },
    { video: "/assets/videos/3.mp4", text: "Premium Fabrics", link: "#" },
    { video: "/assets/videos/4.mp4", text: "Sustainable Living" },
    { video: "/assets/videos/5.mp4", text: "Eco-Friendly Choice" },
    { video: "/assets/videos/1.mp4", text: "Modern Design" },
    { video: "/assets/videos/3.mp4", text: "Comfort First" },
    { video: "/assets/videos/4.mp4", text: "Ethical Fashion" },
    { video: "/assets/videos/5.mp4", text: "Natural Materials" },
    { video: "/assets/videos/1.mp4", text: "Timeless Style" },
    

    /* Duplicates */
    { video: "/assets/videos/1.mp4", text: "100% Organic Cotton", link: "#" },
    { video: "/assets/videos/3.mp4", text: "Premium Fabrics", link: "#" },
    { video: "/assets/videos/4.mp4", text: "Sustainable Living" },
    { video: "/assets/videos/5.mp4", text: "Eco-Friendly Choice" },
    { video: "/assets/videos/1.mp4", text: "Modern Design" },
    { video: "/assets/videos/3.mp4", text: "Comfort First" },
    { video: "/assets/videos/4.mp4", text: "Ethical Fashion" },
    { video: "/assets/videos/5.mp4", text: "Natural Materials" },
    { video: "/assets/videos/1.mp4", text: "Timeless Style" },
   
  ];

  return (
    <div className="marquee-container">
      <div className="coresol-marquee-track">
        {items.map((item, index) => (
          <div className="marquee-item" key={index} style={{ '--i': index, '--total': items.length }}>
              {item.video && (
                  item.link ? (
                    <a href={item.link}>
                        <video src={item.video} autoPlay loop muted playsInline></video>
                    </a>
                  ) : (
                        <video src={item.video} autoPlay loop muted playsInline></video>
                  )
              )}
              {item.title && <h4>{item.title}</h4>}
              {item.text && <p>{item.text}</p>}
          </div>
        ))}
      </div>
      
      <div className="center-content">
        <div className="hero-text">
          <p>
            Osmo is an ever-growing platform with<br />
            Webflow & HTML resources. Get exclusive<br />
            access to the elements, techniques and<br />
            code behind award-winning work.
          </p>
        </div>
        
        <div className="play-reel-container">
            <span className="flanking-text">Play</span>
            
            <div className="video-preview">
                <video src="/assets/videos/1.mp4" autoPlay loop muted playsInline></video>
                 <div className="video-overlay-content">
                    <div className="brand-pill">
                        <span>Osmo in use</span>
                        <span className="brand-dot">Osmo *</span>
                    </div>
                    <div className="video-time">00:48</div>
                 </div>
            </div>
            
            <span className="flanking-text">Reel</span>
        </div>
      </div>
    </div>
  )
}

export default CoresolMarq




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
      {/* Header removed for cleaner UI */}

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
    </div>
  )
}

export default CoresolMarq




function CoresolMarq() {
  const items = [
    { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", link: "#" },
    { video: "/assets/videos/3.mp4", text: "Premium Audio", link: "#" },
    { video: "/assets/videos/4.mp4", text: "Smart Wearables" },
    { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops" },
    { video: "/assets/videos/1.mp4", text: "4K Displays" },
    { video: "/assets/videos/3.mp4", text: "Wireless Freedom" },
    { video: "/assets/videos/4.mp4", text: "AI-Powered Tech" },
    { video: "/assets/videos/5.mp4", text: "Gaming Essentials" },
    { video: "/assets/videos/1.mp4", text: "Future of VR" },

    /* Duplicates for seamless loop */
    { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", link: "#" },
    { video: "/assets/videos/3.mp4", text: "Premium Audio", link: "#" },
    { video: "/assets/videos/4.mp4", text: "Smart Wearables" },
    { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops" },
    { video: "/assets/videos/1.mp4", text: "4K Displays" },
    { video: "/assets/videos/3.mp4", text: "Wireless Freedom" },
    { video: "/assets/videos/4.mp4", text: "AI-Powered Tech" },
    { video: "/assets/videos/5.mp4", text: "Gaming Essentials" },
    { video: "/assets/videos/1.mp4", text: "Future of VR" },
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
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CarouselItem from './models/CarouselItem.js';

dotenv.config();

const seedCarousel = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techorbit');
    
    // Clear existing
    await CarouselItem.deleteMany({});
    
    // Create new items
    const items = [
      { video: "/assets/videos/1.mp4", text: "Next-Gen Smartphones", category: "phone", order: 1 },
      { video: "/assets/videos/3.mp4", text: "Premium Audio", category: "audio", order: 2 },
      { video: "/assets/videos/4.mp4", text: "Smart Wearables", category: "smartwatch", order: 3 },
      { video: "/assets/videos/5.mp4", text: "Ultra-Thin Laptops", category: "laptop", order: 4 },
      { video: "/assets/videos/1.mp4", text: "4K Displays", category: "audio", order: 5 },
      { video: "/assets/videos/3.mp4", text: "Wireless Freedom", category: "audio", order: 6 },
      { video: "/assets/videos/4.mp4", text: "AI-Powered Tech", category: "phone", order: 7 },
      { video: "/assets/videos/5.mp4", text: "Gaming Essentials", category: "laptop", order: 8 },
      { video: "/assets/videos/1.mp4", text: "Future of VR", category: "accessories", order: 9 }
    ];
    
    await CarouselItem.insertMany(items);
    console.log("Carousel Items seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding carousel:", error);
    process.exit(1);
  }
};

seedCarousel();

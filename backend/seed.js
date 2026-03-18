import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";
import Product from "./models/Product.js";
import Review from "./models/Review.js";
import Coupon from "./models/Coupon.js";

dotenv.config();

const products = [
  {
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1299,
    originalPrice: 1419,
    tag: "Best Seller",
    category: "phone",
    rating: 4.8,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=800&fit=crop",
    ],
    description: "The Galaxy S24 Ultra redefines mobile AI. Built with a titanium frame, it features a stunning 6.8\" QHD+ Dynamic AMOLED 2X display and the most powerful Snapdragon 8 Gen 3 processor.",
    features: ["6.8\" QHD+ AMOLED", "Snapdragon 8 Gen 3", "200MP Camera", "5000mAh Battery", "S Pen Built-in", "Titanium Frame"],
    colors: ["#1a1a2e", "#c0c0c0", "#e6c200", "#800020"],
    inStock: true,
  },
  {
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    tag: "Popular",
    category: "phone",
    rating: 4.9,
    reviews: 5672,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
    ],
    description: "iPhone 15 Pro Max features a strong and light titanium design with the A17 Pro chip, a customizable Action button, and a more versatile pro camera system.",
    features: ["6.7\" OLED Display", "A17 Pro Chip", "48MP Camera System", "USB-C", "Action Button", "Titanium Design"],
    colors: ["#1a1a1a", "#f5f5dc", "#36454f", "#e5e4e2"],
    inStock: true,
  },
  {
    name: "MacBook Pro 16\"",
    brand: "Apple",
    price: 2499,
    originalPrice: 2799,
    tag: "Editor's Choice",
    category: "laptop",
    rating: 4.9,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop",
    ],
    description: "The most powerful MacBook Pro ever delivers exceptional performance with up to 22 hours of battery life. The M3 Pro or M3 Max chip handles the most demanding pro workflows.",
    features: ["16.2\" Liquid Retina XDR", "M3 Pro / M3 Max", "Up to 128GB RAM", "22-hour Battery", "6-speaker Sound", "MagSafe Charging"],
    colors: ["#1a1a1a", "#c0c0c0"],
    inStock: true,
  },
  {
    name: "Dell XPS 15",
    brand: "Dell",
    price: 1899,
    originalPrice: 2199,
    tag: "Hot Deal",
    category: "laptop",
    rating: 4.6,
    reviews: 1892,
    image: "https://images.unsplash.com/photo-1593642702749-b7d2a804c22e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642702749-b7d2a804c22e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop",
    ],
    description: "The Dell XPS 15 combines a stunning 3.5K OLED display with Intel 13th-gen performance in an impossibly thin package. Built for creators who demand the best.",
    features: ["15.6\" 3.5K OLED", "Core i9-13900H", "32GB RAM", "1TB SSD", "NVIDIA RTX 4070", "InfinityEdge Display"],
    colors: ["#c0c0c0", "#1a1a1a"],
    inStock: true,
  },
  {
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    price: 799,
    originalPrice: 899,
    tag: "New",
    category: "smartwatch",
    rating: 4.7,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=800&fit=crop",
    ],
    description: "The most rugged and capable Apple Watch pushes the boundaries with the S9 SiP chip, precision dual-frequency GPS, and up to 36 hours of battery life.",
    features: ["49mm Titanium Case", "36-hour Battery", "100m Water Resistant", "Precision GPS", "Always-On Display", "Action Button"],
    colors: ["#e0e0e0"],
    inStock: true,
  },
  {
    name: "Galaxy Watch 6",
    brand: "Samsung",
    price: 399,
    originalPrice: 449,
    tag: "Value Pick",
    category: "smartwatch",
    rating: 4.4,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
    ],
    description: "Track your health goals with precision. Galaxy Watch 6 Classic features an iconic rotating bezel and advanced sleep coaching to help you reach your full potential.",
    features: ["47mm AMOLED", "40-hour Battery", "5ATM + IP68", "Rotating Bezel", "BIA Sensor", "WearOS"],
    colors: ["#1a1a1a", "#c0c0c0"],
    inStock: true,
  },
  {
    name: "Pixel 8 Pro",
    brand: "Google",
    price: 999,
    originalPrice: 1099,
    tag: "AI Powered",
    category: "phone",
    rating: 4.5,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
    ],
    description: "Pixel 8 Pro is the first phone built with Google AI from the inside out. It features the most advanced Pixel camera ever, and the best of Google at your fingertips.",
    features: ["6.7\" LTPO OLED", "Tensor G3", "50MP Main Camera", "AI Photo Editing", "30x Zoom", "7 Years Updates"],
    colors: ["#1a1a2e", "#e8d5b7", "#87ceeb"],
    inStock: true,
  },
  {
    name: "iPad Pro 12.9\"",
    brand: "Apple",
    price: 1099,
    originalPrice: 1199,
    tag: "Creative",
    category: "tablet",
    rating: 4.8,
    reviews: 2987,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    ],
    description: "With M2 power and a stunning Liquid Retina XDR display, iPad Pro is the ultimate iPad experience. Supercharged by Apple Pencil hover and blazing-fast Wi-Fi 6E.",
    features: ["12.9\" Liquid Retina XDR", "Apple M2 Chip", "Apple Pencil Hover", "Thunderbolt/USB 4", "ProRes Video", "Face ID"],
    colors: ["#1a1a1a", "#c0c0c0"],
    inStock: true,
  },
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 348,
    originalPrice: 399,
    tag: "Top Rated",
    category: "audio",
    rating: 4.7,
    reviews: 4521,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    ],
    description: "Industry-leading noise cancellation optimized with Auto NC Optimizer and 8 microphones. Crystal-clear hands-free calling and up to 30 hours of battery life.",
    features: ["Industry-leading ANC", "30-hour Battery", "Multipoint Connection", "LDAC Hi-Res Audio", "Speak-to-Chat", "Comfortable Design"],
    colors: ["#1a1a1a", "#c0c0c0"],
    inStock: true,
  },
  {
    name: "AirPods Pro 2",
    brand: "Apple",
    price: 249,
    originalPrice: 279,
    tag: "Must Have",
    category: "audio",
    rating: 4.6,
    reviews: 6789,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop",
    ],
    description: "AirPods Pro 2 feature up to 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.",
    features: ["Active Noise Cancellation", "Adaptive Transparency", "Personalized Spatial Audio", "USB-C Charging", "6hr Battery + Case", "IP54 Water Resistant"],
    colors: ["#ffffff"],
    inStock: true,
  },
  {
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1549,
    originalPrice: 1799,
    tag: "Business",
    category: "laptop",
    rating: 4.5,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop",
    ],
    description: "The iconic ThinkPad X1 Carbon Gen 11 delivers enterprise-grade security and manageability with 13th Gen Intel Core processors in a featherlight 2.48 lb design.",
    features: ["14\" 2.8K OLED", "Intel Core i7-1365U", "32GB RAM", "1TB SSD", "2.48 lbs", "MIL-STD Tested"],
    colors: ["#1a1a1a"],
    inStock: true,
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 799,
    originalPrice: 899,
    tag: "Flagship Killer",
    category: "phone",
    rating: 4.5,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
    ],
    description: "OnePlus 12 packs flagship specs at a killer price. Featuring the Snapdragon 8 Gen 3, a stunning 2K display, and the latest Hasselblad camera system.",
    features: ["6.82\" 2K LTPO AMOLED", "Snapdragon 8 Gen 3", "50MP Hasselblad", "100W SUPERVOOC", "5400mAh Battery", "Alert Slider"],
    colors: ["#1a1a1a", "#006400"],
    inStock: true,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    text: "Techorbit completely changed how I shop for tech. The curation is impeccable — every product feels like it was picked just for me. The MacBook Pro arrived in pristine packaging within 24 hours.",
    rating: 5,
    product: "MacBook Pro 16\"",
    isTestimonial: true,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    text: "I was skeptical at first, but the quality of service blew me away. The product comparison tool helped me pick the perfect phone. 10/10 would recommend to anyone looking for premium tech.",
    rating: 5,
    product: "Galaxy S24 Ultra",
    isTestimonial: true,
  },
  {
    name: "Emily Rivera",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    text: "The attention to detail is remarkable — from the website experience to the unboxing. It feels like shopping at a luxury boutique but for tech. My AirPods Pro arrived perfectly.",
    rating: 5,
    product: "AirPods Pro 2",
    isTestimonial: true,
  },
  {
    name: "Alex Kim",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    text: "Best tech shopping experience I have ever had. The 2-year warranty and free shipping on all my orders makes it a no-brainer. The support team is incredibly responsive and helpful.",
    rating: 5,
    product: "iPad Pro 12.9\"",
    isTestimonial: true,
  },
];

const coupons = [
  { code: "WELCOME10", type: "percent", value: 10, label: "10% Off — Welcome Offer" },
  { code: "SAVE20", type: "percent", value: 20, label: "20% Off — Seasonal Sale" },
  { code: "FLAT50", type: "flat", value: 50, label: "$50 Off — Premium Deal" },
  { code: "FREESHIP", type: "shipping", value: 0, label: "Free Shipping" },
  { code: "TO15", type: "percent", value: 15, label: "15% Off — Techorbit Exclusive" },
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/db_techorbit";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    console.log("Cleared existing data");

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    // Seed testimonials
    const createdReviews = await Review.insertMany(testimonials);
    console.log(`Seeded ${createdReviews.length} testimonials`);

    // Seed coupons
    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`Seeded ${createdCoupons.length} coupons`);

    console.log("\n✓ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();

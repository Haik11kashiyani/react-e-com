import mongoose from 'mongoose';

const carouselItemSchema = new mongoose.Schema({
  video: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('CarouselItem', carouselItemSchema);

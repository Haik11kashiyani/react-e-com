import mongoose from 'mongoose';

const specSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  highlight: { type: Boolean, default: false }
});

const productComparisonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  originalPrice: { type: String },
  image: { type: String, required: true },
  winner: { type: Boolean, default: false },
  specs: [specSchema]
});

const comparisonSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  products: {
    type: [productComparisonSchema],
    validate: [arr => arr.length === 2, '{PATH} requires exactly 2 products']
  }
}, { timestamps: true });

export default mongoose.model('Comparison', comparisonSchema);

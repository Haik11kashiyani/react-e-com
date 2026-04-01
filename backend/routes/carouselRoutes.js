import express from 'express';
import CarouselItem from '../models/CarouselItem.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// GET all carousel items (public route)
router.get('/', async (req, res) => {
  try {
    const items = await CarouselItem.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new carousel item (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const newItem = new CarouselItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update carousel item (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updatedItem = await CarouselItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Carousel Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE carousel item (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedItem = await CarouselItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Carousel Item not found' });
    }
    res.json({ message: 'Carousel Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

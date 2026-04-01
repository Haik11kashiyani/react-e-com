import express from 'express';
import Comparison from '../models/Comparison.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// GET all comparisons (public route)
router.get('/', async (req, res) => {
  try {
    const comparisons = await Comparison.find();
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new comparison (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const newComparison = new Comparison(req.body);
    const savedComparison = await newComparison.save();
    res.status(201).json(savedComparison);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update comparison (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updatedComparison = await Comparison.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedComparison) {
      return res.status(404).json({ message: 'Comparison not found' });
    }
    res.json(updatedComparison);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE comparison (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedComparison = await Comparison.findByIdAndDelete(req.params.id);
    if (!deletedComparison) {
      return res.status(404).json({ message: 'Comparison not found' });
    }
    res.json({ message: 'Comparison deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

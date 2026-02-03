import { Router } from 'express';
import Measurement from '../models/Measurement';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get all measurements for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const measurements = await Measurement.find({ userId: req.userId }).sort({ date: -1 });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// Create measurement
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const measurement = await Measurement.create({
      ...req.body,
      userId: req.userId
    });
    res.status(201).json(measurement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create measurement' });
  }
});

// Update measurement
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const measurement = await Measurement.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    res.json(measurement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update measurement' });
  }
});

// Delete measurement
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const measurement = await Measurement.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    res.json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete measurement' });
  }
});

export default router;

import { Router } from 'express';
import Workout from '../models/Workout';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get all workouts for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await Workout.find({ userId: req.userId });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Create new workout
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, exercises, duration, notes } = req.body;
    const workout = await Workout.create({
      userId: req.userId,
      name,
      date,
      exercises,
      duration,
      notes
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Get single workout
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Update workout
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, exercises, duration, notes } = req.body;
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, date, exercises, duration, notes, updatedAt: new Date() },
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router;

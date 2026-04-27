import { Router, Request, Response } from 'express';
import Workout from '../models/Workout';

const router = Router();

// Get all workouts
router.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Create new workout
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, date, exercises, duration, notes, exerciseName, rounds, weight, descriptionLines } = req.body;
    const workout = await Workout.create({
      name,
      date,
      exercises,
      duration,
      notes,
      exerciseName,
      rounds,
      weight,
      descriptionLines
    });
    res.status(201).json(workout);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create workout', detail: error?.message });
  }
});

// Get single workout
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Update workout
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, date, exercises, duration, notes, exerciseName, rounds, weight, descriptionLines } = req.body;
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { name, date, exercises, duration, notes, exerciseName, rounds, weight, descriptionLines, updatedAt: new Date() },
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update workout', detail: error?.message });
  }
});

// Delete workout
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router;

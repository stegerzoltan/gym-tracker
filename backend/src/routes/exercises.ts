import { Router } from 'express';
import Exercise from '../models/Exercise';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get all exercises (default + user custom)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const exercises = await Exercise.find({
      $or: [{ isCustom: false }, { userId: req.userId }]
    });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Search and filter exercises
router.get('/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { q, muscleGroup, category, difficulty } = req.query;
    let query: any = {
      $or: [{ isCustom: false }, { userId: req.userId }]
    };

    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }
    if (muscleGroup) {
      query.muscleGroup = muscleGroup;
    }
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const exercises = await Exercise.find(query);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search exercises' });
  }
});

// Create custom exercise
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      userId: req.userId,
      isCustom: true
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// Seed default exercises
router.post('/seed', async (req, res) => {
  try {
    const defaultExercises = [
      { name: 'Bench Press', category: 'strength', muscleGroup: ['chest', 'triceps'], equipment: 'barbell', difficulty: 'intermediate', description: 'Classic chest exercise', isCustom: false },
      { name: 'Squat', category: 'strength', muscleGroup: ['legs', 'glutes'], equipment: 'barbell', difficulty: 'intermediate', description: 'Fundamental leg exercise', isCustom: false },
      { name: 'Deadlift', category: 'strength', muscleGroup: ['back', 'legs'], equipment: 'barbell', difficulty: 'advanced', description: 'Full body compound movement', isCustom: false },
      { name: 'Pull-ups', category: 'strength', muscleGroup: ['back', 'biceps'], equipment: 'bodyweight', difficulty: 'intermediate', description: 'Upper body pulling exercise', isCustom: false },
      { name: 'Push-ups', category: 'strength', muscleGroup: ['chest', 'triceps'], equipment: 'bodyweight', difficulty: 'beginner', description: 'Basic pushing movement', isCustom: false },
      { name: 'Running', category: 'cardio', muscleGroup: ['cardio', 'legs'], equipment: 'none', difficulty: 'beginner', description: 'Cardiovascular exercise', isCustom: false },
      { name: 'Bicep Curls', category: 'strength', muscleGroup: ['biceps'], equipment: 'dumbbell', difficulty: 'beginner', description: 'Arm isolation exercise', isCustom: false },
      { name: 'Shoulder Press', category: 'strength', muscleGroup: ['shoulders'], equipment: 'dumbbell', difficulty: 'intermediate', description: 'Overhead pressing', isCustom: false },
      { name: 'Lunges', category: 'strength', muscleGroup: ['legs', 'glutes'], equipment: 'bodyweight', difficulty: 'beginner', description: 'Single leg exercise', isCustom: false },
      { name: 'Plank', category: 'strength', muscleGroup: ['abs'], equipment: 'bodyweight', difficulty: 'beginner', description: 'Core stability exercise', isCustom: false }
    ];

    await Exercise.insertMany(defaultExercises);
    res.json({ message: 'Default exercises seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed exercises' });
  }
});

export default router;

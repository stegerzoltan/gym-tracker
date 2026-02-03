import { Router } from 'express';
import Workout from '../models/Workout';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get workout stats and analytics
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await Workout.find({ userId: req.userId });
    
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalVolume = workouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((exSum, ex) => {
        return exSum + (ex.sets * ex.reps * ex.weight);
      }, 0);
    }, 0);

    // Workouts by month
    const workoutsByMonth: any = {};
    workouts.forEach(w => {
      const month = new Date(w.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      workoutsByMonth[month] = (workoutsByMonth[month] || 0) + 1;
    });

    // Calculate streak
    const sortedDates = workouts
      .map(w => new Date(w.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    const today = new Date().toDateString();
    if (sortedDates[0] === today || sortedDates[0] === new Date(Date.now() - 86400000).toDateString()) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      totalWorkouts,
      totalDuration,
      totalVolume,
      averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
      workoutsByMonth,
      currentStreak: streak
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get exercise progress over time
router.get('/exercise/:exerciseName', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ date: 1 });
    const exerciseData = workouts
      .map(w => {
        const exercise = w.exercises.find(e => e.name === req.params.exerciseName);
        if (exercise) {
          return {
            date: w.date,
            weight: exercise.weight,
            reps: exercise.reps,
            sets: exercise.sets,
            volume: exercise.weight * exercise.reps * exercise.sets
          };
        }
        return null;
      })
      .filter(e => e !== null);

    res.json(exerciseData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise progress' });
  }
});

export default router;

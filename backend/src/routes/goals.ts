import { Router } from 'express';
import Goal from '../models/Goal';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get all goals for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create goal
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      userId: req.userId
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal progress
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { current } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.current = current;
    if (current >= goal.target && !goal.completed) {
      goal.completed = true;
      goal.completedAt = new Date();
    }
    
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;

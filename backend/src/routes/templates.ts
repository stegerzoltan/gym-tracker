import { Router } from 'express';
import WorkoutTemplate from '../models/WorkoutTemplate';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// Get all templates for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const templates = await WorkoutTemplate.find({ userId: req.userId }).populate('exercises.exerciseId');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Create template
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const template = await WorkoutTemplate.create({
      ...req.body,
      userId: req.userId
    });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Get single template
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const template = await WorkoutTemplate.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('exercises.exerciseId');
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Delete template
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const template = await WorkoutTemplate.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;

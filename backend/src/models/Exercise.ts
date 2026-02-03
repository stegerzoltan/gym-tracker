import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  category: string;
  muscleGroup: string[];
  equipment: string;
  description: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCustom: boolean;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'powerlifting', 'olympic']
  },
  muscleGroup: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'abs', 'cardio', 'full body']
  }],
  equipment: {
    type: String,
    default: 'bodyweight'
  },
  description: String,
  instructions: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IExercise>('Exercise', exerciseSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  exercises: Array<{
    exerciseId: mongoose.Types.ObjectId;
    sets: number;
    reps: number;
    restTime: number;
  }>;
  createdAt: Date;
}

const workoutTemplateSchema = new Schema<IWorkoutTemplate>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  exercises: [{
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    sets: Number,
    reps: Number,
    restTime: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IWorkoutTemplate>('WorkoutTemplate', workoutTemplateSchema);

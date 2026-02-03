import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes: string;
  }>;
  duration: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>({
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
  date: {
    type: Date,
    required: true
  },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      notes: String
    }
  ],
  duration: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IWorkout>('Workout', workoutSchema);

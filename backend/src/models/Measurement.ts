import mongoose, { Schema, Document } from 'mongoose';

export interface IMeasurement extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  notes?: string;
  createdAt: Date;
}

const measurementSchema = new Schema<IMeasurement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  weight: Number,
  bodyFat: Number,
  chest: Number,
  waist: Number,
  hips: Number,
  biceps: Number,
  thighs: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IMeasurement>('Measurement', measurementSchema);

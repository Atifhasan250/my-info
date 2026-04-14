import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  order: number;
  featured: boolean;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageFileId: { type: String, default: '' },
  tags: { type: [String], default: [] },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

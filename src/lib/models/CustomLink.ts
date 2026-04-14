import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomLink extends Document {
  title: string;
  url: string;
  order: number;
}

const CustomLinkSchema = new Schema<ICustomLink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const CustomLink: Model<ICustomLink> = mongoose.models.CustomLink || mongoose.model<ICustomLink>('CustomLink', CustomLinkSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export type SocialPlatform = 'github' | 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';

export interface ISocial extends Document {
  platform: SocialPlatform;
  url: string;
  order: number;
}

const SocialSchema = new Schema<ISocial>({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Social: Model<ISocial> = mongoose.models.Social || mongoose.model<ISocial>('Social', SocialSchema);

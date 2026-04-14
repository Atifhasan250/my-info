import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  bio: string;
  avatarUrl: string;
  avatarFileId: string;
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  avatarFileId: { type: String, default: '' },
}, { timestamps: true });

export const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

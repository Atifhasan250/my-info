export interface CustomLink {
  id: string;
  title: string;
  url: string;
}

export type SocialPlatform = 'github' | 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

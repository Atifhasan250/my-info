'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateProfileAction } from '@/lib/actions/admin';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface ProfileFormProps {
  initialData: {
    name: string;
    bio: string;
    avatarUrl: string;
    avatarFileId: string;
  } | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bio: initialData?.bio || '',
    avatarUrl: initialData?.avatarUrl || '',
    avatarFileId: initialData?.avatarFileId || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-bold">Avatar Image</Label>
        <ImageUpload
          value={formData.avatarUrl}
          onChange={(url, fileId) => setFormData({ ...formData, avatarUrl: url, avatarFileId: fileId })}
          folder="/info-app/avatars"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
          <Input
            id="name"
            placeholder="Your Name"
            className="h-11 rounded-xl"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bio / About Me</Label>
        <Textarea
          id="bio"
          placeholder="Tell the world about yourself..."
          className="min-h-[120px] rounded-xl resize-none"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20 gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

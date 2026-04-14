'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { upsertSocialAction, deleteSocialAction, reorderSocialsAction } from '@/lib/actions/admin';
import { toast } from 'sonner';
import { 
  Loader2, Plus, Trash2, Edit2, Github, Instagram, Linkedin, 
  Youtube, MessageCircle, Globe, ArrowUp, ArrowDown, MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  FacebookIcon, TiktokIcon, TwitterXIcon, WhatsappIcon 
} from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';

const PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter / X', icon: TwitterXIcon },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { value: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { value: 'whatsapp', label: 'WhatsApp', icon: WhatsappIcon },
];

export function SocialsManager({ initialData }: { initialData: any[] }) {
  const [socials, setSocials] = useState(initialData);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReordered, setIsReordered] = useState(false);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    order: 1,
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        _id: isEditing?._id,
      };
      
      const result = await upsertSocialAction(dataToSave);
      if (result.success) {
        toast.success(isEditing ? 'Social updated' : 'Social added');
        window.location.reload(); 
      }
    } catch (error) {
      toast.error('Error saving social');
    } finally {
      setIsLoading(false);
    }
  }

  // existing imports
  
  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    
    try {
      const result = await deleteSocialAction(id);
      if (result.success) {
        toast.success('Social removed');
        setSocials(prev => prev.filter(s => s._id !== id));
      }
    } catch (error) {
      toast.error('Error deleting');
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === socials.length - 1) return;

    const newSocials = [...socials];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newSocials[index];
    newSocials[index] = newSocials[swapIndex];
    newSocials[swapIndex] = temp;
    
    const itemsToUpdate = newSocials.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setSocials(itemsToUpdate);
    setIsReordered(true);
  }

  async function handleSaveOrder() {
    setIsLoading(true);
    try {
      await reorderSocialsAction(socials.map(i => ({ _id: i._id, order: i.order })));
      toast.success('Order saved');
      setIsReordered(false);
    } catch (e) {
      toast.error('Failed to update order');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card className="bg-muted/30 border-dashed border-2">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Platform</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(v) => setFormData({...formData, platform: v})}
              >
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Profile URL</Label>
              <Input 
                placeholder="https://..." 
                className="h-11 rounded-xl"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl h-11 font-bold gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
                {isEditing ? 'Update' : 'Add Social'}
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsEditing(null); setFormData({platform: '', url: '', order: 1}); }}
                  className="rounded-xl h-11 px-4"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="grid gap-4">
        {socials.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border rounded-2xl bg-muted/10">
            No social links added yet.
          </div>
        )}
        {socials.map((social) => {
          const platform = PLATFORMS.find(p => p.value === social.platform);
          const Icon = platform?.icon || Globe;
          
          return (
            <div key={social._id} className="flex items-center justify-between p-4 bg-card border rounded-2xl group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold capitalize">{social.platform}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">{social.url}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full" 
                  onClick={() => handleMove(socials.indexOf(social), 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full" 
                  onClick={() => handleMove(socials.indexOf(social), 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full" 
                  onClick={() => { setIsEditing(social); setFormData({platform: social.platform, url: social.url, order: social.order}); }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(social._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Dropdown */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMove(socials.indexOf(social), 'up')} className="gap-2 font-medium">
                      <ArrowUp className="h-4 w-4" /> Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMove(socials.indexOf(social), 'down')} className="gap-2 font-medium">
                      <ArrowDown className="h-4 w-4" /> Move Down
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setIsEditing(social); setFormData({platform: social.platform, url: social.url, order: social.order}); }} className="gap-2 font-medium">
                      <Edit2 className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(social._id)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-medium">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
        {isReordered && (
          <div className="flex justify-end pt-4 bg-background sticky bottom-4 z-10 w-full animate-in fade-in slide-in-from-bottom-4">
            <Button onClick={handleSaveOrder} disabled={isLoading} className="rounded-full shadow-2xl h-12 px-8 font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              Save Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

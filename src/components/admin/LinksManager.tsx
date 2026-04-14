'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { upsertLinkAction, deleteLinkAction } from '@/lib/actions/admin';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, Link as LinkIcon, ExternalLink, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { reorderLinksAction } from '@/lib/actions/admin';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';


export function LinksManager({ initialData }: { initialData: any[] }) {
  const [links, setLinks] = useState(initialData);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReordered, setIsReordered] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
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
      
      const result = await upsertLinkAction(dataToSave);
      if (result.success) {
        toast.success(isEditing ? 'Link updated' : 'Link added');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error saving link');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    
    try {
      const result = await deleteLinkAction(id);
      if (result.success) {
        toast.success('Link removed');
        setLinks(prev => prev.filter(l => l._id !== id));
      }
    } catch (error) {
      toast.error('Error deleting');
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newLinks[index];
    newLinks[index] = newLinks[swapIndex];
    newLinks[swapIndex] = temp;
    
    const itemsToUpdate = newLinks.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setLinks(itemsToUpdate);
    setIsReordered(true);
  }

  async function handleSaveOrder() {
    setIsLoading(true);
    try {
      await reorderLinksAction(links.map(i => ({ _id: i._id, order: i.order })));
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
              <Label className="text-xs font-bold uppercase tracking-wider">Button Title</Label>
              <Input 
                placeholder="e.g. My Resume" 
                className="h-11 rounded-xl"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">URL / Path</Label>
              <Input 
                placeholder="https://... or /path" 
                className="h-11 rounded-xl"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl h-11 font-bold gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
                {isEditing ? 'Update' : 'Add Link'}
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsEditing(null); setFormData({title: '', url: '', order: 1}); }}
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
        {links.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border rounded-2xl bg-muted/10">
            No custom links added yet.
          </div>
        )}
        {links.map((link) => (
          <div key={link._id} className="flex items-center justify-between p-4 bg-card border rounded-2xl group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <LinkIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold">{link.title}</h4>
                <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">{link.url}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full" 
                onClick={() => handleMove(links.indexOf(link), 'up')}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full" 
                onClick={() => handleMove(links.indexOf(link), 'down')}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full" 
                onClick={() => { setIsEditing(link); setFormData({title: link.title, url: link.url, order: link.order}); }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(link._id)}
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
                  <DropdownMenuItem onClick={() => handleMove(links.indexOf(link), 'up')} className="gap-2 font-medium">
                    <ArrowUp className="h-4 w-4" /> Move Up
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMove(links.indexOf(link), 'down')} className="gap-2 font-medium">
                    <ArrowDown className="h-4 w-4" /> Move Down
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setIsEditing(link); setFormData({title: link.title, url: link.url, order: link.order}); }} className="gap-2 font-medium">
                    <Edit2 className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(link._id)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-medium">
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
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

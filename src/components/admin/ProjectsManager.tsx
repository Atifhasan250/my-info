'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upsertProjectAction, deleteProjectAction } from '@/lib/actions/admin';
import { toast } from 'sonner';
import { 
  Loader2, Plus, Trash2, Edit2, ExternalLink, Github, 
  Search, Grid, List as ListIcon, Star, ArrowUp, ArrowDown, MoreVertical
} from 'lucide-react';
import { reorderProjectsAction } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ImageUpload } from './ImageUpload';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import Image from 'next/image';

interface ProjectData {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  order: number;
  featured: boolean;
}

export function ProjectsManager({ initialData }: { initialData: any[] }) {
  const [projects, setProjects] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReordered, setIsReordered] = useState(false);

  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    imageUrl: '',
    imageFileId: '',
    liveUrl: '',
    githubUrl: '',
    tags: [],
    order: 1,
    featured: false,
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await upsertProjectAction(formData);
      if (result.success) {
        toast.success(isEditing ? 'Project updated' : 'Project added');
        setIsOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error saving project');
    } finally {
      setIsLoading(false);
    }
  }

  const openAdd = () => {
    setIsEditing(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      imageFileId: '',
      liveUrl: '',
      githubUrl: '',
      tags: [],
      order: 1,
      featured: false,
    });
    setIsOpen(true);
  };

  const openEdit = (project: any) => {
    setIsEditing(project);
    setFormData({
      ...project,
      tags: project.tags || [],
    });
    setIsOpen(true);
  };

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const result = await deleteProjectAction(id);
      if (result.success) {
        toast.success('Project deleted');
        setProjects(prev => prev.filter(p => p._id !== id));
      }
    } catch (error) {
      toast.error('Error deleting project');
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newProjects[index];
    newProjects[index] = newProjects[swapIndex];
    newProjects[swapIndex] = temp;
    
    const itemsToUpdate = newProjects.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setProjects(itemsToUpdate);
    setIsReordered(true);
  }

  async function handleSaveOrder() {
    setIsLoading(true);
    try {
      await reorderProjectsAction(projects.map(i => ({ _id: i._id, order: i.order })));
      toast.success('Order saved');
      setIsReordered(false);
    } catch (e) {
      toast.error('Failed to update order');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-headline">Projects List</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="rounded-xl font-bold gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6 py-4">
              <div className="space-y-4">
                <Label className="text-sm font-bold uppercase tracking-wider">Project Image</Label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url, fileId) => setFormData({ ...formData, imageUrl: url, imageFileId: fileId })}
                  folder="/info-app/projects"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Project Title</Label>
                  <Input 
                    placeholder="Project name" 
                    className="h-11 rounded-xl"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Order Position</Label>
                  <Input 
                    type="number"
                    className="h-11 rounded-xl"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Description</Label>
                <Textarea 
                  placeholder="Short project overview..." 
                  className="min-h-[100px] rounded-xl resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Live URL</Label>
                  <Input 
                    placeholder="https://..." 
                    className="h-11 rounded-xl"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">GitHub URL</Label>
                  <Input 
                    placeholder="https://github.com/..." 
                    className="h-11 rounded-xl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider">Tags / Technologies</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Next.js" 
                    className="h-10 rounded-xl"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-xl px-4">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <Label htmlFor="featured" className="text-base font-bold cursor-pointer">Featured Project</Label>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl h-11 px-6">Cancel</Button>
                <Button type="submit" disabled={isLoading} className="rounded-xl h-11 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/5 font-medium">
            No projects added yet. Click "Add Project" to start.
          </div>
        )}
        {projects.map((project) => (
          <Card key={project._id} className="group relative overflow-hidden border-primary/5 hover:shadow-2xl transition-all duration-300 bg-card rounded-3xl">
            <div className="aspect-video relative overflow-hidden">
              {project.imageUrl ? (
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                   <Star className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
              {project.featured && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Featured
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2">
                <Button type="button" onClick={() => handleMove(projects.indexOf(project), 'up')} variant="secondary" size="icon" className="rounded-full shadow-xl">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" onClick={() => handleMove(projects.indexOf(project), 'down')} variant="secondary" size="icon" className="rounded-full shadow-xl">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" onClick={() => openEdit(project)} variant="secondary" size="icon" className="rounded-full shadow-xl">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button type="button" onClick={() => handleDelete(project._id)} variant="destructive" size="icon" className="rounded-full shadow-xl">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile 3-dot Menu */}
              <div className="absolute top-3 right-3 sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-xl h-8 w-8 bg-background/80 backdrop-blur-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMove(projects.indexOf(project), 'up')} className="gap-2 font-medium">
                      <ArrowUp className="h-4 w-4" /> Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMove(projects.indexOf(project), 'down')} className="gap-2 font-medium">
                      <ArrowDown className="h-4 w-4" /> Move Down
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEdit(project)} className="gap-2 font-medium">
                      <Edit2 className="h-4 w-4" /> Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(project._id)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-medium">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-headline line-clamp-1">{project.title}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-[10px] font-bold text-muted-foreground uppercase">{tag}</span>
                ))}
                {(project.tags?.length || 0) > 3 && <span className="text-[10px] font-bold text-muted-foreground">+{project.tags.length - 3}</span>}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      {isReordered && (
        <div className="flex justify-end pt-4 bg-background sticky bottom-4 z-10 w-full animate-in fade-in slide-in-from-bottom-4">
          <Button onClick={handleSaveOrder} disabled={isLoading} className="rounded-full shadow-2xl h-12 px-8 font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Save Order
          </Button>
        </div>
      )}
    </div>
  );
}

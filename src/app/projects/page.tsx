'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sun,
  Moon,
  Github,
  ExternalLink,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LogoIcon } from '@/components/icons';
import { Preloader } from '@/components/ui/preloader';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface IProject {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}

export default function ProjectsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleLoad = () => setLoading(false);
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          setProjects(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setDataLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading || dataLoading) {
    return <Preloader visible={true} />;
  }

  return (
    <>
      <Preloader visible={loading || dataLoading} />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground font-body">
        <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
          <div className="w-full max-w-4xl mx-auto p-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="cursor-pointer">
                <LogoIcon className="h-6 w-6 text-foreground" />
              </Link>
              {mounted && (
                <Button onClick={toggleTheme} size="icon" variant="outline">
                  {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        </nav>
        <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold font-headline">My Projects</h1>
            <p className="text-muted-foreground mt-2 text-lg">A collection of my recent work and experiments.</p>
          </header>

          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by name, description or tag..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="bg-card shadow-md overflow-hidden group flex flex-col">
                <div 
                  className="relative overflow-hidden h-64 cursor-zoom-in"
                  onClick={() => setSelectedImage({ src: project.imageUrl, alt: project.title })}
                >
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline">{project.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground pt-2 min-h-[6rem]">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end space-x-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button>
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </section>

          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="max-w-4xl w-[90vw] p-2 bg-black/90 border-0 outline-none">
              <DialogTitle className="sr-only">Project Image View</DialogTitle>
              <DialogDescription className="sr-only">Viewing {selectedImage?.alt} in full size</DialogDescription>
              {selectedImage && (
                <div className="relative w-full overflow-hidden rounded-md">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain max-h-[85vh]"
                    priority
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="mt-12 flex justify-start">
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>
        </main>
        <footer className="w-full max-w-4xl mx-auto p-4 text-center text-muted-foreground border-t border-border">
          <p>Designed by Atif Hasan</p>
        </footer>
      </div>
    </>
  );
}

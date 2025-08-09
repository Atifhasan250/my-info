
'use client';

import { useState, type FC, useEffect } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  Sun,
  Moon,
  Github,
  ExternalLink,
  Search,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescriptionComponent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { LogoIcon } from '@/components/icons';
import { Preloader } from '@/components/ui/preloader';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import shortenedLinkImg from './shortened-link.png';
import capitalBalanceImg from './capital-balance.png';
import shadJatraImg from './shad-jatra.png';
import classnoteSorterImg from './classnote-sorter.png';

const projects = [
  {
    id: '1',
    title: 'Shortened Link',
    description: 'A powerful, easy-to-use URL shortener with custom links, instant redirects, and link previews.',
    imageUrl: shortenedLinkImg,
    liveUrl: 'https://shortened-link.vercel.app/',
    githubUrl: 'https://github.com/Atifhasan250/shortened-link',
  },
  {
    id: '2',
    title: "Shad Jatra",
    description: 'Explore the rich flavors of Bangladeshi cuisine. Step-by-step guides in a user-friendly web app.',
    imageUrl: shadJatraImg,
    liveUrl: 'https://shad-jatra.vercel.app/',
    githubUrl: 'https://github.com/Atifhasan250/shad-jatra',
  },
  {
    id: '3',
    title: "classnote Sorter",
    description: 'Optimize your learning with Classnote Sorter, an AI-powered web app for effortless organization and management of PDF class notes.',
    imageUrl: classnoteSorterImg,
    liveUrl: 'https://classnote-sorter.vercel.app/',
    githubUrl: 'https://github.com/Atifhasan250/classnote-sorter',
  },
  {
    id: '4',
    title: "Capital Balance",
    description: 'Track and manage your personal capital with ease. This project is a finance dashboard built with Next.js, React, TypeScript, Tailwind CSS, and Recharts for data visualization.',
    imageUrl: capitalBalanceImg,
    liveUrl: 'https://capital-balance.vercel.app/',
    githubUrl: 'https://github.com/Atifhasan250/capital-balance',
  },
];

export default function ProjectsPage() {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        const savedTheme = JSON.parse(storedTheme);
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
      } else {
        document.documentElement.className = theme;
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      document.documentElement.className = theme;
    }
  }, [theme]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(lowercasedQuery) ||
      project.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProjects(filtered);
  }, [searchQuery]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', JSON.stringify(newTheme));
      document.documentElement.className = newTheme;
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground font-body">
        <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
          <div className="w-full max-w-4xl mx-auto p-3">
              <div className="flex justify-between items-center">
                  <Link href="/" className="cursor-pointer">
                    <LogoIcon className="h-6 w-6 text-foreground" />
                  </Link>
                  <Button onClick={toggleTheme} size="icon" variant="outline">
                      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
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
                      placeholder="Search projects by name or description..."
                      className="w-full pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
              setSelectedImage(null);
            }
          }}>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="bg-card shadow-md overflow-hidden group flex flex-col">
                  <DialogTrigger asChild onClick={() => {
                    setSelectedImage(project.imageUrl);
                    setIsDialogOpen(true);
                  }}>
                    <div className="relative overflow-hidden h-64 cursor-pointer">
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title} 
                        fill
                        className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </DialogTrigger>
                  <div className="flex flex-col flex-grow">
                    <CardHeader>
                      <CardTitle className="text-2xl font-headline">{project.title}</CardTitle>
                      <CardDescriptionComponent className="text-base text-muted-foreground pt-2 min-h-[6rem]">{project.description}</CardDescriptionComponent>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex justify-end space-x-4">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button>
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </section>
            {selectedImage && (
              <DialogContent className="w-[90vw] max-w-4xl p-0 bg-transparent border-0 max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">Project Image</DialogTitle>
                <DialogDescription className="sr-only">Full-sized view of the project image.</DialogDescription>
                <Image 
                  src={selectedImage} 
                  alt="Selected Project Image" 
                  className="w-full h-auto rounded-lg"
                />
                <DialogClose className="absolute right-[-2rem] top-[-1rem] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-6 w-6 text-white" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            )}
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

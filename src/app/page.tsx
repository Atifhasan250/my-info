
'use client';

import { useState, type FC, useEffect } from 'react';
import Image from 'next/image';
import {
  Github,
  Instagram,
  Linkedin,
  Youtube,
  Link as LinkIcon,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';
import { type SocialPlatform, type CustomLink, type SocialLink } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FacebookIcon, TiktokIcon, TwitterXIcon, WhatsappIcon, LogoIcon } from '@/components/icons';
import { Preloader } from '@/components/ui/preloader';
import Link from 'next/link';

const socialIconMap: Record<SocialPlatform, FC<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: TwitterXIcon,
  youtube: Youtube,
  instagram: Instagram,
  facebook: FacebookIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsappIcon,
};

const initialProfile = {
  name: 'Atif Hasan',
  bio: "i'm A web developer from Bangladesh specializing in modern, user-centric web applications.",
  avatarUrl: 'https://avatars.githubusercontent.com/u/83109245?v=4'
}

const initialSocials: SocialLink[] = [
  { id: '1', platform: 'github', url: 'https://github.com/atifhasan250' },
  { id: '2', platform: 'linkedin', url: 'https://www.linkedin.com/in/atifhasan250/' },
  { id: '3', platform: 'facebook', url: 'https://www.facebook.com/atifhasan250/' },
  { id: '4', platform: 'instagram', url: 'https://www.instagram.com/_atif_hasan_/' },
  { id: '5', platform: 'youtube', url: 'https://www.youtube.com/@FRSoftwares' },
  { id: '6', platform: 'whatsapp', url: 'https://wa.me/8801754020488' },
];

const initialLinks: CustomLink[] = [
  { id: '1', title: 'My Portfolio', url: 'https://atifs-portfolio.vercel.app/' },
  { id: '2', title: 'My Latest Project', url: '/projects' },
];

export default function Home() {
  const [profile, setProfile] = useState(initialProfile);
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);
  const [links, setLinks] = useState<CustomLink[]>(initialLinks);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [projectLinkLoading, setProjectLinkLoading] = useState(false);

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
      const storedProfile = localStorage.getItem('profile');
      const storedSocials = localStorage.getItem('socials');
      const storedLinks = localStorage.getItem('links');
      const storedTheme = localStorage.getItem('theme');

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedSocials) setSocials(JSON.parse(storedSocials));
      if (storedLinks) setLinks(JSON.parse(storedLinks));
      if (storedTheme) setTheme(JSON.parse(storedTheme));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    document.documentElement.className = theme;
    try {
      localStorage.setItem('theme', JSON.stringify(theme));
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleProjectLinkClick = () => {
    setProjectLinkLoading(true);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground font-body">
      <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="w-full max-w-2xl mx-auto p-3">
            <div className="flex justify-between items-center">
                <button onClick={scrollToTop} className="cursor-pointer">
                  <LogoIcon className="h-6 w-6 text-foreground" />
                </button>
                <Button onClick={toggleTheme} size="icon" variant="outline">
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>
        </div>
      </nav>
      <main className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <header className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-card shadow-lg ring-2 ring-primary transition-transform transform hover:scale-105 hover:shadow-2xl">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold font-headline">{profile.name}</h1>
        </header>

        <section className="mb-8">
          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center justify-between">
                <span>About Me</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground leading-relaxed about-me-bio">{profile.bio}</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center justify-between">
                <span>Socials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center flex-wrap">
                {socials.map((social) => {
                  const Icon = socialIconMap[social.platform];
                  return (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="m-4">
                      <Icon className="h-8 w-8 text-foreground transition-colors hover:text-primary" />
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center justify-between">
                <span>Important Links</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 pt-6">
              {links.map((link) => {
                const isInternal = link.url.startsWith('/');
                const Component = isInternal ? Link : 'a';
                return (
                  <Button
                    key={link.id}
                    asChild
                    variant="default"
                    className="w-full h-14 text-lg bg-primary/90 hover:bg-primary text-primary-foreground font-semibold shadow-lg transition-transform transform hover:scale-105"
                  >
                    <Component 
                      href={link.url} 
                      {...(isInternal ? { onClick: handleProjectLinkClick } : {target: '_blank', rel: 'noopener noreferrer'})}
                    >
                      <LinkIcon className="h-5 w-5 mr-3" />
                      {link.title}
                      {isInternal && projectLinkLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                    </Component>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="w-full max-w-2xl mx-auto p-4 text-center text-muted-foreground border-t border-border">
        <p>Designed by Atif Hasan</p>
      </footer>
    </div>
    </>
  );
}

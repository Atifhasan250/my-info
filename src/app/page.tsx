'use client';

import { useState, type FC, useEffect } from 'react';
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
import { useTheme } from 'next-themes';
import { type SocialPlatform, type CustomLink, type SocialLink } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FacebookIcon, TiktokIcon, TwitterXIcon, WhatsappIcon, LogoIcon } from '@/components/icons';
import { Preloader } from '@/components/ui/preloader';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Link from 'next/link';
import Image from 'next/image';

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

export default function Home() {
  const [profile, setProfile] = useState<{ name: string; bio: string; avatarUrl: string } | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [links, setLinks] = useState<CustomLink[]>([]);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [projectLinkLoading, setProjectLinkLoading] = useState(false);
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
    setProjectLinkLoading(false);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, socialsRes, linksRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/socials'),
          fetch('/api/links'),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (socialsRes.ok) setSocials(await socialsRes.json());
        if (linksRes.ok) setLinks(await linksRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
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

  if (loading || dataLoading) {
    return <Preloader visible={true} />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-xl font-semibold mb-4">No profile found.</p>
        <p className="text-muted-foreground">Please run the seed script to populate data.</p>
      </div>
    );
  }

  return (
    <>
      <Preloader visible={loading || dataLoading} />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground font-body">
        <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
          <div className="w-full max-w-2xl mx-auto p-3">
              <div className="flex justify-between items-center">
                  <button onClick={scrollToTop} className="cursor-pointer">
                    <LogoIcon className="h-6 w-6 text-foreground" />
                  </button>
                  {mounted && (
                    <Button onClick={toggleTheme} size="icon" variant="outline">
                        {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  )}
              </div>
          </div>
        </nav>
        <main className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
          <header className="text-center mb-8">
            <Avatar 
              className="w-32 h-32 mx-auto mb-4 border-4 border-card shadow-lg ring-2 ring-primary transition-transform transform hover:scale-105 hover:shadow-2xl cursor-zoom-in"
              onClick={() => setSelectedImage({ src: profile.avatarUrl, alt: profile.name })}
            >
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
                      <a key={social.id || (social as any)._id} href={social.url} target="_blank" rel="noopener noreferrer" className="m-4">
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
                  const isSpecialProtocol = link.url.startsWith('mailto:') || link.url.startsWith('tel:');
                  
                  const className = cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-14 text-lg bg-primary/90 hover:bg-primary text-primary-foreground font-semibold shadow-lg transition-transform transform hover:scale-105"
                  );

                  if (isInternal) {
                    return (
                      <Link
                        key={link.id || (link as any)._id}
                        href={link.url}
                        className={className}
                        onClick={handleProjectLinkClick}
                      >
                        <LinkIcon className="h-5 w-5 mr-3" />
                        {link.title}
                        {projectLinkLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={link.id || (link as any)._id}
                      href={link.url}
                      className={className}
                      {...(!isSpecialProtocol ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <LinkIcon className="h-5 w-5 mr-3" />
                      {link.title}
                    </a>
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

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-2xl w-[90vw] p-2 bg-black/90 border-0 outline-none">
          <DialogTitle className="sr-only">Profile Image View</DialogTitle>
          <DialogDescription className="sr-only">Viewing profile picture in full size</DialogDescription>
          {selectedImage && (
            <div className="relative w-full aspect-square overflow-hidden rounded-full border-4 border-card">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

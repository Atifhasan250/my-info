import { connectToDatabase } from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';
import { Social } from '@/lib/models/Social';
import { CustomLink } from '@/lib/models/CustomLink';
import { Project } from '@/lib/models/Project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { SocialsManager } from '@/components/admin/SocialsManager';
import { LinksManager } from '@/components/admin/LinksManager';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LogoIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/admin/ThemeToggle';
import { LogOut, User, Share2, Link as LinkIcon, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function handleLogout() {
  'use server';
  await logout();
  redirect('/admin/login');
}

export default async function AdminDashboard() {
  await connectToDatabase();
  
  const profile = await Profile.findOne().lean();
  const socials = await Social.find().sort({ order: 1 }).lean();
  const links = await CustomLink.find().sort({ order: 1 }).lean();
  const projects = await Project.find().sort({ order: 1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <LogoIcon className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Admin Panel</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <form action={handleLogout}>
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </form>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="socials" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Socials</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="shadow-xl border-primary/5">
              <CardHeader>
                <CardTitle className="font-headline">Profile Information</CardTitle>
                <CardDescription>Update your personal details and avatar image.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm initialData={JSON.parse(JSON.stringify(profile))} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socials" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="shadow-xl border-primary/5">
              <CardHeader>
                <CardTitle className="font-headline">Social Media Links</CardTitle>
                <CardDescription>Manage the social icons that appear on your home page.</CardDescription>
              </CardHeader>
              <CardContent>
                <SocialsManager initialData={JSON.parse(JSON.stringify(socials))} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="shadow-xl border-primary/5">
              <CardHeader>
                <CardTitle className="font-headline">Custom Links</CardTitle>
                <CardDescription>Add, edit or remove custom link buttons.</CardDescription>
              </CardHeader>
              <CardContent>
                <LinksManager initialData={JSON.parse(JSON.stringify(links))} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="shadow-xl border-primary/5">
              <CardHeader>
                <CardTitle className="font-headline">Projects Gallery</CardTitle>
                <CardDescription>Manage your portfolio projects and experiments.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsManager initialData={JSON.parse(JSON.stringify(projects))} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

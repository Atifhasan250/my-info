import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Atif Hasan | Web & Mobile App Developer',
  description: 'Atif Hasan - Full Stack Developer based in Bogura, Bangladesh. Specialist in Web and Mobile App development. Explore my projects, socials, and portfolio links.',
  keywords: ['Atif Hasan', 'Bogura Bangladesh', 'Web Developer', 'Mobile App Developer', 'Full Stack Dev', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Atif Hasan' }],
  creator: 'Atif Hasan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atifs-info.vercel.app/',
    title: 'Atif Hasan | Link Portal & Portfolio',
    description: 'Full Stack Web & Mobile App Developer based in Bogura, Bangladesh.',
    siteName: 'Atif Hasan Portfolio',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotesHub - Share and Discover Study Notes',
  description: 'A platform for sharing, discovering, and reading academic notes with AI-powered assistance.',
  keywords: 'notes, study, education, academic, AI, tutoring',
  authors: [{ name: 'NotesHub Team' }],
  openGraph: {
    title: 'NotesHub - Share and Discover Study Notes',
    description: 'A platform for sharing, discovering, and reading academic notes with AI-powered assistance.',
    type: 'website',
    siteName: 'NotesHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotesHub - Share and Discover Study Notes',
    description: 'A platform for sharing, discovering, and reading academic notes with AI-powered assistance.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
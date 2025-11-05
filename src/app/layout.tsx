import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { NovaChat } from '@/components/nova-chat';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Shopora: AI-Powered Shopping',
  description:
    'Shopora is a modern, minimalistic e-commerce platform featuring an intelligent AI assistant called Nova.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FirebaseClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <NovaChat />
          <Toaster />
          <footer className="bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto py-6 px-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
                © 2024{' '}
                <Link href="/" className="hover:underline">
                  Shopora™
                </Link>
                . All rights reserved to the developer pratyoosh.
              </span>
            </div>
          </footer>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

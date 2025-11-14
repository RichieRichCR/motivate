import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/styles.css';
import './globals.css';
import { NavBar } from '@/components/nav';
// import { AnimatedGradientBackground } from '@/components/animated-gradient-bg';
import Aurora from '../components/aurora';
import { TimeframeProvider } from './provider/timeframe-provider';
import { PreferencesProvider } from './provider/preferences-provider';
import { ServiceWorkerRegistration } from '../components/service-worker-registration';
import { QueryProvider } from './provider/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Motivate - Health & Fitness Dashboard',
    template: '%s | Motivate',
  },
  description:
    'Track your health metrics, monitor your progress, and achieve your fitness goals with Motivate.',
  keywords: [
    'health',
    'fitness',
    'tracking',
    'dashboard',
    'metrics',
    'weight',
    'steps',
    'exercise',
  ],
  authors: [{ name: 'RichieRich' }],
  creator: 'RichieRich',
  applicationName: 'Motivate',
  appleWebApp: {
    capable: true,
    title: 'Motivate',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Motivate" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen flex items-center justify-center`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:m-2"
        >
          Skip to main content
        </a>

        <QueryProvider>
          <PreferencesProvider>
            <TimeframeProvider defaultTimeRange="7d">
              <ServiceWorkerRegistration />
              <Aurora
                colorStops={['#3A29FF', '#Fd12B3', '#0ff9aa']}
                blend={0.75}
                amplitude={0.5}
                speed={0.25}
              />

              {/* <AnimatedGradientBackground /> */}
              <main className="relative z-10 p-4 container h-full w-full">
                <NavBar />
                {children}
              </main>
            </TimeframeProvider>
          </PreferencesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

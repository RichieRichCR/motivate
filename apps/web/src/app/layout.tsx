import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/styles.css';
import './globals.css';
import { NavBar } from '@/components/nav';
// import { AnimatedGradientBackground } from '@/components/animated-gradient-bg';
import Aurora from '../components/aurora';
import { TimeframeProvider } from './provider/timeframe-provider';

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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen flex items-center justify-center`}
      >
        <TimeframeProvider defaultTimeRange="7d">
          <Aurora
            colorStops={['#3A29FF', '#Fd12B3', '#0ff9aa']}
            blend={0.75}
            amplitude={0.5}
            speed={0.25}
          />

          {/* <AnimatedGradientBackground /> */}
          <div className="relative z-10 p-4 container h-full">
            <NavBar />
            {children}
          </div>
        </TimeframeProvider>
      </body>
    </html>
  );
}

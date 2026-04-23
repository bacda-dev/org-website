import type { Metadata, Viewport } from 'next';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { OrganizationSchema } from '@/lib/seo/json-ld';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bay Area Creative Dancers',
    template: '%s — Bay Area Creative Dancers',
  },
  description:
    'A San Francisco Bay Area non-profit dance organization led by artistic director Dalia Sen. Classical, contemporary, and fusion Indian dance productions. Foster the Love of Dance.',
  keywords: [
    'Bay Area Creative Dancers',
    'BACDA',
    'Dalia Sen',
    'Indian classical dance',
    'Bay Area dance',
    'Bengali dance',
    'NABC',
    'Bharatnatyam',
    'Kathak',
    'dance performance',
  ],
  authors: [{ name: 'Bay Area Creative Dancers' }],
  creator: 'Bay Area Creative Dancers',
  openGraph: {
    title: 'Bay Area Creative Dancers',
    description: 'Foster the Love of Dance',
    url: SITE_URL,
    siteName: 'Bay Area Creative Dancers',
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bay Area Creative Dancers',
    description: 'Foster the Love of Dance',
    images: ['/brand/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
        <OrganizationSchema />
      </body>
    </html>
  );
}

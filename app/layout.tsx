import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import { FirebaseProvider } from '@/components/firebase-provider'
import './globals.css'

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  title: 'StudyPal | AI-Powered Personalized Learning Companion',
  description: 'Master any skill with StudyPal. AI-generated learning paths, interactive quizzes, and gamified skill progression designed to maximize your study efficiency.',
  keywords: ['AI learning', 'personalized study', 'study companion', 'learning platform', 'skill mastery', 'gamified education'],
  authors: [{ name: 'StudyPal Team' }],
  metadataBase: new URL('https://studypal-companion-app.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StudyPal — Your AI-Powered Learning Partner',
    description: 'Create personalized study paths and track your micro-skill progression with AI.',
    type: 'website',
    url: 'https://studypal-companion-app.web.app',
    siteName: 'StudyPal',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'StudyPal Dashboard Preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyPal — AI Learning Companion',
    description: 'Master subjects faster with AI-generated curricula and interactive scenarios.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* FirebaseProvider initialises Firestore sync on mount */}
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import { FirebaseProvider } from '@/components/firebase-provider'
import './globals.css'

const nunito = Nunito({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
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
  openGraph: {
    title: 'StudyPal — Your AI-Powered Learning Partner',
    description: 'Create personalized study paths and track your micro-skill progression with AI.',
    type: 'website',
    url: 'https://studypal-companion-app.web.app',
    siteName: 'StudyPal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyPal — AI Learning Companion',
    description: 'Master subjects faster with AI-generated curricula and interactive scenarios.',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${nunito.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* FirebaseProvider initialises Firestore sync on mount */}
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  )
}

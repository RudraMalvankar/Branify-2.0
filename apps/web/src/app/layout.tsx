import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brainify — Learn Your Way',
  description:
    'AI-powered personalized learning platform. Discover your learning style with VARK assessment and get tailored study resources.',
  keywords: ['learning', 'education', 'VARK', 'AI', 'study', 'personalized learning'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
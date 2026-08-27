import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/booking/BookingModal';
import { siteSettings } from '@/data/site-settings';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteSettings.resortName} — ${siteSettings.tagline}`,
  description: siteSettings.shortDesc,
  keywords: ['Archazor resort', 'Zilva resort', 'Chimgan dam olish maskani', 'Chorvoq kottejlar', 'tog\' mehmonxonasi', 'SPA tog\'da', 'luxury mountain resort uzbekistan'],
  openGraph: {
    title: `${siteSettings.resortName} — ${siteSettings.tagline}`,
    description: siteSettings.shortDesc,
    type: 'website',
    locale: 'uz_UZ',
    siteName: siteSettings.resortName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-[#b88a44] selection:text-white">
        <ThemeProvider>
          <BookingProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <BookingModal />
          </BookingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



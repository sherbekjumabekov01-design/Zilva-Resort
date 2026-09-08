import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/booking/BookingModal';
import AiConciergeChat from '@/components/chat/AiConciergeChat';
import OfflineGuard from '@/components/common/OfflineGuard';
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
    <html lang="uz" suppressHydrationWarning className={`dark ${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased min-h-screen bg-[#07110c] text-white flex flex-col justify-between selection:bg-[#b88a44] selection:text-white">
        <LanguageProvider>
          <ThemeProvider>
            <BookingProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <BookingModal />
              <AiConciergeChat />
              <OfflineGuard />
            </BookingProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}



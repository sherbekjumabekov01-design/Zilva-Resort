'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Menu,
  X,
  Calendar,
  Mountain,
  Sparkles,
  Sun,
  MapPin,
  Clock,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  Globe
} from 'lucide-react';
import { siteSettings } from '@/data/site-settings';
import { useBooking } from '@/context/BookingContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const pathname = usePathname();
  const { openBookingModal } = useBooking();
  const { theme, toggleTheme, isDark } = useTheme();

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-[#12241b]/95 dark:bg-[#09120c]/95 backdrop-blur-2xl shadow-2xl border-b border-white/10 dark:border-white/5 py-2.5 text-white'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-2 pb-4 text-white'
        }`}
      >
        {/* Top Info Strip (Visible on large screens before or during scroll) */}
        <div className={`hidden lg:block transition-all duration-300 pb-2 mb-2 border-b ${
          isScrolled ? 'border-white/5' : 'border-white/10'
        }`}>
          <div className="resort-container flex items-center justify-between text-[11px] text-white/80">
            {/* Left info items */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-white/90">
                <MapPin className="w-3.5 h-3.5 text-[#d8aa62]" />
                <span>Chimgan tog'lari, Bo'stonliq tumani</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Chimgan ob-havosi: <strong className="text-white">+22°C</strong> (Musaffo tog' havosi)</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Clock className="w-3.5 h-3.5 text-[#d8aa62]" />
                <span>24/7 Mehmonxona & Qabulxona</span>
              </div>
            </div>

            {/* Right info items */}
            <div className="flex items-center gap-5">
              <a
                href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-1.5 font-medium hover:text-[#d8aa62] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#d8aa62]" />
                <span>{siteSettings.phone}</span>
              </a>

              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-[#b88a44] text-white/80 hover:text-white transition-all"
                title="Admin boshqaruv paneli"
              >
                <Shield className="w-3 h-3 text-[#d8aa62]" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="resort-container flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl border border-[#d8aa62]/50 flex items-center justify-center bg-[#1b382b]/80 backdrop-blur-md group-hover:scale-105 group-hover:border-[#d8aa62] transition-all shadow-lg">
              <Mountain className="w-6 h-6 text-[#d8aa62] group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="block font-serif text-2xl font-bold tracking-widest uppercase text-white group-hover:text-[#d8aa62] transition-colors">
                  Zilva
                </span>
                <span className="text-[10px] text-amber-300 font-serif tracking-widest">★★★★★</span>
              </div>
              <span className="block text-[9px] tracking-[0.3em] text-[#d8aa62] uppercase font-light -mt-0.5">
                Resort & Spa • Chimgan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {siteSettings.navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-wider font-semibold transition-all relative py-1.5 px-3 rounded-full ${
                    isActive
                      ? 'bg-white/15 text-[#d8aa62] shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#d8aa62] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Eye / Dark Mode Button */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                isDark
                  ? 'bg-[#b88a44] border-[#d8aa62] text-white shadow-md shadow-[#b88a44]/20'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
              title={isDark ? "Yorug' rejimga o'tish (Oqartirish)" : "Ko'zcha / Tungi rejim (Qoraytirish)"}
              aria-label="Ko'zcha rejimini yoqish/o'chirish"
            >
              {isDark ? (
                <Eye className="w-3.5 h-3.5 text-amber-100" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#d8aa62]" />
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/15 text-[11px] font-bold">
              {(['UZ', 'RU', 'EN'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    currentLang === lang
                      ? 'bg-[#b88a44] text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => openBookingModal()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#b88a44] via-[#c79a55] to-[#b88a44] hover:from-[#a77a35] hover:to-[#b88a44] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-amber-300/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Xonani Bron Qilish</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Eye Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${
                isDark ? 'bg-[#b88a44] border-[#d8aa62] text-white' : 'bg-white/10 border-white/20 text-white'
              }`}
              title="Ko'zcha rejimi"
              aria-label="Ko'zcha rejimi"
            >
              {isDark ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-[#d8aa62]" />}
            </button>

            {/* Mobile Quick Book Button */}
            <button
              onClick={() => openBookingModal()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#b88a44] text-white text-xs font-semibold shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bron</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              aria-label="Menyuni ochish"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#12241b]/98 dark:bg-[#09120c]/98 backdrop-blur-2xl flex flex-col justify-between pt-20 pb-8 px-6 text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="block font-serif text-xl font-bold tracking-wider text-[#d8aa62]">
                  ZILVA RESORT & SPA
                </span>
                <span className="text-[11px] text-white/70">Chimgan, Bo'stonliq • 24/7 Xizmat</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-2">
              {siteSettings.navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base font-medium py-2.5 px-4 rounded-2xl flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#b88a44] text-white font-bold shadow-md'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Weather & Info Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <Sun className="w-4 h-4" />
                <span>Chimgan ob-havosi: <strong>+22°C</strong> (Musaffo tog' havosi)</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 text-[#d8aa62]" />
                <span>{siteSettings.address}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-4 border-t border-white/10 pt-6 mt-6">
            <div className="flex items-center justify-between">
              <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-2 text-sm font-semibold text-white">
                <Phone className="w-4 h-4 text-[#d8aa62]" />
                <span>{siteSettings.phone}</span>
              </a>

              <Link
                href="/admin/login"
                className="text-xs text-white/60 hover:text-white flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-[#d8aa62]" />
                <span>Admin Login</span>
              </Link>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white font-bold text-center uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Xonani hoziroq bron qilish</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

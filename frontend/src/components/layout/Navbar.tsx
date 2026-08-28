'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  ChevronRight,
  Phone,
  Shield,
  Calendar
} from 'lucide-react';
import { siteSettings } from '@/data/site-settings';
import { useBooking } from '@/context/BookingContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('RU');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isWinter, setIsWinter] = useState(true);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { openBookingModal } = useBooking();
  const { toggleTheme, isDark } = useTheme();

  const isHomePage = pathname === '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile & dropdown menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Localized Navigation Links
  const navItems = [
    {
      href: '/',
      label: currentLang === 'RU' ? 'Главная' : currentLang === 'EN' ? 'Home' : 'Bosh sahifa'
    },
    {
      href: '/rooms',
      label: currentLang === 'RU' ? 'Номера' : currentLang === 'EN' ? 'Rooms' : 'Xonalar'
    },
    {
      href: '/restaurant',
      label: currentLang === 'RU' ? 'Ресторан' : currentLang === 'EN' ? 'Restaurant' : 'Restoran'
    },
    {
      href: '/spa',
      label: currentLang === 'RU' ? 'SPA и здоровье' : currentLang === 'EN' ? 'SPA & Wellness' : 'SPA va salomatlik'
    },
    {
      href: '/activities',
      label: currentLang === 'RU' ? 'Досуг' : currentLang === 'EN' ? 'Leisure' : 'Faoliyatlar'
    },
    {
      href: '/contact',
      label: currentLang === 'RU' ? 'Контакты' : currentLang === 'EN' ? 'Contacts' : 'Aloqa'
    }
  ];

  const bookingBtnText =
    currentLang === 'RU' ? 'Забронировать' : currentLang === 'EN' ? 'Book Now' : 'Bron qilish';

  const seasonText = isWinter
    ? currentLang === 'RU' ? 'ЗИМА' : currentLang === 'EN' ? 'WINTER' : 'QISH'
    : currentLang === 'RU' ? 'ЛЕТО' : currentLang === 'EN' ? 'SUMMER' : 'YOZ';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-[#0d1e16]/95 dark:bg-[#07110c]/95 backdrop-blur-xl shadow-xl border-b border-white/10 py-3 text-white'
            : 'bg-gradient-to-b from-black/75 via-black/35 to-transparent pt-3.5 pb-4 text-white'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 1. Left: Spruce / Pine Tree Logo */}
          <Link href="/" className="flex flex-col items-center group -my-1">
            <div className="flex flex-col items-center">
              {/* Stylized Pine Tree Icon matching reference */}
              <svg
                viewBox="0 0 70 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-8 text-white transition-transform group-hover:scale-105"
              >
                {/* Top tier */}
                <path d="M35 2 L26 14 H31 L22 24 H28 L17 36 H24 L11 50 H59 L46 36 H53 L42 24 H48 L39 14 H44 Z" fill="white" />
                {/* Tree Trunk */}
                <rect x="33" y="50" width="4" height="6" fill="white" rx="0.5" />
              </svg>
              {/* Brand Text */}
              <span className="text-[11px] font-bold tracking-[0.28em] text-white uppercase mt-0.5 leading-none group-hover:text-amber-200 transition-colors">
                ZILVA
              </span>
            </div>
          </Link>

          {/* 2. Center: Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13.5px] font-normal tracking-wide transition-all relative py-1 hover:text-white ${
                    isActive ? 'text-white font-medium' : 'text-white/85 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#d8aa62] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Action Controls */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            {/* Season Pill Switch (Winter / Summer) */}
            <button
              onClick={() => setIsWinter(!isWinter)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 shadow-sm hover:opacity-95 ${
                isWinter ? 'bg-[#0084d6] text-white' : 'bg-emerald-600 text-white'
              }`}
              title={isWinter ? "Qishki rejim (O'zgartirish uchun bosing)" : "Yozgi rejim (O'zgartirish uchun bosing)"}
            >
              <span className="pl-1 text-[10.5px]">{seasonText}</span>
              <span
                className={`w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md ${
                  isWinter ? 'translate-x-0' : '-translate-x-0'
                }`}
              />
            </button>

            {/* Sun / Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title={isDark ? "Yorug' rejim" : "Tungi rejim"}
              aria-label="Mavzuni o'zgartirish"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-amber-200" />
              ) : (
                <Sun className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Globe Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-white/90 hover:text-white px-2 py-1 rounded-full hover:bg-white/10 transition-colors text-xs font-medium"
                aria-label="Tilni tanlash"
              >
                <Globe className="w-4 h-4 text-white/90" />
                <span className="text-[11px] font-medium">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0e2118]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  {(['UZ', 'RU', 'EN'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentLang === lang
                          ? 'bg-[#d8aa62]/20 text-[#d8aa62] font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{lang === 'UZ' ? "O'zbekcha" : lang === 'RU' ? 'Русский' : 'English'}</span>
                      <span className="text-[10px] font-bold opacity-60">{lang}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Glassmorphic Rounded Pill Booking Button */}
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[13px] font-medium tracking-wide transition-all shadow-sm hover:shadow-lg hover:border-white/60 active:scale-95"
            >
              {bookingBtnText}
            </button>
          </div>

          {/* 4. Mobile Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {/* Mobile Season switch */}
            <button
              onClick={() => setIsWinter(!isWinter)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                isWinter ? 'bg-[#0084d6] text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              <span>{seasonText}</span>
              <span className="w-3 h-3 rounded-full bg-white" />
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-white/90 rounded-full bg-white/10"
              aria-label="Theme toggle"
            >
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Booking Button */}
            <button
              onClick={() => openBookingModal()}
              className="px-3.5 py-1.5 rounded-full border border-white/40 bg-white/15 text-white text-xs font-medium"
            >
              {bookingBtnText}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white transition-colors"
              aria-label="Menyuni ochish"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d1e16]/98 dark:bg-[#07110c]/98 backdrop-blur-2xl flex flex-col justify-between pt-20 pb-8 px-6 text-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 70 60" fill="none" className="w-8 h-7 text-white">
                  <path d="M35 2 L26 14 H31 L22 24 H28 L17 36 H24 L11 50 H59 L46 36 H53 L42 24 H48 L39 14 H44 Z" fill="white" />
                  <rect x="33" y="50" width="4" height="6" fill="white" rx="0.5" />
                </svg>
                <div>
                  <span className="block font-serif text-lg font-bold tracking-wider text-white">
                    ZILVA RESORT & SPA
                  </span>
                  <span className="text-[11px] text-white/70">Chimgan, Bo'stonliq • 24/7</span>
                </div>
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base font-medium py-2.5 px-4 rounded-2xl flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-white/20 text-white font-bold shadow-md'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Language Selector */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/80 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#d8aa62]" />
                <span>Tilni tanlash:</span>
              </span>
              <div className="flex items-center gap-1">
                {(['UZ', 'RU', 'EN'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      currentLang === lang ? 'bg-white/25 text-white' : 'text-white/60'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
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
              className="w-full py-4 rounded-2xl border border-white/40 bg-white/15 backdrop-blur-md text-white font-bold text-center uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{bookingBtnText}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain, Phone, Mail, MapPin, Send, Clock, ShieldCheck } from 'lucide-react';
import { siteSettings } from '@/data/site-settings';
import { useLanguage } from '@/context/LanguageContext';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const { t, lang } = useLanguage();

  const footerLinks = [
    { href: '/', label: t.nav.home },
    { href: '/rooms', label: t.nav.rooms },
    { href: '/restaurant', label: t.nav.restaurant },
    { href: '/spa', label: t.nav.spa },
    { href: '/activities', label: t.nav.activities },
    { href: '/contact', label: t.nav.contact }
  ];

  return (
    <footer className="bg-[#12241b] dark:bg-[#060e0a] text-white border-t border-white/10 pt-16 pb-10">
      <div className="resort-container">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#b88a44] flex items-center justify-center bg-[#1b382b]">
                <Mountain className="w-5 h-5 text-[#d8aa62]" />
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-wider text-white">
                  ZILVA
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#d8aa62] uppercase">
                  Resort & Spa
                </span>
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#b88a44] flex items-center justify-center transition-colors text-white"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#b88a44] flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#b88a44] flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#d8aa62] tracking-wide">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs text-white/75">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#d8aa62] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8aa62]/50 group-hover:bg-[#d8aa62] transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span>{t.nav.admin} Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours & Highlights */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#d8aa62] tracking-wide">
              {t.footer.workingHours}
            </h3>
            <ul className="space-y-3 text-xs text-white/75">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d8aa62] shrink-0 mt-0.5" />
                <div>
                  <span>{t.footer.reception}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d8aa62] shrink-0 mt-0.5" />
                <div>
                  <span>{t.footer.restaurant}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d8aa62] shrink-0 mt-0.5" />
                <div>
                  <span>{t.footer.spa}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#d8aa62] tracking-wide">
              {t.footer.contacts}
            </h3>
            <ul className="space-y-3 text-xs text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d8aa62] shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d8aa62] shrink-0" />
                <a href={`tel:${siteSettings.phone}`} className="hover:text-white transition-colors">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d8aa62] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-colors">
                  {siteSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d8aa62]" />
            <span>© {new Date().getFullYear()} Zilva Resort & Spa. {t.footer.rights}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

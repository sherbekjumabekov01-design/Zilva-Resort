'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles, MapPin, Shield } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { siteSettings } from '@/data/site-settings';

export default function HeroSection() {
  const { openBookingModal } = useBooking();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-28 text-white overflow-hidden">
      {/* Background Image with Cinematic Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-[#12241b]/60 to-[#12241b]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#12241b]/30 to-[#12241b]/80" />

      {/* Hero Content */}
      <div className="resort-container relative z-10 text-center max-w-4xl mx-auto space-y-6">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d8aa62] text-xs font-semibold uppercase tracking-[0.2em] shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chimgan Tog'lari Bag'ridagi Dam Olish Maskani</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
          Tabiat Nafasi va <br />
          <span className="gold-gradient-text font-serif italic">Nafis Hashamat</span> Uyg'unligi
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          Chorvoq va Chimgan bag'ridagi purviqor archazorlar qo'ynida sokinlik, shinam yog'och kottejlar,
          panoramik restoran va isitiladigan SPA hovuzidan bahramand bo'ling.
        </p>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white font-semibold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Xonani Bron Qilish</span>
          </button>

          <Link
            href="/rooms"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Xonalar Kataloogi</span>
            <ArrowRight className="w-4 h-4 text-[#d8aa62] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          {siteSettings.stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl glass-pill text-center hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#d8aa62] drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-[11px] text-white/90 font-light mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

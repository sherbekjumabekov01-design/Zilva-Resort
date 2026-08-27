'use client';

import React, { useState } from 'react';
import { Film, Gamepad2, Compass, Flame, Users, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { activitiesData } from '@/data/activities';
import { siteSettings } from '@/data/site-settings';
import { useBooking } from '@/context/BookingContext';

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { openBookingModal } = useBooking();

  const categories = [
    { id: 'all', label: 'Barcha faoliyatlar' },
    { id: 'indoor', label: 'Bino ichidagi (Kino, PS5, Bilyard)' },
    { id: 'outdoor', label: 'Ochiq havodagi (Tog\' sayri, Kvadrotsikl)' },
    { id: 'relax', label: 'Oqshom hordiqlari (Gulxan)' },
    { id: 'kids', label: 'Bolalar uchun' }
  ];

  const filtered = activeCategory === 'all'
    ? activitiesData
    : activitiesData.filter(a => a.category === activeCategory);

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Hero Banner */}
      <div className="relative min-h-[440px] bg-[#12241b] text-white flex items-center justify-center py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-[#12241b]/70 to-transparent" />

        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ko'ngilochar & Sarguzashtlar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
            Faoliyatlar & Dam Olish
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            Zilva Resortda har bir faslda vaqtni mazmunli o'tkazish uchun shaxsiy kinozaldan tortib
            tog' sayohatlari va oqshom gulxanigacha barcha imkoniyatlar yaratilgan.
          </p>
        </div>
      </div>

      <div className="resort-container py-16 space-y-12">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1b382b] text-white shadow-md'
                  : 'bg-white text-[#5e6962] border border-[#dfd8cb] hover:bg-[#dfd8cb] hover:text-[#18221b]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group glass-card glass-card-interactive rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-64 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                    item.isFree
                      ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/30'
                      : 'bg-[#1b382b]/90 text-[#d8aa62] border border-white/20'
                  }`}>
                    {item.isFree ? "✓ Bepul xizmat" : item.priceNote || "Pullik xizmat"}
                  </span>
                </div>

                <div className="px-6 space-y-2">
                  <h3 className="font-serif font-bold text-xl text-[#18221b] group-hover:text-[#1b382b] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5e6962] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 mt-4 border-t border-[#dfd8cb] space-y-3">
                <div className="space-y-1.5">
                  {item.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-2 text-xs text-[#18221b]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#b88a44] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#dfd8cb]/60 flex items-center justify-between text-xs text-[#5e6962]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>{item.timeSlot}</span>
                  </div>
                  <span className="font-medium text-[#18221b]">{item.suitableFor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-[#12241b] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Tog' Qo'ynida Unutilmas Dam Oling
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl font-light">
              Barcha qulayliklar, shinam kottejlar va faoliyatlar bir joyda mujassam.
            </p>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white font-semibold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Xonani Bron Qilish
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Room } from '@/types';
import RoomCard from '@/components/rooms/RoomCard';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturedRooms({ rooms }: { rooms: Room[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t, lang } = useLanguage();

  const categories = [
    { id: 'all', label: lang === 'RU' ? 'Все номера' : lang === 'EN' ? 'All Rooms' : 'Barcha xonalar' },
    { id: 'Deluxe', label: 'Deluxe' },
    { id: 'Suite', label: 'Suite & Jacuzzi' },
    { id: 'Chalet', label: 'Chalet & Villa' },
    { id: 'Family', label: lang === 'RU' ? 'Семейные коттеджи' : lang === 'EN' ? 'Family Cottages' : 'Oilaviy kottejlar' }
  ];

  const filtered = activeCategory === 'all'
    ? rooms
    : rooms.filter(r => r.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-24 bg-white dark:bg-[#07110c] relative">
      <div className="resort-container space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 dark:bg-white/10 text-[#1b382b] dark:text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>{t.featuredRooms.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] dark:text-white tracking-tight">
              {t.featuredRooms.heading}
            </h2>
          </div>

          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-btn text-[#1b382b] dark:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start md:self-auto group"
          >
            <span>{t.featuredRooms.viewAll}</span>
            <ArrowRight className="w-4 h-4 text-[#d8aa62] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'glass-btn-forest font-bold scale-105'
                  : 'glass-pill text-[#5e6962] dark:text-white/80 hover:text-[#18221b] dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, 6).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}

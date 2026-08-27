'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Room } from '@/types';
import RoomCard from '@/components/rooms/RoomCard';

export default function FeaturedRooms({ rooms }: { rooms: Room[] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Barcha xonalar' },
    { id: 'Deluxe', label: 'Deluxe' },
    { id: 'Suite', label: 'Suite & Jacuzzi' },
    { id: 'Chalet', label: 'Chalet & Villa' },
    { id: 'Family', label: 'Oilaviy kottejlar' }
  ];

  const filtered = activeCategory === 'all'
    ? rooms
    : rooms.filter(r => r.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-24 bg-white relative">
      <div className="resort-container space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>Turar Joy Variantlari</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] tracking-tight">
              Siz Uchun Maxsus <br />
              <span className="italic font-serif text-[#1b382b]">Shinam Kottej va Xonalar</span>
            </h2>
            <p className="text-sm text-[#5e6962] font-light leading-relaxed">
              Har bir xona tabiiy yog'och mebellar, panoramik derazalar va barcha zaruriy premium qulayliklar bilan jihozlangan.
            </p>
          </div>

          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1b382b] text-[#1b382b] hover:bg-[#1b382b] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start md:self-auto group"
          >
            <span>Barcha Xonalarni Ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1b382b] text-white shadow-md'
                  : 'bg-[#f8f5ee] text-[#5e6962] hover:bg-[#dfd8cb] hover:text-[#18221b]'
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

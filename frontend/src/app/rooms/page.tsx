'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, SlidersHorizontal, Search, Filter, RefreshCw } from 'lucide-react';
import { Room } from '@/types';
import RoomCard from '@/components/rooms/RoomCard';
import { fallbackRooms } from '@/data/rooms';
import { fetchRooms } from '@/lib/api';

function RoomsContent() {
  const searchParams = useSearchParams();
  const initialGuests = searchParams.get('guests') ? Number(searchParams.get('guests')) : 0;
  const initialCategory = searchParams.get('category') || 'all';

  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [minGuests, setMinGuests] = useState<number>(initialGuests);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchRooms();
      setRooms(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'Barcha turlar' },
    { id: 'Standard', label: 'Standard' },
    { id: 'Deluxe', label: 'Deluxe' },
    { id: 'Suite', label: 'Suite & Jacuzzi' },
    { id: 'Chalet', label: 'Chalet Villa' },
    { id: 'Family', label: 'Family Kottej' }
  ];

  // Filtering & Sorting Logic
  const filteredRooms = rooms
    .filter((room) => {
      if (selectedCategory !== 'all' && room.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (minGuests > 0 && room.maxGuests < minGuests) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesDesc = room.shortDescription.toLowerCase().includes(q);
        const matchesAmenity = room.amenities.some(a => a.name.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesAmenity) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'area') return b.area - a.area;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Page Header Banner */}
      <div className="bg-[#12241b] text-white py-16 mb-12 border-b border-white/10 relative overflow-hidden">
        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kottejlar & Xonalar To'plami</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Xonalar va Kottejlar Kataloogi
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Chimgan tog'lari va archazor o'rmoniga qaragan shinam xonalar, shaxsiy kaminli shaletlar hamda jakuzili lyuks suitlar.
          </p>
        </div>
      </div>

      <div className="resort-container space-y-8">
        {/* Filters and Search Bar */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/60 dark:border-white/10 shadow-xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#5e6962]" />
              <input
                type="text"
                placeholder="Xona nomi, qulaylik (masalan: jakuzi, kamin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dfd8cb] bg-[#f8f5ee]/40 text-xs sm:text-sm text-[#18221b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
              />
            </div>

            {/* Guests Filter */}
            <div>
              <select
                value={minGuests}
                onChange={(e) => setMinGuests(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] bg-[#f8f5ee]/40 text-xs sm:text-sm text-[#18221b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
              >
                <option value={0}>Barcha mehmonlar soni</option>
                <option value={2}>Kamida 2 kishilik</option>
                <option value={4}>Kamida 4 kishilik</option>
                <option value={6}>Kamida 6 kishilik</option>
                <option value={8}>8+ kishilik</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] bg-[#f8f5ee]/40 text-xs sm:text-sm text-[#18221b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
              >
                <option value="featured">Tavsiya etilganlar</option>
                <option value="price-asc">Narxi: Arzondan qimmatga</option>
                <option value="price-desc">Narxi: Qimmatdan arzonga</option>
                <option value="area">Kattaligi: Keng maydonlar</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#dfd8cb]/60 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1b382b] text-white shadow-sm'
                    : 'bg-[#f8f5ee] text-[#5e6962] hover:bg-[#dfd8cb] hover:text-[#18221b]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#5e6962]">
          <span>{filteredRooms.length} ta xona topildi</span>
          {(selectedCategory !== 'all' || minGuests > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMinGuests(0);
                setSearchQuery('');
              }}
              className="text-[#b88a44] hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Filtrni tozalash</span>
            </button>
          )}
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#dfd8cb] text-center space-y-4 max-w-md mx-auto">
            <h3 className="font-serif text-xl font-bold text-[#18221b]">
              Hech qanday xona topilmadi
            </h3>
            <p className="text-xs text-[#5e6962]">
              Qidiruv parametrlarini o'zgartirib yoki filtrni tozalab qayta urinib ko'ring.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMinGuests(0);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#1b382b] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Barcha xonalarni ko'rsatish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f5ee] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#1b382b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#5e6962]">Xonalar yuklanmoqda...</p>
        </div>
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}

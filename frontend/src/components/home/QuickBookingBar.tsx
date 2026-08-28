'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Home, Search } from 'lucide-react';
import { fallbackRooms } from '@/data/rooms';
import { useBooking } from '@/context/BookingContext';
import { useLanguage } from '@/context/LanguageContext';

export default function QuickBookingBar() {
  const router = useRouter();
  const { openBookingModal } = useBooking();
  const { t, lang } = useLanguage();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);

  const toISODate = (d: Date) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(toISODate(tomorrow));
  const [checkOut, setCheckOut] = useState(toISODate(afterTomorrow));
  const [guests, setGuests] = useState('2');
  const [roomSlug, setRoomSlug] = useState('all');

  const handleCheckInChange = (newDate: string) => {
    setCheckIn(newDate);
    if (checkOut && new Date(checkOut) <= new Date(newDate)) {
      const next = new Date(newDate);
      next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().split('T')[0]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomSlug && roomSlug !== 'all') {
      const room = fallbackRooms.find(r => r.slug === roomSlug);
      openBookingModal(room?.id, { checkIn, checkOut });
    } else {
      router.push(`/rooms?guests=${guests}`);
    }
  };

  const guestSuffix = lang === 'RU' ? 'гостя' : lang === 'EN' ? 'guests' : 'mehmon';

  return (
    <div className="relative -mt-16 z-20 resort-container">
      <div className="glass-card rounded-3xl shadow-2xl p-5 sm:p-7 border border-white/60 dark:border-white/10 backdrop-blur-2xl">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">

          {/* Check-In */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5e6962] dark:text-emerald-300/80 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>{t.quickBooking.checkIn}</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#dfd8cb] dark:border-white/15 bg-[#f8f5ee]/50 dark:bg-black/30 text-xs sm:text-sm font-medium text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
            />
          </div>

          {/* Check-Out */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5e6962] dark:text-emerald-300/80 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>{t.quickBooking.checkOut}</span>
            </label>
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#dfd8cb] dark:border-white/15 bg-[#f8f5ee]/50 dark:bg-black/30 text-xs sm:text-sm font-medium text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
            />
          </div>

          {/* Guests */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5e6962] dark:text-emerald-300/80 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>{t.quickBooking.adults}</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#dfd8cb] dark:border-white/15 bg-[#f8f5ee]/50 dark:bg-black/30 text-xs sm:text-sm font-medium text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
            >
              <option value="1">1 {guestSuffix}</option>
              <option value="2">2 {guestSuffix}</option>
              <option value="3">3 {guestSuffix}</option>
              <option value="4">4 {guestSuffix}</option>
              <option value="6">6+ {guestSuffix}</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5e6962] dark:text-emerald-300/80 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>{t.quickBooking.roomType}</span>
            </label>
            <select
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#dfd8cb] dark:border-white/15 bg-[#f8f5ee]/50 dark:bg-black/30 text-xs sm:text-sm font-medium text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
            >
              <option value="all">{t.quickBooking.allRooms}</option>
              {fallbackRooms.map((r) => (
                <option key={r.slug} value={r.slug}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="pt-2 sm:pt-4 lg:pt-5">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4 text-[#d8aa62]" />
              <span>{t.quickBooking.searchBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

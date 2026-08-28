'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Maximize, Mountain, Eye, Calendar, Sparkles, Bed, Flame, Bath } from 'lucide-react';
import { Room } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useBooking } from '@/context/BookingContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RoomCard({ room }: { room: Room }) {
  const { openBookingModal } = useBooking();
  const { t, lang } = useLanguage();

  const hasJacuzzi = room.amenities.some(a => a.icon === 'Bath');
  const hasFireplace = room.amenities.some(a => a.icon === 'Flame');

  const guestsLabel = lang === 'RU'
    ? `до ${room.maxGuests} гостей`
    : lang === 'EN'
    ? `Up to ${room.maxGuests} guests`
    : `${room.maxGuests} mehmongacha`;

  const perNightLabel = lang === 'RU' ? ' / ночь' : lang === 'EN' ? ' / night' : ' / kecha';
  const startPriceLabel = lang === 'RU' ? 'Цена от' : lang === 'EN' ? 'Starting from' : "Boshlang'ich narx";
  const breakfastLabel = lang === 'RU' ? 'Завтрак включен' : lang === 'EN' ? 'Breakfast included' : 'Nonushta kiritilgan';

  return (
    <div className="group glass-card glass-card-interactive rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col bg-white dark:bg-[#0e2118]/80 border border-[#dfd8cb]/80 dark:border-white/10">
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${room.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3.5 py-1 rounded-full bg-[#1b382b]/90 backdrop-blur-md border border-white/20 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            {room.category}
          </span>
          {room.isFeatured && (
            <span className="px-3 py-1 rounded-full bg-[#b88a44] text-white text-[11px] font-semibold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'RU' ? 'Популярный' : lang === 'EN' ? 'Popular' : 'Mashhur'}</span>
            </span>
          )}
        </div>

        {/* Highlights overlay at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Maximize className="w-3.5 h-3.5 text-[#d8aa62]" />
            <span>{room.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-[#d8aa62]" />
            <span>{guestsLabel}</span>
          </div>
          {hasJacuzzi && (
            <div className="flex items-center gap-1 bg-[#b88a44]/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Bath className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'RU' ? 'Джакузи' : lang === 'EN' ? 'Jacuzzi' : 'Jakuzi'}</span>
            </div>
          )}
          {hasFireplace && (
            <div className="flex items-center gap-1 bg-[#b88a44]/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'RU' ? 'Камин' : lang === 'EN' ? 'Fireplace' : 'Kamin'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#5e6962] dark:text-emerald-300/80">
            <Mountain className="w-3.5 h-3.5 text-[#b88a44]" />
            <span>{room.viewType}</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18221b] dark:text-white group-hover:text-[#1b382b] dark:group-hover:text-[#d8aa62] transition-colors line-clamp-1">
            <Link href={`/rooms/${room.slug}`}>
              {room.name}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/70 line-clamp-2 leading-relaxed font-light">
            {room.shortDescription}
          </p>
        </div>

        {/* Specs & Amenities Pills */}
        <div className="pt-3 border-t border-[#dfd8cb]/60 dark:border-white/10 flex flex-wrap gap-1.5">
          <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#f0ebe1] dark:bg-white/10 text-[#18221b] dark:text-white flex items-center gap-1 font-medium">
            <Bed className="w-3 h-3 text-[#b88a44]" />
            <span>{room.bedType}</span>
          </span>
          {room.breakfastIncluded && (
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              {breakfastLabel}
            </span>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-4 border-t border-[#dfd8cb] dark:border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] text-[#5e6962] dark:text-white/60 uppercase tracking-wider">{startPriceLabel}</span>
            <div className="text-lg sm:text-xl font-serif font-bold text-[#1b382b] dark:text-[#d8aa62]">
              {formatCurrency(room.pricePerNight)}
              <span className="text-xs font-sans font-normal text-[#5e6962] dark:text-white/60">{perNightLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/rooms/${room.slug}`}
              className="p-2.5 rounded-xl bg-[#f0ebe1] dark:bg-white/10 hover:bg-[#dfd8cb] text-[#18221b] dark:text-white transition-colors"
              title={t.featuredRooms.details}
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openBookingModal(room.id)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.featuredRooms.book}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

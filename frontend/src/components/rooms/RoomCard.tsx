'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Maximize, Mountain, Eye, Calendar, Sparkles, Bed, Flame, Bath, ChevronLeft, ChevronRight } from 'lucide-react';
import { Room } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useBooking } from '@/context/BookingContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RoomCard({ room }: { room: Room }) {
  const { openBookingModal } = useBooking();
  const { t, lang } = useLanguage();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const cardImages = room.images && room.images.length > 0
    ? room.images.map(img => img.imageUrl)
    : [room.coverImage];

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
    <div className="group glass-card glass-card-interactive rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col border border-white/40 dark:border-white/15">
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900 group/image">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${cardImages[activeImgIndex] || room.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

        {/* Previous / Next buttons for Card Gallery */}
        {cardImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIndex((prev) => (prev === 0 ? cardImages.length - 1 : prev - 1));
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#d8aa62] text-white hover:text-black backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg z-20 cursor-pointer active:scale-90"
              title="Oldingi rasm"
              aria-label="Oldingi rasm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIndex((prev) => (prev === cardImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#d8aa62] text-white hover:text-black backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg z-20 cursor-pointer active:scale-90"
              title="Keyingi rasm"
              aria-label="Keyingi rasm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full glass-pill text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            {room.category}
          </span>
          {room.isFeatured && (
            <span className="px-3.5 py-1.5 rounded-full glass-btn-gold text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'RU' ? 'Популярный' : lang === 'EN' ? 'Popular' : 'Mashhur'}</span>
            </span>
          )}
        </div>

        {/* Highlights overlay at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5 text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-xl">
            <Maximize className="w-3.5 h-3.5 text-[#d8aa62]" />
            <span>{room.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-xl">
            <Users className="w-3.5 h-3.5 text-[#d8aa62]" />
            <span>{guestsLabel}</span>
          </div>
          {hasJacuzzi && (
            <div className="flex items-center gap-1 glass-btn-gold px-2.5 py-1 rounded-xl text-white text-[11px]">
              <Bath className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'RU' ? 'Джакузи' : lang === 'EN' ? 'Jacuzzi' : 'Jakuzi'}</span>
            </div>
          )}
          {hasFireplace && (
            <div className="flex items-center gap-1 glass-btn-gold px-2.5 py-1 rounded-xl text-white text-[11px]">
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
          <span className="text-[11px] px-3 py-1 rounded-xl glass-pill text-[#18221b] dark:text-white flex items-center gap-1.5 font-medium">
            <Bed className="w-3.5 h-3.5 text-[#b88a44]" />
            <span>{room.bedType}</span>
          </span>
          {room.breakfastIncluded && (
            <span className="text-[11px] px-3 py-1 rounded-xl glass-pill text-emerald-700 dark:text-emerald-300 font-medium">
              ✓ {breakfastLabel}
            </span>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-4 border-t border-[#dfd8cb]/80 dark:border-white/10 flex items-center justify-between gap-3">
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
              className="p-2.5 rounded-2xl glass-btn text-[#18221b] dark:text-white transition-colors"
              title={t.featuredRooms.details}
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openBookingModal(room.id)}
              className="px-4 py-2.5 rounded-2xl glass-btn-gold text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>{t.featuredRooms.book}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

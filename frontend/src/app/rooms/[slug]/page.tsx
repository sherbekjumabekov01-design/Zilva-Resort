'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Maximize, Bed, Bath, Mountain, Flame, Wifi, Tv, Snowflake,
  Coffee, ShieldCheck, Sun, Sparkles, Shirt, Bell, Calendar, Phone,
  CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, Share2
} from 'lucide-react';
import { Room } from '@/types';
import { fallbackRooms } from '@/data/rooms';
import { fetchRoomBySlug } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useBooking } from '@/context/BookingContext';
import { siteSettings } from '@/data/site-settings';
import RoomCard from '@/components/rooms/RoomCard';
import RoomAvailabilityCalendar from '@/components/rooms/RoomAvailabilityCalendar';

const iconMap: Record<string, any> = {
  Wifi, Tv, Snowflake, Coffee, Mountain, Flame, Bath, ShieldCheck, Sun, Sparkles, Shirt, Bell
};

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { openBookingModal } = useBooking();

  const [room, setRoom] = useState<Room | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      setIsLoading(true);
      if (slug) {
        const data = await fetchRoomBySlug(slug);
        setRoom(data);
      }
      setIsLoading(false);
    }
    loadRoom();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f8f5ee]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1b382b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5e6962] uppercase tracking-wider">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f8f5ee]">
        <div className="bg-white p-10 rounded-3xl border border-[#dfd8cb] text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-serif font-bold text-[#18221b]">Xona topilmadi</h2>
          <p className="text-xs text-[#5e6962]">
            Kechirasiz, siz qidirgan xona mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b382b] text-white text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xonalar ro'yxatiga qaytish</span>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = room.images && room.images.length > 0
    ? room.images.map(img => img.imageUrl)
    : [room.coverImage];

  const similarRooms = fallbackRooms.filter(r => r.id !== room.id).slice(0, 3);

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Top Breadcrumb */}
      <div className="resort-container py-4">
        <div className="flex items-center gap-2 text-xs text-[#5e6962]">
          <Link href="/" className="hover:text-[#1b382b]">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/rooms" className="hover:text-[#1b382b]">Xonalar</Link>
          <span>/</span>
          <span className="text-[#18221b] font-semibold">{room.name}</span>
        </div>
      </div>

      <div className="resort-container space-y-12">
        {/* Main Header & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
              <span>{room.category} Toifasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b]">
              {room.name}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5e6962]">
              <Mountain className="w-4 h-4 text-[#b88a44]" />
              <span>{room.viewType}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-xs text-[#5e6962] uppercase tracking-wider">Kunlik narx</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1b382b]">
              {formatCurrency(room.pricePerNight)}
              <span className="text-xs font-sans font-normal text-[#5e6962]"> / kecha</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-4">
          {/* Active Big Image */}
          <div className="relative h-[380px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-[#dfd8cb]">
            <img
              src={allImages[activeImageIndex] || room.coverImage}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-xs font-medium">
              {activeImageIndex + 1} / {allImages.length} fotosurat
            </div>
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === index
                      ? 'border-[#b88a44] scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room Specs Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0ebe1] dark:bg-emerald-950/40 text-[#b88a44] flex items-center justify-center shrink-0">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] text-[#5e6962]">Umumiy maydon</span>
              <span className="font-serif font-bold text-base text-[#18221b]">{room.area} m²</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0ebe1] dark:bg-emerald-950/40 text-[#b88a44] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] text-[#5e6962]">Maksimal sig'im</span>
              <span className="font-serif font-bold text-base text-[#18221b]">{room.maxGuests} mehmongacha</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0ebe1] dark:bg-emerald-950/40 text-[#b88a44] flex items-center justify-center shrink-0">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] text-[#5e6962]">Yotoq turi</span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#18221b] line-clamp-1">{room.bedType}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0ebe1] dark:bg-emerald-950/40 text-[#b88a44] flex items-center justify-center shrink-0">
              <Bath className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] text-[#5e6962]">Vanna xonasi</span>
              <span className="font-serif font-bold text-base text-[#18221b]">{room.bathrooms} ta alohida</span>
            </div>
          </div>
        </div>

        {/* Content Details & Sticky Reservation Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Calendar, Description, Amenities & Rules */}
          <div className="lg:col-span-2 space-y-10">
            {/* Live Availability Calendar */}
            <RoomAvailabilityCalendar room={room} />

            {/* Description */}
            <div className="glass-card p-8 rounded-3xl shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-[#18221b]">
                Xona Haqida Batafsil
              </h2>
              <p className="text-xs sm:text-sm text-[#5e6962] leading-relaxed font-light whitespace-pre-line">
                {room.description || room.shortDescription}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="glass-card p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#b88a44]" />
                <h2 className="text-2xl font-serif font-bold text-[#18221b]">
                  Xonadagi Qulayliklar
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.amenities.map((amenity) => {
                  const Icon = iconMap[amenity.icon] || Sparkles;
                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl glass-pill"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1b382b] text-[#d8aa62] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-[#18221b]">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules & Check-in Policies */}
            <div className="glass-card p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[#18221b]">
                Yashash Qoidalari & Vaqtlari
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl glass-pill space-y-1">
                  <span className="text-xs text-[#5e6962]">Joylashish (Check-in):</span>
                  <span className="block font-serif font-bold text-lg text-[#1b382b] dark:text-[#d8aa62]">
                    {room.checkInTime} dan boshlab
                  </span>
                </div>

                <div className="p-4 rounded-2xl glass-pill space-y-1">
                  <span className="text-xs text-[#5e6962]">Chiqish (Check-out):</span>
                  <span className="block font-serif font-bold text-lg text-[#1b382b] dark:text-[#d8aa62]">
                    {room.checkOutTime} gacha
                  </span>
                </div>
              </div>

              {room.rules && room.rules.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#5e6962]">
                    Muhim qoidalar:
                  </h4>
                  <ul className="space-y-2">
                    {room.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#5e6962]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="sticky top-28 glass-card p-8 rounded-3xl shadow-2xl space-y-6 border border-white/60 dark:border-white/10">
            <div className="space-y-1 pb-4 border-b border-[#dfd8cb]">
              <span className="text-[11px] text-[#5e6962] uppercase tracking-wider">Narx</span>
              <div className="text-3xl font-serif font-bold text-[#1b382b] dark:text-[#d8aa62]">
                {formatCurrency(room.pricePerNight)}
                <span className="text-xs font-sans font-normal text-[#5e6962]"> / kecha</span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-2 text-xs text-[#5e6962]">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Shohona nonushta (Shved stoli) kiritilgan</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>SPA, isitiladigan hovuz va sauna bepul</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Tezkor Wi-Fi va mashinalar turargohi</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => openBookingModal(room.id)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white font-semibold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Xonani Bron Qilish</span>
              </button>

              <a
                href={siteSettings.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-[#f0ebe1] hover:bg-[#dfd8cb] text-[#18221b] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Booking.com orqali ochish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${siteSettings.phone}`}
                className="w-full py-3 rounded-2xl border border-[#dfd8cb] hover:bg-[#f8f5ee] text-[#18221b] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#b88a44]" />
                <span>Menejer bilan bog'lanish</span>
              </a>
            </div>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              So'rov yuborilganidan so'ng 15 daqiqa ichida menejerimiz siz bilan bog'lanib, buyurtmani tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* Similar Rooms */}
        <div className="space-y-6 pt-12 border-t border-[#dfd8cb]">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#18221b]">
            O'xshash Kottej va Xonalar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarRooms.map((sRoom) => (
              <RoomCard key={sRoom.id} room={sRoom} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

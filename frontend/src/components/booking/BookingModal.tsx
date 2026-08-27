'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Sparkles, CheckCircle2, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { fallbackRooms } from '@/data/rooms';
import { submitBookingRequest } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { siteSettings } from '@/data/site-settings';

export default function BookingModal() {
  const { isOpen, selectedRoomId, initialDates, closeBookingModal } = useBooking();

  const [roomId, setRoomId] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Default dates: tomorrow and +2 days
  useEffect(() => {
    if (isOpen) {
      if (selectedRoomId) {
        setRoomId(selectedRoomId);
      }
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const afterTomorrow = new Date(tomorrow);
      afterTomorrow.setDate(afterTomorrow.getDate() + 2);

      const toISODate = (d: Date) => d.toISOString().split('T')[0];

      if (initialDates?.checkIn) {
        setCheckIn(initialDates.checkIn);
      } else {
        setCheckIn(toISODate(tomorrow));
      }

      if (initialDates?.checkOut) {
        setCheckOut(initialDates.checkOut);
      } else {
        setCheckOut(toISODate(afterTomorrow));
      }

      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, selectedRoomId, initialDates]);

  if (!isOpen) return null;

  const currentRoom = fallbackRooms.find(r => r.id === roomId) || fallbackRooms[0];

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  const estimatedTotal = (currentRoom?.pricePerNight || 0) * nights;

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    // If checkOut is <= newCheckIn, automatically push checkOut by 1 day
    if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    if (honeypot.trim()) {
      // Silently pretend success for bots
      setIsSuccess(true);
      return;
    }

    if (!fullName.trim() || !phone.trim() || phone.trim() === '+998') {
      setErrorMessage("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setErrorMessage("Ketish sanasi kelish sanasidan keyin bo'lishi kerak.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitBookingRequest({
        fullName,
        phone,
        email,
        checkIn,
        checkOut,
        adults,
        children: childrenCount,
        roomId: currentRoom.id,
        specialRequests,
      });

      if (res.success) {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage("So'rov yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki qo'ng'iroq qiling.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-white/10 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1b382b]/95 backdrop-blur-xl text-white p-6 sm:p-7 flex items-center justify-between relative border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d8aa62] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zilva Resort & Spa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Xonani Bron Qilish So'rovi
            </h2>
          </div>
          <button
            onClick={closeBookingModal}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1b382b]">
                So'rovingiz qabul qilindi!
              </h3>
              <p className="text-sm text-[#5e6962] max-w-md mx-auto leading-relaxed">
                Rahmat, <span className="font-semibold text-[#18221b]">{fullName}</span>! Xona mavjudligi tekshirilib,
                menejerimiz <span className="font-semibold text-[#18221b]">{phone}</span> raqamiga tez orada qo'ng'iroq qiladi.
              </p>

              <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#dfd8cb] max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanlangan xona:</span>
                  <span className="font-semibold text-[#1b382b]">{currentRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sanalar:</span>
                  <span className="font-medium text-[#18221b]">{checkIn} — {checkOut} ({nights} kecha)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mehmonlar soni:</span>
                  <span className="font-medium text-[#18221b]">{adults} kattalar{childrenCount > 0 ? `, ${childrenCount} bolalar` : ''}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={closeBookingModal}
                  className="px-6 py-2.5 rounded-full bg-[#1b382b] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#12281e] transition-colors"
                >
                  Yopish
                </button>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="px-6 py-2.5 rounded-full bg-[#f0ebe1] text-[#1b382b] text-xs font-semibold uppercase tracking-wider hover:bg-[#dfd8cb] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Tezkor qo'ng'iroq qilish</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notice note */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#b88a44] shrink-0 mt-0.5" />
                <span>
                  <strong>Muhim eslatma:</strong> So‘rov yuborilishi xona bron qilinganini anglatmaydi. Menejer mavjudlikni tekshirib, 15 daqiqa ichida siz bilan bog‘lanadi va buyurtmani tasdiqlaydi.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Room Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#18221b] uppercase tracking-wider">
                  Xona yoki Kottejni tanlang:
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#dfd8cb] bg-white text-sm font-medium text-[#18221b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]"
                >
                  {fallbackRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {formatCurrency(room.pricePerNight)} / kecha (sig'im: {room.maxGuests} kishi)
                    </option>
                  ))}
                </select>
              </div>

              {/* Honeypot Bot Trap (Hidden) */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Dates & Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>Kelish sanasi (Check-in)</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>Ketish sanasi (Check-out)</span>
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962]">
                    Kattalar (12+ yosh)
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>{num} nafar</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962]">
                    Bolalar (0-11 yosh)
                  </label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b]"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>{num} nafar</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-2 border-t border-[#dfd8cb]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#b88a44]" />
                      <span>F.I.SH (Ismingiz) *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Sardor Rahimov"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#b88a44]" />
                      <span>Telefon raqamingiz *</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>Email (ixtiyoriy)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="misol@pochta.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962]">
                    Qo'shimcha istaklar yoki maxsus talablar (ixtiyoriy)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Masalan: kech kelamiz, kamin uchun o'tin, bolalar uchun qo'shimcha o'rin..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl bg-[#f8f5ee] border border-[#dfd8cb] flex items-center justify-between">
                <div>
                  <span className="block text-xs text-[#5e6962]">Taxminiy narx ({nights} kecha uchun):</span>
                  <span className="text-xl font-serif font-bold text-[#1b382b]">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-[#5e6962]">
                  <span className="text-emerald-700 font-semibold block">✓ Nonushta kiritilgan</span>
                  <span className="text-emerald-700 font-semibold block">✓ SPA & Hovuz bepul</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#d8aa62]" />
                  <span>{isSubmitting ? "Yuborilmoqda..." : "Bron So'rovini Yuborish"}</span>
                </button>

                {/* External Booking Link Option */}
                <div className="text-center pt-2">
                  <a
                    href={siteSettings.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#b88a44] hover:text-[#9c7334] font-medium transition-colors"
                  >
                    <span>Yoki Booking.com orqali to'g'ridan-to'g'ri ochish</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

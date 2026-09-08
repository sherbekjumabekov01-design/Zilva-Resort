'use client';

import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, CheckCircle2, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { fallbackRooms } from '@/data/rooms';
import { submitBookingRequest } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { siteSettings } from '@/data/site-settings';
import { useLanguage } from '@/context/LanguageContext';
import PaymentCheckoutModal from '@/components/payment/PaymentCheckoutModal';

export default function BookingModal() {
  const { isOpen, selectedRoomId, initialDates, closeBookingModal } = useBooking();
  const { t, lang } = useLanguage();

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
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
  }

  if (!isOpen) return null;

  const currentRoom = fallbackRooms.find(r => r.id === roomId) || fallbackRooms[0];

  let nights = 1;
  if (checkIn && checkOut) {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  const estimatedTotal = (currentRoom?.pricePerNight || 0) * nights;

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    if (!fullName.trim() || !phone.trim() || !checkIn || !checkOut) {
      setErrorMessage(
        lang === 'RU'
          ? "Пожалуйста, заполните все обязательные поля."
          : lang === 'EN'
          ? "Please fill in all required fields."
          : "Iltimos, barcha majburiy maydonlarni to'ldiring."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await submitBookingRequest({
        fullName,
        phone,
        email: email || undefined,
        checkIn,
        checkOut,
        adults,
        children: childrenCount,
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        specialRequests: specialRequests || undefined
      });
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(
          res.message || (
            lang === 'RU'
              ? "Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую."
              : lang === 'EN'
              ? "Error submitting booking request. Please call us directly."
              : "So'rov yuborishda xatolik yuz berdi. Iltimos, biz bilan to'g'ridan-to'g'ri telefon orqali bog'laning."
          )
        );
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMessage(
        lang === 'RU'
          ? "Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую."
          : lang === 'EN'
          ? "Error submitting booking request. Please call us directly."
          : "So'rov yuborishda xatolik yuz berdi. Iltimos, biz bilan to'g'ridan-to'g'ri telefon orqali bog'laning."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/30 dark:border-white/15 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-[#1b382b]/90 backdrop-blur-xl text-white flex items-center justify-between border-b border-white/15">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>{t.modal.title}</span>
            </h2>
            <p className="text-xs text-white/80 mt-1 font-light">
              {t.modal.subtitle}
            </p>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-2 rounded-full glass-btn text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full glass-btn-gold text-[#d8aa62] mx-auto flex items-center justify-center animate-in zoom-in-90 duration-200">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1b382b] dark:text-white">
                  {t.modal.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/80 max-w-md mx-auto leading-relaxed mt-1">
                  {t.modal.successDesc}
                </p>
              </div>

              {/* Online Payment Card Promo */}
              <div className="p-5 rounded-2xl glass-card-dark text-white border border-[#d8aa62]/50 shadow-2xl max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#d8aa62] uppercase tracking-wider font-semibold">100% Kafolatlangan Band Qilish</span>
                  <span className="px-2.5 py-0.5 rounded-full glass-pill text-emerald-300 text-[10px] font-bold">0% Komissiya</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  Xonangiz boshqa mehmonga berib yuborilmasligi uchun hoziroq Click, Payme yoki Uzum orqali 20% avans to‘lab qo‘yishingiz mumkin.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 rounded-2xl glass-btn-gold text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Onlayn To‘lovni Boshlash (Click / Payme)</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={closeBookingModal}
                  className="px-6 py-2.5 rounded-full glass-btn text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {t.modal.close}
                </button>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="px-6 py-2.5 rounded-full glass-btn-forest text-[#d8aa62] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{siteSettings.phone}</span>
                </a>
              </div>

              <PaymentCheckoutModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                bookingDetails={{
                  roomName: currentRoom.name,
                  fullName,
                  phone,
                  checkIn,
                  checkOut,
                  totalAmount: estimatedTotal
                }}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notice note */}
              <div className="p-3.5 rounded-2xl glass-pill flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#b88a44] shrink-0 mt-0.5" />
                <span>
                  {lang === 'RU'
                    ? "Менеджер проверит наличие номеров и свяжется с вами в течение 10 минут для подтверждения."
                    : lang === 'EN'
                    ? "Our manager will check room availability and contact you within 10 minutes to confirm."
                    : "Menejer mavjudlikni tekshirib, 10 daqiqa ichida siz bilan bog'lanadi va buyurtmani tasdiqlaydi."}
                </span>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-700 dark:text-rose-200 font-medium flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">
                      {lang === 'RU' ? 'Ошибка бронирования' : lang === 'EN' ? 'Booking Error' : 'Bron qilishda xatolik'}
                    </span>
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Room Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#18221b] dark:text-white uppercase tracking-wider">
                  {t.modal.roomSelect}:
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-sm font-medium text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                >
                  {fallbackRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {formatCurrency(room.pricePerNight)} ({room.maxGuests} {lang === 'RU' ? 'гостей' : lang === 'EN' ? 'guests' : 'kishi'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Honeypot */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>{t.modal.checkIn} *</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>{t.modal.checkOut} *</span>
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                    required
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-2 border-t border-[#dfd8cb]/80 dark:border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#b88a44]" />
                      <span>{t.modal.fullName} *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Sardor Rahimov"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#b88a44]" />
                      <span>{t.modal.phone} *</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#b88a44]" />
                    <span>{t.modal.email}</span>
                  </label>
                  <input
                    type="email"
                    placeholder="misol@pochta.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                  />
                </div>

                {/* Adults & Children Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80">
                      {lang === 'RU' ? 'Взрослые' : lang === 'EN' ? 'Adults' : 'Kattalar'}
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {lang === 'RU' ? 'взрослых' : lang === 'EN' ? 'adults' : 'nafar'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80">
                      {lang === 'RU' ? 'Дети' : lang === 'EN' ? 'Children' : 'Bolalar'}
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {lang === 'RU' ? 'детей' : lang === 'EN' ? 'children' : 'bola'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962] dark:text-white/80">
                    {t.modal.specialRequests}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.modal.specialRequestsPlaceholder}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-sm text-[#18221b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b88a44]/50 resize-none"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl glass-pill flex items-center justify-between">
                <div>
                  <span className="block text-xs text-[#5e6962] dark:text-white/70">
                    {lang === 'RU' ? `Ориентировочная сумма (${nights} ноч.):` : lang === 'EN' ? `Estimated Total (${nights} night(s)):` : `Taxminiy narx (${nights} kecha uchun):`}
                  </span>
                  <span className="text-xl font-serif font-bold text-[#1b382b] dark:text-[#d8aa62]">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl glass-btn-forest text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#d8aa62]" />
                  <span>{isSubmitting ? t.modal.submitting : t.modal.submitBtn}</span>
                </button>

                {/* External Booking Link Option */}
                <div className="text-center pt-2">
                  <a
                    href={siteSettings.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#d8aa62] hover:text-[#b88a44] font-medium transition-colors"
                  >
                    <span>{lang === 'RU' ? 'Или открыть через Booking.com' : lang === 'EN' ? 'Or open via Booking.com' : "Yoki Booking.com orqali to'g'ridan-to'g'ri ochish"}</span>
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

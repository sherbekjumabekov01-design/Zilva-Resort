'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Room } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency } from '@/lib/utils';

interface RoomAvailabilityCalendarProps {
  room: Room;
}

export default function RoomAvailabilityCalendar({ room }: RoomAvailabilityCalendarProps) {
  const { lang } = useLanguage();
  const { openBookingModal } = useBooking();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  // Deterministic booked dates generator for realistic room availability preview
  const getBookedDays = (year: number, month: number, roomId: number) => {
    const booked = new Set<number>();
    const seed = (year * 12 + month + roomId * 7) % 31;
    // generate 2 distinct 2-3 day booked blocks in each month
    const block1Start = (seed % 10) + 4;
    const block2Start = (seed % 10) + 18;

    for (let i = 0; i < 3; i++) {
      booked.add(block1Start + i);
      booked.add(block2Start + i);
    }
    return booked;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const bookedDays = getBookedDays(year, month, room.id);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  // Convert so Monday = 0, Sunday = 6
  const startingOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = {
    UZ: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    RU: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    EN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  const dayHeaders = {
    UZ: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    RU: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    EN: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today || bookedDays.has(day)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(clickedDate);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      if (clickedDate < selectedStart) {
        setSelectedStart(clickedDate);
      } else {
        // Check if any booked day is inside range
        let hasBookedInRange = false;
        const d = new Date(selectedStart);
        while (d <= clickedDate) {
          if (d.getMonth() === month && bookedDays.has(d.getDate())) {
            hasBookedInRange = true;
            break;
          }
          d.setDate(d.getDate() + 1);
        }

        if (!hasBookedInRange) {
          setSelectedEnd(clickedDate);
        } else {
          setSelectedStart(clickedDate);
        }
      }
    }
  };

  // Calculate nights & total
  const nights = selectedStart && selectedEnd
    ? Math.max(1, Math.round((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24)))
    : selectedStart ? 1 : 0;

  const totalEstimate = nights * room.pricePerNight;

  const handleBookNow = () => {
    const checkInStr = selectedStart ? selectedStart.toISOString().split('T')[0] : undefined;
    const checkOutStr = selectedEnd ? selectedEnd.toISOString().split('T')[0] : undefined;
    openBookingModal(
      room.id,
      checkInStr && checkOutStr ? { checkIn: checkInStr, checkOut: checkOutStr } : undefined
    );
  };

  return (
    <div className="bg-[#12241b] text-white p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d8aa62] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{lang === 'RU' ? 'Календарь занятости' : lang === 'EN' ? 'Room Availability' : 'Bandlik Taqsimoti'}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            {monthNames[lang][month]} {year}
          </h3>
        </div>

        {/* Month Navigation & Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Oldingi oy"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Keyingi oy"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/70">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span>{lang === 'RU' ? 'Свободно' : lang === 'EN' ? 'Available' : "Bo'sh kunlar"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span>{lang === 'RU' ? 'Занято' : lang === 'EN' ? 'Booked' : 'Band kunlar'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#d8aa62]" />
          <span>{lang === 'RU' ? 'Выбрано' : lang === 'EN' ? 'Selected' : 'Tanlangan sana'}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-white/50 uppercase tracking-wider py-1">
          {dayHeaders[lang].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs sm:text-sm">
          {/* Empty offset days */}
          {Array.from({ length: startingOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-11 rounded-xl opacity-0" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDate = new Date(year, month, dayNum);
            thisDate.setHours(0, 0, 0, 0);

            const isPast = thisDate < today;
            const isBooked = bookedDays.has(dayNum);
            const isSelectedStart = selectedStart && thisDate.getTime() === selectedStart.getTime();
            const isSelectedEnd = selectedEnd && thisDate.getTime() === selectedEnd.getTime();
            const isInRange = selectedStart && selectedEnd && thisDate > selectedStart && thisDate < selectedEnd;

            let dayStyle = "bg-white/5 hover:bg-emerald-600/30 text-white border border-white/10 hover:border-emerald-400/50 cursor-pointer";

            if (isPast) {
              dayStyle = "bg-white/5 text-white/20 border-transparent cursor-not-allowed";
            } else if (isBooked) {
              dayStyle = "bg-rose-950/40 text-rose-300/40 border-rose-900/30 cursor-not-allowed line-through";
            } else if (isSelectedStart || isSelectedEnd) {
              dayStyle = "bg-gradient-to-br from-[#b88a44] to-[#d8aa62] text-black font-bold border-white shadow-lg scale-105 z-10";
            } else if (isInRange) {
              dayStyle = "bg-[#b88a44]/30 text-[#d8aa62] border-[#d8aa62]/40";
            }

            return (
              <button
                key={dayNum}
                disabled={isPast || isBooked}
                onClick={() => handleDateClick(dayNum)}
                className={`h-10 sm:h-11 rounded-xl flex items-center justify-center transition-all ${dayStyle}`}
              >
                <span>{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Range Summary & Price Calculator */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs text-white/70">
            {selectedStart ? (
              <span>
                {selectedStart.toLocaleDateString(lang === 'RU' ? 'ru-RU' : lang === 'EN' ? 'en-US' : 'uz-UZ')}
                {selectedEnd ? ` — ${selectedEnd.toLocaleDateString(lang === 'RU' ? 'ru-RU' : lang === 'EN' ? 'en-US' : 'uz-UZ')} (${nights} ${lang === 'RU' ? 'ночей' : lang === 'EN' ? 'nights' : 'kecha'})` : ''}
              </span>
            ) : (
              <span>{lang === 'RU' ? 'Выберите дату заезда и выезда' : lang === 'EN' ? 'Select check-in and check-out dates' : "Kirish va chiqish sanalarini belgilang"}</span>
            )}
          </div>

          {selectedStart && (
            <div className="text-lg sm:text-xl font-serif font-bold text-[#d8aa62]">
              {formatCurrency(totalEstimate)} <span className="text-xs font-sans text-white/60 font-normal">/ {nights} {lang === 'RU' ? 'ночей' : lang === 'EN' ? 'nights' : 'kecha'}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleBookNow}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'RU' ? 'Забронировать выбранные даты' : lang === 'EN' ? 'Book Selected Dates' : 'Tanlangan sanani bron qilish'}</span>
        </button>
      </div>
    </div>
  );
}

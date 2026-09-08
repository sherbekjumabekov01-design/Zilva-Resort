'use client';

import React from 'react';
import { Download, Phone } from 'lucide-react';
import { BookingRequestRecord } from '@/types';

type BookingFilterType = 'all' | 'New' | 'Contacted' | 'Confirmed' | 'DepositPaid' | 'Cancelled';

interface AdminBookingsTabProps {
  bookings: BookingRequestRecord[];
  bookingFilter: BookingFilterType;
  setBookingFilter: (filter: BookingFilterType) => void;
  onStatusChange: (id: number, status: string) => Promise<void>;
  onExportCSV: () => void;
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  bookings,
  bookingFilter,
  setBookingFilter,
  onStatusChange,
  onExportCSV
}) => {
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Bron So‘rovlari Ro‘yxati</h2>
          <p className="text-xs text-white/60 mt-0.5">Xona bandlik holatlari va mehmonlar bilan bog‘lanish</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Eksport</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'New', 'DepositPaid', 'Confirmed', 'Cancelled'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setBookingFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              bookingFilter === filter
                ? 'bg-[#d8aa62] text-black font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {filter === 'all' ? 'Barchasi' : filter}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-white/80">
          <thead className="bg-white/5 uppercase text-[10px] text-white/50 tracking-wider">
            <tr>
              <th className="p-3.5 rounded-l-xl">№</th>
              <th className="p-3.5">Mehmon</th>
              <th className="p-3.5">Telefon / Email</th>
              <th className="p-3.5">Xona</th>
              <th className="p-3.5">Sanalari</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 rounded-r-xl">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-mono text-white/50">#{b.id}</td>
                <td className="p-3.5 font-bold text-white">{b.fullName}</td>
                <td className="p-3.5">
                  <span className="block text-white font-mono">{b.phone}</span>
                  {b.email && <span className="text-white/50 text-[11px] block">{b.email}</span>}
                </td>
                <td className="p-3.5 text-[#d8aa62] font-semibold">{b.roomName}</td>
                <td className="p-3.5 text-white/70">{b.checkIn} — {b.checkOut}</td>
                <td className="p-3.5">
                  <select
                    value={b.status}
                    onChange={(e) => onStatusChange(b.id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none"
                  >
                    <option value="New">New (Yangi)</option>
                    <option value="DepositPaid">DepositPaid (To‘langan)</option>
                    <option value="Confirmed">Confirmed (Tasdiqlangan)</option>
                    <option value="Completed">Completed (Yakunlangan)</option>
                    <option value="Cancelled">Cancelled (Bekor)</option>
                  </select>
                </td>
                <td className="p-3.5">
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Qo‘ng‘iroq</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import {
  DollarSign, TrendingUp, Percent, Calendar, Users,
  ArrowUpRight, Phone, Activity
} from 'lucide-react';
import { BookingRequestRecord } from '@/types';
import { SystemStatsRecord, AuditLogRecord, AdminUserRecord } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface AdminDashboardTabProps {
  stats: SystemStatsRecord | null;
  bookings: BookingRequestRecord[];
  auditLogs: AuditLogRecord[];
  adminUsers: AdminUserRecord[];
  onNavigateTab: (tab: 'bookings' | 'audit') => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  bookings,
  auditLogs,
  adminUsers,
  onNavigateTab
}) => {
  return (
    <div className="space-y-8">
      {/* Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="p-6 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Umumiy Daromad</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {formatCurrency(stats?.totalRevenue || 5400000)}
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tasdiqlangan va to‘langan bronlar</span>
            </span>
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="p-6 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Bandlik Ko‘rsatkichi</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-amber-300">
              {stats?.occupancyRate || 67.5}%
            </h3>
            <span className="text-[11px] text-white/60">
              O‘rtacha chek: {formatCurrency(stats?.averageDailyRate || 2400000)}
            </span>
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="p-6 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Bron So‘rovlari</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {stats?.totalBookings || bookings.length} ta
            </h3>
            <span className="text-[11px] text-amber-300">
              {stats?.pendingBookings || 1} ta yangi ko‘rib chiqilmagan
            </span>
          </div>
        </div>

        {/* Card 4: Active Administrators */}
        <div className="p-6 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Faol Xodimlar (RBAC)</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-3xl font-bold text-white">
              {adminUsers.filter(u => u.isActive).length} nafar
            </h3>
            <span className="text-[11px] text-white/60">
              SuperAdmin, Menejer, Qabulxona
            </span>
          </div>
        </div>
      </div>

      {/* Quick Status Breakdown & Recent Audit Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Bookings */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0f2319] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d8aa62]" />
              <h3 className="font-serif text-lg font-bold text-white">So‘nggi Bron So‘rovlari</h3>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-[#d8aa62] hover:text-white font-semibold flex items-center gap-1"
            >
              <span>Barchasini ko‘rish</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{b.fullName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Confirmed' || b.status === 'DepositPaid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : b.status === 'Cancelled'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <span className="text-xs text-white/60 block mt-0.5">
                    {b.roomName} • {b.checkIn} — {b.checkOut}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${b.phone}`} className="p-2 rounded-xl bg-white/10 text-white hover:bg-[#d8aa62] hover:text-black transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Audit Activity */}
        <div className="p-6 rounded-3xl bg-[#0f2319] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-serif text-lg font-bold text-white">Jonli Audit Log</h3>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-[#d8aa62] hover:text-white font-semibold flex items-center gap-1"
            >
              <span>Loglar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between text-white/50 text-[10px]">
                  <span className="font-bold text-[#d8aa62]">{log.userName}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="font-mono text-emerald-400 text-[11px] block">{log.action}</span>
                <p className="text-white/70 text-[11px] line-clamp-2">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

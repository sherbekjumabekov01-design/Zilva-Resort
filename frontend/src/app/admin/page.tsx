'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, Calendar, MessageSquare, Home, Users, CheckCircle2,
  Clock, XCircle, Phone, Mail, AlertCircle, RefreshCw, ExternalLink,
  Download, LogOut, Send, Check, ToggleLeft, ToggleRight, Edit3,
  UserPlus, UserCheck, Trash2, Eye, EyeOff, KeyRound, Lock,
  Activity, BarChart3, DollarSign, Percent, FileText, ArrowUpRight,
  TrendingUp, ShieldAlert, Sparkles, Filter, Search
} from 'lucide-react';
import { BookingRequestRecord, ContactRequestRecord, Room } from '@/types';
import {
  fetchAdminBookings, fetchAdminContacts, updateAdminBookingStatus,
  fetchRooms, isAdminAuthenticated, logoutAdmin, exportBookingsToCSV,
  toggleRoomAvailability, updateRoomPrice,
  AdminUserRecord, fetchAdminUsers, createAdminUser, toggleAdminUserStatus, deleteAdminUser,
  fetchAdminStats, fetchAdminAuditLogs, AuditLogRecord, SystemStatsRecord, updateAdminUser
} from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fallbackRooms } from '@/data/rooms';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'rooms' | 'admins' | 'audit' | 'contacts'>('dashboard');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'New' | 'Contacted' | 'Confirmed' | 'DepositPaid' | 'Cancelled'>('all');
  const [auditFilter, setAuditFilter] = useState<string>('');
  
  const [stats, setStats] = useState<SystemStatsRecord | null>(null);
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRequestRecord[]>([]);
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // New Admin Form State
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('7788');
  const [newAdminRole, setNewAdminRole] = useState('Manager');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [showNewAdminPin, setShowNewAdminPin] = useState(false);
  const [adminActionMessage, setAdminActionMessage] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    } else {
      setIsAuthChecked(true);
      loadData();
    }
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    const [sData, bData, cData, rData, uData, aData] = await Promise.all([
      fetchAdminStats(),
      fetchAdminBookings(),
      fetchAdminContacts(),
      fetchRooms(),
      fetchAdminUsers(),
      fetchAdminAuditLogs()
    ]);
    setStats(sData);
    setBookings(bData);
    setContacts(cData);
    setRooms(rData);
    setAdminUsers(uData);
    setAuditLogs(aData);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionMessage(null);
    setAdminActionError(null);
    setIsSubmittingAdmin(true);

    const res = await createAdminUser({
      username: newAdminUsername,
      fullName: newAdminFullName,
      password: newAdminPassword,
      pinCode: newAdminPin,
      role: newAdminRole
    });

    setIsSubmittingAdmin(false);

    if (res.success) {
      setAdminActionMessage(res.message);
      setNewAdminFullName('');
      setNewAdminUsername('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminPin('7788');
      setNewAdminRole('Manager');
      setTimeout(() => {
        setIsAddAdminModalOpen(false);
        setAdminActionMessage(null);
        loadData();
      }, 1200);
    } else {
      setAdminActionError(res.message);
    }
  };

  const handleToggleAdminStatus = async (id: number) => {
    await toggleAdminUserStatus(id);
    loadData();
  };

  const handleDeleteAdmin = async (id: number, username: string) => {
    if (confirm(`Rostdan ham "${username}" administratorini o'chirmoqchimisiz?`)) {
      const res = await deleteAdminUser(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await updateAdminBookingStatus(id, status);
    loadData();
  };

  const handleToggleRoom = async (id: number) => {
    await toggleRoomAvailability(id);
    loadData();
  };

  const handleSavePrice = async (id: number) => {
    const priceNum = parseFloat(tempPrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      await updateRoomPrice(id, priceNum);
      setEditingPriceId(null);
      loadData();
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditFilter) return true;
    const q = auditFilter.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entityName.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#07110c]">
        <div className="w-10 h-10 border-4 border-[#d8aa62] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07110c] text-white pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Quick Profile Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0f2319] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b88a44] to-[#d8aa62] flex items-center justify-center text-black font-bold shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-white">Zilva Enterprise Dashboard</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d8aa62]/20 text-[#d8aa62] text-[10px] font-bold uppercase tracking-wider border border-[#d8aa62]/40">
                  SuperAdmin Mode
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Kurort boshqaruvi, real-time metrikalar, bronlar va xavfsizlik audit loglari
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              title="Yangilash"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'dashboard', label: '📊 Tizim Metrikalari', icon: BarChart3 },
            { id: 'bookings', label: `📅 Bronlar (${bookings.length})`, icon: Calendar },
            { id: 'rooms', label: `🏡 Xonalar (${rooms.length})`, icon: Home },
            { id: 'admins', label: `👥 Foydalanuvchilar & RBAC (${adminUsers.length})`, icon: Users },
            { id: 'audit', label: `🛡️ Audit Loglari (${auditLogs.length})`, icon: Activity },
            { id: 'contacts', label: `💬 Murojaatlar (${contacts.length})`, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white shadow-lg'
                    : 'bg-[#0f2319] hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dashboard & Metrics */}
        {activeTab === 'dashboard' && (
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
                    onClick={() => setActiveTab('bookings')}
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
                    onClick={() => setActiveTab('audit')}
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
        )}

        {/* Tab 2: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Bron So‘rovlari Ro‘yxati</h2>
                <p className="text-xs text-white/60 mt-0.5">Xona bandlik holatlari va mehmonlar bilan bog‘lanish</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportBookingsToCSV(bookings)}
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
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
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
        )}

        {/* Tab 3: Rooms Catalog */}
        {activeTab === 'rooms' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Xonalar & Kottejlar Katalogi</h2>
                <p className="text-xs text-white/60 mt-0.5">Narxlar va mavjudlik holatini boshqarish</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden">
                      <img src={room.coverImage} alt={room.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        room.isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {room.isAvailable ? 'Mavjud' : 'Yopiq'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-white">{room.name}</h4>
                      <span className="text-xs text-[#d8aa62] font-semibold">{room.category}</span>
                    </div>

                    {editingPriceId === room.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          placeholder={room.pricePerNight.toString()}
                          className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-mono"
                        />
                        <button
                          onClick={() => handleSavePrice(room.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-serif font-bold text-[#d8aa62]">{formatCurrency(room.pricePerNight)}</span>
                        <button
                          onClick={() => {
                            setEditingPriceId(room.id);
                            setTempPrice(room.pricePerNight.toString());
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleRoom(room.id)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                        room.isAvailable
                          ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40'
                          : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40'
                      }`}
                    >
                      {room.isAvailable ? 'Bandlikka yopish' : 'Bandlikka ochish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Users & RBAC */}
        {activeTab === 'admins' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Foydalanuvchilar & Rollar (RBAC)</h2>
                <p className="text-xs text-white/60 mt-0.5">Tizim administratorlari, rollari va kirish huquqlari</p>
              </div>

              <button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Yangi Admin Qo‘shish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminUsers.map((user) => (
                <div key={user.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#d8aa62]/20 border border-[#d8aa62]/40 flex items-center justify-center text-[#d8aa62] font-bold text-sm">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{user.fullName}</h4>
                          <span className="text-xs text-white/60 font-mono">@{user.username}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'SuperAdmin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : user.role === 'Admin'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-[#d8aa62]/20 text-[#d8aa62] border border-[#d8aa62]/40'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1 font-mono text-white/70">
                      <div className="flex justify-between">
                        <span>PIN-kod:</span>
                        <span className="text-amber-300 font-bold">{user.pinCode || '7788'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Holati:</span>
                        <span className={user.isActive ? 'text-emerald-400' : 'text-rose-400'}>
                          {user.isActive ? '● Faol' : '● Bloklangan'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAdminStatus(user.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        user.isActive
                          ? 'bg-white/10 hover:bg-white/20 text-white/80'
                          : 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50'
                      }`}
                    >
                      {user.isActive ? 'Bloklash' : 'Faollashtirish'}
                    </button>

                    {adminUsers.length > 1 && (
                      <button
                        onClick={() => handleDeleteAdmin(user.id, user.username)}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Xavfsizlik & Audit Loglari</h2>
                <p className="text-xs text-white/60 mt-0.5">Tizimda amalga oshirilgan barcha harakatlar xronologiyasi</p>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Amal yoki foydalanuvchini qidirish..."
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/40 focus:border-[#d8aa62] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/5 uppercase text-[10px] text-white/50 tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Vaqt</th>
                    <th className="p-3.5">Foydalanuvchi</th>
                    <th className="p-3.5">Amal (Action)</th>
                    <th className="p-3.5">Resurs (Entity)</th>
                    <th className="p-3.5">Tafsilotlar</th>
                    <th className="p-3.5 rounded-r-xl">IP Manzil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-mono text-white/50 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-[#d8aa62]">{log.userName}</td>
                      <td className="p-3.5 font-mono text-emerald-400">{log.action}</td>
                      <td className="p-3.5 text-white/60">{log.entityName}</td>
                      <td className="p-3.5 text-white/80 max-w-xs truncate">{log.details || '—'}</td>
                      <td className="p-3.5 font-mono text-white/40 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Contacts */}
        {activeTab === 'contacts' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-5">
              <h2 className="font-serif text-xl font-bold text-white">Mehmonlar Murojaatlari</h2>
              <p className="text-xs text-white/60 mt-0.5">Aloqa sahifasidan yuborilgan xabarlar</p>
            </div>

            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{c.fullName}</h4>
                      <span className="text-xs text-white/60">{c.phone} {c.email ? `• ${c.email}` : ''}</span>
                    </div>
                    <span className="text-[11px] font-mono text-white/40">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/90 leading-relaxed">
                    <span className="font-bold text-[#d8aa62] block mb-1">{c.subject}</span>
                    <p>{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Admin Modal */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f2319] text-white w-full max-w-md rounded-3xl border border-white/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#d8aa62]" />
                <h3 className="font-serif font-bold text-lg text-white">Yangi Administrator Qo‘shish</h3>
              </div>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {adminActionMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{adminActionMessage}</span>
              </div>
            )}

            {adminActionError && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-white/70 block uppercase font-semibold">F.I.SH (To‘liq ism)</label>
                <input
                  type="text"
                  required
                  placeholder="Azizbek Rahimov"
                  value={newAdminFullName}
                  onChange={(e) => setNewAdminFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-[#d8aa62] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 block uppercase font-semibold">Login (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="aziz_manager"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:border-[#d8aa62] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 block uppercase font-semibold">Rol (Role)</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-[#d8aa62] focus:outline-none"
                >
                  <option value="SuperAdmin">SuperAdmin (To‘liq huquq)</option>
                  <option value="Admin">Admin (Boshqaruv)</option>
                  <option value="Manager">Manager (Bron va xonalar)</option>
                  <option value="Receptionist">Receptionist (Qabulxona)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white/70 block uppercase font-semibold">Parol</label>
                  <input
                    type="password"
                    required
                    placeholder="Parol kiriting"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:border-[#d8aa62] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/70 block uppercase font-semibold">PIN-kod (4 xonali)</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="7788"
                    value={newAdminPin}
                    onChange={(e) => setNewAdminPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-center tracking-widest focus:border-[#d8aa62] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] disabled:opacity-50 text-white font-bold text-center uppercase tracking-wider text-xs shadow-lg transition-all mt-2"
              >
                {isSubmittingAdmin ? 'Saqlanmoqda...' : 'Yangi Adminni Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, Calendar, MessageSquare, Home, Users, CheckCircle2,
  Clock, XCircle, Phone, Mail, AlertCircle, RefreshCw, ExternalLink,
  Download, LogOut, Send, Check, ToggleLeft, ToggleRight, Edit3,
  UserPlus, UserCheck, Trash2, Eye, EyeOff, KeyRound, Lock
} from 'lucide-react';
import { BookingRequestRecord, ContactRequestRecord, Room } from '@/types';
import {
  fetchAdminBookings, fetchAdminContacts, updateAdminBookingStatus,
  fetchRooms, isAdminAuthenticated, logoutAdmin, exportBookingsToCSV,
  toggleRoomAvailability, updateRoomPrice,
  AdminUserRecord, fetchAdminUsers, createAdminUser, toggleAdminUserStatus, deleteAdminUser
} from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fallbackRooms } from '@/data/rooms';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts' | 'rooms' | 'admins'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'New' | 'Contacted' | 'Confirmed' | 'Cancelled'>('all');
  
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRequestRecord[]>([]);
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // New Admin Form State
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('7788');
  const [newAdminRole, setNewAdminRole] = useState('Menejer');
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
    const [bData, cData, rData, uData] = await Promise.all([
      fetchAdminBookings(),
      fetchAdminContacts(),
      fetchRooms(),
      fetchAdminUsers()
    ]);
    setBookings(bData);
    setContacts(cData);
    setRooms(rData);
    setAdminUsers(uData);
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

    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setAdminActionError("Login va parol to'ldirilishi shart.");
      return;
    }

    setIsSubmittingAdmin(true);
    const res = await createAdminUser({
      username: newAdminUsername.trim(),
      fullName: newAdminFullName.trim() || newAdminUsername.trim(),
      password: newAdminPassword,
      pinCode: newAdminPin.trim() || '7788',
      role: newAdminRole
    });
    setIsSubmittingAdmin(false);

    if (res.success) {
      setAdminActionMessage(res.message);
      setNewAdminFullName('');
      setNewAdminUsername('');
      setNewAdminPassword('');
      setNewAdminPin('7788');
      setIsAddAdminModalOpen(false);
      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins);
    } else {
      setAdminActionError(res.message);
    }
  };

  const handleToggleAdminStatus = async (id: number) => {
    const success = await toggleAdminUserStatus(id);
    if (success) {
      setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    }
  };

  const handleDeleteAdmin = async (id: number, username: string) => {
    if (!confirm(`Haqiqatan ham "${username}" administratorini o'chirmoqchimisiz?`)) return;
    const res = await deleteAdminUser(id);
    if (res.success) {
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      setAdminActionMessage(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const success = await updateAdminBookingStatus(id, newStatus);
    if (success) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    }
  };

  const handleToggleRoom = async (id: number) => {
    const success = await toggleRoomAvailability(id);
    if (success) {
      setRooms(prev => prev.map(r => r.id === id ? { ...r, isAvailable: !r.isAvailable } : r));
    }
  };

  const handleSavePrice = async (id: number) => {
    const p = parseFloat(tempPrice);
    if (p > 0) {
      const success = await updateRoomPrice(id, p);
      if (success) {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, pricePerNight: p } : r));
      }
    }
    setEditingPriceId(null);
  };

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#12241b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#d8aa62] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const newBookingsCount = bookings.filter(b => b.status === 'New').length;
  const unreadContactsCount = contacts.filter(c => !c.isRead).length;

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Header */}
      <div className="bg-[#12241b] text-white py-10 mb-8 border-b border-white/10">
        <div className="resort-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#d8aa62] font-semibold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Ma'muriyat Boshqaruv Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Zilva Resort & Spa
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2 text-xs font-medium"
              title="Ma'lumotlarni yangilash"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Yangilash</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-[#b88a44] hover:bg-[#9c7334] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Saytga o'tish
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="resort-container space-y-8">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-3xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b88a44] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#5e6962] block">Yangi Bron So'rovlari</span>
              <span className="text-2xl font-serif font-bold text-[#18221b]">{newBookingsCount} ta</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#5e6962] block">Jami Bron So'rovlari</span>
              <span className="text-2xl font-serif font-bold text-[#18221b]">{bookings.length} ta</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#5e6962] block">Kelgan Xabarlar</span>
              <span className="text-2xl font-serif font-bold text-[#18221b]">{contacts.length} ta</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#f0ebe1] dark:bg-emerald-950/40 text-[#1b382b] dark:text-[#d8aa62] flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#5e6962] block">Faol Xonalar</span>
              <span className="text-2xl font-serif font-bold text-[#18221b]">{rooms.filter(r => r.isAvailable).length} / {rooms.length} ta</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & CSV Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfd8cb] pb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-[#1b382b] text-white shadow-sm'
                  : 'bg-white text-[#5e6962] hover:bg-[#dfd8cb]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bron So'rovlari ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'contacts'
                  ? 'bg-[#1b382b] text-white shadow-sm'
                  : 'bg-white text-[#5e6962] hover:bg-[#dfd8cb]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Xabarlar ({contacts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'rooms'
                  ? 'bg-[#1b382b] text-white shadow-sm'
                  : 'bg-white text-[#5e6962] hover:bg-[#dfd8cb]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Xonalar Boshqaruvi ({rooms.length})</span>
            </button>
          </div>

          {activeTab === 'bookings' && bookings.length > 0 && (
            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#dfd8cb] text-[#18221b] border border-[#dfd8cb] text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>Excel (CSV) Eksport</span>
            </button>
          )}
        </div>

        {/* Tab 1: Bookings Content */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-[#dfd8cb] overflow-hidden shadow-sm">
            {/* Status Filter Badges */}
            <div className="p-4 border-b border-[#dfd8cb] bg-[#f8f5ee]/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs text-[#5e6962] font-medium mr-2">Filter:</span>
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'New', label: 'Yangi' },
                { id: 'Contacted', label: "Bog'lanildi" },
                { id: 'Confirmed', label: 'Tasdiqlandi' },
                { id: 'Cancelled', label: 'Bekor qilindi' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setBookingFilter(f.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    bookingFilter === f.id
                      ? 'bg-[#1b382b] text-white'
                      : 'bg-white text-[#5e6962] border border-[#dfd8cb] hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#5e6962]">
                Tanlangan toifada so'rovlar topilmadi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f5ee] text-[#5e6962] uppercase tracking-wider text-[10px] border-b border-[#dfd8cb]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">ID & Vaqt</th>
                      <th className="py-3.5 px-4 font-semibold">Mehmon</th>
                      <th className="py-3.5 px-4 font-semibold">Xona</th>
                      <th className="py-3.5 px-4 font-semibold">Sanalar</th>
                      <th className="py-3.5 px-4 font-semibold">Mehmonlar</th>
                      <th className="py-3.5 px-4 font-semibold">Holat (Status)</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Amal & Tezkor Aloqa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dfd8cb]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#f8f5ee]/50 transition-colors">
                        <td className="py-4 px-4 font-mono text-[11px] text-[#5e6962]">
                          #{b.id}
                          <span className="block text-[10px] text-gray-500 font-sans">
                            {formatDate(b.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#18221b] block">{b.fullName}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a href={`tel:${b.phone}`} className="text-[#b88a44] hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{b.phone}</span>
                            </a>
                            <a
                              href={`https://t.me/${b.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Telegramda ochish"
                            >
                              <Send className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-[#18221b]">
                          {b.roomName || "Belgilanmagan"}
                          {b.specialRequests && (
                            <span className="block text-[10px] text-[#5e6962] italic max-w-xs truncate" title={b.specialRequests}>
                              "{b.specialRequests}"
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-[#5e6962]">
                          <span>{b.checkIn} — {b.checkOut}</span>
                        </td>
                        <td className="py-4 px-4 text-[#5e6962]">
                          {b.adults} kattalar{b.children > 0 ? `, ${b.children} bolalar` : ''}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            b.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {b.status === 'New' ? 'Yangi' :
                             b.status === 'Contacted' ? 'Bog\'lanildi' :
                             b.status === 'Confirmed' ? 'Tasdiqlandi' : 'Bekor qilindi'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-[#dfd8cb] text-xs bg-white text-[#18221b] focus:outline-none"
                          >
                            <option value="New">Yangi</option>
                            <option value="Contacted">Bog'lanildi</option>
                            <option value="Confirmed">Tasdiqlandi</option>
                            <option value="Cancelled">Bekor qilindi</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contacts Content */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center text-[#5e6962] space-y-2">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-base font-semibold text-[#18221b]">Xabarlar mavjud emas</p>
                <p className="text-xs">Mijozlar tomonidan yuborilgan xabarlar bu yerda ko'rinadi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className={`glass-card p-6 rounded-3xl shadow-md border transition-all ${
                      c.isRead ? 'border-white/40 opacity-90' : 'border-[#b88a44] bg-amber-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#dfd8cb]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#1b382b] text-[#d8aa62] flex items-center justify-center font-bold">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#18221b] flex items-center gap-2">
                            <span>{c.fullName}</span>
                            {!c.isRead && (
                              <span className="px-2 py-0.5 rounded-full bg-[#b88a44] text-white text-[10px] uppercase font-bold">
                                Yangi
                              </span>
                            )}
                          </h3>
                          <span className="text-xs text-[#5e6962]">{formatDate(c.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <a
                          href={`tel:${c.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{c.phone}</span>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2">
                      {c.subject && (
                        <p className="font-semibold text-[#18221b]">
                          Mavzu: <span className="text-[#b88a44]">{c.subject}</span>
                        </p>
                      )}
                      <p className="text-[#5e6962] bg-[#f8f5ee] dark:bg-emerald-950/20 p-4 rounded-2xl leading-relaxed">
                        {c.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab 3: Rooms Management --- */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className="glass-card p-5 rounded-3xl shadow-md border border-white/40 flex flex-col sm:flex-row items-center gap-4 hover:shadow-xl transition-shadow"
                >
                  <img
                    src={r.coverImage}
                    alt={r.name}
                    className="w-full sm:w-32 h-28 rounded-2xl object-cover"
                  />

                  <div className="flex-1 space-y-1.5 text-center sm:text-left w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base text-[#18221b]">{r.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {r.isAvailable ? 'Mavjud' : 'Band'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5e6962] line-clamp-1">{r.shortDescription}</p>

                    <div className="flex items-center gap-3 text-xs text-[#5e6962]">
                      <span>{r.area} m²</span>
                      <span>•</span>
                      <span>{r.maxGuests} mehmon</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#dfd8cb]">
                    <div className="text-right">
                      {editingPriceId === r.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-28 px-2 py-1 border border-[#dfd8cb] rounded-lg text-xs font-mono"
                          />
                          <button
                            onClick={() => handleSavePrice(r.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-base text-[#1b382b]">{formatCurrency(r.pricePerNight)}</span>
                          <button
                            onClick={() => { setEditingPriceId(r.id); setTempPrice(r.pricePerNight.toString()); }}
                            className="text-[#5e6962] hover:text-[#b88a44]"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleRoom(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        r.isAvailable ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {r.isAvailable ? 'Band qilish' : 'Ochish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Tab 4: Admin Users Management --- */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#18221b]">Administratorlar Ro'yxati</h2>
                <p className="text-xs text-[#5e6962]">Tizimga kirish huquqiga ega bo'lgan xodimlar va boshqaruvchilar.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminUsers.map((u) => (
                <div
                  key={u.id}
                  className={`glass-card p-6 rounded-3xl shadow-md border transition-all space-y-4 ${
                    u.isActive ? 'border-white/40' : 'border-rose-200 bg-rose-50/10 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#dfd8cb]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b382b] to-[#2c5844] text-[#d8aa62] flex items-center justify-center font-bold text-lg shadow-sm">
                        {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#18221b]">{u.fullName || u.username}</h3>
                        <span className="text-xs text-[#5e6962] font-mono">@{u.username}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'SuperAdmin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {u.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#f8f5ee] dark:bg-emerald-950/20 space-y-1">
                      <span className="text-[10px] text-[#5e6962] uppercase block">PIN-kod:</span>
                      <span className="font-mono font-bold text-[#18221b] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#b88a44]" />
                        <span>{u.pinCode || '7788'}</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#f8f5ee] dark:bg-emerald-950/20 space-y-1">
                      <span className="text-[10px] text-[#5e6962] uppercase block">Holati:</span>
                      <span className={`font-semibold flex items-center gap-1 ${u.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{u.isActive ? 'Faol' : 'Bloklangan'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#dfd8cb]">
                    <button
                      onClick={() => handleToggleAdminStatus(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        u.isActive
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{u.isActive ? 'Nofaol qilish' : 'Faollashtirish'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAdmin(u.id, u.username)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Add New Admin Modal with Eye Icon --- */}
        {isAddAdminModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl border border-white/30 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#dfd8cb]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1b382b] text-[#d8aa62] flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#18221b]">Yangi Administrator</h3>
                    <p className="text-xs text-[#5e6962]">Tizim uchun yangi mas'ul xodim qo'shish</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {adminActionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminActionError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#18221b]">F.I.Sh. (To'liq ism-familiya)</label>
                  <input
                    type="text"
                    value={newAdminFullName}
                    onChange={(e) => setNewAdminFullName(e.target.value)}
                    placeholder="Masalan: Sardor Rustamov"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#18221b]">Login (Foydalanuvchi nomi) *</label>
                  <input
                    type="text"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="sardor_admin"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#18221b]">Parol *</label>
                  <div className="relative">
                    <input
                      type={showNewAdminPassword ? "text" : "password"}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Xavfsiz parol kiriting..."
                      className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#18221b] transition-colors"
                    >
                      {showNewAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#b88a44]" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-[#18221b]">4 xonali PIN-kod</label>
                    <div className="relative">
                      <input
                        type={showNewAdminPin ? "text" : "password"}
                        maxLength={6}
                        value={newAdminPin}
                        onChange={(e) => setNewAdminPin(e.target.value)}
                        placeholder="7788"
                        className="w-full px-3 py-2.5 pr-9 rounded-xl border border-[#dfd8cb] text-sm font-mono text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewAdminPin(!showNewAdminPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500"
                      >
                        {showNewAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#b88a44]" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-[#18221b]">Lavozimi (Roli)</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#dfd8cb] bg-white text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                    >
                      <option value="Menejer">Menejer</option>
                      <option value="SuperAdmin">Bosh Admin</option>
                      <option value="Qabulxona">Qabulxona (Reception)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#dfd8cb]">
                  <button
                    type="button"
                    onClick={() => setIsAddAdminModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#f0ebe1] hover:bg-[#dfd8cb] text-[#18221b] font-semibold text-xs transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdmin}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#d8aa62]" />
                    <span>{isSubmittingAdmin ? "Saqlanmoqda..." : "Saqlash"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

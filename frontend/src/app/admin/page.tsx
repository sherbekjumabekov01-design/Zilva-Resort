'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Calendar, MessageSquare, Home, Users,
  RefreshCw, LogOut, Activity, BarChart3
} from 'lucide-react';
import { BookingRequestRecord, ContactRequestRecord, Room } from '@/types';
import {
  fetchAdminBookings, fetchAdminContacts, updateAdminBookingStatus,
  fetchRooms, isAdminAuthenticated, logoutAdmin, exportBookingsToCSV,
  toggleRoomAvailability, updateRoomPrice,
  AdminUserRecord, fetchAdminUsers, toggleAdminUserStatus, deleteAdminUser,
  fetchAdminStats, fetchAdminAuditLogs, AuditLogRecord, SystemStatsRecord
} from '@/lib/api';
import { fallbackRooms } from '@/data/rooms';
import {
  AdminDashboardTab,
  AdminBookingsTab,
  AdminRoomsTab,
  AdminUsersTab,
  AdminAuditLogsTab,
  AdminContactsTab,
  AddAdminModal
} from '@/components/admin';

type TabType = 'dashboard' | 'bookings' | 'rooms' | 'admins' | 'audit' | 'contacts';
type BookingFilterType = 'all' | 'New' | 'Contacted' | 'Confirmed' | 'DepositPaid' | 'Cancelled';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [bookingFilter, setBookingFilter] = useState<BookingFilterType>('all');
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
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const loadData = React.useCallback(async () => {
    try {
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    const timer = setTimeout(() => {
      setIsAuthChecked(true);
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [router, loadData]);

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
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

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#07110c]">
        <div className="w-10 h-10 border-4 border-[#d8aa62] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: '📊 Tizim Metrikalari', icon: BarChart3 },
    { id: 'bookings', label: `📅 Bronlar (${bookings.length})`, icon: Calendar },
    { id: 'rooms', label: `🏡 Xonalar (${rooms.length})`, icon: Home },
    { id: 'admins', label: `👥 Foydalanuvchilar & RBAC (${adminUsers.length})`, icon: Users },
    { id: 'audit', label: `🛡️ Audit Loglari (${auditLogs.length})`, icon: Activity },
    { id: 'contacts', label: `💬 Murojaatlar (${contacts.length})`, icon: MessageSquare }
  ];

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
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Active Tab Content */}
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            stats={stats}
            bookings={bookings}
            auditLogs={auditLogs}
            adminUsers={adminUsers}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'bookings' && (
          <AdminBookingsTab
            bookings={bookings}
            bookingFilter={bookingFilter}
            setBookingFilter={setBookingFilter}
            onStatusChange={handleStatusChange}
            onExportCSV={() => exportBookingsToCSV(bookings)}
          />
        )}

        {activeTab === 'rooms' && (
          <AdminRoomsTab
            rooms={rooms}
            editingPriceId={editingPriceId}
            tempPrice={tempPrice}
            setEditingPriceId={setEditingPriceId}
            setTempPrice={setTempPrice}
            onSavePrice={handleSavePrice}
            onToggleRoom={handleToggleRoom}
          />
        )}

        {activeTab === 'admins' && (
          <AdminUsersTab
            adminUsers={adminUsers}
            onOpenAddModal={() => setIsAddAdminModalOpen(true)}
            onToggleAdminStatus={handleToggleAdminStatus}
            onDeleteAdmin={handleDeleteAdmin}
          />
        )}

        {activeTab === 'audit' && (
          <AdminAuditLogsTab
            auditLogs={auditLogs}
            auditFilter={auditFilter}
            setAuditFilter={setAuditFilter}
          />
        )}

        {activeTab === 'contacts' && (
          <AdminContactsTab
            contacts={contacts}
          />
        )}

      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

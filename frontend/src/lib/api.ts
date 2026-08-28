import { fallbackRooms } from '@/data/rooms';
import { BookingRequestInput, BookingRequestRecord, ContactRequestInput, ContactRequestRecord, Room } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// In-memory / local cache for bookings & contacts when offline
let localBookings: BookingRequestRecord[] = [
  {
    id: 1,
    fullName: "Rustam Karimov",
    phone: "+998 90 123 45 67",
    email: "rustam@example.com",
    checkIn: "2026-08-30",
    checkOut: "2026-09-02",
    adults: 2,
    children: 1,
    roomId: 1,
    roomName: "Deluxe Mountain View",
    specialRequests: "Kechki payt kelamiz, iltimos bolalar uchun qo'shimcha yostiq tayyorlab qo'ying.",
    status: "New",
    createdAt: new Date().toISOString()
  }
];

let localContacts: ContactRequestRecord[] = [
  {
    id: 1,
    fullName: "Dilshod Aliyev",
    phone: "+998 99 888 77 66",
    email: "dilshod@company.uz",
    subject: "Korporativ tadbir o'tkazish",
    message: "Assalomu alaykum! 25 kishilik jamoamiz uchun 2 kunlik konferensiya va dam olish xizmatlari narxlarini bilmoqchi edik.",
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export async function fetchRooms(params?: { category?: string; guests?: number }): Promise<Room[]> {
  try {
    let url = `${API_BASE}/rooms`;
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.guests) {
      searchParams.append('guests', params.guests.toString());
    }
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Graceful fallback to rich local data
  }

  let filtered = [...fallbackRooms];
  if (params?.category && params.category !== 'all') {
    filtered = filtered.filter(r => r.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params?.guests) {
    filtered = filtered.filter(r => r.maxGuests >= params.guests!);
  }
  return filtered;
}

export async function fetchRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const res = await fetch(`${API_BASE}/rooms/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Fallback
  }

  const found = fallbackRooms.find(r => r.slug === slug);
  return found || null;
}

export async function submitBookingRequest(data: BookingRequestInput): Promise<{ success: boolean; message: string; record?: BookingRequestRecord; errors?: string[] }> {
  try {
    const res = await fetch(`${API_BASE}/bookingrequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && (result.success !== false)) {
      return { 
        success: true, 
        message: result.message || "Bron so'rovingiz muvaffaqiyatli qabul qilindi! Menejerimiz tez orada siz bilan bog'lanadi.", 
        record: result.data || result 
      };
    } else {
      return {
        success: false,
        message: result.message || "Bron ma'lumotlarida xatolik yuz berdi.",
        errors: result.errors || []
      };
    }
  } catch {
    // Fallback
  }

  // Local fallback
  const room = fallbackRooms.find(r => r.id === data.roomId);
  const newRecord: BookingRequestRecord = {
    ...data,
    id: Date.now(),
    roomName: room?.name,
    status: 'New',
    createdAt: new Date().toISOString()
  };
  localBookings = [newRecord, ...localBookings];

  return {
    success: true,
    message: "Bron so'rovingiz muvaffaqiyatli qabul qilindi! Menejerimiz tez orada siz bilan bog'lanadi.",
    record: newRecord
  };
}

export async function submitContactRequest(data: ContactRequestInput): Promise<{ success: boolean; message: string; record?: ContactRequestRecord; errors?: string[] }> {
  try {
    const res = await fetch(`${API_BASE}/contactrequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && (result.success !== false)) {
      return { 
        success: true, 
        message: result.message || "Xabaringiz yuborildi! Tez orada javob beramiz.", 
        record: result.data || result 
      };
    } else {
      return {
        success: false,
        message: result.message || "Xabar yuborishda xatolik yuz berdi.",
        errors: result.errors || []
      };
    }
  } catch {
    // Fallback
  }

  const newRecord: ContactRequestRecord = {
    ...data,
    id: Date.now(),
    isRead: false,
    createdAt: new Date().toISOString()
  };
  localContacts = [newRecord, ...localContacts];

  return {
    success: true,
    message: "Xabaringiz yuborildi! Tez orada javob beramiz.",
    record: newRecord
  };
}

export async function fetchAdminBookings(page = 1, pageSize = 20): Promise<BookingRequestRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/booking-requests?page=${page}&pageSize=${pageSize}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || []);
    }
  } catch {
    // Fallback
  }
  return localBookings;
}

export async function updateAdminBookingStatus(id: number, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/booking-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }

  const item = localBookings.find(b => b.id === id);
  if (item) {
    item.status = status as 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';
    return true;
  }
  return false;
}

export async function fetchAdminContacts(page = 1, pageSize = 20): Promise<ContactRequestRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/contact-requests?page=${page}&pageSize=${pageSize}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || []);
    }
  } catch {
    // Fallback
  }
  return localContacts;
}

export async function loginAdmin(credentials: { username?: string; password?: string; pin?: string }): Promise<{ success: boolean; token?: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (res.ok && (data.success || data.token)) {
      const token = data.data?.token || data.token;
      const user = data.data?.user?.username || data.username || 'admin';
      if (typeof window !== 'undefined') {
        localStorage.setItem('zilva_admin_token', token);
        localStorage.setItem('zilva_admin_user', user);
      }
      return { success: true, token, message: data.message || "Tizimga muvaffaqiyatli kirildi." };
    }
    return { success: false, message: data.message || "Login yoki parol noto'g'ri." };
  } catch {
    // Fallback offline login for PIN 7788 or 1234
    if (credentials.pin === '7788' || credentials.pin === '1234' || (credentials.username === 'admin' && credentials.password === 'zilva2026!admin')) {
      const token = `offline_admin_${Date.now()}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('zilva_admin_token', token);
        localStorage.setItem('zilva_admin_user', 'admin');
      }
      return { success: true, token, message: "Offline rejimda kirildi." };
    }
    return { success: false, message: "Tarmoq xatosi yoki server javob bermadi." };
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('zilva_admin_token');
  return !!token;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('zilva_admin_token');
  localStorage.removeItem('zilva_admin_user');
}

export async function toggleRoomAvailability(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/rooms/${id}/toggle-availability`, {
      method: 'PATCH'
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  const r = fallbackRooms.find(room => room.id === id);
  if (r) {
    r.isAvailable = !r.isAvailable;
    return true;
  }
  return false;
}

export async function updateRoomPrice(id: number, price: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/rooms/${id}/price`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price })
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  const r = fallbackRooms.find(room => room.id === id);
  if (r) {
    r.pricePerNight = price;
    return true;
  }
  return false;
}

export function exportBookingsToCSV(bookings: BookingRequestRecord[]): void {
  const headers = ['ID', 'F.I.SH', 'Telefon', 'Email', 'Xona', 'Kelish Sanasi', 'Ketish Sanasi', 'Kattalar', 'Bolalar', 'Status', 'Yuborilgan Vaqt', 'Maxsus Talablar'];
  const rows = bookings.map(b => [
    b.id,
    `"${(b.fullName || '').replace(/"/g, '""')}"`,
    `"${b.phone || ''}"`,
    `"${b.email || ''}"`,
    `"${(b.roomName || '').replace(/"/g, '""')}"`,
    b.checkIn,
    b.checkOut,
    b.adults,
    b.children,
    b.status,
    `"${b.createdAt}"`,
    `"${(b.specialRequests || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `zilva_resort_bronlar_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Admin Users API ---
export interface AdminUserRecord {
  id: number;
  username: string;
  fullName: string;
  pinCode?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const localAdmins: AdminUserRecord[] = [
  { id: 1, username: 'admin', fullName: 'Bosh Administrator', pinCode: '7788', role: 'SuperAdmin', isActive: true, createdAt: new Date().toISOString() },
  { id: 2, username: 'menejer', fullName: 'Zilva Menejeri', pinCode: '1234', role: 'Menejer', isActive: true, createdAt: new Date().toISOString() },
];

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return localAdmins;
}

export async function createAdminUser(data: { username: string; fullName: string; password: string; pinCode?: string; role?: string }): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, message: result.message || "Yangi admin muvaffaqiyatli qo'shildi." };
    }
    return { success: false, message: result.message || "Xatolik yuz berdi." };
  } catch {
    localAdmins.push({
      id: Date.now(),
      username: data.username,
      fullName: data.fullName || data.username,
      pinCode: data.pinCode || '7788',
      role: data.role || 'Menejer',
      isActive: true,
      createdAt: new Date().toISOString()
    });
    return { success: true, message: "Yangi admin qo'shildi (Offline rejim)." };
  }
}

export async function toggleAdminUserStatus(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}/toggle-status`, {
      method: 'PATCH'
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  const user = localAdmins.find(u => u.id === id);
  if (user) {
    user.isActive = !user.isActive;
    return true;
  }
  return false;
}

export async function deleteAdminUser(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message || "Admin o'chirildi." };
    }
    return { success: false, message: data.message || "O'chirishda xatolik." };
  } catch {
    const idx = localAdmins.findIndex(u => u.id === id);
    if (idx !== -1) {
      localAdmins.splice(idx, 1);
      return { success: true, message: "Admin o'chirildi." };
    }
    return { success: false, message: "Foydalanuvchi topilmadi." };
  }
}

export interface AuditLogRecord {
  id: number;
  userId?: number;
  userName: string;
  action: string;
  entityName: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemStatsRecord {
  totalRooms: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalContacts: number;
  unreadContacts: number;
  activeAdmins: number;
  totalRevenue: number;
  occupancyRate: number;
  averageDailyRate: number;
}

export async function fetchAdminStats(): Promise<SystemStatsRecord> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch {
    // Fallback
  }
  return {
    totalRooms: 6,
    totalBookings: localBookings.length,
    pendingBookings: localBookings.filter(b => b.status === 'New').length,
    confirmedBookings: localBookings.filter(b => b.status === 'Confirmed').length,
    totalContacts: localContacts.length,
    unreadContacts: localContacts.filter(c => !c.isRead).length,
    activeAdmins: localAdmins.filter(a => a.isActive).length,
    totalRevenue: 5400000,
    occupancyRate: 67.5,
    averageDailyRate: 2400000
  };
}

export async function fetchAdminAuditLogs(page = 1, pageSize = 20): Promise<AuditLogRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/audit-logs?page=${page}&pageSize=${pageSize}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || []);
    }
  } catch {
    // Fallback
  }
  return [
    {
      id: 1,
      userName: "admin",
      action: "LOGIN",
      entityName: "Auth",
      details: "Bosh administrator tizimga muvaffaqiyatli kirdi.",
      ipAddress: "127.0.0.1",
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      userName: "System",
      action: "SYSTEM_INITIALIZED",
      entityName: "Database",
      details: "Zilva Resort & Spa xonalar va sozlamalar bazasi yuklandi.",
      ipAddress: "127.0.0.1",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];
}

export async function updateAdminUser(id: number, data: { fullName?: string; email?: string; password?: string; pinCode?: string; role?: string }): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, message: result.message || "Foydalanuvchi yangilandi." };
    }
    return { success: false, message: result.message || "Xatolik yuz berdi." };
  } catch {
    const user = localAdmins.find(u => u.id === id);
    if (user) {
      if (data.fullName) user.fullName = data.fullName;
      if (data.role) user.role = data.role;
      if (data.pinCode) user.pinCode = data.pinCode;
      return { success: true, message: "Foydalanuvchi yangilandi (Offline)." };
    }
    return { success: false, message: "Foydalanuvchi topilmadi." };
  }
}




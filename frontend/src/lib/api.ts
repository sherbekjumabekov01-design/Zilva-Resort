import { fallbackRooms } from '@/data/rooms';
import { BookingRequestInput, BookingRequestRecord, ContactRequestInput, ContactRequestRecord, Room } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('zilva_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

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
  } catch (err) {
    console.warn("Could not fetch rooms from server, using fallback data:", err);
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
  } catch (err) {
    console.warn(`Could not fetch room ${slug} from server:`, err);
  }

  const found = fallbackRooms.find(r => r.slug === slug);
  return found || null;
}

export async function submitBookingRequest(data: BookingRequestInput): Promise<{
  success: boolean;
  message: string;
  record?: BookingRequestRecord;
  errors?: string[];
}> {
  try {
    const res = await fetch(`${API_BASE}/bookingrequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    let result: any = null;
    try {
      result = await res.json();
    } catch {
      // Body may not be valid JSON (e.g. 500 HTML or empty)
    }

    if (res.ok && (!result || result.success !== false)) {
      return { 
        success: true, 
        message: result?.message || "Bron so'rovingiz muvaffaqiyatli qabul qilindi! Menejerimiz tez orada siz bilan bog'lanadi.", 
        record: result?.data || result 
      };
    }

    // Specific HTTP error codes handling
    let errorMessage = result?.message;
    if (!errorMessage) {
      if (res.status === 409) {
        errorMessage = "Ushbu xona tanlangan sanalarda allaqachon band qilingan. Iltimos, boshqa sanalarni tanlang.";
      } else if (res.status === 400) {
        errorMessage = "Bron ma'lumotlarida xatolik bor. Iltimos, sanalar va telefon raqamingizni tekshiring.";
      } else if (res.status === 500) {
        errorMessage = "Serverda ichki xatolik yuz berdi (500). Bron saqlanmadi. Iltimos, keyinroq qayta urinib ko'ring yoki qo'ng'iroq qiling.";
      } else {
        errorMessage = `Server xatosi (${res.status}). Bron saqlanmadi.`;
      }
    }

    const errorsList = result?.errors 
      ? (Array.isArray(result.errors) ? result.errors : [String(result.errors)])
      : [];

    return {
      success: false,
      message: errorMessage,
      errors: errorsList
    };
  } catch (err: any) {
    console.error("Booking submission network failure:", err);
    return {
      success: false,
      message: "Server bilan aloqa uzildi yoki tarmoqda xatolik yuz berdi. Bron saqlanmadi. Iltimos, internet aloqangizni tekshiring yoki to'g'ridan-to'g'ri telefon orqali (+998 90 123 45 67) bog'laning.",
      errors: [err?.message || "Network request failed"]
    };
  }
}

export async function submitContactRequest(data: ContactRequestInput): Promise<{
  success: boolean;
  message: string;
  record?: ContactRequestRecord;
  errors?: string[];
}> {
  try {
    const res = await fetch(`${API_BASE}/contactrequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    let result: any = null;
    try {
      result = await res.json();
    } catch {
      // Body may not be JSON
    }

    if (res.ok && (!result || result.success !== false)) {
      return { 
        success: true, 
        message: result?.message || "Xabaringiz yuborildi! Tez orada javob beramiz.", 
        record: result?.data || result 
      };
    }

    let errorMessage = result?.message;
    if (!errorMessage) {
      if (res.status === 400) {
        errorMessage = "Xabar maydonlarida xatolik bor. Iltimos, barcha maydonlarni tekshirib qayta yuboring.";
      } else if (res.status === 500) {
        errorMessage = "Serverda xatolik yuz berdi (500). Xabar saqlanmadi. Iltimos, keyinroq qayta urinib ko'ring.";
      } else {
        errorMessage = `Server xatosi (${res.status}). Xabar yuborilmadi.`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: result?.errors || []
    };
  } catch (err: any) {
    console.error("Contact submission network failure:", err);
    return {
      success: false,
      message: "Server bilan aloqa uzildi. Xabaringiz saqlanmadi. Iltimos, internet aloqangizni tekshiring yoki to'g'ridan-to'g'ri qo'ng'iroq qiling.",
      errors: [err?.message || "Network request failed"]
    };
  }
}

export async function fetchAdminBookings(page = 1, pageSize = 50): Promise<BookingRequestRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/booking-requests?page=${page}&pageSize=${pageSize}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || data.data?.items || []);
    }
    console.error(`Failed to fetch admin bookings: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to fetch admin bookings:", err);
  }
  return [];
}

export async function updateAdminBookingStatus(id: number, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/booking-requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (res.ok) return true;
    console.error(`Failed to update booking status: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to update booking status:", err);
  }
  return false;
}

export async function fetchAdminContacts(page = 1, pageSize = 50): Promise<ContactRequestRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/contact-requests?page=${page}&pageSize=${pageSize}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || data.data?.items || []);
    }
    console.error(`Failed to fetch admin contacts: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to fetch admin contacts:", err);
  }
  return [];
}

export async function loginAdmin(credentials: { username?: string; password?: string; pin?: string }): Promise<{ success: boolean; token?: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (res.ok && (data.success || data.data?.token || data.token)) {
      const token = data.data?.token || data.token;
      const user = data.data?.user?.username || data.username || 'admin';
      if (typeof window !== 'undefined') {
        localStorage.setItem('zilva_admin_token', token);
        localStorage.setItem('zilva_admin_user', user);
      }
      return { success: true, token, message: data.message || "Tizimga muvaffaqiyatli kirildi." };
    }
    return { success: false, message: data.message || "Login yoki parol noto'g'ri." };
  } catch (err) {
    console.error("Admin login network failure:", err);
    return { success: false, message: "Server bilan bog'lanishda xatolik yuz berdi. Backend xizmati faolligini tekshiring." };
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
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) return true;
    console.error(`Failed to toggle room availability: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to toggle room availability:", err);
  }
  return false;
}

export async function updateRoomPrice(id: number, price: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/rooms/${id}/price`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ price })
    });
    if (res.ok) return true;
    console.error(`Failed to update room price: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to update room price:", err);
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

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.data || []);
    }
    console.error(`Failed to fetch admin users: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to fetch admin users:", err);
  }
  return [];
}

export async function createAdminUser(data: { username: string; fullName: string; password: string; pinCode?: string; role?: string }): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, message: result.message || "Yangi admin muvaffaqiyatli qo'shildi." };
    }
    return { success: false, message: result.message || "Xatolik yuz berdi." };
  } catch (err) {
    console.error("Failed to create admin user:", err);
    return { success: false, message: "Server bilan bog'lanib bo'lmadi. Backend holatini tekshiring." };
  }
}

export async function toggleAdminUserStatus(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) return true;
    console.error(`Failed to toggle admin user status: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to toggle admin user status:", err);
  }
  return false;
}

export async function deleteAdminUser(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message || "Admin o'chirildi." };
    }
    return { success: false, message: data.message || "O'chirishda xatolik." };
  } catch (err) {
    console.error("Failed to delete admin user:", err);
    return { success: false, message: "Server bilan bog'lanib bo'lmadi." };
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

export async function fetchAdminStats(): Promise<SystemStatsRecord | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
    console.error(`Failed to fetch admin stats: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to fetch admin stats:", err);
  }
  return null;
}

export async function fetchAdminAuditLogs(page = 1, pageSize = 50): Promise<AuditLogRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/audit-logs?page=${page}&pageSize=${pageSize}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || data.data?.items || []);
    }
    console.error(`Failed to fetch audit logs: HTTP ${res.status}`);
  } catch (err) {
    console.error("Failed to fetch audit logs:", err);
  }
  return [];
}

export async function updateAdminUser(id: number, data: { fullName?: string; email?: string; password?: string; pinCode?: string; role?: string }): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, message: result.message || "Foydalanuvchi yangilandi." };
    }
    return { success: false, message: result.message || "Xatolik yuz berdi." };
  } catch (err) {
    console.error("Failed to update admin user:", err);
    return { success: false, message: "Server bilan bog'lanib bo'lmadi." };
  }
}

import { NextResponse } from 'next/server';
import { getBookingsData, getContactsData, getRoomsData } from '@/lib/server-data';

export async function GET() {
  const rooms = getRoomsData();
  const bookings = getBookingsData();
  const contacts = getContactsData();

  return NextResponse.json({
    totalRooms: rooms.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'New').length,
    totalContacts: contacts.length,
    unreadContacts: contacts.filter(c => !c.isRead).length
  });
}

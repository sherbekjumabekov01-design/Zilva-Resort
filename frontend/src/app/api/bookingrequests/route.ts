import { NextRequest, NextResponse } from 'next/server';
import { getBookingsData, getRoomsData } from '@/lib/server-data';
import { BookingRequestInput, BookingRequestRecord } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequestInput = await request.json();

    if (!body.fullName || !body.phone) {
      return NextResponse.json({ message: "Ism va telefon raqami kiritilishi shart." }, { status: 400 });
    }

    const bookings = getBookingsData();
    const rooms = getRoomsData();
    const room = rooms.find(r => r.id === body.roomId);

    const newRecord: BookingRequestRecord = {
      id: Date.now(),
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim(),
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      adults: body.adults || 1,
      children: body.children || 0,
      roomId: body.roomId,
      roomName: room?.name,
      specialRequests: body.specialRequests?.trim(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Noto'g'ri so'rov formati" }, { status: 400 });
  }
}

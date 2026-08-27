import { NextRequest, NextResponse } from 'next/server';
import { getBookingsData } from '@/lib/server-data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);
  const body = await request.json();

  const bookings = getBookingsData();
  const booking = bookings.find(b => b.id === numId);

  if (!booking) {
    return NextResponse.json({ message: "So'rov topilmadi." }, { status: 404 });
  }

  booking.status = body.status;

  return NextResponse.json({ message: "Status muvaffaqiyatli yangilandi.", status: booking.status });
}

import { NextRequest, NextResponse } from 'next/server';
import { getBookingsData } from '@/lib/server-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let bookings = getBookingsData();
  if (status) {
    bookings = bookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json(bookings);
}

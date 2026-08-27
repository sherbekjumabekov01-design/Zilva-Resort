import { NextRequest, NextResponse } from 'next/server';
import { getRoomsData } from '@/lib/server-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const guests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : null;

  let rooms = getRoomsData();

  if (category && category.toLowerCase() !== 'all') {
    rooms = rooms.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (guests) {
    rooms = rooms.filter(r => r.maxGuests >= guests);
  }

  return NextResponse.json(rooms);
}

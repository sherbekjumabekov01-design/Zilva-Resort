import { NextRequest, NextResponse } from 'next/server';
import { getRoomsData } from '@/lib/server-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const rooms = getRoomsData();
  const room = rooms.find(r => r.slug === slug);

  if (!room) {
    return NextResponse.json({ message: `Xona topilmadi: ${slug}` }, { status: 404 });
  }

  return NextResponse.json(room);
}

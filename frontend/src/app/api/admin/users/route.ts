import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const res = await fetch(`${backendUrl}/api/admin/users`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${backendUrl}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: 'Serverga ulanishda xatolik yuz berdi.' }, { status: 500 });
  }
}

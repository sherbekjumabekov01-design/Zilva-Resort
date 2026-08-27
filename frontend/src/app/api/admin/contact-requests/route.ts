import { NextResponse } from 'next/server';
import { getContactsData } from '@/lib/server-data';

export async function GET() {
  const contacts = getContactsData();
  return NextResponse.json(contacts);
}

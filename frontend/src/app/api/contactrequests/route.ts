import { NextRequest, NextResponse } from 'next/server';
import { getContactsData } from '@/lib/server-data';
import { ContactRequestInput, ContactRequestRecord } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestInput = await request.json();

    if (!body.fullName || !body.phone || !body.message) {
      return NextResponse.json({ message: "Barcha majburiy maydonlarni to'ldiring." }, { status: 400 });
    }

    const contacts = getContactsData();

    const newRecord: ContactRequestRecord = {
      id: Date.now(),
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim(),
      subject: body.subject?.trim(),
      message: body.message.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    contacts.unshift(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Noto'g'ri so'rov formati" }, { status: 400 });
  }
}

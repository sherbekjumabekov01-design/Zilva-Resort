import { fallbackRooms } from '@/data/rooms';
import { BookingRequestRecord, ContactRequestRecord, Room } from '@/types';

// Global singleton in memory storage for dev/demo server
declare global {
  var __zilva_rooms: Room[] | undefined;
  var __zilva_bookings: BookingRequestRecord[] | undefined;
  var __zilva_contacts: ContactRequestRecord[] | undefined;
}

export function getRoomsData(): Room[] {
  if (!global.__zilva_rooms) {
    global.__zilva_rooms = [...fallbackRooms];
  }
  return global.__zilva_rooms;
}

export function getBookingsData(): BookingRequestRecord[] {
  if (!global.__zilva_bookings) {
    global.__zilva_bookings = [
      {
        id: 1,
        fullName: "Rustam Karimov",
        phone: "+998 90 123 45 67",
        email: "rustam@example.com",
        checkIn: "2026-08-30",
        checkOut: "2026-09-02",
        adults: 2,
        children: 1,
        roomId: 1,
        roomName: "Deluxe Mountain View",
        specialRequests: "Kechki payt kelamiz, bolalar uchun qo'shimcha yostiq tayyorlab qo'ying.",
        status: "New",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fullName: "Malika Yusupova",
        phone: "+998 97 765 43 21",
        email: "malika@gmail.com",
        checkIn: "2026-09-05",
        checkOut: "2026-09-07",
        adults: 2,
        children: 0,
        roomId: 4,
        roomName: "Family Forest Cottage",
        specialRequests: "Tug'ilgan kun nishonlaymiz, mevali savat bo'lsa xursand bo'lamiz.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
  return global.__zilva_bookings;
}

export function getContactsData(): ContactRequestRecord[] {
  if (!global.__zilva_contacts) {
    global.__zilva_contacts = [
      {
        id: 1,
        fullName: "Dilshod Aliyev",
        phone: "+998 99 888 77 66",
        email: "dilshod@company.uz",
        subject: "Korporativ tadbir o'tkazish",
        message: "Assalomu alaykum! 25 kishilik jamoamiz uchun 2 kunlik konferensiya va dam olish xizmatlari narxlarini bilmoqchi edik.",
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        fullName: "Gulnoza Rahimova",
        phone: "+998 93 333 22 11",
        email: "gulnoza@mail.ru",
        subject: "SPA xizmatlari va massaj paketi",
        message: "Dam olish kunlarida VIP SPA paketi va juftlik massaji buyurtma qilmoqchiman.",
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }
  return global.__zilva_contacts;
}

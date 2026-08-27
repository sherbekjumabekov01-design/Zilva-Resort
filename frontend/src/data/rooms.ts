import { Room } from '@/types';

export const fallbackRooms: Room[] = [
  {
    id: 1,
    slug: "deluxe-mountain-view",
    name: "Deluxe Mountain View",
    category: "Deluxe",
    shortDescription: "Katta vitrajli derazalar orqali qorli cho'qqilar va archazor o'rmoniga ochiladigan nafis xona.",
    description: "Deluxe Mountain View xonasi shinamlik va tabiat bilan uyg'unlikni qadrlaydigan mehmonlar uchun yaratilgan. Keng King Size to'shak, yumshoq yoritish, tabiiy yog'och mebellar va tog'ning toza havosidan bahramand bo'lish uchun shinam balkon mavjud. Xonada Nespresso qahva mashinasi, zamonaviy Smart TV va premium vanna buyumlari hozirlangan.",
    pricePerNight: 1800000,
    area: 42,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "1 ta King Size karavot",
    viewType: "Tog' va archazor panoramasi",
    coverImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    rules: [
      "Xonada tamaki chekish qat'iyan man etiladi",
      "Uy hayvonlari bilan joylashish ma'muriyat bilan kelishiladi",
      "Tinchlik soatlari: 23:00 dan 08:00 gacha",
      "Bepul bekor qilish: tashrifdan 48 soat oldin"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", caption: "Asosiy yotoqxona va vitraj oynalar", sortOrder: 1 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", caption: "Shinam dam olish burchagi", sortOrder: 2 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", caption: "Marmar vanna xonasi", sortOrder: 3 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 8, name: "Elektron seyf", icon: "ShieldCheck", category: "Xavfsizlik" },
      { id: 10, name: "L'Occitane premium parvarish vositalari", icon: "Sparkles", category: "Vanna" },
      { id: 11, name: "Paxta xalat va shippaklar", icon: "Shirt", category: "Qulaylik" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  },
  {
    id: 2,
    slug: "panoramic-jacuzzi-suite",
    name: "Panoramic Jacuzzi Suite",
    category: "Suite",
    shortDescription: "Tog' manzarali shaxsiy gidromassaj vannasi va keng terassaga ega lyuks suit.",
    description: "Unutilmas dam olish onlari uchun maxsus loyihalashtirilgan Panoramic Jacuzzi Suite. Keng terassada o'rnatilgan issiq suvli jakuzi orqali yulduzli osmon va ulug'vor tog'larni tomosha qilishingiz mumkin. Xona ichida qulay yashash zonasi, zamonaviy mini-bar va premium qulayliklar mavjud.",
    pricePerNight: 2700000,
    area: 58,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "1 ta King Size + 1 ta divan-karavot",
    viewType: "360° Tog' panoramasi",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    rules: [
      "Xonada tamaki chekish taqiqlanadi",
      "Jakuzidan foydalanish bo'yicha ko'rsatmalarga rioya qilinishi shart",
      "Bepul bekor qilish: tashrifdan 72 soat oldin"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", caption: "Panoramik lyuks xona", sortOrder: 1 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80", caption: "Shaxsiy terrasdagi jakuzi", sortOrder: 2 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80", caption: "Yashash maydoni", sortOrder: 3 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 7, name: "Shaxsiy gidromassajli vanna (Jacuzzi)", icon: "Bath", category: "Vanna" },
      { id: 9, name: "Shaxsiy ochiq terras / Balkon", icon: "Sun", category: "Tashqi" },
      { id: 10, name: "L'Occitane premium parvarish vositalari", icon: "Sparkles", category: "Vanna" },
      { id: 11, name: "Paxta xalat va shippaklar", icon: "Shirt", category: "Qulaylik" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  },
  {
    id: 3,
    slug: "luxury-chalet-villa",
    name: "Luxury Chalet Villa",
    category: "Chalet",
    shortDescription: "Haqiqiy o'tinli kamin, 2 ta yotoqxona va shaxsiy BBQ terrasiga ega ikki qavatli shohona kottej.",
    description: "Oilaviy yoki do'stlar davrasida unutilmas hordiq chiqarish uchun ideal ikki qavatli Chalet Villa. Birinchi qavatda shinam kaminli mehmonxona, oshxona burchagi va ovqatlanish stoli joylashgan. Ikkinchi qavatda 2 ta mustaqil yotoqxona va balkonlar mavjud. Shaxsiy hovlida mangal va terassa jihozlari mavjud.",
    pricePerNight: 4500000,
    area: 95,
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    bedType: "2 ta King Size + 1 ta ikki kishilik divan",
    viewType: "Archazor o'rmoni va tog' cho'qqilari",
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    rules: [
      "Kamindan foydalanishda xavfsizlik qoidalariga amal qiling",
      "Mangal faqat ajratilgan maxsus hududda yoqiladi",
      "Tinchlik soatlari: 23:00 dan 08:00 gacha"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", caption: "Chalet tashqi ko'rinishi", sortOrder: 1 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Kaminli keng mehmonxona", sortOrder: 2 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80", caption: "Asosiy yotoqxona", sortOrder: 3 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 6, name: "O'tinli haqiqiy kamin", icon: "Flame", category: "Hashamat" },
      { id: 9, name: "Shaxsiy ochiq terras / Balkon", icon: "Sun", category: "Tashqi" },
      { id: 10, name: "L'Occitane premium parvarish vositalari", icon: "Sparkles", category: "Vanna" },
      { id: 11, name: "Paxta xalat va shippaklar", icon: "Shirt", category: "Qulaylik" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  },
  {
    id: 4,
    slug: "executive-duplex-chalet",
    name: "Executive Duplex Chalet",
    category: "Chalet",
    shortDescription: "Shaxsiy fin saunasi, keng mehmonxona va 3 ta yotoqxonaga ega eng hashamatli shalet.",
    description: "Resort hududidagi eng yuqori darajadagi shaletlardan biri. Unda shaxsiy mini-sauna, 3 ta shinam yotoqxona, keng panoramali derazalar va hashamatli oshxona-mehmonxona mavjud. VIP servis va maxsus konsyerj xizmati kiritilgan.",
    pricePerNight: 6200000,
    area: 130,
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 3,
    bedType: "3 ta King Size karavot",
    viewType: "To'liq tog' tizmasi panoramasi",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    rules: [
      "Saunadan foydalanish qoidalariga rioya qiling",
      "Guruhli tadbirlar ma'muriyat bilan oldindan kelishilishi kerak"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Duplex kottej foni", sortOrder: 1 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", caption: "Shaxsiy sauna va vanna", sortOrder: 2 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 6, name: "O'tinli haqiqiy kamin", icon: "Flame", category: "Hashamat" },
      { id: 7, name: "Shaxsiy gidromassajli vanna (Jacuzzi)", icon: "Bath", category: "Vanna" },
      { id: 9, name: "Shaxsiy ochiq terras / Balkon", icon: "Sun", category: "Tashqi" },
      { id: 10, name: "L'Occitane premium parvarish vositalari", icon: "Sparkles", category: "Vanna" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  },
  {
    id: 5,
    slug: "standard-forest-room",
    name: "Standard Forest Room",
    category: "Standard",
    shortDescription: "Shinam va qulay, toza archazor qarag'aylari ifori ufurib turgan qulay standart xona.",
    description: "Yakka sayohatchilar yoki juftliklar uchun ajoyib tanlov. Xonada sifatli ortopedik matras, ish stoli, yuqori tezlikdagi simsiz internet va zamonaviy dush kabinasi mavjud. Barcha zaruriy gigiyena to'plamlari taqdim etiladi.",
    pricePerNight: 1200000,
    area: 30,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "1 ta King Size yoki 2 ta alohida karavot",
    viewType: "Qarag'ayzor o'rmon manzarasi",
    coverImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    rules: [
      "Xonada tamaki chekish taqiqlanadi",
      "Bekor qilish: 24 soat oldin bepul"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", caption: "Standart xona interyeri", sortOrder: 1 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 11, name: "Paxta xalat va shippaklar", icon: "Shirt", category: "Qulaylik" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  },
  {
    id: 6,
    slug: "family-forest-cottage",
    name: "Family Forest Cottage",
    category: "Family",
    shortDescription: "Oila a'zolari bilan osoyishta tog' qo'ynida dam olish uchun mo'ljallangan 2 xonali kottej.",
    description: "Bolali oilalar uchun juda qulay kottej. Ota-onalar uchun alohida yotoqxona va bolalar uchun 2 ta alohida to'shakli xona mavjud. Kottej oldida xavfsiz chimzor va bolalar maydonchasiga qulay chiqish yo'lagi bor.",
    pricePerNight: 3400000,
    area: 78,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
    bedType: "1 ta King Size + 2 ta bir kishilik karavot",
    viewType: "O'rmon va bolalar hududi manzarasi",
    coverImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    isAvailable: true,
    breakfastIncluded: true,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    rules: [
      "Bolalar uchun qo'shimcha beshik so'rov bo'yicha bepul taqdim etiladi",
      "Chekish man etiladi"
    ],
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80", caption: "Family kottej zali", sortOrder: 1 }
    ],
    amenities: [
      { id: 1, name: "Tezkor Wi-Fi", icon: "Wifi", category: "Texnologiya" },
      { id: 2, name: "Smart TV 55\" & Netflix", icon: "Tv", category: "Texnologiya" },
      { id: 3, name: "Iqlim nazorati & Isitish", icon: "Snowflake", category: "Qulaylik" },
      { id: 4, name: "Nespresso qahva & Choy to'plami", icon: "Coffee", category: "Taom" },
      { id: 5, name: "Tog' va archazor panoramasi", icon: "Mountain", category: "Manzara" },
      { id: 9, name: "Shaxsiy ochiq terras / Balkon", icon: "Sun", category: "Tashqi" },
      { id: 10, name: "L'Occitane premium parvarish vositalari", icon: "Sparkles", category: "Vanna" },
      { id: 11, name: "Paxta xalat va shippaklar", icon: "Shirt", category: "Qulaylik" },
      { id: 12, name: "24/7 Room Service & Konsyerj", icon: "Bell", category: "Xizmat" }
    ]
  }
];

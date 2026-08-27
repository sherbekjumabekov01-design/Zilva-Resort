import { SpaService } from '@/types';

export const spaInfo = {
  name: "Zilva Wellness & Mountain SPA",
  tagline: "Tan va ruh uyg'unligi, tog' havosining shifobaxsh kuchi",
  description: "Zilva SPA majmuasi — zamonaviy gidroterapiya, Fin yog'och saunasi, an'anaviy sharqona hammom va professional massaj amaliyotlari bilan to'liq dam olishni ta'minlaydi. Yil bo'yi 29°C haroratda saqlanadigan panoramali yopiq hovuzdan tog' qorlari va archazor go'zalligini tomosha qilishingiz mumkin.",
  workingHours: "Har kuni: 08:00 – 22:00",
  poolTemp: "29°C (Yil bo'yi isitiladi)",
  phone: "+998 78 113 00 88",
  features: [
    "Panoramik oynali isitiladigan yopiq hovuz (25m)",
    "Tabiiy kedr yog'ochidan Fin saunasi",
    "Marmar toshli sharqona Turk hammomi",
    "Gidromassajli jakuzi zallari",
    "Professional massaj va tana parvarishi",
    "Tog' manzarali fitnes va yoga zali",
    "Shifobaxsh fito-bar va o'tli damlamalar"
  ]
};

export const spaServices: SpaService[] = [
  {
    id: 1,
    name: "Panoramali Yopiq Isitiladigan Hovuz",
    category: "pool",
    shortDescription: "Tog' cho'qqilariga qarab suzish imkoniyatini beruvchi 25 metrlik isitiladigan hovuz.",
    description: "Hovuz suvi zamonaviy ko'p bosqichli kumush va kislorodli filtrlash tizimidan o'tadi. Harorat doimo 29°C darajada qulay saqlanadi. Yon atrofida shinam shezlonglar va dam olish zonalari mavjud.",
    isIncluded: true,
    workingHours: "08:00 – 22:00",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    features: ["Harorat: 29°C", "Chuqurlik: 1.4m – 1.9m", "Bolalar xavfsiz zonasi", "Barcha mehmonlar uchun bepul"]
  },
  {
    id: 2,
    name: "Kedr Yog'ochli Fin Saunasi",
    category: "sauna",
    shortDescription: "85–95°C quruq bug' va archa efir moylari bilan tozalanish.",
    description: "Tabiiy tog' archasi va kedr yog'ochidan barpo etilgan an'anaviy fin saunasi tanadagi charchoq va toksinlarni chiqarib yuboradi, qon aylanishini va immunitetni yaxshilaydi.",
    isIncluded: true,
    workingHours: "09:00 – 21:30",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    features: ["Harorat: 90°C", "Tabiiy yog'och bug'i", "Sovuq dush havzasi", "Xona narxiga kiritilgan"]
  },
  {
    id: 3,
    name: "An'anaviy Sharqona Marmar Hammom",
    category: "sauna",
    shortDescription: "Issiq marmar toshlari, yumshoq bug' va ko'pikli piling amaliyoti.",
    description: "Nam va yumshoq 45°C haroratdagi Turk hammomi. Issiq marmar toshlar ustida chuqur relaksatsiya, kessa bilan terini tozalash va zaytun sovunli ko'pikli parvarish.",
    isIncluded: true,
    workingHours: "10:00 – 21:00",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    features: ["Harorat: 45°C", "100% Namlik", "Marmar toshli relaks", "Kese & Piling buyurtma asosida"]
  },
  {
    id: 4,
    name: "Archazor Relaks Massaji",
    category: "massage",
    shortDescription: "Tog' archasi efir moyi bilan tana mushaklarini to'liq bo'shashtiruvchi mualliflik massaji.",
    description: "Sertifikatlangan tajribali massaj ustasi tomonidan amalga oshiriladigan klassik va aromaterapevtik massaj. Butun tana bo'ylab energiya oqimini tiklaydi va qattiqlashgan mushaklarni yozadi.",
    duration: "60 daqiqa",
    price: 450000,
    isIncluded: false,
    workingHours: "10:00 – 21:00",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
    features: ["60 daqiqa", "Archa va lavanda moyi", "Individual yondashuv", "Oldindan yozilish talab qilinadi"]
  },
  {
    id: 5,
    name: "Issiq Toshli Terapiya (Hot Stone)",
    category: "therapy",
    shortDescription: "Vulkanik bazalt toshlarining chuqur isituvchi kuchi bilan og'riqlarni ketkazish.",
    description: "Maxsus qizdirilgan silliq vulqon toshlari tananing faol biologik nuqtalariga joylashtiriladi va chuqur isitish orqali asab tizimini tinchlantiradi.",
    duration: "75 daqiqa",
    price: 550000,
    isIncluded: false,
    workingHours: "11:00 – 21:00",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    features: ["75 daqiqa", "Vulkanik bazalt toshlar", "Stressni ketkazish", "Oldindan yozilish talab qilinadi"]
  },
  {
    id: 6,
    name: "Panoramik Fitnes & Yoga Zali",
    category: "fitness",
    shortDescription: "Eng yangi Technogym trenajyorlari va tog' manzarali yoga maydonchasi.",
    description: "Kardio va kuch ishlatish trenajyorlari, gantellar qatori, fitnes to'plamlari va ertalabki yoga uchun gilamchalar bilan to'liq jihozlangan sport zali.",
    isIncluded: true,
    workingHours: "07:00 – 22:00",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    features: ["Technogym uskunalari", "Tog' panoramasi", "Yoga gilamchalari", "Bepul kirish"]
  }
];

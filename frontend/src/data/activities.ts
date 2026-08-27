import { ActivityItem } from '@/types';

export const activitiesData: ActivityItem[] = [
  {
    id: 1,
    title: "Shaxsiy VIP Kinozal",
    category: "indoor",
    description: "Dolby Atmos ovoz tizimi, ulkan 4K lazer proyektor va yumshoq charm kreslolarga ega 12 kishilik qulay kinozal. Sevimli filmlar, premyeralar yoki sport o'yinlarini do'stlar davrasida tomosha qiling.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "10:00 – 00:00",
    suitableFor: "Barcha mehmonlar, oilalar va do'stlar",
    isFree: true,
    highlights: ["4K Lazer Proyektor", "Dolby Atmos 7.1", "Popkorn & Ichimliklar menyusi", "Oldindan bron qilish mumkin"]
  },
  {
    id: 2,
    title: "PlayStation 5 VIP Lounge",
    category: "indoor",
    description: "Eng so'nggi PS5 konsollari, 65 dyuymli 120Hz OLED ekranlar va FIFA, Mortal Kombat, Gran Turismo, Spider-Man kabi barcha mashhur o'yinlar bilan ta'minlangan o'yin zonasi.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "10:00 – 23:00",
    suitableFor: "Yoshlar, bolalar va geymerlar",
    isFree: true,
    highlights: ["4 ta alohida PS5 stansiyasi", "VR ko'zoynaklari", "Eng yangi 2026 o'yinlar", "Turnirlar tashkil etish"]
  },
  {
    id: 3,
    title: "Stol Tennisi & Bilyard Klubi",
    category: "indoor",
    description: "Professional Donic stol tennisi stollari va 12 futlik klassik rus hamda pul bilyard stollari bilan jihozlangan dam olish zali.",
    image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "09:00 – 23:00",
    suitableFor: "Faol hordiq havaskorlari",
    isFree: true,
    highlights: ["Professional uskunalar", "Yorug' va shinam zal", "Bepul raketka va to'plar"]
  },
  {
    id: 4,
    title: "Tog' va O'rmon Ekspeditsiyalari (Hiking)",
    category: "outdoor",
    description: "Tajribali gid hamrohligida Chimgan etaklaridagi go'zal sharsharalar, archazor tizmalari va tabiiy buloqlarga piyoda sayohatlar.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "Har kuni: 09:30 va 15:00",
    suitableFor: "Tabiat ixlosmandlari va faol sayyohlar",
    isFree: true,
    highlights: ["Maxsus belgilangan xavfsiz so'qmoqlar", "Trek tayoqchalari bepul beriladi", "Gid xizmati"]
  },
  {
    id: 5,
    title: "Kvadrotsikl va Qorda yurish (Mavsumiy)",
    category: "outdoor",
    description: "Adrenalinga to'la tog' so'qmoqlari bo'ylab kuchli 4x4 kvadrotsikllarda (qishda qor avtomobillarida) unutilmas sayrlar.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "10:00 – 18:00",
    suitableFor: "Ekstrim va haydash ishqibozlari",
    isFree: false,
    priceNote: "30 daqiqa — 350 000 so'm",
    highlights: ["To'liq himoya kiyimlari", "Yo'riqnoma va instruktor", "Fotosessiya hududlari"]
  },
  {
    id: 6,
    title: "Oqshom Gulxani & Jonli Musiqa (Bonfire Lounge)",
    category: "relax",
    description: "Har oqshom ochiq osmon ostida, yulduzlar va qulay adyollar bag'rida o'tinli gulxan atrofida suhbatlar, qovurilgan zefirlar va akustik jonli gitara ohanglari.",
    image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "Har juma, shanba, yakshanba: 20:00 – 22:30",
    suitableFor: "Barcha mehmonlar",
    isFree: true,
    highlights: ["Issiq gilamchalar va adyollar", "Glintveyn va issiq shokolad", "Jonli akustik musiqa"]
  },
  {
    id: 7,
    title: "Bolalar Eko-O'yingohi & Ijodiy Master-klasslar",
    category: "kids",
    description: "Yog'ochdan barpo etilgan xavfsiz eko maydoncha, labirintlar, qumloq va professional animatorlar nazorati ostida qiziqarli mashg'ulotlar.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
    timeSlot: "09:00 – 20:00",
    suitableFor: "3 yoshdan 12 yoshgacha bo'lgan bolalar",
    isFree: true,
    highlights: ["Tabiiy materiallardan maydoncha", "Professional animatorlar", "Rasm chizish va loydan yasash darslari"]
  }
];

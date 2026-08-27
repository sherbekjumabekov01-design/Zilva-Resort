import { EventService } from '@/types';

export const eventsData: EventService[] = [
  {
    id: 1,
    title: "Konferensiyalar & Biznes Forumlar",
    subtitle: "Tog' manzarali zamonaviy multimedia anjumanlar zali",
    capacity: "20 kishidan 120 kishigacha",
    description: "Biznes uchrashuvlar, strategik sessiyalar va seminarlar uchun eng zamonaviy texnik uskunalar, yuqori tezlikdagi internet va qulay ergonomik mebellar bilan jihozlangan zal.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    equipment: [
      "4K Lazer Proyektor va 150 dyuymli ekran",
      "Shure simsiz mikrofonlar tizimi",
      "Gibrid zoom konferensiya video-kameralari",
      "Kofe-breyk va maxsus tushlik menyusi",
      "Spikerlar uchun alohida prezenter pulti va minbar"
    ],
    idealFor: ["Yillik strategik yig'ilishlar", "Kompaniya direktorlar kengashi", "Trening va mahorat darslari"]
  },
  {
    id: 2,
    title: "Korporativ Dam Olish & Team Building",
    subtitle: "Jamoani birlashtiruvchi faol va unutilmas hordiq",
    capacity: "15 kishidan 80 kishigacha",
    description: "Kompaniya xodimlarining birdamligini oshirish uchun tog' so'qmoqlarida kvestlar, sport musobaqalari, ochiq havoda BBQ kechalari va gulxan atrofida jamoaviy o'yinlar.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    equipment: [
      "Maxsus team-building kvest dasturlari",
      "Sport anjomlari va musobaqa zallari",
      "Ochiq havoda BBQ va shohona banket",
      "DJ va audio apparatura",
      "Professional foto va video suratga olish"
    ],
    idealFor: ["IT jamoalari va kompaniyalar", "Kompaniya yubileylari", "Muvaffaqiyatli loyihalarni nishonlash"]
  },
  {
    id: 3,
    title: "To'y, Marosim va Yubiley Banketlari",
    subtitle: "Ertakmonand tabiat qo'ynida eng qadrli kunlar tantanasi",
    capacity: "30 kishidan 150 kishigacha",
    description: "Tog' cho'qqilarining betakror manzarasi, gullar bilan bezatilgan ark, nafis servis va mohir oshpazlarimizning maxsus bayramona taomlari.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    equipment: [
      "Ochiq havoda ramziy nikoh maydonchasi",
      "Professional konsert yoritish va ovoz tizimi",
      "Kelin-kuyov uchun alohida lyuks kottej sovg'a",
      "Yulduzli mushakbozlik ruxsati",
      "Banket menyusi va shirinliklar furgoni"
    ],
    idealFor: ["Nafis to'ylar va nikoh oqshomi", "Tug'ilgan kun va yubileylar", "Oilaviy qutlug' tantanalar"]
  }
];

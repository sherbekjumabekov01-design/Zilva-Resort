import { MenuItem } from '@/types';

export const restaurantInfo = {
  name: "Zilva Panoramic Restaurant & Terrace",
  tagline: "Tabiat quchog'idagi nozik ta'mlar va mahorat",
  description: "Zilva restorani — mahalliy tog' masalliqlari, milliy o'zbek mehmondo'stligi va zamonaviy Yevropa oshpazlik an'analarini birlashtirgan panoramik maskan. Vitraj derazalar orqali quyosh botishi va o'rmon manzarasi hamrohligida mualliflik taomlaridan bahramand bo'ling.",
  workingHours: "Har kuni: 07:30 – 23:00",
  breakfastHours: "07:30 – 10:30 (Shved stoli)",
  lunchHours: "12:30 – 16:00 (A la Carte)",
  dinnerHours: "18:00 – 23:00 (A la Carte & Grill)",
  phone: "+998 78 113 00 88",
  telegram: "https://t.me/zilvaresort",
  atmosphereImages: [
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", title: "Panoramik asosiy zal" },
    { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", title: "Ochiq yozgi terassa" },
    { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80", title: "Lounge bar va kamin zonasi" },
    { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80", title: "Shohona kechki taom muhiti" }
  ]
};

export const menuCategories = [
  { id: 'all', name: 'Barcha menyu' },
  { id: 'breakfast', name: 'Nonushtalar' },
  { id: 'main', name: 'Asosiy taomlar' },
  { id: 'grill', name: 'Tog\' go\'shtlari & Grill' },
  { id: 'dessert', name: 'Shirinliklar' },
  { id: 'drinks', name: 'Mualliflik ichimliklari' }
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Tog'li Alpin Nonushtasi",
    category: "breakfast",
    description: "Tuxum bulyon, yangi qaymoq, tog' asali, mahalliy pishloqlar, qarsildoq non va quritilgan mevalar",
    price: 110000,
    weight: "450g",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    isChefSpecial: true
  },
  {
    id: 2,
    name: "Benedikt Tuxumi Losos bilan",
    category: "breakfast",
    description: "Briosh nonida pashot tuxumlari, yengil tuzlangan losos va Golland sousi",
    price: 135000,
    weight: "320g",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Zilva Mualliflik Ribay Steyki",
    category: "grill",
    description: "Archazor o'tlarida marinadlangan qora mola go'shti, grill sabzavotlar va qizil vino sousi",
    price: 290000,
    weight: "380g",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    isChefSpecial: true
  },
  {
    id: 4,
    name: "Tog' Qozon Kabobi",
    category: "grill",
    description: "Maxsus quyilgan qozonda qarsildoq qovurilgan yosh qo'zichoq go'shti va tillarang kartoshka",
    price: 210000,
    weight: "450g",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    isChefSpecial: true
  },
  {
    id: 5,
    name: "O'rmon Qo'ziqorinli Risotto",
    category: "main",
    description: "Arborio guruchi, oq qo'ziqorinlar, parmezan pishlog'i va tryufel yog'i nafasi",
    price: 145000,
    weight: "320g",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Grillda pishirilgan Tog' Foreli",
    category: "main",
    description: "Chorvoq tog' oqimi foreli, limon-zaytun sirkasi, yangi ko'katlar va kous-kous",
    price: 185000,
    weight: "400g",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Archazor Karamelli Fondan",
    category: "dessert",
    description: "Issiq oquvchan shokoladli keks, vanilli muzqaymoq va tog' malinasi sousi",
    price: 75000,
    weight: "180g",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isChefSpecial: true
  },
  {
    id: 8,
    name: "San-Sebastian Pishloqli Kek",
    category: "dessert",
    description: "Ispan uslubidagi kuydirilgan kremli chizkeyk, qora shokolad ganashi bilan",
    price: 80000,
    weight: "200g",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Tog' O'tlari va Archa Choyi",
    category: "drinks",
    description: "Kiyiko't, yalpiz, na'matak, archa urug'lari va tog' asalidan damlangan shifobaxsh choy",
    price: 55000,
    weight: "800ml",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    isChefSpecial: true
  },
  {
    id: 10,
    name: "Zilva Zanjabil & Sitrus Limonadi",
    category: "drinks",
    description: "Yangi siqilgan apelsin, laym sharbati, zanjabil damlamasi va rozmarin",
    price: 60000,
    weight: "1000ml",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
  }
];

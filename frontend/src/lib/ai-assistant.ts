import { fallbackRooms } from '@/data/rooms';
import { siteSettings } from '@/data/site-settings';

export interface AiResponse {
  text: string;
  action?: {
    type: 'booking' | 'call' | 'telegram';
    label: string;
  };
}

// Normalize text for flexible Uzbek/Russian/English matching
function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .replace(/['`ʻʼ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if query is related to Zilva Resort or resort hospitality topics
function isResortRelated(normalized: string): boolean {
  // Resort domain keywords
  const resortKeywords = [
    // Uzbek
    'zilva', 'resort', 'kurort', 'maskan', 'dam', 'hordiq', 'tog', 'togda', 'chimgan', 'chorvoq',
    'xona', 'hona', 'kottej', 'chalet', 'villa', 'suite', 'lyuks', 'narx', 'narxi', 'narxlar',
    'pul', 'qancha', 'nechpul', 'nechi', 'som', 'qimmat', 'arzon', 'eng', 'bron', 'band',
    'hovuz', 'basseyn', 'baseyn', 'suv', 'spa', 'sauna', 'hammom', 'jakuzi', 'massaj', 'issiq',
    'taom', 'ovqat', 'restoran', 'nonushta', 'shved', 'kabob', 'steyk', 'shirinlik', 'choy', 'kofe',
    'menyu', 'halol', 'lunch', 'dinner', 'breakfast',
    'kino', 'kinozal', 'ps5', 'playstation', 'o‘yin', 'oyun', 'bilyard', 'tennis', 'kvadrotsikl', 'atv',
    'hiking', 'sayr', 'soqmoq', 'sharshara', 'gid', 'gulxan', 'bolalar', 'maydoncha', 'animator',
    'konferensiya', 'korporativ', 'toy', 'banket', 'tadbir', 'seminar',
    'kirish', 'chiqish', 'vaqt', 'soat', 'check-in', 'checkin', 'checkout', 'chekish', 'sigaret',
    'hayvon', 'it', 'mushuk', 'tinchlik', 'bekor', 'wifi', 'internet', 'parking', 'avtoturargoh',
    'manzil', 'lokatsiya', 'qayerda', 'qatta', 'qayer', 'yetib', 'borish', 'boriladi', 'masofa',
    'yo‘l', 'yol', 'marshrut', 'transfer', 'taksi', 'toshkentdan', 'aloqa', 'telefon', 'nomer',
    'nomeri', 'admin', 'menejer', 'telegram', 'ob-havo', 'havo', 'qor', 'yomgir', 'harorat',
    'tolov', 'to‘lov', 'click', 'payme', 'uzum', 'karta', 'avans', 'depozit', 'naqd', 'katalog',
    'bormi', 'bormi?', 'qanaqa', 'qaysi', 'sharoit', 'xizmat', 'afzallik',
    'salom', 'assalom', 'assalomu', 'qalaysiz', 'rahmat', 'tashakkur', 'hayrli',

    // Russian
    'зильва', 'резорт', 'отдых', 'горы', 'чимган', 'чарвак', 'номер', 'коттедж', 'вилла', 'шале',
    'люкс', 'цена', 'стоимость', 'дорогой', 'дешевый', 'бронь', 'забронировать',
    'бассейн', 'спа', 'сауна', 'хаммам', 'джакузи', 'массаж', 'горячий', 'вода',
    'еда', 'ресторан', 'завтрак', 'шведский', 'меню', 'халяль', 'шашлык', 'стейк',
    'кинотеатр', 'кино', 'плейстейшн', 'бильярд', 'теннис', 'квадроцикл', 'поход', 'хайкинг', 'костер',
    'дети', 'детская', 'мероприятие', 'конференция', 'корпоратив', 'свадьба',
    'заезд', 'выезд', 'время', 'курение', 'животные', 'собака', 'кошка', 'вайфай', 'интернет', 'парковка',
    'адрес', 'локация', 'где', 'доехать', 'добраться', 'расстояние', 'трансфер', 'такси',
    'контакт', 'телефон', 'админ', 'менеджер', 'погода', 'оплата', 'карта', 'клик', 'пайми',
    'привет', 'здравствуйте', 'спасибо',

    // English
    'hotel', 'stay', 'mountains', 'room', 'cottage', 'villa', 'chalet', 'price', 'rate', 'cost',
    'expensive', 'cheap', 'cheapest', 'book', 'booking', 'pool', 'swimming', 'sauna', 'hammam',
    'jacuzzi', 'massage', 'food', 'restaurant', 'breakfast', 'buffet', 'menu', 'halal',
    'cinema', 'playstation', 'billiards', 'quad', 'hiking', 'bonfire', 'kids', 'playground',
    'event', 'conference', 'wedding', 'check-in', 'check-out', 'rules', 'smoking', 'pets', 'wifi',
    'address', 'location', 'directions', 'transfer', 'phone', 'contact', 'weather', 'payment', 'pay'
  ];

  return resortKeywords.some(keyword => normalized.includes(keyword));
}

// Detect language from text
function detectLanguage(text: string, currentLang: 'UZ' | 'RU' | 'EN'): 'UZ' | 'RU' | 'EN' {
  const ruPattern = /[а-яё]/i;
  const enPattern = /\b(what|where|how|who|when|which|is|are|the|room|rooms|price|cottage|spa|pool|cost|cheap|expensive)\b/i;
  
  if (ruPattern.test(text)) return 'RU';
  if (enPattern.test(text)) return 'EN';
  return currentLang || 'UZ';
}

export function processAiConciergeQuery(query: string, currentLang: 'UZ' | 'RU' | 'EN' = 'UZ'): AiResponse {
  const norm = normalizeQuery(query);
  const lang = detectLanguage(query, currentLang);

  // 1. Salutations / Greetings
  if (
    norm === 'salom' ||
    norm.startsWith('salom') ||
    norm.includes('assalomu alaykum') ||
    norm.includes('assalom') ||
    norm.includes('qalaysiz') ||
    norm.includes('hayrli kun') ||
    norm.includes('привет') ||
    norm.includes('здравствуйте') ||
    norm.includes('добрый день') ||
    norm === 'hello' ||
    norm.startsWith('hi ') ||
    norm === 'hi' ||
    norm.includes('good morning')
  ) {
    if (lang === 'RU') {
      return {
        text: `Здравствуйте! Рады приветствовать вас в **Zilva Resort & Spa** 🌲✨\n\nЯ ваш виртуальный горный консьерж. Я могу подробно рассказать о:\n• 🏡 Номерах, коттеджах и актуальных ценах\n• 🧖 Теплом бассейне 29°C, финской сауне и SPA\n• 🍽️ Панорамном ресторане и меню\n• 🎯 Развлечениях (VIP кинозал, PS5, квадроциклы, хайкинг)\n• 🚗 Маршруте из Ташкента и трансфере\n\nО чем бы вы хотели узнать?`,
        action: { type: 'booking', label: 'Посмотреть номера' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `Hello and welcome to **Zilva Resort & Spa** 🌲✨\n\nI am your AI Mountain Concierge. I can assist you with:\n• 🏡 Luxury cottages, suites, and current rates\n• 🧖 Heated 29°C pool, cedar Finnish sauna & SPA\n• 🍽️ Panoramic restaurant & gourmet dining\n• 🎯 Activities (4K Cinema, PS5 Lounge, Quad bikes, Guided hiking)\n• 🚗 Location, directions & private transfer\n\nHow can I help you today?`,
        action: { type: 'booking', label: 'Explore Rooms' }
      };
    }
    return {
      text: `Assalomu alaykum! **Zilva Resort & Spa** tog' dam olish maskaniga xush kelibsiz 🌲✨\n\nMen sizning 24/7 shaxsiy AI konsyerjingizman. Quyidagi ma'lumotlarni berishim mumkin:\n• 🏡 Xonalar, shaletlar va ularning narxlari\n• 🧖 Yil bo'yi 29°C issiq hovuz, Fin saunasi va SPA\n• 🍽️ Restoran, shved stoli nonushta va menyu\n• 🎯 Ko'ngilochar xizmatlar (VIP Kinozal, PS5, Kvadrotsikl, Hiking)\n• 🚗 Toshkentdan borish yo'li va transfer\n\nSizga qaysi ma'lumot qiziq?`,
      action: { type: 'booking', label: 'Xonalar bilan tanishish' }
    };
  }

  // 2. Strict Project Domain Filtering
  // If the question has nothing to do with Zilva Resort, hospitality, nature, booking, travel, decline politely!
  if (!isResortRelated(norm)) {
    if (lang === 'RU') {
      return {
        text: `Извините, я специализированный ИИ-консьерж горного курорта **Zilva Resort & Spa** 🏔️\n\nЯ отвечаю исключительно на вопросы о нашем курорте, номерах, ценах, SPA-комплексе, ресторане, развлечениях и бронировании.\n\nЗадайте любой вопрос о Zilva Resort (например: *"какой самый дорогой номер?"*, *"какая температура в бассейне?"*, *"как доехать?"*)!`,
        action: { type: 'telegram', label: 'Связаться с менеджером' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `I apologize, but as the dedicated AI Concierge for **Zilva Resort & Spa**, I can only answer questions related to our mountain resort, accommodations, amenities, dining, activities, and reservations 🏔️\n\nPlease feel free to ask anything about Zilva Resort (e.g., *"What is the most expensive room?"*, *"Tell me about the heated pool"*, *"How to get there?"*)!`,
        action: { type: 'telegram', label: 'Contact Manager' }
      };
    }
    return {
      text: `Kechirasiz, men faqat **Zilva Resort & Spa** tog' kurorti bo'yicha maxsus yordamchiman 🏔️🌲\n\nMen faqat kurortimiz xizmatlari, xonalar, narxlar, issiq hovuz, SPA, restoran, ko'ngilochar mashg'ulotlar va bron qilishga oid savollarga javob bera olaman.\n\nZilva Resort haqida nimalarni bilmoqchisiz? (Masalan: *"Eng qimmat xona qaysi?"*, *"Issiq hovuz qanday ishlaydi?"*, *"Toshkentdan qanday boriladi?"*)`,
      action: { type: 'telegram', label: "Menejer bilan bog'lanish" }
    };
  }

  // 3. MOST EXPENSIVE ROOM (User's specific test case!)
  if (
    (norm.includes('qimmat') && (norm.includes('eng') || norm.includes('hona') || norm.includes('xona') || norm.includes('kottej') || norm.includes('qaysi'))) ||
    norm.includes('самый дорог') ||
    norm.includes('дорогие') ||
    norm.includes('most expensive') ||
    norm.includes('highest price')
  ) {
    if (lang === 'RU') {
      return {
        text: `👑 Самый роскошный и дорогой коттедж в Zilva Resort — это **Executive Duplex Chalet**:\n\n• **Цена:** 6 200 000 сум / ночь\n• **Вместимость:** до 8 гостей (площадь 130 м²)\n• **Особенности:**\n  — 3 просторные спальни с кроватями King Size\n  — Собственная встроенная финская сауна\n  — Настоящий дровяной камин в гостиной\n  — Гидромассажная джакузи с панорамой гор\n  — Личная терраса с зоной барбекю\n  — 24/7 VIP консьерж-сервис\n• **Включено:** завтрак (шведский стол), посещение большого SPA-комплекса и бассейна.`,
        action: { type: 'booking', label: 'Забронировать Duplex Chalet' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `👑 The most luxurious and highest-tier accommodation at Zilva Resort is the **Executive Duplex Chalet**:\n\n• **Rate:** 6,200,000 UZS / night\n• **Capacity:** Up to 8 guests (130 m²)\n• **Highlights:**\n  — 3 private King Size bedrooms\n  — In-chalet private Finnish sauna\n  — Authentic wood-burning fireplace in living room\n  — Panoramic mountain view Jacuzzi\n  — Private outdoor terrace & BBQ zone\n  — Dedicated 24/7 VIP concierge\n• **Included:** Daily buffet breakfast and full SPA & heated pool access.`,
        action: { type: 'booking', label: 'Book Duplex Chalet' }
      };
    }
    return {
      text: `👑 Zilva Resort majmuasidagi eng hashamatli va eng qimmat kottej — **Executive Duplex Chalet**:\n\n• **Narxi:** 6 200 000 so'm / kecha\n• **Sig'imi:** 8 nafargacha mehmon (maydoni 130 m²)\n• **Afzalliklari va qulayliklari:**\n  — 3 ta shinam yotoqxona (King Size karavotlar)\n  — Kottej ichida shaxsiy Fin saunasi\n  — Haqiqiy o'tinli kaminli keng mehmonxona\n  — Tog' panoramasiga qaragan gidromassajli jakuzi\n  — Shaxsiy ochiq BBQ terrasasi\n  — 24/7 VIP servis va konsyerj\n• **Narx ichida:** shved stoli nonushtasi, 29°C isitiladigan katta tog' hovuzi va SPA majmuasiga bepul kirish mavjud!`,
      action: { type: 'booking', label: 'Duplex Chaletni Bron Qilish' }
    };
  }

  // 4. CHEAPEST ROOM / BUDGET OPTIONS
  if (
    (norm.includes('arzon') && (norm.includes('eng') || norm.includes('xona') || norm.includes('hona') || norm.includes('qaysi') || norm.includes('narx'))) ||
    norm.includes('самый дешев') ||
    norm.includes('бюджетн') ||
    norm.includes('cheapest') ||
    norm.includes('most affordable')
  ) {
    if (lang === 'RU') {
      return {
        text: `🌲 Самый доступный и уютный номер в Zilva Resort — это **Standard Forest Room**:\n\n• **Цена:** 1 200 000 сум / ночь\n• **Вместимость:** 2 гостя (площадь 30 м²)\n• **В номере:** удобная двуспальная кровать King Size (или 2 раздельные), вид на реликтовый арчовый лес, Smart TV 55", Nespresso кофемашина, скоростной Wi-Fi.\n• **Включено:** сытный завтрак (шведский стол), бесплатный доступ в теплый SPA-бассейн (29°C) и финскую сауну!`,
        action: { type: 'booking', label: 'Забронировать Standard' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `🌲 The most affordable and cozy room at Zilva Resort is the **Standard Forest Room**:\n\n• **Rate:** 1,200,000 UZS / night\n• **Capacity:** 2 guests (30 m²)\n• **Features:** King Size bed (or 2 single beds), juniper forest view, 55" Smart TV, Nespresso coffee machine, fast Wi-Fi.\n• **Included:** Free buffet breakfast, 29°C heated mountain pool access, and Finnish cedar sauna!`,
        action: { type: 'booking', label: 'Book Standard Room' }
      };
    }
    return {
      text: `🌲 Zilva Resortdagi eng qulay va eng hamyonbop xona — **Standard Forest Room**:\n\n• **Narxi:** 1 200 000 so'm / kecha\n• **Sig'imi:** 2 kishi (maydoni 30 m²)\n• **Xonada:** King Size to'shak (yoki 2 ta alohida), archazor o'rmoni manzarasi, 55" Smart TV, Nespresso qahva mashinasi, tezkor Wi-Fi.\n• **Narx ichida:** shved stoli nonushtasi, 29°C isitiladigan hovuz va Fin saunasi bepul kiritilgan!`,
      action: { type: 'booking', label: 'Standard Xonani Bron Qilish' }
    };
  }

  // 5. ALL ROOMS & RATES CATALOG
  if (
    norm.includes('barcha xona') ||
    norm.includes('qanaqa xona') ||
    norm.includes('qanday xona') ||
    norm.includes('xonalar narx') ||
    norm.includes('xona narx') ||
    norm.includes('hona narx') ||
    norm.includes('narxlar') ||
    norm.includes('narxi qanaqa') ||
    norm.includes('xona turlari') ||
    norm.includes('kottejlar') ||
    norm.includes('katalog') ||
    norm.includes('все номера') ||
    norm.includes('какие номера') ||
    norm.includes('цены на номера') ||
    norm.includes('прайс') ||
    norm.includes('стоимость номеров') ||
    norm.includes('all rooms') ||
    norm.includes('room rates') ||
    norm.includes('room rate') ||
    norm.includes('room list') ||
    norm.includes('room prices') ||
    norm.includes('room price') ||
    ((norm.includes('xona') || norm.includes('hona') || norm.includes('kottej') || norm.includes('room') || norm.includes('номер')) && (norm.includes('narx') || norm.includes('narh') || norm.includes('pul') || norm.includes('qancha') || norm.includes('necha') || norm.includes('price') || norm.includes('rate') || norm.includes('цен')))
  ) {
    if (lang === 'RU') {
      return {
        text: `🏡 **Категории и цены номеров в Zilva Resort:**\n\n1. **Standard Forest Room** — 1 200 000 сум/ночь (2 гостя, 30 м²)\n2. **Deluxe Mountain View** — 1 800 000 сум/ночь (2 гостя, 42 м², балкон с видом на горы)\n3. **Panoramic Jacuzzi Suite** — 2 700 000 сум/ночь (3 гостя, 58 м², личная джакузи на террасе)\n4. **Family Forest Cottage** — 3 400 000 сум/ночь (5 гостей, 78 м², 2 спальни)\n5. **Luxury Chalet Villa** — 4 500 000 сум/ночь (6 гостей, 95 м², 2 этажа, дровяной камин, BBQ)\n6. **Executive Duplex Chalet** — 6 200 000 сум/ночь (8 гостей, 130 м², сауна, камин, джакузи)\n\n✨ *Во все тарифы включен завтрак (шведский стол), теплый панорамный бассейн и сауна.*`,
        action: { type: 'booking', label: 'Выбрать и забронировать' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `🏡 **Zilva Resort Room Categories & Rates:**\n\n1. **Standard Forest Room** — 1,200,000 UZS/night (2 guests, 30 m²)\n2. **Deluxe Mountain View** — 1,800,000 UZS/night (2 guests, 42 m², mountain view balcony)\n3. **Panoramic Jacuzzi Suite** — 2,700,000 UZS/night (3 guests, 58 m², private terrace Jacuzzi)\n4. **Family Forest Cottage** — 3,400,000 UZS/night (5 guests, 78 m², 2 bedrooms)\n5. **Luxury Chalet Villa** — 4,500,000 UZS/night (6 guests, 95 m², 2-story, fireplace, BBQ)\n6. **Executive Duplex Chalet** — 6,200,000 UZS/night (8 guests, 130 m², private sauna & fireplace)\n\n✨ *All rates include buffet breakfast, heated pool access, and Finnish sauna.*`,
        action: { type: 'booking', label: 'View & Book Rooms' }
      };
    }
    return {
      text: `🏡 **Zilva Resort xonalari va rasmiy narxlari:**\n\n1. **Standard Forest Room** — 1 200 000 so'm/kecha (2 kishi, 30 m²)\n2. **Deluxe Mountain View** — 1 800 000 so'm/kecha (2 kishi, 42 m², tog' panoramali balkon)\n3. **Panoramic Jacuzzi Suite** — 2 700 000 so'm/kecha (3 kishi, 58 m², terassada jakuzi)\n4. **Family Forest Cottage** — 3 400 000 so'm/kecha (5 kishi, 78 m², 2 ta yotoqxona)\n5. **Luxury Chalet Villa** — 4 500 000 so'm/kecha (6 kishi, 95 m², 2 qavatli, kamin, BBQ)\n6. **Executive Duplex Chalet** — 6 200 000 so'm/kecha (8 kishi, 130 m², shaxsiy sauna, kamin, jakuzi)\n\n✨ *Barcha xonalar narxiga shved stoli nonushtasi, 29°C isitiladigan tog' hovuzi va Fin saunasi bepul kiritilgan!*`,
      action: { type: 'booking', label: 'Xonani Tanlash va Bron Qilish' }
    };
  }

  // 6. SPECIFIC ROOM TYPE: DELUXE
  if (norm.includes('deluxe') || norm.includes('delyuks')) {
    const r = fallbackRooms.find(room => room.slug === 'deluxe-mountain-view') || fallbackRooms[0];
    return {
      text: `🏔️ **Deluxe Mountain View**:\n• **Narxi:** ${r.pricePerNight.toLocaleString()} so'm / kecha\n• **Sig'imi:** ${r.maxGuests} kishi (${r.area} m²)\n• **Karavot:** ${r.bedType}\n• **Manzara:** ${r.viewType}\n• **Qulayliklar:** Vitraj oynalar, shinam balkon, Nespresso qahva, 55" Smart TV, L'Occitane parvarish vositalari.\n• **Nonushta va SPA:** Narx ichida bepul taqdim etiladi.`,
      action: { type: 'booking', label: 'Deluxe Xonani Bron Qilish' }
    };
  }

  // 7. SPECIFIC ROOM TYPE: JACUZZI SUITE
  if (norm.includes('jakuzi') || norm.includes('jacuzzi') || norm.includes('джакузи')) {
    return {
      text: `🛁 **Jakuzili xonalarimiz:**\n\n1. **Panoramic Jacuzzi Suite** (2 700 000 so'm/kecha, 3 kishi):\n   — Tog' cho'qqilariga qaragan shaxsiy ochiq terassadagi gidromassajli jakuzi.\n2. **Executive Duplex Chalet** (6 200 000 so'm/kecha, 8 kishi):\n   — Panoramik jakuzi, shaxsiy Fin saunasi va kamin.\n\nJakuzi suvi issiq holda sizning buyurtmangizga asosan tayyorlab qo'yiladi!`,
      action: { type: 'booking', label: 'Jakuzili xonani bron qilish' }
    };
  }

  // 8. SPECIFIC ROOM TYPE: KAMIN / FIREPLACE / CHALET
  if (norm.includes('kamin') || norm.includes('fireplace') || norm.includes('камин') || norm.includes('otin') || norm.includes('o‘tin')) {
    return {
      text: `🔥 **Kaminli shohona kottejlarimiz:**\n\n1. **Luxury Chalet Villa** (4 500 000 so'm/kecha, 6 kishi, 95 m²):\n   — 2 qavatli shalet, haqiqiy o'tinli kamin, 2 ta yotoqxona va shaxsiy BBQ terrasasi.\n2. **Executive Duplex Chalet** (6 200 000 so'm/kecha, 8 kishi, 130 m²):\n   — O'tinli kamin, shaxsiy Fin saunasi va jakuzi.\n\nKamin uchun quruq archa o'tinlari xodimlarimiz tomonidan taqdim etiladi!`,
      action: { type: 'booking', label: 'Kaminli Chaletni bron qilish' }
    };
  }

  // 9. SPECIFIC ROOM TYPE: FAMILY COTTAGE / OILAVIY
  if (norm.includes('oila') || norm.includes('family') || norm.includes('семья') || norm.includes('bolalar bilan')) {
    return {
      text: `👨‍👩‍👧‍👦 **Oilaviy dam olish uchun ideal variantlar:**\n\n• **Family Forest Cottage** (3 400 000 so'm/kecha, 5 kishi, 78 m²):\n  — Ota-onalar uchun alohida yotoqxona, bolalar uchun 2 ta alohida karavotli xona, bolalar eko-maydonchasiga to'g'ridan-to'g'ri chiqish.\n• **Luxury Chalet Villa** (4 500 000 so'm/kecha, 6 kishi, 95 m²):\n  — 2 qavatli keng kottej, kamin va shaxsiy hovli.\n\n*Bolalar uchun beshik (baby cot) so'rov bo'yicha bepul beriladi!*`,
      action: { type: 'booking', label: 'Oilaviy kottejni bron qilish' }
    };
  }

  // 10. HEATED POOL & SPA & SAUNA & MASSAGE
  if (
    norm.includes('hovuz') ||
    norm.includes('basseyn') ||
    norm.includes('baseyn') ||
    norm.includes('spa') ||
    norm.includes('sauna') ||
    norm.includes('hammom') ||
    norm.includes('massaj') ||
    norm.includes('gradus') ||
    norm.includes('harorat') ||
    norm.includes('бассейн') ||
    norm.includes('сауна') ||
    norm.includes('массаж') ||
    norm.includes('pool')
  ) {
    if (lang === 'RU') {
      return {
        text: `🧖 **SPA-комплекс и теплый бассейн Zilva Wellness:**\n\n• **Панорамный бассейн:** 25 метров, закрытый с видом на горы. Температура воды **+29°C круглый год** (глубина 1.4–1.9 м). Бесплатно для проживающих!\n• **Финская кедровая сауна:** 90°C с ароматом горной арчи (бесплатно).\n• **Турецкий хаммам:** мраморный парной зал 45°C (бесплатно).\n• **Массажи:**\n  — Арчовый релакс-массаж (60 мин) — 450 000 сум\n  — Стоун-терапия горячими камнями (75 мин) — 550 000 сум\n• **Режим работы:** ежедневно с 08:00 до 22:00.`,
        action: { type: 'booking', label: 'Забронировать с SPA' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `🧖 **Zilva Wellness & Heated Mountain Pool:**\n\n• **Panoramic Heated Pool:** 25m indoor pool with mountain views. Heated to **29°C year-round** (depth 1.4–1.9m). Free for all staying guests!\n• **Finnish Cedar Sauna:** 90°C dry heat with mountain juniper aromas (included).\n• **Turkish Hammam:** Traditional marble steam room at 45°C (included).\n• **Massages & Therapy:**\n  — Juniper Relax Massage (60 min) — 450,000 UZS\n  — Hot Basalt Stone Therapy (75 min) — 550,000 UZS\n• **Opening Hours:** Daily 08:00 – 22:00.`,
        action: { type: 'booking', label: 'Book with SPA' }
      };
    }
    return {
      text: `🧖 **Zilva Wellness & Mountain SPA majmuasi:**\n\n• **Isitiladigan Panoramik Hovuz:** 25 metrlik tog' manzarali yopiq hovuz. Suv harorati yil bo'yi **29°C issiq** saqlanadi (chuqurligi 1.4m – 1.9m). Mehmonlar uchun bepul!\n• **Kedr Yog'ochli Fin Saunasi:** 90°C archa efir moylari bilan tozalanish (bepul).\n• **Sharqona Marmar Hammom:** 45°C yumshoq bug'li an'anaviy turk hammomi (bepul).\n• **Professional Massajlar:**\n  — Archazor relaks massaji (60 daqiqa) — 450 000 so'm\n  — Issiq vulqon toshli terapiya (75 daqiqa) — 550 000 so'm\n• **Ish vaqti:** Har kuni 08:00 dan 22:00 gacha.`,
      action: { type: 'booking', label: 'SPA xizmatlari bilan bron qilish' }
    };
  }

  // 11. RESTAURANT, FOOD, BREAKFAST & HALAL
  if (
    norm.includes('taom') ||
    norm.includes('ovqat') ||
    norm.includes('restoran') ||
    norm.includes('nonushta') ||
    norm.includes('halol') ||
    norm.includes('halal') ||
    norm.includes('shved') ||
    norm.includes('steyk') ||
    norm.includes('kabob') ||
    norm.includes('baliq') ||
    norm.includes('menyu') ||
    norm.includes('еда') ||
    norm.includes('ресторан') ||
    norm.includes('завтрак') ||
    norm.includes('халяль') ||
    norm.includes('food') ||
    norm.includes('restaurant') ||
    norm.includes('dining')
  ) {
    if (lang === 'RU') {
      return {
        text: `🍽️ **Панорамный ресторан Zilva Restaurant & Terrace:**\n\n• **100% Халяль:** Все блюда готовятся из отборного фермерского горного мяса.\n• **Завтрак:** богатый шведский стол с 07:30 до 10:30 (включен в стоимость проживания).\n• **Популярные блюда меню:**\n  — Фирменный Рибай стейк — 290 000 сум\n  — Горный Казан Кабоб из ягненка — 210 000 сум\n  — Форель на гриле из Чарвака — 185 000 сум\n  — Ризотто с лесными грибами — 145 000 сум\n  — Десерт Сан-Себастьян — 85 000 сум\n• **Часы работы:** ежедневно 07:30 – 23:00 (Room Service 24/7).`,
        action: { type: 'booking', label: 'Забронировать отдых' }
      };
    }
    if (lang === 'EN') {
      return {
        text: `🍽️ **Zilva Panoramic Restaurant & Terrace:**\n\n• **100% Halal:** All dishes are prepared with premium local farm ingredients.\n• **Buffet Breakfast:** Daily 07:30 – 10:30 (included with all room stays).\n• **Chef's Signature Dishes:**\n  — Prime Ribeye Steak — 290,000 UZS\n  — Mountain Lamb Kazan Kebab — 210,000 UZS\n  — Grilled Charvak Mountain Trout — 185,000 UZS\n  — Wild Mushroom Truffle Risotto — 145,000 UZS\n  — San Sebastian Cheesecake — 85,000 UZS\n• **Working Hours:** Daily 07:30 – 23:00 (24/7 Room Service).`,
        action: { type: 'booking', label: 'Reserve Stay' }
      };
    }
    return {
      text: `🍽️ **Zilva Panoramik Restorani & Terassasi:**\n\n• **100% Halol:** Barcha go'sht va taomlarimiz halol sertifikatiga ega.\n• **Nonushta:** Har kuni 07:30 – 10:30 oralig'ida boy shved stoli (barcha xonalar uchun bepul!).\n• **Oshpazimizning sara taomlari:**\n  — Zilva mualliflik Ribay steyki — 290 000 so'm\n  — Tog' qozon kabobi (yosh qo'zi go'shti) — 210 000 so'm\n  — Chorvoq tog' oqimi foreli (grill) — 185 000 so'm\n  — O'rmon qo'ziqorinli risotto — 145 000 so'm\n  — San-Sebastian pishloqli kek — 85 000 so'm\n• **Ish vaqti:** Har kuni 07:30 dan 23:00 gacha (24/7 Xonaga yetkazish / Room service mavjud).`,
      action: { type: 'booking', label: 'Xonani bron qilish' }
    };
  }

  // 12. ENTERTAINMENT & ACTIVITIES (VIP Cinema, PS5, Billiards, Quad Bikes, Hiking, Bonfire)
  if (
    norm.includes('kino') ||
    norm.includes('ps5') ||
    norm.includes('playstation') ||
    norm.includes('bilyard') ||
    norm.includes('tennis') ||
    norm.includes('kvadrotsikl') ||
    norm.includes('atv') ||
    norm.includes('hiking') ||
    norm.includes('sayr') ||
    norm.includes('sharshara') ||
    norm.includes('gulxan') ||
    norm.includes('bonfire') ||
    norm.includes('bolalar') ||
    norm.includes('animator') ||
    norm.includes('развлечен') ||
    norm.includes('кинотеатр') ||
    norm.includes('activity')
  ) {
    if (lang === 'RU') {
      return {
        text: `🎯 **Развлечения и активности в Zilva Resort:**\n\n1. **VIP Кинозал (4K Laser, Dolby Atmos 7.1):** 12 мягких кресел, просмотр кино и матчей — *Бесплатно*\n2. **PlayStation 5 Lounge:** 4 станции PS5 с OLED экранами 120Hz — *Бесплатно*\n3. **Бильярд и настольный теннис:** классический русский бильярд и Donic теннис — *Бесплатно*\n4. **Пешие походы (Hiking):** ежедневные экскурсии к горным водопадам с гидом в 09:30 и 15:00 — *Бесплатно*\n5. **Вечерний костер (Bonfire Lounge):** живая акустическая гитара и маршмеллоу (Пт-Вс 20:00) — *Бесплатно*\n6. **Детская эко-площадка:** с аниматорами и мастер-классами — *Бесплатно*\n7. **Квадроциклы 4x4:** 30 мин — 350 000 сум (с экипировкой и инструктором).`,
        action: { type: 'booking', label: 'Забронировать отдых' }
      };
    }
    return {
      text: `🎯 **Zilva Resortdagi ko'ngilochar xizmatlar va mashg'ulotlar:**\n\n1. **VIP Kinozal (4K Lazer, Dolby Atmos 7.1):** 12 o'rinli qulay charm kreslolar — *Mehmonlarga Bepul*\n2. **PlayStation 5 VIP Lounge:** 4 ta PS5 stansiyasi, FIFA, Mortal Kombat — *Mehmonlarga Bepul*\n3. **Bilyard & Stol Tennisi:** Professional rus bilyardi va Donic tennisi — *Bepul*\n4. **Tog' va Sharsharalarga Hiking:** Har kuni 09:30 va 15:00 da gid bilan piyoda sayohat — *Bepul*\n5. **Oqshom Gulxani (Bonfire Lounge):** Juma-Yakshanba 20:00 da gulxan atrofida jonli gitara va glintveyn — *Bepul*\n6. **Bolalar Eko-O'yingohi:** Professional animatorlar va mahorat darslari — *Bepul*\n7. **4x4 Kvadrotsikllar:** Tog' so'qmoqlarida sayr (30 daqiqa — 350 000 so'm).`,
      action: { type: 'booking', label: 'Xonani bron qilish' }
    };
  }

  // 13. LOCATION, DIRECTIONS, ADDRESS & TRANSFER
  if (
    norm.includes('manzil') ||
    norm.includes('qayer') ||
    norm.includes('qatta') ||
    norm.includes('lokatsiya') ||
    norm.includes('yetib') ||
    norm.includes('boriladi') ||
    norm.includes('borish') ||
    norm.includes('masofa') ||
    norm.includes('marshrut') ||
    norm.includes('transfer') ||
    norm.includes('taksi') ||
    norm.includes('toshkentdan') ||
    norm.includes('адрес') ||
    norm.includes('где') ||
    norm.includes('доехать') ||
    norm.includes('как добраться') ||
    norm.includes('location') ||
    norm.includes('direction') ||
    norm.includes('address')
  ) {
    if (lang === 'RU') {
      return {
        text: `📍 **Расположение и как добраться до Zilva Resort:**\n\n• **Адрес:** Ташкентская область, Бостанлыкский район, горный массив Чимган, ул. Арчазор 14 (высота 1 850 м над уровнем моря).\n• **Расстояние от Ташкента:** 92 км (~1 час 20 минут по новой асфальтированной трассе).\n• **От Чарвакского водохранилища:** 18 км (20 минут).\n• **Навигатор:** В Яндекс Навигаторе и Google Maps введите **"Zilva Resort Chimgan"**.\n• **Трансфер:** Доступен индивидуальный трансфер на комфортабельных авто бизнес-класса и минивэнах из Ташкента (по предварительному заказу через менеджера).`,
        action: { type: 'telegram', label: 'Открыть локацию в Telegram' }
      };
    }
    return {
      text: `📍 **Zilva Resort manzili va qanday borish:**\n\n• **Manzil:** Toshkent viloyati, Bo'stonliq tumani, Chimgan tog' massivi, Archazor yo'li 14-uy (dengiz sathidan 1 850 metr balandlikda).\n• **Toshkent shahridan masofa:** 92 km (tekis asfaltlangan yangi trassa orqali 1 soat 20 daqiqa).\n• **Chorvoq suv omboridan:** 18 km (20 daqiqa).\n• **Navigatsiya:** Yandex Navigator yoki Google Xaritalarda **"Zilva Resort Chimgan"** deb qidirsangiz, to'g'ri darvozamiz oldiga olib keladi.\n• **Individual Transfer:** Toshkentdan qulay biznes-klass yoki mikroavtobusda transfer tashkil qilib berishimiz mumkin (Menejer bilan kelishiladi).`,
      action: { type: 'telegram', label: 'Lokatsiyani Telegramda olish' }
    };
  }

  // 14. CHECK-IN / CHECK-OUT, RULES, PETS, SMOKING, CANCELLATION, WIFI
  if (
    norm.includes('kirish') ||
    norm.includes('chiqish') ||
    norm.includes('check-in') ||
    norm.includes('checkin') ||
    norm.includes('checkout') ||
    norm.includes('soat nechida') ||
    norm.includes('qoida') ||
    norm.includes('chekish') ||
    norm.includes('sigaret') ||
    norm.includes('hayvon') ||
    norm.includes('it') ||
    norm.includes('mushuk') ||
    norm.includes('wifi') ||
    norm.includes('internet') ||
    norm.includes('bekor') ||
    norm.includes('заезд') ||
    norm.includes('выезд') ||
    norm.includes('правила') ||
    norm.includes('курение') ||
    norm.includes('животные')
  ) {
    if (lang === 'RU') {
      return {
        text: `📋 **Правила проживания в Zilva Resort:**\n\n• **Время заезда (Check-in):** с 14:00 (для шале с 15:00)\n• **Время выезда (Check-out):** до 12:00\n• **Wi-Fi:** бесплатный высокоскоростной оптоволоконный интернет на всей территории\n• **Курение:** в номерах курение строго запрещено (разрешено на открытых террасах)\n• **Питомцы:** проживание с воспитанными собаками мелких пород возможно по согласованию с администрацией\n• **Бесплатная отмена:** за 48–72 часа до даты заезда\n• **Режим тишины:** с 23:00 до 08:00.`,
        action: { type: 'booking', label: 'Забронировать номер' }
      };
    }
    return {
      text: `📋 **Zilva Resortda joylashish va asosiy qoidalar:**\n\n• **Kirish vaqti (Check-in):** 14:00 dan (Shaletlar uchun 15:00 dan)\n• **Chiqish vaqti (Check-out):** 12:00 gacha\n• **Wi-Fi:** Barcha xonalar va hovli bo'ylab yuqori tezlikdagi bepul optik tolali internet\n• **Chekish:** Xonalar ichida tamaki chekish qat'iyan man etiladi (ochiq terassalarda ruxsat berilgan)\n• **Uy hayvonlari:** Kichik va tarbiyalangan uy hayvonlari bilan kelish oldindan ma'muriyat bilan kelishiladi\n• **Bepul bekor qilish:** Tashrifdan 48–72 soat oldin bepul bekor qilinadi\n• **Tinchlik soatlari:** 23:00 dan 08:00 gacha.`,
      action: { type: 'booking', label: 'Xonani bron qilish' }
    };
  }

  // 15. PAYMENT, BOOKING PROCESS & GUARANTEE
  if (
    norm.includes('tolov') ||
    norm.includes('to‘lov') ||
    norm.includes('click') ||
    norm.includes('payme') ||
    norm.includes('uzum') ||
    norm.includes('karta') ||
    norm.includes('avans') ||
    norm.includes('depozit') ||
    norm.includes('bron') ||
    norm.includes('qanday bron') ||
    norm.includes('оплата') ||
    norm.includes('как забронировать') ||
    norm.includes('payment')
  ) {
    if (lang === 'RU') {
      return {
        text: `💳 **Условия оплаты и бронирования:**\n\n• Бронирование оформляется онлайн за 1 минуту прямо на сайте.\n• Для 100% гарантии брони вносится предоплата **20%** через Click, Payme, Uzum Bank, Visa или Mastercard.\n• Оставшиеся 80% оплачиваются при заселении (картой или наличными).\n• После оформления вы получаете электронный ваучер-подтверждение с QR-кодом.`,
        action: { type: 'booking', label: 'Оформить бронь онлайн' }
      };
    }
    return {
      text: `💳 **To'lov va bron qilish tartibi:**\n\n• Veb-saytimiz orqali xonani 1 daqiqada onlayn bron qilishingiz mumkin.\n• Xonani 100% kafolatli band qilish uchun **20% avans** to'lanadi (Click, Payme, Uzum Bank, Visa, Mastercard orqali).\n• Qolgan 80% to'lovni kurortga yetib kelgach to'lashingiz mumkin.\n• Bron tasdiqlangach, sizga rasmiy elektron vaucher taqdim etiladi.`,
      action: { type: 'booking', label: 'Onlayn Bron Qilish' }
    };
  }

  // 16. EVENTS, CONFERENCES, CORPORATE & WEDDINGS
  if (
    norm.includes('konferensiya') ||
    norm.includes('korporativ') ||
    norm.includes('toy') ||
    norm.includes('to‘y') ||
    norm.includes('banket') ||
    norm.includes('seminar') ||
    norm.includes('team building') ||
    norm.includes('мероприятие') ||
    norm.includes('конференция') ||
    norm.includes('свадьба')
  ) {
    if (lang === 'RU') {
      return {
        text: `🎉 **Организация мероприятий в Zilva Resort:**\n\n• **Конференц-зал (20–120 персон):** 4K Laser проектор 150", микрофоны Shure, гибридный Zoom, кофе-брейки.\n• **Корпоративы и Team Building (15–80 персон):** квесты в горах, BBQ банкет, турниры, костер.\n• **Свадьбы и Юбилеи (30–150 персон):** панорамная арка для выездной регистрации, банкетное меню от шеф-повара, салюты и коттедж для молодоженов в подарок!`,
        action: { type: 'telegram', label: 'Обсудить мероприятие в Telegram' }
      };
    }
    return {
      text: `🎉 **Zilva Resortda tantana va korporativ tadbirlar:**\n\n• **Konferensiya zali (20–120 kishi):** 4K Lazer proyektor, Shure mikrofonlar tizimi, gibrid video-aloqa va kofe-breyk xizmati.\n• **Korporativ va Team Building (15–80 kishi):** Tog' so'qmoqlarida kvestlar, ochiq havoda BBQ banketi va jamoaviy musobaqalar.\n• **To'y va Yubiley Tantanasi (30–150 kishi):** Ertaknamo tog' manzarasi, ramziy nikoh arkasi, nafis banket va kelin-kuyov uchun lyuks shalet sovg'a!`,
      action: { type: 'telegram', label: 'Tadbir bo‘yicha menejerga yozish' }
    };
  }

  // 17. CONTACT, PHONE, TELEGRAM, SOCIALS
  if (
    norm.includes('aloqa') ||
    norm.includes('telefon') ||
    norm.includes('nomer') ||
    norm.includes('raqam') ||
    norm.includes('kontakt') ||
    norm.includes('boglanish') ||
    norm.includes('admin') ||
    norm.includes('menejer') ||
    norm.includes('telegram') ||
    norm.includes('телефон') ||
    norm.includes('контакты') ||
    norm.includes('связаться') ||
    norm.includes('contact') ||
    norm.includes('phone')
  ) {
    if (lang === 'RU') {
      return {
        text: `📞 **Контакты Zilva Resort & Spa:**\n\n• **Круглосуточный телефон:** ${siteSettings.phone}\n• **Мобильный / WhatsApp:** ${siteSettings.phoneSecondary}\n• **Telegram:** @zilvaresort\n• **Email:** ${siteSettings.email}\n• **Администрация:** работает 24/7 без выходных.`,
        action: { type: 'telegram', label: 'Написать менеджеру в Telegram' }
      };
    }
    return {
      text: `📞 **Zilva Resort & Spa rasmiy aloqa ma'lumotlari:**\n\n• **Asosiy telefon:** ${siteSettings.phone}\n• **Mobil / Qabulxona:** ${siteSettings.phoneSecondary}\n• **Telegram kanal & menejer:** @zilvaresort\n• **Email:** ${siteSettings.email}\n• **Qabulxona (Reception):** 24/7 uzluksiz xizmatda.`,
      action: { type: 'telegram', label: "Telegram orqali bog'lanish" }
    };
  }

  // 18. WEATHER & CLIMATE
  if (
    norm.includes('ob-havo') ||
    norm.includes('havo') ||
    norm.includes('qor') ||
    norm.includes('yomgir') ||
    norm.includes('погода') ||
    norm.includes('снег') ||
    norm.includes('weather')
  ) {
    if (lang === 'RU') {
      return {
        text: `☀️ **Погода в урочище Чимган (Zilva Resort, 1 850 м):**\n\nВ горах воздух всегда кристально чистый и свежий с ароматом вековых арчовников. Днем приятная комфортная температура, а вечером — бодрящая горная прохлада. Рекомендуем захватить легкую куртку для вечерних посиделок у костра!`,
        action: { type: 'booking', label: 'Забронировать поездку' }
      };
    }
    return {
      text: `☀️ **Chimgan tog'larida ob-havo (Zilva Resort, 1 850 m):**\n\nKurortimizda havo doimo toza va shifobaxsh archazor ifori bilan boyitilgan. Kunduzi yoqimli iliq, oqshom payti esa salqin va rohatbaxsh bo'ladi. Oqshom gulxani atrofida o'tirish uchun yengil ustki kiyim olib kelishni tavsiya qilamiz!`,
      action: { type: 'booking', label: 'Dam olishni rejalashtirish' }
    };
  }

  // Fallback for general resort inquiry
  if (lang === 'RU') {
    return {
      text: `Спасибо за ваш вопрос! В **Zilva Resort & Spa** вас ждут премиальные коттеджи, теплый круглогодичный бассейн 29°C, панорамный ресторан и активный горный отдых 🏔️\n\nВы можете оформить бронирование онлайн или связаться с нашим администратором для персонального подбора коттеджа.`,
      action: { type: 'telegram', label: 'Написать администратору в Telegram' }
    };
  }
  if (lang === 'EN') {
    return {
      text: `Thank you for your interest! **Zilva Resort & Spa** offers luxury mountain chalets, year-round heated pool (29°C), gourmet dining, and outdoor experiences 🏔️\n\nYou can book online anytime or chat directly with our guest relations manager.`,
      action: { type: 'telegram', label: 'Chat on Telegram' }
    };
  }
  return {
    text: `Savolingiz uchun tashakkur! **Zilva Resort & Spa** majmuasida shinam kottejlar, yil bo'yi 29°C issiq hovuz, nafis tog' restorani va unutilmas hordiq sizni kutmoqda 🏔️\n\nXonani hoziroq onlayn bron qilishingiz yoki menejerimiz bilan bog'lanib, shaxsiy taklif olishingiz mumkin.`,
    action: { type: 'telegram', label: "Menejer bilan Telegramda bog'lanish" }
  };
}

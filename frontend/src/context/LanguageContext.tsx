'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'UZ' | 'RU' | 'EN';

export interface Translations {
  nav: {
    home: string;
    rooms: string;
    restaurant: string;
    spa: string;
    activities: string;
    events: string;
    contact: string;
    bookNow: string;
    admin: string;
    winter: string;
    summer: string;
    weather: string;
    reception: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    bookBtn: string;
    roomsBtn: string;
    statAltitude: string;
    statAltitudeLabel: string;
    statCottages: string;
    statCottagesLabel: string;
    statRating: string;
    statRatingLabel: string;
    statNature: string;
    statNatureLabel: string;
  };
  quickBooking: {
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    roomType: string;
    allRooms: string;
    searchBtn: string;
  };
  featuredRooms: {
    badge: string;
    heading: string;
    viewAll: string;
    perNight: string;
    guests: string;
    book: string;
    details: string;
  };
  about: {
    badge: string;
    heading: string;
    desc1: string;
    desc2: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    learnMore: string;
  };
  spa: {
    badge: string;
    heading: string;
    desc: string;
    feature1: string;
    feature2: string;
    feature3: string;
    moreBtn: string;
  };
  restaurant: {
    badge: string;
    heading: string;
    desc: string;
    breakfast: string;
    breakfastTime: string;
    dinner: string;
    dinnerTime: string;
    menuBtn: string;
  };
  activities: {
    badge: string;
    heading: string;
    desc: string;
    moreBtn: string;
  };
  reviews: {
    badge: string;
    heading: string;
    desc: string;
  };
  location: {
    badge: string;
    heading: string;
    addressLabel: string;
    openMap: string;
  };
  footer: {
    desc: string;
    quickLinks: string;
    contacts: string;
    workingHours: string;
    reception: string;
    restaurant: string;
    spa: string;
    rights: string;
    privacy: string;
    terms: string;
  };
  modal: {
    title: string;
    subtitle: string;
    fullName: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    roomSelect: string;
    specialRequests: string;
    specialRequestsPlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  UZ: {
    nav: {
      home: "Bosh sahifa",
      rooms: "Xonalar",
      restaurant: "Restoran",
      spa: "SPA & Salomatlik",
      activities: "Faoliyatlar",
      events: "Tadbirlar",
      contact: "Aloqa",
      bookNow: "Bron qilish",
      admin: "Admin",
      winter: "QISH",
      summer: "YOZ",
      weather: "Chimgan ob-havosi: +22°C (Musaffo tog' havosi)",
      reception: "24/7 Qabulxona va xizmat"
    },
    hero: {
      badge: "Chimgan Tog'lari Bag'ridagi Dam Olish Maskani",
      titleLine1: "Tabiat Nafasi va",
      titleHighlight: "Nafis Hashamat",
      titleLine2: "Uyg'unligi",
      subtitle: "Chorvoq va Chimgan bag'ridagi purviqor archazorlar qo'ynida sokinlik, shinam yog'och kottejlar, panoramik restoran va isitiladigan SPA hovuzidan bahramand bo'ling.",
      bookBtn: "Xonani Bron Qilish",
      roomsBtn: "Xonalar Katalogi",
      statAltitude: "1 850m",
      statAltitudeLabel: "Dengiz sathidan balandlik",
      statCottages: "24+",
      statCottagesLabel: "Kottej & Lyuks xonalar",
      statRating: "4.9",
      statRatingLabel: "Mehmonlar bahosi (1 200+ sharh)",
      statNature: "100%",
      statNatureLabel: "Tabiiy archazor o'rmoni"
    },
    quickBooking: {
      checkIn: "Kirish sanasi",
      checkOut: "Chiqish sanasi",
      adults: "Kattalar",
      children: "Bolalar",
      roomType: "Xona toifasi",
      allRooms: "Barcha xonalar",
      searchBtn: "Xona qidirish"
    },
    featuredRooms: {
      badge: "Bizning xonalarimiz",
      heading: "Unutilmas dam olish uchun shinam kottejlar",
      viewAll: "Barcha xonalarni ko'rish",
      perNight: "kechasi",
      guests: "kishi",
      book: "Bron qilish",
      details: "Batafsil ma'lumot"
    },
    about: {
      badge: "Zilva Resort haqida",
      heading: "Tog'lar bag'ridagi jannatmonand maskan",
      desc1: "Zilva Resort & Spa — Toshkent viloyati Bo'stonliq tumanining eng go'zal tog'li hududida joylashgan 5 yulduzli dam olish majmuasi.",
      desc2: "Shovqinli shahardan uzoqda, musaffo tog' havosi va asriy archalar soyasida oilaviy yoki do'stlar davrasida unutilmas xotiralarga ega bo'ling.",
      feature1Title: "Shinam Kottejlar",
      feature1Desc: "Toza yog'ochdan qurilgan ekologik kottejlar va panoramik lyuks xonalar.",
      feature2Title: "Isitiladigan Hovuz",
      feature2Desc: "Yil davomida 28-30°C issiq suvli tog' manzarali panoramik hovuz.",
      feature3Title: "Premium Restoran",
      feature3Desc: "Mohir oshpazlarimizdan milliy va yevropa tansiq taomlari.",
      feature4Title: "24/7 Premium Xizmat",
      feature4Desc: "Har bir mehmonga alohida e'tibor va professional xizmat ko'rsatish.",
      learnMore: "Batafsil ma'lumot"
    },
    spa: {
      badge: "SPA & Salomatlik",
      heading: "Tan va ruh uchun haqiqiy uyg'unlik",
      desc: "Fin saunasi, turk hammomi, massaj muolajalari va tog' manzarali panoramik isitiladigan hovuzimizda to'liq dam oling.",
      feature1: "Fin saunasi & Turk hammomi",
      feature2: "Professional massaj & Terapiya",
      feature3: "Isitiladigan tog' hovuzi",
      moreBtn: "SPA xizmatlari bilan tanishish"
    },
    restaurant: {
      badge: "Panoramik Restoran",
      heading: "Tog' manzarasi bag'ridagi lazzatli taomlar",
      desc: "Zilva Restaurant — mualliflik retseptlari asosida tayyorlangan milliy va Yevropa taomlari hamda tog'larning betakror manzarasi.",
      breakfast: "Nonushta (Shved stoli)",
      breakfastTime: "07:30 – 11:00",
      dinner: "Kechki ovqat & Jonli musiqa",
      dinnerTime: "18:00 – 23:00",
      menuBtn: "Restoran menyusi"
    },
    activities: {
      badge: "Faol hordiq",
      heading: "Har bir faslda qiziqarli sarguzashtlar",
      desc: "Qishda chang'i va qor mototsikllari, yozda tog' kvadrotsikllari, piyoda sayohatlar va ot minish mashg'ulotlari.",
      moreBtn: "Barcha faoliyatlar"
    },
    reviews: {
      badge: "Mehmonlarimiz fikri",
      heading: "Zilva Resort haqida nima deyishadi?",
      desc: "Bizning maskanimizda dam olgan mehmonlarning samimiy fikr va taassurotlari."
    },
    location: {
      badge: "Joylashuv",
      heading: "Qanday yetib borish mumkin?",
      addressLabel: "Chimgan tog' massivi, Bo'stonliq tumani, Toshkent viloyati",
      openMap: "Yandex Xaritada ochish"
    },
    footer: {
      desc: "Zilva Resort & Spa — Chimgan va Chorvoq tog' tizmasining purviqor tabiatida joylashgan premium darajadagi dam olish maskani.",
      quickLinks: "Tezkor havolalar",
      contacts: "Bog'lanish",
      workingHours: "Ish vaqti",
      reception: "Qabulxona: 24/7",
      restaurant: "Restoran: 07:30 – 23:00",
      spa: "SPA: 08:00 – 22:00",
      rights: "Barcha huquqlar himoyalangan.",
      privacy: "Maxfiylik siyosati",
      terms: "Foydalanish shartlari"
    },
    modal: {
      title: "Xonani bron qilish",
      subtitle: "Ma'lumotlaringizni qoldiring, menejerimiz 10 daqiqa ichida siz bilan bog'lanadi",
      fullName: "Ism-familiyangiz",
      phone: "Telefon raqamingiz",
      email: "Email (ixtiyoriy)",
      checkIn: "Kirish sanasi",
      checkOut: "Chiqish sanasi",
      adults: "Kattalar soni",
      children: "Bolalar soni",
      roomSelect: "Xonani tanlang",
      specialRequests: "Qo'shimcha istaklar",
      specialRequestsPlaceholder: "Masalan: bolalar uchun qo'shimcha karavot, erta kelish...",
      submitBtn: "Bron qilish so'rovini yuborish",
      submitting: "Yuborilmoqda...",
      successTitle: "Bron so'rovingiz qabul qilindi!",
      successDesc: "Tez orada menejerimiz siz bilan bog'lanib, bronni tasdiqlaydi.",
      close: "Yopish"
    }
  },
  RU: {
    nav: {
      home: "Главная",
      rooms: "Номера",
      restaurant: "Ресторан",
      spa: "SPA и здоровье",
      activities: "Досуг",
      events: "Мероприятия",
      contact: "Контакты",
      bookNow: "Забронировать",
      admin: "Админ",
      winter: "ЗИМА",
      summer: "ЛЕТО",
      weather: "Погода в Чимгане: +22°C (Свежий горный воздух)",
      reception: "24/7 Ресепшн и обслуживание"
    },
    hero: {
      badge: "Курортный комплекс в горах Чимгана",
      titleLine1: "Дыхание природы и",
      titleHighlight: "Изысканная роскошь",
      titleLine2: "в гармонии",
      subtitle: "Насладитесь тишиной среди вековых арчовых лесов Чимгана и Чарвака, уютными деревянными коттеджами, панорамным рестораном и теплым SPA-бассейном.",
      bookBtn: "Забронировать номер",
      roomsBtn: "Каталог номеров",
      statAltitude: "1 850м",
      statAltitudeLabel: "Высота над уровнем моря",
      statCottages: "24+",
      statCottagesLabel: "Коттеджей и люкс номеров",
      statRating: "4.9",
      statRatingLabel: "Оценка гостей (1 200+ отзывов)",
      statNature: "100%",
      statNatureLabel: "Натуральный хвойный лес"
    },
    quickBooking: {
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      adults: "Взрослые",
      children: "Дети",
      roomType: "Категория номера",
      allRooms: "Все категории",
      searchBtn: "Найти номер"
    },
    featuredRooms: {
      badge: "Наши номера",
      heading: "Уютные коттеджи для идеального отдыха",
      viewAll: "Смотреть все номера",
      perNight: "ночь",
      guests: "гостя",
      book: "Забронировать",
      details: "Подробнее"
    },
    about: {
      badge: "О курорте Zilva",
      heading: "Райский уголок в сердце величественных гор",
      desc1: "Zilva Resort & Spa — 5-звездочный курортный комплекс, расположенный в живописнейшем горном районе Бостанлыкского района Ташкентской области.",
      desc2: "Вдали от городской суеты, в тени многовековых арчовых лесов с чистейшим горным воздухом вы проведете незабываемый отдых с семьей или друзьями.",
      feature1Title: "Уютные Коттеджи",
      feature1Desc: "Экологичные деревянные коттеджи и просторные панорамные люксы.",
      feature2Title: "Теплый Бассейн",
      feature2Desc: "Круглогодичный подогреваемый бассейн (28-30°C) с видом на горы.",
      feature3Title: "Премиум Ресторан",
      feature3Desc: "Авторская кухня, национальные и европейские деликатесы от шеф-повара.",
      feature4Title: "24/7 Премиум Сервис",
      feature4Desc: "Индивидуальный подход к каждому гостю и безупречный сервис.",
      learnMore: "Узнать больше"
    },
    spa: {
      badge: "SPA и здоровье",
      heading: "Полная гармония тела и души",
      desc: "Финская сауна, турецкий хаммам, массажные процедуры и панорамный подогреваемый бассейн с видом на горные вершины.",
      feature1: "Финская сауна & Хаммам",
      feature2: "Массаж & Терапия",
      feature3: "Теплый бассейн с панорамой",
      moreBtn: "Подробнее о SPA услугах"
    },
    restaurant: {
      badge: "Панорамный Ресторан",
      heading: "Изысканные блюда с великолепным видом на горы",
      desc: "Zilva Restaurant — авторские блюда национальной и европейской кухни в сочетании с потрясающей панорамой Чимганских вершин.",
      breakfast: "Завтрак (Шведский стол)",
      breakfastTime: "07:30 – 11:00",
      dinner: "Ужин & Живая музыка",
      dinnerTime: "18:00 – 23:00",
      menuBtn: "Посмотреть меню"
    },
    activities: {
      badge: "Активный отдых",
      heading: "Увлекательные приключения в любое время года",
      desc: "Зимой — лыжи, сноуборды и снегоходы; летом — квадроциклы, треккинг, конные прогулки и экскурсии.",
      moreBtn: "Все развлечения"
    },
    reviews: {
      badge: "Отзывы наших гостей",
      heading: "Что говорят о Zilva Resort?",
      desc: "Искренние впечатления и отзывы гостей, отдохнувших в нашем курортном комплексе."
    },
    location: {
      badge: "Расположение",
      heading: "Как до нас добраться?",
      addressLabel: "Горный массив Чимган, Бостанлыкский район, Ташкентская область",
      openMap: "Открыть на Яндекс Картах"
    },
    footer: {
      desc: "Zilva Resort & Spa — курортный комплекс премиум-класса в объятиях величественных гор Чимгана и Чарвака.",
      quickLinks: "Быстрые ссылки",
      contacts: "Контакты",
      workingHours: "Режим работы",
      reception: "Ресепшн: 24/7",
      restaurant: "Ресторан: 07:30 – 23:00",
      spa: "SPA комплекс: 08:00 – 22:00",
      rights: "Все права защищены.",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования"
    },
    modal: {
      title: "Бронирование номера",
      subtitle: "Оставьте свои данные, и наш менеджер свяжется с вами в течение 10 минут",
      fullName: "Ваше Ф.И.О.",
      phone: "Номер телефона",
      email: "Email (необязательно)",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      adults: "Количество взрослых",
      children: "Количество детей",
      roomSelect: "Выберите категорию",
      specialRequests: "Пожелания к бронированию",
      specialRequestsPlaceholder: "Например: детская кроватка, ранний заезд...",
      submitBtn: "Отправить заявку на бронь",
      submitting: "Отправка...",
      successTitle: "Ваша заявка принята!",
      successDesc: "Наш менеджер свяжется с вами для подтверждения бронирования.",
      close: "Закрыть"
    }
  },
  EN: {
    nav: {
      home: "Home",
      rooms: "Rooms",
      restaurant: "Restaurant",
      spa: "SPA & Wellness",
      activities: "Leisure",
      events: "Events",
      contact: "Contacts",
      bookNow: "Book Now",
      admin: "Admin",
      winter: "WINTER",
      summer: "SUMMER",
      weather: "Chimgan Weather: +22°C (Fresh Mountain Air)",
      reception: "24/7 Reception & Service"
    },
    hero: {
      badge: "Mountain Resort & Spa in Chimgan",
      titleLine1: "Breath of Nature and",
      titleHighlight: "Refined Luxury",
      titleLine2: "in Harmony",
      subtitle: "Enjoy serenity amidst the majestic juniper forests of Chimgan and Charvak, cozy wooden cottages, a panoramic restaurant, and a heated SPA pool.",
      bookBtn: "Book a Room",
      roomsBtn: "Explore Rooms",
      statAltitude: "1,850m",
      statAltitudeLabel: "Altitude above sea level",
      statCottages: "24+",
      statCottagesLabel: "Cottages & Luxury Suites",
      statRating: "4.9",
      statRatingLabel: "Guest Rating (1,200+ reviews)",
      statNature: "100%",
      statNatureLabel: "Natural Pine Forest"
    },
    quickBooking: {
      checkIn: "Check-in Date",
      checkOut: "Check-out Date",
      adults: "Adults",
      children: "Children",
      roomType: "Room Category",
      allRooms: "All Categories",
      searchBtn: "Find Rooms"
    },
    featuredRooms: {
      badge: "Our Accommodations",
      heading: "Cozy Cottages & Suites for an Ideal Getaway",
      viewAll: "View All Rooms",
      perNight: "night",
      guests: "guests",
      book: "Book Now",
      details: "More Details"
    },
    about: {
      badge: "About Zilva Resort",
      heading: "A Heavenly Sanctuary in the Majestic Mountains",
      desc1: "Zilva Resort & Spa is a 5-star mountain resort located in the scenic landscapes of Bostanlyk district, Tashkent region.",
      desc2: "Away from the urban rush, unwind with family and friends surrounded by century-old pine trees, crisp alpine air, and exceptional hospitality.",
      feature1Title: "Cozy Cottages",
      feature1Desc: "Eco-friendly wooden cottages and spacious panoramic suites.",
      feature2Title: "Heated Pool",
      feature2Desc: "Year-round heated pool (28-30°C) with scenic mountain vistas.",
      feature3Title: "Gourmet Restaurant",
      feature3Desc: "Authentic national and international delicacies crafted by master chefs.",
      feature4Title: "24/7 Concierge Service",
      feature4Desc: "Personalized attention and impeccable service around the clock.",
      learnMore: "Learn More"
    },
    spa: {
      badge: "SPA & Wellness",
      heading: "True Harmony for Body and Soul",
      desc: "Recharge with Finnish sauna, Turkish hammam, signature massage therapies, and panoramic heated pool.",
      feature1: "Finnish Sauna & Hammam",
      feature2: "Massage & Body Therapy",
      feature3: "Panoramic Heated Pool",
      moreBtn: "Explore SPA Services"
    },
    restaurant: {
      badge: "Panoramic Restaurant",
      heading: "Gourmet Dining with Breathtaking Mountain Views",
      desc: "Zilva Restaurant offers exquisite cuisine crafted with fresh ingredients, paired with stunning mountain panoramas.",
      breakfast: "Breakfast (Buffet)",
      breakfastTime: "07:30 – 11:00",
      dinner: "Dinner & Live Music",
      dinnerTime: "18:00 – 23:00",
      menuBtn: "View Menu"
    },
    activities: {
      badge: "Activities & Leisure",
      heading: "Exciting Adventures in Every Season",
      desc: "Skiing, snowboarding, and snowmobiles in winter; ATV rides, hiking, horse riding, and tours in summer.",
      moreBtn: "Explore All Activities"
    },
    reviews: {
      badge: "Guest Reviews",
      heading: "What Our Guests Say About Zilva Resort",
      desc: "Genuine reviews and impressions from visitors who spent their holidays at our mountain sanctuary."
    },
    location: {
      badge: "Location",
      heading: "How to Get Here",
      addressLabel: "Chimgan Mountain Range, Bostanlyk District, Tashkent Region",
      openMap: "Open on Yandex Maps"
    },
    footer: {
      desc: "Zilva Resort & Spa is a premier luxury mountain retreat situated in the scenic Chimgan and Charvak mountains.",
      quickLinks: "Quick Links",
      contacts: "Contact Us",
      workingHours: "Working Hours",
      reception: "Reception: 24/7",
      restaurant: "Restaurant: 07:30 – 23:00",
      spa: "SPA Center: 08:00 – 22:00",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    },
    modal: {
      title: "Room Booking",
      subtitle: "Provide your details and our manager will contact you within 10 minutes",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email (optional)",
      checkIn: "Check-in Date",
      checkOut: "Check-out Date",
      adults: "Number of Adults",
      children: "Number of Children",
      roomSelect: "Select Room",
      specialRequests: "Special Requests",
      specialRequestsPlaceholder: "e.g., extra bed for child, early arrival...",
      submitBtn: "Send Booking Request",
      submitting: "Sending...",
      successTitle: "Booking request received!",
      successDesc: "Our team will contact you shortly to confirm your reservation.",
      close: "Close"
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('UZ');

  useEffect(() => {
    const savedLang = localStorage.getItem('zilva_lang') as Language | null;
    if (savedLang && (savedLang === 'UZ' || savedLang === 'RU' || savedLang === 'EN')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('zilva_lang', newLang);
  };

  const currentTranslations = translations[lang] || translations.UZ;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
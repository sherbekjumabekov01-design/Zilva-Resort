'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Mountain,
  Phone,
  Calendar,
  ExternalLink,
  Bot,
  User,
  CheckCheck,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { siteSettings } from '@/data/site-settings';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'booking' | 'call' | 'telegram';
    label: string;
  };
}

export default function AiConciergeChat() {
  const { lang } = useLanguage();
  const { openBookingModal } = useBooking();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreetings = {
    UZ: "Assalomu alaykum! Men Zilva Resort & Spa sun'iy intellekt konsyerjiman 🌲 Tog'da dam olish, xonalar narxlari, SPA yoki to'lov bo'yicha savollaringiz bormi? Sizga qanday yordam berishim mumkin?",
    RU: "Здравствуйте! Я виртуальный консьерж Zilva Resort & Spa 🌲 Интересуют цены на коттеджи, теплый SPA бассейн, бронирование или маршрут? Чем могу вам помочь?",
    EN: "Welcome to Zilva Resort & Spa! I am your AI Mountain Concierge 🌲 How may I assist you today with room rates, heated SPA pool, dining, or booking?"
  };

  const quickChips = {
    UZ: [
      { label: "🏡 Xonalar & Narxlar", query: "Xonalar narxlari qanaqa?" },
      { label: "🧖 SPA & Issiq Hovuz", query: "SPA va hovuz sharoitlari qanday?" },
      { label: "🚗 Qanday boriladi?", query: "Toshkentdan qanday yetib boramiz?" },
      { label: "🍽️ Restoran & Taomlar", query: "Restoranda qanday taomlar bor?" },
      { label: "💳 To‘lov & Bron", query: "Bron qilish va to‘lov qoidalari" }
    ],
    RU: [
      { label: "🏡 Номера и цены", query: "Какие цены на коттеджи?" },
      { label: "🧖 SPA и бассейн", query: "Как работает теплый бассейн и СПА?" },
      { label: "🚗 Как добраться?", query: "Как доехать из Ташкента?" },
      { label: "🍽️ Ресторан и меню", query: "Какая кухня в ресторане?" },
      { label: "💳 Оплата и бронь", query: "Условия оплаты и бронирования" }
    ],
    EN: [
      { label: "🏡 Rooms & Rates", query: "What are the room rates?" },
      { label: "🧖 SPA & Heated Pool", query: "Tell me about the SPA & pool" },
      { label: "🚗 Directions", query: "How to get to Zilva Resort?" },
      { label: "🍽️ Restaurant Menu", query: "What dining options are available?" },
      { label: "💳 Payment & Booking", query: "How to book and pay?" }
    ]
  };

  useEffect(() => {
    // Set initial greeting
    setMessages([
      {
        id: 'msg-1',
        sender: 'ai',
        text: initialGreetings[lang] || initialGreetings.UZ,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const generateAiReply = (query: string): { text: string; action?: ChatMessage['action'] } => {
    const q = query.toLowerCase();

    // 1. Rooms & Prices
    if (q.includes('xona') || q.includes('narx') || q.includes('kottej') || q.includes('цена') || q.includes('номер') || q.includes('cottage') || q.includes('room') || q.includes('price') || q.includes('rate')) {
      if (lang === 'RU') {
        return {
          text: "В Zilva Resort представлены премиальные категории:\n• Deluxe Mountain View — от 1 800 000 сум/ночь (2 гостя)\n• Family Wooden Chalet — от 3 200 000 сум/ночь (4 гостя)\n• Presidential Panorama Suite — от 4 800 000 сум/ночь (4 гостя)\n• Royal Forest Villa — от 7 500 000 сум/ночь (8 гостей)\n\nВ стоимость каждого номера включен сытный завтрак (шведский стол), посещение теплого бассейна и финской сауны!",
          action: { type: 'booking', label: 'Забронировать номер' }
        };
      }
      if (lang === 'EN') {
        return {
          text: "Zilva Resort offers several luxury accommodation options:\n• Deluxe Mountain View — from 1,800,000 UZS/night (2 guests)\n• Family Wooden Chalet — from 3,200,000 UZS/night (4 guests)\n• Presidential Suite — from 4,800,000 UZS/night (4 guests)\n• Royal Forest Villa — from 7,500,000 UZS/night (8 guests)\n\nAll rates include buffet breakfast, heated panoramic pool access, and Finnish sauna!",
          action: { type: 'booking', label: 'Book a Room' }
        };
      }
      return {
        text: "Zilva Resortda bir nechta shinam toifalar mavjud:\n• Deluxe Mountain View — 1 800 000 so'm/kecha (2 kishi)\n• Family Wooden Chalet — 3 200 000 so'm/kecha (4 kishi)\n• Presidential Panorama Suite — 4 800 000 so'm/kecha (4 kishi)\n• Royal Forest Villa — 7 500 000 so'm/kecha (8 kishi)\n\nBarcha xonalar narxiga shved stoli nonushtasi, isitiladigan tog' hovuzi va Fin saunasi bepul kiritilgan!",
        action: { type: 'booking', label: 'Xonani Bron Qilish' }
      };
    }

    // 2. SPA & Pool
    if (q.includes('spa') || q.includes('hovuz') || q.includes('basseyn') || q.includes('sauna') || q.includes('hammom') || q.includes('бассейн') || q.includes('сауна') || q.includes('pool')) {
      if (lang === 'RU') {
        return {
          text: "Наш SPA-комплекс работает круглый год с 08:00 до 22:00. Температура воды в панорамном бассейне поддерживается на уровне 28-30°C. Также для вас доступны финская кедровая сауна, турецкий мраморный хаммам и авторские массажные программы.",
          action: { type: 'booking', label: 'Выбрать номер с СПА' }
        };
      }
      if (lang === 'EN') {
        return {
          text: "Our mountain SPA & Wellness center is open daily 08:00 – 22:00. The panoramic outdoor/indoor pool is heated to a comfortable 29°C year-round. Finnish cedar sauna, marble Turkish hammam, and therapeutic massages are available for all guests.",
          action: { type: 'booking', label: 'Explore SPA' }
        };
      }
      return {
        text: "Zilva SPA markazimiz har kuni soat 08:00 dan 22:00 gacha xizmat ko'rsatadi. Tog' manzarali panoramik hovuzimiz suvi yil davomida 28-30°C issiq holda saqlanadi. Fin yog'och saunasi, sharqona marmar hammom va shifobaxsh massaj xizmatlarimiz mavjud.",
        action: { type: 'booking', label: 'SPA rohatini his qilish' }
      };
    }

    // 3. Location & Directions
    if (q.includes('manzil') || q.includes('qayer') || q.includes('yetib') || q.includes('boriladi') || q.includes('адрес') || q.includes('доехать') || q.includes('где') || q.includes('location') || q.includes('direction') || q.includes('address')) {
      if (lang === 'RU') {
        return {
          text: "Курорт Zilva расположен в живописном урочище Чимган (Бостанлыкский район).\n• Расстояние от Ташкента: 92 км (~1 час 20 минут по отличной асфальтированной трассе)\n• От Чарвакского водохранилища: 18 км (20 минут).\nМы отмечены на Яндекс Навигаторе и Google Maps!",
          action: { type: 'telegram', label: 'Открыть локацию в Telegram' }
        };
      }
      if (lang === 'EN') {
        return {
          text: "Zilva Resort is located in the scenic Chimgan mountains, Bostanlyk district.\n• From Tashkent: 92 km (approx. 1 hour 20 min drive on paved mountain road)\n• From Charvak Reservoir: 18 km (20 min).\nSearch 'Zilva Resort Chimgan' on Yandex Navigator or Google Maps!",
          action: { type: 'telegram', label: 'Get Location in Telegram' }
        };
      }
      return {
        text: "Zilva Resort majmuasi Chimgan tog' massivida joylashgan.\n• Toshkent shahridan masofa: 92 km (asfaltlangan qulay yo'l orqali 1 soat 20 daqiqa)\n• Chorvoq suv omboridan: 18 km (20 daqiqa).\nYandex Navigator yoki Google Xaritalarda 'Zilva Resort Chimgan' deb qidirsangiz, to'g'ri darvozamiz oldiga olib keladi!",
        action: { type: 'telegram', label: 'Lokatsiyani Telegramda olish' }
      };
    }

    // 4. Food & Restaurant
    if (q.includes('taom') || q.includes('ovqat') || q.includes('restoran') || q.includes('nonushta') || q.includes('еда') || q.includes('ресторан') || q.includes('меню') || q.includes('food') || q.includes('restaurant') || q.includes('dining')) {
      if (lang === 'RU') {
        return {
          text: "Наш ресторан предлагает изысканные блюда национальной узбекской (сочные горные шашлыки, чайханский плов) и европейской кухни (рибай стейки, лосось на гриле, паста). Завтрак (шведский стол) подается с 07:30 до 11:00.",
          action: { type: 'booking', label: 'Забронировать столик' }
        };
      }
      if (lang === 'EN') {
        return {
          text: "Zilva Restaurant features local Uzbek delicacies (mountain lamb kebabs, fragrant plov) and gourmet European dining (Ribeye steaks, grilled salmon, artisanal desserts). Buffet breakfast is served 07:30 to 11:00 daily.",
          action: { type: 'booking', label: 'Reserve a Table' }
        };
      }
      return {
        text: "Panoramik restoranizmizda tansiq milliy taomlar (tog' qo'zi kaboblari, to'y oshi) hamda nafis Yevropa menyusi (Ribeye steyklar, losos balig'i, mualliflik desertlari) tayyorlanadi. Har kuni 07:30 – 11:00 oralig'ida shved stoli nonushtasi beriladi.",
        action: { type: 'booking', label: 'Stol band qilish' }
      };
    }

    // 5. Payments & Rules
    if (q.includes('to‘lov') || q.includes('tolov') || q.includes('avans') || q.includes('click') || q.includes('payme') || q.includes('bron') || q.includes('оплата') || q.includes('pay') || q.includes('payment') || q.includes('book')) {
      if (lang === 'RU') {
        return {
          text: "Бронирование оформляется онлайн за 1 минуту. Вы можете внести предоплату 20% через Click, Payme или банковской картой, а остаток оплатить при заезде. Время заезда (Check-in) — 14:00, выезда (Check-out) — 12:00.",
          action: { type: 'booking', label: 'Оформить бронь онлайн' }
        };
      }
      if (lang === 'EN') {
        return {
          text: "You can easily reserve your cottage online. We accept Click, Payme, Uzum, Visa, and Mastercard with a 20% advance guarantee deposit. Check-in is at 14:00, check-out is at 12:00.",
          action: { type: 'booking', label: 'Book with Deposit' }
        };
      }
      return {
        text: "Xonani veb-saytimiz orqali 1 daqiqada bron qilishingiz mumkin. Xonani kafolatli band qilish uchun Click, Payme yoki Uzum orqali 20% avans to'lashingiz, qolganini esa joylashganda to'lashingiz mumkin. Kirish (Check-in) — 14:00, Chiqish (Check-out) — 12:00.",
        action: { type: 'booking', label: 'Xonani Bron Qilish' }
      };
    }

    // Default polite AI assistant response
    if (lang === 'RU') {
      return {
        text: "Спасибо за вопрос! С удовольствием помогу вам спланировать идеальный отдых в горах Чимгана. Вы также можете напрямую связаться с нашим администратором в Telegram или по телефону.",
        action: { type: 'telegram', label: 'Написать менеджеру в Telegram' }
      };
    }
    if (lang === 'EN') {
      return {
        text: "Thank you for reaching out! I'd love to help you plan an unforgettable getaway at Zilva Resort. You can also connect directly with our reservation team on Telegram or phone.",
        action: { type: 'telegram', label: 'Chat with Manager on Telegram' }
      };
    }
    return {
      text: "Savolingiz uchun tashakkur! Zilva Resortda unutilmas tog' hordig'ini tashkil qilishda jon deb yordam beraman. Agar maxsus talablaringiz bo'lsa, ma'murimiz bilan to'g'ridan-to'g'ri Telegramda ham bog'lanishingiz mumkin.",
      action: { type: 'telegram', label: 'Menejer bilan Telegramda bog‘lanish' }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      const reply = generateAiReply(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: reply.action
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;
    if (action.type === 'booking') {
      openBookingModal();
      setIsOpen(false);
    } else if (action.type === 'telegram') {
      window.open(siteSettings.telegram, '_blank');
    } else if (action.type === 'call') {
      window.open(`tel:${siteSettings.phone}`, '_self');
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#1b382b] via-[#244b39] to-[#1b382b] hover:from-[#142e21] hover:to-[#244b39] text-white shadow-2xl border border-[#d8aa62]/50 hover:border-[#d8aa62] hover:scale-105 active:scale-95 transition-all"
            aria-label="AI Konsyerj"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#d8aa62]/20 flex items-center justify-center text-[#d8aa62] border border-[#d8aa62]/40">
                <Sparkles className="w-5 h-5 text-[#d8aa62] animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#12241b]" />
            </div>

            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#d8aa62] font-semibold uppercase tracking-wider block leading-tight">
                24/7 AI Concierge
              </span>
              <span className="text-xs font-bold text-white block">
                Zilva Konsyerj
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#0c1c15]/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#142e21] to-[#0c1c15] border-b border-white/10 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#b88a44]/20 border border-[#b88a44]/50 flex items-center justify-center text-[#d8aa62]">
                  <Mountain className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c1c15]" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Zilva AI Konsyerj</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#d8aa62]" />
                </h4>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  ● Onlayn (24/7 Tog‘ yordamchisi)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                aria-label="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-[#b88a44] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[82%] ${isAi ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-md ${
                        isAi
                          ? 'bg-[#152e22] text-white/95 border border-white/10 rounded-tl-sm'
                          : 'bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white font-medium rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.action && (
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d8aa62]/20 hover:bg-[#d8aa62]/30 border border-[#d8aa62]/50 text-[#d8aa62] font-semibold text-[11px] transition-colors"
                      >
                        <span>{msg.action.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-[9px] text-white/40 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-white/50 text-[11px] pt-1">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d8aa62] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d8aa62] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d8aa62] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-black/30 border-t border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2">
            {(quickChips[lang] || quickChips.UZ).map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip.query)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10.5px] text-white/90 border border-white/10 transition-colors shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#11261c] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={lang === 'RU' ? 'Задайте вопрос консьержу...' : lang === 'EN' ? 'Ask anything about the resort...' : 'Kurort haqida savolingizni yozing...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-white/40 focus:border-[#d8aa62] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

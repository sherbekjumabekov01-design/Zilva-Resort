'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Mountain,
  ExternalLink,
  Bot
} from 'lucide-react';
import { processAiConciergeQuery, AiResponse } from '@/lib/ai-assistant';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { siteSettings } from '@/data/site-settings';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: AiResponse['action'];
}

export default function AiConciergeChat() {
  const { lang } = useLanguage();
  const { openBookingModal } = useBooking();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgCounterRef = useRef(1);

  const initialGreetings = {
    UZ: "Assalomu alaykum! Men Zilva Resort & Spa sun'iy intellekt konsyerjiman 🌲 Tog'da dam olish, xonalar narxlari, SPA yoki to'lov bo'yicha savollaringiz bormi? Sizga qanday yordam berishim mumkin?",
    RU: "Здравствуйте! Я виртуальный консьерж Zilva Resort & Spa 🌲 Интересуют цены на коттеджи, теплый SPA бассейн, бронирование или маршрут? Чем могу вам помочь?",
    EN: "Welcome to Zilva Resort & Spa! I am your AI Mountain Concierge 🌲 How may I assist you today with room rates, heated SPA pool, dining, or booking?"
  };

  const quickChips = {
    UZ: [
      { label: "👑 Eng qimmat xona", query: "Eng qimmat xona qaysi?" },
      { label: "🏡 Xonalar & Narxlar", query: "Barcha xonalar narxlari qanaqa?" },
      { label: "🧖 29°C Issiq Hovuz & SPA", query: "Issiq hovuz va sauna bepulmi?" },
      { label: "🚗 Qanday boriladi?", query: "Toshkentdan qanday yetib boramiz?" },
      { label: "🍽️ Restoran & Halol", query: "Restoranda taomlar halolmi va qanday ovqatlar bor?" },
      { label: "💳 To‘lov & Bron", query: "Bron qilish va to‘lov qoidalari" }
    ],
    RU: [
      { label: "👑 Самый дорогой", query: "Какой самый дорогой номер?" },
      { label: "🏡 Все номера и цены", query: "Какие цены на все номера?" },
      { label: "🧖 Бассейн 29°C и SPA", query: "Бассейн теплый и сауна бесплатная?" },
      { label: "🚗 Как добраться?", query: "Как доехать из Ташкента?" },
      { label: "🍽️ Ресторан и меню", query: "Какая кухня в ресторане?" },
      { label: "💳 Оплата и бронь", query: "Условия оплаты и бронирования" }
    ],
    EN: [
      { label: "👑 Most expensive room", query: "What is the most expensive room?" },
      { label: "🏡 All Rooms & Rates", query: "What are all the room rates?" },
      { label: "🧖 Heated Pool & SPA", query: "Tell me about the heated pool and spa" },
      { label: "🚗 Directions", query: "How to get to Zilva Resort?" },
      { label: "🍽️ Restaurant Menu", query: "What dining options are available?" },
      { label: "💳 Payment & Booking", query: "How to book and pay?" }
    ]
  };

  const [prevLang, setPrevLang] = useState(lang);
  if (prevLang !== lang) {
    setPrevLang(lang);
    setMessages([
      {
        id: 'msg-1',
        sender: 'ai',
        text: initialGreetings[lang] || initialGreetings.UZ,
        timestamp: '12:00'
      }
    ]);
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const generateAiReply = (query: string): AiResponse => {
    return processAiConciergeQuery(query, lang);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    msgCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      msgCounterRef.current += 1;
      const reply = generateAiReply(query);
      const aiMsg: ChatMessage = {
        id: `ai-${msgCounterRef.current}`,
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
      {/* Floating Launcher Button with Luxury Glassmorphism */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full glass-btn-forest text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
            aria-label="AI Konsyerj"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#d8aa62]/25 flex items-center justify-center text-[#d8aa62] border border-[#d8aa62]/60 shadow-inner">
                <Sparkles className="w-5 h-5 text-[#d8aa62] animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#12241b] shadow-sm animate-pulse" />
            </div>

            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#d8aa62] font-semibold uppercase tracking-wider block leading-tight">
                24/7 AI Concierge
              </span>
              <span className="text-xs font-bold text-white block tracking-wide">
                Zilva Konsyerj
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Window in Frosted Glass */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#0c1c15]/90 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 bg-white/5 backdrop-blur-md border-b border-white/15 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl glass-btn-gold flex items-center justify-center text-[#d8aa62]">
                  <Mountain className="w-5 h-5 text-white" />
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
                className="p-2 rounded-xl glass-btn text-white/80 hover:text-white transition-colors"
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
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#b88a44] to-[#9c7334] border border-white/20 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[82%] ${isAi ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-lg ${
                        isAi
                          ? 'bg-white/10 backdrop-blur-md text-white/95 border border-white/15 rounded-tl-sm'
                          : 'glass-btn-gold text-white font-medium rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.action && (
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-btn text-[#d8aa62] font-semibold text-[11px] hover:border-[#d8aa62] transition-all"
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
                <div className="w-6 h-6 rounded-lg glass-btn flex items-center justify-center">
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
          <div className="px-4 py-2 bg-black/40 backdrop-blur-md border-t border-white/10 overflow-x-auto no-scrollbar flex items-center gap-2">
            {(quickChips[lang] || quickChips.UZ).map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip.query)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full glass-btn text-[11px] text-white/90 hover:text-white shrink-0"
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
            className="p-3 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={lang === 'RU' ? 'Задайте вопрос консьержу...' : lang === 'EN' ? 'Ask anything about the resort...' : 'Kurort haqida savolingizni yozing...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-white/40 focus:border-[#d8aa62] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl glass-btn-gold disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

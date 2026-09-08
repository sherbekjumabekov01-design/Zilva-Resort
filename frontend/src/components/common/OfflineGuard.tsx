'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { WifiOff, RefreshCw, Phone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteSettings } from '@/data/site-settings';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getOnlineServerSnapshot() {
  return true;
}

export default function OfflineGuard() {
  const { lang } = useLanguage();
  const isBrowserOnline = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  );

  const [serverReachable, setServerReachable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showRestoredToast, setShowRestoredToast] = useState(false);
  const [prevIsOffline, setPrevIsOffline] = useState(false);

  const isOffline = !isBrowserOnline || !serverReachable;

  // Show restored toast when transitioning from offline to online
  useEffect(() => {
    if (prevIsOffline && !isOffline) {
      const timer = setTimeout(() => {
        setShowRestoredToast(true);
        setTimeout(() => setShowRestoredToast(false), 3500);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOffline, prevIsOffline]);

  // Track previous offline state safely during render
  if (prevIsOffline !== isOffline) {
    setPrevIsOffline(isOffline);
  }

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setServerReachable(false);
      setIsChecking(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const res = await fetch('/api/rooms', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        setServerReachable(true);
      } else {
        setServerReachable(false);
      }
    } catch {
      setServerReachable(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Lock body scroll when offline
  useEffect(() => {
    if (isOffline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOffline]);

  const texts = {
    UZ: {
      badge: "Tarmoq uzildi",
      title: "Internet Aloqasi Mavjud Emas",
      description: "Zilva Resort onlayn tizimi, xonalar bandligi taqvimi va bron qilish xizmati uzluksiz ishlashi uchun faol internet talab etiladi. Iltimos, Wi-Fi yoki mobil ma'lumot uzatishni yoqing.",
      checkBtn: "Qayta tekshirish",
      checking: "Tekshirilmoqda...",
      phoneLabel: "Tezkor qabulxona bilan bog'lanish:",
      phoneSub: "24/7 telefon orqali to'g'ridan-to'g'ri buyurtma",
      restored: "Internet aloqasi muvaffaqiyatli tiklandi!"
    },
    RU: {
      badge: "Нет сети",
      title: "Отсутствует подключение к интернету",
      description: "Для актуального отображения номеров, цен и оформления бронирования в Zilva Resort необходимо интернет-соединение. Пожалуйста, проверьте подключение к Wi-Fi или мобильной сети.",
      checkBtn: "Проверить снова",
      checking: "Проверка сети...",
      phoneLabel: "Прямой звонок на ресепшн:",
      phoneSub: "Круглосуточное бронирование по телефону",
      restored: "Подключение к интернету успешно восстановлено!"
    },
    EN: {
      badge: "Network Offline",
      title: "No Internet Connection",
      description: "An active internet connection is required to check room availability, live rates, and complete reservations at Zilva Resort. Please enable Wi-Fi or mobile data.",
      checkBtn: "Retry Connection",
      checking: "Checking network...",
      phoneLabel: "Direct Reception Desk:",
      phoneSub: "24/7 instant booking via phone",
      restored: "Internet connection has been restored!"
    }
  };

  const t = texts[lang] || texts.UZ;

  return (
    <>
      {/* Restored Toast Notification */}
      {showRestoredToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100000] px-6 py-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">{t.restored}</span>
        </div>
      )}

      {/* Full-Screen Offline Guard Curtain */}
      {isOffline && (
        <div
          id="offline-guard-screen"
          className="fixed inset-0 z-[99999] bg-[#07110c]/98 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-300"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-[#d8aa62]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-lg w-full rounded-3xl bg-[#0f2319] border border-white/15 p-6 sm:p-8 shadow-2xl text-center space-y-6">
            
            {/* Animated WifiOff Badge */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-50" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-rose-950 to-rose-900 border-2 border-rose-500/40 flex items-center justify-center shadow-xl">
                <WifiOff className="w-10 h-10 text-rose-400 animate-pulse" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider border border-rose-500/40">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light pt-1">
                {t.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={checkConnection}
                disabled={isChecking}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? t.checking : t.checkBtn}</span>
              </button>

              {/* Direct Phone Call Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block font-semibold">
                    {t.phoneLabel}
                  </span>
                  <span className="text-sm font-bold text-[#d8aa62] block font-mono">
                    {siteSettings.phone}
                  </span>
                  <span className="text-[10px] text-white/60 block">
                    {t.phoneSub}
                  </span>
                </div>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shrink-0 flex items-center justify-center"
                  title="Qo'ng'iroq qilish"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

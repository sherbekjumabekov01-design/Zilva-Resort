'use client';

import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Send, Clock, Sparkles, CheckCircle2,
  ChevronDown, MessageSquare, ExternalLink, HelpCircle
} from 'lucide-react';
import { siteSettings } from '@/data/site-settings';
import { submitContactRequest } from '@/lib/api';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState("Umumiy ma'lumot olish");
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Joylashish (Check-in) va chiqish (Check-out) vaqtlari qanday?",
      a: "Xonaga joylashish soat 14:00 dan (chaletlarda 15:00 dan), xonani topshirish esa soat 12:00 gacha amalga oshiriladi. Ertaroq kelish yoki kechroq chiqish xonalar bo'shligiga qarab oldindan kelishilishi mumkin."
    },
    {
      q: "Nonushta va SPA xizmatlari xona narxiga kiritilganmi?",
      a: "Ha, barcha xona toifalari narxiga shohona Shved stoli nonushtasi, panoramali isitiladigan yopiq hovuz (29°C), fin saunasi, turk hammomi va fitnes zalidan foydalanish bepul kiritilgan."
    },
    {
      q: "Buyurtmani bekor qilish tartibi qanday?",
      a: "Rejalashtirilgan tashrif kunidan 48 soat oldin bekor qilinganda to'lov to'liq qaytariladi. Bayram kunlarida bekor qilish muddati 72 soatni tashkil etadi."
    },
    {
      q: "Bolalar uchun qanday imkoniyatlar bor?",
      a: "3 yoshgacha bo'lgan bolalar uchun xonaga bepul krovat taqdim etiladi. Resort hududida xavfsiz yog'och eko-maydoncha va bolalar basseyn zonasi mavjud."
    },
    {
      q: "Mashinalar turargohi bormi va xavfsizlik qanday ta'minlangan?",
      a: "Resort hududida mehmonlarimiz uchun 24/7 video-kuzatuv ostidagi bepul yopiq avtoturargoh va xavfsizlik xizmati faoliyat yuritadi."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactRequest({
        fullName,
        phone,
        email,
        subject,
        message
      });

      if (res.success) {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage("Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Hero Banner */}
      <div className="bg-[#12241b] text-white py-16 mb-12 border-b border-white/10 relative overflow-hidden">
        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Bog'lanish & Lokatsiya</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Biz Bilan Bog'laning
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Savollaringiz bormi yoki bronlashda yordam kerakmi? Biz har doim sizga xizmat qilishdan mamnunmiz.
          </p>
        </div>
      </div>

      <div className="resort-container space-y-16">
        {/* Contact Info & Direct Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-[#12241b] text-white p-8 rounded-3xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-[#d8aa62] uppercase tracking-wider font-semibold">
                  To'g'ridan-to'g'ri aloqa
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Qabulxona & Bron
                </h3>
              </div>

              <ul className="space-y-4 text-xs text-white/85">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#d8aa62] shrink-0 mt-0.5" />
                  <span>{siteSettings.address}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#d8aa62] shrink-0" />
                  <div>
                    <a href={`tel:${siteSettings.phone}`} className="hover:underline font-semibold block text-white">
                      {siteSettings.phone}
                    </a>
                    <span className="text-[11px] text-white/60">24/7 Qabulxona</span>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#d8aa62] shrink-0" />
                  <a href={`mailto:${siteSettings.email}`} className="hover:underline text-white">
                    {siteSettings.email}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#d8aa62] shrink-0" />
                  <span>Reception: {siteSettings.workingHours.reception}</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <span className="text-[11px] text-white/60 uppercase tracking-wider block">
                Ijtimoiy tarmoqlar:
              </span>
              <div className="flex gap-3">
                <a
                  href={siteSettings.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#b88a44] text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
                <a
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#b88a44] text-xs font-medium text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl shadow-xl">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1b382b]">
                  Xabaringiz muvaffaqiyatli yuborildi!
                </h3>
                <p className="text-xs sm:text-sm text-[#5e6962] max-w-md mx-auto">
                  Murojaatingiz uchun tashakkur. Tez orada ma'muriyatimiz siz bilan bog'lanadi.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#1b382b] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Yangi xabar yozish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-[#18221b]">
                    Savol yoki Xabar Qoldiring
                  </h3>
                  <p className="text-xs text-[#5e6962]">
                    Formani to'ldiring, menejerimiz tez orada javob qaytaradi.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962]">Ism va familiya *</label>
                    <input
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-xs sm:text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962]">Telefon raqami *</label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-xs sm:text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962]">Email pochta</label>
                    <input
                      type="email"
                      placeholder="misol@pochta.uz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-xs sm:text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#5e6962]">Mavzu</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-xs sm:text-sm text-[#18221b]"
                    >
                      <option value="Umumiy ma'lumot olish">Umumiy ma'lumot olish</option>
                      <option value="Xona bron qilish">Xona bron qilish</option>
                      <option value="Restoran & Banket">Restoran & Banket</option>
                      <option value="SPA muolajalari">SPA muolajalari</option>
                      <option value="Korporativ tadbir">Korporativ tadbir</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5e6962]">Xabaringiz matni *</label>
                  <textarea
                    rows={4}
                    placeholder="Savolingiz yoki istaklaringizni yozing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8cb] text-xs sm:text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#d8aa62]" />
                  <span>{isSubmitting ? "Yuborilmoqda..." : "Xabarni Yuborish"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#18221b]">
            Xaritada Joylashuv
          </h3>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#dfd8cb] h-[400px]">
            <iframe
              title="Zilva Resort Xaritasi"
              src="https://yandex.uz/map-widget/v1/?ll=70.0152%2C41.5284&z=13&pt=70.0152%2C41.5284~pm2rdm"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ko'p Beriladigan Savollar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18221b]">
              FAQ & Muhim Ma'lumotlar
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#dfd8cb] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-xs sm:text-sm text-[#18221b]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#b88a44] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#5e6962] leading-relaxed border-t border-[#dfd8cb]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

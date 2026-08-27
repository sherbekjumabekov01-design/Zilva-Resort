'use client';

import React, { useState } from 'react';
import { Sparkles, Users, CheckCircle2, Phone, Mail, Send, Calendar, ShieldCheck } from 'lucide-react';
import { eventsData } from '@/data/events';
import { siteSettings } from '@/data/site-settings';
import { submitContactRequest } from '@/lib/api';

export default function EventsPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Korporativ / Konferensiya');
  const [guestsCount, setGuestsCount] = useState('30-50 kishi');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage("Iltimos, ismingiz va telefon raqamingizni kiriting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedMessage = `[Tadbir so'rovi] Toifa: ${eventType}, Mehmonlar: ${guestsCount}. Xabar: ${message}`;
      const res = await submitContactRequest({
        fullName,
        phone,
        email,
        subject: `Tadbir so'rovi: ${eventType}`,
        message: formattedMessage
      });

      if (res.success) {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage("So'rov yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Hero Banner */}
      <div className="relative min-h-[440px] bg-[#12241b] text-white flex items-center justify-center py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-[#12241b]/70 to-transparent" />

        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MICE & Tantanalar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
            Tadbirlar & Konferensiyalar
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            Biznes konferensiyalar, jamoaviy team-buildinglar yoki unutilmas to'y tantanalari uchun
            tog' bag'ridagi eng qulay sharoit va professional xizmat.
          </p>
        </div>
      </div>

      <div className="resort-container py-16 space-y-16">
        {/* Events Showcase List */}
        <div className="space-y-12">
          {eventsData.map((ev, idx) => (
            <div
              key={ev.id}
              className={`glass-card rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="relative h-72 lg:h-full min-h-[340px] w-full overflow-hidden bg-neutral-900">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d8aa62]" />
                  <span>Sig'im: {ev.capacity}</span>
                </span>
              </div>

              <div className="p-8 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs text-[#b88a44] uppercase tracking-wider font-semibold">
                    {ev.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18221b]">
                    {ev.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5e6962] font-light leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#18221b]">
                    Taqdim etiladigan jihoz va qulayliklar:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ev.equipment.map((eq, ei) => (
                      <li key={ei} className="flex items-start gap-2 text-xs text-[#5e6962]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#b88a44] shrink-0 mt-0.5" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RFP / Event Inquiry Form */}
        <div className="bg-[#12241b] text-white p-8 sm:p-14 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Taklif So'rovi</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Tadbiringiz Uchun Maxsus <br />
                <span className="gold-gradient-text italic font-serif">Tijoriy Taklif Oling</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                Kompaniyangiz talablariga mos kofe-breyk, ovqatlanish, turar joy va kvest dasturlarini
                tuzib, individual smetani 2 soat ichida tayyorlab beramiz.
              </p>
              <div className="pt-4 flex items-center gap-4 text-xs text-white/80">
                <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-2 text-[#d8aa62] hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>{siteSettings.phone}</span>
                </a>
                <span>•</span>
                <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-2 hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>{siteSettings.email}</span>
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white text-[#18221b] p-6 sm:p-8 rounded-2xl shadow-xl">
              {isSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1b382b]">
                    So'rovingiz qabul qilindi!
                  </h3>
                  <p className="text-xs text-[#5e6962]">
                    Rahmat, tadbir menejerimiz tez orada siz bilan bog'lanib, tayyor taklifni taqdim etadi.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e6962] mb-1">Ism va familiya *</label>
                      <input
                        type="text"
                        placeholder="Masalan: Sardor"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#dfd8cb] text-xs text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e6962] mb-1">Telefon raqam *</label>
                      <input
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#dfd8cb] text-xs text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e6962] mb-1">Tadbir toifasi</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#dfd8cb] text-xs text-[#18221b]"
                      >
                        <option value="Korporativ / Konferensiya">Korporativ / Konferensiya</option>
                        <option value="Team Building">Team Building</option>
                        <option value="To'y / Banket">To'y / Banket</option>
                        <option value="Yubiley / Bayram">Yubiley / Bayram</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e6962] mb-1">Taxminiy mehmonlar</label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#dfd8cb] text-xs text-[#18221b]"
                      >
                        <option value="10-25 kishi">10-25 kishi</option>
                        <option value="25-50 kishi">25-50 kishi</option>
                        <option value="50-100 kishi">50-100 kishi</option>
                        <option value="100+ kishi">100+ kishi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5e6962] mb-1">Qo'shimcha izoh yoki sana</label>
                    <textarea
                      rows={2}
                      placeholder="Tadbir sanasi, texnik talablar va h.k."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#dfd8cb] text-xs text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Yuborilmoqda..." : "Tijoriy Taklif Olish"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

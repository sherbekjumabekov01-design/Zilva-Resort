'use client';

import React from 'react';
import { Waves, Flame, Sparkles, Clock, CheckCircle2, Phone, Send, ShieldCheck, Heart } from 'lucide-react';
import { spaInfo, spaServices } from '@/data/spa';
import { formatCurrency } from '@/lib/utils';
import { siteSettings } from '@/data/site-settings';
import { useBooking } from '@/context/BookingContext';

export default function SpaPage() {
  const { openBookingModal } = useBooking();

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Hero Banner */}
      <div className="relative min-h-[460px] bg-[#12241b] text-white flex items-center justify-center py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-[#12241b]/70 to-transparent" />

        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wellness & Rejuvenation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
            {spaInfo.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            {spaInfo.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d8aa62]" />
              <span>{spaInfo.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#d8aa62]" />
              <span>Hovuz harorati: {spaInfo.poolTemp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="resort-container py-16 space-y-16">
        {/* Features Checklist */}
        <div className="glass-card p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18221b]">
              SPA Majmuasi Afzalliklari
            </h2>
            <p className="text-xs text-[#5e6962]">
              Tog' archalarining fitontsidlari va gidroterapiya yordamida chuqur tiklanish
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaInfo.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl glass-pill">
                <CheckCircle2 className="w-4 h-4 text-[#b88a44] shrink-0" />
                <span className="text-xs font-medium text-[#18221b]">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18221b]">
              Barcha SPA & Wellness Xizmatlari
            </h2>
            <p className="text-xs sm:text-sm text-[#5e6962]">
              Mehmonlarimiz uchun kiritilgan bepul xizmatlar va qo'shimcha relaksatsiya amaliyotlari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaServices.map((service) => (
              <div
                key={service.id}
                className="group glass-card glass-card-interactive rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                      service.isIncluded
                        ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/30'
                        : 'bg-[#1b382b]/90 text-[#d8aa62] border border-white/20'
                    }`}>
                      {service.isIncluded ? "✓ Xona narxiga kiritilgan" : "Pullik muolaja"}
                    </span>
                  </div>

                  <div className="px-6 space-y-2">
                    <h3 className="font-serif font-bold text-xl text-[#18221b] group-hover:text-[#1b382b] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#5e6962] font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-4 mt-4 border-t border-[#dfd8cb] space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((f, fi) => (
                      <span key={fi} className="text-[10px] px-2.5 py-1 rounded-md bg-[#f8f5ee] text-[#18221b] font-medium">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {service.price ? (
                      <div className="font-serif font-bold text-lg text-[#1b382b]">
                        {formatCurrency(service.price)}
                        <span className="text-[11px] font-sans font-normal text-[#5e6962]"> / {service.duration}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-800 font-semibold">
                        Barcha mehmonlar uchun bepul
                      </span>
                    )}

                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="p-2 rounded-xl bg-[#f0ebe1] hover:bg-[#dfd8cb] text-[#18221b] transition-colors"
                      title="Yozilish"
                    >
                      <Phone className="w-4 h-4 text-[#b88a44]" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spa Booking CTA */}
        <div className="bg-[#12241b] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              SPA Muolajasiga Oldindan Yoziling
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl font-light">
              Massaj ustalari bandligini rejalashtirish va qulay vaqtni tanlash uchun oldindan administrator bilan bog'laning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={`tel:${siteSettings.phone}`}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>SPA Administratori: {siteSettings.phone}</span>
            </a>
            <button
              onClick={() => openBookingModal()}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider text-center"
            >
              Xona & SPA Bron Qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

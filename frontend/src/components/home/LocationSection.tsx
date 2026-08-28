'use client';

import React from 'react';
import { MapPin, Phone, Navigation, Car, ExternalLink } from 'lucide-react';
import { siteSettings } from '@/data/site-settings';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 bg-white dark:bg-[#07110c] relative">
      <div className="resort-container space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 dark:bg-white/10 text-[#1b382b] dark:text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#b88a44]" />
            <span>{t.location.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] dark:text-white">
            {t.location.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/70 font-light">
            {t.location.addressLabel}
          </p>
        </div>

        {/* Map & Travel Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Info Card */}
          <div className="bg-[#12241b] text-white p-8 rounded-3xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-[#d8aa62] font-semibold uppercase tracking-wider">
                  {lang === 'RU' ? 'Адрес' : lang === 'EN' ? 'Address' : 'Aniq Manzil'}
                </span>
                <h3 className="text-xl font-serif font-bold text-white leading-snug">
                  {siteSettings.address}
                </h3>
              </div>

              <div className="space-y-4 text-xs text-white/80">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Car className="w-5 h-5 text-[#d8aa62] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {lang === 'RU' ? 'От Ташкента:' : lang === 'EN' ? 'From Tashkent:' : 'Toshkentdan masofa:'}
                    </span>
                    <span>92 km (1h 20m)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Navigation className="w-5 h-5 text-[#d8aa62] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {lang === 'RU' ? 'От Чарвака:' : lang === 'EN' ? 'From Charvak:' : 'Chorvoq suv omboridan:'}
                    </span>
                    <span>18 km (20 min)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href={siteSettings.geo.yandexMapUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t.location.openMap}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${siteSettings.phone}`}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#d8aa62]" />
                <span>Qo'ng'iroq qilish: {siteSettings.phone}</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Frame */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-xl border border-[#dfd8cb] min-h-[380px] relative bg-[#f0ebe1]">
            <iframe
              title="Zilva Resort Joylashuvi"
              src="https://yandex.uz/map-widget/v1/?ll=70.0152%2C41.5284&z=13&pt=70.0152%2C41.5284~pm2rdm"
              className="w-full h-full min-h-[400px] border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

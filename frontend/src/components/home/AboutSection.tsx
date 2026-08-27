import React from 'react';
import Link from 'next/link';
import { Mountain, Trees, ShieldCheck, HeartHandshake, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteSettings } from '@/data/site-settings';

export default function AboutSection() {
  const highlights = [
    {
      icon: Trees,
      title: "100% Tabiiy Archazor",
      desc: "Chorvoq tog' tizmasining toza archazor qarag'aylari bilan o'ralgan shifobaxsh fitontsidli havo."
    },
    {
      icon: Mountain,
      title: "1 850m Balandlikdagi Panorama",
      desc: "Har bir deraza va terrasdan purviqor qorli cho'qqilar hamda quyosh botishining betakror manzarasi."
    },
    {
      icon: ShieldCheck,
      title: "Shaxsiy Osoyishtalik",
      desc: "Alohida kottejlar, shaxsiy kamin va jakuzilar, begona shovqindan xoli osoyishta maskan."
    },
    {
      icon: HeartHandshake,
      title: "5 Yulduzli Mehmondo'stlik",
      desc: "24/7 individual konsyerj xizmati, milliy va Yevropa taomlari restorani hamda iliq SPA majmuasi."
    }
  ];

  return (
    <section className="py-24 bg-[#f8f5ee] relative overflow-hidden">
      <div className="resort-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Visual Collage */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                alt="Zilva Resort tog' manzarasi"
                className="w-full h-[420px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlapping small image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 z-20 w-64 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80"
                alt="SPA Hovuzi"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Badge floating */}
            <div className="absolute -top-6 -left-6 z-20 bg-[#1b382b] text-white p-5 rounded-2xl shadow-xl border border-white/20 hidden sm:flex items-center gap-3">
              <Compass className="w-8 h-8 text-[#d8aa62]" />
              <div>
                <span className="block text-xl font-serif font-bold text-[#d8aa62]">1 850 m</span>
                <span className="block text-[11px] text-white/80 uppercase tracking-wider">Chimgan Cho'qqilari</span>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
              <span>Zilva Resort Tarixi & Falsafasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] leading-tight">
              Shahar Shovqinidan Yiroqda, <br />
              <span className="italic font-serif text-[#1b382b]">Tog'lar Bag'ridagi Baxt</span>
            </h2>

            <p className="text-sm sm:text-base text-[#5e6962] leading-relaxed font-light">
              Zilva Resort — shunchaki dam olish maskani emas, balki tabiat bilan uyg'unlikda yangilanish maskanidir.
              Biz har bir mehmonga shinam yog'och chaletlar, o'tinli kamin issig'i, toza tog' archasi nafasi
              va eng yuqori darajadagi shaxsiy servisni taqdim etamiz.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl glass-card hover:scale-[1.02] transition-transform shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#1b382b] text-[#d8aa62] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#18221b] mb-1">{item.title}</h4>
                      <p className="text-[11px] text-[#5e6962] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read more button */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b382b] text-white hover:bg-[#12281e] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>Xonalarni Ko'rish</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d8aa62]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1b382b] hover:text-[#b88a44] transition-colors"
              >
                <span>Biz bilan bog'lanish →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain, Trees, ShieldCheck, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutSection() {
  const { t, lang } = useLanguage();

  const highlights = [
    {
      icon: Trees,
      title: t.about.feature1Title,
      desc: t.about.feature1Desc
    },
    {
      icon: Mountain,
      title: t.about.feature2Title,
      desc: t.about.feature2Desc
    },
    {
      icon: ShieldCheck,
      title: t.about.feature3Title,
      desc: t.about.feature3Desc
    },
    {
      icon: HeartHandshake,
      title: t.about.feature4Title,
      desc: t.about.feature4Desc
    }
  ];

  return (
    <section className="py-24 bg-[#f8f5ee] dark:bg-[#091610] relative overflow-hidden">
      <div className="resort-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Visual Collage */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                alt="Zilva Resort"
                className="w-full h-[420px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlapping small image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 z-20 w-64 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
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
                <span className="block text-[11px] text-white/80 uppercase tracking-wider">
                  {lang === 'RU' ? 'Вершины Чимгана' : lang === 'EN' ? 'Chimgan Peaks' : "Chimgan Cho'qqilari"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 dark:bg-white/10 text-[#1b382b] dark:text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
              <span>{t.about.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] dark:text-white leading-tight">
              {t.about.heading}
            </h2>

            <p className="text-sm sm:text-base text-[#5e6962] dark:text-white/80 leading-relaxed font-light">
              {t.about.desc1}
            </p>

            <p className="text-sm sm:text-base text-[#5e6962] dark:text-white/80 leading-relaxed font-light">
              {t.about.desc2}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl glass-card bg-white dark:bg-[#11271d]/60 border border-[#dfd8cb]/60 dark:border-white/10 hover:scale-[1.02] transition-transform shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#1b382b] text-[#d8aa62] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#18221b] dark:text-white mb-1">{item.title}</h4>
                      <p className="text-[11px] text-[#5e6962] dark:text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read more button */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b382b] dark:bg-[#d8aa62] text-white dark:text-[#0d1e16] hover:opacity-90 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>{t.featuredRooms.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1b382b] dark:text-[#d8aa62] hover:underline transition-colors"
              >
                <span>{t.nav.contact} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

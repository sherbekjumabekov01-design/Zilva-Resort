'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { spaServices } from '@/data/spa';
import { useLanguage } from '@/context/LanguageContext';

export default function SpaHighlight() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 bg-[#12241b] text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1b382b]/60 via-transparent to-transparent opacity-50" />

      <div className="resort-container relative z-10 space-y-16">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.spa.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {t.spa.heading}
            </h2>
          </div>

          <div className="space-y-4 lg:pl-6">
            <p className="text-sm text-white/75 font-light leading-relaxed">
              {t.spa.desc}
            </p>
            <Link
              href="/spa"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d8aa62] hover:text-white font-semibold transition-colors group"
            >
              <span>{t.spa.moreBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Showcase Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spaServices.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group glass-card-interactive rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 hover:border-[#d8aa62]/60 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1b382b]/90 backdrop-blur-md text-[#d8aa62] text-[11px] font-semibold">
                  {item.isIncluded ? "✓ Xona narxiga kiritilgan" : "Pullik xizmat"}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d8aa62] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/70 font-light mt-1.5 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  {item.features.slice(0, 2).map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#d8aa62] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

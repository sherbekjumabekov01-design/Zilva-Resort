'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote, Sparkles } from 'lucide-react';
import { reviewsData } from '@/data/reviews';
import { useLanguage } from '@/context/LanguageContext';

export default function ReviewsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#f8f5ee] dark:bg-[#091610] relative">
      <div className="resort-container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 dark:bg-white/10 text-[#1b382b] dark:text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
            <span>{t.reviews.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b] dark:text-white">
            {t.reviews.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/70 font-light">
            {t.reviews.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-interactive p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 border border-white/50 dark:border-white/15"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d8aa62] text-[#d8aa62]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#d8aa62]/30" />
                </div>

                <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/80 font-light leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#dfd8cb]/80 dark:border-white/10 flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.author}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover border border-[#d8aa62]/40 shadow-sm"
                  unoptimized
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#18221b] dark:text-white">{item.author}</h4>
                  <span className="text-[11px] text-[#5e6962] dark:text-white/60 block">
                    {item.city} • <span className="text-[#d8aa62] font-medium">{item.roomType}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

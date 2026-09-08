'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UtensilsCrossed, Clock, ArrowRight } from 'lucide-react';
import { menuItems } from '@/data/restaurant';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function RestaurantHighlight() {
  const { t } = useLanguage();
  const specials = menuItems.filter(m => m.isChefSpecial).slice(0, 3);

  return (
    <section className="py-24 bg-[#f8f5ee] dark:bg-[#07110c] relative">
      <div className="resort-container space-y-16">
        {/* Banner with Restaurant Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#dfd8cb] dark:border-white/10 min-h-[440px] flex items-center p-8 sm:p-14 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12241b] via-[#12241b]/80 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{t.restaurant.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              {t.restaurant.heading}
            </h2>

            <p className="text-sm text-white/80 font-light leading-relaxed">
              {t.restaurant.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/restaurant"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-btn-gold text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{t.restaurant.menuBtn}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <div className="flex items-center gap-2 text-xs text-white/80 glass-pill px-3.5 py-2 rounded-full">
                <Clock className="w-4 h-4 text-[#d8aa62]" />
                <span>07:30 – 23:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Chef Specials Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18221b] dark:text-white">
               Bosh Oshpazdan Tavsiyalar
             </h3>
             <p className="text-xs sm:text-sm text-[#5e6962] dark:text-white/70">
               Mehmonlarimiz tomonidan eng ko&apos;p sevilgan va yuqori baholangan mualliflik taomlari
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {specials.map((dish) => (
               <div
                 key={dish.id}
                 className="group glass-card glass-card-interactive rounded-3xl overflow-hidden p-5 flex flex-col justify-between shadow-xl border border-white/40 dark:border-white/15"
               >
                 <div className="space-y-4">
                   <div className="relative h-48 rounded-2xl overflow-hidden bg-neutral-100">
                     <Image
                       src={dish.image}
                       alt={dish.name}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                       unoptimized
                     />
                     <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full glass-btn-gold text-white text-[10px] font-bold z-10">
                       Chef Special
                     </span>
                   </div>

                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#18221b] dark:text-white group-hover:text-[#b88a44] transition-colors">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-[#5e6962] dark:text-white/70 font-light mt-1 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#dfd8cb]/80 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#5e6962] dark:text-white/60">{dish.weight}</span>
                  <span className="font-serif font-bold text-base text-[#1b382b] dark:text-[#d8aa62]">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

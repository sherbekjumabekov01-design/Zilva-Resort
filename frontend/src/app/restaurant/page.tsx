'use client';

import React, { useState } from 'react';
import { UtensilsCrossed, Clock, Phone, Send, Sparkles, Coffee, Wine, ChefHat } from 'lucide-react';
import { restaurantInfo, menuCategories, menuItems } from '@/data/restaurant';
import { formatCurrency } from '@/lib/utils';
import { siteSettings } from '@/data/site-settings';

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Hero Banner */}
      <div className="relative min-h-[460px] bg-[#12241b] text-white flex items-center justify-center py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12241b] via-[#12241b]/70 to-transparent" />

        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Panoramik Restoran & Terassa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
            {restaurantInfo.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            {restaurantInfo.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d8aa62]" />
              <span>{restaurantInfo.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#d8aa62]" />
              <a href={`tel:${siteSettings.phone}`} className="hover:underline">{siteSettings.phone}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="resort-container py-16 space-y-16">
        {/* Working Hours & Atmosphere Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card space-y-2 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b88a44]">
              <Coffee className="w-4 h-4" />
              <span>Nonushta (Shved stoli)</span>
            </div>
            <p className="font-serif font-bold text-xl text-[#18221b]">{restaurantInfo.breakfastHours}</p>
            <p className="text-xs text-[#5e6962]">Tog' asalidan tortib pishiriqlargacha to'liq to'plam</p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-2 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b88a44]">
              <ChefHat className="w-4 h-4" />
              <span>Tushlik & A la Carte</span>
            </div>
            <p className="font-serif font-bold text-xl text-[#18221b]">{restaurantInfo.lunchHours}</p>
            <p className="text-xs text-[#5e6962]">Tog' sho'rvalari, issiq taomlar va yangi salatlar</p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-2 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b88a44]">
              <Wine className="w-4 h-4" />
              <span>Kechki Ovqat & Grill</span>
            </div>
            <p className="font-serif font-bold text-xl text-[#18221b]">{restaurantInfo.dinnerHours}</p>
            <p className="text-xs text-[#5e6962]">O'tinli olovda qovurilgan go'shtlar va qizil vinolar</p>
          </div>
        </div>

        {/* Atmosphere Gallery */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#18221b]">
              Restoran Muhiti
            </h2>
            <p className="text-xs sm:text-sm text-[#5e6962]">
              Tog' shamoli, sokin fon musiqasi va keng panoramali zallar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {restaurantInfo.atmosphereImages.map((img, i) => (
              <div key={i} className="group relative h-64 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-white text-xs font-semibold">
                  {img.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Menu Section */}
        <div className="space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
                <span>Restoran Menyusi</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#18221b]">
                Nafis Taomlar & Ichimliklar
              </h2>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#1b382b] text-white shadow-sm'
                      : 'bg-white text-[#5e6962] border border-[#dfd8cb] hover:bg-[#dfd8cb] hover:text-[#18221b]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((dish) => (
              <div
                key={dish.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#dfd8cb] p-4 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-neutral-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {dish.isChefSpecial && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#b88a44] text-white text-[10px] font-semibold">
                        Chef Special
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#18221b] group-hover:text-[#1b382b] transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-[#5e6962] font-light mt-1 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#dfd8cb] flex items-center justify-between">
                  <span className="text-xs text-[#5e6962] font-medium">{dish.weight}</span>
                  <span className="font-serif font-bold text-lg text-[#1b382b]">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Reservation Callout */}
        <div className="bg-[#12241b] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Stol Band Qilish yoki Maxsus Banket
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl font-light">
              Tug'ilgan kun, romantik kechki ovqat yoki oilaviy tantanalar uchun terassadagi eng go'zal joylarni oldindan band qiling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={`tel:${siteSettings.phone}`}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b88a44] to-[#c79a55] text-white font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Qo'ng'iroq qilish: {siteSettings.phone}</span>
            </a>
            <a
              href={siteSettings.telegram}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Telegram orqali yozish</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { reviewsData } from '@/data/reviews';

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-[#f8f5ee] relative">
      <div className="resort-container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
            <span>Mehmonlarimiz Fikrlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b]">
            Samimiy Xotiralar va <br />
            <span className="italic font-serif text-[#1b382b]">Yuqori Baholar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-interactive p-8 rounded-3xl shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#b88a44] text-[#b88a44]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#dfd8cb]" />
                </div>

                <p className="text-xs sm:text-sm text-[#5e6962] font-light leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#dfd8cb] flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-[#dfd8cb]"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#18221b]">{item.author}</h4>
                  <span className="text-[11px] text-[#5e6962] block">
                    {item.city} • <span className="text-[#b88a44]">{item.roomType}</span>
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

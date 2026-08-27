import React from 'react';
import Link from 'next/link';
import { Film, Gamepad2, Compass, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { activitiesData } from '@/data/activities';

export default function ActivitiesHighlight() {
  return (
    <section className="py-24 bg-white relative">
      <div className="resort-container space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b382b]/10 text-[#1b382b] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b88a44]" />
              <span>Faoliyatlar & Ko'ngilochar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#18221b]">
              Har Bir Lahzasi Qiziqarli <br />
              <span className="italic font-serif text-[#1b382b]">Tog' Sarguzashtlari</span>
            </h2>
            <p className="text-sm text-[#5e6962] font-light leading-relaxed">
              Shaxsiy kinozaldan tortib PlayStation VIP zonasigacha, oqshom gulxani va piyoda tog' so'qmoqlari.
            </p>
          </div>

          <Link
            href="/activities"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1b382b] text-[#1b382b] hover:bg-[#1b382b] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start md:self-auto group"
          >
            <span>Barcha Faoliyatlarni Ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Activities 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activitiesData.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group bg-[#f8f5ee] rounded-3xl overflow-hidden border border-[#dfd8cb] hover:border-[#b88a44] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#1b382b]/90 backdrop-blur-md text-white text-[10px] font-semibold">
                  {item.isFree ? "Bepul" : "Pullik"}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#18221b] group-hover:text-[#1b382b] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5e6962] font-light mt-1 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#dfd8cb] text-[11px] text-[#5e6962]">
                  <span>Vaqt: {item.timeSlot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { siteSettings } from '@/data/site-settings';

export const metadata = {
  title: `Maxfiylik Siyosati — ${siteSettings.resortName}`,
  description: `${siteSettings.resortName} maxfiylik siyosati va shaxsiy ma'lumotlarni himoya qilish tartibi.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Header */}
      <div className="bg-[#12241b] text-white py-16 mb-12 border-b border-white/10 relative overflow-hidden">
        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Xavfsizlik & Huquq</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Maxfiylik Siyosati
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Sizning shaxsiy ma'lumotlaringiz daxlsizligi biz uchun oliy qadriyatdir.
          </p>
        </div>
      </div>

      <div className="resort-container max-w-4xl space-y-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 text-sm text-[#5e6962] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#b88a44]" />
              <span>1. Umumiy Qoidalar</span>
            </h2>
            <p>
              Ushbu Maxfiylik siyosati <strong>{siteSettings.resortName}</strong> (bundan keyin "Resort") sayti orqali foydalanuvchilar tomonidan taqdim etilgan barcha shaxsiy ma'lumotlarni yig'ish, qayta ishlash va himoya qilish tartibini belgilaydi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#b88a44]" />
              <span>2. Qanday ma'lumotlar yig'iladi?</span>
            </h2>
            <p>
              Xona bron qilish yoki aloqa formasini to'ldirish vaqtida quyidagi ma'lumotlar so'ralishi mumkin:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>To'liq ism-familiya (F.I.Sh.);</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Telefon raqami (menejer bog'lanishi uchun);</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Elektron pochta manzili (ixtiyoriy, tasdiq xati uchun);</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Kelish va ketish sanalari hamda mehmonlar soni.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#b88a44]" />
              <span>3. Ma'lumotlardan foydalanish maqsadi</span>
            </h2>
            <p>
              Yig'ilgan ma'lumotlar faqatgina quyidagi maqsadlarda ishlatiladi:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Xona bandligini tekshirish va mehmon bilan bog'lanib buyurtmani tasdiqlash;</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Mijozlar bilan aloqa sifatini yaxshilash va xizmat ko'rsatish.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#b88a44]" />
              <span>4. Ma'lumotlar xavfsizligi va uchinchi shaxslar</span>
            </h2>
            <p>
              Biz sizning ma'lumotlaringizni uchinchi shaxslarga sotmaymiz, ijaraga bermaymiz va oshkor qilmaymiz (O'zbekiston Respublikasi qonunchiligida belgilangan hollar bundan mustasno). Barcha ma'lumotlar shifrlangan xavfsiz serverlarda saqlanadi.
            </p>
          </section>

          <div className="pt-6 border-t border-[#dfd8cb] flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1b382b] hover:text-[#b88a44] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
            <span className="text-xs text-[#5e6962]">Oxirgi yangilanish: 2026-yil</span>
          </div>
        </div>
      </div>
    </div>
  );
}

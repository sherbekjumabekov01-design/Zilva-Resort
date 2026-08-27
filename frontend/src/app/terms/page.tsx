import React from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { siteSettings } from '@/data/site-settings';

export const metadata = {
  title: `Foydalanish Shartlari & Bronlash Qoidalari — ${siteSettings.resortName}`,
  description: `${siteSettings.resortName} xonalarini bron qilish, bekor qilish va yashash shartlari.`,
};

export default function TermsPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-[#f8f5ee] min-h-screen">
      {/* Header */}
      <div className="bg-[#12241b] text-white py-16 mb-12 border-b border-white/10 relative overflow-hidden">
        <div className="resort-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#d8aa62] text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Qoidalar & Nizom</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Foydalanish va Bronlash Shartlari
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Zilva Resort & Spa maskanida osoyishta va qulay dam olish uchun belgilangan tartib-qoidalar.
          </p>
        </div>
      </div>

      <div className="resort-container max-w-4xl space-y-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 text-sm text-[#5e6962] leading-relaxed">
          {/* Important MVP Disclaimer Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-[#b88a44] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium">
              <strong>Muhim eslatma:</strong> Sayt orqali so‘rov yuborilishi xona avtomatik bron qilinganini anglatmaydi. Menejer mavjudlikni tekshirib, 15 daqiqa ichida siz bilan bog‘lanadi va buyurtmani tasdiqlaydi.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#b88a44]" />
              <span>1. Joylashish va Chiqish Vaqtlari (Check-in / Check-out)</span>
            </h2>
            <ul className="space-y-2 pl-4">
              <li><strong>Kelish vaqti (Check-in):</strong> Soat 14:00 dan boshlab;</li>
              <li><strong>Ketish vaqti (Check-out):</strong> Soat 12:00 gacha;</li>
              <li>Erta kirish yoki kechroq chiqish oldindan kelishuv va xona bo'shligiga qarab amalga oshiriladi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#b88a44]" />
              <span>2. Bronlash va To'lov Tartibi</span>
            </h2>
            <p>
              Xona bandligini kafolatlash uchun bron so'rovi tasdiqlangandan so'ng 30% avans to'lovi qilinishi mumkin. Qolgan summa joylashish vaqtida qabulxonada to'lanadi (Naqd, Uzcard, Humo, Visa, Mastercard).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#b88a44]" />
              <span>3. Bekor Qilish Siyosati (Cancellation Policy)</span>
            </h2>
            <ul className="space-y-2 pl-4">
              <li>Kelish sanasidan kamida 48 soat oldin bekor qilinsa, avans to'lovi to'liq qaytariladi.</li>
              <li>48 soatdan kam vaqt qolganda bekor qilinsa, 1 kunlik yashash summasi ushlab qolinishi mumkin.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#18221b] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#b88a44]" />
              <span>4. Resort Hududidagi Ichki Tartib</span>
            </h2>
            <p>
              Resort osoyishta oilaviy va relaksatsion dam olish maskani hisoblanadi. Soat 23:00 dan so'ng baland ovozda musiqa tinglash va boshqa mehmonlar osoyishtaligini buzish taqiqlanadi.
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

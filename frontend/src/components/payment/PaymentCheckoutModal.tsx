'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/utils';

export type PaymentProvider = 'click' | 'payme' | 'uzum' | 'card' | 'reception';
export type PaymentDeposit = '20' | '50' | '100' | '0';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId?: number | string;
    roomName: string;
    fullName: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
  };
  onPaymentSuccess?: (paymentInfo: { provider: PaymentProvider; amount: number; transactionId: string }) => void;
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess
}: PaymentCheckoutModalProps) {
  const { lang } = useLanguage();

  const [provider, setProvider] = useState<PaymentProvider>('click');
  const [deposit, setDeposit] = useState<PaymentDeposit>('20');
  const [step, setStep] = useState<'plan' | 'card_input' | 'otp' | 'receipt'>('plan');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const total = bookingDetails.totalAmount || 1800000;
  const depositPercent = parseInt(deposit, 10);
  const payableAmount = deposit === '0' ? 0 : Math.round((total * depositPercent) / 100);
  const remainingAmount = total - payableAmount;

  const handleStartPayment = () => {
    if (provider === 'reception' || deposit === '0') {
      // Pay on arrival
      const txId = `ZLV-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(txId);
      setStep('receipt');
      if (onPaymentSuccess) {
        onPaymentSuccess({ provider: 'reception', amount: 0, transactionId: txId });
      }
      return;
    }
    setStep('card_input');
  };

  const handleProcessCard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const txId = `ZLV-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(txId);
      setStep('receipt');
      if (onPaymentSuccess) {
        onPaymentSuccess({ provider, amount: payableAmount, transactionId: txId });
      }
    }, 1200);
  };

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f2319] text-white w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#142e21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b88a44]/20 border border-[#b88a44]/40 flex items-center justify-center text-[#d8aa62]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#d8aa62] font-semibold uppercase tracking-widest block">
                Zilva Secure Payment
              </span>
              <h3 className="font-serif font-bold text-lg text-white">
                {step === 'receipt'
                  ? (lang === 'RU' ? 'Электронный чек' : lang === 'EN' ? 'Payment Receipt' : 'To‘lov Cheki')
                  : (lang === 'RU' ? 'Онлайн оплата и бронь' : lang === 'EN' ? 'Online Payment & Booking' : 'Onlayn To‘lov va Kafolat')}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Step 1: Plan & Provider Selection */}
          {step === 'plan' && (
            <div className="space-y-6">
              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-white/80">
                  <span>{lang === 'RU' ? 'Номер / Коттедж:' : lang === 'EN' ? 'Room / Cottage:' : 'Xona / Kottej:'}</span>
                  <span className="font-bold text-white">{bookingDetails.roomName}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{lang === 'RU' ? 'Даты проживания:' : lang === 'EN' ? 'Stay Dates:' : 'Yashash sanalari:'}</span>
                  <span className="text-white">{bookingDetails.checkIn} — {bookingDetails.checkOut}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm">
                  <span className="font-semibold text-white">{lang === 'RU' ? 'Итого к оплате:' : lang === 'EN' ? 'Total Amount:' : 'Umumiy hisob:'}</span>
                  <span className="font-serif font-bold text-[#d8aa62] text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Payment Type Selection (Avans vs Full) */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                  {lang === 'RU' ? 'Выберите размер предоплаты:' : lang === 'EN' ? 'Choose prepayment plan:' : 'To‘lov turini tanlang:'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeposit('20')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      deposit === '20'
                        ? 'bg-[#b88a44]/30 border-[#d8aa62] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold text-sm text-[#d8aa62]">20% Avans</span>
                    <span className="text-[11px] block mt-0.5">{formatCurrency((total * 20) / 100)}</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">✓ Tavsiya etiladi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeposit('50')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      deposit === '50'
                        ? 'bg-[#b88a44]/30 border-[#d8aa62] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold text-sm text-[#d8aa62]">50% Avans</span>
                    <span className="text-[11px] block mt-0.5">{formatCurrency((total * 50) / 100)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeposit('100')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      deposit === '100'
                        ? 'bg-[#b88a44]/30 border-[#d8aa62] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold text-sm text-[#d8aa62]">100% To‘liq</span>
                    <span className="text-[11px] block mt-0.5">{formatCurrency(total)}</span>
                  </button>
                </div>
              </div>

              {/* Payment Provider Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                  {lang === 'RU' ? 'Выберите платежную систему:' : lang === 'EN' ? 'Select Payment Method:' : 'To‘lov tizimini tanlang:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Click */}
                  <button
                    type="button"
                    onClick={() => setProvider('click')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      provider === 'click'
                        ? 'bg-[#0084d6]/25 border-[#0084d6] text-white ring-1 ring-[#0084d6]'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0084d6] text-white flex items-center justify-center font-bold text-xs">
                      CL
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm block">Click Up</span>
                      <span className="text-[10px] text-white/60">0% komissiya</span>
                    </div>
                  </button>

                  {/* Payme */}
                  <button
                    type="button"
                    onClick={() => setProvider('payme')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      provider === 'payme'
                        ? 'bg-[#00cccc]/25 border-[#00cccc] text-white ring-1 ring-[#00cccc]'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#00cccc] text-black flex items-center justify-center font-bold text-xs">
                      PM
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm block">Payme</span>
                      <span className="text-[10px] text-white/60">Tezkor to‘lov</span>
                    </div>
                  </button>

                  {/* Uzum */}
                  <button
                    type="button"
                    onClick={() => setProvider('uzum')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      provider === 'uzum'
                        ? 'bg-[#7000ff]/25 border-[#7000ff] text-white ring-1 ring-[#7000ff]'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#7000ff] text-white flex items-center justify-center font-bold text-xs">
                      UZ
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm block">Uzum Bank</span>
                      <span className="text-[10px] text-white/60">Uzum Pay</span>
                    </div>
                  </button>

                  {/* UzCard / Humo / Visa */}
                  <button
                    type="button"
                    onClick={() => setProvider('card')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      provider === 'card'
                        ? 'bg-[#b88a44]/25 border-[#d8aa62] text-white ring-1 ring-[#d8aa62]'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#b88a44] text-white flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm block">Karta orqali</span>
                      <span className="text-[10px] text-white/60">UzCard/Humo/Visa</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handleStartPayment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white font-bold text-center uppercase tracking-wider text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>
                  {deposit === '0'
                    ? (lang === 'RU' ? 'Подтвердить бронь без оплаты' : lang === 'EN' ? 'Confirm without payment' : 'Oldindan to‘lovsiz bron qilish')
                    : (lang === 'RU' ? `Оплатить ${formatCurrency(payableAmount)}` : lang === 'EN' ? `Pay ${formatCurrency(payableAmount)}` : `${formatCurrency(payableAmount)} to‘lash`)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Card Credentials Form */}
          {step === 'card_input' && (
            <form onSubmit={handleProcessCard} className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b382b] to-[#0c1c15] border border-white/15 space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-white/60 text-xs">
                  <span>{provider.toUpperCase()} SECURE CHECKOUT</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">Karta Raqami</label>
                  <input
                    type="text"
                    required
                    placeholder="8600 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white font-mono tracking-widest text-base focus:border-[#d8aa62] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/70 block">Muddati (MM/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-center text-base focus:border-[#d8aa62] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/70 block">To‘lov summasi</label>
                    <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-amber-300 font-bold text-center text-base">
                      {formatCurrency(payableAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="w-1/3 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || cardNumber.length < 19 || cardExpiry.length < 5}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] disabled:opacity-50 text-white font-bold text-center uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Bog‘lanmoqda...' : 'SMS Kodni Olish'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: SMS OTP verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">SMS Tasdiqlash Kodi</h4>
                <p className="text-xs text-white/70">
                  Kartangizga biriktirilgan telefon raqamiga yuborilgan 4 xonali kodni kiriting (Test kodi: <b>4488</b>)
                </p>
              </div>

              <input
                type="text"
                required
                maxLength={4}
                placeholder="4488"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-40 mx-auto px-4 py-3 rounded-2xl bg-black/50 border border-white/25 text-white font-mono text-center text-2xl tracking-[0.5em] focus:border-[#d8aa62] focus:outline-none"
              />

              <button
                type="submit"
                disabled={isProcessing || otpCode.length < 4}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-bold text-center uppercase tracking-wider text-xs shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'To‘lov amalga oshirilmoqda...' : 'To‘lovni Tasdiqlash'}
              </button>
            </form>
          )}

          {/* Step 4: Electronic Receipt (E-Chek) */}
          {step === 'receipt' && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-white">
                  {deposit === '0' ? 'Bron Muvaffaqiyatli Qabul Qilindi!' : 'To‘lov Muvaffaqiyatli Bajarildi!'}
                </h4>
                <p className="text-xs text-white/70">
                  Xona siz uchun kafolatlangan holda band qilindi. Menejerimiz tez orada bog‘lanadi.
                </p>
              </div>

              {/* Printable Official E-Receipt Box */}
              <div className="p-5 rounded-2xl bg-white text-[#18221b] space-y-4 shadow-xl border border-[#dfd8cb]">
                <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                  <div>
                    <h5 className="font-serif font-bold text-base tracking-wider text-[#12241b]">ZILVA RESORT & SPA</h5>
                    <span className="text-[10px] text-neutral-500 block">Chimgan tog‘lari, Bo‘stonliq tumani</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 block">Chek № {transactionId}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ TO‘LANDI</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Mehmon:</span>
                    <span className="font-semibold">{bookingDetails.fullName || 'Mehmon'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Telefon:</span>
                    <span className="font-semibold">{bookingDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Xona:</span>
                    <span className="font-semibold">{bookingDetails.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Sana:</span>
                    <span>{bookingDetails.checkIn} — {bookingDetails.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">To‘lov tizimi:</span>
                    <span className="uppercase font-bold text-neutral-900">{provider}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-neutral-300 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-sm text-[#18221b]">
                    <span>To‘langan avans:</span>
                    <span className="text-emerald-700">{formatCurrency(payableAmount)}</span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-neutral-500 text-[11px]">
                      <span>Chek-in paytida qolgan summa:</span>
                      <span>{formatCurrency(remainingAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close / Done Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Oynani Yopish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, KeyRound, Lock, ArrowRight, Mountain, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { loginAdmin, isAdminAuthenticated } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!pin.trim()) {
      setErrorMessage("Iltimos, PIN-kodni kiriting.");
      return;
    }

    setIsLoading(true);
    const res = await loginAdmin({ pin });
    setIsLoading(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMessage(res.message || "PIN-kod noto'g'ri.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Iltimos, login va parolni to'liq kiriting.");
      return;
    }

    setIsLoading(true);
    const res = await loginAdmin({ username, password });
    setIsLoading(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMessage(res.message || "Login yoki parol noto'g'ri.");
    }
  };

  return (
    <div className="min-h-screen bg-[#12241b] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d8aa62]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1b382b]/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/30 dark:border-white/10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1b382b] text-[#d8aa62] mx-auto flex items-center justify-center shadow-md border border-[#d8aa62]/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#18221b]">
            Zilva Resort
          </h1>
          <p className="text-xs text-[#5e6962] font-medium tracking-wide uppercase">
            Boshqaruv Markaziga Kirish
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f8f5ee] border border-[#dfd8cb] text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setLoginMethod('pin'); setErrorMessage(''); }}
            className={`py-2 rounded-xl transition-all ${
              loginMethod === 'pin'
                ? 'bg-[#1b382b] text-white shadow-sm'
                : 'text-[#5e6962] hover:text-[#18221b]'
            }`}
          >
            Tezkor PIN-kod
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
            className={`py-2 rounded-xl transition-all ${
              loginMethod === 'password'
                ? 'bg-[#1b382b] text-white shadow-sm'
                : 'text-[#5e6962] hover:text-[#18221b]'
            }`}
          >
            Login & Parol
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PIN Form */}
        {loginMethod === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-[#18221b] uppercase tracking-wider">
                4 xonali Admin PIN-kodni kiriting
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[0.6em] text-3xl font-mono py-3 pr-12 rounded-2xl border-2 border-[#dfd8cb] focus:border-[#1b382b] focus:outline-none transition-colors text-[#18221b]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[#18221b] transition-colors"
                  title={showPin ? "Yashirish" : "Ko'rsatish"}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-[#b88a44]" />}
                </button>
              </div>
              <span className="text-[11px] text-gray-500 block">Standart PIN-kod: <strong>7788</strong> yoki <strong>1234</strong></span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Tekshirilmoqda..." : "Panelga Kirish"}</span>
              <ArrowRight className="w-4 h-4 text-[#d8aa62]" />
            </button>
          </form>
        ) : (
          /* Password Form */
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5e6962]">
                Foydalanuvchi nomi
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5e6962]">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#dfd8cb] text-sm text-[#18221b] focus:ring-2 focus:ring-[#1b382b] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#18221b] transition-colors"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish (Ko'zcha)"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#b88a44]" />
                  )}
                </button>
              </div>
              <span className="text-[10px] text-gray-500 block">Standart parol: <strong>zilva2026!admin</strong></span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1b382b] to-[#2c5844] hover:from-[#12281e] hover:to-[#1b382b] text-white font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 pt-3"
            >
              <span>{isLoading ? "Kirilmoqda..." : "Tizimga Kirish"}</span>
              <ArrowRight className="w-4 h-4 text-[#d8aa62]" />
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-[#dfd8cb]">
          <Link
            href="/"
            className="text-xs text-[#b88a44] hover:text-[#9c7334] font-medium transition-colors inline-flex items-center gap-1"
          >
            <span>← Asosiy saytga qaytish</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

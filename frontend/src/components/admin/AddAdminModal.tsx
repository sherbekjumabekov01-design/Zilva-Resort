'use client';

import React, { useState } from 'react';
import { UserPlus, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { createAdminUser } from '@/lib/api';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('7788');
  const [role, setRole] = useState('Manager');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    setActionError(null);
    setIsSubmitting(true);

    const res = await createAdminUser({
      username,
      fullName,
      password,
      pinCode,
      role
    });

    setIsSubmitting(false);

    if (res.success) {
      setActionMessage(res.message);
      setFullName('');
      setUsername('');
      setPassword('');
      setPinCode('7788');
      setRole('Manager');
      setTimeout(() => {
        setActionMessage(null);
        onSuccess();
        onClose();
      }, 1200);
    } else {
      setActionError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f2319] text-white w-full max-w-md rounded-3xl border border-white/20 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-[#d8aa62]" />
            <h3 className="font-serif font-bold text-lg text-white">Yangi Administrator Qo‘shish</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {actionMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {actionError && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-white/70 block uppercase font-semibold">F.I.SH (To‘liq ism)</label>
            <input
              type="text"
              required
              placeholder="Azizbek Rahimov"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-[#d8aa62] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 block uppercase font-semibold">Login (Username)</label>
            <input
              type="text"
              required
              placeholder="aziz_manager"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:border-[#d8aa62] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 block uppercase font-semibold">Rol (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:border-[#d8aa62] focus:outline-none"
            >
              <option value="SuperAdmin">SuperAdmin (To‘liq huquq)</option>
              <option value="Admin">Admin (Boshqaruv)</option>
              <option value="Manager">Manager (Bron va xonalar)</option>
              <option value="Receptionist">Receptionist (Qabulxona)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 block uppercase font-semibold">Parol</label>
              <input
                type="password"
                required
                placeholder="Parol kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono focus:border-[#d8aa62] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 block uppercase font-semibold">PIN-kod (4 xonali)</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="7788"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-center tracking-widest focus:border-[#d8aa62] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] disabled:opacity-50 text-white font-bold text-center uppercase tracking-wider text-xs shadow-lg transition-all mt-2"
          >
            {isSubmitting ? 'Saqlanmoqda...' : 'Yangi Adminni Saqlash'}
          </button>
        </form>
      </div>
    </div>
  );
};

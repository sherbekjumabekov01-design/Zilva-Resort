'use client';

import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { AdminUserRecord } from '@/lib/api';

interface AdminUsersTabProps {
  adminUsers: AdminUserRecord[];
  onOpenAddModal: () => void;
  onToggleAdminStatus: (id: number) => Promise<void>;
  onDeleteAdmin: (id: number, username: string) => Promise<void>;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  adminUsers,
  onOpenAddModal,
  onToggleAdminStatus,
  onDeleteAdmin
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Foydalanuvchilar & Rollar (RBAC)</h2>
          <p className="text-xs text-white/60 mt-0.5">Tizim administratorlari, rollari va kirish huquqlari</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#b88a44] to-[#c79a55] hover:from-[#a77a35] hover:to-[#b88a44] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yangi Admin Qo‘shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminUsers.map((user) => (
          <div key={user.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d8aa62]/20 border border-[#d8aa62]/40 flex items-center justify-center text-[#d8aa62] font-bold text-sm">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{user.fullName}</h4>
                    <span className="text-xs text-white/60 font-mono">@{user.username}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  user.role === 'SuperAdmin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : user.role === 'Admin'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-[#d8aa62]/20 text-[#d8aa62] border border-[#d8aa62]/40'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1 font-mono text-white/70">
                <div className="flex justify-between">
                  <span>PIN-kod:</span>
                  <span className="text-amber-300 font-bold">{user.pinCode || '7788'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Holati:</span>
                  <span className={user.isActive ? 'text-emerald-400' : 'text-rose-400'}>
                    {user.isActive ? '● Faol' : '● Bloklangan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => onToggleAdminStatus(user.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  user.isActive
                    ? 'bg-white/10 hover:bg-white/20 text-white/80'
                    : 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50'
                }`}
              >
                {user.isActive ? 'Bloklash' : 'Faollashtirish'}
              </button>

              {adminUsers.length > 1 && (
                <button
                  onClick={() => onDeleteAdmin(user.id, user.username)}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ContactRequestRecord } from '@/types';

interface AdminContactsTabProps {
  contacts: ContactRequestRecord[];
}

export const AdminContactsTab: React.FC<AdminContactsTabProps> = ({ contacts }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h2 className="font-serif text-xl font-bold text-white">Mehmonlar Murojaatlari</h2>
        <p className="text-xs text-white/60 mt-0.5">Aloqa sahifasidan yuborilgan xabarlar</p>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-xs text-white/50 text-center py-8">Hozircha hech qanday murojaat yo‘q</p>
        ) : (
          contacts.map((c) => (
            <div key={c.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{c.fullName}</h4>
                  <span className="text-xs text-white/60">{c.phone} {c.email ? `• ${c.email}` : ''}</span>
                </div>
                <span className="text-[11px] font-mono text-white/40">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/90 leading-relaxed">
                <span className="font-bold text-[#d8aa62] block mb-1">{c.subject}</span>
                <p>{c.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

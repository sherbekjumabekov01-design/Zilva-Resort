'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { AuditLogRecord } from '@/lib/api';

interface AdminAuditLogsTabProps {
  auditLogs: AuditLogRecord[];
  auditFilter: string;
  setAuditFilter: (val: string) => void;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({
  auditLogs,
  auditFilter,
  setAuditFilter
}) => {
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditFilter) return true;
    const q = auditFilter.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entityName.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Xavfsizlik & Audit Loglari</h2>
          <p className="text-xs text-white/60 mt-0.5">Tizimda amalga oshirilgan barcha harakatlar xronologiyasi</p>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
          <input
            type="text"
            placeholder="Amal yoki foydalanuvchini qidirish..."
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder:text-white/40 focus:border-[#d8aa62] focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-white/80">
          <thead className="bg-white/5 uppercase text-[10px] text-white/50 tracking-wider">
            <tr>
              <th className="p-3.5 rounded-l-xl">Vaqt</th>
              <th className="p-3.5">Foydalanuvchi</th>
              <th className="p-3.5">Amal (Action)</th>
              <th className="p-3.5">Resurs (Entity)</th>
              <th className="p-3.5">Tafsilotlar</th>
              <th className="p-3.5 rounded-r-xl">IP Manzil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAuditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-mono text-white/50 text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3.5 font-bold text-[#d8aa62]">{log.userName}</td>
                <td className="p-3.5 font-mono text-emerald-400">{log.action}</td>
                <td className="p-3.5 text-white/60">{log.entityName}</td>
                <td className="p-3.5 text-white/80 max-w-xs truncate">{log.details || '—'}</td>
                <td className="p-3.5 font-mono text-white/40 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

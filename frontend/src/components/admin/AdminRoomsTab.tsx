'use client';

import React from 'react';
import Image from 'next/image';
import { Edit3 } from 'lucide-react';
import { Room } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AdminRoomsTabProps {
  rooms: Room[];
  editingPriceId: number | null;
  tempPrice: string;
  setEditingPriceId: (id: number | null) => void;
  setTempPrice: (val: string) => void;
  onSavePrice: (id: number) => Promise<void>;
  onToggleRoom: (id: number) => Promise<void>;
}

export const AdminRoomsTab: React.FC<AdminRoomsTabProps> = ({
  rooms,
  editingPriceId,
  tempPrice,
  setEditingPriceId,
  setTempPrice,
  onSavePrice,
  onToggleRoom
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f2319] border border-white/10 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Xonalar & Kottejlar Katalogi</h2>
          <p className="text-xs text-white/60 mt-0.5">Narxlar va mavjudlik holatini boshqarish</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <Image
                  src={room.coverImage}
                  alt={room.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  room.isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {room.isAvailable ? 'Mavjud' : 'Yopiq'}
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-white">{room.name}</h4>
                <span className="text-xs text-[#d8aa62] font-semibold">{room.category}</span>
              </div>

              {editingPriceId === room.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    placeholder={room.pricePerNight.toString()}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-mono"
                  />
                  <button
                    onClick={() => onSavePrice(room.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-serif font-bold text-[#d8aa62]">{formatCurrency(room.pricePerNight)}</span>
                  <button
                    onClick={() => {
                      setEditingPriceId(room.id);
                      setTempPrice(room.pricePerNight.toString());
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onToggleRoom(room.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                  room.isAvailable
                    ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40'
                    : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40'
                }`}
              >
                {room.isAvailable ? 'Bandlikka yopish' : 'Bandlikka ochish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

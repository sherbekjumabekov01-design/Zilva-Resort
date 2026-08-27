'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  isOpen: boolean;
  selectedRoomId?: number;
  initialDates?: { checkIn: string; checkOut: string };
  openBookingModal: (roomId?: number, dates?: { checkIn: string; checkOut: string }) => void;
  closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined);
  const [initialDates, setInitialDates] = useState<{ checkIn: string; checkOut: string } | undefined>(undefined);

  const openBookingModal = (roomId?: number, dates?: { checkIn: string; checkOut: string }) => {
    setSelectedRoomId(roomId);
    setInitialDates(dates);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        selectedRoomId,
        initialDates,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

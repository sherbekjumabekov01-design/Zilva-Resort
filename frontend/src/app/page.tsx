import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickBookingBar from '@/components/home/QuickBookingBar';
import AboutSection from '@/components/home/AboutSection';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import SpaHighlight from '@/components/home/SpaHighlight';
import RestaurantHighlight from '@/components/home/RestaurantHighlight';
import ActivitiesHighlight from '@/components/home/ActivitiesHighlight';
import ReviewsSection from '@/components/home/ReviewsSection';
import LocationSection from '@/components/home/LocationSection';
import { fetchRooms } from '@/lib/api';

export default async function HomePage() {
  const rooms = await fetchRooms();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <QuickBookingBar />
      <AboutSection />
      <FeaturedRooms rooms={rooms} />
      <SpaHighlight />
      <RestaurantHighlight />
      <ActivitiesHighlight />
      <ReviewsSection />
      <LocationSection />
    </div>
  );
}

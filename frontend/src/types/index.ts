export interface Amenity {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface RoomImage {
  id: number;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

export interface Room {
  id: number;
  slug: string;
  name: string;
  category: 'Standard' | 'Deluxe' | 'Suite' | 'Chalet' | 'Family' | 'Villa' | string;
  shortDescription: string;
  description: string;
  pricePerNight: number;
  area: number; // m²
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  bedType: string;
  viewType: string;
  coverImage: string;
  isFeatured: boolean;
  isAvailable: boolean;
  breakfastIncluded: boolean;
  checkInTime: string;
  checkOutTime: string;
  rules: string[];
  images: RoomImage[];
  amenities: Amenity[];
}

export interface BookingRequestInput {
  fullName: string;
  phone: string;
  email?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomId?: number;
  roomName?: string;
  specialRequests?: string;
}

export interface BookingRequestRecord extends BookingRequestInput {
  id: number;
  roomName?: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'DepositPaid' | 'Cancelled';
  createdAt: string;
}

export interface ContactRequestInput {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export interface ContactRequestRecord extends ContactRequestInput {
  id: number;
  isRead: boolean;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'main' | 'grill' | 'dessert' | 'drinks' | 'kids';
  image: string;
  isChefSpecial?: boolean;
  weight?: string;
}

export interface SpaService {
  id: number;
  name: string;
  category: 'pool' | 'sauna' | 'massage' | 'therapy' | 'fitness';
  shortDescription: string;
  description: string;
  duration?: string;
  price?: number;
  isIncluded: boolean; // included in room price
  workingHours: string;
  image: string;
  features: string[];
}

export interface ActivityItem {
  id: number;
  title: string;
  category: 'indoor' | 'outdoor' | 'winter' | 'kids' | 'relax';
  description: string;
  image: string;
  timeSlot: string;
  suitableFor: string;
  isFree: boolean;
  priceNote?: string;
  highlights: string[];
}

export interface EventService {
  id: number;
  title: string;
  subtitle: string;
  capacity: string;
  description: string;
  image: string;
  equipment: string[];
  idealFor: string[];
}

export interface ReviewItem {
  id: number;
  author: string;
  city: string;
  rating: number;
  date: string;
  roomType: string;
  comment: string;
  avatar: string;
}

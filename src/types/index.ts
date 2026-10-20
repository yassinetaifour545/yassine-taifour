export type CarCategory = 'all' | 'economy' | 'sedan' | 'suv' | 'compact' | 'premium';

export interface Car {
  id: string;
  name: string;
  category: 'economy' | 'sedan' | 'suv' | 'compact' | 'premium';
  dailyRate: number; // in MAD (DH)
  marketRate: number; // Standard airport competitor rate in MAD
  transmission: 'Manual' | 'Automatic';
  fuel: 'Diesel' | 'Petrol' | 'Hybrid';
  seats: number;
  luggage: number;
  engine: string;
  hasAC: boolean;
  featured?: boolean;
  imageAccent: string; // Hex color for studio ambient glow
  silhouetteType: 'hatchback' | 'sedan' | 'suv' | 'crossover';
  image?: string;
}

export type Currency = 'MAD' | 'EUR' | 'USD';

export interface AddOn {
  id: string;
  name: string;
  pricePerDay: number; // in MAD
  description: string;
}

export interface BookingDetails {
  carId: string;
  carName: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  selectedAddOns: string[];
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  licenseNumber: string;
  flightNumber?: string;
  notes?: string;
  paymentMethod: 'arrival' | 'card';
  bookingId?: string;
  totalPrice?: number;
  days?: number;
  status?: 'confirmed' | 'pending' | 'completed';
  createdAt?: string;
}

export interface MoroccanLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  type: 'airport' | 'city_center';
  phone: string;
  coords: { lat: number; lng: number };
}

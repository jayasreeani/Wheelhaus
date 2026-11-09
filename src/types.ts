export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Bike';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  reg: string;
}

export type ServiceMode = 'walkin' | 'pickup' | 'home';

export type WashPackageId = 'ext' | 'int' | 'full' | 'cer';

export interface WashPackage {
  id: WashPackageId;
  name: string;
  mins: number;
  desc: string;
  centreOnly?: boolean;
}

export interface ModeConfig {
  on: boolean;
  fee: number;
  radius: number;
}

export interface Vendor {
  id: string;
  name: string;
  area: string;
  dist: number;
  rating: number;
  reviews: number;
  status: 'live' | 'pending';
  commission: number;
  hours: string;
  color: string;
  modes: {
    walkin: { on: boolean };
    pickup: { on: boolean; fee: number; radius: number };
    home: { on: boolean; fee: number; radius: number };
  };
  prices: Record<string, number[]>;
}

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'checked_in'
  | 'picked_up'
  | 'on_the_way'
  | 'in_progress'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'rejected'
  | 'expired';

export interface BookingReview {
  stars: number;
  text: string;
}

export interface Booking {
  id: number;
  customer: string;
  vendorId: string;
  pkg: WashPackageId;
  carType: VehicleType;
  mode: ServiceMode;
  slot: string;
  status: BookingStatus;
  base: number;
  modeFee: number;
  otp: string;
  address: string;
  createdAt: number;
  deadline: number | null;
  review?: BookingReview;
  driver?: {
    name: string;
    phone: string;
    reg: string;
  };
}

export type MainViewMode = 'apps' | 'customer' | 'vendor' | 'admin';

export type CustomerTab = 'home' | 'bookings' | 'profile';
export type CustomerScreen = 'home' | 'vendor' | 'book' | 'status' | 'compare';

export type VendorTab = 'req' | 'jobs' | 'svc' | 'earn';

export interface BookingFormData {
  step: 1 | 2;
  pkg: WashPackageId;
  mode: ServiceMode;
  day: number;
  slot: string | null;
  pay: 'UPI' | 'Card' | 'Pay at service';
  address: string;
}

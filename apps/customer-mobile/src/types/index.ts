export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Bike';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  reg: string;
  isDefault?: boolean;
}

export type ServiceMode = 'walkin' | 'pickup' | 'home';

export type WashPackageId = 'ext' | 'int' | 'full' | 'cer';

export interface WashPackage {
  id: WashPackageId;
  name: string;
  mins: number;
  desc: string;
  features: string[];
  centreOnly?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  area: string;
  dist: number;
  rating: number;
  reviews: number;
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
  createdAt: number;
}

export interface Booking {
  id: number;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  pkg: WashPackageId;
  packageName: string;
  carType: VehicleType;
  mode: ServiceMode;
  slot: string;
  status: BookingStatus;
  base: number;
  modeFee: number;
  platformFee: number;
  total: number;
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

export type CustomerTab = 'explore' | 'bookings' | 'garage' | 'profile';

export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Bike';

export interface Vehicle {
  id: string;
  userId: string;
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
  phone: string;
  email: string;
  area: string;
  dist: number;
  rating: number;
  reviews: number;
  status: 'live' | 'pending' | 'suspended';
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
  createdAt: number;
}

export interface Booking {
  id: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
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

export const PLATFORM_FEE = 19;

export const VEHICLE_TYPES: VehicleType[] = ['Hatchback', 'Sedan', 'SUV', 'Bike'];

export const PACKAGES: WashPackage[] = [
  { id: 'ext', name: 'Exterior foam wash', mins: 30, desc: 'Snow foam, pressure rinse, tyre shine' },
  { id: 'int', name: 'Interior deep clean', mins: 45, desc: 'Vacuum, dashboard, mats, odour treatment' },
  { id: 'full', name: 'Full wash', mins: 75, desc: 'Exterior foam + interior clean + underbody rinse' },
  { id: 'cer', name: 'Ceramic wash & polish', mins: 150, desc: 'Machine polish with ceramic sealant', centreOnly: true },
];

export const SERVICE_MODE_INFO: Record<ServiceMode, { label: string; desc: string }> = {
  walkin: { label: 'At centre', desc: 'Drive in at your booked slot' },
  pickup: { label: 'Pick & Drop', desc: 'Verified driver collects and returns your vehicle' },
  home: { label: 'At home', desc: 'Team washes at your doorstep with waterless kit' },
};

export const FLOW: Record<ServiceMode, BookingStatus[]> = {
  walkin: ['requested', 'accepted', 'checked_in', 'in_progress', 'ready', 'completed'],
  pickup: ['requested', 'accepted', 'picked_up', 'in_progress', 'out_for_delivery', 'completed'],
  home: ['requested', 'accepted', 'on_the_way', 'in_progress', 'completed'],
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  requested: 'Waiting for centre to accept',
  accepted: 'Booking accepted',
  checked_in: 'Vehicle checked in at centre',
  picked_up: 'Vehicle picked up by driver',
  on_the_way: 'Washer on the way to doorstep',
  in_progress: 'Wash in progress',
  ready: 'Ready for customer collection',
  out_for_delivery: 'Out for delivery',
  completed: 'Service completed',
  rejected: 'Declined by the centre',
  expired: 'Not accepted within 10 minutes',
};

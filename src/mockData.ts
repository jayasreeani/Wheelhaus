import { Vehicle, Vendor, WashPackage, Booking, VehicleType, ServiceMode, BookingStatus } from './types';

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
  checked_in: 'Car checked in at centre',
  picked_up: 'Vehicle picked up',
  on_the_way: 'Washer on the way',
  in_progress: 'Wash in progress',
  ready: 'Ready for collection',
  out_for_delivery: 'Out for delivery',
  completed: 'Service completed',
  rejected: 'Declined by the centre',
  expired: 'Not accepted in 10 minutes',
};

export const STATUS_BADGE_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  requested: { label: 'Awaiting accept', bg: 'bg-amber-100', text: 'text-amber-800' },
  accepted: { label: 'Accepted', bg: 'bg-orange-100', text: 'text-orange-800' },
  checked_in: { label: 'Checked in', bg: 'bg-blue-100', text: 'text-blue-800' },
  picked_up: { label: 'Picked up', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  on_the_way: { label: 'On the way', bg: 'bg-sky-100', text: 'text-sky-800' },
  in_progress: { label: 'In progress', bg: 'bg-amber-100', text: 'text-amber-800' },
  ready: { label: 'Ready', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  out_for_delivery: { label: 'Out for delivery', bg: 'bg-purple-100', text: 'text-purple-800' },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  rejected: { label: 'Declined', bg: 'bg-rose-100', text: 'text-rose-800' },
  expired: { label: 'Expired', bg: 'bg-rose-100', text: 'text-rose-800' },
};

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'c1', name: 'Hyundai Creta', type: 'SUV', reg: 'KL-01 CK 2231' },
  { id: 'c2', name: 'Maruti Swift', type: 'Hatchback', reg: 'KL-22 M 908' },
  { id: 'c3', name: 'Honda Activa', type: 'Bike', reg: 'KL-01 BW 5520' },
];

export const VENDOR_PALETTE = ['#c9450c', '#1a1f36', '#18865a', '#7a3fb0', '#2563a8', '#9a6a00'];

export function createInitialVendors(): Vendor[] {
  const vendors: Vendor[] = [
    {
      id: 'v1',
      name: 'BlueDrop Car Spa',
      area: 'Kazhakoottam, NH 66 bypass',
      dist: 0.8,
      rating: 4.6,
      reviews: 212,
      status: 'live',
      commission: 15,
      hours: '7 AM to 8 PM',
      color: VENDOR_PALETTE[0],
      modes: {
        walkin: { on: true },
        pickup: { on: true, fee: 120, radius: 5 },
        home: { on: false, fee: 100, radius: 4 },
      },
      prices: {
        ext: [349, 399, 449, 159],
        int: [499, 549, 649, 219],
        full: [699, 799, 899, 299],
        cer: [1499, 1799, 2199, 799],
      },
    },
    {
      id: 'v2',
      name: 'Technopark Foam Wash',
      area: 'Kariyavattom',
      dist: 2.1,
      rating: 4.4,
      reviews: 148,
      status: 'live',
      commission: 15,
      hours: '8 AM to 7 PM',
      color: VENDOR_PALETTE[1],
      modes: {
        walkin: { on: true },
        pickup: { on: false, fee: 100, radius: 4 },
        home: { on: false, fee: 80, radius: 4 },
      },
      prices: {
        ext: [299, 349, 399, 139],
        int: [449, 499, 599, 199],
        full: [599, 699, 799, 269],
      },
    },
    {
      id: 'v3',
      name: 'GreenFoam Doorstep',
      area: 'Sreekaryam · doorstep only',
      dist: 3.4,
      rating: 4.7,
      reviews: 96,
      status: 'live',
      commission: 15,
      hours: '6 AM to 6 PM',
      color: VENDOR_PALETTE[2],
      modes: {
        walkin: { on: false },
        pickup: { on: false, fee: 0, radius: 0 },
        home: { on: true, fee: 80, radius: 8 },
      },
      prices: {
        ext: [399, 449, 499, 179],
        int: [549, 599, 699, 239],
        full: [749, 849, 949, 329],
      },
    },
    {
      id: 'v4',
      name: 'Shine Bay Detailing',
      area: 'Kulathoor',
      dist: 3.9,
      rating: 4.8,
      reviews: 301,
      status: 'live',
      commission: 15,
      hours: '8 AM to 9 PM',
      color: VENDOR_PALETTE[3],
      modes: {
        walkin: { on: true },
        pickup: { on: true, fee: 150, radius: 6 },
        home: { on: true, fee: 120, radius: 5 },
      },
      prices: {
        ext: [449, 499, 549, 199],
        int: [599, 649, 749, 269],
        full: [849, 949, 1099, 379],
        cer: [1699, 1999, 2399, 899],
      },
    },
    {
      id: 'v5',
      name: 'Kulathoor Auto Wash',
      area: 'Kulathoor junction',
      dist: 4.5,
      rating: 4.1,
      reviews: 77,
      status: 'live',
      commission: 15,
      hours: '7 AM to 7 PM',
      color: VENDOR_PALETTE[4],
      modes: {
        walkin: { on: true },
        pickup: { on: true, fee: 100, radius: 4 },
        home: { on: false, fee: 0, radius: 0 },
      },
      prices: {
        ext: [279, 329, 379, 129],
        int: [429, 479, 549, 189],
        full: [579, 649, 749, 259],
      },
    },
    {
      id: 'v6',
      name: 'Pothencode Wash Point',
      area: 'Pothencode',
      dist: 7.2,
      rating: 0,
      reviews: 0,
      status: 'pending',
      commission: 10,
      hours: '7 AM to 7 PM',
      color: VENDOR_PALETTE[5],
      modes: {
        walkin: { on: true },
        pickup: { on: false, fee: 0, radius: 0 },
        home: { on: true, fee: 100, radius: 10 },
      },
      prices: {
        ext: [259, 299, 349, 119],
        int: [399, 449, 499, 169],
        full: [549, 599, 699, 239],
      },
    },
  ];
  return vendors;
}

export function createInitialBookings(vendors: Vendor[]): Booking[] {
  const now = Date.now();
  const getBase = (vid: string, pkg: string, cType: VehicleType) => {
    const v = vendors.find(x => x.id === vid)!;
    const ti = VEHICLE_TYPES.indexOf(cType);
    return v.prices[pkg][ti];
  };

  return [
    {
      id: 1031,
      customer: 'Arjun (you)',
      vendorId: 'v1',
      pkg: 'full',
      carType: 'SUV',
      mode: 'walkin',
      slot: '12 Oct, 10:00',
      status: 'completed',
      base: getBase('v1', 'full', 'SUV'),
      modeFee: 0,
      otp: '4821',
      address: '',
      createdAt: now - 86400000 * 2,
      deadline: null,
      review: {
        stars: 5,
        text: 'Spotless interior, done on time. Ceramic coat finish looked incredible.',
      },
    },
    {
      id: 1035,
      customer: 'Anjali R',
      vendorId: 'v4',
      pkg: 'cer',
      carType: 'Sedan',
      mode: 'walkin',
      slot: 'Today, 08:00',
      status: 'completed',
      base: getBase('v4', 'cer', 'Sedan'),
      modeFee: 0,
      otp: '3194',
      address: '',
      createdAt: now - 3600000 * 5,
      deadline: null,
    },
    {
      id: 1036,
      customer: 'Vishnu M',
      vendorId: 'v2',
      pkg: 'ext',
      carType: 'Hatchback',
      mode: 'walkin',
      slot: 'Today, 08:00',
      status: 'completed',
      base: getBase('v2', 'ext', 'Hatchback'),
      modeFee: 0,
      otp: '7729',
      address: '',
      createdAt: now - 3600000 * 5,
      deadline: null,
    },
    {
      id: 1037,
      customer: 'Fathima S',
      vendorId: 'v3',
      pkg: 'full',
      carType: 'SUV',
      mode: 'home',
      slot: 'Today, 09:00',
      status: 'completed',
      base: getBase('v3', 'full', 'SUV'),
      modeFee: 80,
      otp: '5501',
      address: 'Near Sreekaryam Jn, Trivandrum',
      createdAt: now - 3600000 * 4,
      deadline: null,
    },
    {
      id: 1038,
      customer: 'Sneha P',
      vendorId: 'v5',
      pkg: 'int',
      carType: 'Sedan',
      mode: 'pickup',
      slot: 'Today, 09:00',
      status: 'rejected',
      base: getBase('v5', 'int', 'Sedan'),
      modeFee: 100,
      otp: '6211',
      address: 'Infosys Main Gate, Kazhakoottam',
      createdAt: now - 3600000 * 3,
      deadline: null,
    },
    {
      id: 1039,
      customer: 'Akhil K',
      vendorId: 'v4',
      pkg: 'full',
      carType: 'SUV',
      mode: 'pickup',
      slot: 'Today, 10:00',
      status: 'in_progress',
      base: getBase('v4', 'full', 'SUV'),
      modeFee: 150,
      otp: '2938',
      address: 'Cyberpark Phase 2, Trivandrum',
      createdAt: now - 3600000 * 2,
      deadline: null,
      driver: {
        name: 'Sajeev K',
        phone: '+91 98470 12345',
        reg: 'KL-01 BZ 4412',
      },
    },
    {
      id: 1040,
      customer: 'Meera J',
      vendorId: 'v1',
      pkg: 'ext',
      carType: 'Sedan',
      mode: 'walkin',
      slot: 'Today, 11:00',
      status: 'in_progress',
      base: getBase('v1', 'ext', 'Sedan'),
      modeFee: 0,
      otp: '8814',
      address: '',
      createdAt: now - 3600000,
      deadline: null,
    },
    {
      id: 1041,
      customer: 'Rahul Nair',
      vendorId: 'v1',
      pkg: 'int',
      carType: 'Hatchback',
      mode: 'pickup',
      slot: 'Today, 14:00',
      status: 'requested',
      base: getBase('v1', 'int', 'Hatchback'),
      modeFee: 120,
      otp: '9042',
      address: 'Skyline Residency, Kazhakoottam',
      createdAt: now - 150000,
      deadline: now + 7.5 * 60 * 1000,
      driver: {
        name: 'Sajeev K',
        phone: '+91 98470 12345',
        reg: 'KL-01 BZ 4412',
      },
    },
  ];
}

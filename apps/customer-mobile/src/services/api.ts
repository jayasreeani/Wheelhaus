import { Vendor, Booking, Vehicle } from '../types';

// In Android emulator: 10.0.2.2 points to host localhost:4000. On physical devices or web: localhost or host IP.
const API_BASE_URL = 'http://localhost:4000/api';

export const fallbackVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'BlueDrop Car Spa',
    phone: '+91 98471 00001',
    area: 'Kazhakoottam, NH 66 Bypass',
    dist: 0.8,
    rating: 4.6,
    reviews: 212,
    hours: '7:00 AM - 8:00 PM',
    color: '#c9450c',
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
    phone: '+91 98471 00002',
    area: 'Kariyavattom Campus Road',
    dist: 2.1,
    rating: 4.4,
    reviews: 148,
    hours: '8:00 AM - 7:00 PM',
    color: '#1a1f36',
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
    phone: '+91 98471 00003',
    area: 'Sreekaryam (Doorstep Mobile Crew)',
    dist: 3.4,
    rating: 4.7,
    reviews: 96,
    hours: '6:00 AM - 6:00 PM',
    color: '#18865a',
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
    name: 'Shine Bay Detailing Studio',
    phone: '+91 98471 00004',
    area: 'Kulathoor Junction',
    dist: 3.9,
    rating: 4.8,
    reviews: 301,
    hours: '8:00 AM - 9:00 PM',
    color: '#7a3fb0',
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
];

export const fallbackVehicles: Vehicle[] = [
  { id: 'c1', name: 'Hyundai Creta', type: 'SUV', reg: 'KL-01 CK 2231', isDefault: true },
  { id: 'c2', name: 'Maruti Swift', type: 'Hatchback', reg: 'KL-22 M 908', isDefault: false },
  { id: 'c3', name: 'Honda Activa 6G', type: 'Bike', reg: 'KL-01 BW 5520', isDefault: false },
];

export async function fetchVendors(): Promise<Vendor[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/vendors`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // Return robust offline fallback
  }
  return fallbackVendors;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/vehicles`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return fallbackVehicles;
}

export async function createBookingRequest(payload: {
  vendorId: string;
  pkg: string;
  carType: string;
  mode: string;
  slot: string;
  address: string;
}): Promise<Booking> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}

  // Local fallback response generator
  const id = Math.floor(1050 + Math.random() * 9000);
  const newBooking: Booking = {
    id,
    customerId: 'u1',
    customerName: 'Arjun Menon',
    vendorId: payload.vendorId,
    vendorName: 'BlueDrop Car Spa',
    pkg: payload.pkg as any,
    packageName: payload.pkg === 'full' ? 'Full Wash' : 'Exterior Foam Wash',
    carType: payload.carType as any,
    mode: payload.mode as any,
    slot: payload.slot,
    status: 'requested',
    base: 799,
    modeFee: payload.mode === 'walkin' ? 0 : 120,
    platformFee: 19,
    total: 799 + (payload.mode === 'walkin' ? 0 : 120) + 19,
    otp: String(Math.floor(1000 + Math.random() * 9000)),
    address: payload.address,
    createdAt: Date.now(),
    deadline: Date.now() + 10 * 60 * 1000,
    driver:
      payload.mode === 'pickup'
        ? {
            name: 'Sajeev K',
            phone: '+91 98470 12345',
            reg: 'KL-01 BZ 4412',
          }
        : undefined,
  };
  return newBooking;
}

export async function submitReview(bookingId: number, stars: number, text: string) {
  try {
    await fetch(`${API_BASE_URL}/bookings/${bookingId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars, text }),
    });
  } catch (e) {}
}

import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  Vendor,
  Booking,
  Vehicle,
  BookingStatus,
  ServiceMode,
  WashPackageId,
  PLATFORM_FEE,
  FLOW,
  STATUS_LABELS,
  PACKAGES,
  VEHICLE_TYPES,
} from '@wheelhaus/shared';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-Memory Database with Seed Data
const vehicles: Vehicle[] = [
  { id: 'c1', userId: 'u1', name: 'Hyundai Creta', type: 'SUV', reg: 'KL-01 CK 2231' },
  { id: 'c2', userId: 'u1', name: 'Maruti Swift', type: 'Hatchback', reg: 'KL-22 M 908' },
  { id: 'c3', userId: 'u1', name: 'Honda Activa', type: 'Bike', reg: 'KL-01 BW 5520' },
];

const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'BlueDrop Car Spa',
    phone: '+91 98471 00001',
    email: 'bluedrop@wheelhaus.in',
    area: 'Kazhakoottam, NH 66 bypass',
    dist: 0.8,
    rating: 4.6,
    reviews: 212,
    status: 'live',
    commission: 15,
    hours: '7 AM to 8 PM',
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
    email: 'technopark@wheelhaus.in',
    area: 'Kariyavattom',
    dist: 2.1,
    rating: 4.4,
    reviews: 148,
    status: 'live',
    commission: 15,
    hours: '8 AM to 7 PM',
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
    email: 'greenfoam@wheelhaus.in',
    area: 'Sreekaryam · doorstep only',
    dist: 3.4,
    rating: 4.7,
    reviews: 96,
    status: 'live',
    commission: 15,
    hours: '6 AM to 6 PM',
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
    name: 'Shine Bay Detailing',
    phone: '+91 98471 00004',
    email: 'shinebay@wheelhaus.in',
    area: 'Kulathoor',
    dist: 3.9,
    rating: 4.8,
    reviews: 301,
    status: 'live',
    commission: 15,
    hours: '8 AM to 9 PM',
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
  {
    id: 'v5',
    name: 'Kulathoor Auto Wash',
    phone: '+91 98471 00005',
    email: 'kulathoor@wheelhaus.in',
    area: 'Kulathoor junction',
    dist: 4.5,
    rating: 4.1,
    reviews: 77,
    status: 'live',
    commission: 15,
    hours: '7 AM to 7 PM',
    color: '#2563a8',
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
    phone: '+91 98471 00006',
    email: 'pothencode@wheelhaus.in',
    area: 'Pothencode',
    dist: 7.2,
    rating: 0,
    reviews: 0,
    status: 'pending',
    commission: 10,
    hours: '7 AM to 7 PM',
    color: '#9a6a00',
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

let nextBookingId = 1045;
const bookings: Booking[] = [
  {
    id: 1031,
    customerId: 'u1',
    customerName: 'Arjun Menon',
    customerPhone: '+91 98950 00000',
    vendorId: 'v1',
    vendorName: 'BlueDrop Car Spa',
    pkg: 'full',
    packageName: 'Full wash',
    carType: 'SUV',
    mode: 'walkin',
    slot: '12 Oct, 10:00',
    status: 'completed',
    base: 899,
    modeFee: 0,
    platformFee: PLATFORM_FEE,
    total: 899 + PLATFORM_FEE,
    otp: '4821',
    address: '',
    createdAt: Date.now() - 86400000 * 2,
    deadline: null,
    review: {
      stars: 5,
      text: 'Spotless interior, done on time. Ceramic coat finish looked incredible.',
      createdAt: Date.now() - 86400000 * 2 + 7200000,
    },
  },
  {
    id: 1041,
    customerId: 'u2',
    customerName: 'Rahul Nair',
    customerPhone: '+91 98470 54321',
    vendorId: 'v1',
    vendorName: 'BlueDrop Car Spa',
    pkg: 'int',
    packageName: 'Interior deep clean',
    carType: 'Hatchback',
    mode: 'pickup',
    slot: 'Today, 14:00',
    status: 'requested',
    base: 499,
    modeFee: 120,
    platformFee: PLATFORM_FEE,
    total: 499 + 120 + PLATFORM_FEE,
    otp: '9042',
    address: 'Skyline Residency, Kazhakoottam',
    createdAt: Date.now() - 150000,
    deadline: Date.now() + 7.5 * 60 * 1000,
    driver: {
      name: 'Sajeev K',
      phone: '+91 98470 12345',
      reg: 'KL-01 BZ 4412',
    },
  },
];

// Active SSE client connections for real-time push
const sseClients: Response[] = [];

function broadcastEvent(type: string, payload: any) {
  const data = JSON.stringify({ type, payload, timestamp: Date.now() });
  sseClients.forEach(client => {
    client.write(`data: ${data}\n\n`);
  });
}

// Auto-expiry interval for requested bookings
setInterval(() => {
  const now = Date.now();
  let changed = false;
  bookings.forEach(b => {
    if (b.status === 'requested' && b.deadline && b.deadline <= now) {
      b.status = 'expired';
      changed = true;
      broadcastEvent('BOOKING_EXPIRED', b);
    }
  });
}, 1000);

// --- SSE Real-Time Updates Endpoint ---
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// --- Auth Routes ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { phone, role } = req.body;
  if (role === 'vendor') {
    const v = vendors.find(x => x.phone === phone) || vendors[0];
    return res.json({ token: `jwt_vendor_${v.id}`, user: { id: v.id, name: v.name, role: 'vendor', vendorId: v.id } });
  }
  if (role === 'admin') {
    return res.json({ token: 'jwt_admin_super', user: { id: 'admin1', name: 'City Operations Lead', role: 'admin' } });
  }
  return res.json({
    token: 'jwt_customer_u1',
    user: { id: 'u1', name: 'Arjun Menon', phone: phone || '+91 98950 00000', role: 'customer' },
  });
});

// --- Customer Routes ---
app.get('/api/customer/vehicles', (_req: Request, res: Response) => {
  res.json(vehicles);
});

app.post('/api/customer/vehicles', (req: Request, res: Response) => {
  const { name, type, reg } = req.body;
  const newV: Vehicle = {
    id: `c${vehicles.length + 1}`,
    userId: 'u1',
    name: name || 'New Vehicle',
    type: type || 'Sedan',
    reg: reg || 'KL-01 XX 0000',
  };
  vehicles.push(newV);
  res.status(201).json(newV);
});

app.get('/api/vendors', (_req: Request, res: Response) => {
  res.json(vendors);
});

app.get('/api/vendors/:id', (req: Request, res: Response) => {
  const v = vendors.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });
  res.json(v);
});

// --- Booking Routes ---
app.get('/api/bookings', (req: Request, res: Response) => {
  const { customerId, vendorId } = req.query;
  let result = bookings;
  if (customerId) result = result.filter(b => b.customerId === customerId);
  if (vendorId) result = result.filter(b => b.vendorId === vendorId);
  res.json(result);
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const { vendorId, pkg, carType, mode, slot, address } = req.body;
  const v = vendors.find(x => x.id === vendorId);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });

  const ti = VEHICLE_TYPES.indexOf(carType);
  const base = v.prices[pkg]?.[ti] || 499;
  const modeFee = mode === 'walkin' ? 0 : (v.modes[mode as ServiceMode] as any).fee || 0;
  const pkgObj = PACKAGES.find(p => p.id === pkg);

  const id = nextBookingId++;
  const newBooking: Booking = {
    id,
    customerId: 'u1',
    customerName: 'Arjun Menon',
    customerPhone: '+91 98950 00000',
    vendorId: v.id,
    vendorName: v.name,
    pkg: pkg as WashPackageId,
    packageName: pkgObj?.name || 'Wash Package',
    carType,
    mode: mode as ServiceMode,
    slot,
    status: 'requested',
    base,
    modeFee,
    platformFee: PLATFORM_FEE,
    total: base + modeFee + PLATFORM_FEE,
    otp: String(1000 + ((id * 37) % 9000)),
    address: mode === 'walkin' ? '' : address || 'Skyline Residency, Kazhakoottam',
    createdAt: Date.now(),
    deadline: Date.now() + 10 * 60 * 1000,
    driver:
      mode === 'pickup'
        ? {
            name: 'Sajeev K',
            phone: '+91 98470 12345',
            reg: 'KL-01 BZ 4412',
          }
        : undefined,
  };

  bookings.push(newBooking);
  broadcastEvent('NEW_BOOKING_REQUEST', newBooking);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id/accept', (req: Request, res: Response) => {
  const b = bookings.find(x => x.id === parseInt(req.params.id));
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  b.status = 'accepted';
  b.deadline = null;
  broadcastEvent('BOOKING_ACCEPTED', b);
  res.json(b);
});

app.patch('/api/bookings/:id/reject', (req: Request, res: Response) => {
  const b = bookings.find(x => x.id === parseInt(req.params.id));
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  b.status = 'rejected';
  b.deadline = null;
  broadcastEvent('BOOKING_REJECTED', b);
  res.json(b);
});

app.patch('/api/bookings/:id/advance', (req: Request, res: Response) => {
  const { otp } = req.body;
  const b = bookings.find(x => x.id === parseInt(req.params.id));
  if (!b) return res.status(404).json({ error: 'Booking not found' });

  const flow = FLOW[b.mode];
  const idx = flow.indexOf(b.status);
  if (idx === -1 || idx >= flow.length - 1) {
    return res.status(400).json({ error: 'Job already completed or in final state' });
  }

  // OTP Verification Check
  const requiresOtp =
    (b.mode === 'pickup' && b.status === 'accepted') ||
    (b.mode === 'walkin' && b.status === 'ready') ||
    (b.mode === 'pickup' && b.status === 'out_for_delivery') ||
    (b.mode === 'home' && b.status === 'in_progress');

  if (requiresOtp) {
    if (!otp || otp.trim() !== b.otp) {
      return res.status(400).json({ error: 'Invalid handover OTP entered by washer/driver' });
    }
  }

  b.status = flow[idx + 1];
  broadcastEvent('BOOKING_STATUS_CHANGED', b);
  res.json(b);
});

app.post('/api/bookings/:id/review', (req: Request, res: Response) => {
  const { stars, text } = req.body;
  const b = bookings.find(x => x.id === parseInt(req.params.id));
  if (!b) return res.status(404).json({ error: 'Booking not found' });

  b.review = { stars: Number(stars), text: text || '', createdAt: Date.now() };

  // Update vendor aggregate rating
  const v = vendors.find(x => x.id === b.vendorId);
  if (v) {
    const totalReviews = v.reviews + 1;
    v.rating = (v.rating * v.reviews + Number(stars)) / totalReviews;
    v.reviews = totalReviews;
  }

  broadcastEvent('BOOKING_REVIEWED', { booking: b, vendor: v });
  res.json(b);
});

// --- Vendor Partner Settings Routes ---
app.patch('/api/vendor/:id/modes', (req: Request, res: Response) => {
  const v = vendors.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });
  v.modes = req.body.modes;
  broadcastEvent('VENDOR_MODES_UPDATED', v);
  res.json(v);
});

// --- Admin Operations Routes ---
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const validBookings = bookings.filter(b => !['rejected', 'expired'].includes(b.status));
  const gmv = validBookings.reduce((sum, b) => sum + b.base + b.modeFee, 0);
  const revenue = validBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      const v = vendors.find(x => x.id === b.vendorId);
      const cut = ((b.base + b.modeFee) * (v?.commission || 15)) / 100;
      return sum + cut + PLATFORM_FEE;
    }, 0);

  res.json({
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => !['completed', 'rejected', 'expired'].includes(b.status)).length,
    gmv,
    platformRevenue: revenue,
    liveVendors: vendors.filter(v => v.status === 'live').length,
    totalVendors: vendors.length,
  });
});

app.patch('/api/admin/vendors/:id/status', (req: Request, res: Response) => {
  const v = vendors.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });
  v.status = req.body.status;
  broadcastEvent('VENDOR_STATUS_UPDATED', v);
  res.json(v);
});

app.patch('/api/admin/vendors/:id/commission', (req: Request, res: Response) => {
  const v = vendors.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });
  v.commission = Math.min(30, Math.max(0, req.body.commission));
  broadcastEvent('VENDOR_COMMISSION_UPDATED', v);
  res.json(v);
});

app.listen(PORT, () => {
  console.log(`[Wheelhaus Enterprise API] Running on port ${PORT}`);
});

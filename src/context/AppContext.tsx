import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// celebration trigger
const triggerConfetti = (_opts?: any) => {};
import {
  Vendor,
  Booking,
  Vehicle,
  ServiceMode,
  WashPackageId,
  MainViewMode,
  CustomerTab,
  CustomerScreen,
  VendorTab,
  BookingFormData,
} from '../types';
import {
  PLATFORM_FEE,
  PACKAGES,
  VEHICLE_TYPES,
  INITIAL_VEHICLES,
  createInitialVendors,
  createInitialBookings,
  FLOW,
  STATUS_LABELS,
} from '../mockData';

interface AppContextType {
  // State
  vendors: Vendor[];
  bookings: Booking[];
  vehicles: Vehicle[];
  selectedCarId: string;
  selectedCar: Vehicle;
  filter: ServiceMode | 'all';
  sort: 'near' | 'rated' | 'price';
  compare: string[];
  cmpMode: boolean;
  viewMode: MainViewMode;
  flashId: number | null;
  toastMessage: string | null;

  // Customer navigation & state
  custTab: CustomerTab;
  custScreen: CustomerScreen;
  custVendorId: string | null;
  custBookingId: number | null;
  bookingForm: BookingFormData | null;
  custRate: number;
  custRevText: string;

  // Vendor navigation & state
  vendorPortalId: string;
  activeVendor: Vendor;
  vendorTab: VendorTab;

  // Helpers & Actions
  showToast: (msg: string) => void;
  setViewMode: (v: MainViewMode) => void;
  resetDemo: () => void;
  setSelectedCarId: (id: string) => void;
  setFilter: (f: ServiceMode | 'all') => void;
  setSort: (s: 'near' | 'rated' | 'price') => void;
  setCmpMode: (val: boolean) => void;
  toggleCompare: (vid: string) => void;
  clearCompare: () => void;

  // Customer flows
  setCustTab: (t: CustomerTab) => void;
  setCustScreen: (s: CustomerScreen) => void;
  openVendor: (vid: string) => void;
  openBooking: (bid: number) => void;
  startBooking: (vid: string) => void;
  updateBookingForm: (data: Partial<BookingFormData>) => void;
  confirmBooking: () => void;
  setCustRate: (n: number) => void;
  setCustRevText: (t: string) => void;
  submitReview: () => void;

  // Vendor flows
  setVendorPortalId: (id: string) => void;
  setVendorTab: (t: VendorTab) => void;
  acceptBooking: (bid: number) => void;
  rejectBooking: (bid: number) => void;
  advanceJob: (bid: number, otpInput?: string) => boolean;
  toggleVendorMode: (vid: string, mode: ServiceMode) => void;
  updateVendorModeNum: (vid: string, mode: ServiceMode, field: 'radius' | 'fee', val: number) => void;
  updateVendorCommission: (vid: string, val: number) => void;
  approveVendor: (vid: string) => void;
  suspendVendor: (vid: string) => void;

  // Utility calculations
  isModeAvailable: (v: Vendor, m: ServiceMode) => boolean;
  getFromPrice: (v: Vendor) => number;
  formatCurrency: (n: number) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('wheelhaus_vendors');
    return saved ? JSON.parse(saved) : createInitialVendors();
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wheelhaus_bookings');
    return saved ? JSON.parse(saved) : createInitialBookings(createInitialVendors());
  });

  const [vehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedCarId, setSelectedCarId] = useState<string>('c1');
  const [filter, setFilter] = useState<ServiceMode | 'all'>('all');
  const [sort, setSort] = useState<'near' | 'rated' | 'price'>('near');
  const [compare, setCompare] = useState<string[]>([]);
  const [cmpMode, setCmpMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<MainViewMode>('apps');
  const [flashId, setFlashId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer sub-state
  const [custTab, setCustTab] = useState<CustomerTab>('home');
  const [custScreen, setCustScreen] = useState<CustomerScreen>('home');
  const [custVendorId, setCustVendorId] = useState<string | null>(null);
  const [custBookingId, setCustBookingId] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData | null>(null);
  const [custRate, setCustRate] = useState<number>(0);
  const [custRevText, setCustRevText] = useState<string>('');

  // Vendor sub-state
  const [vendorPortalId, setVendorPortalId] = useState<string>('v1');
  const [vendorTab, setVendorTab] = useState<VendorTab>('req');

  // Persistence
  useEffect(() => {
    localStorage.setItem('wheelhaus_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('wheelhaus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Toast handler
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(curr => (curr === msg ? null : curr));
    }, 2800);
  };

  // Helper values
  const selectedCar = vehicles.find(v => v.id === selectedCarId) || vehicles[0];
  const activeVendor = vendors.find(v => v.id === vendorPortalId) || vendors[0];

  const formatCurrency = (n: number) => {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  };

  const isModeAvailable = (v: Vendor, m: ServiceMode) => {
    if (!v.modes[m]?.on) return false;
    if (m === 'walkin') return true;
    return v.dist <= (v.modes[m] as { radius: number }).radius;
  };

  const getFromPrice = (v: Vendor) => {
    const ti = VEHICLE_TYPES.indexOf(selectedCar.type);
    const validPrices = Object.values(v.prices)
      .filter(arr => Array.isArray(arr) && arr[ti] !== undefined)
      .map(arr => arr[ti]);
    return validPrices.length ? Math.min(...validPrices) : 299;
  };

  // Auto expiry timer for 'requested' bookings
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      setBookings(prev => {
        const next = prev.map(b => {
          if (b.status === 'requested' && b.deadline && b.deadline <= now) {
            changed = true;
            return { ...b, status: 'expired' as const };
          }
          return b;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Flash highlight timeout
  useEffect(() => {
    if (flashId) {
      const t = setTimeout(() => setFlashId(null), 2500);
      return () => clearTimeout(t);
    }
  }, [flashId]);

  // Actions
  const resetDemo = () => {
    const freshVendors = createInitialVendors();
    const freshBookings = createInitialBookings(freshVendors);
    setVendors(freshVendors);
    setBookings(freshBookings);
    localStorage.removeItem('wheelhaus_vendors');
    localStorage.removeItem('wheelhaus_bookings');
    setSelectedCarId('c1');
    setFilter('all');
    setSort('near');
    setCompare([]);
    setCmpMode(false);
    setCustTab('home');
    setCustScreen('home');
    setCustVendorId(null);
    setCustBookingId(null);
    setBookingForm(null);
    setVendorPortalId('v1');
    setVendorTab('req');
    showToast('Demo reset to initial clean state');
  };

  const toggleCompare = (vid: string) => {
    if (compare.includes(vid)) {
      setCompare(compare.filter(id => id !== vid));
    } else {
      if (compare.length >= 3) {
        showToast('You can compare at most 3 centres');
        return;
      }
      setCompare([...compare, vid]);
    }
  };

  const clearCompare = () => {
    setCompare([]);
    setCmpMode(false);
    setCustScreen('home');
  };

  const openVendor = (vid: string) => {
    setCustVendorId(vid);
    setCustScreen('vendor');
  };

  const openBooking = (bid: number) => {
    setCustBookingId(bid);
    setCustScreen('status');
    setCustTab('bookings');
    setCustRate(0);
    setCustRevText('');
  };

  const startBooking = (vid: string) => {
    const v = vendors.find(x => x.id === vid);
    if (!v) return;
    const defaultPkg: WashPackageId = v.prices.full ? 'full' : 'ext';
    let defaultMode: ServiceMode = 'walkin';
    if (filter !== 'all' && isModeAvailable(v, filter)) {
      defaultMode = filter;
    } else {
      const available = (['walkin', 'pickup', 'home'] as ServiceMode[]).find(m => isModeAvailable(v, m));
      if (available) defaultMode = available;
    }

    setBookingForm({
      step: 1,
      pkg: defaultPkg,
      mode: defaultMode,
      day: 0,
      slot: null,
      pay: 'UPI',
      address: 'Skyline Residency, Kazhakoottam',
    });
    setCustVendorId(vid);
    setCustScreen('book');
  };

  const updateBookingForm = (data: Partial<BookingFormData>) => {
    setBookingForm(prev => (prev ? { ...prev, ...data } : null));
  };

  const confirmBooking = () => {
    if (!custVendorId || !bookingForm || !bookingForm.slot) return;
    const v = vendors.find(x => x.id === custVendorId);
    if (!v) return;

    const days = ['Today', 'Tomorrow', 'Wed 11 Nov'];
    const ti = VEHICLE_TYPES.indexOf(selectedCar.type);
    const basePrice = v.prices[bookingForm.pkg][ti];
    const modeFee = bookingForm.mode === 'walkin' ? 0 : (v.modes[bookingForm.mode] as { fee: number }).fee;
    const newId = Math.max(1045, ...bookings.map(b => b.id + 1));

    const newBooking: Booking = {
      id: newId,
      customer: 'Arjun (you)',
      vendorId: v.id,
      pkg: bookingForm.pkg,
      carType: selectedCar.type,
      mode: bookingForm.mode,
      slot: `${days[bookingForm.day]}, ${bookingForm.slot}`,
      status: 'requested',
      base: basePrice,
      modeFee,
      otp: String(1000 + ((newId * 37) % 9000)),
      address: bookingForm.mode === 'walkin' ? '' : bookingForm.address,
      createdAt: Date.now(),
      deadline: Date.now() + 10 * 60 * 1000,
      driver:
        bookingForm.mode === 'pickup'
          ? {
              name: 'Sajeev K',
              phone: '+91 98470 12345',
              reg: 'KL-01 BZ 4412',
            }
          : undefined,
    };

    setBookings(prev => [...prev, newBooking]);
    setFlashId(newId);
    setCustBookingId(newId);
    setCustScreen('status');
    setCustTab('bookings');

    // Switch vendor app to this vendor and requests tab so user sees it live!
    setVendorPortalId(v.id);
    setVendorTab('req');

    // Celebration confetti!
    triggerConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c9450c', '#f97316', '#ffb020'],
    });

    showToast(`Request sent to ${v.name}! See it live on the vendor phone.`);
  };

  const submitReview = () => {
    if (!custBookingId || !custRate) return;
    const b = bookings.find(x => x.id === custBookingId);
    if (!b) return;

    const newReview = { stars: custRate, text: custRevText.trim() };
    setBookings(prev =>
      prev.map(item => (item.id === custBookingId ? { ...item, review: newReview } : item))
    );

    setVendors(prev =>
      prev.map(v => {
        if (v.id === b.vendorId) {
          const newReviews = v.reviews + 1;
          const newRating = (v.rating * v.reviews + custRate) / newReviews;
          return { ...v, rating: newRating, reviews: newReviews };
        }
        return v;
      })
    );

    setCustRate(0);
    setCustRevText('');
    showToast('Thanks! Your review has been published.');
  };

  const acceptBooking = (bid: number) => {
    setBookings(prev =>
      prev.map(b => (b.id === bid ? { ...b, status: 'accepted', deadline: null } : b))
    );
    setFlashId(bid);
    setVendorTab('jobs');
    showToast(`Booking WK-${bid} accepted. Customer notified via in-app & WhatsApp.`);
  };

  const rejectBooking = (bid: number) => {
    setBookings(prev =>
      prev.map(b => (b.id === bid ? { ...b, status: 'rejected', deadline: null } : b))
    );
    setFlashId(bid);
    showToast(`Booking WK-${bid} declined. Alternate nearby centres offered to customer.`);
  };

  const advanceJob = (bid: number, otpInput?: string) => {
    const b = bookings.find(x => x.id === bid);
    if (!b) return false;

    // Check OTP requirement for handover/completion
    const flow = FLOW[b.mode];
    const currentIndex = flow.indexOf(b.status);
    if (currentIndex === -1 || currentIndex >= flow.length - 1) return false;

    const nextStatus = flow[currentIndex + 1];

    // OTP required when picking up car, ready handover, or completing home wash
    const requiresOtp =
      (b.mode === 'pickup' && b.status === 'accepted') ||
      (b.mode === 'walkin' && b.status === 'ready') ||
      (b.mode === 'pickup' && b.status === 'out_for_delivery') ||
      (b.mode === 'home' && b.status === 'in_progress');

    if (requiresOtp) {
      if (!otpInput || otpInput.trim() !== b.otp) {
        showToast(`Invalid OTP. Enter the 4-digit OTP (${b.otp}) from customer app.`);
        return false;
      }
    }

    setBookings(prev =>
      prev.map(item => (item.id === bid ? { ...item, status: nextStatus } : item))
    );
    setFlashId(bid);

    if (nextStatus === 'completed') {
      triggerConfetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      showToast(`WK-${bid} completed successfully! Payment added to vendor settlement.`);
    } else {
      showToast(`Status updated to "${STATUS_LABELS[nextStatus]}".`);
    }

    return true;
  };

  const toggleVendorMode = (vid: string, mode: ServiceMode) => {
    setVendors(prev =>
      prev.map(v => {
        if (v.id === vid) {
          const current = v.modes[mode];
          const newOn = !current.on;
          const updatedMode = { ...current, on: newOn };
          if (mode !== 'walkin' && newOn && !(updatedMode as any).radius) {
            (updatedMode as any).radius = 5;
            (updatedMode as any).fee = 100;
          }
          return {
            ...v,
            modes: {
              ...v.modes,
              [mode]: updatedMode,
            },
          };
        }
        return v;
      })
    );
    showToast(`Updated service mode for centre`);
  };

  const updateVendorModeNum = (
    vid: string,
    mode: ServiceMode,
    field: 'radius' | 'fee',
    val: number
  ) => {
    setVendors(prev =>
      prev.map(v => {
        if (v.id === vid && mode !== 'walkin') {
          return {
            ...v,
            modes: {
              ...v.modes,
              [mode]: {
                ...v.modes[mode],
                [field]: Math.max(0, val),
              },
            },
          };
        }
        return v;
      })
    );
  };

  const updateVendorCommission = (vid: string, val: number) => {
    const clamped = Math.min(30, Math.max(0, val));
    setVendors(prev =>
      prev.map(v => (v.id === vid ? { ...v, commission: clamped } : v))
    );
  };

  const approveVendor = (vid: string) => {
    setVendors(prev =>
      prev.map(v => (v.id === vid ? { ...v, status: 'live' } : v))
    );
    showToast('Centre approved and marked Live on customer apps.');
  };

  const suspendVendor = (vid: string) => {
    setVendors(prev =>
      prev.map(v => (v.id === vid ? { ...v, status: 'pending' } : v))
    );
    if (vendorPortalId === vid) {
      setVendorPortalId('v1');
    }
    showToast('Centre suspended and hidden from customer search.');
  };

  return (
    <AppContext.Provider
      value={{
        vendors,
        bookings,
        vehicles,
        selectedCarId,
        selectedCar,
        filter,
        sort,
        compare,
        cmpMode,
        viewMode,
        flashId,
        toastMessage,

        custTab,
        custScreen,
        custVendorId,
        custBookingId,
        bookingForm,
        custRate,
        custRevText,

        vendorPortalId,
        activeVendor,
        vendorTab,

        showToast,
        setViewMode,
        resetDemo,
        setSelectedCarId,
        setFilter,
        setSort,
        setCmpMode,
        toggleCompare,
        clearCompare,

        setCustTab,
        setCustScreen,
        openVendor,
        openBooking,
        startBooking,
        updateBookingForm,
        confirmBooking,
        setCustRate,
        setCustRevText,
        submitReview,

        setVendorPortalId,
        setVendorTab,
        acceptBooking,
        rejectBooking,
        advanceJob,
        toggleVendorMode,
        updateVendorModeNum,
        updateVendorCommission,
        approveVendor,
        suspendVendor,

        isModeAvailable,
        getFromPrice,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

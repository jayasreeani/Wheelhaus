import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Vendor, Booking, CustomerTab, ServiceMode } from '../types';
import { fetchVendors, fetchVehicles, createBookingRequest, submitReview } from '../services/api';

interface CustomerContextType {
  vehicles: Vehicle[];
  currentVehicle: Vehicle;
  setCurrentVehicle: (v: Vehicle) => void;
  addVehicle: (name: string, type: any, reg: string) => void;

  vendors: Vendor[];
  selectedVendor: Vendor | null;
  setSelectedVendor: (v: Vendor | null) => void;

  activeTab: CustomerTab;
  setActiveTab: (tab: CustomerTab) => void;

  activeBooking: Booking | null;
  bookingsHistory: Booking[];
  openBookingTracking: (bookingId: number) => void;
  requestBooking: (pkg: string, mode: ServiceMode, slot: string, address: string) => Promise<void>;
  submitBookingReview: (bookingId: number, stars: number, text: string) => Promise<void>;

  vehicleSwitcherOpen: boolean;
  setVehicleSwitcherOpen: (open: boolean) => void;
  addVehicleModalOpen: boolean;
  setAddVehicleModalOpen: (open: boolean) => void;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>({
    id: 'c1',
    name: 'Hyundai Creta',
    type: 'SUV',
    reg: 'KL-01 CK 2231',
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState<CustomerTab>('explore');

  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);

  const [vehicleSwitcherOpen, setVehicleSwitcherOpen] = useState(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);

  useEffect(() => {
    fetchVehicles().then(data => {
      setVehicles(data);
      if (data.length > 0) setCurrentVehicle(data[0]);
    });
    fetchVendors().then(data => setVendors(data));
  }, []);

  // Timer loop for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBooking(current => {
        if (!current || current.status !== 'requested' || !current.deadline) return current;
        if (current.deadline <= Date.now()) {
          return { ...current, status: 'expired' };
        }
        return current;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addVehicle = (name: string, type: any, reg: string) => {
    const newV: Vehicle = {
      id: `c_${Date.now()}`,
      name,
      type,
      reg: reg.toUpperCase(),
      isDefault: false,
    };
    setVehicles(prev => [...prev, newV]);
    setCurrentVehicle(newV);
    setAddVehicleModalOpen(false);
  };

  const requestBooking = async (pkg: string, mode: ServiceMode, slot: string, address: string) => {
    if (!selectedVendor) return;
    const booking = await createBookingRequest({
      vendorId: selectedVendor.id,
      pkg,
      carType: currentVehicle.type,
      mode,
      slot,
      address,
    });
    booking.vendorName = selectedVendor.name;
    setActiveBooking(booking);
    setBookingsHistory(prev => [booking, ...prev]);
    setSelectedVendor(null);
    setActiveTab('bookings');
  };

  const openBookingTracking = (bookingId: number) => {
    const found = bookingsHistory.find(b => b.id === bookingId);
    if (found) {
      setActiveBooking(found);
      setActiveTab('bookings');
    }
  };

  const submitBookingReview = async (bookingId: number, stars: number, text: string) => {
    await submitReview(bookingId, stars, text);
    setBookingsHistory(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, review: { stars, text, createdAt: Date.now() } } : b))
    );
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking(prev =>
        prev ? { ...prev, review: { stars, text, createdAt: Date.now() } } : null
      );
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        vehicles,
        currentVehicle,
        setCurrentVehicle,
        addVehicle,

        vendors,
        selectedVendor,
        setSelectedVendor,

        activeTab,
        setActiveTab,

        activeBooking,
        bookingsHistory,
        openBookingTracking,
        requestBooking,
        submitBookingReview,

        vehicleSwitcherOpen,
        setVehicleSwitcherOpen,
        addVehicleModalOpen,
        setAddVehicleModalOpen,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer must be used within CustomerProvider');
  return context;
};

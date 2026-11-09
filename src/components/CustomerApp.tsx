import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Car,
  Bike,
  Sparkles,
  Wrench,
  AlertTriangle,
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  CheckCircle2,
  Phone,
  Shield,
  Layers,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { PACKAGES, SERVICE_MODE_INFO, STATUS_LABELS, STATUS_BADGE_CONFIG, PLATFORM_FEE, FLOW } from '../mockData';
import { ServiceMode, WashPackageId } from '../types';

export const CustomerApp: React.FC = () => {
  const {
    vendors,
    bookings,
    vehicles,
    selectedCarId,
    selectedCar,
    setSelectedCarId,
    filter,
    setFilter,
    sort,
    setSort,
    compare,
    cmpMode,
    setCmpMode,
    toggleCompare,
    clearCompare,
    custTab,
    setCustTab,
    custScreen,
    setCustScreen,
    custVendorId,
    custBookingId,
    openVendor,
    openBooking,
    startBooking,
    bookingForm,
    updateBookingForm,
    confirmBooking,
    custRate,
    setCustRate,
    custRevText,
    setCustRevText,
    submitReview,
    isModeAvailable,
    getFromPrice,
    formatCurrency,
    showToast,
  } = useApp();

  const [localOtp, setLocalOtp] = useState<string>('');

  // Active bookings for Arjun
  const myBookings = bookings.filter(b => b.customer === 'Arjun (you)');
  const activeBookings = myBookings.filter(
    b => !['completed', 'rejected', 'expired'].includes(b.status)
  );
  const latestActiveBooking = activeBookings[activeBookings.length - 1];

  // Filtered & sorted vendor list
  const filteredVendors = vendors
    .filter(v => v.status === 'live')
    .filter(v => (filter === 'all' ? true : isModeAvailable(v, filter)))
    .sort((a, b) => {
      if (sort === 'near') return a.dist - b.dist;
      if (sort === 'rated') return b.rating - a.rating;
      if (sort === 'price') return getFromPrice(a) - getFromPrice(b);
      return 0;
    });

  const selectedVendor = vendors.find(v => v.id === custVendorId);
  const trackedBooking = bookings.find(b => b.id === custBookingId);

  // Time remaining helper for timers
  const getSecondsLeft = (deadline: number | null) => {
    if (!deadline) return 0;
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper icons
  const getModeIcon = (mode: ServiceMode) => {
    switch (mode) {
      case 'walkin':
        return <Navigation className="w-3 h-3" />;
      case 'pickup':
        return <Car className="w-3 h-3" />;
      case 'home':
        return <MapPin className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f3ef] text-ink select-none font-sans">
      {/* 1. Header Area */}
      {custScreen === 'home' && custTab === 'home' ? (
        <div className="bg-gradient-to-b from-[#ffe3cf] via-[#fff3ea] to-[#f7f4f1] px-4 pt-8 pb-3 border-b border-surface-line/50">
          {/* Vehicle Selector bar */}
          <div className="flex items-center gap-2.5 bg-white rounded-2xl p-2.5 shadow-card border border-surface-line/40">
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              {selectedCar.type === 'Bike' ? (
                <Bike className="w-5 h-5 text-brand" />
              ) : (
                <Car className="w-5 h-5 text-brand" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                {selectedCar.reg}
              </div>
              <select
                value={selectedCarId}
                onChange={e => setSelectedCarId(e.target.value)}
                className="bg-transparent font-bold text-sm text-ink w-full focus:outline-none cursor-pointer"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Welcome */}
          <div className="mt-3">
            <span className="text-xs font-semibold text-ink-muted">Hi Arjun 👋</span>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              What does your {selectedCar.type === 'Bike' ? 'bike' : 'car'} need today?
            </h2>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 pt-8 pb-3 border-b border-surface-line flex items-center justify-between">
          {custScreen !== 'home' ? (
            <button
              onClick={() => {
                if (custScreen === 'book' && bookingForm?.step === 2) {
                  updateBookingForm({ step: 1 });
                } else if (custScreen === 'book') {
                  setCustScreen('vendor');
                } else {
                  setCustScreen('home');
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                {custScreen === 'book' && bookingForm?.step === 2
                  ? 'Back to step 1'
                  : custScreen === 'vendor'
                  ? 'Centres'
                  : 'Back'}
              </span>
            </button>
          ) : (
            <h2 className="font-extrabold text-base text-ink capitalize">
              {custTab === 'bookings' ? 'My Bookings' : 'My Profile'}
            </h2>
          )}

          {custScreen === 'book' && (
            <span className="text-xs font-bold text-ink-muted">
              Step {bookingForm?.step || 1} of 2
            </span>
          )}
        </div>
      )}

      {/* 2. Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* ================= SCREEN: COMPARE ================= */}
        {custScreen === 'compare' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Compare Centres</h3>
                <p className="text-xs text-ink-muted">
                  Full wash for your {selectedCar.type}. Green is best value.
                </p>
              </div>
              <button
                onClick={clearCompare}
                className="text-xs font-bold text-brand hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Compare Table */}
            <div className="bg-white rounded-2xl p-3 border border-surface-line shadow-card overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-surface-line/70">
                    <td className="py-2 text-ink-muted font-bold">Centre</td>
                    {compare.map(vid => {
                      const v = vendors.find(x => x.id === vid)!;
                      return (
                        <td key={vid} className="py-2 px-2 font-extrabold text-ink">
                          {v.name}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-surface-line/70">
                    <td className="py-2 text-ink-muted font-bold">Full Wash</td>
                    {(() => {
                      const prices = compare.map(
                        vid => vendors.find(x => x.id === vid)!.prices.full[0]
                      );
                      const minP = Math.min(...prices);
                      return compare.map(vid => {
                        const p = vendors.find(x => x.id === vid)!.prices.full[0];
                        return (
                          <td
                            key={vid}
                            className={`py-2 px-2 font-bold ${
                              p === minP ? 'text-status-good font-extrabold' : ''
                            }`}
                          >
                            {formatCurrency(p)}
                          </td>
                        );
                      });
                    })()}
                  </tr>
                  <tr className="border-b border-surface-line/70">
                    <td className="py-2 text-ink-muted font-bold">Rating</td>
                    {compare.map(vid => {
                      const v = vendors.find(x => x.id === vid)!;
                      return (
                        <td key={vid} className="py-2 px-2 font-semibold">
                          ★ {v.rating.toFixed(1)} ({v.reviews})
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-surface-line/70">
                    <td className="py-2 text-ink-muted font-bold">Distance</td>
                    {compare.map(vid => {
                      const v = vendors.find(x => x.id === vid)!;
                      return (
                        <td key={vid} className="py-2 px-2 font-semibold">
                          {v.dist} km
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-2 text-ink-muted font-bold">Action</td>
                    {compare.map(vid => (
                      <td key={vid} className="py-2 px-2">
                        <button
                          onClick={() => openVendor(vid)}
                          className="px-2.5 py-1 rounded-lg bg-brand text-white text-[11px] font-bold"
                        >
                          View
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SCREEN: VENDOR DETAILS ================= */}
        {custScreen === 'vendor' && selectedVendor && (
          <div className="space-y-3 pb-16">
            {/* Vendor Banner */}
            <div
              className="rounded-2xl p-4 text-white shadow-card flex flex-col justify-end min-h-[110px]"
              style={{
                background: `linear-gradient(135deg, ${selectedVendor.color}, #1a1f36)`,
              }}
            >
              <h2 className="text-xl font-extrabold tracking-tight">{selectedVendor.name}</h2>
              <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                <span className="font-bold flex items-center gap-1 text-amber-300">
                  ★ {selectedVendor.rating.toFixed(1)}
                </span>
                <span>• {selectedVendor.reviews} reviews</span>
                <span>• {selectedVendor.dist} km away</span>
              </div>
            </div>

            <div className="text-xs text-ink-muted flex items-center gap-1.5 px-1">
              <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{selectedVendor.area}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{selectedVendor.hours}</span>
            </div>

            {/* Service Modes Offered */}
            <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink-muted">
                Available Service Modes
              </h3>
              {(['walkin', 'pickup', 'home'] as ServiceMode[]).map(mode => {
                const available = isModeAvailable(selectedVendor, mode);
                const info = SERVICE_MODE_INFO[mode];
                const modeObj = selectedVendor.modes[mode];

                return (
                  <div
                    key={mode}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                      available
                        ? 'bg-surface-subtle/50 border-surface-line'
                        : 'bg-slate-50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          available ? 'bg-brand-soft text-brand' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {getModeIcon(mode)}
                      </div>
                      <div>
                        <span className="font-bold">{info.label}</span>
                        <p className="text-[11px] text-ink-muted">
                          {mode === 'walkin'
                            ? 'Drive-in at chosen time'
                            : modeObj.on
                            ? `+${formatCurrency((modeObj as any).fee)} (up to ${
                                (modeObj as any).radius
                              } km)`
                            : 'Not offered by this centre'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        available
                          ? 'bg-status-goodSoft text-status-good'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Packages list for selected vehicle */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink-muted px-1">
                Packages for {selectedCar.type}
              </h3>
              {PACKAGES.filter(p => selectedVendor.prices[p.id]).map(pkg => {
                const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(selectedCar.type);
                const price = selectedVendor.prices[pkg.id][ti];

                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl p-3 border border-surface-line shadow-card flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-ink">{pkg.name}</span>
                        {pkg.centreOnly && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Centre only
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted">{pkg.desc}</p>
                      <span className="text-[11px] text-brand font-semibold">
                        ⏱ {pkg.mins} minutes duration
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-base font-extrabold text-ink">
                        {formatCurrency(price)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verified Reviews */}
            <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink-muted">
                Customer Reviews
              </h3>
              {myBookings
                .filter(b => b.vendorId === selectedVendor.id && b.review)
                .map(b => (
                  <div key={b.id} className="border-b border-surface-line/60 pb-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{b.customer}</span>
                      <span className="text-amber-500 font-bold">
                        {'★'.repeat(b.review!.stars)}
                      </span>
                    </div>
                    <p className="text-ink-muted mt-0.5">{b.review!.text}</p>
                  </div>
                ))}
              <div className="border-b border-surface-line/60 pb-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Nikhil T (Technopark)</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-ink-muted mt-0.5">
                  Pick & drop was super smooth. Driver shared 4 photos before and after wash!
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-3 left-4 right-4 max-w-[348px] mx-auto">
              <button
                onClick={() => startBooking(selectedVendor.id)}
                className="w-full py-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-extrabold text-sm shadow-float flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Book a Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN: BOOKING FLOW ================= */}
        {custScreen === 'book' && selectedVendor && bookingForm && (
          <div className="space-y-4 pb-20">
            {/* Step 1: Package & Mode Selection */}
            {bookingForm.step === 1 && (
              <div className="space-y-4">
                {/* Choose package */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-ink">1. Choose Package</h3>
                  {PACKAGES.filter(p => selectedVendor.prices[p.id]).map(pkg => {
                    const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(selectedCar.type);
                    const price = selectedVendor.prices[pkg.id][ti];
                    const selected = bookingForm.pkg === pkg.id;

                    return (
                      <label
                        key={pkg.id}
                        onClick={() => updateBookingForm({ pkg: pkg.id })}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          selected
                            ? 'bg-brand-soft/50 border-brand shadow-sm'
                            : 'bg-white border-surface-line hover:border-brand-line'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="pkg"
                            checked={selected}
                            onChange={() => {}}
                            className="accent-brand w-4 h-4"
                          />
                          <div>
                            <div className="font-bold text-xs text-ink">{pkg.name}</div>
                            <div className="text-[11px] text-ink-muted">
                              {pkg.mins} mins {pkg.centreOnly ? '• at centre only' : ''}
                            </div>
                          </div>
                        </div>
                        <span className="font-extrabold text-sm text-ink">
                          {formatCurrency(price)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Choose Service Mode */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-ink">2. How should it be done?</h3>
                  {(['walkin', 'pickup', 'home'] as ServiceMode[]).map(mode => {
                    const available = isModeAvailable(selectedVendor, mode);
                    const pkgObj = PACKAGES.find(p => p.id === bookingForm.pkg)!;
                    const disabled = !available || (pkgObj.centreOnly && mode !== 'walkin');
                    const selected = bookingForm.mode === mode;
                    const modeObj = selectedVendor.modes[mode];

                    const fee = mode === 'walkin' ? 0 : (modeObj as any).fee;

                    return (
                      <label
                        key={mode}
                        onClick={() => {
                          if (!disabled) updateBookingForm({ mode });
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          disabled
                            ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                            : selected
                            ? 'bg-brand-soft/50 border-brand shadow-sm cursor-pointer'
                            : 'bg-white border-surface-line hover:border-brand-line cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="mode"
                            disabled={disabled}
                            checked={selected}
                            onChange={() => {}}
                            className="accent-brand w-4 h-4"
                          />
                          <div>
                            <div className="font-bold text-xs text-ink flex items-center gap-1.5">
                              {getModeIcon(mode)}
                              <span>{SERVICE_MODE_INFO[mode].label}</span>
                            </div>
                            <div className="text-[11px] text-ink-muted">
                              {mode === 'walkin'
                                ? 'Drive in yourself (Free)'
                                : disabled
                                ? 'Unavailable for this package / radius'
                                : `Extra fee: +${formatCurrency(fee)}`}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-xs">
                          {fee === 0 ? 'Free' : `+${formatCurrency(fee)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Continue button */}
                <button
                  onClick={() => updateBookingForm({ step: 2 })}
                  className="w-full py-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-extrabold text-sm shadow-md"
                >
                  Continue to Slot & Payment
                </button>
              </div>
            )}

            {/* Step 2: Slot & Payment */}
            {bookingForm.step === 2 && (
              <div className="space-y-4">
                {/* Package Recap banner */}
                <div className="bg-brand-soft rounded-2xl p-3 border border-brand-line flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-ink">
                      {PACKAGES.find(p => p.id === bookingForm.pkg)?.name}
                    </span>
                    <p className="text-[11px] text-ink-muted">
                      {SERVICE_MODE_INFO[bookingForm.mode].label} • {selectedCar.name}
                    </p>
                  </div>
                  <button
                    onClick={() => updateBookingForm({ step: 1 })}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Address if pickup or home */}
                {bookingForm.mode !== 'walkin' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-muted block">
                      {bookingForm.mode === 'pickup' ? 'Pickup Address' : 'Doorstep Wash Address'}
                    </label>
                    <input
                      type="text"
                      value={bookingForm.address}
                      onChange={e => updateBookingForm({ address: e.target.value })}
                      placeholder="Enter flat / house number and street..."
                      className="w-full bg-white rounded-xl border border-surface-line px-3 py-2 text-xs font-medium focus:outline-none focus:border-brand"
                    />
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-ink">Pick a Date</h3>
                  <div className="flex gap-2">
                    {['Today', 'Tomorrow', 'Wed 11 Nov'].map((dayName, idx) => (
                      <button
                        key={dayName}
                        onClick={() => updateBookingForm({ day: idx, slot: null })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          bookingForm.day === idx
                            ? 'bg-brand text-white border-brand shadow-sm'
                            : 'bg-white text-ink border-surface-line hover:border-brand-line'
                        }`}
                      >
                        {dayName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-ink">Select Time Slot</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[9, 10, 11, 12, 14, 15, 16, 17]
                      .filter(h => !(bookingForm.day === 0 && h < 11))
                      .map(hour => {
                        const slotStr = `${hour.toString().padStart(2, '0')}:00`;
                        const isSelected = bookingForm.slot === slotStr;
                        return (
                          <button
                            key={hour}
                            onClick={() => updateBookingForm({ slot: slotStr })}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              isSelected
                                ? 'bg-brand text-white border-brand shadow-sm'
                                : 'bg-white text-ink border-surface-line hover:border-brand-line'
                            }`}
                          >
                            {slotStr}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Payment method */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-ink">Payment Mode</h3>
                  <div className="flex gap-2">
                    {(['UPI', 'Card', 'Pay at service'] as const).map(pMode => (
                      <button
                        key={pMode}
                        onClick={() => updateBookingForm({ pay: pMode })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          bookingForm.pay === pMode
                            ? 'bg-ink text-white border-ink shadow-sm'
                            : 'bg-white text-ink border-surface-line'
                        }`}
                      >
                        {pMode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                {(() => {
                  const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(selectedCar.type);
                  const base = selectedVendor.prices[bookingForm.pkg][ti];
                  const modeFee =
                    bookingForm.mode === 'walkin'
                      ? 0
                      : (selectedVendor.modes[bookingForm.mode] as any).fee;
                  const total = base + modeFee + PLATFORM_FEE;

                  return (
                    <div className="bg-white rounded-2xl p-3 border border-surface-line shadow-card space-y-1.5 text-xs">
                      <div className="flex justify-between text-ink-muted">
                        <span>
                          {PACKAGES.find(p => p.id === bookingForm.pkg)?.name} ({selectedCar.type})
                        </span>
                        <span className="font-bold text-ink">{formatCurrency(base)}</span>
                      </div>
                      {modeFee > 0 && (
                        <div className="flex justify-between text-ink-muted">
                          <span>{SERVICE_MODE_INFO[bookingForm.mode].label}</span>
                          <span className="font-bold text-ink">{formatCurrency(modeFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-ink-muted">
                        <span>Platform fee</span>
                        <span className="font-bold text-ink">{formatCurrency(PLATFORM_FEE)}</span>
                      </div>
                      <div className="border-t border-dashed border-surface-line pt-2 flex justify-between font-extrabold text-sm text-ink">
                        <span>Total Payable</span>
                        <span className="text-brand font-extrabold">{formatCurrency(total)}</span>
                      </div>
                      <p className="text-[10px] text-ink-subtle text-center pt-1">
                        Charged only after the wash centre formally accepts.
                      </p>
                    </div>
                  );
                })()}

                {/* Confirm button */}
                <button
                  disabled={!bookingForm.slot}
                  onClick={confirmBooking}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-float transition-all ${
                    bookingForm.slot
                      ? 'bg-brand hover:bg-brand-hover text-white cursor-pointer active:scale-[0.99]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {bookingForm.slot ? 'Request Booking' : 'Choose a time slot to continue'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: STATUS / TRACKING ================= */}
        {custScreen === 'status' && trackedBooking && (
          <div className="space-y-3 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-ink-muted">
                  Booking #{trackedBooking.id}
                </span>
                <h3 className="font-extrabold text-base text-ink">
                  {vendors.find(v => v.id === trackedBooking.vendorId)?.name}
                </h3>
              </div>
              {(() => {
                const conf = STATUS_BADGE_CONFIG[trackedBooking.status];
                return (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${conf.bg} ${conf.text}`}
                  >
                    {conf.label}
                  </span>
                );
              })()}
            </div>

            {/* 10 minute acceptance countdown alert */}
            {trackedBooking.status === 'requested' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-semibold text-amber-900">
                    Centre has 10 minutes to accept
                  </span>
                </div>
                <span className="font-extrabold text-amber-700 tabular-nums">
                  {formatTimer(getSecondsLeft(trackedBooking.deadline))}
                </span>
              </div>
            )}

            {/* Fallback alternatives if declined or expired */}
            {(trackedBooking.status === 'rejected' || trackedBooking.status === 'expired') && (
              <div className="space-y-2">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{STATUS_LABELS[trackedBooking.status]}</span>
                  </div>
                  <p>Nothing was charged to your account. You can book at these nearby centres:</p>
                </div>

                {vendors
                  .filter(
                    v =>
                      v.status === 'live' &&
                      v.id !== trackedBooking.vendorId &&
                      isModeAvailable(v, trackedBooking.mode)
                  )
                  .slice(0, 2)
                  .map(alt => (
                    <div
                      key={alt.id}
                      className="bg-white rounded-2xl p-3 border border-surface-line shadow-card flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs">{alt.name}</span>
                        <div className="text-[11px] text-ink-muted">
                          ★ {alt.rating.toFixed(1)} • {alt.dist} km
                        </div>
                      </div>
                      <button
                        onClick={() => openVendor(alt.id)}
                        className="px-3 py-1.5 rounded-xl bg-brand text-white font-bold text-xs"
                      >
                        Book Here
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Handover OTP Card */}
            {[
              'accepted',
              'picked_up',
              'on_the_way',
              'in_progress',
              'ready',
              'out_for_delivery',
              'checked_in',
            ].includes(trackedBooking.status) && (
              <div className="bg-white rounded-2xl p-3.5 border border-brand-line/60 shadow-card flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-brand">
                    Handover OTP
                  </span>
                  <p className="text-xs text-ink-muted">
                    Share with washer / driver at handover
                  </p>
                </div>
                <div className="text-2xl font-black tracking-widest text-brand font-mono bg-brand-soft px-3 py-1 rounded-xl border border-brand-line">
                  {trackedBooking.otp}
                </div>
              </div>
            )}

            {/* Driver information for pickup mode */}
            {trackedBooking.mode === 'pickup' &&
              trackedBooking.driver &&
              ['accepted', 'picked_up', 'out_for_delivery'].includes(trackedBooking.status) && (
                <div className="bg-white rounded-2xl p-3 border border-surface-line shadow-card flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold">
                      SK
                    </div>
                    <div>
                      <div className="font-bold">{trackedBooking.driver.name}</div>
                      <div className="text-[11px] text-ink-muted">
                        Driver • {trackedBooking.driver.reg}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`tel:${trackedBooking.driver.phone}`}
                    className="flex items-center gap-1 font-bold text-brand hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              )}

            {/* Step Progression Tracker */}
            <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-ink-muted">
                Order Tracking
              </h4>
              <div className="space-y-4 relative pl-3 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-line">
                {FLOW[trackedBooking.mode].map((stepStatus, idx) => {
                  const flow = FLOW[trackedBooking.mode];
                  const currentIndex = flow.indexOf(trackedBooking.status);
                  const isDone = idx < currentIndex || trackedBooking.status === 'completed';
                  const isCurrent = idx === currentIndex && trackedBooking.status !== 'completed';

                  return (
                    <div key={stepStatus} className="flex items-start gap-3 relative z-10">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-brand border-brand text-white'
                            : isCurrent
                            ? 'bg-amber-100 border-amber-500 animate-pulse'
                            : 'bg-white border-surface-line text-transparent'
                        }`}
                      >
                        {isDone && '✓'}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            isDone || isCurrent ? 'text-ink' : 'text-ink-subtle'
                          }`}
                        >
                          {STATUS_LABELS[stepStatus]}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            In progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post-Wash Rating submission */}
            {trackedBooking.status === 'completed' && (
              <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-ink">Rate this Wash</h4>
                  <CheckCircle2 className="w-5 h-5 text-status-good" />
                </div>
                {trackedBooking.review ? (
                  <div className="space-y-1 text-xs">
                    <span className="text-amber-500 font-bold text-base">
                      {'★'.repeat(trackedBooking.review.stars)}
                    </span>
                    <p className="text-ink-muted font-medium italic">
                      "{trackedBooking.review.text}"
                    </p>
                    <span className="text-[10px] text-status-good font-bold block">
                      Review published on centre page
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(starNum => (
                        <button
                          key={starNum}
                          onClick={() => setCustRate(starNum)}
                          className={`text-2xl transition-transform hover:scale-110 ${
                            custRate >= starNum ? 'text-amber-400' : 'text-slate-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={custRevText}
                      onChange={e => setCustRevText(e.target.value)}
                      placeholder="Share your experience (shine, punctuality, care)..."
                      className="w-full bg-[#fbf9f6] border border-surface-line rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand"
                      rows={2}
                    />
                    <button
                      disabled={custRate === 0}
                      onClick={submitReview}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                        custRate > 0
                          ? 'bg-brand text-white hover:bg-brand-hover'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: HOME (EXPLORE) ================= */}
        {custScreen === 'home' && custTab === 'home' && (
          <div className="space-y-4 pb-16">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setFilter('all')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border border-surface-line shadow-sm hover:border-brand-line transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold text-ink">Wash</span>
              </button>

              <button
                onClick={() => showToast('Roadside SOS assistance launches in Phase 2')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border border-surface-line shadow-sm opacity-60 relative"
              >
                <span className="absolute -top-1.5 right-1 bg-ink text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  SOON
                </span>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-ink-muted">Roadside</span>
              </button>

              <button
                onClick={() => showToast('Genuine spare parts store launches in Phase 2')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border border-surface-line shadow-sm opacity-60 relative"
              >
                <span className="absolute -top-1.5 right-1 bg-ink text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  SOON
                </span>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-ink-muted">Parts</span>
              </button>

              <button
                onClick={() => showToast('Auto accessories catalog launches in Phase 2')}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border border-surface-line shadow-sm opacity-60 relative"
              >
                <span className="absolute -top-1.5 right-1 bg-ink text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  SOON
                </span>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-ink-muted">Accessories</span>
              </button>
            </div>

            {/* Live active order card if any */}
            {latestActiveBooking && (
              <div className="bg-ink text-white rounded-2xl p-3.5 shadow-card flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-hi tracking-wider">
                    Active Order #{latestActiveBooking.id}
                  </span>
                  <div className="font-extrabold text-sm">
                    {STATUS_LABELS[latestActiveBooking.status]}
                  </div>
                  <span className="text-xs text-white/70">
                    {vendors.find(v => v.id === latestActiveBooking.vendorId)?.name}
                  </span>
                </div>
                <button
                  onClick={() => openBooking(latestActiveBooking.id)}
                  className="px-3.5 py-2 rounded-xl bg-brand-hi hover:bg-orange-500 text-ink font-extrabold text-xs shadow-sm transition-all"
                >
                  Track
                </button>
              </div>
            )}

            {/* Section Header */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-extrabold text-sm text-ink">Centres Near You</h3>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as any)}
                  className="bg-white border border-surface-line rounded-full px-2.5 py-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="near">Nearest</option>
                  <option value="rated">Top rated</option>
                  <option value="price">Lowest price</option>
                </select>
                <button
                  onClick={() => setCmpMode(!cmpMode)}
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-full transition-colors ${
                    cmpMode ? 'bg-ink text-white' : 'text-brand hover:bg-brand-soft'
                  }`}
                >
                  {cmpMode ? 'Done' : 'Compare'}
                </button>
              </div>
            </div>

            {/* Service Mode Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Modes' },
                { id: 'walkin', label: 'At centre' },
                { id: 'pickup', label: 'Pick & Drop' },
                { id: 'home', label: 'At home' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-white text-ink border border-surface-line hover:border-brand-line'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Vendors List */}
            <div className="space-y-2.5">
              {filteredVendors.map(vendor => {
                const isCompared = compare.includes(vendor.id);
                const fromPrice = getFromPrice(vendor);

                return (
                  <div
                    key={vendor.id}
                    onClick={() => {
                      if (cmpMode) {
                        toggleCompare(vendor.id);
                      } else {
                        openVendor(vendor.id);
                      }
                    }}
                    className={`bg-white rounded-2xl p-3 border shadow-card flex items-center justify-between cursor-pointer hover:border-brand-line transition-all ${
                      isCompared ? 'ring-2 ring-brand border-transparent' : 'border-surface-line'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Circle */}
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: vendor.color }}
                      >
                        {vendor.name
                          .split(' ')
                          .slice(0, 2)
                          .map(w => w[0])
                          .join('')}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs text-ink truncate">{vendor.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                          <span className="font-bold text-amber-600 flex items-center gap-0.5">
                            ★ {vendor.rating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{vendor.dist} km</span>
                          <span>•</span>
                          <span className="truncate">{vendor.area.split(',')[0]}</span>
                        </div>
                        {/* Modes pills */}
                        <div className="flex gap-1.5 pt-0.5">
                          {(['walkin', 'pickup', 'home'] as ServiceMode[])
                            .filter(m => isModeAvailable(vendor, m))
                            .map(m => (
                              <span
                                key={m}
                                className="text-[10px] font-semibold text-ink-muted bg-surface-subtle px-1.5 py-0.5 rounded flex items-center gap-1"
                              >
                                {getModeIcon(m)}
                                <span>{SERVICE_MODE_INFO[m].label}</span>
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Price or Checkbox */}
                    {cmpMode ? (
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => {}}
                        className="accent-brand w-5 h-5 ml-2 cursor-pointer"
                      />
                    ) : (
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-[10px] text-ink-subtle block">from</span>
                        <span className="font-extrabold text-sm text-ink">
                          {formatCurrency(fromPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredVendors.length === 0 && (
                <div className="text-center py-8 text-xs text-ink-muted">
                  No centres match this filter nearby. Try another mode.
                </div>
              )}
            </div>

            {/* Compare float bar */}
            {cmpMode && (
              <div className="fixed bottom-14 left-4 right-4 max-w-[348px] mx-auto bg-ink text-white p-3 rounded-2xl shadow-float flex items-center justify-between z-20">
                <span className="text-xs font-semibold">
                  {compare.length ? `${compare.length} selected` : 'Select 2 or 3 centres'}
                </span>
                <button
                  disabled={compare.length < 2}
                  onClick={() => setCustScreen('compare')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    compare.length >= 2
                      ? 'bg-brand text-white hover:bg-brand-hover'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Compare Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: BOOKINGS HISTORY ================= */}
        {custScreen === 'home' && custTab === 'bookings' && (
          <div className="space-y-3 pb-16">
            {myBookings
              .sort((a, b) => b.id - a.id)
              .map(booking => {
                const v = vendors.find(x => x.id === booking.vendorId);
                const conf = STATUS_BADGE_CONFIG[booking.status];
                const total = booking.base + booking.modeFee + PLATFORM_FEE;

                return (
                  <div
                    key={booking.id}
                    onClick={() => openBooking(booking.id)}
                    className="bg-white rounded-2xl p-3 border border-surface-line shadow-card space-y-2 cursor-pointer hover:border-brand-line transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-ink">{v?.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}
                      >
                        {conf.label}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted">
                      WK-{booking.id} • {PACKAGES.find(p => p.id === booking.pkg)?.name} •{' '}
                      {SERVICE_MODE_INFO[booking.mode].label}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-line/50">
                      <span className="text-ink-muted">{booking.slot}</span>
                      <span className="font-extrabold text-brand">{formatCurrency(total)}</span>
                    </div>
                  </div>
                );
              })}

            {myBookings.length === 0 && (
              <div className="text-center py-12 text-xs text-ink-muted">No bookings yet.</div>
            )}
          </div>
        )}

        {/* ================= SCREEN: PROFILE ================= */}
        {custScreen === 'home' && custTab === 'profile' && (
          <div className="space-y-3 pb-16">
            {/* User Card */}
            <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-soft text-brand font-black flex items-center justify-center text-lg">
                AM
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-ink">Arjun Menon</h3>
                <p className="text-xs text-ink-muted">+91 98950 00000 • Technopark</p>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
            </div>

            {/* My Vehicles */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-ink-muted px-1">
                My Garage
              </h4>
              {vehicles.map(v => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-3 border border-surface-line shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-surface-subtle flex items-center justify-center text-brand">
                      {v.type === 'Bike' ? (
                        <Bike className="w-4 h-4" />
                      ) : (
                        <Car className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{v.name}</span>
                      <span className="text-[10px] text-ink-muted">{v.reg}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink-muted">{v.type}</span>
                </div>
              ))}
            </div>

            {/* WashPass Subscription Teaser */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>WashPass • Launching in Phase 2</span>
              </div>
              <p className="text-xs text-amber-800">
                2 exterior washes + 1 interior deep clean every month, with 0 platform fees.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Mobile App Tab Bar */}
      <div className="bg-white border-t border-surface-line px-4 py-2 flex items-center justify-around shrink-0 z-30">
        <button
          onClick={() => {
            setCustTab('home');
            setCustScreen('home');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            custTab === 'home' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => {
            setCustTab('bookings');
            setCustScreen('home');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold relative transition-colors ${
            custTab === 'bookings' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <div className="relative">
            <Car className="w-5 h-5" />
            {activeBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {activeBookings.length}
              </span>
            )}
          </div>
          <span>Bookings</span>
        </button>

        <button
          onClick={() => {
            setCustTab('profile');
            setCustScreen('home');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            custTab === 'profile' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Inbox,
  Briefcase,
  Sliders,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  Bike,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PACKAGES, SERVICE_MODE_INFO, STATUS_BADGE_CONFIG, STATUS_LABELS, FLOW } from '../mockData';
import { ServiceMode, BookingStatus } from '../types';

export const VendorApp: React.FC = () => {
  const {
    vendors,
    bookings,
    vendorPortalId,
    setVendorPortalId,
    activeVendor,
    vendorTab,
    setVendorTab,
    acceptBooking,
    rejectBooking,
    advanceJob,
    toggleVendorMode,
    updateVendorModeNum,
    formatCurrency,
  } = useApp();

  const [otpInputs, setOtpInputs] = useState<Record<number, string>>({});

  // Bookings for this vendor
  const vendorBookings = bookings.filter(b => b.vendorId === activeVendor.id);
  const requestedBookings = vendorBookings
    .filter(b => b.status === 'requested')
    .sort((a, b) => b.id - a.id);
  const activeJobs = vendorBookings
    .filter(b => !['requested', 'completed', 'rejected', 'expired'].includes(b.status))
    .sort((a, b) => b.id - a.id);
  const completedJobs = vendorBookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => b.id - a.id);

  // Time calculation
  const getSecondsLeft = (deadline: number | null) => {
    if (!deadline) return 0;
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Next action button label
  const getNextActionConfig = (status: BookingStatus, mode: ServiceMode) => {
    switch (status) {
      case 'accepted':
        if (mode === 'walkin') return { label: 'Check Car In', needsOtp: false };
        if (mode === 'pickup') return { label: 'Mark Picked Up (OTP)', needsOtp: true };
        return { label: 'Start Travel to Customer', needsOtp: false };
      case 'checked_in':
      case 'picked_up':
        return { label: 'Start Wash', needsOtp: false };
      case 'on_the_way':
        return { label: 'Arrived, Start Wash', needsOtp: false };
      case 'in_progress':
        if (mode === 'walkin') return { label: 'Mark Wash Ready', needsOtp: false };
        if (mode === 'pickup') return { label: 'Send Out for Delivery', needsOtp: false };
        return { label: 'Complete Wash (OTP)', needsOtp: true };
      case 'ready':
        return { label: 'Hand Over to Customer (OTP)', needsOtp: true };
      case 'out_for_delivery':
        return { label: 'Vehicle Delivered (OTP)', needsOtp: true };
      default:
        return { label: 'Advance Job', needsOtp: false };
    }
  };

  const calculateNetEarn = (base: number, modeFee: number) => {
    const total = base + modeFee;
    const comm = (total * activeVendor.commission) / 100;
    return total - comm;
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f3ef] text-ink select-none font-sans">
      {/* 1. Header with Centre Switcher */}
      <div className="bg-white px-4 pt-8 pb-3 border-b border-surface-line flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
            Vendor Partner Portal
          </span>
          <select
            value={vendorPortalId}
            onChange={e => setVendorPortalId(e.target.value)}
            className="bg-transparent font-extrabold text-sm text-ink focus:outline-none cursor-pointer max-w-[210px] truncate"
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-goodSoft text-status-good font-bold text-xs">
          <div className="w-2 h-2 rounded-full bg-status-good animate-pulse" />
          <span>Centre Open</span>
        </div>
      </div>

      {/* 2. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* ================= TAB: REQUESTS ================= */}
        {vendorTab === 'req' && (
          <div className="space-y-3 pb-16">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-ink">New Booking Requests</h3>
              <span className="text-xs font-bold text-ink-muted">
                {requestedBookings.length} pending
              </span>
            </div>

            {requestedBookings.map(b => {
              const net = calculateNetEarn(b.base, b.modeFee);
              const secLeft = getSecondsLeft(b.deadline);

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-ink">{b.customer}</h4>
                      <p className="text-[11px] text-ink-muted">
                        WK-{b.id} • {b.carType}
                      </p>
                    </div>
                    {/* 10 minute countdown */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>{formatTimer(secLeft)}</span>
                    </div>
                  </div>

                  <div className="bg-surface-subtle p-2.5 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>{PACKAGES.find(p => p.id === b.pkg)?.name}</span>
                      <span className="text-brand">{SERVICE_MODE_INFO[b.mode].label}</span>
                    </div>
                    <div className="text-[11px] text-ink-muted">Requested for: {b.slot}</div>
                    {b.address && (
                      <div className="text-[11px] text-ink-muted flex items-center gap-1 pt-0.5">
                        <MapPin className="w-3 h-3 text-brand" />
                        <span className="truncate">{b.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Earnings Callout */}
                  <div className="flex items-center justify-between border-t border-dashed border-surface-line pt-2 text-xs">
                    <span className="text-ink-muted font-medium">Your Net Payout</span>
                    <span className="font-extrabold text-base text-status-good">
                      {formatCurrency(net)}
                    </span>
                  </div>

                  {/* Accept / Decline */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => rejectBooking(b.id)}
                      className="flex-1 py-2.5 rounded-xl border border-surface-line bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => acceptBooking(b.id)}
                      className="flex-2 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-extrabold text-xs shadow-sm transition-all"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>
              );
            })}

            {requestedBookings.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-surface-line text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-ink">No new requests</h4>
                <p className="text-xs text-ink-muted">
                  New incoming customer bookings will appear here instantly with a 10-minute timer.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: JOBS ================= */}
        {vendorTab === 'jobs' && (
          <div className="space-y-3 pb-16">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-ink">Live Jobs in Progress</h3>
              <span className="text-xs font-bold text-ink-muted">{activeJobs.length} active</span>
            </div>

            {activeJobs.map(b => {
              const conf = STATUS_BADGE_CONFIG[b.status];
              const action = getNextActionConfig(b.status, b.mode);
              const currentOtp = otpInputs[b.id] || '';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-ink">{b.customer}</h4>
                      <p className="text-[11px] text-ink-muted">
                        WK-{b.id} • {b.carType} • {b.slot}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}
                    >
                      {conf.label}
                    </span>
                  </div>

                  <div className="bg-surface-subtle p-2.5 rounded-xl space-y-1 text-xs">
                    <div className="font-bold">
                      {PACKAGES.find(p => p.id === b.pkg)?.name} •{' '}
                      <span className="text-brand">{SERVICE_MODE_INFO[b.mode].label}</span>
                    </div>
                    {b.address && (
                      <p className="text-[11px] text-ink-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand shrink-0" />
                        <span className="truncate">{b.address}</span>
                      </p>
                    )}
                    {b.mode === 'pickup' && b.status === 'accepted' && (
                      <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-medium">
                        Driver checklist: Check odometer, fuel gauge, and snap 4 inspection photos.
                      </div>
                    )}
                  </div>

                  {/* OTP requirement input */}
                  {action.needsOtp && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-ink">Enter Customer OTP</label>
                        <span className="text-[10px] text-ink-muted">
                          (Demo customer OTP: <span className="font-bold text-brand">{b.otp}</span>)
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={currentOtp}
                        onChange={e =>
                          setOtpInputs({
                            ...otpInputs,
                            [b.id]: e.target.value,
                          })
                        }
                        placeholder="Ask customer for 4-digit OTP"
                        className="w-full bg-[#fbf9f6] border border-surface-line rounded-xl px-3 py-2 text-xs font-mono tracking-widest text-center focus:outline-none focus:border-brand"
                      />
                    </div>
                  )}

                  {/* Advance button */}
                  <button
                    onClick={() => {
                      const success = advanceJob(b.id, currentOtp);
                      if (success) {
                        setOtpInputs({ ...otpInputs, [b.id]: '' });
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-extrabold text-xs shadow-sm transition-all"
                  >
                    {action.label}
                  </button>
                </div>
              );
            })}

            {activeJobs.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-surface-line text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-ink">No active jobs</h4>
                <p className="text-xs text-ink-muted">
                  Accept incoming requests to start and progress jobs here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SERVICES ================= */}
        {vendorTab === 'svc' && (
          <div className="space-y-4 pb-16">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-ink">Service Modes & Radius</h3>
              <p className="text-xs text-ink-muted">
                Customers only see services you activate, and only inside your delivery radius.
              </p>
            </div>

            {/* Toggle Modes */}
            <div className="space-y-3">
              {(['walkin', 'pickup', 'home'] as ServiceMode[]).map(mode => {
                const modeObj = activeVendor.modes[mode];
                const info = SERVICE_MODE_INFO[mode];

                return (
                  <div
                    key={mode}
                    className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                          {mode === 'walkin' ? (
                            <MapPin className="w-4 h-4" />
                          ) : mode === 'pickup' ? (
                            <Car className="w-4 h-4" />
                          ) : (
                            <Bike className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-xs">{info.label}</span>
                      </div>

                      {/* Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={modeObj.on}
                          onChange={() => toggleVendorMode(activeVendor.id, mode)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                      </label>
                    </div>

                    <p className="text-[11px] text-ink-muted">
                      {mode === 'walkin'
                        ? 'Customers drive into your centre at their booked time slot.'
                        : mode === 'pickup'
                        ? 'Your driver picks up the vehicle and returns it post-wash.'
                        : 'Your detailing crew travels to the customer location.'}
                    </p>

                    {/* Radius and fee inputs if on and not walkin */}
                    {mode !== 'walkin' && modeObj.on && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-line/60">
                        <div>
                          <label className="text-[10px] font-bold text-ink-muted block mb-0.5">
                            Max Radius (km)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={(modeObj as any).radius}
                            onChange={e =>
                              updateVendorModeNum(
                                activeVendor.id,
                                mode,
                                'radius',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full bg-[#fbf9f6] border border-surface-line rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-ink-muted block mb-0.5">
                            Extra Fee (₹)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={(modeObj as any).fee}
                            onChange={e =>
                              updateVendorModeNum(
                                activeVendor.id,
                                mode,
                                'fee',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full bg-[#fbf9f6] border border-surface-line rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price List Table */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-ink">Base Package Rates</h3>
              <div className="bg-white rounded-2xl p-3 border border-surface-line shadow-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-surface-line text-ink-muted">
                      <th className="text-left py-1.5">Package</th>
                      <th className="text-right py-1.5">Hatch</th>
                      <th className="text-right py-1.5">Sedan</th>
                      <th className="text-right py-1.5">SUV</th>
                      <th className="text-right py-1.5">Bike</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PACKAGES.filter(p => activeVendor.prices[p.id]).map(pkg => {
                      const prices = activeVendor.prices[pkg.id];
                      return (
                        <tr key={pkg.id} className="border-b border-surface-line/50">
                          <td className="py-2 font-bold text-ink">{pkg.name}</td>
                          <td className="text-right py-2">{formatCurrency(prices[0])}</td>
                          <td className="text-right py-2">{formatCurrency(prices[1])}</td>
                          <td className="text-right py-2 font-semibold text-brand">
                            {formatCurrency(prices[2])}
                          </td>
                          <td className="text-right py-2">{formatCurrency(prices[3] || 159)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: EARNINGS ================= */}
        {vendorTab === 'earn' && (
          <div className="space-y-4 pb-16">
            {/* KPI Cards */}
            {(() => {
              const gross = completedJobs.reduce((s, b) => s + b.base + b.modeFee, 0);
              const comm = completedJobs.reduce(
                (s, b) => s + ((b.base + b.modeFee) * activeVendor.commission) / 100,
                0
              );
              const netPayout = gross - comm;

              return (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-0.5">
                    <span className="text-[11px] font-bold text-ink-muted">Completed Jobs</span>
                    <div className="text-xl font-black text-ink">{completedJobs.length}</div>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-0.5">
                    <span className="text-[11px] font-bold text-ink-muted">Service GMV</span>
                    <div className="text-xl font-black text-ink">{formatCurrency(gross)}</div>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card space-y-0.5">
                    <span className="text-[11px] font-bold text-ink-muted">
                      Commission ({activeVendor.commission}%)
                    </span>
                    <div className="text-xl font-black text-rose-700">{formatCurrency(comm)}</div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-3.5 border border-emerald-200 shadow-card space-y-0.5">
                    <span className="text-[11px] font-bold text-emerald-900">
                      Next Payout (Mon)
                    </span>
                    <div className="text-xl font-black text-status-good">
                      {formatCurrency(netPayout)}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Completed list */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-ink">Completed Jobs History</h3>
              {completedJobs.map(b => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-3 border border-surface-line shadow-card flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-ink">{b.customer}</span>
                    <div className="text-[11px] text-ink-muted">
                      WK-{b.id} • {PACKAGES.find(p => p.id === b.pkg)?.name}
                    </div>
                  </div>
                  <span className="font-extrabold text-status-good">
                    {formatCurrency(calculateNetEarn(b.base, b.modeFee))}
                  </span>
                </div>
              ))}

              {completedJobs.length === 0 && (
                <div className="text-center py-6 text-xs text-ink-muted">
                  No completed jobs yet.
                </div>
              )}
            </div>

            {/* Rating Metrics */}
            <div className="bg-white rounded-2xl p-3.5 border border-surface-line shadow-card flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-ink">Average Partner Rating</span>
                <p className="text-[11px] text-ink-muted">
                  From {activeVendor.reviews} customer ratings
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-amber-500">
                  ★ {activeVendor.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-status-good font-bold block">
                  96% acceptance rate
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Vendor Tab Bar */}
      <div className="bg-white border-t border-surface-line px-4 py-2 flex items-center justify-around shrink-0 z-30">
        <button
          onClick={() => setVendorTab('req')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold relative transition-colors ${
            vendorTab === 'req' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <div className="relative">
            <Inbox className="w-5 h-5" />
            {requestedBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {requestedBookings.length}
              </span>
            )}
          </div>
          <span>Requests</span>
        </button>

        <button
          onClick={() => setVendorTab('jobs')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold relative transition-colors ${
            vendorTab === 'jobs' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <div className="relative">
            <Briefcase className="w-5 h-5" />
            {activeJobs.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-status-good text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {activeJobs.length}
              </span>
            )}
          </div>
          <span>Jobs</span>
        </button>

        <button
          onClick={() => setVendorTab('svc')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            vendorTab === 'svc' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span>Services</span>
        </button>

        <button
          onClick={() => setVendorTab('earn')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            vendorTab === 'earn' ? 'text-brand' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <IndianRupee className="w-5 h-5" />
          <span>Earnings</span>
        </button>
      </div>
    </div>
  );
};

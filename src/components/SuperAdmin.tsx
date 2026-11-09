import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Store,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { PACKAGES, SERVICE_MODE_INFO, STATUS_BADGE_CONFIG, PLATFORM_FEE } from '../mockData';
import { ServiceMode } from '../types';

export const SuperAdmin: React.FC = () => {
  const {
    vendors,
    bookings,
    flashId,
    updateVendorCommission,
    approveVendor,
    suspendVendor,
    formatCurrency,
  } = useApp();

  // Metrics computation
  const todayBookings = bookings.filter(b => b.customer !== 'Arjun (you)' || b.id !== 1031);
  const validBookings = todayBookings.filter(b => !['rejected', 'expired'].includes(b.status));
  const gmv = validBookings.reduce((sum, b) => sum + b.base + b.modeFee, 0);

  const platformRevenue = validBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      const v = vendors.find(x => x.id === b.vendorId);
      const commRate = v ? v.commission : 15;
      const comm = ((b.base + b.modeFee) * commRate) / 100;
      return sum + comm + PLATFORM_FEE;
    }, 0);

  const liveVendors = vendors.filter(v => v.status === 'live');
  const avgRating =
    liveVendors.filter(v => v.rating > 0).reduce((sum, v) => sum + v.rating, 0) /
    (liveVendors.filter(v => v.rating > 0).length || 1);

  const decidedBookings = todayBookings.filter(b => b.status !== 'requested');
  const acceptedCount = decidedBookings.filter(
    b => !['rejected', 'expired'].includes(b.status)
  ).length;
  const acceptanceRate = decidedBookings.length
    ? Math.round((acceptedCount / decidedBookings.length) * 100)
    : 100;

  // Breakdown by mode
  const modeCounts: Record<ServiceMode, number> = {
    walkin: validBookings.filter(b => b.mode === 'walkin').length,
    pickup: validBookings.filter(b => b.mode === 'pickup').length,
    home: validBookings.filter(b => b.mode === 'home').length,
  };
  const maxModeCount = Math.max(1, ...Object.values(modeCounts));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <ShieldCheck className="w-4 h-4" />
            <span>Operations Telemetry & Admin Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mt-1">
            Kazhakoottam Pilot Dashboard
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Real-time multi-centre telemetry, automated dispatch metrics, and partner KYC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl px-4 py-2 border border-surface-line shadow-card flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-muted">Default Commission</span>
            <span className="font-black text-sm text-ink">15%</span>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Today's Orders</span>
          <div className="text-2xl font-black text-ink">{todayBookings.length}</div>
          <span className="text-[10px] text-status-good font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% vs yesterday
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Gross Booking Value</span>
          <div className="text-2xl font-black text-ink">{formatCurrency(gmv)}</div>
          <span className="text-[10px] text-ink-muted font-medium">Kazhakoottam cluster</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Platform Revenue</span>
          <div className="text-2xl font-black text-brand">{formatCurrency(platformRevenue)}</div>
          <span className="text-[10px] text-ink-muted font-medium">Cut + ₹19 tech fee</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Live Centres</span>
          <div className="text-2xl font-black text-ink">
            {liveVendors.length}{' '}
            <span className="text-xs text-ink-muted font-normal">/ {vendors.length}</span>
          </div>
          <span className="text-[10px] text-status-good font-bold">1 pending KYC</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Avg Customer Rating</span>
          <div className="text-2xl font-black text-amber-500">★ {avgRating.toFixed(2)}</div>
          <span className="text-[10px] text-ink-muted font-medium">From 834 reviews</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-surface-line shadow-card space-y-1">
          <span className="text-xs font-bold text-ink-muted">Partner Acceptance</span>
          <div
            className={`text-2xl font-black ${
              acceptanceRate >= 85 ? 'text-status-good' : 'text-amber-600'
            }`}
          >
            {acceptanceRate}%
          </div>
          <span className="text-[10px] text-ink-muted font-medium">&lt;10m response time</span>
        </div>
      </div>

      {/* 3. Panel Grid: Live Telemetry + Mode breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-surface-line shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-ink">Live Booking Dispatch Feed</h2>
              <p className="text-xs text-ink-muted">
                Updates dynamically as orders progress on mobile devices
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-status-good">
              <div className="w-2 h-2 rounded-full bg-status-good animate-ping" />
              <span>Realtime Socket Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-line text-ink-muted uppercase font-bold text-[10px]">
                  <th className="text-left py-2 px-2">ID</th>
                  <th className="text-left py-2 px-2">Customer</th>
                  <th className="text-left py-2 px-2">Centre</th>
                  <th className="text-left py-2 px-2">Service</th>
                  <th className="text-left py-2 px-2">Mode</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Value</th>
                  <th className="text-right py-2 px-2">Platform Cut</th>
                </tr>
              </thead>
              <tbody>
                {[...todayBookings]
                  .sort((a, b) => b.id - a.id)
                  .map(b => {
                    const isFlashed = flashId === b.id;
                    const v = vendors.find(x => x.id === b.vendorId);
                    const conf = STATUS_BADGE_CONFIG[b.status];
                    const cut =
                      ['rejected', 'expired'].includes(b.status)
                        ? '–'
                        : formatCurrency(
                            ((b.base + b.modeFee) * (v?.commission || 15)) / 100 + PLATFORM_FEE
                          );

                    return (
                      <tr
                        key={b.id}
                        className={`border-b border-surface-line/60 transition-colors ${
                          isFlashed ? 'bg-amber-100 font-bold' : 'hover:bg-surface-subtle/50'
                        }`}
                      >
                        <td className="py-2.5 px-2 font-mono font-bold text-ink">WK-{b.id}</td>
                        <td className="py-2.5 px-2 font-bold text-ink">{b.customer}</td>
                        <td className="py-2.5 px-2 text-ink-muted truncate max-w-[140px]">
                          {v?.name}
                        </td>
                        <td className="py-2.5 px-2 font-medium">
                          {PACKAGES.find(p => p.id === b.pkg)?.name}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="text-[11px] font-semibold text-ink-muted">
                            {SERVICE_MODE_INFO[b.mode].label}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}
                          >
                            {conf.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-ink">
                          {formatCurrency(b.base + b.modeFee)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-status-good">
                          {cut}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Service Modes & Pilot Zones */}
        <div className="space-y-6">
          {/* Service Mode Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-surface-line shadow-card space-y-4">
            <h2 className="text-base font-extrabold text-ink">Orders by Delivery Mode</h2>
            <div className="space-y-3">
              {(['walkin', 'pickup', 'home'] as ServiceMode[]).map(mode => {
                const count = modeCounts[mode];
                const pct = Math.round((count / (validBookings.length || 1)) * 100);

                return (
                  <div key={mode} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-ink">{SERVICE_MODE_INFO[mode].label}</span>
                      <span className="text-ink-muted">
                        {count} orders ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxModeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Zones */}
          <div className="bg-white rounded-2xl p-5 border border-surface-line shadow-card space-y-3">
            <h2 className="text-base font-extrabold text-ink">Operational Expansion</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-surface-line">
                <div>
                  <div className="font-bold text-ink">Kazhakoottam & Technopark</div>
                  <div className="text-[11px] text-ink-muted">8 km pilot radius · 6 partners</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-goodSoft text-status-good">
                  Live
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle/50 border border-surface-line">
                <div>
                  <div className="font-bold text-ink">Trivandrum City Centre</div>
                  <div className="text-[11px] text-ink-muted">Phase 2 · Q3 rollout</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Planned
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle/50 border border-surface-line opacity-60">
                <div>
                  <div className="font-bold text-ink">Kochi Infopark</div>
                  <div className="text-[11px] text-ink-muted">Phase 4 · Expansion</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Partner Management Table */}
      <div className="bg-white rounded-2xl p-5 border border-surface-line shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-ink">Wash Centre Partner Directory</h2>
            <p className="text-xs text-ink-muted">
              Configure partner commission percentages, inspect ratings, and toggle onboarding status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-line text-ink-muted uppercase font-bold text-[10px]">
                <th className="text-left py-2 px-2">Centre Name</th>
                <th className="text-left py-2 px-2">Location</th>
                <th className="text-left py-2 px-2">Services Active</th>
                <th className="text-left py-2 px-2">Rating</th>
                <th className="text-left py-2 px-2">Orders</th>
                <th className="text-left py-2 px-2">Commission %</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-right py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => {
                const totalOrders = bookings.filter(b => b.vendorId === v.id).length;
                const isLive = v.status === 'live';

                return (
                  <tr key={v.id} className="border-b border-surface-line/60 hover:bg-surface-subtle/40">
                    <td className="py-3 px-2 font-extrabold text-ink">{v.name}</td>
                    <td className="py-3 px-2 text-ink-muted">{v.area}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        {(['walkin', 'pickup', 'home'] as ServiceMode[])
                          .filter(m => v.modes[m].on)
                          .map(m => (
                            <span
                              key={m}
                              className="text-[10px] font-semibold bg-surface-subtle px-1.5 py-0.5 rounded text-ink-muted"
                            >
                              {SERVICE_MODE_INFO[m].label}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {v.rating > 0 ? (
                        <span className="font-bold text-amber-500">
                          ★ {v.rating.toFixed(1)} ({v.reviews})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 font-bold text-ink">{totalOrders}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={v.commission}
                          onChange={e =>
                            updateVendorCommission(v.id, parseInt(e.target.value) || 0)
                          }
                          className="w-14 bg-[#fbf9f6] border border-surface-line rounded-lg px-2 py-1 font-bold text-xs text-ink focus:outline-none focus:border-brand"
                        />
                        <span className="text-ink-muted font-bold">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLive
                            ? 'bg-status-goodSoft text-status-good'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isLive ? 'Live' : 'KYC Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {isLive ? (
                        <button
                          onClick={() => suspendVendor(v.id)}
                          className="px-2.5 py-1 rounded-lg border border-surface-line hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => approveVendor(v.id)}
                          className="px-2.5 py-1 rounded-lg bg-status-good hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          Approve KYC
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

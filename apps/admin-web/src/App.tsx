import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Store,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:4000/api';

export function App() {
  const [metrics, setMetrics] = useState({
    totalBookings: 148,
    activeBookings: 4,
    gmv: 114920,
    platformRevenue: 19850,
    liveVendors: 5,
    totalVendors: 6,
  });

  const [vendors, setVendors] = useState([
    {
      id: 'v1',
      name: 'BlueDrop Car Spa',
      area: 'Kazhakoottam Bypass',
      rating: 4.6,
      reviews: 212,
      commission: 15,
      status: 'live',
      orders: 68,
    },
    {
      id: 'v2',
      name: 'Technopark Foam Wash',
      area: 'Kariyavattom',
      rating: 4.4,
      reviews: 148,
      commission: 15,
      status: 'live',
      orders: 42,
    },
    {
      id: 'v3',
      name: 'GreenFoam Doorstep',
      area: 'Sreekaryam',
      rating: 4.7,
      reviews: 96,
      commission: 15,
      status: 'live',
      orders: 29,
    },
    {
      id: 'v4',
      name: 'Shine Bay Detailing',
      area: 'Kulathoor Junction',
      rating: 4.8,
      reviews: 301,
      commission: 15,
      status: 'live',
      orders: 87,
    },
    {
      id: 'v5',
      name: 'Kulathoor Auto Wash',
      area: 'Kulathoor',
      rating: 4.1,
      reviews: 77,
      commission: 15,
      status: 'live',
      orders: 19,
    },
    {
      id: 'v6',
      name: 'Pothencode Wash Point',
      area: 'Pothencode Junction',
      rating: 0,
      reviews: 0,
      commission: 10,
      status: 'pending',
      orders: 0,
    },
  ]);

  const [bookings, setBookings] = useState([
    { id: 1041, customer: 'Rahul Nair', centre: 'BlueDrop Car Spa', pkg: 'Interior Clean', mode: 'Pick & Drop', slot: 'Today, 14:00', status: 'requested', val: 619 },
    { id: 1040, customer: 'Meera J', centre: 'BlueDrop Car Spa', pkg: 'Exterior Wash', mode: 'Walk-in', slot: 'Today, 11:00', status: 'in_progress', val: 349 },
    { id: 1039, customer: 'Akhil K', centre: 'Shine Bay Detailing', pkg: 'Full Wash', mode: 'Pick & Drop', slot: 'Today, 10:00', status: 'in_progress', val: 1049 },
    { id: 1037, customer: 'Fathima S', centre: 'GreenFoam Doorstep', pkg: 'Full Wash', mode: 'At Home', slot: 'Today, 09:00', status: 'completed', val: 1029 },
  ]);

  const [flashId, setFlashId] = useState<number | null>(null);

  useEffect(() => {
    // Attempt to connect to live backend API
    fetch(`${API_BASE_URL}/admin/metrics`)
      .then(res => res.json())
      .then(data => setMetrics(prev => ({ ...prev, ...data })))
      .catch(() => {});

    // SSE connection for live dispatch events
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/events`);
      eventSource.onmessage = event => {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'NEW_BOOKING_REQUEST' || parsed.type === 'BOOKING_STATUS_CHANGED') {
          const b = parsed.payload;
          setFlashId(b.id);
          setTimeout(() => setFlashId(null), 2500);
          setBookings(prev => [b, ...prev.filter(x => x.id !== b.id)]);
        }
      };
      return () => eventSource.close();
    } catch (e) {}
  }, []);

  const handleApproveKYC = (vendorId: string) => {
    setVendors(prev =>
      prev.map(v => (v.id === vendorId ? { ...v, status: 'live' } : v))
    );
    fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'live' }),
    }).catch(() => {});
  };

  const handleSuspend = (vendorId: string) => {
    setVendors(prev =>
      prev.map(v => (v.id === vendorId ? { ...v, status: 'suspended' } : v))
    );
    fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'suspended' }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-[#1a1f36]">
      {/* Top Corporate Nav */}
      <header className="sticky top-0 z-40 bg-[#1a1f36] text-white px-6 py-4 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center font-black text-orange-400">
              W
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight">Wheelhaus HQ</h1>
              <p className="text-xs text-slate-400">Enterprise Operations Portal • Kazhakoottam Cluster</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live City Dispatch Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#ece6e0] shadow-sm space-y-1">
            <span className="text-xs font-bold text-[#5b6078] uppercase">Gross Merchandise Value</span>
            <div className="text-2xl font-black">₹{metrics.gmv.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">+14.2% week-on-week</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#ece6e0] shadow-sm space-y-1">
            <span className="text-xs font-bold text-[#5b6078] uppercase">Net Platform Revenue</span>
            <div className="text-2xl font-black text-[#c9450c]">₹{metrics.platformRevenue.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-[#5b6078]">15% commission + ₹19 tech fee</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#ece6e0] shadow-sm space-y-1">
            <span className="text-xs font-bold text-[#5b6078] uppercase">Active Partner Garages</span>
            <div className="text-2xl font-black">
              {metrics.liveVendors} <span className="text-sm font-normal text-slate-400">/ {metrics.totalVendors}</span>
            </div>
            <span className="text-[11px] text-amber-600 font-bold">1 KYC pending review</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#ece6e0] shadow-sm space-y-1">
            <span className="text-xs font-bold text-[#5b6078] uppercase">Total Orders Dispatched</span>
            <div className="text-2xl font-black">{metrics.totalBookings}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">96.4% fulfilment rate</span>
          </div>
        </div>

        {/* Live Dispatch Feed Table */}
        <div className="bg-white rounded-2xl p-6 border border-[#ece6e0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#1a1f36]">Real-Time Dispatch Stream</h2>
              <p className="text-xs text-[#5b6078]">Telemetry feed from customer and partner mobile apps</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              ● Connected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#ece6e0] text-[#5b6078] uppercase font-bold text-[10px]">
                  <th className="text-left py-2.5 px-3">Order ID</th>
                  <th className="text-left py-2.5 px-3">Customer</th>
                  <th className="text-left py-2.5 px-3">Partner Centre</th>
                  <th className="text-left py-2.5 px-3">Package</th>
                  <th className="text-left py-2.5 px-3">Mode</th>
                  <th className="text-left py-2.5 px-3">Status</th>
                  <th className="text-right py-2.5 px-3">Order Value</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr
                    key={b.id}
                    className={`border-b border-[#ece6e0]/60 transition-colors ${
                      flashId === b.id ? 'bg-amber-100 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold">WK-{b.id}</td>
                    <td className="py-3 px-3 font-bold">{b.customer}</td>
                    <td className="py-3 px-3 text-[#5b6078]">{b.centre || 'BlueDrop Car Spa'}</td>
                    <td className="py-3 px-3 font-medium">{b.pkg}</td>
                    <td className="py-3 px-3">{b.mode}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-amber-100 text-amber-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold">₹{b.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner KYC and Commission Management */}
        <div className="bg-white rounded-2xl p-6 border border-[#ece6e0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#1a1f36]">Partner Centre Directory & Onboarding</h2>
              <p className="text-xs text-[#5b6078]">Audit licenses, enforce commission percentages, and control store listing visibility</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#ece6e0] text-[#5b6078] uppercase font-bold text-[10px]">
                  <th className="text-left py-2.5 px-3">Centre Name</th>
                  <th className="text-left py-2.5 px-3">Location</th>
                  <th className="text-left py-2.5 px-3">Rating</th>
                  <th className="text-left py-2.5 px-3">Orders</th>
                  <th className="text-left py-2.5 px-3">Commission</th>
                  <th className="text-left py-2.5 px-3">KYC Status</th>
                  <th className="text-right py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} className="border-b border-[#ece6e0]/60 hover:bg-slate-50">
                    <td className="py-3 px-3 font-extrabold">{v.name}</td>
                    <td className="py-3 px-3 text-[#5b6078]">{v.area}</td>
                    <td className="py-3 px-3 font-bold text-amber-500">
                      {v.rating > 0 ? `★ ${v.rating.toFixed(1)} (${v.reviews})` : 'New Partner'}
                    </td>
                    <td className="py-3 px-3 font-bold">{v.orders}</td>
                    <td className="py-3 px-3 font-extrabold text-blue-900">{v.commission}%</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          v.status === 'live'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.status === 'live' ? 'Live on Apps' : v.status === 'pending' ? 'KYC Review Pending' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {v.status === 'pending' ? (
                        <button
                          onClick={() => handleApproveKYC(v.id)}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
                        >
                          Approve KYC
                        </button>
                      ) : v.status === 'live' ? (
                        <button
                          onClick={() => handleSuspend(v.id)}
                          className="px-3 py-1 border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold rounded-lg text-xs"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveKYC(v.id)}
                          className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

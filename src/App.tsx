import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerApp } from './components/CustomerApp';
import { VendorApp } from './components/VendorApp';
import { SuperAdmin } from './components/SuperAdmin';
import { PhoneContainer } from './components/PhoneContainer';
import { Toast } from './components/Toast';
import { HelpCircle, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { viewMode, activeVendor } = useApp();

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-ink flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* ================= DUAL PHONE SIMULATOR VIEW ================= */}
        {viewMode === 'apps' && (
          <div className="max-w-[1400px] mx-auto px-4 py-8">
            <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8">
              {/* Phone 1: Customer */}
              <PhoneContainer
                label="Customer Mobile App"
                sublabel="Arjun Menon · Technopark, Phase 1"
              >
                <CustomerApp />
              </PhoneContainer>

              {/* Phone 2: Vendor */}
              <PhoneContainer
                label="Vendor Partner App"
                sublabel={`${activeVendor.name} · Garage Console`}
              >
                <VendorApp />
              </PhoneContainer>

              {/* Interactive Walkthrough Panel */}
              <div className="w-full xl:w-80 bg-white rounded-3xl p-5 border border-surface-line shadow-card space-y-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-ink">Interactive Walkthrough</h3>
                    <p className="text-[11px] text-ink-muted">Both devices are synchronized live</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-subtle">
                    <span className="font-extrabold text-brand bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </span>
                    <p className="text-ink leading-relaxed">
                      On the <b>Customer App</b>, select <b>BlueDrop Car Spa</b>, choose <b>Full Wash</b> with <b>Pick & Drop</b>, and request a booking.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-subtle">
                    <span className="font-extrabold text-brand bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </span>
                    <p className="text-ink leading-relaxed">
                      Watch the <b>Vendor App</b> ring with a 10-minute timer. Tap <b>Accept</b>, then advance the order through <b>Jobs</b>. Notice the customer tracker updating live with OTP verification!
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-subtle">
                    <span className="font-extrabold text-brand bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </span>
                    <p className="text-ink leading-relaxed">
                      Try tapping <b>Decline</b> on a request to see the customer automatically receive smart fallback recommendations for nearby centres.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-subtle">
                    <span className="font-extrabold text-brand bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                      4
                    </span>
                    <p className="text-ink leading-relaxed">
                      In the vendor <b>Services</b> tab, toggle a mode off or alter the radius. The customer app updates immediately.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-subtle">
                    <span className="font-extrabold text-brand bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                      5
                    </span>
                    <p className="text-ink leading-relaxed">
                      Click <b>Super Admin</b> in the top navigation bar to inspect GMV analytics and approve <b>Pothencode Wash Point</b> to bring it live.
                    </p>
                  </div>
                </div>

                <div className="border-t border-surface-line pt-3 text-[11px] text-ink-muted text-center">
                  Payments & OTPs are simulated for the Kazhakoottam pilot demo.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SOLO CUSTOMER VIEW ================= */}
        {viewMode === 'customer' && (
          <div className="py-8 flex justify-center">
            <PhoneContainer
              label="Customer App Solo"
              sublabel="Arjun Menon · Technopark"
              width="w-[420px]"
            >
              <CustomerApp />
            </PhoneContainer>
          </div>
        )}

        {/* ================= SOLO VENDOR VIEW ================= */}
        {viewMode === 'vendor' && (
          <div className="py-8 flex justify-center">
            <PhoneContainer
              label="Vendor Partner Portal Solo"
              sublabel={`${activeVendor.name} · Live Console`}
              width="w-[420px]"
            >
              <VendorApp />
            </PhoneContainer>
          </div>
        )}

        {/* ================= SUPER ADMIN OPERATIONS VIEW ================= */}
        {viewMode === 'admin' && <SuperAdmin />}
      </main>

      <Toast />
    </div>
  );
};

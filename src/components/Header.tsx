import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Smartphone, Store, ShieldCheck, Layers } from 'lucide-react';
import { MainViewMode } from '../types';

export const Header: React.FC = () => {
  const { viewMode, setViewMode, resetDemo } = useApp();

  const navItems: { mode: MainViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'apps', label: 'Dual Phone Stage', icon: <Layers className="w-4 h-4" /> },
    { mode: 'customer', label: 'Customer Solo', icon: <Smartphone className="w-4 h-4" /> },
    { mode: 'vendor', label: 'Vendor Solo', icon: <Store className="w-4 h-4" /> },
    { mode: 'admin', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ink text-white border-b border-white/10 px-4 md:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand-hi shadow-inner">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2.5v6.5M12 15v6.5M2.5 12H9M15 12h6.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight font-sans text-white">Wheelhaus</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand/20 text-brand-hi border border-brand-line/30">
                Pilot
              </span>
            </div>
            <p className="text-xs text-ink-subtle hidden sm:block">
              On-demand vehicle care & detailing · Kazhakoottam, Technopark
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#252b48] p-1 rounded-xl border border-white/5">
          {navItems.map(item => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                viewMode === item.mode
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

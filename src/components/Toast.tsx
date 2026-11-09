import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out animate-bounce">
      <div className="flex items-center gap-2.5 bg-ink text-white px-5 py-3 rounded-xl shadow-float text-sm font-medium border border-white/10 backdrop-blur-md">
        <Bell className="w-4 h-4 text-brand-hi shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

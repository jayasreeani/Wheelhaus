import React, { ReactNode } from 'react';

interface PhoneContainerProps {
  label: string;
  sublabel?: string;
  children: ReactNode;
  width?: string;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  label,
  sublabel,
  children,
  width = 'w-[380px]',
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label above phone */}
      <div className="flex items-center gap-2 text-center">
        <span className="text-xs font-bold tracking-wider uppercase text-ink-muted bg-surface-subtle px-3 py-1 rounded-full border border-surface-line">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] text-ink-subtle font-medium">{sublabel}</span>
        )}
      </div>

      {/* Phone chassis */}
      <div
        className={`${width} max-w-[calc(100vw-32px)] h-[780px] bg-[#fbf9f6] rounded-[44px] p-3 shadow-phone border-[9px] border-ink flex flex-col relative overflow-hidden`}
      >
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-ink rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
        </div>

        {/* Screen inner content */}
        <div className="flex-1 flex flex-col h-full rounded-[34px] overflow-hidden bg-[#f7f4f1] relative">
          {children}
        </div>

        {/* Home indicator bar at bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-ink/30 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

import React from 'react';
import { TimeState } from '../hooks/useCurrentTime';
import { ClockTheme } from '../types';

interface DigitalPillProps {
  timeState: TimeState;
  theme: ClockTheme;
}

export const DigitalPill: React.FC<DigitalPillProps> = ({ timeState, theme }) => {
  const { date, hours, minutes, seconds } = timeState;

  // Format 12-hr with AM/PM
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hoursStr = hours12.toString().padStart(2, '0');
  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');

  // Timezone abbreviation
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
  const fullDateStr = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="digital-time-readout-pill"
      className="inline-flex flex-col items-center justify-center px-5 py-2.5 rounded-xl border border-[#3b342e] bg-[#1a1714]/80 backdrop-blur shadow-lg text-center select-none"
    >
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#fbf6ea]">
          {hoursStr}:{minStr}:{secStr}
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border"
          style={{
            borderColor: `${theme.accentColor}66`,
            color: theme.accentColor,
            backgroundColor: `${theme.accentColor}18`,
          }}
        >
          {ampm}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9c9081]">
        <span>{fullDateStr}</span>
        <span>•</span>
        <span className="truncate max-w-[140px] text-[#bdae9c]">{tzName}</span>
      </div>
    </div>
  );
};

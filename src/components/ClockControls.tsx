import React from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  CircleDot,
  Radio,
} from 'lucide-react';
import { ClockSettings, ClockTheme, MovementType, ClockSize } from '../types';
import { CLOCK_THEMES } from '../data/themes';
import { playHourlyGong } from '../utils/audio';

interface ClockControlsProps {
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  currentTheme: ClockTheme;
}

export const ClockControls: React.FC<ClockControlsProps> = ({
  settings,
  onUpdateSettings,
  currentTheme,
}) => {
  const handleTestChime = () => {
    playHourlyGong(settings.volume);
  };

  return (
    <div
      id="retro-clock-controls-panel"
      className="w-full max-w-xl mx-auto mt-6 p-5 rounded-2xl bg-[#201d1a]/90 backdrop-blur-md border border-[#3b342e] shadow-2xl text-[#d4cbbf]"
    >
      {/* 1. THEME SELECTOR */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9e9384] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#d4af37]" />
            Vintage Horology Dial
          </label>
          <span className="text-xs font-mono text-[#c49a45]">{currentTheme.era}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CLOCK_THEMES.map((theme) => {
            const isSelected = theme.id === settings.themeId;
            return (
              <button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                onClick={() => onUpdateSettings({ themeId: theme.id })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#c49a45] bg-[#2d2722] text-[#fbf6ea] shadow-[0_0_12px_rgba(196,154,69,0.25)]'
                    : 'border-[#38312b] bg-[#1a1715]/70 text-[#9e9384] hover:border-[#52483f] hover:text-[#d4cbbf]'
                }`}
              >
                {/* Visual Dial Swatch Dot */}
                <div className="flex items-center gap-1 mb-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/40 shadow-inner"
                    style={{ backgroundColor: theme.dialBg }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/40"
                    style={{ backgroundColor: theme.secondHandColor }}
                  />
                </div>
                <span className="text-xs font-medium leading-tight line-clamp-1">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MECHANISM CONTROLS (Movement & Sound) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#362f29]">
        {/* MOVEMENT TYPE */}
        <div className="flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9e9384] mb-2">
            Movement Calibration
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#161311] rounded-lg border border-[#312a24]">
            <button
              id="movement-sweep-btn"
              onClick={() => onUpdateSettings({ movement: 'sweep' as MovementType })}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                settings.movement === 'sweep'
                  ? 'bg-[#c49a45] text-[#1a150c] font-semibold shadow-sm'
                  : 'text-[#8a8073] hover:text-[#d4cbbf]'
              }`}
            >
              Smooth Sweep
            </button>
            <button
              id="movement-tick-btn"
              onClick={() => onUpdateSettings({ movement: 'tick' as MovementType })}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                settings.movement === 'tick'
                  ? 'bg-[#c49a45] text-[#1a150c] font-semibold shadow-sm'
                  : 'text-[#8a8073] hover:text-[#d4cbbf]'
              }`}
            >
              Stepping Tick
            </button>
          </div>
        </div>

        {/* MECHANICAL ESCAPEMENT SOUND */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9e9384]">
              Acoustic Tick
            </span>
            <div className="flex items-center gap-2">
              <button
                id="toggle-chime-test-btn"
                onClick={handleTestChime}
                title="Preview mantel gong chime"
                className="text-[11px] px-2 py-0.5 rounded bg-[#2c2621] hover:bg-[#3d342d] text-[#c49a45] border border-[#4a3f34] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Bell className="w-3 h-3" />
                Gong
              </button>
              <button
                id="toggle-tick-sound-btn"
                onClick={() => onUpdateSettings({ tickSound: !settings.tickSound })}
                className={`p-1 rounded-md border transition-colors cursor-pointer ${
                  settings.tickSound
                    ? 'border-[#c49a45] bg-[#c49a45]/20 text-[#c49a45]'
                    : 'border-[#38312b] bg-[#161311] text-[#71685b]'
                }`}
                aria-label={settings.tickSound ? 'Mute tick sound' : 'Enable tick sound'}
              >
                {settings.tickSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="sound-volume-slider"
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={settings.volume}
              disabled={!settings.tickSound && !settings.hourlyChime}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-[#c49a45] h-1.5 bg-[#161311] rounded-lg cursor-pointer disabled:opacity-30"
            />
            <span className="text-xs font-mono text-[#8a8073] w-8 text-right">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. COMPLICATIONS & OPTICS TOGGLES */}
      <div className="pt-4 mt-4 border-t border-[#362f29] grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Date Window */}
        <button
          id="toggle-date-btn"
          onClick={() => onUpdateSettings({ showDate: !settings.showDate })}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            settings.showDate
              ? 'border-[#8c7438] bg-[#29231c] text-[#e8dbbe]'
              : 'border-[#332c26] bg-[#171412] text-[#6d6458]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Date Window
        </button>

        {/* Auxiliary Subdial */}
        <button
          id="toggle-subdial-btn"
          onClick={() => onUpdateSettings({ showSubdial: !settings.showSubdial })}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            settings.showSubdial
              ? 'border-[#8c7438] bg-[#29231c] text-[#e8dbbe]'
              : 'border-[#332c26] bg-[#171412] text-[#6d6458]'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          Subdial 60s
        </button>

        {/* Domed Glass Reflection */}
        <button
          id="toggle-glass-btn"
          onClick={() => onUpdateSettings({ glassReflection: !settings.glassReflection })}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            settings.glassReflection
              ? 'border-[#8c7438] bg-[#29231c] text-[#e8dbbe]'
              : 'border-[#332c26] bg-[#171412] text-[#6d6458]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Crystal Glare
        </button>

        {/* Digital Time Pill */}
        <button
          id="toggle-digital-btn"
          onClick={() => onUpdateSettings({ showDigital: !settings.showDigital })}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            settings.showDigital
              ? 'border-[#8c7438] bg-[#29231c] text-[#e8dbbe]'
              : 'border-[#332c26] bg-[#171412] text-[#6d6458]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Digital Readout
        </button>
      </div>

      {/* 4. CLOCK SCALE SIZES */}
      <div className="pt-3.5 mt-3.5 border-t border-[#362f29] flex items-center justify-between text-xs text-[#8a8073]">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#9e9384]">
          Scale Dimension
        </span>
        <div className="flex items-center gap-1.5 bg-[#161311] p-0.5 rounded-lg border border-[#312a24]">
          {(['compact', 'standard', 'large'] as ClockSize[]).map((size) => (
            <button
              key={size}
              id={`scale-${size}-btn`}
              onClick={() => onUpdateSettings({ size })}
              className={`px-2.5 py-1 text-xs rounded capitalize transition-colors cursor-pointer ${
                settings.size === size
                  ? 'bg-[#3b332a] text-[#fbf6ea] font-medium'
                  : 'hover:text-[#d4cbbf]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

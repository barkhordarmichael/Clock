import { useState, useEffect } from 'react';
import { AnalogClockFace } from './components/AnalogClockFace';
import { ClockControls } from './components/ClockControls';
import { DigitalPill } from './components/DigitalPill';
import { CLOCK_THEMES } from './data/themes';
import { ClockSettings, ClockSize } from './types';
import { useCurrentTime } from './hooks/useCurrentTime';
import { Maximize2, Minimize2, SlidersHorizontal, Sparkles } from 'lucide-react';

const DEFAULT_SETTINGS: ClockSettings = {
  themeId: 'mid-century-brass',
  movement: 'sweep',
  tickSound: false, // Start muted for respectful browser audio etiquette
  volume: 0.4,
  hourlyChime: false,
  showDate: true,
  showSubdial: true,
  showDigital: true,
  glassReflection: true,
  size: 'standard',
};

export default function App() {
  const [settings, setSettings] = useState<ClockSettings>(() => {
    try {
      const saved = localStorage.getItem('retro_clock_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_SETTINGS;
  });

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('retro_clock_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  const updateSettings = (partial: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const currentTheme = CLOCK_THEMES.find((t) => t.id === settings.themeId) || CLOCK_THEMES[0];

  // High precision time hook
  const timeState = useCurrentTime(
    settings.movement,
    settings.tickSound,
    settings.volume,
    settings.hourlyChime,
  );

  // Pixel sizing mapping
  const sizeMap: Record<ClockSize, number> = {
    compact: 300,
    standard: 410,
    large: 500,
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <main
      id="retro-clock-app"
      className="min-h-screen w-full relative flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden bg-[#161412] text-[#fbf6ea]"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 30%, #29241f 0%, #151311 65%, #0d0c0a 100%)`,
      }}
    >
      {/* Background Ambient Warm Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
        style={{ backgroundColor: currentTheme.bezelInner }}
      />

      {/* TOP HEADER / APP BAR */}
      <header
        id="app-header"
        className="w-full max-w-4xl flex items-center justify-between z-10 py-2 border-b border-[#2d2722]/60"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
            style={{ backgroundColor: currentTheme.accentColor }}
          />
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-wide font-serif text-[#fbf6ea]">
              {currentTheme.name}
            </h1>
            <p className="text-[11px] text-[#9c9081] font-mono tracking-wider uppercase">
              {currentTheme.era}
            </p>
          </div>
        </div>

        {/* Quick Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-controls-btn"
            onClick={() => setShowControls((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              showControls
                ? 'border-[#c49a45] bg-[#2d2722] text-[#c49a45]'
                : 'border-[#38312b] bg-[#1a1715] text-[#9c9081] hover:text-[#fbf6ea]'
            }`}
            title="Configure dial, movement, and sound"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            id="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-[#38312b] bg-[#1a1715] text-[#9c9081] hover:text-[#fbf6ea] cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* CENTER CLOCK WIDGET STAGE */}
      <section
        id="clock-stage-section"
        className="my-auto flex flex-col items-center justify-center z-10 py-6 sm:py-8 w-full"
      >
        {/* Analog Clock Face */}
        <div className="relative p-2 rounded-full shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          <AnalogClockFace
            theme={currentTheme}
            timeState={timeState}
            showDate={settings.showDate}
            showSubdial={settings.showSubdial}
            glassReflection={settings.glassReflection}
            sizePx={sizeMap[settings.size]}
          />
        </div>

        {/* Companion Digital Time & Date Readout */}
        {settings.showDigital && (
          <div className="mt-8 transition-opacity duration-300">
            <DigitalPill timeState={timeState} theme={currentTheme} />
          </div>
        )}
      </section>

      {/* RETRO CONTROLS PANEL */}
      {showControls && (
        <section id="clock-controls-section" className="w-full z-10 pb-4">
          <ClockControls
            settings={settings}
            onUpdateSettings={updateSettings}
            currentTheme={currentTheme}
          />
        </section>
      )}

      {/* FOOTER NOTICE */}
      <footer id="app-footer" className="w-full max-w-4xl text-center py-2 z-10 text-[11px] text-[#71685b] font-mono">
        <span>Analog Horological Engine</span>
        <span className="mx-2">•</span>
        <span>Escapement: {settings.movement === 'sweep' ? 'Fluid Automatic' : 'Stepping Quartz'}</span>
        {settings.tickSound && (
          <>
            <span className="mx-2">•</span>
            <span className="text-[#c49a45]">Acoustic Pallet Jewels Active</span>
          </>
        )}
      </footer>
    </main>
  );
}

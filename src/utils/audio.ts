/**
 * Web Audio API synthesizer for vintage mechanical clock sounds.
 * Generates realistic mechanical lever escapement tick/tock impulses
 * and an acoustic grandfather/mantel clock gong chime.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a realistic mechanical clock escapement sound.
 * Mechanical clocks have two pallets on the anchor, giving alternating "tick" and "tock" tones.
 */
export function playClockTick(isTock: boolean, volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running' || volume <= 0) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.25, now);
    masterGain.connect(ctx.destination);

    // 1. High frequency mechanical metallic click
    const clickFreq = isTock ? 2100 : 2600;
    const oscClick = ctx.createOscillator();
    const clickGain = ctx.createGain();

    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(clickFreq, now);
    oscClick.frequency.exponentialRampToValueAtTime(clickFreq * 0.4, now + 0.015);

    clickGain.gain.setValueAtTime(0.7, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    oscClick.connect(clickGain);
    clickGain.connect(masterGain);

    oscClick.start(now);
    oscClick.stop(now + 0.02);

    // 2. Brass / wooden clock case acoustic impulse (resonant body)
    const bodyFreq = isTock ? 720 : 840;
    const oscBody = ctx.createOscillator();
    const bodyGain = ctx.createGain();

    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(bodyFreq, now);
    oscBody.frequency.exponentialRampToValueAtTime(bodyFreq * 0.7, now + 0.035);

    bodyGain.gain.setValueAtTime(0.5, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    oscBody.connect(bodyGain);
    bodyGain.connect(masterGain);

    oscBody.start(now);
    oscBody.stop(now + 0.04);
  } catch {
    // Gracefully ignore audio errors (e.g. if audio context cannot start)
  }
}

/**
 * Synthesizes an acoustic resonant bell / chime on the hour
 */
export function playHourlyGong(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx || volume <= 0) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.35, now);
    masterGain.connect(ctx.destination);

    // Fundamental & Harmonics for bronze mantel chime
    const fundamental = 440; // A4
    const partials = [
      { freq: fundamental, gain: 0.8, decay: 2.4 },
      { freq: fundamental * 2.01, gain: 0.4, decay: 1.8 },
      { freq: fundamental * 3.02, gain: 0.25, decay: 1.2 },
      { freq: fundamental * 4.18, gain: 0.12, decay: 0.8 },
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      pGain.gain.setValueAtTime(gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch {
    // Gracefully handle browser policy
  }
}

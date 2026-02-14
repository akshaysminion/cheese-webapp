import type { Synesthesia } from './synesthesia';

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  drone: OscillatorNode;
  droneGain: GainNode;
  shimmer: OscillatorNode;
  shimmerGain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  startedAt: number;
};

let engine: Engine | null = null;

function getContext() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new AC();
}

export async function ensureAudioUnlocked() {
  if (!engine) return;
  if (engine.ctx.state === 'suspended') {
    try {
      await engine.ctx.resume();
    } catch {
      // ignore
    }
  }
}

export function startRindverseAudio(syn: Synesthesia) {
  if (engine) return engine;

  const ctx = getContext();
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);

  const drone = ctx.createOscillator();
  drone.type = 'triangle';

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.0;

  const shimmer = ctx.createOscillator();
  shimmer.type = 'sine';

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.0;

  // LFO for subtle breathing
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 8;

  lfo.connect(lfoGain);
  lfoGain.connect(drone.frequency);

  drone.connect(droneGain);
  shimmer.connect(shimmerGain);

  droneGain.connect(master);
  shimmerGain.connect(master);

  drone.start();
  shimmer.start();
  lfo.start();

  engine = { ctx, master, drone, droneGain, shimmer, shimmerGain, lfo, lfoGain, startedAt: ctx.currentTime };
  applySynesthesiaToAudio(syn);

  // fade in
  const t0 = ctx.currentTime;
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.18, t0 + 0.35);

  return engine;
}

export function stopRindverseAudio() {
  if (!engine) return;
  const { ctx, master, drone, shimmer, lfo } = engine;
  const t0 = ctx.currentTime;
  master.gain.cancelScheduledValues(t0);
  master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t0);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);

  setTimeout(() => {
    try {
      drone.stop();
      shimmer.stop();
      lfo.stop();
      ctx.close();
    } catch {
      // ignore
    }
    engine = null;
  }, 300);
}

export function applySynesthesiaToAudio(syn: Synesthesia) {
  if (!engine) return;
  const { ctx, drone, shimmer, droneGain, shimmerGain } = engine;
  const t0 = ctx.currentTime;

  const base = syn.audio.baseHz;
  const inten = syn.motion.intensity;
  const sh = syn.audio.shimmer;

  drone.frequency.setTargetAtTime(base, t0, 0.08);
  shimmer.frequency.setTargetAtTime(base * (1.98 + sh * 0.35), t0, 0.12);

  // louder when motion is higher; shimmer depends on shimmer param.
  droneGain.gain.setTargetAtTime(0.06 + inten * 0.06, t0, 0.08);
  shimmerGain.gain.setTargetAtTime(0.01 + sh * 0.05, t0, 0.12);
}

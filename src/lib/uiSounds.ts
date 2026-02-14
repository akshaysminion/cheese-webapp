type SoundName = 'toggle' | 'tap' | 'hover';

let ctx: AudioContext | null = null;

function getContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  return ctx;
}

function ping({ freq, duration, gain, pan }: { freq: number; duration: number; gain: number; pan?: number }) {
  const audio = getContext();
  const t0 = audio.currentTime;

  const osc = audio.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t0);

  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  const panner = audio.createStereoPanner?.();
  if (panner && typeof pan === 'number') {
    panner.pan.setValueAtTime(pan, t0);
  }

  osc.connect(g);
  if (panner) {
    g.connect(panner);
    panner.connect(audio.destination);
  } else {
    g.connect(audio.destination);
  }

  osc.start(t0);
  osc.stop(t0 + duration);
}

export async function ensureAudioUnlocked() {
  const audio = getContext();
  if (audio.state === 'suspended') {
    try {
      await audio.resume();
    } catch {
      // ignore
    }
  }
}

export async function playSound(name: SoundName, opts?: { pan?: number }) {
  await ensureAudioUnlocked();

  switch (name) {
    case 'toggle':
      ping({ freq: 740, duration: 0.07, gain: 0.06, pan: opts?.pan ?? 0.1 });
      break;
    case 'tap':
      ping({ freq: 520, duration: 0.06, gain: 0.05, pan: opts?.pan ?? 0 });
      break;
    case 'hover':
      ping({ freq: 980, duration: 0.035, gain: 0.025, pan: opts?.pan ?? -0.08 });
      break;
    default:
      break;
  }
}

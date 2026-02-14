export type Synesthesia = {
  palette: {
    bg: string;
    a: string;
    b: string;
    c: string;
    ink: string;
  };
  motion: {
    intensity: number; // 0..1
    wobble: number; // 0..1
  };
  audio: {
    baseHz: number;
    shimmer: number; // 0..1
  };
};

const NOTE_RULES: Array<{
  test: RegExp;
  hue: number;
  sat: number;
  light: number;
  motion?: number;
  shimmer?: number;
  baseHz?: number;
}> = [
  { test: /smok|char|toasted|burnt/i, hue: 28, sat: 72, light: 50, motion: 0.15, shimmer: 0.1, baseHz: 92 },
  { test: /umami|broth|savory|meaty/i, hue: 210, sat: 58, light: 42, motion: 0.18, shimmer: 0.12, baseHz: 82 },
  { test: /nut|hazelnut|almond|walnut/i, hue: 36, sat: 62, light: 55, motion: 0.2, shimmer: 0.15, baseHz: 110 },
  { test: /mushroom|earth|truffle|cave|mineral/i, hue: 130, sat: 45, light: 42, motion: 0.14, shimmer: 0.08, baseHz: 74 },
  { test: /creamy|butter|milky/i, hue: 48, sat: 70, light: 72, motion: 0.12, shimmer: 0.22, baseHz: 132 },
  { test: /tangy|citrus|acid|sharp/i, hue: 310, sat: 74, light: 62, motion: 0.28, shimmer: 0.35, baseHz: 164 },
  { test: /salty/i, hue: 190, sat: 55, light: 60, motion: 0.22, shimmer: 0.18, baseHz: 124 },
  { test: /sweet|honey|caramel|fruit|pineapple/i, hue: 18, sat: 78, light: 60, motion: 0.25, shimmer: 0.3, baseHz: 176 },
  { test: /spicy|pepper|piquant/i, hue: 4, sat: 85, light: 56, motion: 0.32, shimmer: 0.24, baseHz: 196 },
  { test: /herb|floral|rosemary|thyme/i, hue: 92, sat: 62, light: 55, motion: 0.2, shimmer: 0.28, baseHz: 146 }
];

function hsl(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function synesthesiaFromNotes(notes: string[] | undefined | null): Synesthesia {
  const xs = (notes ?? []).slice(0, 10);

  // base: deep navy/ink
  let hue = 215;
  let sat = 42;
  let light = 14;

  let motion = 0.18;
  let wobble = 0.22;
  let shimmer = 0.18;
  let baseHz = 110;

  let hits = 0;

  for (const n of xs) {
    for (const rule of NOTE_RULES) {
      if (!rule.test.test(n)) continue;
      hits += 1;
      hue += rule.hue;
      sat += rule.sat;
      light += rule.light;
      motion += rule.motion ?? 0;
      shimmer += rule.shimmer ?? 0;
      baseHz += rule.baseHz ?? 0;
      break;
    }
  }

  if (hits > 0) {
    hue /= hits + 1;
    sat /= hits + 1;
    light /= hits + 1;
    motion /= hits + 1;
    shimmer /= hits + 1;
    baseHz /= hits + 1;
  }

  const a = hsl(hue, sat, Math.min(72, light + 18));
  const b = hsl(hue + 32, Math.min(92, sat + 10), Math.min(70, light + 8));
  const c = hsl(hue - 24, Math.min(92, sat + 6), Math.min(64, light + 4));

  const bg = hsl(hue + 195, 40, 10);
  const ink = 'rgba(255,255,255,0.92)';

  return {
    palette: { bg, a, b, c, ink },
    motion: { intensity: clamp01(motion), wobble: clamp01(wobble) },
    audio: { baseHz: Math.max(60, Math.min(220, baseHz)), shimmer: clamp01(shimmer) }
  };
}

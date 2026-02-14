import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../settings/SettingsContext';

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const { settings } = useSettings();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (!settings.motion) {
      prev.current = value;
      setDisplay(value);
      return;
    }

    const from = prev.current;
    const to = value;
    prev.current = value;

    const duration = 240;
    const t0 = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, settings.motion]);

  return (
    <span className={className} aria-label={`${value} results`}>
      {display}
    </span>
  );
}

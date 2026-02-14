import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useSettings } from '../settings/SettingsContext';

export function Card({ children, interactive }: { children: ReactNode; interactive?: boolean }) {
  const { settings } = useSettings();
  const ref = useRef<HTMLDivElement | null>(null);

  const enable = Boolean(interactive) && settings.motion;

  return (
    <div
      ref={ref}
      className={enable ? 'card cardInteractive' : 'card'}
      onPointerMove={(e) => {
        if (!enable) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', String((py - 0.5) * -10));
        el.style.setProperty('--ry', String((px - 0.5) * 10));
      }}
      onPointerLeave={() => {
        if (!enable) return;
        const el = ref.current;
        if (!el) return;
        el.style.setProperty('--rx', '0');
        el.style.setProperty('--ry', '0');
      }}
    >
      {children}
    </div>
  );
}

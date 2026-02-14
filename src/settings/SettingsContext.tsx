import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readBool, readString, writeBool, writeString } from '../lib/prefs';

export type Quality = 'auto' | 'low' | 'high';

export type Settings = {
  sound: boolean;
  motion: boolean;
  quality: Quality;
};

type SettingsContextValue = {
  settings: Settings;
  setSound: (v: boolean) => void;
  setMotion: (v: boolean) => void;
  setQuality: (v: Quality) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function getPrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = getPrefersReducedMotion();

  const [sound, setSoundState] = useState<boolean>(() => readBool('cheese.sound', false));
  const [motion, setMotionState] = useState<boolean>(() => readBool('cheese.motion', !prefersReduced));
  const [quality, setQualityState] = useState<Quality>(() => readString<Quality>('cheese.quality', 'auto'));

  useEffect(() => writeBool('cheese.sound', sound), [sound]);
  useEffect(() => writeBool('cheese.motion', motion), [motion]);
  useEffect(() => writeString('cheese.quality', quality), [quality]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings: { sound, motion, quality },
      setSound: setSoundState,
      setMotion: setMotionState,
      setQuality: setQualityState
    }),
    [sound, motion, quality]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within <SettingsProvider>');
  return ctx;
}

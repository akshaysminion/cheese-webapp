import { useCallback } from 'react';
import { playSound } from '../lib/uiSounds';
import { useSettings } from '../settings/SettingsContext';

export function useUiSound() {
  const { settings } = useSettings();

  return useCallback(
    (name: Parameters<typeof playSound>[0], opts?: Parameters<typeof playSound>[1]) => {
      if (!settings.sound) return;
      void playSound(name, opts);
    },
    [settings.sound]
  );
}

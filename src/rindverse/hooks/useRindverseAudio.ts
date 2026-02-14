import { useEffect } from 'react';
import type { Synesthesia } from '../synesthesia';
import { applySynesthesiaToAudio, ensureAudioUnlocked, startRindverseAudio, stopRindverseAudio } from '../audio';

export function useRindverseAudio(enabled: boolean, syn: Synesthesia) {
  useEffect(() => {
    if (!enabled) {
      stopRindverseAudio();
      return;
    }

    startRindverseAudio(syn);
    void ensureAudioUnlocked();

    return () => {
      stopRindverseAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    applySynesthesiaToAudio(syn);
  }, [enabled, syn]);
}

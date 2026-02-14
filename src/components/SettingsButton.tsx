import { useEffect, useId, useRef, useState } from 'react';
import { useSettings, type Quality } from '../settings/SettingsContext';
import { useUiSound } from '../hooks/useUiSound';

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  id
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="settingsRow">
      <div>
        <label className="settingsLabel" htmlFor={id}>
          {label}
        </label>
        <div className="settingsDesc">{description}</div>
      </div>
      <button
        id={id}
        type="button"
        className={checked ? 'switch switchOn' : 'switch'}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="switchKnob" />
      </button>
    </div>
  );
}

export function SettingsButton() {
  const { settings, setMotion, setQuality, setSound } = useSettings();
  const [open, setOpen] = useState(false);
  const play = useUiSound();

  const dialogId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      // focus first interactive element
      setTimeout(() => panelRef.current?.querySelector<HTMLButtonElement>('button,select')?.focus(), 0);
    }
  }, [open]);

  const setQualitySafe = (v: Quality) => {
    setQuality(v);
    play('tap');
  };

  return (
    <div className="settings">
      <button
        type="button"
        className="iconButton"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
        aria-label="Open settings"
        onClick={() => {
          setOpen((v) => !v);
          play('tap');
        }}
        onPointerEnter={() => play('hover')}
      >
        <span aria-hidden>⚙︎</span>
        <span className="iconButtonLabel">Settings</span>
      </button>

      {open ? (
        <div
          className="settingsBackdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={panelRef}
            className="settingsPanel"
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
          >
            <div className="settingsHeader">
              <div className="settingsTitle">Settings</div>
              <button className="iconButton" type="button" onClick={() => setOpen(false)} aria-label="Close settings">
                ✕
              </button>
            </div>

            <ToggleRow
              id={`${dialogId}-sound`}
              label="Sound"
              description="Subtle UI sounds (off by default)."
              checked={settings.sound}
              onChange={(v) => {
                setSound(v);
                // if turning on, the click itself unlocks audio
                play('toggle');
              }}
            />

            <ToggleRow
              id={`${dialogId}-motion`}
              label="Motion"
              description="Smooth transitions + tilt effects."
              checked={settings.motion}
              onChange={(v) => {
                setMotion(v);
                play('toggle');
              }}
            />

            <div className="settingsRow">
              <div>
                <div className="settingsLabel">3D quality</div>
                <div className="settingsDesc">Auto adapts to your device (recommended).</div>
              </div>
              <select
                className="select"
                aria-label="3D quality"
                value={settings.quality}
                onChange={(e) => setQualitySafe(e.target.value as Quality)}
              >
                <option value="auto">Auto</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="settingsHint">
              Tip: press <kbd>Esc</kbd> to close.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { Canvas } from '@react-three/fiber';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getCheeseById } from '../lib/cheeseData';
import { useSettings } from '../settings/SettingsContext';
import { RINDVERSE_REGIONS } from '../rindverse/content';
import type { Biome, Region, RindverseStep } from '../rindverse/types';
import { synesthesiaFromNotes } from '../rindverse/synesthesia';
import { usePageVisibility } from '../rindverse/hooks/usePageVisibility';
import { isWebGLAvailable } from '../rindverse/hooks/useWebGLAvailable';
import { useRindverseAudio } from '../rindverse/hooks/useRindverseAudio';
import { PortalScene } from '../rindverse/scenes/PortalScene';

const GlobeScene = lazy(() => import('../rindverse/scenes/GlobeScene'));
const RitualScene = lazy(() => import('../rindverse/scenes/RitualScene'));
import { BiomeScene } from '../rindverse/scenes/BiomeScene';

function dprFromQuality(quality: 'auto' | 'low' | 'high') {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  switch (quality) {
    case 'low':
      return 1;
    case 'high':
      return Math.min(2.25, Math.max(1.5, dpr));
    case 'auto':
    default:
      return Math.min(2, dpr);
  }
}

function RindverseFallback({ title }: { title: string }) {
  return (
    <div className="page">
      <div className="card" role="alert">
        <div className="sectionTitle">{title}</div>
        <div className="muted">The RINDVERSE scene failed to load. Your library is still available.</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="select" to="/library">
            Go to /library
          </Link>
          <a className="select" href="/">
            Reload
          </a>
        </div>
      </div>
    </div>
  );
}

export function RindversePage() {
  const { settings } = useSettings();
  const visible = usePageVisibility();

  const [step, setStep] = useState<RindverseStep>('portal');
  const [region, setRegion] = useState<Region | null>(null);
  const [biome, setBiome] = useState<Biome | null>(null);
  const [featuredCheeseId, setFeaturedCheeseId] = useState<string | null>(null);

  const cheese = useMemo(() => (featuredCheeseId ? getCheeseById(featuredCheeseId) : null), [featuredCheeseId]);
  const syn = useMemo(() => synesthesiaFromNotes(cheese?.flavorNotes ?? biome?.featured?.[0]?.flavorNotes), [cheese, biome]);

  // RINDVERSE audio (ambient drone). Default OFF via Settings.
  useRindverseAudio(settings.sound && visible, syn);

  useEffect(() => {
    // Pause GSAP when tab hidden.
    if (!visible) {
      gsap.globalTimeline.pause();
    } else if (settings.motion) {
      gsap.globalTimeline.resume();
    }
  }, [settings.motion, visible]);

  const canWebGL = useMemo(() => (typeof window === 'undefined' ? false : isWebGLAvailable()), []);

  const motion = settings.motion;
  const dpr = dprFromQuality(settings.quality);
  const frameloop: 'always' | 'demand' | 'never' = !visible ? 'never' : motion ? 'always' : 'demand';

  const resetToPortal = () => {
    setStep('portal');
    setRegion(null);
    setBiome(null);
    setFeaturedCheeseId(null);
  };

  if (!canWebGL) {
    return (
      <div className="page">
        <header className="header">
          <div>
            <h1 className="title">RINDVERSE</h1>
            <p className="subtitle">Your device/browser does not support WebGL.</p>
          </div>
          <Link className="select" to="/library">
            Open library
          </Link>
        </header>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<RindverseFallback title="Something went wrong" />}>
      <div className="rv">
        <div className="rvTop">
          <div className="rvBrand">
            <div className="rvWord">RINDVERSE</div>
            <div className="rvSub">Portal → Globe → Biome → Cheese → Dissection Ritual</div>
          </div>
          <div className="rvNav">
            <Link className="rvLink" to="/library">
              Library
            </Link>
            <button className="rvLink" type="button" onClick={resetToPortal}>
              Restart
            </button>
          </div>
        </div>

        <div className="rvStage" style={{ ['--rvA' as string]: syn.palette.a, ['--rvB' as string]: syn.palette.b }}>
          <Canvas
            dpr={dpr}
            frameloop={frameloop}
            gl={{ antialias: settings.quality !== 'low', powerPreference: 'high-performance', alpha: false }}
            camera={{ position: [0, 0.2, 5.8], fov: 45, near: 0.1, far: 100 }}
          >
            <Suspense fallback={null}>
              {step === 'portal' ? <PortalScene syn={syn} motion={motion} /> : null}
              {step === 'globe' ? (
                <GlobeScene
                  syn={syn}
                  motion={motion}
                  onSelect={(key) => {
                    const r = RINDVERSE_REGIONS.find((x) => x.key === key) ?? null;
                    setRegion(r);
                    setBiome(null);
                    setFeaturedCheeseId(null);
                    setStep('biome');
                  }}
                />
              ) : null}

              {step === 'biome' && region ? (
                <BiomeScene
                  syn={syn}
                  motion={motion}
                  biomes={[region.biomes[0], region.biomes[1]]}
                  onPickBiome={(b) => {
                    setBiome(b);
                    setFeaturedCheeseId(null);
                    setStep('cheese');
                  }}
                />
              ) : null}

              {step === 'ritual' && cheese ? (
                <RitualScene syn={syn} motion={motion} title={cheese.name} notes={cheese.flavorNotes ?? []} />
              ) : null}
            </Suspense>
          </Canvas>

          <div className="rvOverlay" role="region" aria-label="RINDVERSE controls">
            {step === 'portal' ? (
              <div className="rvPanel">
                <div className="rvH1">Enter the portal</div>
                <div className="rvP">
                  A living atlas of rind, milk, time. Choose a region—Spain or France—and let flavor retune light, motion,
                  and sound.
                </div>
                <div className="rvRow">
                  <button
                    className="rvPrimary"
                    type="button"
                    onClick={() => setStep('globe')}
                    aria-label="Begin journey"
                  >
                    Begin
                  </button>
                  <Link className="rvGhost" to="/library">
                    Browse library instead
                  </Link>
                </div>
              </div>
            ) : null}

            {step === 'biome' && region ? (
              <div className="rvPanel">
                <div className="rvH1">{region.name}</div>
                <div className="rvP">{region.description}</div>
                <div className="rvRow">
                  <button className="rvGhost" type="button" onClick={() => setStep('globe')}>
                    ← Back to globe
                  </button>
                </div>
              </div>
            ) : null}

            {step === 'cheese' && biome ? (
              <div className="rvPanel">
                <div className="rvH1">{biome.name}</div>
                <div className="rvP">Choose a featured cheese to begin the ritual.</div>
                <div className="rvGrid">
                  {biome.featured.map((f) => (
                    <button
                      key={f.id}
                      className={featuredCheeseId === f.id ? 'rvCard rvCardOn' : 'rvCard'}
                      type="button"
                      onClick={() => setFeaturedCheeseId(f.id)}
                    >
                      <div className="rvCardTitle">{f.label}</div>
                      <div className="rvCardSub">{f.tagline}</div>
                      <div className="rvCardNotes">{f.flavorNotes.join(' • ')}</div>
                    </button>
                  ))}
                </div>

                <div className="rvRow" style={{ marginTop: 14 }}>
                  <button
                    className="rvPrimary"
                    type="button"
                    disabled={!featuredCheeseId}
                    onClick={() => setStep('ritual')}
                  >
                    Enter Dissection Ritual
                  </button>
                  <button className="rvGhost" type="button" onClick={() => setStep('biome')}>
                    ← Back to biomes
                  </button>
                </div>

                {featuredCheeseId && cheese ? (
                  <div className="rvMini">
                    <div className="rvMiniTitle">Synesthesia v1</div>
                    <div className="rvMiniText">
                      Palette, motion, and audio are driven by flavor notes: <span className="rvEm">{cheese.flavorNotes?.slice(0, 5).join(', ')}</span>
                    </div>
                    <div className="rvMiniRow">
                      <Link className="rvLink" to={`/cheese/${cheese.id}`}>
                        Open full entry
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 'ritual' && cheese ? (
              <div className="rvPanel">
                <div className="rvH1">{cheese.name}</div>
                <div className="rvP">Observe. Listen (if enabled). Let the cut-line re-map your perception.</div>
                <div className="rvRow">
                  <button className="rvGhost" type="button" onClick={() => setStep('cheese')}>
                    ← Back
                  </button>
                  <Link className="rvGhost" to={`/cheese/${cheese.id}`}>
                    Read the entry
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rvFooter">
          <span className="muted">
            Settings: Sound (default off), Motion (respects system preference), Quality (Auto/Low/High).
          </span>
        </div>
      </div>
    </ErrorBoundary>
  );
}

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSettings } from '../settings/SettingsContext';

function usePageVisibility() {
  const [visible, setVisible] = useState(() => (typeof document === 'undefined' ? true : document.visibilityState === 'visible'));
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  return visible;
}

function resolveQuality(q: 'auto' | 'low' | 'high') {
  if (q !== 'auto') return q;
  const isCoarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (isCoarse) return 'low';
  if (typeof mem === 'number' && mem <= 4) return 'low';
  if (cores <= 4) return 'low';
  return 'high';
}

function CheeseWedge({ motion }: { motion: boolean }) {
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    // a rounded-ish wedge
    shape.moveTo(-1.05, -0.6);
    shape.quadraticCurveTo(-1.1, -0.6, -1.0, -0.4);
    shape.lineTo(0.95, 0.0);
    shape.quadraticCurveTo(1.1, 0.05, 0.95, 0.22);
    shape.lineTo(-0.2, 0.62);
    shape.quadraticCurveTo(-0.45, 0.72, -0.65, 0.62);
    shape.lineTo(-1.02, -0.34);

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 3,
      curveSegments: 12,
      steps: 1
    });
    extrude.center();
    return extrude;
  }, []);

  const holes = useMemo(() => {
    const pts = [
      [-0.25, 0.12, 0.0],
      [0.25, 0.18, 0.18],
      [0.1, -0.12, -0.18],
      [-0.45, -0.2, 0.2],
      [0.45, 0.02, -0.1]
    ] as const;
    return pts.map((p, i) => ({
      key: i,
      position: new THREE.Vector3(p[0], p[1], p[2]),
      scale: 0.14 + i * 0.015
    }));
  }, []);

  return (
    <group>
      <mesh castShadow receiveShadow geometry={geom} rotation={[0.15, -0.65, 0]}>
        <meshStandardMaterial
          color="#f3c65a"
          roughness={0.42}
          metalness={0.04}
        />
      </mesh>

      {/* faux holes */}
      {holes.map((h) => (
        <mesh
          key={h.key}
          position={h.position}
          scale={h.scale}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#d9a93d" roughness={0.8} metalness={0.0} />
        </mesh>
      ))}

      {motion ? (
        <mesh position={[0, -0.38, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.86, 0.018, 16, 100]} />
          <meshStandardMaterial color="#111214" roughness={0.55} metalness={0.2} transparent opacity={0.08} />
        </mesh>
      ) : null}
    </group>
  );
}

export function CheeseHero3D({ compact }: { compact?: boolean }) {
  const { settings } = useSettings();
  const visible = usePageVisibility();
  const quality = useMemo(() => resolveQuality(settings.quality), [settings.quality]);

  // Pause 3D when not visible.
  if (!visible) return <div className={compact ? 'hero3d hero3dCompact' : 'hero3d'} aria-hidden />;

  const dpr = quality === 'low' ? 1 : Math.min(2, window.devicePixelRatio || 1);
  const shadows = quality !== 'low';

  return (
    <div className={compact ? 'hero3d hero3dCompact' : 'hero3d'} role="img" aria-label="Interactive 3D cheese model">
      <Canvas
        shadows={shadows}
        dpr={dpr}
        camera={{ position: [2.4, 1.3, 2.6], fov: 42 }}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      >
        <color attach="background" args={["#f6f7f8"]} />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3.5, 4.2, 2.2]}
          intensity={1.2}
          castShadow={shadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.1}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />

        <Suspense fallback={null}>
          <Environment preset={quality === 'low' ? 'sunset' : 'city'} />
        </Suspense>

        <group position={[0, 0.05, 0]}>
          <CheeseWedge motion={settings.motion} />
        </group>

        <ContactShadows
          opacity={quality === 'low' ? 0.35 : 0.5}
          blur={quality === 'low' ? 1.6 : 2.8}
          width={6}
          height={6}
          far={3.8}
          resolution={quality === 'low' ? 256 : 512}
          color="#000000"
          position={[0, -0.95, 0]}
        />

        <OrbitControls
          enablePan={false}
          autoRotate={settings.motion && quality !== 'low'}
          autoRotateSpeed={0.55}
          minDistance={2.0}
          maxDistance={4.8}
          makeDefault
        />
      </Canvas>

      <div className="heroOverlay">
        <div className="heroKicker">3D Preview</div>
        <div className="heroHint">Drag to rotate • Scroll to zoom</div>
      </div>
    </div>
  );
}

import { Float, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import type { Synesthesia } from '../synesthesia';

export function PortalScene({ syn, motion }: { syn: Synesthesia; motion: boolean }) {
  const knot = useRef<Mesh | null>(null);

  const matProps = useMemo(
    () => ({
      ior: 1.25,
      transmission: 0.98,
      thickness: 0.8,
      roughness: 0.12,
      chromaticAberration: 0.22,
      anisotropy: 0.15,
      distortion: 0.45,
      distortionScale: 0.7,
      temporalDistortion: motion ? 0.35 : 0,
      color: syn.palette.a
    }),
    [motion, syn.palette.a]
  );

  useFrame((state, dt) => {
    if (!motion) return;
    const t = state.clock.getElapsedTime();
    if (knot.current) {
      knot.current.rotation.x += dt * 0.25;
      knot.current.rotation.y += dt * 0.35;
      knot.current.rotation.z = Math.sin(t * 0.6) * 0.25;
    }
  });

  return (
    <group>
      <color attach="background" args={[syn.palette.bg]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color={syn.palette.b} />
      <directionalLight position={[-6, -2, -4]} intensity={1.3} color={syn.palette.c} />

      <Stars radius={60} depth={18} count={1800} factor={2} saturation={0} fade speed={motion ? 1 : 0} />

      <Float speed={motion ? 1.2 : 0} floatIntensity={motion ? 0.6 : 0} rotationIntensity={motion ? 0.25 : 0}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.05, 0.34, 220, 22]} />
          <MeshTransmissionMaterial {...matProps} />
        </mesh>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <circleGeometry args={[8, 96]} />
        <meshStandardMaterial color={syn.palette.bg} metalness={0.2} roughness={0.9} />
      </mesh>
    </group>
  );
}

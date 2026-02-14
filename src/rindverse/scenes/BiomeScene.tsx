import { Cloud, Float, Sparkles, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import type { Biome } from '../types';
import type { Synesthesia } from '../synesthesia';

function BiomeCard({
  biome,
  syn,
  motion,
  index,
  onPick
}: {
  biome: Biome;
  syn: Synesthesia;
  motion: boolean;
  index: number;
  onPick: () => void;
}) {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (!motion || !ref.current) return;
    gsap.fromTo(
      ref.current.position,
      { y: -0.25, z: 0.1 },
      { y: 0, z: 0, duration: 0.9, ease: 'power3.out', delay: 0.06 * index }
    );
  }, [index, motion]);

  useFrame((state) => {
    if (!motion || !ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.6 + index) * 0.05;
  });

  return (
    <Float speed={motion ? 1.0 : 0} floatIntensity={motion ? 0.35 : 0} rotationIntensity={0}>
      <mesh
        ref={ref}
        position={[index === 0 ? -1.35 : 1.35, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPick();
        }}
        onPointerEnter={(e) => {
          (e.object as Mesh).scale.setScalar(1.03);
        }}
        onPointerLeave={(e) => {
          (e.object as Mesh).scale.setScalar(1);
        }}
      >
        <boxGeometry args={[2.3, 1.2, 0.08]} />
        <meshStandardMaterial color={syn.palette.bg} roughness={0.22} metalness={0.35} />
        <Text position={[0, 0.25, 0.06]} fontSize={0.18} color={syn.palette.ink} anchorX="center" anchorY="middle">
          {biome.name}
        </Text>
        <Text
          position={[0, -0.12, 0.06]}
          fontSize={0.085}
          color={'rgba(255,255,255,0.75)'}
          maxWidth={2.0}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {biome.description}
        </Text>
      </mesh>
    </Float>
  );
}

export function BiomeScene({
  syn,
  motion,
  biomes,
  onPickBiome
}: {
  syn: Synesthesia;
  motion: boolean;
  biomes: [Biome, Biome];
  onPickBiome: (b: Biome) => void;
}) {
  const ground = useRef<Mesh | null>(null);

  const env = useMemo(() => {
    const intensity = syn.motion.intensity;
    return {
      spark: 0.6 + intensity * 1.2
    };
  }, [syn.motion.intensity]);

  useFrame((state) => {
    if (!motion || !ground.current) return;
    const t = state.clock.getElapsedTime();
    const m = ground.current.material as unknown as { opacity: number };
    m.opacity = 0.86 + Math.sin(t * 0.4) * 0.04;
  });

  return (
    <group>
      <color attach="background" args={[syn.palette.bg]} />
      <fog attach="fog" args={[syn.palette.bg, 6, 14]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={2.0} color={syn.palette.b} />
      <directionalLight position={[-6, -2, -4]} intensity={1.0} color={syn.palette.c} />

      <Sparkles count={240} speed={motion ? env.spark : 0} size={1.2} opacity={0.12} scale={[10, 5, 10]} />
      <Cloud position={[-3, 1.6, -2]} speed={motion ? 0.08 : 0} opacity={0.18} scale={1.6} />

      <BiomeCard biome={biomes[0]} syn={syn} motion={motion} index={0} onPick={() => onPickBiome(biomes[0])} />
      <BiomeCard biome={biomes[1]} syn={syn} motion={motion} index={1} onPick={() => onPickBiome(biomes[1])} />

      <mesh ref={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <circleGeometry args={[10, 96]} />
        <meshStandardMaterial color={syn.palette.bg} transparent opacity={0.9} roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  );
}

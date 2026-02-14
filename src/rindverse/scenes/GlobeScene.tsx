import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import type { Mesh, ShaderMaterial } from 'three';
import type { RegionKey } from '../types';
import type { Synesthesia } from '../synesthesia';

const VERT = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main(){
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;

  // hashy noise (cheap)
  float n(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for(int i=0;i<5;i++){
      v += a * n(p);
      p *= 2.03;
      a *= 0.55;
    }
    return v;
  }

  void main(){
    float lat = vUv.y;
    float band = smoothstep(0.08, 0.92, lat);
    float clouds = fbm(vUv*3.0 + vec2(uTime*0.02, -uTime*0.015));
    float land = smoothstep(0.55, 0.78, fbm(vUv*5.5));

    vec3 ocean = mix(uC, uB, band);
    vec3 landCol = mix(uA, uB, land);
    vec3 col = mix(ocean, landCol, land*0.9);

    col += vec3(1.0) * (clouds*0.14);

    // limb darkening
    float fres = pow(1.0 - abs(dot(normalize(vPos), vec3(0.0,0.0,1.0))), 2.2);
    col += fres * 0.2;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string) {
  // accepts hsl() too; fallback to white
  if (hex.startsWith('hsl')) return [1, 1, 1] as const;
  const h = hex.replace('#', '').trim();
  if (h.length !== 6) return [1, 1, 1] as const;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b] as const;
}

const MARKERS: Array<{ key: RegionKey; label: string; pos: [number, number, number] }> = [
  { key: 'spain', label: 'Spain', pos: [-0.35, 0.2, 0.92] },
  { key: 'france', label: 'France', pos: [-0.22, 0.32, 0.92] }
];

export default function GlobeScene({
  syn,
  motion,
  onSelect
}: {
  syn: Synesthesia;
  motion: boolean;
  onSelect: (k: RegionKey) => void;
}) {
  const globe = useRef<Mesh | null>(null);
  const mat = useRef<ShaderMaterial | null>(null);
  const { camera } = useThree();

  const colors = useMemo(() => {
    // hsl() parsing is non-trivial without DOM; keep shader colors stable but influenced via time/motion.
    return {
      a: hexToRgb('#ffd8a8'),
      b: hexToRgb('#8ecae6'),
      c: hexToRgb('#0b1320')
    };
  }, []);

  useEffect(() => {
    if (!motion) return;
    const tl = gsap.timeline();
    tl.to(camera.position, { x: 0, y: 0.2, z: 4.2, duration: 1.1, ease: 'power3.out' }, 0);
    tl.to(camera, { duration: 0, onUpdate: () => camera.lookAt(0, 0, 0) }, 0);
    return () => {
      tl.kill();
    };
  }, [camera, motion]);

  useFrame((state, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.getElapsedTime();
    if (!motion) return;
    if (globe.current) globe.current.rotation.y += dt * (0.12 + syn.motion.intensity * 0.18);
  });

  return (
    <group>
      <color attach="background" args={[syn.palette.bg]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 2]} intensity={2.1} color={syn.palette.b} />
      <directionalLight position={[-6, -2, -2]} intensity={0.9} color={syn.palette.c} />

      <mesh ref={globe}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={{
            uTime: { value: 0 },
            uA: { value: colors.a },
            uB: { value: colors.b },
            uC: { value: colors.c }
          }}
        />
      </mesh>

      {MARKERS.map((m) => (
        <group key={m.key} position={m.pos}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelect(m.key);
            }}
            onPointerEnter={(e) => {
              (e.object as Mesh).scale.setScalar(1.25);
            }}
            onPointerLeave={(e) => {
              (e.object as Mesh).scale.setScalar(1.0);
            }}
          >
            <sphereGeometry args={[0.06, 20, 20]} />
            <meshStandardMaterial color={syn.palette.a} emissive={syn.palette.b} emissiveIntensity={0.8} />
          </mesh>
          <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="rvMarker">{m.label}</div>
          </Html>
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
        <circleGeometry args={[8, 96]} />
        <meshStandardMaterial color={syn.palette.bg} roughness={0.95} metalness={0.1} />
      </mesh>
    </group>
  );
}

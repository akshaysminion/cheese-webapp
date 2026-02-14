import { Environment, Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Mesh, ShaderMaterial } from 'three';
import type { Synesthesia } from '../synesthesia';

const VERT = `
  varying vec2 vUv;
  varying vec3 vN;
  void main(){
    vUv = uv;
    vN = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  varying vec2 vUv;
  varying vec3 vN;
  uniform float uTime;
  uniform float uCut;
  uniform vec3 uA;
  uniform vec3 uB;

  float n(vec2 p){
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
  }

  void main(){
    float rind = smoothstep(0.0, 0.12, vUv.y) + smoothstep(1.0, 0.88, vUv.y);
    float marb = n(vUv*50.0 + uTime*0.15) * 0.5 + n(vUv*18.0 - uTime*0.08) * 0.5;

    vec3 paste = mix(uA, uB, marb);
    vec3 col = mix(paste, vec3(0.15,0.1,0.06), rind*0.75);

    // dissection highlight
    float cutLine = smoothstep(uCut-0.01, uCut+0.01, vUv.x) - smoothstep(uCut+0.01, uCut+0.03, vUv.x);
    col += cutLine * vec3(1.0, 0.95, 0.85);

    float fres = pow(1.0 - dot(normalize(vN), vec3(0.0,0.0,1.0)), 2.0);
    col += fres * 0.12;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function vec3FromCss(_css: string): [number, number, number] {
  // shader uses stable warm/cool. (CSS parsing intentionally avoided.)
  return [1, 0.84, 0.6];
}

export default function RitualScene({
  syn,
  motion,
  title,
  notes
}: {
  syn: Synesthesia;
  motion: boolean;
  title: string;
  notes: string[];
}) {
  const wheel = useRef<Mesh | null>(null);
  const mat = useRef<ShaderMaterial | null>(null);
  const [cut, setCut] = useState(0.12);

  const a = useMemo(() => vec3FromCss(syn.palette.a), [syn.palette.a]);
  const b = useMemo(() => vec3FromCss(syn.palette.b), [syn.palette.b]);

  useEffect(() => {
    if (!motion) return;
    const obj = { cut: 0.12 };
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(obj, {
      cut: 0.88,
      duration: 2.8,
      ease: 'sine.inOut',
      onUpdate: () => setCut(obj.cut)
    });
    return () => {
      tl.kill();
    };
  }, [motion]);

  useFrame((state, dt) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.getElapsedTime();
      mat.current.uniforms.uCut.value = cut;
    }
    if (!motion) return;
    if (wheel.current) {
      wheel.current.rotation.y += dt * (0.25 + syn.motion.intensity * 0.25);
      wheel.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.08;
    }
  });

  return (
    <group>
      <color attach="background" args={[syn.palette.bg]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 5, 3]} intensity={2.1} color={syn.palette.b} />
      <directionalLight position={[-6, -2, -3]} intensity={0.9} color={syn.palette.c} />

      <Environment preset="warehouse" />

      <Float speed={motion ? 0.9 : 0} floatIntensity={motion ? 0.4 : 0} rotationIntensity={0}>
        <mesh ref={wheel} position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.62, 86, 1, true]} />
          <shaderMaterial
            ref={mat}
            vertexShader={VERT}
            fragmentShader={FRAG}
            uniforms={{
              uTime: { value: 0 },
              uCut: { value: cut },
              uA: { value: a },
              uB: { value: b }
            }}
          />
        </mesh>
      </Float>

      <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div className="rvRitualHUD">
          <div className="rvRitualTitle">{title}</div>
          <div className="rvRitualNotes">{notes.slice(0, 5).join(' • ')}</div>
          <div className="rvRitualHint">Dissection Ritual: observe the cut-line and let it retune the room.</div>
        </div>
      </Html>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <circleGeometry args={[10, 96]} />
        <meshStandardMaterial color={syn.palette.bg} roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  );
}

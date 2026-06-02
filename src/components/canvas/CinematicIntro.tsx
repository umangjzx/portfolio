import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { checkIsMobile } from '../../hooks/useIsMobile';

/* ============================================================
   Cinematic Intro — premium light-themed 3D title sequence.
   Particles are rendered as solid colored dots against white.
============================================================ */

export const TIMELINE = {
  GATHER_END: 1.6,
  FORM_START: 1.5,
  FORM_PARTICLE_DUR: 1.15,
  FORM_STAGGER: 0.75,
  CHARGE_START: 3.4,
  PUSH_START: 3.9,
  PUSH_DUR: 1.4,
  FLASH_START: 5.0,
  TOTAL: 5.6,
} as const;

const COL = {
  indigo: new THREE.Color('#4f46e5'),
  violet: new THREE.Color('#7c3aed'),
  cyan: new THREE.Color('#0891b2'),
  pink: new THREE.Color('#db2777'),
  teal: new THREE.Color('#14b8a6'),
  rose: new THREE.Color('#f43f5e'),
};

/* ---------- easing ---------- */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInCubic = (t: number) => Math.pow(clamp01(t), 3);
const easeInOut = (t: number) => {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/* ---------- round sprite (alpha-based circle) ---------- */
function makeCircleTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, s, s);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.8, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/* ---------- glow texture for core ---------- */
function makeGlowTexture(hex: string): THREE.Texture {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const col = new THREE.Color(hex);
  const r = Math.round(col.r * 255);
  const gr = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(${r},${gr},${b},0.9)`);
  g.addColorStop(0.3, `rgba(${r},${gr},${b},0.4)`);
  g.addColorStop(0.6, `rgba(${r},${gr},${b},0.1)`);
  g.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/* ---------- sample "UMANG" glyph pixels → 3D target points ---------- */
function buildTextTargets(text: string, count: number, worldW: number) {
  const W = 1200;
  const H = 320;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let fontSize = 230;
  do {
    ctx.font = `900 ${fontSize}px "Arial Black","Helvetica Neue","Clash Display",sans-serif`;
    if (ctx.measureText(text).width <= W * 0.9) break;
    fontSize -= 10;
  } while (fontSize > 60);
  ctx.fillText(text, W / 2, H / 2 + 6);

  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  const step = 2; // denser sampling for better text shape
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4] > 128) pts.push(x, y);
    }
  }

  const targets = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scale = worldW / W;
  const sampleCount = pts.length / 2 || 1;
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    let wx: number, wy: number;
    if (pts.length) {
      const j = Math.floor(Math.random() * sampleCount) * 2;
      wx = (pts[j] - W / 2) * scale;
      wy = -(pts[j + 1] - H / 2) * scale;
    } else {
      wx = (Math.random() - 0.5) * worldW;
      wy = (Math.random() - 0.5) * worldW * 0.25;
    }
    const wz = (Math.random() - 0.5) * 0.5;
    targets[i * 3] = wx;
    targets[i * 3 + 1] = wy;
    targets[i * 3 + 2] = wz;

    // Color sweep: indigo → violet → cyan with teal/rose accents
    const u = clamp01((wx / worldW) + 0.5);
    if (u < 0.33) tmp.lerpColors(COL.indigo, COL.violet, u / 0.33);
    else if (u < 0.66) tmp.lerpColors(COL.violet, COL.cyan, (u - 0.33) / 0.33);
    else tmp.lerpColors(COL.cyan, COL.teal, (u - 0.66) / 0.34);
    if (Math.random() > 0.93) tmp.lerp(COL.pink, 0.7);
    if (Math.random() > 0.97) tmp.lerp(COL.rose, 0.5);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  return { targets, colors };
}

/* ============================================================
   Text particle system
============================================================ */
function TextParticles({ count, sprite }: { count: number; sprite: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const worldW = useMemo(
    () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 16),
    []
  );

  const { targets, colors, scatter, seeds, live } = useMemo(() => {
    const { targets, colors } = buildTextTargets('UMANG', count, worldW);
    const scatter = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 14;
      scatter[i * 3] = Math.cos(theta) * radius;
      scatter[i * 3 + 1] = Math.sin(theta) * radius * 0.6;
      scatter[i * 3 + 2] = -4 - Math.random() * 8;
      seeds[i] = Math.random();
    }
    const live = new Float32Array(scatter);
    return { targets, colors, scatter, seeds, live };
  }, [count, worldW]);

  useFrame(({ clock }) => {
    if (!points.current || !group.current || !mat.current) return;
    const t = clock.getElapsedTime();
    const T = TIMELINE;

    const posAttr = points.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const stagger = seeds[i] * T.FORM_STAGGER;
      const p = easeOutCubic((t - T.FORM_START - stagger) / T.FORM_PARTICLE_DUR);

      const turb = (1 - p) * 1.8;
      const n = seeds[i] * 6.28;
      const wob =
        p < 1
          ? {
              x: Math.sin(t * 1.6 + n) * turb,
              y: Math.cos(t * 1.9 + n * 1.3) * turb,
              z: Math.sin(t * 1.2 + n) * turb * 0.5,
            }
          : { x: 0, y: 0, z: 0 };

      arr[ix] = scatter[ix] + (targets[ix] - scatter[ix]) * p + wob.x;
      arr[ix + 1] = scatter[ix + 1] + (targets[ix + 1] - scatter[ix + 1]) * p + wob.y;
      arr[ix + 2] = scatter[ix + 2] + (targets[ix + 2] - scatter[ix + 2]) * p + wob.z;
    }
    posAttr.needsUpdate = true;

    // Group movement: form in place, then RUSH toward camera
    const formDrift = easeInOut((t - T.FORM_START) / (T.CHARGE_START - T.FORM_START));
    const pushP = easeInCubic((t - T.PUSH_START) / T.PUSH_DUR);
    const baseZ = -6 + formDrift * 2; // -6 → -4 (close to camera)
    group.current.position.z = baseZ + pushP * 50; // MASSIVE push through camera

    // Scale grows dramatically during push
    const charge = clamp01((t - T.CHARGE_START) / (T.PUSH_START - T.CHARGE_START));
    const breathe = Math.sin(t * 2.4) * 0.03 * (1 - pushP);
    const s = (1 + charge * 0.1 + breathe) * (1 + pushP * 2.5);
    group.current.scale.setScalar(s);
    group.current.rotation.z = Math.sin(t * 0.5) * 0.01 * (1 - pushP);

    // Particle size and opacity
    mat.current.size = (worldW < 10 ? 0.13 : 0.17) + pushP * 1.0;
    // Fade in during formation, stay solid, fade only at very end
    const fadeIn = easeOutCubic((t - T.FORM_START + 0.3) / 0.7);
    const fadeOut = 1 - clamp01((t - T.FLASH_START) / 0.5);
    mat.current.opacity = fadeIn * fadeOut;
  });

  return (
    <group ref={group} position={[0, 0, -6]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[live, 3]}
            count={count}
            array={live}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={mat}
          map={sprite}
          size={0.17}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ============================================================
   Light streaks
============================================================ */
function LightStreaks({ count = 180 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const { start, live } = useMemo(() => {
    const start = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 16;
      start[i * 3] = Math.cos(theta) * r;
      start[i * 3 + 1] = Math.sin(theta) * r;
      start[i * 3 + 2] = -4 + Math.random() * 8;
    }
    return { start, live: new Float32Array(start) };
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current || !mat.current) return;
    const t = clock.getElapsedTime();
    const p = easeInCubic(t / TIMELINE.GATHER_END);
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count * 3; i++) arr[i] = start[i] * (1 - p);
    points.current.geometry.attributes.position.needsUpdate = true;
    mat.current.opacity = Math.sin(clamp01(t / TIMELINE.GATHER_END) * Math.PI) * 0.8;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[live, 3]} count={count} array={live} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#6366f1"
        size={0.25}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ============================================================
   Parallax ambient field
============================================================ */
function AmbientField({
  count, depth, spread, color, size, sprite,
}: {
  count: number; depth: number; spread: number; color: string; size: number; sprite: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      arr[i * 3 + 2] = depth + (Math.random() - 0.5) * spread * 0.4;
    }
    return arr;
  }, [count, spread, depth]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.01;
    group.current.position.x = Math.sin(t * 0.1) * 0.5;
    group.current.position.y = Math.cos(t * 0.08) * 0.3;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          color={color}
          size={size}
          transparent
          opacity={0.5}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ============================================================
   Energy core
============================================================ */
function EnergyCore({ glow }: { glow: THREE.Texture }) {
  const sprite = useRef<THREE.Sprite>(null);
  const nucleus = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const T = TIMELINE;
    const ignite = easeOutCubic(t / 1.4);
    const dim = 1 - clamp01((t - T.FORM_START) / 1.6) * 0.8;
    const pulse = 0.9 + Math.sin(t * 5) * 0.1;
    const energy = ignite * dim * pulse;

    if (sprite.current) {
      const sc = (2.5 + energy * 5) * (1 + Math.sin(t * 2) * 0.04);
      sprite.current.scale.setScalar(sc);
      (sprite.current.material as THREE.SpriteMaterial).opacity = energy * 0.6;
    }
    if (nucleus.current) {
      nucleus.current.rotation.x = t * 0.6;
      nucleus.current.rotation.y = t * 0.8;
      const ns = 0.4 + energy * 0.7;
      nucleus.current.scale.setScalar(ns);
      const m = nucleus.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1 + energy * 2;
      m.opacity = clamp01(energy * 1.2);
    }
  });

  return (
    <group>
      <sprite ref={sprite}>
        <spriteMaterial map={glow} transparent depthWrite={false} opacity={0} />
      </sprite>
      <mesh ref={nucleus}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#e0e7ff"
          emissive="#6366f1"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

/* ============================================================
   Holographic rings
============================================================ */
function HoloRings() {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () => [
      { r: 2.2, tube: 0.03, color: '#06b6d4', tilt: 0.0, phase: 0.0 },
      { r: 3.2, tube: 0.025, color: '#8b5cf6', tilt: 0.5, phase: 0.6 },
      { r: 4.5, tube: 0.02, color: '#6366f1', tilt: -0.4, phase: 1.2 },
      { r: 6.0, tube: 0.016, color: '#ec4899', tilt: 0.25, phase: 1.8 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.12;
    group.current.children.forEach((child, i) => {
      const ring = rings[i];
      const m = child as THREE.Mesh;
      const appear = easeOutCubic((t - 0.4 - ring.phase * 0.25) / 1.2);
      const wave = 1 + Math.sin(t * 1.4 - ring.phase) * 0.05;
      const fade = 1 - clamp01((t - TIMELINE.PUSH_START) / 0.8);
      m.scale.setScalar(appear * wave);
      m.rotation.z = t * (0.2 + i * 0.05) * (i % 2 ? -1 : 1);
      (m.material as THREE.MeshBasicMaterial).opacity = appear * fade * 0.5;
    });
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[ring.tilt, ring.tilt * 0.5, 0]}>
          <torusGeometry args={[ring.r, ring.tube, 12, 100]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   Camera rig
============================================================ */
function CameraRig({ onDone }: { onDone: () => void }) {
  const { camera } = useThree();
  const fired = useRef(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const T = TIMELINE;
    const cam = camera as THREE.PerspectiveCamera;

    const drift = easeInOut(t / T.CHARGE_START) * 1.0;
    const pushP = easeInCubic((t - T.PUSH_START) / T.PUSH_DUR);
    const z = 18 - drift - pushP * 10;

    const shakeEnv =
      clamp01((t - T.CHARGE_START) / 0.5) * (1 - clamp01((t - T.FLASH_START) / 0.6));
    const amp = shakeEnv * (0.1 + pushP * 0.4);
    const sx = (Math.sin(t * 47) + Math.sin(t * 23.3)) * 0.5 * amp;
    const sy = (Math.cos(t * 41) + Math.sin(t * 29.7)) * 0.5 * amp;

    cam.position.set(sx, sy, z);
    cam.lookAt(0, 0, 0);
    cam.rotation.z += (Math.sin(t * 60) * 0.5) * amp * 0.04;

    cam.fov = 60 + easeInOut(pushP) * 30;
    cam.updateProjectionMatrix();

    if (!fired.current && t >= T.TOTAL) {
      fired.current = true;
      onDone();
    }
  });

  return null;
}

/* ============================================================
   Scene assembly
============================================================ */
function Scene({ quality, onDone }: { quality: 'high' | 'low'; onDone: () => void }) {
  // Significantly reduce particle counts for smoother performance on all devices
  const isMobile = checkIsMobile();
  const textCount = isMobile ? 1800 : quality === 'high' ? 5000 : 2500;

  const sprite = useMemo(() => makeCircleTexture(), []);
  const coreGlow = useMemo(() => makeGlowTexture('#6366f1'), []);

  useEffect(() => {
    return () => {
      sprite.dispose();
      coreGlow.dispose();
    };
  }, [sprite, coreGlow]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 10]} color="#ffffff" intensity={0.6} />
      <pointLight position={[8, 5, 6]} color="#6366f1" intensity={3} distance={50} />
      <pointLight position={[-8, -3, 5]} color="#06b6d4" intensity={2} distance={50} />

      <CameraRig onDone={onDone} />

      {/* Parallax depth layers — reduced counts */}
      <AmbientField count={isMobile ? 100 : quality === 'high' ? 350 : 150} depth={-20} spread={50} color="#a5b4fc" size={0.35} sprite={sprite} />
      <AmbientField count={isMobile ? 70 : quality === 'high' ? 250 : 120} depth={-10} spread={40} color="#818cf8" size={0.28} sprite={sprite} />
      <AmbientField count={isMobile ? 50 : quality === 'high' ? 180 : 80} depth={-3} spread={30} color="#06b6d4" size={0.22} sprite={sprite} />

      <LightStreaks count={isMobile ? 40 : quality === 'high' ? 120 : 60} />
      <HoloRings />
      <EnergyCore glow={coreGlow} />
      <TextParticles count={textCount} sprite={sprite} />
    </>
  );
}

export interface CinematicIntroProps {
  quality?: 'high' | 'low';
  onDone: () => void;
}

export default function CinematicIntro({ quality = 'high', onDone }: CinematicIntroProps) {
  const isMobile = checkIsMobile();
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60, near: 0.1, far: 150 }}
      dpr={isMobile ? [1, 1] : [1, quality === 'high' ? 1.5 : 1]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
      frameloop="always"
      onCreated={({ gl }) => gl.setClearColor('#fafafa', 1)}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene quality={quality} onDone={onDone} />
    </Canvas>
  );
}

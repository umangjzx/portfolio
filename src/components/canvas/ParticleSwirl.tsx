import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import * as THREE from 'three';
import { checkIsMobile } from '../../hooks/useIsMobile';
import { detectTouchDevice } from '../../services/mouseTracker';
import { usePortfolioStore } from '../../store/portfolioStore';

/**
 * Throttled mouse position tracker — updates at most every 32ms (~30fps)
 * to avoid expensive raycasting on every pixel of movement.
 */
function useThrottledMouse(camera: THREE.Camera, disabled: boolean) {
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const activeRef = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    let lastUpdate = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdate < 32) return; // ~30fps throttle
      lastUpdate = now;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      if (intersection) {
        mouseRef.current.copy(intersection);
      }
      activeRef.current = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, disabled]);

  return { mouseRef, activeRef };
}

function Particles({ count = 1200, disableRepulsion = false }: { count?: number; disableRepulsion?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const { mouseRef, activeRef } = useThrottledMouse(camera, disableRepulsion);

  // Reusable matrix/vector — avoid allocations in the render loop
  const invMatrix = useMemo(() => new THREE.Matrix4(), []);
  const localMouse = useMemo(() => new THREE.Vector3(), []);

  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color('#6366F1');
    const color2 = new THREE.Color('#06B6D4');
    const color3 = new THREE.Color('#8B5CF6');
    const color4 = new THREE.Color('#14B8A6');
    const color5 = new THREE.Color('#EC4899');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 6 + Math.random() * 8;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const mixRatio = Math.random();
      const finalColor = new THREE.Color();
      if (y > 3) {
        finalColor.lerpColors(color2, color4, mixRatio);
      } else if (y > 0) {
        finalColor.lerpColors(color3, color2, mixRatio);
      } else if (y > -3) {
        finalColor.lerpColors(color1, color3, mixRatio);
      } else {
        finalColor.lerpColors(color1, color5, mixRatio);
      }

      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    return { positions, originalPositions, colors };
  }, [count]);

  // Frame counter for skipping repulsion on alternate frames (low-end optimization)
  const frameCount = useRef(0);

  useFrame((state) => {
    if (!points.current) return;
    frameCount.current++;

    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.z = state.clock.elapsedTime * 0.01;

    // Skip per-particle repulsion when disabled (mobile/touch)
    if (disableRepulsion) return;

    const posAttr = points.current.geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    const originals = particlesData.originalPositions;
    const repulsionRadius = 3.5;
    const repulsionRadiusSq = repulsionRadius * repulsionRadius;
    const repulsionStrength = 2.5;
    const returnSpeed = 0.02;

    // Reuse pre-allocated objects
    invMatrix.copy(points.current.matrixWorld).invert();
    localMouse.copy(mouseRef.current).applyMatrix4(invMatrix);
    const mx = localMouse.x, my = localMouse.y, mz = localMouse.z;
    const mouseActive = activeRef.current;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const ox = originals[ix];
      const oy = originals[iy];
      const oz = originals[iz];

      if (mouseActive) {
        const dx = positions[ix] - mx;
        const dy = positions[iy] - my;
        const dz = positions[iz] - mz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < repulsionRadiusSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repulsionRadius) * repulsionStrength * 0.3;
          const invDist = 1 / dist;
          positions[ix] += dx * invDist * force;
          positions[iy] += dy * invDist * force;
          positions[iz] += dz * invDist * force;
        } else {
          positions[ix] += (ox - positions[ix]) * returnSpeed;
          positions[iy] += (oy - positions[iy]) * returnSpeed;
          positions[iz] += (oz - positions[iz]) * returnSpeed;
        }
      } else {
        positions[ix] += (ox - positions[ix]) * returnSpeed;
        positions[iy] += (oy - positions[iy]) * returnSpeed;
        positions[iz] += (oz - positions[iz]) * returnSpeed;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesData.positions, 3]}
          count={particlesData.positions.length / 3}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particlesData.colors, 3]}
          count={particlesData.colors.length / 3}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Lightweight but visually rich CSS background for mobile.
 * Uses animated mesh gradients, floating geometric shapes, and subtle noise
 * for a premium feel without any WebGL overhead.
 * All animations use transform/opacity only (compositor-friendly, 60fps).
 */
function MobileBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#fafafa] overflow-hidden" style={{ pointerEvents: 'none' }}>
      {/* Mesh gradient base — slow morphing blobs with richer palette */}
      <div
        className="absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] rounded-full opacity-[0.22]"
        style={{
          background: 'radial-gradient(circle, #6366f1, transparent 65%)',
          animation: 'meshFloat1 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[65vw] h-[65vw] rounded-full opacity-[0.18]"
        style={{
          background: 'radial-gradient(circle, #06b6d4, transparent 65%)',
          animation: 'meshFloat2 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[40%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-[0.14]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6, transparent 60%)',
          animation: 'meshFloat3 16s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[10%] right-[5%] w-[40vw] h-[40vw] rounded-full opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, #ec4899, transparent 65%)',
          animation: 'meshFloat4 20s ease-in-out infinite',
        }}
      />
      {/* Additional warm accent blobs for color richness */}
      <div
        className="absolute top-[60%] left-[50%] w-[35vw] h-[35vw] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #f43f5e, transparent 60%)',
          animation: 'meshFloat1 22s ease-in-out infinite 3s',
        }}
      />
      <div
        className="absolute top-[5%] left-[40%] w-[30vw] h-[30vw] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #14b8a6, transparent 60%)',
          animation: 'meshFloat2 24s ease-in-out infinite 2s',
        }}
      />

      {/* Floating geometric shapes — subtle depth */}
      <div
        className="absolute top-[15%] left-[12%] w-3 h-3 rounded-full bg-indigo-400/40"
        style={{ animation: 'floatDot 6s ease-in-out infinite' }}
      />
      <div
        className="absolute top-[25%] right-[18%] w-2 h-2 rounded-full bg-cyan-400/50"
        style={{ animation: 'floatDot 8s ease-in-out infinite 1s' }}
      />
      <div
        className="absolute bottom-[30%] left-[22%] w-2.5 h-2.5 rounded-full bg-violet-400/40"
        style={{ animation: 'floatDot 7s ease-in-out infinite 0.5s' }}
      />
      <div
        className="absolute bottom-[20%] right-[15%] w-2 h-2 rounded-full bg-pink-400/35"
        style={{ animation: 'floatDot 9s ease-in-out infinite 2s' }}
      />
      <div
        className="absolute top-[55%] left-[8%] w-1.5 h-1.5 rounded-full bg-indigo-300/50"
        style={{ animation: 'floatDot 5s ease-in-out infinite 1.5s' }}
      />
      <div
        className="absolute top-[70%] right-[25%] w-3 h-3 rounded-full bg-cyan-300/30"
        style={{ animation: 'floatDot 10s ease-in-out infinite 0.8s' }}
      />

      {/* Thin decorative lines */}
      <div
        className="absolute top-[20%] left-0 right-0 h-px opacity-[0.06]"
        style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
      />
      <div
        className="absolute top-[60%] left-0 right-0 h-px opacity-[0.04]"
        style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
      />

      {/* Subtle grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <style>{`
        @keyframes meshFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 5vh) scale(1.08); }
          66% { transform: translate(-3vw, 8vh) scale(0.95); }
        }
        @keyframes meshFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-6vw, -4vh) scale(1.05); }
          66% { transform: translate(4vw, -7vh) scale(0.97); }
        }
        @keyframes meshFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5vw, -6vh) scale(1.1); }
        }
        @keyframes meshFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-4vw, 5vh) scale(1.06); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-12px) scale(1.3); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/**
 * Continuously requests frames so the particle rotation stays smooth.
 * This is lighter than frameloop="always" because we control the cadence.
 */
function FrameDriver() {
  useFrame(() => {
    invalidate();
  });
  return null;
}

export function ParticleSwirl() {
  const isMobile = checkIsMobile();
  const isTouch = detectTouchDevice();
  const gpuTier = usePortfolioStore((s) => s.gpuTier);

  // Mobile: skip Three.js entirely, use lightweight CSS background
  if (isMobile) {
    return <MobileBackground />;
  }

  // Determine particle count based on GPU tier
  // high: 1500, mid: 800, low: 400
  const count = gpuTier === 'high' ? 1500 : gpuTier === 'mid' ? 800 : 400;

  // Desktop: full 3D particle experience with adaptive count
  return (
    <div className="fixed inset-0 z-[-1] bg-white" style={{ pointerEvents: 'none', contain: 'strict' }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        dpr={[1, gpuTier === 'high' ? 1.5 : 1]}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, depth: false }}
        frameloop="demand"
        style={{ pointerEvents: 'none' }}
      >
        <FrameDriver />
        <Particles count={count} disableRepulsion={isTouch} />
      </Canvas>
    </div>
  );
}

export default ParticleSwirl;

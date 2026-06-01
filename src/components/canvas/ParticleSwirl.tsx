import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { checkIsMobile } from '../../hooks/useIsMobile';
import { detectTouchDevice } from '../../services/mouseTracker';

function Particles({ count = 3000, disableRepulsion = false }) {
  const points = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const [mouseActive, setMouseActive] = useState(false);
  const { camera } = useThree();

  // Track mouse position in 3D space — skip on touch devices
  useEffect(() => {
    if (disableRepulsion) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      if (intersection) {
        mouseRef.current.copy(intersection);
      }
      setMouseActive(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, disableRepulsion]);

  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color('#6366F1'); // Indigo
    const color2 = new THREE.Color('#06B6D4'); // Cyan
    const color3 = new THREE.Color('#8B5CF6'); // Violet
    
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
      if (y > 2) {
        finalColor.lerpColors(color2, color3, mixRatio);
      } else if (y < -2) {
        finalColor.lerpColors(color1, color3, mixRatio);
      } else {
        finalColor.lerpColors(color1, color2, mixRatio);
      }

      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }
    
    return { positions, originalPositions, colors };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;

    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.z = state.clock.elapsedTime * 0.01;

    // Skip per-particle repulsion when disabled (mobile/touch)
    if (disableRepulsion) return;

    // Apply cursor repulsion
    const posAttr = points.current.geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    const originals = particlesData.originalPositions;
    const repulsionRadius = 3.5;
    const repulsionStrength = 2.5;

    const invMatrix = new THREE.Matrix4().copy(points.current.matrixWorld).invert();
    const localMouse = mouseRef.current.clone().applyMatrix4(invMatrix);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = originals[ix];
      const oy = originals[iy];
      const oz = originals[iz];

      if (mouseActive) {
        const dx = positions[ix] - localMouse.x;
        const dy = positions[iy] - localMouse.y;
        const dz = positions[iz] - localMouse.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < repulsionRadius && dist > 0.01) {
          const force = (1 - dist / repulsionRadius) * repulsionStrength;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;
          positions[ix] += nx * force * 0.3;
          positions[iy] += ny * force * 0.3;
          positions[iz] += nz * force * 0.3;
        } else {
          positions[ix] += (ox - positions[ix]) * 0.02;
          positions[iy] += (oy - positions[iy]) * 0.02;
          positions[iz] += (oz - positions[iz]) * 0.02;
        }
      } else {
        positions[ix] += (ox - positions[ix]) * 0.02;
        positions[iy] += (oy - positions[iy]) * 0.02;
        positions[iz] += (oz - positions[iz]) * 0.02;
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
 * Lightweight CSS-only background for mobile.
 * Uses subtle animated gradients instead of a full WebGL canvas.
 * Zero GPU overhead — pure compositor-friendly CSS animations.
 */
function MobileBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-white overflow-hidden" style={{ pointerEvents: 'none' }}>
      {/* Soft animated gradient orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, #6366f1, transparent 70%)',
          animation: 'mobileOrb1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, #06b6d4, transparent 70%)',
          animation: 'mobileOrb2 24s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
          animation: 'mobileOrb3 18s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes mobileOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10vw, 8vh) scale(1.1); }
        }
        @keyframes mobileOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8vw, -6vh) scale(1.05); }
        }
        @keyframes mobileOrb3 {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, -5vh) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

export function ParticleSwirl() {
  const isMobile = checkIsMobile();
  const isTouch = detectTouchDevice();

  // Mobile: skip Three.js entirely, use lightweight CSS background
  if (isMobile) {
    return <MobileBackground />;
  }

  // Desktop: full 3D particle experience
  return (
    <div className="fixed inset-0 z-[-1] bg-white" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Particles count={4000} disableRepulsion={isTouch} />
      </Canvas>
    </div>
  );
}

export default ParticleSwirl;

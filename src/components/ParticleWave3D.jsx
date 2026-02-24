import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Particle Wave Mesh ──────────────────────────────────────────────
// Creates a dense grid of points that undulate like flowing fabric
const WaveMesh = ({ count = 200, separation = 0.12 }) => {
    const meshRef = useRef();

    // Generate particle positions in a grid
    const { positions, basePositions } = useMemo(() => {
        const total = count * count;
        const pos = new Float32Array(total * 3);
        const base = new Float32Array(total * 3);
        const halfCount = count / 2;

        for (let ix = 0; ix < count; ix++) {
            for (let iz = 0; iz < count; iz++) {
                const idx = (ix * count + iz) * 3;
                const x = (ix - halfCount) * separation;
                const z = (iz - halfCount) * separation;
                pos[idx] = x;
                pos[idx + 1] = 0;
                pos[idx + 2] = z;
                base[idx] = x;
                base[idx + 1] = 0;
                base[idx + 2] = z;
            }
        }
        return { positions: pos, basePositions: base };
    }, [count, separation]);

    // Pre-compute colors based on initial layout (will be updated in useFrame)
    const colors = useMemo(() => {
        const total = count * count;
        return new Float32Array(total * 3);
    }, [count]);

    // Sizes for each particle
    const sizes = useMemo(() => {
        const total = count * count;
        const s = new Float32Array(total);
        for (let i = 0; i < total; i++) {
            s[i] = 1.0 + Math.random() * 0.5;
        }
        return s;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime * 0.4;
        const geometry = meshRef.current.geometry;
        const posAttr = geometry.getAttribute('position');
        const colAttr = geometry.getAttribute('color');
        const posArray = posAttr.array;
        const colArray = colAttr.array;
        const total = count * count;

        for (let i = 0; i < total; i++) {
            const idx = i * 3;
            const x = basePositions[idx];
            const z = basePositions[idx + 2];

            // Multiple layered sine waves for organic fabric-like motion
            const wave1 = Math.sin(x * 0.8 + time * 1.2) * 0.6;
            const wave2 = Math.sin(z * 0.6 + time * 0.8) * 0.4;
            const wave3 = Math.sin((x + z) * 0.5 + time * 0.6) * 0.3;
            const wave4 = Math.cos(x * 0.3 - time * 0.4) * Math.sin(z * 0.4 + time * 0.5) * 0.5;
            const wave5 = Math.sin(Math.sqrt(x * x + z * z) * 0.3 + time * 0.7) * 0.2;

            const y = wave1 + wave2 + wave3 + wave4 + wave5;
            posArray[idx + 1] = y;

            // Color mapping: brighter on crests, darker in troughs
            const normalizedY = (y + 2) / 4; // normalize roughly to 0-1
            const intensity = Math.pow(Math.max(0, normalizedY), 1.5);

            // Teal to bright green gradient based on height
            colArray[idx] = 0.01 + intensity * 0.04;      // R
            colArray[idx + 1] = 0.15 + intensity * 0.8;   // G
            colArray[idx + 2] = 0.12 + intensity * 0.65;  // B
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} rotation={[-0.5, 0, 0.15]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count * count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count * count}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count * count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                vertexColors
                transparent
                opacity={0.85}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
};

// ── Secondary Wave Layer (deeper, softer) ───────────────────────────
const DeepWave = ({ count = 120, separation = 0.18 }) => {
    const meshRef = useRef();

    const { positions, basePositions } = useMemo(() => {
        const total = count * count;
        const pos = new Float32Array(total * 3);
        const base = new Float32Array(total * 3);
        const halfCount = count / 2;

        for (let ix = 0; ix < count; ix++) {
            for (let iz = 0; iz < count; iz++) {
                const idx = (ix * count + iz) * 3;
                const x = (ix - halfCount) * separation;
                const z = (iz - halfCount) * separation;
                pos[idx] = x;
                pos[idx + 1] = -1.5;
                pos[idx + 2] = z;
                base[idx] = x;
                base[idx + 1] = 0;
                base[idx + 2] = z;
            }
        }
        return { positions: pos, basePositions: base };
    }, [count, separation]);

    const colors = useMemo(() => {
        const total = count * count;
        return new Float32Array(total * 3);
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime * 0.25;
        const posAttr = meshRef.current.geometry.getAttribute('position');
        const colAttr = meshRef.current.geometry.getAttribute('color');
        const posArray = posAttr.array;
        const colArray = colAttr.array;
        const total = count * count;

        for (let i = 0; i < total; i++) {
            const idx = i * 3;
            const x = basePositions[idx];
            const z = basePositions[idx + 2];

            const wave1 = Math.sin(x * 0.5 + time * 1.0) * 0.8;
            const wave2 = Math.cos(z * 0.4 + time * 0.7) * 0.5;
            const wave3 = Math.sin((x - z) * 0.3 + time * 0.5) * 0.4;

            const y = wave1 + wave2 + wave3 - 1.5;
            posArray[idx + 1] = y;

            const normalizedY = (y + 3) / 4;
            const intensity = Math.pow(Math.max(0, normalizedY), 2);

            colArray[idx] = 0.0 + intensity * 0.02;
            colArray[idx + 1] = 0.08 + intensity * 0.35;
            colArray[idx + 2] = 0.06 + intensity * 0.3;
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} rotation={[-0.4, 0.1, 0.05]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count * count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count * count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent
                opacity={0.5}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
};

// ── Main Component ──────────────────────────────────────────────────
const ParticleWave3D = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
            {/* CSS Glow underneath */}
            <div style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                height: '60%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(12,242,205,0.12) 0%, rgba(12,242,205,0.04) 40%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Canvas
                camera={{ position: [0, 3, 10], fov: 50, near: 0.1, far: 100 }}
                style={{ zIndex: 1, position: 'relative' }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]}
            >
                <fog attach="fog" args={['#000000', 6, 18]} />
                <WaveMesh count={180} separation={0.1} />
                <DeepWave count={100} separation={0.16} />
            </Canvas>
        </div>
    );
};

export default ParticleWave3D;

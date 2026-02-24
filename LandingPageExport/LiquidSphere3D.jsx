import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';

// Component for a glowing neon ring with additive blending
function NeonRing({ radius, thickness, speed, color, rotationOffsets }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = rotationOffsets[0] + state.clock.elapsedTime * speed;
            groupRef.current.rotation.y = rotationOffsets[1] + state.clock.elapsedTime * speed * 1.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Solid inner ring */}
            <mesh>
                <torusGeometry args={[radius, thickness, 16, 100]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            {/* Outer fake bloom glow */}
            <mesh>
                <torusGeometry args={[radius, thickness * 4, 16, 100]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

function CyberCore() {
    const coreRef = useRef();
    const wireframeRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.4;
            coreRef.current.rotation.x = t * 0.2;
        }
        if (wireframeRef.current) {
            wireframeRef.current.rotation.y = -t * 0.15;
            wireframeRef.current.rotation.z = t * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            {/* Inner Dark Abstract Core (Octahedron) */}
            <mesh ref={coreRef} scale={1.2}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#01120f"
                    metalness={0.9}
                    roughness={0.1}
                />
                {/* Glowing edges on the inner core */}
                <mesh>
                    <octahedronGeometry args={[1.01, 0]} />
                    <meshBasicMaterial
                        color="#0cf2cd"
                        wireframe
                        transparent
                        opacity={0.4}
                        toneMapped={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </mesh>

            {/* Outer Holographic Hull (Icosahedron) */}
            <mesh ref={wireframeRef} scale={2}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial
                    color="#1fffd9"
                    wireframe
                    transparent
                    opacity={0.12}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Orbiting Neon Rings (Data Rings) */}
            <NeonRing radius={2.6} thickness={0.015} speed={0.4} color="#0cf2cd" rotationOffsets={[Math.PI / 6, 0, 0]} />
            <NeonRing radius={3.1} thickness={0.01} speed={-0.25} color="#1fffd9" rotationOffsets={[0, Math.PI / 3, 0]} />
            <NeonRing radius={3.6} thickness={0.005} speed={0.15} color="#033a2d" rotationOffsets={[Math.PI / 3, Math.PI / 4, 0]} />
        </Float>
    );
}

// Data connections in the background
function NetworkLines() {
    const linesCount = 20;

    // Creates random points to form a background network wireframe
    const lines = useMemo(() => {
        const temp = [];
        for (let i = 0; i < linesCount; i++) {
            const points = [];
            points.push(new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5));
            points.push(new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5));
            temp.push(points);
        }
        return temp;
    }, []);

    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -5]}>
            {lines.map((pts, i) => (
                <Line
                    key={i}
                    points={pts}
                    color="#1fffd9"
                    lineWidth={1}
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            ))}
        </group>
    );
}

export default function GeometricCore3D() {
    return (
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} color="#ffffff" />
                    <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
                    <directionalLight position={[-10, -10, -5]} intensity={1} color="#0cf2cd" />

                    {/* Background network lines */}
                    <NetworkLines />

                    {/* Central Animated Geometric Object */}
                    <CyberCore />

                    {/* Data Particles floating */}
                    <Sparkles count={100} scale={10} size={2} speed={0.6} opacity={0.8} color="#0cf2cd" />
                    <Sparkles count={50} scale={12} size={4} speed={0.4} opacity={0.5} color="#1fffd9" />

                    {/* Reflected glow on the floor */}
                    <ContactShadows
                        position={[0, -4.5, 0]}
                        opacity={0.8}
                        scale={15}
                        blur={3}
                        far={10}
                        color="#0cf2cd"
                    />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.8}
                        maxPolarAngle={Math.PI / 2 + 0.3}
                        minPolarAngle={Math.PI / 2 - 0.3}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

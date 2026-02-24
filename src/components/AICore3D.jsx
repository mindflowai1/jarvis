import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron, MeshDistortMaterial, Float, Ring, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Core = () => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            {/* Fake Glow Sphere inside 3D space */}
            <Sphere args={[1.7, 32, 32]}>
                <meshBasicMaterial color="#0cf2cd" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Sphere>
            <mesh ref={meshRef} scale={1.5}>
                <Icosahedron args={[1, 1]}>
                    <MeshDistortMaterial
                        color="#0cf2cd"
                        emissive="#0cf2cd"
                        emissiveIntensity={1.5}
                        distort={0.4}
                        speed={3}
                        roughness={0.2}
                        metalness={0.8}
                        wireframe={true}
                    />
                </Icosahedron>
            </mesh>
        </Float>
    );
};

const OrbitingRings = () => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x -= delta * 0.2;
            groupRef.current.rotation.y -= delta * 0.15;
            groupRef.current.rotation.z += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <Ring args={[3.2, 3.25, 64]}>
                    <meshBasicMaterial color="#0cf2cd" side={THREE.DoubleSide} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
                </Ring>
            </mesh>

            {/* Inner Ring */}
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <Ring args={[2.4, 2.43, 64]}>
                    <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
                </Ring>
            </mesh>

            {/* Cross Ring */}
            <mesh rotation={[0, Math.PI / 2, Math.PI / 6]}>
                <Ring args={[2.8, 2.83, 64]}>
                    <meshBasicMaterial color="#0cf2cd" side={THREE.DoubleSide} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
                </Ring>
            </mesh>
        </group>
    );
};

const AICore3D = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px', pointerEvents: 'auto' }}>
            {/* CSS-based Glow to guarantee bloom without post-processing (avoids breaking black backgrounds) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(12,242,205,0.2) 0%, transparent 60%)',
                filter: 'blur(40px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ zIndex: 1, position: 'relative' }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={2.5} color="#0cf2cd" />

                <Core />
                <OrbitingRings />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.8}
                />
            </Canvas>
        </div>
    );
};

export default AICore3D;

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function LiquidBlob() {
    const sphereRef = useRef();

    useFrame((state) => {
        if (sphereRef.current) {
            // Rotação suave constante para dar mais vida ao líquido
            sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere ref={sphereRef} args={[2.5, 128, 128]} scale={1.2}>
                {/* O MeshDistortMaterial cria aquele efeito de gota d'água fluida/plasma orgânico sem precisar de shaders complexos */}
                <MeshDistortMaterial
                    color="#0cf2cd"
                    attach="material"
                    distort={0.45} // Nível de deformação líquida
                    speed={2.5} // Velocidade do movimento das ondas
                    roughness={0.15}
                    metalness={0.9} // Bem metálico para refletir luzes como um mercúrio verde
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive="#000000"
                />
            </Sphere>

            {/* Núcleo brilhante escondido dentro do líquido para dar profundidade na refração */}
            <Sphere args={[1.5, 32, 32]}>
                <meshBasicMaterial color="#1fffd9" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </Sphere>
        </Float>
    );
}

export default function LiquidSphere3D() {
    return (
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            {/* Usando flat=false novamente para aproveitar as sombras físicas suaves e os highlights reflexivos do metal líquido */}
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    {/* Iluminação dramática focada na refração da gota metálica */}
                    <ambientLight intensity={0.5} color="#ffffff" />
                    <directionalLight position={[10, 15, 10]} intensity={3.0} color="#ffffff" />
                    <directionalLight position={[-10, -5, -10]} intensity={1.5} color="#1fffd9" />
                    <pointLight position={[0, -5, 5]} intensity={2.0} color="#00C853" distance={15} />

                    <LiquidBlob />

                    {/* Poeira estelar sutil em volta do líquido magnético */}
                    <Sparkles count={120} scale={15} size={3} speed={0.5} opacity={0.6} color="#0cf2cd" />

                    <ContactShadows
                        position={[0, -4.5, 0]}
                        opacity={0.5}
                        scale={18}
                        blur={3.5}
                        far={12}
                        color="#01120f"
                    />

                    {/* Rotação macia para expor todos os ângulos das deformações líquidas para o usuário */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={0.8}
                        maxPolarAngle={Math.PI / 2 + 0.15}
                        minPolarAngle={Math.PI / 2 - 0.15}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

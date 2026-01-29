"use client";


import React, { useMemo, useRef, useState, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Float, Environment, Html, useProgress } from "@react-three/drei";
import HomeContent from "@/app/components/HomeContent";


const INK_PALETTE = {
    paper: "#f2efe6",
    inkDeep: "#1a1a1a",
    inkMid: "#5c5c5c",
    wash: "#d9d4c7",
    fog: "#f2efe6",
};

// --- Loader ---
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none w-64">
                <div className="text-zinc-600 font-calligraphy text-2xl tracking-[0.3em] mb-2 animate-pulse whitespace-nowrap">
                    墨韵生成中
                </div>
                <div className="text-zinc-400 font-sans text-xs tracking-widest uppercase mb-2">
                    Generating Ink Rhythm...
                </div>
                <div className="w-full h-[1px] bg-zinc-300 relative overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-zinc-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-zinc-400 font-sans text-[10px] mt-1 tracking-widest opacity-60">
                    {progress.toFixed(0)}%
                </div>
            </div>
        </Html>
    );
}

// --- 改动核心：全新的仰拍开场相机 ---

// 1. 起始位置：贴近地面 (y=0.8)，靠近中心 (z=8)
const CAMERA_START_POS = [0, 0.8, 8] as const;
// 2. 结束位置：拉远到正常的平视视角
const CAMERA_END_POS = new THREE.Vector3(0, 6, 32);

// 3. 起始观察点：高高仰望天空 (y=60)
const LOOK_AT_START = new THREE.Vector3(0, 60, 0);
// 4. 结束观察点：平视前方 (y=5)
const LOOK_AT_END = new THREE.Vector3(0, 6, 0);

function IntroCamera({ onDone }: { onDone: () => void }) {
    const { camera } = useThree();
    const currentLookAt = useMemo(() => LOOK_AT_START.clone(), []);
    const doneRef = useRef(false);
    const progressRef = useRef(0);

    useEffect(() => {
        camera.position.set(...CAMERA_START_POS);
        camera.lookAt(LOOK_AT_START);
    }, [camera]);

    useFrame((state, delta) => {
        const speed = delta * 0.5;

        // 相机 lerp
        state.camera.position.lerp(CAMERA_END_POS, speed);
        currentLookAt.lerp(LOOK_AT_END, speed);
        state.camera.lookAt(currentLookAt);

        // 用时间累计一个“进度”，大概 2.8s~3.5s 就算完成（你可以调）
        progressRef.current += delta;
        if (!doneRef.current && progressRef.current > 3.2) {
            doneRef.current = true;
            onDone();
        }
    });

    return null;
}


function InkLeafGeometry() {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.quadraticCurveTo(0.2, 0.5, 0.25, 1.5);
        s.quadraticCurveTo(0.3, 3.5, 0.0, 5.5);
        s.quadraticCurveTo(-0.3, 3.5, -0.25, 1.5);
        s.quadraticCurveTo(-0.2, 0.5, 0, 0);
        return s;
    }, []);
    return <shapeGeometry args={[shape, 8]} />;
}

function LeafCluster({ position, baseRotation, scale, opacity, windRef, count }: any) {
    const groupRef = useRef<THREE.Group>(null!);
    const phase = useMemo(() => Math.random() * 10, []);

    useFrame((state) => {
        if (!windRef.current || windRef.current < 0.01) return;
        const t = state.clock.elapsedTime;
        const wind = windRef.current;
        groupRef.current.rotation.x = baseRotation[0] + Math.sin(t * 20 + phase) * wind * 0.1;
        groupRef.current.rotation.z = baseRotation[2] + Math.cos(t * 15 + phase) * wind * 0.1;
    });

    return (
        <group ref={groupRef} position={position} rotation={baseRotation}>
            {Array.from({ length: count }).map((_, li) => {
                const spreadAngle = (li - (count - 1) / 2) * 0.4;
                return (
                    <mesh key={li} rotation={[spreadAngle * 0.3, 0, spreadAngle]} scale={scale * (0.9 + Math.random() * 0.2)} position={[0, li * 0.1, 0.05]}>
                        <InkLeafGeometry />
                        <meshLambertMaterial color={INK_PALETTE.inkDeep} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                )
            })}
        </group>
    );
}

function CurvedBamboo({ pos, height, opacity, curveStrength, taperScale = 1, windRef }: any) {
    const segments = 12;
    const segH = height / segments;

    return (
        <group position={[pos[0], -5, pos[2]]}>
            {Array.from({ length: segments }).map((_, i) => {
                const curveOffset = Math.pow(i / segments, 2) * curveStrength;
                const taper = (1 - i / segments * 0.5) * taperScale;
                const leafCount = Math.floor(1 + Math.random() * 3);

                const leafY = i * segH + 0.4;        // 叶簇在这段里的高度（相对竹子底部）
                const allowLeaves = leafY <= 35;

                return (
                    <group key={i} position={[curveOffset, i * segH, 0]} rotation={[0, 0, (i / segments) * curveStrength * 0.08]}>
                        <mesh position={[0, segH / 2, 0]}>
                            <cylinderGeometry args={[0.16 * taper, 0.2 * taper, segH * 0.98, 8]} />
                            <meshLambertMaterial color={INK_PALETTE.inkDeep} transparent opacity={opacity} />
                        </mesh>

                        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 0.8, 1]}>
                            <torusGeometry args={[0.22 * taper, 0.06 * taper, 6, 12]} />
                            <meshLambertMaterial color={INK_PALETTE.inkDeep} transparent opacity={opacity * 1.3} />
                        </mesh>

                        {allowLeaves && i > 1 && Math.random() > 0.4 && (
                            <LeafCluster
                                position={[0, 0.4, 0]}
                                baseRotation={[0.3 + Math.random() * 0.2, Math.random() * Math.PI, 0.7]}
                                scale={0.4 + Math.random() * 0.5}
                                opacity={opacity * 0.9}
                                windRef={windRef}
                                count={leafCount}
                            />
                        )}

                    </group>
                );
            })}
        </group>
    );
}

function InteractiveForest({ children, windRef }: { children: React.ReactNode, windRef: React.MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        const mx = state.mouse.x;
        // 只有当相机飞到比较近的地方时，才开启鼠标视差
        if (state.camera.position.z < 40 && state.camera.position.y > 4) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.08, 0.05);
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, -mx * 2.5, 0.05);
        }

        if (windRef.current > 0) {
            windRef.current = THREE.MathUtils.lerp(windRef.current, 0, delta * 2);
        }
    });
    return <group ref={groupRef}>{children}</group>;
}

function AnimatedInkRock({ position, scale, opacity = 0.8 }: any) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [delay] = useState(() => Math.random() * 1.5);

    const safePos = position || [0, -10, 0];
    const startY = safePos[1] - 2.4;
    const targetY = safePos[1];

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (t < delay) {
            if (meshRef.current) meshRef.current.visible = false;
            return;
        }

        if (meshRef.current) {
            meshRef.current.visible = true;
            const progress = Math.min((t - delay) / 3, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            meshRef.current.position.y = startY + (targetY - startY) * ease;
            const mat = meshRef.current.material as THREE.MeshLambertMaterial;
            if (mat) mat.opacity = opacity * ease;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[safePos[0], startY, safePos[2]]}
            rotation={[Math.random(), Math.random(), Math.random()]}
            scale={[scale, scale * 0.7, scale * 1.3]}
        >
            <dodecahedronGeometry args={[1, 0]} />
            <meshLambertMaterial color={INK_PALETTE.inkDeep} transparent opacity={0} />
        </mesh>
    );
}

export default function InkBambooScene() {

    // const [showLoader, setShowLoader] = useState(true);

    // useEffect(() => {
    //     const t = setTimeout(() => setShowLoader(false), 900); // 强制显示 0.9s
    //     return () => clearTimeout(t);
    // }, []);
    const [introDone, setIntroDone] = useState(false);
    const windRef = useRef(0);

    const bambooElements = useMemo(() => {
        return Array.from({ length: 180 }).map((_, i) => {
            const zPos = -Math.random() * 65;
            const distFactor = (zPos + 65) / 65;
            return {
                pos: [(Math.random() - 0.5) * 95, 0, zPos] as [number, number, number],
                height: 20 + Math.random() * 35,
                opacity: 0.1 + (distFactor * 0.85),
                curveStrength: (Math.random() - 0.5) * 7,
                taperScale: 0.6 + Math.random() * 0.7
            };
        });
    }, []);

    const rockElements = useMemo(() => {
        return Array.from({ length: 90 }).map((_, i) => {
            const pos = [(Math.random() - 0.5) * 90, -4.5 - Math.random() * 1.5, (Math.random() - 0.5) * 50] as [number, number, number];
            const scale = 1.5 + Math.random() * 5;
            const opacity = 0.3 + Math.random() * 0.6;
            return { position: pos, scale, opacity };
        })
    }, []);

    const handlePointerDown = () => {
        windRef.current = 1.8;
    };

    return (
        <div
            className="h-screen w-screen bg-[#f2efe6] overflow-hidden cursor-pointer"
            onPointerDown={handlePointerDown}
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
                
                .font-calligraphy {
                    font-family: 'Ma Shan Zheng', cursive;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .fade-in {
                    animation: fadeIn 2s ease-out forwards; /* 增加淡入时间到 2s */
                }
            `}</style>

            {!introDone && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-64">
                        <div className="text-zinc-600 font-calligraphy text-2xl tracking-[0.3em] mb-2 animate-pulse whitespace-nowrap">
                            墨韵生成中
                        </div>
                        <div className="text-zinc-400 font-sans text-xs tracking-widest uppercase mb-2">
                            Generating Ink Rhythm...
                        </div>
                        <div className="w-full h-[1px] bg-zinc-300 relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-zinc-600 w-[70%] opacity-70" />
                        </div>
                        <div className="text-zinc-400 font-sans text-[10px] mt-1 tracking-widest opacity-60">
                            Loading…
                        </div>
                    </div>
                </div>
            )}


            <div
                className="h-screen w-screen bg-[#f2efe6] overflow-hidden cursor-default"
                onPointerDown={handlePointerDown}
            >

                <Canvas className="animate-in fade-in" dpr={1}
                >


                    {/* 这里的 position 必须和 CAMERA_START_POS 一致，防止第一帧跳变 */}
                    <PerspectiveCamera makeDefault position={CAMERA_START_POS} fov={45} />
                    <IntroCamera onDone={() => setIntroDone(true)} />


                    <fog attach="fog" args={[INK_PALETTE.fog, 5, 65]} />

                    <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#d9d4c7" />
                    <directionalLight position={[10, 20, 10]} intensity={0.8} />
                    <ambientLight intensity={0.4} />

                    <Suspense fallback={<Loader />}>
                        <InteractiveForest windRef={windRef}>
                            <mesh position={[0, 20, -70]}>
                                <planeGeometry args={[400, 200]} />
                                <meshBasicMaterial color={INK_PALETTE.wash} transparent opacity={0.6} />
                            </mesh>

                            {bambooElements.map((b, i) => (
                                <CurvedBamboo key={i} {...b} windRef={windRef} />
                            ))}

                            {rockElements.map((r, i) => (
                                <AnimatedInkRock key={`rock-${i}`} {...r} />
                            ))}

                            <AnimatedInkRock position={[-22, -3.5, 15]} scale={9} opacity={0.9} />
                            <AnimatedInkRock position={[28, -4, 10]} scale={8} opacity={0.85} />
                            <AnimatedInkRock position={[0, -4.2, 20]} scale={6} opacity={0.7} />

                            {Array.from({ length: 25 }).map((_, i) => (
                                <mesh key={i} position={[0, -5 + i * 0.25, 25]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[250, 180]} />
                                    <meshBasicMaterial color={INK_PALETTE.fog} transparent opacity={0.55 - i * 0.02} depthWrite={false} />
                                </mesh>
                            ))}
                        </InteractiveForest>
                        <Environment preset="city" intensity={0.1} />
                    </Suspense>

                    <Float speed={0.2} rotationIntensity={0.01} floatIntensity={0.03} />

                    <Html fullscreen style={{ pointerEvents: "none" }}>
                        {introDone && (
                            <div className="w-full h-full overflow-y-auto pointer-events-auto">
                                <div className="-translate-y-15">
                                    <HomeContent variant="overlay" />
                                </div>
                            </div>
                        )}
                    </Html>



                </Canvas>
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-multiply"
                style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/handmade-paper.png')`, filter: 'contrast(1.2)' }}
            />

            <div className="absolute right-12 bottom-12 font-calligraphy text-4xl text-zinc-800 opacity-60 [writing-mode:vertical-rl] tracking-[0.5em] drop-shadow-sm">
                万竿烟雨
            </div>
            <div className="absolute left-12 bottom-12 font-calligraphy text-4xl text-zinc-800 opacity-60 [writing-mode:vertical-rl] tracking-[0.5em] drop-shadow-sm">
                点击画面惊风雨 click
            </div>
        </div>
    );
}
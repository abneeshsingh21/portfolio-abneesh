import { useRef, useState } from 'react'
import { Text, Float, RoundedBox, Cylinder, Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { playClick } from '../utils/sound'

// Reusable Holographic Card with 3D Tilt
function ProjectDisplay({ position, title, description, color, detailContent, children }) {
    const [hovered, setHover] = useState(false)
    const setActiveSection = useStore(state => state.setActiveSection)
    const cardRef = useRef()
    
    // Smooth Tilt Animation
    useFrame((state) => {
        if (!cardRef.current) return
        
        const targetScale = hovered ? 1.15 : 1
        cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
        
        if (hovered) {
             // Subtle "look at mouse" tilt
             // state.mouse.x is -1 to 1. We want small rotation.
             const tiltX = -state.mouse.y * 0.2
             const tiltY = state.mouse.x * 0.2
             cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, tiltX, 0.1)
             cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, tiltY, 0.1)
        } else {
             // Reset rotation
             cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, 0, 0.1)
             cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, 0, 0.1)
        }
    })

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                <group 
                    ref={cardRef}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        playClick(); 
                        setActiveSection(detailContent) 
                    }}
                    onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }} 
                    onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                >
                   {/* 3D Visual Content (Floating above card) - Centered & Raised for Visibility */}
                   <group position={[0, 0.5, 0.5]}>
                        {children}
                   </group>
                   
                   {/* Holographic Glass Base */}
                   <group position={[0, 0, 0]}>
                        {/* Glass Pane - Tighter Size */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[4.2, 2.8, 0.1]} />
                            <meshPhysicalMaterial 
                                color={color} 
                                transmission={0.6} // Glass like
                                opacity={0.3}
                                transparent
                                roughness={0}
                                metalness={0.8}
                                thickness={0.5}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        {/* Glowing Edge Frame - Dimmed for less bloom */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[4.25, 2.85, 0.08]} />
                            <meshBasicMaterial color={color} transparent opacity={0.02} />
                            <Edges scale={1} threshold={15} color={color} renderOrder={1000} />
                             <meshBasicMaterial color={color} transparent opacity={0.2} toneMapped={false} />
                        </mesh>

                        {/* Title & Info - Anchored to prevent overlap - MOVED FORWARD & DOWN */}
                        <Text 
                            fontSize={0.28} 
                            color="#fff" 
                            position={[0, -0.3, 0.6]}  // Moved UP to give space below
                            anchorX="center" 
                            anchorY="top" 
                            maxWidth={3.8}
                            textAlign="center"
                        >
                            {title.toUpperCase()}
                        </Text>
                         <Text 
                            fontSize={0.18}
                            color="#e0e0e0" 
                            position={[0, -1.1, 0.6]} // Moved DOWN (Gap is now 0.8)
                            anchorX="center" 
                            anchorY="top" 
                            maxWidth={3.8}
                            textAlign="center"
                        >
                            {description}
                        </Text>
                   </group>
                </group>
            </Float>
        </group>
    )
}

function PipeLineViz() {
    return (
        <group>
             {/* Simple pipeline blocks */}
            <RoundedBox args={[0.5, 0.5, 0.5]} position={[-1.5, 0, 0]} radius={0.1}>
                 <meshStandardMaterial color="#333" />
            </RoundedBox>
            <Cylinder args={[0.05, 0.05, 1]} rotation={[0, 0, 1.57]} position={[-0.75, 0, 0]}>
                <meshStandardMaterial color="cyan" />
            </Cylinder>
            <RoundedBox args={[0.8, 0.8, 0.8]} position={[0, 0, 0]} radius={0.1}>
                 <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
            </RoundedBox>
             <Cylinder args={[0.05, 0.05, 1]} rotation={[0, 0, 1.57]} position={[0.75, 0, 0]}>
                <meshStandardMaterial color="cyan" />
            </Cylinder>
            <RoundedBox args={[0.5, 0.5, 0.5]} position={[1.5, 0, 0]} radius={0.1}>
                 <meshStandardMaterial color="#333" />
            </RoundedBox>
            
            <Text position={[0, 1, 0]} fontSize={0.2} color="cyan">96.46% ACCURACY</Text>
        </group>
    )
}

function AssistantHologram() {
    const ref = useRef()
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.02
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2
        }
    })
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#bd00ff" wireframe />
        </mesh>
    )
}

function CommandRoom() {
    return (
        <group>
            {/* Simple screens */}
            <RoundedBox args={[2, 1.2, 0.1]} radius={0.05}>
                <meshStandardMaterial color="#001133" />
            </RoundedBox>
             <RoundedBox args={[0.8, 0.6, 0.1]} radius={0.05} position={[-1.5, 0.5, 0.5]} rotation={[0, 0.5, 0]}>
                <meshStandardMaterial color="#002244" />
            </RoundedBox>
             <RoundedBox args={[0.8, 0.6, 0.1]} radius={0.05} position={[1.5, 0.5, 0.5]} rotation={[0, -0.5, 0]}>
                <meshStandardMaterial color="#002244" />
            </RoundedBox>
            <Text position={[0,0,0.06]} fontSize={0.1}>N-CIIA MONITORING</Text>
        </group>
    )
}

export default function Projects() {
    return (
        <group>
            {/* PROJECT 1: Fake News - Right Side Z=-85 (Moved back) */}
            <ProjectDisplay 
                position={[5, 0, -85]} 
                title="Hybrid Fake News Detector" 
                description="Flagship Project | 96.46% Accuracy"
                color="cyan"
                detailContent={{
                    title: "Hybrid Fake News Detector",
                    subtitle: "Flagship Project",
                    body: "**A production-ready fake news detection system designed to operate in real-world conditions.**\n\n**What I Built:**\n- A hybrid verification pipeline combining 5-model ensemble (Logistic Regression, SGD, Calibrated SVC, Random Forest, Gradient Boosting).\n- AI-based credibility analysis and real-time news verification APIs.\n\n**Key Highlights:**\n- TF-IDF with trigrams and 8000 features.\n- Achieved 96.46% accuracy.\n- Explainable AI outputs for transparency.\n- Streamlit UI + FastAPI backend + SQLite database.\n\n**Why It Matters:** Demonstrates end-to-end ML engineering, from data handling to deployment.",
                    tags: ["ML Ensemble", "FastAPI", "Explainable AI"]
                }}
            >
                <PipeLineViz />
            </ProjectDisplay>

            {/* PROJECT 2: Aarii - Left Side Z=-115 (Moved back) */}
            <ProjectDisplay 
                position={[-5, 0, -115]} 
                title="Aarii: AI Voice Assistant" 
                description="Holographic Assistant | Local LLM"
                color="#bd00ff"
                detailContent={{
                    title: "Aarii Voice Assistant",
                    subtitle: "Full Stack Conversational AI",
                    body: "**A full-stack conversational AI assistant designed for flexibility, extensibility, and real usage.**\n\n**What I Built:**\n- Flask backend with secure API handling.\n- React frontend with holographic visualization.\n- Support for both local and cloud AI models.\n\n**Focus Areas:**\n- Clean architecture and environment-based configuration.\n- Friendly but powerful interaction design.",
                    tags: ["Generative AI", "React + Flask", "Voice Interaction"]
                }}
            >
                <AssistantHologram />
            </ProjectDisplay>

            {/* PROJECT 3: N-CIIA - Right Side Z=-145 (Moved further back) */}
            <ProjectDisplay 
                position={[5, 0, -145]} 
                title="N-CIIA Cyber Intel" 
                description="National Cyber Investigation"
                color="orange"
                detailContent={{
                    title: "N-CIIA",
                    subtitle: "National Cyber Investigation & Intelligence Assistant",
                    body: "**A large-scale cybersecurity intelligence platform focused on lawful detection, analysis, and evidence structuring.**\n\n**System Design Focus:**\n- C++ for packet capture and forensics.\n- Python for machine learning analysis.\n- Go/Rust for high-performance microservices.\n- TypeScript for frontend dashboards.\n\n**Core Values:** Reliability, Scalability, and Ethical Boundaries.",
                    tags: ["Cybersecurity", "Microservices", "System Design"]
                }}
            >
                <CommandRoom />
            </ProjectDisplay>
        </group>
    )
}

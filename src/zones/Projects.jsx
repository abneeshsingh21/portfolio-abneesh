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

function CompilerBlocks() {
    const ref = useRef()
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.015
            ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })
    return (
        <group ref={ref} position={[0, 0.2, 0]}>
            <RoundedBox args={[0.5, 0.5, 0.5]} position={[-0.8, 0, 0]} radius={0.1}>
                 <meshStandardMaterial color="#00ffcc" wireframe />
            </RoundedBox>
            <Text position={[-0.8, 0.45, 0]} fontSize={0.15} color="#00ffcc" anchorX="center">English AST</Text>
            
            <Cylinder args={[0.02, 0.02, 0.6]} rotation={[0, 0, 1.57]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#fff" />
            </Cylinder>
            
            <RoundedBox args={[0.6, 0.6, 0.6]} position={[0.8, 0, 0]} radius={0.1}>
                 <meshStandardMaterial color="#00ffcc" emissive="#002222" emissiveIntensity={0.5} />
            </RoundedBox>
            <Text position={[0.8, 0.5, 0]} fontSize={0.15} color="#00ffcc" anchorX="center">Bytecode</Text>
        </group>
    )
}

export default function Projects() {
    return (
        <group>
            {/* PROJECT 1: Fake News - Right Side Z=-85 */}
            <ProjectDisplay 
                position={[5, 0, -85]} 
                title="Hybrid Fake News Detector" 
                description="5-Model Ensemble | 96.46% Accuracy"
                color="cyan"
                detailContent={{
                    title: "Hybrid Fake News Detector",
                    subtitle: "Real-Time Fact Checking Pipeline",
                    body: "**A blazing fast, production-ready fake news detection system designed for real-world impact.**\n\n**What I Built:**\n- A hybrid verification pipeline utilizing a 5-model deep learning ensemble.\n- Intelligent credibility analysis using real-time API integrations.\n\n**Key Metrics:**\n- Engineered 8000 TF-IDF features.\n- Achieved an astounding **96.46% accuracy**.\n- Streamlit UI powered by a FastAPI & SQLite backend.\n\n**Why It Matters:** Showcases ability to handle massive data, train optimization, and deploy end-to-end ML APIs.",
                    tags: ["ML Ensemble", "FastAPI", "Explainable AI"]
                }}
            >
                <PipeLineViz />
            </ProjectDisplay>

            {/* PROJECT 2: Aarii - Left Side Z=-115 */}
            <ProjectDisplay 
                position={[-5, 0, -115]} 
                title="IRA / Aarii: AI Voice Assistant" 
                description="Holographic Assistant | Local LLM"
                color="#bd00ff"
                detailContent={{
                    title: "IRA / Aarii Voice Assistant",
                    subtitle: "A True Human-like Digital Companion",
                    body: "**A full-stack conversational AI assistant designed with emotion-awareness, contextual memory, and task execution.**\n\n**What I Built:**\n- Flask backend integrating Groq APIs for ultra-fast response times.\n- React frontend rendering real-time holographic visualizations.\n- Seamless dual-support for local inference and cloud AI models.\n\n**Focus Areas:**\n- Emulating human-like interaction loops.\n- Memory-backed personalized systems.",
                    tags: ["Generative AI", "Local LLMs", "React + Flask"]
                }}
            >
                <AssistantHologram />
            </ProjectDisplay>

            {/* PROJECT 3: N-CIIA - Right Side Z=-145 */}
            <ProjectDisplay 
                position={[5, 0, -145]} 
                title="N-CIIA Cyber Intel" 
                description="National Cyber Investigation Platform"
                color="orange"
                detailContent={{
                    title: "N-CIIA",
                    subtitle: "High-Performance Cybersecurity Intelligence",
                    body: "**A massive, large-scale cybersecurity intelligence platform built for deep packet capture, digital forensics, and threat analysis.**\n\n**System Design Focus:**\n- **C++** applied for raw packet capture speeds and forensics.\n- **Go / Rust** integrated serving high-performance microservices.\n- **Python** utilized for intelligent ML threat analysis.\n\n**Core Values:** Multi-language system architecture demonstrating sheer performance and systems-level security integration.",
                    tags: ["Cybersecurity", "Multi-Language", "System Design"]
                }}
            >
                <CommandRoom />
            </ProjectDisplay>

            {/* PROJECT 4: EPL - Left Side Z=-175 (Placed at the end) */}
            <ProjectDisplay 
                position={[-5, 0, -175]} 
                title="EPL (English Prog. Lang)" 
                description="Creator & Architect | Python & C Core"
                color="#00ffcc"
                detailContent={{
                    title: "EPL (English Programming Language)",
                    subtitle: "A Natural Language Compiler Built from Scratch",
                    body: "**A production-level programming language interpreted via natural English syntax.**\n\n**What I Built:**\n- Custom Lexer and Parser written in Python and C.\n- Robust language server protocol (LSP) integration.\n- Seamless translation from natural English to executable Bytecode.\n\n**Why It Stands Out:** Building a language from the ground up demonstrates extreme system-level understanding of memory, AST parsing, and execution. It's a completely unique asset.",
                    tags: ["Compilers", "Python", "C Architecture"]
                }}
            >
                <CompilerBlocks />
            </ProjectDisplay>
        </group>
    )
}

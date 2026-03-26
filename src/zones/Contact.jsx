import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, MeshDistortMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'
import { playClick } from '../utils/sound'

function ContactLink({ position, label, onClick }) {
    const [hovered, setHover] = useState(false)
    return (
        <group position={position} 
               onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }} 
               onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
               onClick={(e) => { e.stopPropagation(); onClick && onClick() }}
               scale={hovered ? 1.2 : 1}
        >
            <Text 
                fontSize={0.3} 
                color={hovered ? "#00f3ff" : "white"} 
                anchorX="center"
            >
                {label}
            </Text>
        </group>
    )
}

function SignalRing({ delay, color }) {
    const ref = useRef()
    
    useFrame((state) => {
        if (!ref.current) return
        const t = (state.clock.elapsedTime + delay) % 4 // 4 second loop
        
        // Scale moves from 0 to 15
        const scale = t * 4
        ref.current.scale.set(scale, scale, scale)
        
        // Opacity fades out as it gets larger
        // Opacity is 1 at t=0, 0 at t=4
        const opacity = 1 - (t / 4)
        if (ref.current.material) {
            ref.current.material.opacity = Math.max(0, opacity * 0.5)
        }
    })
    
    return (
        <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
    )
}

export default function Contact() {
    const beaconRef = useRef()
    const lightRef = useRef()
    const setActiveSection = useStore(state => state.setActiveSection)
    const [transmitting, setTransmitting] = useState(false)
    
    useFrame((state) => {
        if(beaconRef.current) {
            beaconRef.current.rotation.y += 0.005
        }
        // Pulse light intensity
        if (lightRef.current) {
            lightRef.current.intensity = transmitting ? 
                5 + Math.sin(state.clock.elapsedTime * 20) * 2 : // Fast flicker if transmitting
                2 + Math.sin(state.clock.elapsedTime * 2) * 0.5   // Slow pulse normally
        }
    })

    const handleTransmit = (contentObj) => {
        playClick()
        setTransmitting(true)
        setActiveSection(contentObj || {
            title: "ESTABLISH UPLINK",
            subtitle: "Open Channels",
            body: "Select a specific communication protocol below to connect with me.\n\n- **Email**: singhabneesh250@gmail.com\n- **LinkedIn**: linkedin.com/in/abneesh-singh001\n- **GitHub**: github.com/abneeshsingh21",
            tags: ["Comms", "Network"]
        })
        // Reset transmitting visual after 2 seconds
        setTimeout(() => setTransmitting(false), 2000)
    }

    return (
        <group position={[0, -15, -350]}>
            {/* The Beacon Tower */}
            <mesh position={[0, -5, 0]} ref={beaconRef}>
                <cylinderGeometry args={[1, 2, 10, 8]} />
                <meshStandardMaterial color="#111" wireframe={true} emissive="#00f3ff" emissiveIntensity={0.2} />
            </mesh>
            
            {/* The Light Source */}
            <mesh position={[0, 0.5, 0]} onClick={(e) => { e.stopPropagation(); handleTransmit() }}
                  onPointerOver={() => document.body.style.cursor = 'pointer'}
                  onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                 <MeshDistortMaterial 
                    color={transmitting ? "#ffffff" : "#00f3ff"} 
                    emissive={transmitting ? "#ffffff" : "#00f3ff"} 
                    emissiveIntensity={2}
                    speed={5}
                    distort={0.3}
                />
            </mesh>
            <pointLight ref={lightRef} position={[0, 2, 0]} color="#00f3ff" distance={20} />

            {/* Signal Waves */}
            <SignalRing delay={0} color="#00f3ff" />
            <SignalRing delay={1.3} color="#00f3ff" />
            <SignalRing delay={2.6} color="#00f3ff" />

            {/* Text Overlay */}
            {transmitting && (
                 <Html position={[0, 4, 0]} center>
                    <div style={{ color: '#00f3ff', fontFamily: 'monospace', background: 'rgba(0,0,0,0.8)', padding: '5px 10px', border: '1px solid #00f3ff' }}>
                        SIGNAL TRANSMITTING...
                    </div>
                </Html>
            )}

            {/* Links */}
            <Float speed={3} rotationIntensity={0} floatIntensity={0.5}>
                <group position={[0, 3, 0]}>
                    <Text fontSize={0.6} color="white" position={[0, 1, 0]}>ESTABLISH UPLINK</Text>
                    
                    <ContactLink position={[0, 0, 0]} label="Email Protocol" onClick={() => handleTransmit({
                        title: "EMAIL PROTOCOL",
                        subtitle: "Secure Inbox",
                        body: "Ready to collaborate on the next big breakthrough? Email me directly.\n\nsinghabneesh250@gmail.com\n\n**I am driven by one goal: to build intelligent systems that actually work in the real world.**",
                        tags: ["Direct Contact", "Business"]
                    })} />
                    <ContactLink position={[0, -0.6, 0]} label="LinkedIn Node" onClick={() => handleTransmit({
                        title: "LINKEDIN NODE",
                        subtitle: "Professional Network",
                        body: "Connect with me to stay updated on my latest AI architectures and professional journey.\n\nlinkedin.com/in/abneesh-singh001",
                        tags: ["Networking", "Career"]
                    })} />
                    <ContactLink position={[0, -1.2, 0]} label="GitHub" onClick={() => handleTransmit({
                        title: "GITHUB",
                        subtitle: "Open Source Codebase",
                        body: "Explore my source code, open-source projects, and advanced algorithms.\n\ngithub.com/abneeshsingh21",
                        tags: ["Open Source", "Code"]
                    })} />
                </group>
            </Float>
        </group>
    )
}

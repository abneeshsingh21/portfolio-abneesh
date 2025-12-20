import { useRef, useState, useMemo } from 'react'
import { Text, Float, Html, Tube, Sphere, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { playClick } from '../utils/sound'

const timelineData = [
  { 
      year: '2022', 
      title: 'Foundation Phase', 
      desc: 'Building Strong Fundamentals', 
      body: "**Built strong fundamentals** in computer science and developed deep interest in AI, ML, and system-level engineering.\n\n- Explored programming beyond syllabus requirements.\n- Mastered Core CS concepts (OS, Networks, DBMS).",
      x: -4, z: 0, color: '#00f3ff' 
  },
  { 
      year: '2023', 
      title: 'Skill Expansion', 
      desc: 'Machine Learning & Pipelines', 
      body: "**Started building machine learning models independently**.\n\n- Learned full ML pipelines, not just algorithms.\n- Gained hands-on experience with Python, databases, and backend systems.\n- Moved beyond basic tutorials to complex problem solving.",
      x: 4, z: -25, color: 'cyan' 
  },
  { 
      year: '2024', 
      title: 'Product-Oriented', 
      desc: 'Deployment & Real World', 
      body: "**Shifted focus from academic projects to production-grade systems**.\n\n- Built advanced ML applications with deployment and UI.\n- Explored explainable AI and real-world constraints.\n- Focus on reliability and user experience.",
      x: -3, z: -50, color: '#bd00ff' 
  },
  { 
      year: '2025', 
      title: 'Advanced Systems', 
      desc: 'Specialization & Leadership', 
      body: "**Completed ML internship at ImaginXP – CollegeDekho**.\n\n- Built and deployed the Hybrid Fake News Detector.\n- Developed AI assistants and cybersecurity intelligence system concepts.\n- Focused on scalability, accuracy, and system architecture.",
      x: 0, z: -75, color: 'orange' 
  },
]

function TimeNode({ item, position, onClick, texture }) {
    const [hovered, setHover] = useState(false)
    const ref = useRef()
    
    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y += 0.005
            ref.current.scale.setScalar(hovered ? 1.3 : 1)
        }
    })

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Visual Node - Textured Planet */}
                <mesh 
                    ref={ref}
                    castShadow 
                    receiveShadow
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        playClick();
                        onClick() 
                    }}
                    onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }} 
                    onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                >
                    <sphereGeometry args={[0.9, 64, 64]} />
                    <meshStandardMaterial 
                        map={texture}
                        bumpMap={texture}
                        bumpScale={0.5} // Deeper craters
                        color={customColor(item.year)}
                        emissive={item.color}
                        emissiveIntensity={hovered ? 0.2 : 0} // Only glow on hover, otherwise realistic shading
                        roughness={0.7}
                        metalness={0.1}
                    />
                </mesh>
                
                {/* Vertical Marker Line */}
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 4]} />
                    <meshBasicMaterial color={item.color} transparent opacity={0.2} />
                </mesh>

                <group position={[item.x < 0 ? -2.8 : 2.8, 0.5, 0]}>
                     {/* Holographic Background Plate */}
                     <mesh position={[0, 0, -0.05]}>
                        <planeGeometry args={[3.5, 1.2]} />
                        <meshBasicMaterial 
                            color="#000" 
                            transparent 
                            opacity={0.6}
                            side={THREE.DoubleSide} 
                        />
                     </mesh>
                     <mesh position={[0, 0, -0.05]}>
                        <planeGeometry args={[3.55, 1.25]} />
                        <meshBasicMaterial color={item.color} wireframe transparent opacity={0.3} />
                     </mesh>

                     {/* Year (Big) - Centered in local group */}
                     <Text 
                        fontSize={0.6} 
                        color={hovered ? "#fff" : item.color}
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0.2, 0]}
                    >
                        {item.year}
                    </Text>
                    
                    {/* Title (Small) - Centered */}
                    <Text 
                        fontSize={0.25} 
                        color="white" 
                        anchorX="center" 
                        anchorY="middle"
                        position={[0, -0.2, 0]}
                        maxWidth={3}
                        textAlign="center"
                    >
                        {item.title}
                    </Text>
                </group>
                
                {/* Connector Line */}
                <mesh position={[item.x < 0 ? -1.25 : 1.25, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.02, 0.02, 2.5]} />
                    <meshBasicMaterial color={item.color} transparent opacity={0.5} />
                </mesh>
            </Float>
        </group>
    )
}

function customColor(year) {
    if(year === '2022') return '#ffffff' 
    if(year === '2023') return '#e0ffff'
    if(year === '2024') return '#f0eeff'
    return '#ffffff'
}

export default function Timeline() {
    const setActiveSection = useStore(state => state.setActiveSection)
    
    // Load Textures
    const [rock, ice, gas] = useTexture([
        '/textures/asteroid_rock.png',
        '/textures/ice_moon_cyan.png',
        '/textures/gas_giant_purple.png'
    ])
    
    const getTextures = (idx) => {
        if(idx === 0) return rock
        if(idx === 1) return ice
        if(idx === 2) return gas
        return rock
    }

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            timelineData.map(item => new THREE.Vector3(item.x, 0, item.z)),
            false,
            'catmullrom',
            0.5
        )
    }, [])

    return (
        <group position={[0, 0, -200]}>
            {/* Connecting Tube */}
            <Tube args={[curve, 64, 0.1, 8, false]}>
                 <meshStandardMaterial 
                    color="#222" 
                    emissive="#00f3ff" 
                    emissiveIntensity={0.2} 
                    transparent 
                    opacity={0.6} 
                    wireframe={false}
                 />
            </Tube>

            {/* Nodes */}
            {timelineData.map((item, index) => (
                <TimeNode 
                    key={index} 
                    item={item} 
                    position={[item.x, 0, item.z]} 
                    texture={getTextures(index)}
                    onClick={() => setActiveSection({
                        title: item.title,
                        subtitle: item.year,
                        body: item.body,
                        tags: ["Timeline", item.year]
                    })} 
                />
            ))}
            
            <Text position={[0, 7, 0]} fontSize={2.5} color="white" anchorX="center" letterSpacing={0.2} outlineWidth={0.05} outlineColor="#00f3ff">
                TIMELINE //
            </Text>
        </group>
    )
}

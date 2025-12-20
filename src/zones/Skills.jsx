import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Html, Billboard, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'

// Categorized Data for organized rings
const skillGroups = [
  {
    category: "Languages & Core",
    radius: 4,
    items: [
      { name: 'JavaScript', desc: 'ES6+, Async/Await, Functional Patterns.' },
      { name: 'TypeScript', desc: 'Strict typing for scalable apps.' },
      { name: 'Python', desc: 'Data Science & Automation.' },
      { name: 'C++', desc: 'System-level high performance.' },
    ]
  },
  {
    category: "Backend & Data",
    radius: 6.5,
    items: [
      { name: 'Node.js', desc: 'Event-driven scalable backend.' },
      { name: 'SQL', desc: 'Complex querying and schema design.' },
      { name: 'Docker', desc: 'Containerization & Microservices.' },
      { name: 'GraphQL', desc: 'Efficient data fetching.' },
    ]
  },
  {
    category: "Frontend & Creative",
    radius: 9,
    items: [
      { name: 'React', desc: 'Component architecture & hooks.' },
      { name: 'Three.js', desc: '3D WebGL experiences.' },
      { name: 'Next.js', desc: 'SSR & performance optimization.' },
      { name: 'Tailwind', desc: 'Modern responsive styling.' },
    ]
  }
]

function SkillNode({ skill, position, color }) {
  const [hovered, setHover] = useState(false)
  const setActiveSection = useStore(state => state.setActiveSection)
  
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group 
            onClick={(e) => { e.stopPropagation(); setActiveSection('SKILLS') }}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }} 
            onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
        >
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[hovered ? 0.35 : 0.25, 32, 32]} />
                <meshStandardMaterial 
                    color={hovered ? "#fff" : color} 
                    emissive={color} 
                    emissiveIntensity={hovered ? 2 : 0.5} 
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
            
            {/* Billboard ensures text faces camera and is never backwards */}
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false} 
            >
                <Text
                    position={[0, -0.6, 0]} 
                    fontSize={hovered ? 0.5 : 0.4}
                    color="white"
                    anchorX="center"
                    anchorY="top"
                    outlineWidth={0.03}
                    outlineColor={color}
                >
                    {skill.name}
                </Text>
            </Billboard>

            {/* Glassmorphic Tooltip */}
            {hovered && (
                <Html position={[0, 0, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                    <div className="glass-tooltip" style={{
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(12px)',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `1px solid ${color}`,
                        borderLeft: `4px solid ${color}`,
                        color: 'white',
                        width: '260px',
                        textAlign: 'left',
                        transform: 'translate3d(50px, -50px, 0)', 
                        boxShadow: `0 0 40px ${color}40`,
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 'bold', color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>{skill.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc', lineHeight: '1.4' }}>{skill.desc}</p>
                    </div>
                </Html>
            )}
        </group>
      </Float>
    </group>
  )
}

function OrbitalRing({ category, index }) {
  const groupRef = useRef()
  
  // Rotate each ring at different speeds and directions
  useFrame((state) => {
    if(!groupRef.current) return
    const speed = (index + 1) * 0.05 * (index % 2 === 0 ? 1 : -1)
    groupRef.current.rotation.y = state.clock.getElapsedTime() * speed
    // Add detail oscilaltion
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
  })

  // Distribute items evenly around circle
  const items = category.items
  const radius = category.radius
  const angleStep = (Math.PI * 2) / items.length

  return (
    <group ref={groupRef}>
        {/* Visible Orbital Path */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 64, 100]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>

        {items.map((item, i) => {
             const angle = i * angleStep
             const x = Math.cos(angle) * radius
             const z = Math.sin(angle) * radius
             const color = new THREE.Color().setHSL((index * 0.3) + (i * 0.1), 1, 0.5).getStyle()

             return (
                 <SkillNode 
                    key={item.name} 
                    skill={item} 
                    position={[x, 0, z]} 
                    color={color}
                 />
             )
        })}
    </group>
  )
}

export default function Skills() {
  return (
    // Moved deep to Z=-55 to give space from Planet, and Centered at X=0
    <group position={[0, -2, -55]}>
      {/* Central Hub Title */}
      <Float speed={1} floatIntensity={0.2}>
         <group position={[0, 0, 0]}>
             <mesh>
                 <sphereGeometry args={[0.5, 32, 32]} />
                 <meshBasicMaterial color="white" wireframe transparent opacity={0.1} />
             </mesh>
             <Text 
                position={[0, 2, 0]}
                fontSize={0.5} 
                color="#00f3ff" 
                anchorX="center" 
                letterSpacing={0.2}
            >
                CORE TECH
            </Text>
             <pointLight intensity={2} color="#00f3ff" distance={10} />
         </group>
      </Float>

      {/* Render Rings */}
      {skillGroups.map((group, i) => (
          <OrbitalRing key={i} category={group} index={i} />
      ))}
    </group>
  )
}

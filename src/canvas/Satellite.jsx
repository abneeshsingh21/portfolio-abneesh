import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

// A detailed 3D Satellite built from geometric primitives
export default function Satellite() {
  const groupRef = useRef()
  const panelLeftRef = useRef()
  const panelRightRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Slow orbital rotation
      groupRef.current.rotation.y = t * 0.03
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.05
    }
    // Solar panels track slight oscillation like they're adjusting
    if (panelLeftRef.current) {
      panelLeftRef.current.rotation.z = Math.sin(t * 0.5) * 0.02
    }
    if (panelRightRef.current) {
      panelRightRef.current.rotation.z = -Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <group position={[-15, 10, -70]} rotation={[0.3, 0.8, 0.1]}>
      <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={groupRef} scale={0.8}>
          
          {/* ===== MAIN BODY (Gold Thermal Blanket) ===== */}
          <mesh>
            <boxGeometry args={[1.5, 2, 1.5]} />
            <meshStandardMaterial 
              color="#ddaa00" 
              metalness={0.95} 
              roughness={0.15}
            />
          </mesh>
          
          {/* Body details - panels */}
          <mesh position={[0, 0, 0.76]}>
            <boxGeometry args={[1.2, 1.6, 0.05]} />
            <meshStandardMaterial color="#333333" roughness={0.8} />
          </mesh>
          
          {/* ===== SOLAR PANEL LEFT ===== */}
          <group ref={panelLeftRef} position={[-3.5, 0, 0]}>
            {/* Panel Arm */}
            <mesh position={[1.5, 0, 0]}>
              <boxGeometry args={[2, 0.1, 0.1]} />
              <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Solar Cells */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4, 2, 0.05]} />
              <meshStandardMaterial 
                color="#1a1a8a" 
                metalness={0.7} 
                roughness={0.2}
              />
            </mesh>
            {/* Cell Grid Lines */}
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
            <mesh position={[0, 0.5, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
            <mesh position={[0, -0.5, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
          </group>
          
          {/* ===== SOLAR PANEL RIGHT ===== */}
          <group ref={panelRightRef} position={[3.5, 0, 0]}>
            {/* Panel Arm */}
            <mesh position={[-1.5, 0, 0]}>
              <boxGeometry args={[2, 0.1, 0.1]} />
              <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Solar Cells */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4, 2, 0.05]} />
              <meshStandardMaterial 
                color="#1a1a8a" 
                metalness={0.7} 
                roughness={0.2}
              />
            </mesh>
            {/* Cell Grid Lines */}
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
            <mesh position={[0, 0.5, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
            <mesh position={[0, -0.5, 0.03]}>
              <boxGeometry args={[3.9, 0.02, 0.01]} />
              <meshBasicMaterial color="#444488" />
            </mesh>
          </group>
          
          {/* ===== COMMUNICATION DISH ===== */}
          <group position={[0, 1.5, 0]} rotation={[0.3, 0, 0]}>
            {/* Dish */}
            <mesh>
              <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                color="#eeeeee" 
                metalness={0.9} 
                roughness={0.1}
                side={2}
              />
            </mesh>
            {/* Feed Horn */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 0.5, 16]} />
              <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Struts */}
            <mesh rotation={[0, 0, 0.5]} position={[-0.2, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#555555" />
            </mesh>
            <mesh rotation={[0, 0, -0.5]} position={[0.2, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#555555" />
            </mesh>
          </group>
          
          {/* ===== ANTENNAS ===== */}
          <mesh position={[0.5, -1.2, 0]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
            <meshStandardMaterial color="#cccccc" metalness={0.8} />
          </mesh>
          <mesh position={[-0.4, -1.3, 0.3]} rotation={[0.3, 0.2, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
            <meshStandardMaterial color="#cccccc" metalness={0.8} />
          </mesh>
          
          {/* ===== STATUS LIGHTS ===== */}
          <mesh position={[0.7, 0.5, 0.76]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          <pointLight position={[0.7, 0.5, 0.8]} color="#00ff00" intensity={0.5} distance={2} />
          
          <mesh position={[0.7, 0.3, 0.76]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          
        </group>
      </Float>
      
      {/* Dramatic lighting */}
      <pointLight position={[5, 5, 5]} color="#ffffcc" intensity={2} distance={20} />
      <pointLight position={[-3, -2, 3]} color="#00aaff" intensity={0.5} distance={10} />
    </group>
  )
}

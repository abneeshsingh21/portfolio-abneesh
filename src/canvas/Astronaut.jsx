import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

// A stylized 3D Astronaut built from geometric primitives
export default function Astronaut() {
  const groupRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Gentle tumbling in zero-g
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.15
    }
  })

  return (
    <group position={[6, 3, -30]} rotation={[0.2, -0.5, 0.1]}>
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={groupRef} scale={0.5}>
          
          {/* ===== HELMET (Reflective Gold Visor) ===== */}
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial 
              color="#222222" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
          {/* Visor (Gold reflective) */}
          <mesh position={[0, 1.8, 0.25]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color="#ff9900" 
              metalness={1} 
              roughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
          
          {/* ===== TORSO (White Suit) ===== */}
          <mesh position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.5, 1, 8, 16]} />
            <meshStandardMaterial 
              color="#f0f0f0" 
              roughness={0.6} 
              metalness={0.1}
            />
          </mesh>
          
          {/* Backpack / Life Support */}
          <mesh position={[0, 0.5, -0.5]}>
            <boxGeometry args={[0.8, 1.2, 0.4]} />
            <meshStandardMaterial color="#cccccc" roughness={0.5} metalness={0.2} />
          </mesh>
          
          {/* ===== ARMS ===== */}
          {/* Left Arm */}
          <group position={[-0.7, 0.7, 0]} rotation={[0, 0, 0.5]}>
            <mesh>
              <capsuleGeometry args={[0.15, 0.8, 8, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
            </mesh>
            {/* Left Glove */}
            <mesh position={[0, -0.6, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>
          
          {/* Right Arm */}
          <group position={[0.7, 0.7, 0]} rotation={[0, 0, -0.3]}>
            <mesh>
              <capsuleGeometry args={[0.15, 0.8, 8, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
            </mesh>
            {/* Right Glove */}
            <mesh position={[0, -0.6, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
          </group>
          
          {/* ===== LEGS ===== */}
          {/* Left Leg */}
          <group position={[-0.25, -0.7, 0]} rotation={[0.2, 0, 0.1]}>
            <mesh>
              <capsuleGeometry args={[0.18, 1, 8, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
            </mesh>
            {/* Left Boot */}
            <mesh position={[0, -0.7, 0.1]}>
              <boxGeometry args={[0.25, 0.3, 0.4]} />
              <meshStandardMaterial color="#333333" roughness={0.7} />
            </mesh>
          </group>
          
          {/* Right Leg */}
          <group position={[0.25, -0.7, 0]} rotation={[-0.15, 0, -0.05]}>
            <mesh>
              <capsuleGeometry args={[0.18, 1, 8, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
            </mesh>
            {/* Right Boot */}
            <mesh position={[0, -0.7, 0.1]}>
              <boxGeometry args={[0.25, 0.3, 0.4]} />
              <meshStandardMaterial color="#333333" roughness={0.7} />
            </mesh>
          </group>
          
          {/* ===== DETAILS ===== */}
          {/* Flag Patch (Red stripe like NASA) */}
          <mesh position={[0.35, 0.8, 0.45]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.02]} />
            <meshBasicMaterial color="#cc0000" />
          </mesh>
          
          {/* Helmet Light */}
          <pointLight position={[0, 2.2, 0.5]} color="#ffffff" intensity={0.5} distance={3} />
          
        </group>
      </Float>
      
      {/* Ambient rim light for cinematic effect */}
      <pointLight position={[-2, 0, 2]} color="#00aaff" intensity={1} distance={8} />
    </group>
  )
}

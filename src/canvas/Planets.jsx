import { useRef, useMemo } from 'react'
import { Float, useTexture, shaderMaterial } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'

// --------------------------------------------------------
// Custom ATMOSPHERE SHADER (Fresnel Glow)
// --------------------------------------------------------
const PlanetAtmosphereMaterial = shaderMaterial(
  {
    color: new THREE.Color('#00aaff'),
    coefficient: 0.7,
    power: 2.0,
    intensity: 1.0
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 color;
    uniform float coefficient;
    uniform float power;
    uniform float intensity;
    varying vec3 vNormal;
    void main() {
      float viewDirectionW = normalize(vNormal).z;
      float fresnel = pow(1.0 - abs(viewDirectionW), power);
      
      // Softer fade out
      gl_FragColor = vec4(color, intensity * fresnel * coefficient);
    }
  `
)

extend({ PlanetAtmosphereMaterial })

// --------------------------------------------------------
// PLANET COMPONENT
// --------------------------------------------------------
// --------------------------------------------------------
// PLANET RING COMPONENT (Isolated to fix conditional Hook error)
// --------------------------------------------------------
function PlanetRing({ size, texturePath, color, rotationSpeed }) {
    const originalTexture = useTexture(texturePath)
    
    // Clone and configure texture (Solved: "value cannot be modified" lint error by configuring on creation)
    const texture = useMemo(() => {
        const t = originalTexture.clone()
        t.rotation = Math.PI / 2
        t.wrapS = THREE.RepeatWrapping
        t.wrapT = THREE.RepeatWrapping
        t.needsUpdate = true
        return t
    }, [originalTexture])

    const ringRef = useRef()
    
    useFrame((state) => {
        if (ringRef.current) {
             ringRef.current.rotation.z = state.clock.getElapsedTime() * (rotationSpeed * 0.2)
        }
    })

    return (
        <group rotation={[1.4, 0, 0]}>
            <mesh ref={ringRef} receiveShadow castShadow>
                <ringGeometry args={[size * 1.4, size * 2.8, 128]} />
                <meshStandardMaterial 
                    map={texture} 
                    alphaMap={texture} 
                    color={color || "#cba"} 
                    transparent 
                    opacity={0.9} 
                    side={THREE.DoubleSide}
                    roughness={0.8}
                    metalness={0.1}
                    emissive={color}
                    emissiveIntensity={0.05}
                />
            </mesh>
            {/* Inner faint ring for detail */}
            <mesh position={[0,0,0.01]}>
                <ringGeometry args={[size * 1.1, size * 1.35, 64]} />
                <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={0.15} 
                    side={THREE.DoubleSide} 
                    blending={THREE.AdditiveBlending} 
                />
            </mesh>
        </group>
    )
}

// --------------------------------------------------------
// PLANET COMPONENT
// --------------------------------------------------------
function Planet({ position, size, texturePath, ringTexturePath, type = "gas", color, ringColor, rotationSpeed = 0.005, atmosphereColor = "#00aaff" }) {
  const texture = useTexture(texturePath)
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
        meshRef.current.rotation.y = t * rotationSpeed
    }
  })
  
  return (
    <group position={position}>
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.1}>
            
            {/* 1. Planet Surface - Refined for Gas Giant "Matte" Look */}
            <mesh ref={meshRef} rotation={[0.2, 0, 0]} castShadow receiveShadow>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial 
                    map={texture}
                    color="#ffffff" 
                    roughness={1} /* Max roughness for gas giants */
                    metalness={0.0} 
                    envMapIntensity={0.1}
                    emissive={color}
                    emissiveIntensity={0.02} /* Very subtle glow */
                />
            </mesh>
            
            {/* 2. Atmospheric Rim - Sharper & Thinner for Realism */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[size, 64, 64]} />
                <planetAtmosphereMaterial 
                    color={atmosphereColor} 
                    transparent 
                    opacity={0.3} /* Reduced from 0.5 */
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide} /* Backside for outer rim */
                    coefficient={0.6} /* Higher coefficient for sharper rim */
                    power={6.0} /* Higher power = thinner rim */
                    intensity={1.0}
                />
            </mesh>

            {/* Ring System (Saturn) */}
            {type === "ringed" && ringTexturePath && (
                <PlanetRing 
                    size={size} 
                    texturePath={ringTexturePath} 
                    color={ringColor} 
                    rotationSpeed={rotationSpeed} 
                />
            )}
        </Float>
    </group>
  )
}

import { getAssetPath } from '../utils/assets'

export default function Planets() {
  return (
    <group>
        {/* Jupiter - Titan of the background */}
        <Planet 
            position={[100, 40, -200]}  // Further back, moved right
            size={55}                   // Massive size increase (was 12)
            texturePath={getAssetPath("/textures/jupiter_hd.jpg")} 
            color="#e3b98e" 
            atmosphereColor="#ffcc99" 
            type="gas"
            rotationSpeed={0.001}       // Slower rotation for scale
        />

        {/* Saturn - Looming Giant */}
        <Planet 
            position={[-120, -50, -250]} // Deep left background
            size={45}                    // Massive size increase (was 9)
            texturePath={getAssetPath("/textures/saturn_hd.jpg")} 
            ringTexturePath={getAssetPath("/textures/saturn_ring_alpha_hd.png")}
            color="#f4d03f" 
            atmosphereColor="#ebd7a0" 
            type="ringed"
            ringColor="#d4a017"
            rotationSpeed={0.001}
        />

        {/* Neptune - Distant Sentinel */}
        <Planet 
            position={[-80, 90, -300]}  // High left background
            size={35}                   // Massive size increase (was 8)
            texturePath={getAssetPath("/textures/neptune_hd.jpg")} 
            color="#3355ff"
            atmosphereColor="#0044ff" 
            type="gas"
            rotationSpeed={0.002}
        />
        
        {/* Specific Lighting for Planets to make them pop */}
        <pointLight position={[-80, 50, -50]} intensity={2.0} color="#ffddee" distance={500} decay={1} />
    </group>
  )
}

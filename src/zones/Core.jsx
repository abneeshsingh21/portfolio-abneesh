import { useRef, useState, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Float, Html, Text, Sparkles, useTexture, shaderMaterial } from '@react-three/drei'
import { useStore } from '../store'
import * as THREE from 'three'
import { playClick } from '../utils/sound'

const AtmosphereMaterial = shaderMaterial(
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
      gl_FragColor = vec4(color, intensity * fresnel * coefficient);
    }
  `
)

extend({ AtmosphereMaterial })

export default function Core() {
  const meshRef = useRef()
  const ringRef = useRef()
  const cloudRef = useRef()
  const setActiveSection = useStore(state => state.setActiveSection)

  // Load Textures
  const [earthMap, earthNormal, earthClouds, ringMapOriginal] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_clouds.png',
    '/textures/satellite_texture.png'
  ])

  // Clone and Configure textures safely within useMemo
  const { ringMap } = useMemo(() => {
    earthMap.anisotropy = 16
    
    const rMap = ringMapOriginal.clone()
    rMap.wrapS = THREE.RepeatWrapping
    rMap.wrapT = THREE.RepeatWrapping
    rMap.repeat.set(10, 1)
    rMap.rotation = Math.PI / 2
    
    return { ringMap: rMap }
  }, [earthMap, ringMapOriginal])
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // Planet Rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05
    }

    // Cloud Rotation (Independent)
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.07
    }
    
    // Ring Rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.02
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      {/* Introduction Text - Floating & Cinematic */}
      <group position={[0, 0.5, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            {/* Main Title */}
            <Text 
                position={[0, 1.5, 0]} 
                fontSize={0.2} 
                color="#00aaff" // Dimmed from #00f3ff
                anchorX="center" 
                anchorY="middle"
                letterSpacing={0.3}
            >
                WELCOME TO THE UNIVERSE OF
            </Text>
            <Text 
                position={[0, 0.6, 0]} 
                fontSize={1} 
                color="#d0d0d0" // Dimmed from white to reduce max bloom
                anchorX="center" 
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#0088aa" // Dimmed outline
            >
                ABNEESH SINGH
            </Text>
        </Float>
      </group>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* Adjusted Position: Centered [0, -2, -15] as per user request */}
        {/* Massive scale maintained to act as a "curtain" for the universe */}
        {/* Adjusted Position: Centered [0, -2, -15] as per user request */}
        {/* Massive scale maintained to act as a "curtain" for the universe */}
        <group position={[0, -2, -15]} 
               rotation={[0, -0.2, 0]}
               onClick={(e) => { 
                   e.stopPropagation(); 
                   playClick(); 
                   setActiveSection('CORE') 
               }}
               onPointerOver={() => { document.body.style.cursor = 'pointer' }} 
               onPointerOut={() => { document.body.style.cursor = 'auto' }}
        >
             
            {/* 1. Realistic Planet Surface - Earth-like */}
             <mesh ref={meshRef} castShadow receiveShadow>
                <sphereGeometry args={[3.5, 64, 64]} />
                <meshStandardMaterial 
                    map={earthMap}
                    normalMap={earthNormal}
                    normalScale={[2, 2]}
                    color="#ffffff" 
                    roughness={0.7} 
                    metalness={0.1}
                    envMapIntensity={1}
                />
            </mesh>

            {/* 2. Cloud Layer for Cinematic Realism */}
            <mesh ref={cloudRef} scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[3.5, 64, 64]} />
                <meshStandardMaterial 
                    map={earthClouds}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    color="#ffffff"
                />
            </mesh>

            {/* 3. Atmospheric Glow (Rim Light) - Outer Halo */}
            <mesh scale={[1.04, 1.04, 1.04]}>
                <sphereGeometry args={[3.5, 64, 64]} />
                <atmosphereMaterial 
                    color="#3a9ef2" 
                    transparent 
                    opacity={0.5} 
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                    coefficient={0.5}
                    power={6.0}
                    intensity={1.0}
                />
            </mesh>

            {/* 4. Surface Atmosphere - Inner Glow */}
            <mesh scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[3.5, 64, 64]} />
                <atmosphereMaterial 
                    color="#3a9ef2" 
                    transparent 
                    opacity={0.3} 
                    blending={THREE.AdditiveBlending}
                    side={THREE.FrontSide}
                    coefficient={0.2}
                    power={4.0}
                    intensity={1.0}
                />
            </mesh>

            {/* DRAMATIC SUN LIGHTING for 3D Depth */}
            <directionalLight 
                position={[10, 5, 5]} 
                intensity={2.0} 
                castShadow 
                shadow-bias={-0.0001}
            />
            <ambientLight intensity={0.2} /> {/* Keep shadows dark for contrast */}
            
            {/* Realistic 3D Ring - Ice/Rock Style */}
            <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]} scale={[1, 1, 0.1]} receiveShadow castShadow>
                <torusGeometry args={[6, 1.2, 64, 128]} />
                <meshStandardMaterial 
                    map={ringMap}
                    color="#aaaaaa"
                    roughness={0.8}
                    metalness={0.2}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Sparkles around the planet */}
            <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#00f3ff" />
        </group>
      </Float>

      {/* Galaxy of Particles */}
      <Sparkles count={400} scale={12} size={3} speed={0.4} opacity={0.5} color="#00f3ff" position={[0,0,-2]}/>
    </group>
  )
}

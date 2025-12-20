import { Environment, Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import StarField from './StarField'
import SpaceDebris from './SpaceDebris'
import Planets from './Planets'
import CameraRig from './CameraRig'
import ExplorerLight from './ExplorerLight'
import Core from '../zones/Core'
import Skills from '../zones/Skills'
import Projects from '../zones/Projects'
import Timeline from '../zones/Timeline'
import Contact from '../zones/Contact'
// import Nebula from './Nebula' 

function Skybox() {
  const texture = useTexture('/textures/galaxy_background.png')
  return (
    <Sphere args={[500, 64, 64]} rotation={[0, 0, 0]}>
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        color="#8888aa" // Slight tint to unify
      />
    </Sphere>
  )
}

function Sun() {
  return (
    <group position={[-80, 50, -100]}> {/* Position matches the pointLight */}
       {/* The Core of the Sun - Blindingly Bright to trigger Bloom */}
       <mesh>
         <sphereGeometry args={[8, 32, 32]} />
         <meshBasicMaterial color={[10, 2, 0.5]} toneMapped={false} /> 
       </mesh>
       {/* Outer Glow Halo */}
       <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color={[2, 0.5, 0]} toneMapped={false} transparent opacity={0.3} />
       </mesh>
       {/* Light Source */}
       <pointLight intensity={2.0} color="#ffddee" distance={500} decay={1} />
    </group>
  )
}

export default function Scene() {
  return (
    <>
      <CameraRig />
      {/* <ambientLight intensity={0.2} /> DO NOT NEED ambient light if using Environment, or keep very low */}
      
      {/* REALISTIC LIGHTING: Uses a preset HDRI for reflections on planets, but hides the background image so we see our Skybox */}
      <Environment preset="night" background={false} intensity={0.5} />

      {/* Background & Atmosphere */}
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 20, 500]} /> {/* Deep fog matches background */}
      <Skybox />
      
      {/* Replaced generic pointLight with our Sun component */}
      <Sun />
      
      <ExplorerLight />
      
      <StarField count={3000} /> 
      <SpaceDebris count={600} />
      {/* <Nebula /> - CAUSING CRASH */}
      <Planets />

      <Core />
      <Skills />
      <Projects />
      <Timeline />
      <Contact />
    </>
  )
}

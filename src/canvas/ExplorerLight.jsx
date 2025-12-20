import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ExplorerLight() {
  const lightRef = useRef()

  useFrame((state) => {
    if (lightRef.current) {
        // Convert mouse position (-1 to 1) to a 3D position
        // We project it to a fixed Z-depth so it illuminates things nicely
        const x = (state.pointer.x * state.viewport.width) / 2
        const y = (state.pointer.y * state.viewport.height) / 2
        
        // Smoothly lerp towards the mouse target
        lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1)
        lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.1)
        
        // Light stays slightly in front of the camera path
        lightRef.current.position.z = state.camera.position.z - 5
    }
  })

  return (
    <pointLight 
        ref={lightRef} 
        position={[0, 0, 0]} 
        intensity={2} 
        distance={20} 
        color="#00f3ff" 
    />
  )
}

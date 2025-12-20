import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function SpaceDebris({ count = 600 }) {
  const meshRef = useRef()
  const texture = useTexture("/textures/asteroid_rock.png")

  // Generate random data for asteroids
  const { positions, rotations, scales } = useMemo(() => {
    const positions = []
    const rotations = []
    const scales = []

    for (let i = 0; i < count; i++) {
        // Random placement along the roughly Z-axis path of the portfolio
        // The path goes from Z=10 to Z=-200
        const z = (Math.random() * 220) * -1 + 20 
        const x = (Math.random() - 0.5) * 80 // We widen the X range to make it feel like a surrounding field
        const y = (Math.random() - 0.5) * 50 

        positions.push(x, y, z)
        
        // Random rotation
        rotations.push(Math.random() * Math.PI, Math.random() * Math.PI, 0)

        // Random scale (mixed sizes)
        const s = Math.random() * 1.5 + 0.3
        scales.push(s, s, s)
    }
    
    return { positions, rotations, scales }
  }, [count])

  // Update matrices one time
  useLayoutEffect(() => {
    if (!meshRef.current) return
    const tempObject = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
        tempObject.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
        tempObject.rotation.set(rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2])
        tempObject.scale.set(scales[i * 3], scales[i * 3 + 1], scales[i * 3 + 2])
        
        tempObject.updateMatrix()
        meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, positions, rotations, scales])

  useFrame((state, delta) => {
     if (meshRef.current) {
         meshRef.current.rotation.z += delta * 0.01 // Slow drift
         meshRef.current.rotation.x += delta * 0.005
     }
  })

  return (
    <group>
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.6, 0]} /> {/* More organic rock shape */}
            <meshStandardMaterial 
                map={texture}
                color="#888899" // Neutral grey base
                roughness={0.9} // Very rough stone
                metalness={0.1} // Not metallic
                flatShading={true} // Enhances the "low poly rock" look while using the texture
            />
        </instancedMesh>
    </group>
  )
}

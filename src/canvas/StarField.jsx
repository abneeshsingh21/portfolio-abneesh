import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function StarField({ count = 3000 }) {
  const meshRef = useRef()
  const scroll = useScroll()
  
  // Create realistic star distribution
  const { positions, colors, scales, randomParams } = useMemo(() => {
    const positions = []
    const colors = []
    const scales = []
    const randomParams = []
    
    const colorChoices = [
        new THREE.Color("#ffffff"), // White
        new THREE.Color("#ccccff"), // Blue-ish
        new THREE.Color("#ffcccc"), // Red-ish
        new THREE.Color("#88ccff")  // Cyan
    ]

    for (let i = 0; i < count; i++) {
      // Spherical distribution for "Endless Universe" feel instead of a box
      const r = 400 * Math.cbrt(Math.random()) // Cube root for even distribution in volume
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi) - 100 // Shift slightly back so we start inside it

      positions.push(x, y, z)
      
      // Random Color
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)]
      colors.push(color.r, color.g, color.b)

      // Random Scale (Some tiny, some bright)
      scales.push(Math.random() * 0.8 + 0.2)
      
      randomParams.push(Math.random())
    }
    return { positions, colors: new Float32Array(colors), scales, randomParams }
  }, [count])

  // Initial setup
  useLayoutEffect(() => {
    if (!meshRef.current) return
    
    // We don't need to manually set instanceColor here because we are using attributes-color
    // The geometry attribute handles the colors.
    
    const tempObj = new THREE.Object3D()
    
    for (let i = 0; i < count; i++) {
        tempObj.position.set(positions[i*3], positions[i*3+1], positions[i*3+2])
        const s = scales[i]
        tempObj.scale.set(s, s, s)
        tempObj.updateMatrix()
        meshRef.current.setMatrixAt(i, tempObj.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, positions, scales])

  // Reusable dummy
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!meshRef.current) return
    const currentWarp = scroll ? (Math.abs(scroll.delta) * 1000) : 0

    for (let i = 0; i < count; i++) {
        // Read base position
        const ix = i * 3
        dummy.position.set(positions[ix], positions[ix+1], positions[ix+2])
        
        // Simpler Warp: Scale Z based on scroll speed
        const base = scales[i]
        // HYPER-JUMP: Increased multiplier from 5 to 20 for dramatic streaks
        const warp = Math.min(currentWarp * 20, 80) // Max length 80
        dummy.scale.set(base, base, base + warp)

        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
       {/* Use Low-Poly Sphere (Icosahedron) instead of Box for rounder stars */}
       <icosahedronGeometry args={[0.15, 0]}>
         <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
       </icosahedronGeometry>
       <meshBasicMaterial vertexColors transparent opacity={0.9} />
    </instancedMesh>
  )
}

import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'// Reusable vector for smooth parallax offset
const parallaxOffset = new THREE.Vector3()

export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  
  // Define a CatmullRomCurve3 for the camera path
  // The path moves deep into Z, but also simulates "orbiting" or "looking around"
  // Define a CatmullRomCurve3 for the camera path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1, 10),    // START
      new THREE.Vector3(0, 1, -8),    // Core Zone (Stopped just before planet)
      
      // Evasion Maneuver: WIDE Swing left to go AROUND the massive rings (Radius 7)
      // Planet is at 0, Rings extend to +/-7. Camera must be at > |8| to be safe.
      new THREE.Vector3(-10, 1, -15),  
      
      // Skills Zone - Pushed back to Z=-55 to clear the planet fully
      new THREE.Vector3(0, 1, -55),  
      
      // PROJECT 1: Fake News (Right side at X=5) -> Swing Camera Right to X=2.5
      new THREE.Vector3(2.5, 1, -85),   
      
      // PROJECT 2: Aarii (Left side at X=-5) -> Swing Camera Left to X=-2.5
      new THREE.Vector3(-2.5, 1, -115),   
      
      // PROJECT 3: N-CIIA (Right side at X=5) -> Swing Camera Right to X=2.5
      new THREE.Vector3(2.5, 1, -145),  
      
      // PROJECT 4: EPL (Left side at X=-5) -> Swing Camera Left to X=-2.5
      new THREE.Vector3(-2.5, 1, -175),  

      new THREE.Vector3(0, 1, -210),  // Transition point BEFORE Timeline
      
      // Timeline Nodes Interaction Path (Objects at +/- 4)
      new THREE.Vector3(-1.0, 1, -230), // 2023 (Pass Safe)
      new THREE.Vector3(1.0, 1, -255),  // 2024 (Pass Safe)
      new THREE.Vector3(-1.0, 1, -280), // 2025 (Pass Safe)
      new THREE.Vector3(0, 1, -305),  // 2026 (Center)

      new THREE.Vector3(0, -10, -340),  // Contact Zone (Deep Dive to face the Uplink Tower)
    ])
  }, [])

  useFrame((state) => {
    // Current scroll progress (0 to 1)
    const t = scroll?.offset ?? 0

    // Get position on the curve
    const position = curve.getPoint(t)
    // Get a point slightly ahead to look at
    const lookAtPoint = curve.getPoint(Math.min(t + 0.1, 1))
    
    // Smoothly interpolate the parallax offset
    parallaxOffset.x = THREE.MathUtils.lerp(parallaxOffset.x, state.pointer.x * 2.0, 0.05)
    parallaxOffset.y = THREE.MathUtils.lerp(parallaxOffset.y, state.pointer.y * 2.0, 0.05)

    // Apply curve position + smoothed parallax offset
    camera.position.set(
        position.x + parallaxOffset.x,
        position.y + parallaxOffset.y,
        position.z
    )

    camera.lookAt(lookAtPoint)
  })

  // Visualize path for debug (optional)
  /*
  const points = curve.getPoints(50)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <line geometry={lineGeometry}>
        <lineBasicMaterial color="red" />
    </line>
  )
  */
  return null
}

import { Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'

export default function Nebula() {
  return (
    <group>
      <Clouds material={THREE.MeshBasicMaterial}>
        {/* Purple/Pink Nebula (Left side) - OPTIMIZED */}
        <Cloud 
            segments={10} // Reduced from 20 for perf
            bounds={[40, 10, 40]} // Smaller bounds
            volume={15} // Reduced from 30
            color="#a020f0" 
            position={[-40, 5, -60]}
            opacity={0.06} // Less opaque to reduce overdraw
            speed={0.05} 
            growth={3} 
        />
        
        {/* Cyan/Blue Nebula (Right side) - OPTIMIZED */}
        <Cloud 
            segments={10} 
            bounds={[40, 10, 40]} 
            volume={15} 
            color="#00ced1" 
            position={[40, -10, -80]}
            opacity={0.06}
            speed={0.05}
            growth={3}
        />

        {/* Deep Blue Distance Fog (Center far) - OPTIMIZED */}
         <Cloud 
            segments={15} 
            bounds={[80, 20, 40]} 
            volume={25} 
            color="#000080" 
            position={[0, 0, -150]}
            opacity={0.04}
            speed={0.02}
        />
      </Clouds>
    </group>
  )
}

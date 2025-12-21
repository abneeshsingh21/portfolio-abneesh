import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { ScrollControls } from '@react-three/drei'
import Scene from './canvas/Scene'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import SectionDetails from './ui/SectionDetails'
import SoundController from './ui/SoundController'
import './index.css'

function App() {
  const [started, setStarted] = useState(false)

  // Simple Overlay
  if (!started) {
    return (
      <div 
        className="ui-layer interactive" 
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', zIndex: 999 }}
        onClick={() => setStarted(true)}
      >
        <h1 style={{ color: '#00f3ff', cursor: 'pointer', textAlign: 'center', fontFamily: 'sans-serif' }}>
          CLICK TO ENTER <br />
          <span style={{ fontSize: '0.8rem', color: '#fff' }}>SYSTEM INITIALIZATION</span>
        </h1>
      </div>
    )
  }

  // Responsive FOV: Zoom out on mobile (60) to see more horizontally, Zoom in on Desktop (35) for cinematic look
  const isMobile = window.innerWidth < 768
  const responsiveFov = isMobile ? 60 : 35

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: responsiveFov }}
        gl={{ antialias: false, stencil: false, alpha: false }}
        dpr={[1, 1.5]} 
      >
        <color attach="background" args={['#050510']} />
        
        <Suspense fallback={<mesh position={[0,0,5]}><boxGeometry/><meshBasicMaterial color="blue"/></mesh>}>
          {/* Increased damping to 1.0 for luxurious smooth scrolling */}
          <ScrollControls pages={14} damping={1.0} distance={1}>
             <Scene />
          </ScrollControls>
        </Suspense>

      <EffectComposer disableNormalPass>
          {/* Enhanced Bloom for "Neon Cyber" look - Toned down for readability */}
          <Bloom luminanceThreshold={0.3} mipmapBlur intensity={0.8} levels={8} radius={0.6} />
          {/* Chromatic Aberration DISABLED - was causing red ring artifact */}
          {/* <ChromaticAberration offset={[0.0002, 0.0002]} /> */}
          {/* Fine Film Grain */}
          <Noise opacity={0.05} /> 
          {/* Cinematc Vignette */}
          <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
      </Canvas>
      
      <SectionDetails />
      <div className="ui-layer">
        {/* HUD Elements can go here */}
      </div>
      <SoundController />
    </>
  )
}

export default App


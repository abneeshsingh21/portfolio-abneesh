import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { ScrollControls, useProgress } from '@react-three/drei'
import Scene from './canvas/Scene'
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from '@react-three/postprocessing'
import SectionDetails from './ui/SectionDetails'
import SoundController from './ui/SoundController'
import './index.css'

function LoadingScreen({ onStarted }) {
  const { progress } = useProgress()
  const isLoaded = progress >= 100

  return (
    <div 
      className="ui-layer interactive" 
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050510', zIndex: 999 }}
    >
      <h1 style={{ color: '#00f3ff', textAlign: 'center', fontFamily: 'monospace', letterSpacing: '4px', marginBottom: '2rem' }}>
        SYSTEM INITIALIZATION
      </h1>
      
      <div style={{ width: '300px', height: '2px', background: '#222', position: 'relative' }}>
          <div style={{ 
              position: 'absolute', top: 0, left: 0, height: '100%', 
              background: '#00f3ff', width: `${progress}%`,
              boxShadow: '0 0 15px #00f3ff',
              transition: 'width 0.3s ease-out'
          }} />
      </div>
      
      <p style={{ color: '#fff', fontFamily: 'monospace', marginTop: '1rem', letterSpacing: '2px' }}>
          UPLOADING CORE DATA... {progress.toFixed(0)}%
      </p>

      {isLoaded && (
          <button 
              onClick={onStarted}
              className="enter-btn"
              style={{
                  marginTop: '3rem', padding: '1rem 3rem', background: 'transparent',
                  border: '1px solid #00f3ff', color: '#00f3ff', cursor: 'pointer',
                  letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1.2rem',
                  boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)'
              }}
          >
              ENTER SYSTEM
          </button>
      )}
    </div>
  )
}

function App() {
  const [started, setStarted] = useState(false)

  // Responsive FOV: Zoom out on mobile (60) to see more horizontally, Zoom in on Desktop (35) for cinematic look
  const isMobile = window.innerWidth < 768
  const responsiveFov = isMobile ? 60 : 35

  return (
    <>
      {!started && <LoadingScreen onStarted={() => setStarted(true)} />}

      <Canvas
        camera={{ position: [0, 0, 5], fov: responsiveFov }}
        gl={{ antialias: false, stencil: false, alpha: false }}
        dpr={[1, 1.2]} 
      >
        <color attach="background" args={['#050510']} />
        
        <Suspense fallback={<mesh position={[0,0,5]}><boxGeometry/><meshBasicMaterial color="blue"/></mesh>}>
          {/* Increased damping to 1.0 for luxurious smooth scrolling */}
          <ScrollControls pages={16} damping={1.0} distance={1}>
             <Scene />
          </ScrollControls>
        </Suspense>

      <EffectComposer disableNormalPass>
          {/* Depth of Field temporarily disabled to maintain perfect clarity at all distances */}
          {/* <DepthOfField focusDistance={0.005} focalLength={0.03} bokehScale={3} height={480} /> */}
          
          {/* Enhanced Bloom for "Neon Cyber" look - Toned down for readability */}
          <Bloom luminanceThreshold={0.3} mipmapBlur intensity={0.8} levels={8} radius={0.6} />
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


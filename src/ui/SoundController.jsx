import { useState, useEffect, useRef } from 'react'
import { playClick } from '../utils/sound'

export default function SoundController() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Initialize Audio
    audioRef.current = new Audio('/audio/bgm.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.4

    const startAudio = () => {
        if (!playing) {
            audioRef.current.play()
                .then(() => setPlaying(true))
                .catch(e => console.log("Audio play blocked", e))
        }
    }

    // Auto-attempt or wait for interaction
    document.addEventListener('click', startAudio, { once: true })
    
    return () => {
        document.removeEventListener('click', startAudio)
        if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  const toggleSound = () => {
    playClick()
    if (playing) {
        audioRef.current.pause()
    } else {
        audioRef.current.play().catch(e => console.error(e))
    }
    setPlaying(!playing)
  }
  
  // ... rest of render ... (need to provide full render if I replace the whole file or chunk)
  // I'll replace the COMPONENT BODY.

  return (
    <button 
        onClick={toggleSound}
        style={{
            position: 'fixed',
            bottom: window.innerWidth < 768 ? '1.5rem' : '2rem', // Adjusted for mobile
            left: window.innerWidth < 768 ? '1.5rem' : '2rem',
            zIndex: 2000,
            background: playing ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0,0,0,0.5)',
            border: '1px solid #00f3ff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: '#00f3ff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: playing ? '0 0 20px #00f3ff' : 'none',
            transition: 'all 0.3s ease'
        }}
    >
        {playing ? '🔊' : '🔇'}
    </button>
  )
}

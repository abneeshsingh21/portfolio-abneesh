import { useStore } from '../store'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

const contentData = {
  CORE: {
    title: "ABOUT ME",
    subtitle: "Engineer. Architect. Builder.",
    body: "I am a Computer Science engineer specializing in Artificial Intelligence and Machine Learning, focused on building real-world, production-ready intelligent systems rather than academic demos.\n\nMy work sits at the intersection of AI/ML, system design, and full-stack engineering, where performance, accuracy, and scalability matter more than buzzwords.\n\nI have built end-to-end AI products — from data preprocessing and model design to deployment, explainability, and user-facing interfaces. My projects include hybrid fake news detection systems, AI voice assistants, and large-scale cybersecurity intelligence platforms.\n\nI believe strong engineering is not about writing code that works once, but about designing systems that are reliable, explainable, and ready for real users.",
    tags: ["System Design", "Production AI", "Scalability"]
  },
  SKILLS: {
    title: "SKILLS SECTION",
    subtitle: "Engineering-Focused",
    body: "**Programming & Core Engineering**\nI work comfortably across multiple languages and paradigms, choosing tools based on performance, scalability, and system requirements.\n- Python, Java, C++, JavaScript / TypeScript\n- Strong understanding of data structures, algorithms, and system fundamentals\n\n**Artificial Intelligence & Machine Learning**\nMy strength lies in building complete ML pipelines, not just training models.\n- Machine Learning pipeline design\n- NLP (text classification, similarity detection, fake news detection)\n- TF-IDF, n-grams, feature engineering\n- Ensemble models and threshold optimization\n- Explainable AI (XAI) for transparency and trust\n\n**Frameworks & Tools**\n- Scikit-learn, Streamlit, FastAPI, Flask, React, Three.js\n\n**Databases & Backend**\n- MySQL, SQLite, REST API design, Backend integration\n\n**Systems & Cybersecurity**\n- Secure system architecture, Digital investigation concepts, Performance-focused system design",
    tags: ["Full Stack", "ML Pipelines", "System Architecture", "Security"]
  },
  PROJECTS: {
    title: "WHAT I CREATED",
    subtitle: "Innovation in Action",
    body: "Click on the holographic screens in the galaxy to view specific details for each project.\n\n**Flagship Projects**:\n1. Hybrid Fake News Detector: 96.46% Accuracy Ensemble System.\n2. Aarii: Local LLM-powered Holographic Assistant.\n3. N-CIIA: National Cyber Investigation & Intelligence Platform.\n\nExplore them in the 3D space for architectural breakdowns.",
    tags: ["Select a Project", "Interactive 3D", "Case Studies"]
  },
  TIMELINE: {
    title: "JOURNEY",
    subtitle: "Year-wise Achievements",
    body: "Click on the floating years to see details.\n\n**2025**: Advanced Systems & Specialization\n**2024**: Product-Oriented Development\n**2023**: Skill Expansion\n**2022**: Foundation Phase",
    tags: ["Milestones", "Career", "Growth"]
  },
  CONTACT: {
    title: "ESTABLISH UPLINK",
    subtitle: "Open Channels",
    body: "Ready to collaborate on the next big breakthrough? My comms are open.\n\nEmail: singhabneesh250@gmail.com\nGitHub: github.com/abneeshsingh21/portfolio-abneesh\nLinkedIn: linkedin.com/in/abneesh-singh001\n\n**I am driven by one goal: to build intelligent systems that actually work in the real world.**",
    tags: ["Collaboration", "Hiring", "Consulting"]
  }
}

export default function SectionDetails() {
  const { activeSection, setActiveSection } = useStore()
  const isMobile = window.innerWidth < 768

  // Generate a stable randomized ID for the HUD
  const sysId = useMemo(() => Math.floor(Math.random()*9000)+1000, [activeSection])

  // Determine content: direct object or lookup key
  const content = typeof activeSection === 'string' 
    ? contentData[activeSection] 
    : activeSection 

  if (!content) return null

  // Helper to parse **bold** text and [links]
  const parseBody = (text) => {
      // (Lines omitted for brevity, keeping only the exact target text)
      if(!text) return null
      
      // Split by newlines first to handle paragraph breaks if needed, or just keep as is.
      // We will perform a multi-pass regex replacement strategy.
      
      // Regexes
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/g
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g
      const boldRegex = /(\*\*.*?\*\*)/g

      // Helper to process a string for links/emails
      const processLinks = (str) => {
        // Split by URL
        return str.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                let href = part
                if (!href.startsWith('http')) href = 'https://' + href
                return <a key={`link-${i}`} href={href} target="_blank" rel="noopener noreferrer" style={{color: '#00f3ff', textDecoration: 'underline'}}>{part}</a>
            }
            // Split by Email
            return part.split(emailRegex).map((subPart, j) => {
                if (subPart.match(emailRegex)) {
                    return <a key={`email-${i}-${j}`} href={`mailto:${subPart}`} style={{color: '#00f3ff', textDecoration: 'underline'}}>{subPart}</a>
                }
                return subPart
            })
        })
      }

      // First split by bold
      return text.split(boldRegex).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} style={{color: '#fff'}}>{part.slice(2, -2)}</strong>
          }
          // Only process links in non-bold text
          return <span key={i}>{processLinks(part)}</span>
      })
  }

  return (
    <AnimatePresence>
      {activeSection && (
        <motion.div 
            className="details-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Smooth exponential out
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: isMobile ? '100%' : '45%', // Wider on desktop for better reading
                height: '100vh',
                background: 'linear-gradient(135deg, rgba(5,5,15,0.95) 0%, rgba(0,20,30,0.85) 100%)', // Rich gradient
                backdropFilter: 'blur(25px)', // Extreme glassmorphsism
                borderLeft: '2px solid #00f3ff',
                boxShadow: '-20px 0 50px rgba(0, 243, 255, 0.1), inset 5px 0 30px rgba(0, 243, 255, 0.05)',
                padding: isMobile ? '2rem' : '4rem',
                zIndex: 1000,
                color: 'white',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Cyberpunk Decorative Corner HUDs */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid #00f3ff', borderLeft: '2px solid #00f3ff', opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '2px solid rgba(0, 243, 255, 0.3)', borderRight: '2px solid rgba(0, 243, 255, 0.3)' }} />
            
            {/* Stylized Identifier Badge */}
            <div style={{ position: 'absolute', top: '2rem', right: '7rem', opacity: 0.04, fontFamily: 'monospace', fontSize: '4rem', whiteSpace: 'nowrap', pointerEvents: 'none', writingMode: 'vertical-rl', fontWeight: 900 }}>
                SYS.ARCH.{sysId}
            </div>

            {/* Premium Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button 
                    onClick={() => setActiveSection(null)}
                    onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; e.target.style.boxShadow = '0 0 15px rgba(0,243,255,0.3)' }}
                    onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        color: '#00f3ff',
                        cursor: 'pointer',
                        padding: isMobile ? '0.8rem 1.2rem' : '0.6rem 1.5rem',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        fontFamily: 'monospace',
                        letterSpacing: '2px',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(5px)',
                        zIndex: 1001
                    }}
                >
                    ✕ CLOSE UPLINK
                </button>
            </div>

            <div style={{ marginTop: '2rem', flex: 1, position: 'relative', zIndex: 10 }}>
                <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    style={{ 
                        fontSize: isMobile ? '2.5rem' : '3.5rem', 
                        margin: '0 0 0.5rem 0', 
                        fontFamily: '"Arial Black", Impact, sans-serif', 
                        letterSpacing: '4px', 
                        color: '#00f3ff',
                        textShadow: '0 0 20px rgba(0, 243, 255, 0.4)'
                    }}
                >
                    {content.title}
                </motion.h1>
                
                <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ 
                        fontSize: '1.1rem', 
                        margin: '0 0 3rem 0', 
                        color: '#b0bec5', 
                        textTransform: 'uppercase', 
                        letterSpacing: '6px',
                        fontFamily: 'monospace',
                        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
                        paddingBottom: '1rem',
                        display: 'inline-block'
                    }}
                >
                    :: {content.subtitle}
                </motion.h3>

                <motion.div
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.3, duration: 0.6 }}
                     style={{ 
                         fontSize: isMobile ? '1rem' : '1.15rem', 
                         lineHeight: '1.8', 
                         color: '#e0e0e0', 
                         whiteSpace: 'pre-line',
                         fontFamily: 'system-ui, -apple-system, sans-serif',
                         fontWeight: 300,
                         textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                     }}
                >
                    <p>{parseBody(content.body)}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ marginTop: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                >
                    {content.tags.map((tag, i) => (
                        <span key={i} style={{ 
                            border: '1px solid rgba(0, 243, 255, 0.3)', 
                            background: 'rgba(0, 243, 255, 0.05)',
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.85rem', 
                            color: '#00f3ff',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            boxShadow: 'inset 0 0 10px rgba(0,243,255,0.05)'
                        }}>
                            <span style={{opacity: 0.5, marginRight: '8px'}}>{'>_'}</span> 
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

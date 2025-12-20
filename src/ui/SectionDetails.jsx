import { useStore } from '../store'
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
    body: "Ready to collaborate on the next big breakthrough? My comms are open.\n\nEmail: abneesh@example.com\nGitHub: github.com/abneesh\nLinkedIn: linkedin.com/in/abneesh\n\n**I am driven by one goal: to build intelligent systems that actually work in the real world.**",
    tags: ["Collaboration", "Hiring", "Consulting"]
  }
}

export default function SectionDetails() {
  const { activeSection, setActiveSection } = useStore()
  const isMobile = window.innerWidth < 768

  // Determine content: direct object or lookup key
  const content = typeof activeSection === 'string' 
    ? contentData[activeSection] 
    : activeSection 

  if (!content) return null

  // Helper to parse **bold** text
  const parseBody = (text) => {
      if(!text) return null
      return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} style={{color: '#fff'}}>{part.slice(2, -2)}</strong>
          }
          return part
      })
  }

  return (
    <AnimatePresence>
      {activeSection && (
        <motion.div 
            className="details-overlay"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: isMobile ? '100%' : '40%', // Responsive Width
                height: '100vh',
                background: 'rgba(5, 5, 16, 0.75)', // More transparent for premium glass feel
                backdropFilter: 'blur(20px)', // Stronger blur
                borderLeft: '1px solid rgba(0, 243, 255, 0.2)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                padding: isMobile ? '2rem' : '4rem', // Responsive Padding
                zIndex: 1000,
                color: 'white',
                overflowY: 'auto'
            }}
        >
            <button 
                onClick={() => setActiveSection(null)}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    background: 'none',
                    border: '1px solid #333',
                    color: '#666',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    fontSize: '1.2rem'
                }}
            >
                ✕ CLOSE
            </button>

            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', fontFamily: 'Impact, sans-serif', letterSpacing: '2px', color: '#00f3ff' }}
            >
                {content.title}
            </motion.h1>
            
            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: '1.2rem', margin: '0 0 2rem 0', color: '#888', textTransform: 'uppercase', letterSpacing: '4px' }}
            >
                {content.subtitle}
            </motion.h3>

            <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 style={{ fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.6', color: '#ddd', whiteSpace: 'pre-line' }}
            >
                <p>{parseBody(content.body)}</p>
            </motion.div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {content.tags.map((tag, i) => (
                    <span key={i} style={{ 
                        border: '1px solid #333', 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem', 
                        color: '#aaa',
                        borderRadius: '20px'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

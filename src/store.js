import { create } from 'zustand'

export const useStore = create((set) => ({
  activeSection: null, // 'CORE', 'SKILLS', 'PROJECTS', 'TIMELINE', 'CONTACT'
  setActiveSection: (section) => set({ activeSection: section }),
}))

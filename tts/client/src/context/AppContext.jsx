import { createContext, useContext, useState, useEffect } from 'react'
import { getVoices } from '../services/api'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('alloy')
  const [isLoading, setIsLoading] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [preferences, setPreferences] = useState({
    speed: 1.0,
    autoEnhance: false,
    autoPlay: true
  })

  useEffect(() => {
    loadVoices()
    loadPreferences()
  }, [])

  const loadVoices = async () => {
    try {
      const data = await getVoices()
      setVoices(data)
    } catch (error) {
      console.error('Failed to load voices:', error)
    }
  }

  const loadPreferences = () => {
    const saved = localStorage.getItem('tts-preferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      setPreferences(prefs)
      if (prefs.defaultVoice) {
        setSelectedVoice(prefs.defaultVoice)
      }
    }
  }

  const savePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferences(updated)
    localStorage.setItem('tts-preferences', JSON.stringify(updated))
  }

  const value = {
    voices,
    selectedVoice,
    setSelectedVoice,
    isLoading,
    setIsLoading,
    currentAudio,
    setCurrentAudio,
    preferences,
    savePreferences
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
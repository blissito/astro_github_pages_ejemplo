import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMic, FiZap, FiPlay, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import VoiceSelector from '../components/VoiceSelector'
import AudioPlayer from '../components/AudioPlayer'
import { synthesizeSpeech, enhanceText } from '../services/api'
import { useApp } from '../context/AppContext'

const HomePage = () => {
  const [text, setText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [currentAudioId, setCurrentAudioId] = useState(null)
  const [showEnhanced, setShowEnhanced] = useState(false)
  
  const { selectedVoice, preferences, savePreferences } = useApp()

  const handleEnhance = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text first')
      return
    }

    setIsEnhancing(true)
    try {
      const result = await enhanceText(text)
      setEnhancedText(result.enhancedText)
      setShowEnhanced(true)
      toast.success('Text enhanced successfully!')
    } catch (error) {
      console.error('Enhancement error:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSynthesize = async () => {
    const textToConvert = showEnhanced && enhancedText ? enhancedText : text
    
    if (!textToConvert.trim()) {
      toast.error('Please enter some text')
      return
    }

    setIsSynthesizing(true)
    try {
      const result = await synthesizeSpeech({
        text: textToConvert,
        voiceId: selectedVoice,
        speed: preferences.speed,
        enhance: false
      })
      
      setCurrentAudioId(result.audioId)
      toast.success('Speech generated successfully!')
      
      if (preferences.autoPlay) {
        setTimeout(() => {
          const audio = new Audio(result.url)
          audio.play()
        }, 500)
      }
    } catch (error) {
      console.error('Synthesis error:', error)
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value)
    savePreferences({ speed })
  }

  const characterCount = (showEnhanced && enhancedText ? enhancedText : text).length

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Text to Speech Converter
          </h1>
          <p className="text-gray-600">
            Convert your text to natural-sounding speech with AI enhancement
          </p>
        </div>

        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {showEnhanced ? 'Enhanced Text' : 'Enter Text'}
              </label>
              <textarea
                value={showEnhanced && enhancedText ? enhancedText : text}
                onChange={(e) => {
                  if (showEnhanced) {
                    setEnhancedText(e.target.value)
                  } else {
                    setText(e.target.value)
                  }
                }}
                placeholder="Enter the text you want to convert to speech..."
                className="input-field h-32 resize-none"
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {characterCount} / 5000 characters
                </span>
                {showEnhanced && (
                  <button
                    onClick={() => {
                      setShowEnhanced(false)
                      setEnhancedText('')
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Show original
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VoiceSelector />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {preferences.speed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={preferences.speed}
                  onChange={handleSpeedChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !text.trim()}
                className="btn-secondary flex items-center space-x-2"
              >
                {isEnhancing ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiZap />
                )}
                <span>Enhance with AI</span>
              </button>
              
              <button
                onClick={handleSynthesize}
                disabled={isSynthesizing || (!text.trim() && !enhancedText.trim())}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {isSynthesizing ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FiPlay />
                    <span>Generate Speech</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card text-center"
          >
            <FiMic className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Multiple Voices</h3>
            <p className="text-sm text-gray-600">
              Choose from various natural-sounding voices
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card text-center"
          >
            <FiZap className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">AI Enhancement</h3>
            <p className="text-sm text-gray-600">
              Improve text clarity and pronunciation
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card text-center"
          >
            <FiPlay className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Instant Playback</h3>
            <p className="text-sm text-gray-600">
              Listen and download your audio instantly
            </p>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {currentAudioId && (
          <AudioPlayer
            audioId={currentAudioId}
            onClose={() => setCurrentAudioId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
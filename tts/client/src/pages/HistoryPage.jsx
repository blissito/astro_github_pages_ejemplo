import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiTrash2, FiDownload, FiClock, FiMic } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getHistory, deleteHistoryItem, downloadAudio } from '../services/api'
import AudioPlayer from '../components/AudioPlayer'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentAudioId, setCurrentAudioId] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const data = await getHistory()
      setHistory(data)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      await deleteHistoryItem(id)
      setHistory(history.filter(item => item.id !== id))
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No History Yet</h2>
        <p className="text-gray-600 mb-6">
          Your text-to-speech conversions will appear here
        </p>
        <a href="/" className="btn-primary inline-block">
          Start Converting
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversion History</h1>
        <p className="text-gray-600">
          View and manage your previous text-to-speech conversions
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMic className="text-primary-600" />
                    <span className="font-medium text-gray-900">
                      {item.voice_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {formatDate(item.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">
                    {truncateText(item.input_text, 200)}
                  </p>
                  
                  {item.enhanced_text && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mb-2">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Enhanced:</span> {truncateText(item.enhanced_text, 150)}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.character_count} characters</span>
                    {item.duration_seconds && (
                      <span>{item.duration_seconds}s duration</span>
                    )}
                    {item.settings && JSON.parse(item.settings).speed !== 1 && (
                      <span>{JSON.parse(item.settings).speed}x speed</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {item.audio_id && (
                    <>
                      <button
                        onClick={() => setCurrentAudioId(item.audio_id)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Play"
                      >
                        <FiPlay size={18} />
                      </button>
                      <button
                        onClick={() => downloadAudio(item.audio_id)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Download"
                      >
                        <FiDownload size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

export default HistoryPage
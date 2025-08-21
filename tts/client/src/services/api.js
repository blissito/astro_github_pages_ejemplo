import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || 'Something went wrong'
    toast.error(message)
    return Promise.reject(error)
  }
)

export const synthesizeSpeech = async (data) => {
  const response = await api.post('/tts/synthesize', data)
  return response.data
}

export const enhanceText = async (text) => {
  const response = await api.post('/tts/enhance', { text })
  return response.data
}

export const getVoices = async () => {
  const response = await api.get('/tts/voices')
  return response.data
}

export const getHistory = async (params = {}) => {
  const response = await api.get('/tts/history', { params })
  return response.data
}

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/tts/history/${id}`)
  return response.data
}

export const getAudioUrl = (audioId) => {
  return `/api/audio/${audioId}`
}

export const downloadAudio = (audioId) => {
  window.open(`/api/audio/${audioId}/download`, '_blank')
}
/**
 * API Client for backend communication
 * Handles all HTTP requests to the Flask backend
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth tokens if needed
client.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API methods
export const api = {
  // Send message to AI
  sendMessage: async (message, conversationHistory = [], options = {}) => {
    const response = await client.post('/chat', {
      message,
      conversation_history: conversationHistory,
      personality: options.personality || 'assistant',
      user_preferences: options.userPreferences || {}
    })
    return response.data
  },

  // Get available AI models
  getModels: async () => {
    const response = await client.get('/models')
    return response.data
  },

  // Save conversation
  saveConversation: async (conversation) => {
    const response = await client.post('/transcript/save', { conversation })
    return response.data
  },

  // Export transcript
  exportTranscript: async (conversation, format = 'txt') => {
    const response = await client.post('/transcript/export', {
      conversation,
      format
    }, {
      responseType: 'blob'
    })
    return response.data
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await client.get('/config/preferences')
    return response.data
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await client.put('/config/preferences', preferences)
    return response.data
  },

  // Get available plugins
  getPlugins: async () => {
    const response = await client.get('/plugins')
    return response.data
  },

  // Invoke a plugin
  invokePlugin: async (pluginName, context) => {
    const response = await client.post('/plugins/invoke', {
      plugin: pluginName,
      context
    })
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await client.get('/health')
    return response.data
  }
}

export default client

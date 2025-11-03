import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CallContext = createContext()

const CALL_STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ENDED: 'ended'
}

const initialState = {
  callState: CALL_STATES.IDLE,
  isVoiceMode: true,
  isMuted: false,
  showTranscript: false,
  conversation: [],
  callDuration: 0,
  aiPersonality: 'assistant',
  userPreferences: {
    name: 'User',
    avatar: null,
    voicePreference: 'default',
    tone: 'professional'
  }
}

function callReducer(state, action) {
  switch (action.type) {
    case 'START_CALL':
      return { ...state, callState: CALL_STATES.CONNECTING }
    case 'CALL_CONNECTED':
      return { ...state, callState: CALL_STATES.ACTIVE }
    case 'END_CALL':
      return { ...state, callState: CALL_STATES.ENDED }
    case 'RESET_CALL':
      return { ...state, callState: CALL_STATES.IDLE, callDuration: 0, conversation: [] }
    case 'TOGGLE_VOICE_MODE':
      return { ...state, isVoiceMode: !state.isVoiceMode }
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted }
    case 'TOGGLE_TRANSCRIPT':
      return { ...state, showTranscript: !state.showTranscript }
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversation: [...state.conversation, action.payload]
      }
    case 'UPDATE_DURATION':
      return { ...state, callDuration: action.payload }
    case 'SET_PERSONALITY':
      return { ...state, aiPersonality: action.payload }
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function CallProvider({ children }) {
  const [state, dispatch] = useReducer(callReducer, initialState)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('ai-dialer-preferences')
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs })
      } catch (e) {
        console.error('Failed to load preferences:', e)
      }
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('ai-dialer-preferences', JSON.stringify(state.userPreferences))
  }, [state.userPreferences])

  // Timer for call duration
  useEffect(() => {
    let interval
    if (state.callState === CALL_STATES.ACTIVE) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_DURATION', payload: state.callDuration + 1 })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state.callState, state.callDuration])

  return (
    <CallContext.Provider value={{ state, dispatch, CALL_STATES }}>
      {children}
    </CallContext.Provider>
  )
}

export function useCall() {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within a CallProvider')
  }
  return context
}

import React, { useState, useEffect } from 'react'
import { CallProvider, useCall } from './context/CallContext'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen'
import RequestInput from './components/RequestInput/RequestInput'
import CallScreen from './components/CallScreen/CallScreen'
import Settings from './components/Settings/Settings'
import { api } from './modules/api/client'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function AppContent() {
  const [screen, setScreen] = useState('welcome') // welcome, request, call, settings
  const [callingNumber, setCallingNumber] = useState('')
  const [agentInfo, setAgentInfo] = useState(null)
  const [isRouting, setIsRouting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { state, dispatch } = useCall()

  const handleOpenSettings = () => {
    setScreen('settings')
  }

  const handleContinue = () => {
    setScreen('request')  // Go directly to request screen (skip dialpad)
  }

  const handleBack = () => {
    if (screen === 'request') {
      setScreen('welcome')
      setCallingNumber('')
    } else if (screen === 'call' && state.callState === 'idle') {
      setScreen('request')
    } else if (screen === 'settings') {
      setScreen('request')  // Back to request screen from settings
    }
  }

  const handleRequestSubmit = async (requestText, phoneNumber = '') => {
    setIsRouting(true)

    // Store phone number if provided
    if (phoneNumber) {
      setCallingNumber(phoneNumber)
    }

    try {
      // If phone number provided, make a REAL Twilio call
      if (phoneNumber && phoneNumber.trim().length > 0) {
        console.log('Making real phone call to:', phoneNumber)

        try {
          const callResponse = await api.makePhoneCall(phoneNumber, requestText)
          console.log('Real call initiated:', callResponse)

          setAgentInfo({
            agent: {
              name: 'AI Assistant',
              title: 'Voice Call Agent',
              department: 'Calling ' + phoneNumber
            },
            greeting: 'Calling your phone...',
            organization: {
              name: 'Real Phone Call',
              type: 'twilio'
            },
            callSid: callResponse.call_sid,
            isRealCall: true
          })
        } catch (callError) {
          console.error('Failed to make real call:', callError)
          // Fall back to virtual call
          console.log('Falling back to virtual call')
        }
      } else {
        // Virtual call - route normally
        const response = await axios.post(`${API_URL}/route-call`, {
          message: requestText
        })
        setAgentInfo(response.data)
      }

      // Move to call screen after routing
      setTimeout(() => {
        setScreen('call')
        setIsRouting(false)

        // Auto-start the call
        setTimeout(() => {
          dispatch({ type: 'START_CALL' })
          setTimeout(() => {
            dispatch({ type: 'CALL_CONNECTED' })
          }, 1000)
        }, 500)
      }, 1500)
    } catch (error) {
      console.error('Error routing call:', error)
      // Fallback to general agent
      setAgentInfo({
        agent: {
          name: 'AI Assistant',
          title: 'Virtual Assistant',
          department: 'General Support'
        },
        greeting: 'Hello, how can I help you today?',
        organization: {
          name: 'AI Assistant',
          type: 'general'
        }
      })

      setScreen('call')
      setIsRouting(false)

      // Auto-start the call
      setTimeout(() => {
        dispatch({ type: 'START_CALL' })
        setTimeout(() => {
          dispatch({ type: 'CALL_CONNECTED' })
        }, 1000)
      }, 500)
    }
  }

  const handleEndCall = () => {
    dispatch({ type: 'END_CALL' })
    setTimeout(() => {
      dispatch({ type: 'RESET_CALL' })
      setScreen('request')
      setCallingNumber('')
    }, 2000)
  }

  // Add fade-in effect when component mounts
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 100)
    return () => clearTimeout(timer)
  }, [screen])

  return (
    <div className="min-h-screen">
      {screen === 'welcome' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <WelcomeScreen onContinue={handleContinue} />
        </div>
      )}

      {screen === 'request' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <RequestInput onSubmit={handleRequestSubmit} isLoading={isRouting} onBack={handleBack} onSettings={handleOpenSettings} />
        </div>
      )}

      {screen === 'call' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <CallScreen
            calledNumber={callingNumber}
            onEndCall={handleEndCall}
            agentInfo={agentInfo}
            isRouting={isRouting}
            onBack={handleBack}
          />
        </div>
      )}

      {screen === 'settings' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <Settings onBack={handleBack} />
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <CallProvider>
      <AppContent />
    </CallProvider>
  )
}

export default App

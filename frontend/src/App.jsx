import React, { useState, useEffect } from 'react'
import { CallProvider, useCall } from './context/CallContext'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen'
import DialPad from './components/DialPad/DialPad'
import RequestInput from './components/RequestInput/RequestInput'
import CallScreen from './components/CallScreen/CallScreen'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function AppContent() {
  const [screen, setScreen] = useState('welcome') // welcome, dialpad, request, call
  const [callingNumber, setCallingNumber] = useState('')
  const [agentInfo, setAgentInfo] = useState(null)
  const [isRouting, setIsRouting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { state, dispatch } = useCall()

  const handleContinue = () => {
    setScreen('dialpad')
  }

  const handleBack = () => {
    if (screen === 'dialpad') {
      setScreen('welcome')
    } else if (screen === 'request') {
      setScreen('dialpad')
      setCallingNumber('')
    } else if (screen === 'call' && state.callState === 'idle') {
      setScreen('request')
    }
  }

  const handleCall = (phoneNumber) => {
    setCallingNumber(phoneNumber)
    setScreen('request')
  }

  const handleRequestSubmit = async (requestText) => {
    setIsRouting(true)

    try {
      // Route the call based on request
      const response = await axios.post(`${API_URL}/route-call`, {
        message: requestText
      })

      setAgentInfo(response.data)

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
      setScreen('dialpad')
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

      {screen === 'dialpad' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <DialPad onCall={handleCall} onBack={handleBack} />
        </div>
      )}

      {screen === 'request' && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <RequestInput onSubmit={handleRequestSubmit} isLoading={isRouting} onBack={handleBack} />
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

import React, { useState, useEffect, useRef } from 'react'
import { Phone, Mic, MicOff, FileText, MessageSquare, PhoneOff, User, Stethoscope, Loader, ArrowLeft } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import Waveform from '../Waveform/Waveform'
import Transcript from '../Transcript/Transcript'
import STTEngine from '../../modules/voice/STTEngine'
import TTSEngine from '../../modules/voice/TTSEngine'
import AudioProcessor from '../../modules/voice/AudioProcessor'
import { api } from '../../modules/api/client'

function CallScreen({ agentInfo, isRouting, onBack }) {
  const { state, dispatch, CALL_STATES } = useCall()
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')

  const sttEngineRef = useRef(null)
  const ttsEngineRef = useRef(null)
  const audioProcessorRef = useRef(null)

  // Initialize voice engines
  useEffect(() => {
    sttEngineRef.current = new STTEngine()
    ttsEngineRef.current = new TTSEngine()
    audioProcessorRef.current = new AudioProcessor()

    audioProcessorRef.current.init()

    return () => {
      if (sttEngineRef.current) {
        sttEngineRef.current.stop()
      }
      if (ttsEngineRef.current) {
        ttsEngineRef.current.stop()
      }
      if (audioProcessorRef.current) {
        audioProcessorRef.current.cleanup()
      }
    }
  }, [])

  // Start call
  const startCall = async () => {
    dispatch({ type: 'START_CALL' })

    if (state.isVoiceMode) {
      // Start microphone capture for waveform
      await audioProcessorRef.current.startMicrophoneCapture()

      // Start speech recognition
      sttEngineRef.current.start(
        (result) => {
          setInterimTranscript(result.interim)
          if (result.isFinal && result.final.length > 0) {
            handleUserMessage(result.final)
            setInterimTranscript('')
          }
        },
        (error) => {
          console.error('STT Error:', error)
        }
      )
    }

    dispatch({ type: 'CALL_CONNECTED' })

    // Send initial greeting with agent info
    setTimeout(() => {
      let greeting
      if (agentInfo && agentInfo.greeting) {
        greeting = agentInfo.greeting
      } else {
        greeting = `Hello ${state.userPreferences.name}, how can I assist you today?`
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: greeting, timestamp: Date.now() }
      })

      if (state.isVoiceMode) {
        ttsEngineRef.current.speak(greeting)
      }
    }, 500)
  }

  // End call
  const endCall = () => {
    if (sttEngineRef.current) {
      sttEngineRef.current.stop()
    }
    if (ttsEngineRef.current) {
      ttsEngineRef.current.stop()
    }
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stopMicrophoneCapture()
    }

    dispatch({ type: 'END_CALL' })

    setTimeout(() => {
      dispatch({ type: 'RESET_CALL' })
    }, 2000)
  }

  // Handle user message
  const handleUserMessage = async (message) => {
    if (!message.trim() || isProcessing) return

    setIsProcessing(true)

    // Add user message to conversation
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { role: 'user', content: message, timestamp: Date.now() }
    })

    try {
      // Send to backend
      const response = await api.sendMessage(
        message,
        state.conversation,
        {
          personality: state.aiPersonality,
          userPreferences: state.userPreferences
        }
      )

      // Add AI response
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: response.message,
          timestamp: Date.now()
        }
      })

      // Speak response if in voice mode
      if (state.isVoiceMode && !state.isMuted) {
        await ttsEngineRef.current.speak(response.message, {
          voiceName: state.userPreferences.voicePreference,
          rate: 0.95
        })
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMsg = 'Sorry, I encountered an error. Please try again.'
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: errorMsg, timestamp: Date.now() }
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' })
    if (state.isMuted) {
      ttsEngineRef.current.resume()
    } else {
      ttsEngineRef.current.pause()
    }
  }

  // Toggle voice/text mode
  const toggleVoiceMode = () => {
    dispatch({ type: 'TOGGLE_VOICE_MODE' })
    if (state.isVoiceMode) {
      // Switching to text mode
      sttEngineRef.current.stop()
      audioProcessorRef.current.stopMicrophoneCapture()
    } else {
      // Switching to voice mode
      audioProcessorRef.current.startMicrophoneCapture()
      sttEngineRef.current.start(
        (result) => {
          setInterimTranscript(result.interim)
          if (result.isFinal && result.final.length > 0) {
            handleUserMessage(result.final)
            setInterimTranscript('')
          }
        },
        (error) => console.error('STT Error:', error)
      )
    }
  }

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Render based on call state
  if (state.callState === CALL_STATES.IDLE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        {/* Accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        {/* Back Button - positioned consistently */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-5 py-2.5 bg-gray-900/50 backdrop-blur-xl border-2 border-gray-700/50 hover:border-cyan-500/60 rounded-xl transition-all duration-300 shadow-xl overflow-hidden"
          >
            <ArrowLeft size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">Back</span>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/20 group-hover:to-cyan-500/10 transition-all duration-300"></div>
          </button>
        </div>

        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl font-bold mb-3 text-white">
            Ready to Connect
          </h1>
          <p className="text-gray-500">Press the button below to start your call</p>
        </div>

        <button
          onClick={startCall}
          className="group relative w-20 h-20 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl z-10"
        >
          <Phone size={32} className="text-white" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  if (state.callState === CALL_STATES.ENDED) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        {/* Accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gray-900 border border-gray-800">
            <PhoneOff size={40} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-white">
            Call Ended
          </h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-8 py-4 mb-8 inline-block">
            <p className="text-gray-400 text-sm">Duration: <span className="font-semibold text-white">{formatDuration(state.callDuration)}</span></p>
          </div>

          <button
            onClick={() => dispatch({ type: 'RESET_CALL' })}
            className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <span>Start New Call</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 p-5 flex items-center justify-between shadow-xl relative z-10">
        <div className="flex items-center gap-4">
          {/* Agent Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
              {agentInfo && agentInfo.agent ? (
                <User size={24} className="text-cyan-400" strokeWidth={1.5} />
              ) : (
                <User size={24} className="text-cyan-400" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Agent Info */}
          <div>
            {isRouting ? (
              <>
                <h2 className="text-xl font-bold text-white">Routing call...</h2>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Loader size={14} className="animate-spin" />
                  Please wait
                </p>
              </>
            ) : agentInfo && agentInfo.agent ? (
              <>
                <h2 className="text-xl font-bold text-white">{agentInfo.agent.name}</h2>
                <p className="text-sm text-gray-400">
                  {agentInfo.agent.title} • <span className="text-green-400 font-medium">{formatDuration(state.callDuration)}</span>
                </p>
                <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                  {agentInfo.agent.department}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                <p className="text-sm text-green-400 font-medium">{formatDuration(state.callDuration)}</p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_TRANSCRIPT' })}
          className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 p-3 rounded-xl transition-all duration-300 transform hover:scale-110"
        >
          <FileText size={22} className="text-gray-300 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Call interface */}
        <div className={`flex flex-col flex-1 p-4 ${state.showTranscript ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Avatar/Waveform */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="w-full max-w-2xl">
              <Waveform
                isActive={state.callState === CALL_STATES.ACTIVE}
                audioProcessor={audioProcessorRef.current}
              />
              {interimTranscript && (
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-pulse">
                  <p className="text-gray-300 italic text-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    {interimTranscript}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Text input (if not in voice mode) */}
          {!state.isVoiceMode && state.callState === CALL_STATES.ACTIVE && (
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleUserMessage(inputText)
                      setInputText('')
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 focus:border-white/30 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 shadow-lg"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    handleUserMessage(inputText)
                    setInputText('')
                  }}
                  disabled={isProcessing || !inputText.trim()}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-30 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Send</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleVoiceMode}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 p-5 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-xl"
              title={state.isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
            >
              <MessageSquare size={28} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={toggleMute}
              className={`group relative ${
                state.isMuted
                  ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                  : 'bg-white/5 border-white/10 hover:border-green-500/50 hover:bg-green-500/10'
              } backdrop-blur-xl border p-5 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-xl`}
              title={state.isMuted ? 'Unmute' : 'Mute'}
            >
              {state.isMuted ? (
                <MicOff size={28} className="text-red-400 group-hover:text-red-300 transition-colors" />
              ) : (
                <Mic size={28} className="text-gray-300 group-hover:text-green-400 transition-colors" />
              )}
            </button>

            <button
              onClick={endCall}
              className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden"
            >
              <PhoneOff size={32} className="text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        </div>

        {/* Transcript sidebar */}
        {state.showTranscript && (
          <div className="w-full lg:w-1/2 border-l border-gray-700">
            <Transcript />
          </div>
        )}
      </div>
    </div>
  )
}

export default CallScreen

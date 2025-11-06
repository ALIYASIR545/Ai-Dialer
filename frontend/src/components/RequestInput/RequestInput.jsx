import React, { useState } from 'react'
import { Phone, Loader, ArrowLeft, Sparkles, Delete, PhoneCall, Settings } from 'lucide-react'

function RequestInput({ onSubmit, isLoading, onBack, onSettings }) {
  const [requestText, setRequestText] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pressedButton, setPressedButton] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // If no text entered, use a general default request
    const finalRequest = requestText.trim() || 'General assistance'
    onSubmit(finalRequest, phoneNumber)
  }

  const handleNumberClick = (num) => {
    if (phoneNumber.length < 20) {
      setPhoneNumber(phoneNumber + num)
      setPressedButton(num)
      setTimeout(() => setPressedButton(null), 200)
    }
  }

  const handleDelete = () => {
    setPhoneNumber(phoneNumber.slice(0, -1))
  }

  const handlePhoneNumberChange = (e) => {
    // Allow only numbers and special characters: +, -, (, ), space
    const value = e.target.value
    const filtered = value.replace(/[^\d+\-() ]/g, '')
    if (filtered.length <= 20) {
      setPhoneNumber(filtered)
    }
  }

  const dialButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ]

  const quickOptions = [
    { text: 'Technical support', category: 'Support', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
    { text: 'Billing inquiry', category: 'Finance', icon: '💳', color: 'from-purple-500 to-pink-500' },
    { text: 'General information', category: 'Info', icon: 'ℹ️', color: 'from-cyan-500 to-blue-500' },
    { text: 'Schedule appointment', category: 'Schedule', icon: '📅', color: 'from-indigo-500 to-purple-500' },
    { text: 'Product inquiry', category: 'Sales', icon: '📦', color: 'from-pink-500 to-rose-500' },
    { text: 'Speak to representative', category: 'General', icon: '👤', color: 'from-violet-500 to-indigo-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-violet-400/60 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-xl overflow-hidden"
        >
          <ArrowLeft size={18} className="text-violet-200 group-hover:text-white transition-colors group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm text-violet-200 group-hover:text-white transition-colors font-semibold">Back</span>
        </button>
      </div>

      {/* Settings Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={onSettings}
          disabled={isLoading}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-violet-400/60 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-xl overflow-hidden"
        >
          <Settings size={18} className="text-violet-200 group-hover:text-white transition-colors group-hover:rotate-90 transition-transform" />
          <span className="text-sm text-violet-200 group-hover:text-white transition-colors font-semibold">Settings</span>
        </button>
      </div>

      <div className="max-w-7xl w-full relative z-10 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl border-2 border-white/30"
              style={{ boxShadow: '0 25px 60px -10px rgba(139, 92, 246, 0.8), inset 0 2px 20px rgba(255, 255, 255, 0.3)' }}
            >
              <Phone size={36} className="text-white drop-shadow-2xl" strokeWidth={2.5} />
              <Sparkles className="absolute -top-1 -right-1 text-violet-300 animate-pulse" size={18} />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text"
            style={{ backgroundSize: '200%', animation: 'gradient-x 4s ease infinite' }}
          >
            Start Your Call
          </h1>
          <p className="text-violet-200 text-lg">Enter number, describe your request, or choose a quick option</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Dialpad */}
          <div className="space-y-4">
            {/* Phone Number Display/Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 rounded-2xl p-6 shadow-2xl"
                style={{ boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.5), inset 0 2px 20px rgba(255, 255, 255, 0.2)' }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <div className="text-xs text-violet-300 uppercase tracking-widest font-bold">Phone Number</div>
                  </div>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="• • •"
                    className="w-full text-3xl font-light text-white min-h-[3rem] tracking-[0.3em] text-center bg-transparent border-none focus:outline-none placeholder-violet-400/50"
                    style={{ textShadow: '0 0 30px rgba(192, 132, 252, 0.8)' }}
                  />
                </div>
              </div>
            </div>

            {/* Compact Dial Pad */}
            <div className="grid grid-cols-3 gap-2">
              {dialButtons.map((btn, index) => (
                <button
                  key={btn.num}
                  onClick={() => handleNumberClick(btn.num)}
                  className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-2 border-white/30 hover:border-violet-400/70 active:scale-95 rounded-xl p-2.5 transition-all duration-300 shadow-xl hover:shadow-violet-500/30 overflow-hidden"
                  style={{
                    boxShadow: pressedButton === btn.num
                      ? '0 5px 25px rgba(139, 92, 246, 0.6)'
                      : '0 10px 40px rgba(0, 0, 0, 0.3)',
                    transform: pressedButton === btn.num ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  <div className="text-center relative z-10">
                    <div className="text-2xl font-bold text-white mb-0.5 group-hover:scale-110 transition-transform"
                      style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.5)' }}
                    >
                      {btn.num}
                    </div>
                    {btn.letters && (
                      <div className="text-[9px] text-violet-300 tracking-wide font-bold uppercase">{btn.letters}</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 group-hover:from-violet-600/40 group-hover:to-fuchsia-600/40 rounded-xl transition-all duration-500"></div>
                </button>
              ))}
            </div>

            {/* Special Characters */}
            <div className="grid grid-cols-5 gap-2">
              {['+', '-', '(', ')', ' '].map((char) => (
                <button
                  key={char}
                  onClick={() => handleNumberClick(char)}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-violet-400/70 active:scale-95 rounded-lg p-2 transition-all duration-300 shadow-lg hover:shadow-violet-500/30 overflow-hidden"
                >
                  <div className="text-center relative z-10">
                    <div className="text-lg font-bold text-white group-hover:scale-110 transition-transform"
                      style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.5)' }}
                    >
                      {char === ' ' ? '␣' : char}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 group-hover:from-violet-600/40 group-hover:to-fuchsia-600/40 rounded-lg transition-all duration-500"></div>
                </button>
              ))}
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={phoneNumber.length === 0}
              className="group w-full relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-2 border-white/30 hover:border-red-400/70 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2">
                <Delete size={20} className="text-violet-200 group-hover:text-red-400 transition-colors" strokeWidth={2} />
                <span className="text-sm font-semibold">Delete</span>
              </div>
            </button>
          </div>

          {/* Right Side: Request Input & Quick Options */}
          <div className="space-y-4">
            {/* Request Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="E.g., I need help with my account billing... (Optional - you can start call without entering text)"
                  className="w-full bg-white/5 backdrop-blur-2xl border-2 border-white/20 focus:border-violet-400/50 focus:bg-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none h-32 placeholder-gray-400 text-sm transition-all duration-300 shadow-xl"
                  disabled={isLoading}
                />
                {requestText.length > 0 && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-violet-500/20 backdrop-blur-xl rounded-full border border-violet-400/30">
                    <span className="text-xs text-violet-300 font-semibold">{requestText.length}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-30 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl overflow-hidden"
                style={{
                  boxShadow: !isLoading ? '0 25px 60px -10px rgba(16, 185, 129, 0.7)' : 'none',
                  backgroundSize: '200% 200%',
                  animation: !isLoading ? 'gradient-x 3s ease infinite' : 'none'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader size={24} className="animate-spin" strokeWidth={2.5} />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                    <span>Start Call</span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            {/* Quick Options */}
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-violet-400 text-xs uppercase tracking-widest font-bold">Quick Options</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setRequestText(option.text)
                      onSubmit(option.text, phoneNumber)
                    }}
                    disabled={isLoading}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-400/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 px-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-left shadow-lg overflow-hidden"
                  >
                    <div className="flex items-start gap-2 relative z-10">
                      <span className="text-xl">{option.icon}</span>
                      <div className="flex-1">
                        <div className="text-[10px] text-violet-400 mb-0.5 font-bold uppercase tracking-wider">{option.category}</div>
                        <div className="text-xs text-gray-300 group-hover:text-white transition-colors font-medium leading-tight">{option.text}</div>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <Sparkles className="text-violet-400" size={14} />
            <span className="text-xs text-gray-400">AI-powered intelligent routing</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestInput

import React, { useState } from 'react'
import { MessageSquare, Phone, Loader, ArrowLeft, Sparkles } from 'lucide-react'

function RequestInput({ onSubmit, isLoading, onBack }) {
  const [requestText, setRequestText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // If no text entered, use a general default request
    const finalRequest = requestText.trim() || 'General assistance'
    onSubmit(finalRequest)
  }

  const quickOptions = [
    { text: 'Technical support', category: 'Support', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
    { text: 'Billing inquiry', category: 'Finance', icon: '💳', color: 'from-purple-500 to-pink-500' },
    { text: 'General information', category: 'Info', icon: 'ℹ️', color: 'from-cyan-500 to-blue-500' },
    { text: 'Schedule appointment', category: 'Schedule', icon: '📅', color: 'from-indigo-500 to-purple-500' },
    { text: 'Product inquiry', category: 'Sales', icon: '📦', color: 'from-pink-500 to-rose-500' },
    { text: 'Speak to representative', category: 'General', icon: '👤', color: 'from-violet-500 to-indigo-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back Button - positioned consistently */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-cyan-400/60 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-xl overflow-hidden"
        >
          <ArrowLeft size={18} className="text-gray-300 group-hover:text-cyan-400 transition-colors group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Back</span>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
        </button>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10 mt-16">
          <div className="relative inline-block mb-6">
            {/* Icon glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-2xl opacity-50 animate-pulse-slow"></div>

            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 shadow-2xl border border-white/20"
              style={{ boxShadow: '0 25px 60px -10px rgba(6, 182, 212, 0.5), inset 0 2px 20px rgba(255, 255, 255, 0.2)' }}
            >
              <MessageSquare size={48} className="text-white drop-shadow-2xl" strokeWidth={2} />
              <Sparkles className="absolute -top-1 -right-1 text-cyan-300 animate-pulse" size={20} />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text"
            style={{ backgroundSize: '200%', animation: 'gradient-x 5s ease infinite' }}
          >
            How can we help?
          </h1>
          <p className="text-gray-400 text-lg">
            Describe your request or just click Start Call for general assistance
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative mb-6">
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="E.g., I need help with my account billing... (Optional - you can start call without entering text)"
              className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 focus:border-cyan-400/50 focus:bg-white/10 text-white px-6 py-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none h-40 placeholder-gray-500 transition-all duration-300 font-light shadow-2xl"
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 10px rgba(255, 255, 255, 0.05)' }}
              disabled={isLoading}
            />
            {requestText.length > 0 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-cyan-500/20 backdrop-blur-xl rounded-full border border-cyan-400/30">
                <span className="text-xs text-cyan-300 font-semibold">{requestText.length} chars</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-30 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl disabled:shadow-none overflow-hidden"
            style={{
              boxShadow: !isLoading ? '0 25px 60px -10px rgba(59, 130, 246, 0.6)' : 'none',
              backgroundSize: '200% 200%',
              animation: !isLoading ? 'gradient-x 3s ease infinite' : 'none'
            }}
          >
            {isLoading ? (
              <>
                <Loader size={24} className="animate-spin" strokeWidth={2.5} />
                <span className="relative z-10">Connecting to agent...</span>
              </>
            ) : (
              <>
                <Phone size={24} strokeWidth={2.5} className="relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Start Call</span>
              </>
            )}

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>

        {/* Quick Options */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Quick Options</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setRequestText(option.text)
                  onSubmit(option.text)
                }}
                disabled={isLoading}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white py-5 px-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:transform-none text-left shadow-lg hover:shadow-cyan-500/20 overflow-hidden"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  animation: `float ${3 + (index % 3)}s ease-in-out infinite`,
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs text-cyan-400 mb-1 font-bold uppercase tracking-wider">{option.category}</div>
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium leading-tight">{option.text}</div>
                  </div>
                </div>

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <Sparkles className="text-cyan-400" size={16} />
            <span className="text-xs text-gray-500">AI-powered intelligent routing</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestInput

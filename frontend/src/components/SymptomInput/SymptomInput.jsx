import React, { useState } from 'react'
import { Search, Phone, Loader } from 'lucide-react'

function SymptomInput({ onSubmit, isLoading }) {
  const [requestText, setRequestText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (requestText.trim()) {
      onSubmit(requestText)
    }
  }

  // Generic quick options that work for any organization
  const quickOptions = [
    { text: 'Technical support', icon: '🔧' },
    { text: 'Billing inquiry', icon: '💳' },
    { text: 'General information', icon: 'ℹ️' },
    { text: 'Schedule appointment', icon: '📅' },
    { text: 'Product inquiry', icon: '📦' },
    { text: 'Speak to someone', icon: '👤' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Search size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            How can we help you today?
          </h1>
          <p className="text-gray-300 text-lg">
            Describe your symptoms or reason for calling
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="E.g., I'm having chest pain and shortness of breath..."
              className="w-full bg-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!symptomText.trim() || isLoading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Connecting to specialist...
              </>
            ) : (
              <>
                <Phone size={20} />
                Start Call
              </>
            )}
          </button>
        </form>

        {/* Quick Symptom Buttons */}
        <div className="space-y-3">
          <p className="text-gray-400 text-sm text-center mb-4">Or select a common issue:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickSymptoms.map((symptom, index) => (
              <button
                key={index}
                onClick={() => {
                  setSymptomText(symptom.text)
                  onSubmit(symptom.text)
                }}
                disabled={isLoading}
                className="bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 justify-center"
              >
                <span className="text-2xl">{symptom.icon}</span>
                <span className="text-sm font-medium">{symptom.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Our AI will route you to the most appropriate specialist based on your symptoms
          </p>
        </div>
      </div>
    </div>
  )
}

export default SymptomInput

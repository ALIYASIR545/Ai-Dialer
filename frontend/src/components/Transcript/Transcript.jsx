import React, { useRef, useEffect } from 'react'
import { Download, Mail } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { api } from '../../modules/api/client'

function Transcript() {
  const { state } = useCall()
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.conversation])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const exportTranscript = async (format = 'txt') => {
    try {
      const blob = await api.exportTranscript(state.conversation, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transcript-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export transcript:', error)
      // Fallback to local export
      exportLocal(format)
    }
  }

  const exportLocal = (format = 'txt') => {
    let content = ''

    if (format === 'txt') {
      content = state.conversation
        .map(msg => `[${formatTime(msg.timestamp)}] ${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n')
    } else if (format === 'json') {
      content = JSON.stringify(state.conversation, null, 2)
    } else if (format === 'md') {
      content = `# AI Dialer Transcript\n\n**Date**: ${new Date().toLocaleDateString()}\n\n`
      content += state.conversation
        .map(msg => {
          const role = msg.role === 'user' ? 'You' : 'AI Assistant'
          return `### ${role} (${formatTime(msg.timestamp)})\n\n${msg.content}\n`
        })
        .join('\n')
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const copyToClipboard = () => {
    const text = state.conversation
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n')

    navigator.clipboard.writeText(text).then(() => {
      alert('Transcript copied to clipboard!')
    })
  }

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transcript</h3>
        <div className="flex gap-2">
          <button
            onClick={() => exportLocal('txt')}
            className="btn-icon"
            title="Download as TXT"
          >
            <Download size={18} />
          </button>
          <button
            onClick={copyToClipboard}
            className="text-sm btn-secondary"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.conversation.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation to see the transcript</p>
          </div>
        ) : (
          state.conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Export options */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 mb-2">Export as:</p>
        <div className="flex gap-2">
          <button
            onClick={() => exportLocal('txt')}
            className="text-xs btn-secondary"
          >
            TXT
          </button>
          <button
            onClick={() => exportLocal('json')}
            className="text-xs btn-secondary"
          >
            JSON
          </button>
          <button
            onClick={() => exportLocal('md')}
            className="text-xs btn-secondary"
          >
            Markdown
          </button>
        </div>
      </div>
    </div>
  )
}

export default Transcript

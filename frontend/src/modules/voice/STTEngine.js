/**
 * Speech-to-Text Engine using Web Speech API
 * Converts user voice input to text
 */

class STTEngine {
  constructor() {
    this.recognition = null
    this.isListening = false
    this.onResult = null
    this.onError = null
    this.initRecognition()
  }

  initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()

    // Configuration
    this.recognition.continuous = true // Keep listening
    this.recognition.interimResults = true // Get partial results
    this.recognition.lang = 'en-US'

    // Event handlers
    this.recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (this.onResult) {
        this.onResult({
          final: finalTranscript.trim(),
          interim: interimTranscript.trim(),
          isFinal: finalTranscript.length > 0
        })
      }
    }

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (this.onError) {
        this.onError(event.error)
      }
    }

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening) {
        try {
          this.recognition.start()
        } catch (e) {
          console.error('Failed to restart recognition:', e)
          this.isListening = false
        }
      }
    }
  }

  start(onResult, onError) {
    if (!this.recognition) {
      console.error('Speech Recognition not initialized')
      return false
    }

    this.onResult = onResult
    this.onError = onError

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
      return false
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false
      this.recognition.stop()
    }
  }

  isSupported() {
    return this.recognition !== null
  }

  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang
    }
  }
}

export default STTEngine

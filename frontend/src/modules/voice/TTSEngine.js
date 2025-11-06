/**
 * Text-to-Speech Engine using Web Speech API
 * Converts AI text responses to voice
 */

class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.currentUtterance = null
    this.isSpeaking = false
    this.queue = []

    this.initVoices()
  }

  initVoices() {
    // Load available voices
    this.voices = this.synth.getVoices()

    // Chrome loads voices asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices()
      }
    }
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!text || text.trim().length === 0) {
        resolve()
        return
      }

      // Always cancel current speech before starting new one
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)

      // Apply options
      utterance.voice = this.getVoice(options.voiceName || 'default')
      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onstart = () => {
        this.isSpeaking = true
        if (options.onStart) options.onStart()
      }

      utterance.onend = () => {
        this.isSpeaking = false
        if (options.onEnd) options.onEnd()
        resolve()
      }

      utterance.onerror = (event) => {
        this.isSpeaking = false
        // Don't log 'interrupted' errors - they're expected when we cancel speech
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event)
        }
        if (options.onError) options.onError(event)
        // Resolve instead of reject for 'interrupted' errors
        if (event.error === 'interrupted') {
          resolve()
        } else {
          reject(event)
        }
      }

      this.currentUtterance = utterance
      this.synth.speak(utterance)
    })
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel()
      this.isSpeaking = false
      this.currentUtterance = null
    }
  }

  pause() {
    if (this.synth.speaking) {
      this.synth.pause()
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume()
    }
  }

  getVoice(voiceName) {
    if (voiceName === 'default') {
      return this.voices[0]
    }

    // Find voice by name or partial match
    const voice = this.voices.find(v =>
      v.name.toLowerCase().includes(voiceName.toLowerCase())
    )

    return voice || this.voices[0]
  }

  getVoicesByLanguage(lang = 'en') {
    return this.voices.filter(voice => voice.lang.startsWith(lang))
  }

  getAllVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService
    }))
  }

  getVoicePresets() {
    // Predefined voice personalities
    return {
      assistant: { rate: 1.0, pitch: 1.0, voiceName: 'default' },
      friendly: { rate: 0.95, pitch: 1.1, voiceName: 'Google US English' },
      professional: { rate: 0.9, pitch: 0.95, voiceName: 'Microsoft David' },
      energetic: { rate: 1.1, pitch: 1.15, voiceName: 'Google UK English Female' },
      calm: { rate: 0.85, pitch: 0.9, voiceName: 'Microsoft Zira' }
    }
  }

  isSupported() {
    return 'speechSynthesis' in window
  }
}

export default TTSEngine

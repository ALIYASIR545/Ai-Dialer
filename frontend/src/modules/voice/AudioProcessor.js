/**
 * Audio Processor for waveform visualization
 * Uses Web Audio API to analyze and visualize audio
 */

class AudioProcessor {
  constructor() {
    this.audioContext = null
    this.analyser = null
    this.microphone = null
    this.dataArray = null
    this.bufferLength = 0
    this.isActive = false
  }

  async init() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(this.bufferLength)

      return true
    } catch (error) {
      console.error('Failed to initialize audio processor:', error)
      return false
    }
  }

  async startMicrophoneCapture() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.microphone = this.audioContext.createMediaStreamSource(stream)
      this.microphone.connect(this.analyser)
      this.isActive = true
      return true
    } catch (error) {
      console.error('Failed to access microphone:', error)
      return false
    }
  }

  stopMicrophoneCapture() {
    if (this.microphone) {
      this.microphone.disconnect()
      this.microphone.mediaStream.getTracks().forEach(track => track.stop())
      this.microphone = null
      this.isActive = false
    }
  }

  getFrequencyData() {
    if (!this.analyser || !this.isActive) {
      return new Uint8Array(this.bufferLength || 128)
    }
    this.analyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }

  getTimeDomainData() {
    if (!this.analyser || !this.isActive) {
      return new Uint8Array(this.bufferLength || 128)
    }
    this.analyser.getByteTimeDomainData(this.dataArray)
    return this.dataArray
  }

  getAverageVolume() {
    const data = this.getFrequencyData()
    const sum = data.reduce((a, b) => a + b, 0)
    return sum / data.length / 255 // Normalize to 0-1
  }

  getNormalizedBars(barCount = 32) {
    const data = this.getFrequencyData()
    const bars = []
    const step = Math.floor(data.length / barCount)

    for (let i = 0; i < barCount; i++) {
      const start = i * step
      const end = start + step
      const slice = data.slice(start, end)
      const average = slice.reduce((a, b) => a + b, 0) / slice.length
      bars.push(average / 255) // Normalize to 0-1
    }

    return bars
  }

  cleanup() {
    this.stopMicrophoneCapture()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  isSupported() {
    return 'AudioContext' in window || 'webkitAudioContext' in window
  }
}

export default AudioProcessor

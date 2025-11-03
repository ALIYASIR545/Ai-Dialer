import React, { useEffect, useRef, useState } from 'react'

function Waveform({ isActive, audioProcessor }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [bars, setBars] = useState(Array(32).fill(0.1))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const draw = () => {
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (isActive && audioProcessor) {
        // Get real audio data
        const newBars = audioProcessor.getNormalizedBars(32)
        setBars(newBars)
      } else {
        // Simulate idle animation
        setBars(prev => prev.map((bar, i) => {
          const random = Math.random() * 0.05 + 0.05
          return Math.max(0.05, Math.min(0.15, bar + (Math.random() - 0.5) * 0.02))
        }))
      }

      // Draw bars
      const barWidth = width / bars.length
      const gap = 2

      bars.forEach((value, i) => {
        const barHeight = Math.max(4, value * height * 0.8)
        const x = i * barWidth
        const y = (height - barHeight) / 2

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, '#0ea5e9')
        gradient.addColorStop(1, '#0284c7')

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth - gap, barHeight)
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, audioProcessor, bars])

  return (
    <div className="flex items-center justify-center w-full h-32 bg-slate-800 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={128}
        className="w-full h-full"
      />
    </div>
  )
}

export default Waveform

import React, { useState, useEffect } from 'react'
import { Phone, ArrowRight, Shield, Zap, Globe, Sparkles } from 'lucide-react'

function WelcomeScreen({ onContinue }) {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center px-6 max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* 3D Floating Phone Icon */}
        <div className="mb-12 flex justify-center">
          <div
            className="relative group"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>

            {/* Middle ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-60 animate-spin-slow"></div>

            {/* Main phone container */}
            <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-12 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5), inset 0 2px 20px rgba(255, 255, 255, 0.1)'
              }}
            >
              <Phone size={72} className="text-cyan-400 drop-shadow-2xl" strokeWidth={1.5} />

              {/* Sparkle effects */}
              <Sparkles className="absolute -top-2 -right-2 text-cyan-400 animate-pulse" size={24} />
              <Sparkles className="absolute -bottom-2 -left-2 text-purple-400 animate-pulse" size={20} style={{ animationDelay: '1s' }} />
            </div>

            {/* Orbiting rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
          <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text drop-shadow-2xl"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-x 5s ease infinite'
            }}
          >
            AI Call Center
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-16 font-light max-w-3xl mx-auto leading-relaxed">
          Experience the future of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
            intelligent communication
          </span>
        </p>

        {/* 3D Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {[
            { icon: Globe, title: 'Universal Access', desc: 'Connect to any organization, anywhere', color: 'from-cyan-500 to-blue-500', delay: 0 },
            { icon: Zap, title: 'AI-Powered', desc: 'Instant intelligent routing', color: 'from-purple-500 to-pink-500', delay: 100 },
            { icon: Shield, title: '24/7 Available', desc: 'Always online, always ready', color: 'from-blue-500 to-indigo-500', delay: 200 }
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transitionDelay: `${feature.delay}ms`,
                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Card glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>

              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}
                  style={{
                    boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  <feature.icon className="text-white" size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onContinue}
          className="group relative px-12 py-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-cyan-500/50 overflow-hidden"
          style={{
            boxShadow: '0 20px 60px -10px rgba(59, 130, 246, 0.5)',
            backgroundSize: '200% 200%',
            animation: 'gradient-x 3s ease infinite'
          }}
        >
          <span className="relative flex items-center gap-3 z-10">
            Get Started
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
          </span>

          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Button glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>
        </button>

        {/* Footer badge */}
        <div className="mt-12 inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400 font-medium">Trusted by 10,000+ businesses worldwide</span>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen

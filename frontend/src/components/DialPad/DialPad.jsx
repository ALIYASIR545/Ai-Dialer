import React, { useState } from 'react'
import { Phone, Delete, ArrowLeft, PhoneCall, Sparkles } from 'lucide-react'

function DialPad({ onCall, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pressedButton, setPressedButton] = useState(null)

  const handleNumberClick = (num) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(phoneNumber + num)
      setPressedButton(num)
      setTimeout(() => setPressedButton(null), 200)
    }
  }

  const handleDelete = () => {
    setPhoneNumber(phoneNumber.slice(0, -1))
  }

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      onCall(phoneNumber)
    }
  }

  const buttons = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20"></div>
        {/* Moving gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Back Button - animated */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-violet-400/60 hover:bg-white/20 rounded-xl transition-all duration-300 shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)' }}
        >
          <ArrowLeft size={18} className="text-violet-200 group-hover:text-white transition-colors relative z-10 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm text-violet-200 group-hover:text-white transition-colors font-semibold relative z-10">Back</span>

          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-purple-600/0 to-fuchsia-600/0 group-hover:from-violet-600/30 group-hover:via-purple-600/30 group-hover:to-fuchsia-600/30 transition-all duration-500"></div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with animated icon */}
        <div className="text-center mb-12 mt-16">
          <div className="relative inline-block mb-6">
            {/* Animated glow rings */}
            <div className="absolute -inset-12 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
            <div className="absolute -inset-8 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full blur-2xl opacity-70 animate-spin-slow"></div>

            {/* Orbiting particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateX(60px)`,
                  animation: `spin-slow 8s linear infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}

            {/* Main phone icon */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl border-2 border-white/30 transform hover:scale-110 hover:rotate-6 transition-all duration-500"
              style={{
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.8), inset 0 2px 20px rgba(255, 255, 255, 0.3)',
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <Phone size={48} className="text-white drop-shadow-2xl" strokeWidth={2.5} />

              {/* Corner sparkles */}
              <Sparkles className="absolute -top-2 -right-2 text-violet-300 animate-pulse" size={24} />
              <Sparkles className="absolute -bottom-2 -left-2 text-fuchsia-300 animate-pulse" size={20} style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-violet-400/50 animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>

          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text drop-shadow-2xl"
            style={{
              backgroundSize: '200%',
              animation: 'gradient-x 4s ease infinite',
              filter: 'drop-shadow(0 0 30px rgba(192, 132, 252, 0.6))'
            }}
          >
            Dial Number
          </h1>
          <p className="text-violet-200 text-lg font-light">Enter number to connect instantly</p>
        </div>

        {/* Phone Number Display with animated border */}
        <div className="mb-10 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-slow"></div>

          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.5), inset 0 2px 20px rgba(255, 255, 255, 0.2)',
              animation: 'glow-border 3s ease-in-out infinite'
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(192, 132, 252, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(217, 70, 239, 0.3) 0%, transparent 50%)',
                animation: 'pulse 4s ease-in-out infinite'
              }}
            ></div>

            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <div className="text-xs text-violet-300 uppercase tracking-widest font-bold">Phone Number</div>
              </div>
              <div className="text-5xl font-light text-white min-h-[4rem] tracking-[0.4em] flex items-center justify-center"
                style={{
                  textShadow: '0 0 30px rgba(192, 132, 252, 0.8), 0 0 60px rgba(217, 70, 239, 0.4)',
                  animation: 'glow-text 2s ease-in-out infinite'
                }}
              >
                {phoneNumber || <span className="text-violet-400/50 tracking-normal text-4xl">• • •</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Dial Pad with animated buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {buttons.map((btn, index) => (
            <button
              key={btn.num}
              onClick={() => handleNumberClick(btn.num)}
              className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-2 border-white/30 hover:border-violet-400/70 active:scale-95 rounded-3xl p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 overflow-hidden"
              style={{
                boxShadow: pressedButton === btn.num
                  ? '0 5px 25px rgba(139, 92, 246, 0.6), inset 0 2px 15px rgba(0, 0, 0, 0.3)'
                  : '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 2px 15px rgba(255, 255, 255, 0.15)',
                animation: `float ${3 + (index % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.15}s`,
                transform: pressedButton === btn.num ? 'scale(0.95)' : 'scale(1)'
              }}
            >
              <div className="text-center relative z-10">
                <div className="text-5xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    textShadow: '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(192, 132, 252, 0.3)'
                  }}
                >
                  {btn.num}
                </div>
                {btn.letters && (
                  <div className="text-xs text-violet-300 group-hover:text-fuchsia-300 tracking-[0.3em] font-bold transition-colors uppercase">{btn.letters}</div>
                )}
              </div>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-purple-600/0 to-fuchsia-600/0 group-hover:from-violet-600/40 group-hover:via-purple-600/30 group-hover:to-fuchsia-600/40 rounded-3xl transition-all duration-500"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 30px rgba(192, 132, 252, 0.5)' }}
              ></div>

              {/* Ripple effect on press */}
              {pressedButton === btn.num && (
                <div className="absolute inset-0 rounded-3xl border-2 border-violet-400/70 animate-ping"></div>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons with animations */}
        <div className="flex gap-4 mb-8">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={phoneNumber.length === 0}
            className="group flex-1 relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-2 border-white/30 hover:border-red-400/70 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-red-500/30 overflow-hidden"
            style={{ boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)' }}
          >
            <Delete size={32} className="mx-auto text-violet-200 group-hover:text-red-400 transition-colors relative z-10 group-hover:rotate-12 transition-transform" strokeWidth={2} />

            <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-pink-600/0 group-hover:from-red-600/30 group-hover:to-pink-600/30 rounded-2xl transition-all duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Call Button with special animations */}
          <button
            onClick={handleCall}
            disabled={phoneNumber.length === 0}
            className="group flex-[2] relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-30 text-white rounded-2xl p-6 transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-black text-xl shadow-2xl disabled:shadow-none overflow-hidden"
            style={{
              boxShadow: phoneNumber.length > 0 ? '0 25px 60px -10px rgba(16, 185, 129, 0.7), inset 0 2px 20px rgba(255, 255, 255, 0.2)' : 'none',
              backgroundSize: '200% 200%',
              animation: phoneNumber.length > 0 ? 'gradient-x 3s ease infinite' : 'none'
            }}
          >
            <PhoneCall size={32} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
            <span className="relative z-10">Call Now</span>

            {/* Multiple animated effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-teal-400/0 group-hover:from-green-400/40 group-hover:to-teal-400/40 transition-all duration-500"></div>

            {/* Pulse effect when enabled */}
            {phoneNumber.length > 0 && (
              <div className="absolute inset-0 rounded-2xl border-2 border-green-300/50 animate-ping"></div>
            )}
          </button>
        </div>

        {/* Emergency Button with pulse animation */}
        <div className="flex justify-center">
          <button
            onClick={() => setPhoneNumber('911')}
            className="group relative px-8 py-4 bg-gradient-to-br from-red-600/30 to-orange-600/30 backdrop-blur-xl border-2 border-red-500/50 hover:border-red-400/80 hover:bg-red-600/40 text-red-300 hover:text-red-200 rounded-2xl transition-all duration-300 font-bold flex items-center gap-3 shadow-2xl hover:shadow-red-500/40 overflow-hidden"
            style={{
              boxShadow: '0 15px 50px rgba(220, 38, 38, 0.3), inset 0 2px 10px rgba(254, 202, 202, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <span className="text-2xl relative z-10 animate-pulse">🚨</span>
            <span className="relative z-10 text-lg">Emergency (911)</span>

            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-orange-500/0 to-red-600/0 group-hover:from-red-600/40 group-hover:via-orange-500/40 group-hover:to-red-600/40 rounded-2xl transition-all duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        @keyframes glow-border {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 40px rgba(217, 70, 239, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2); }
        }

        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 30px rgba(192, 132, 252, 0.8), 0 0 60px rgba(217, 70, 239, 0.4); }
          50% { text-shadow: 0 0 40px rgba(192, 132, 252, 1), 0 0 80px rgba(217, 70, 239, 0.6), 0 0 100px rgba(236, 72, 153, 0.4); }
        }
      `}</style>
    </div>
  )
}

export default DialPad

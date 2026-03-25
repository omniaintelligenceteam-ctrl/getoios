'use client'

import { useState, useEffect } from 'react'
import { Phone, PhoneOff } from 'lucide-react'
import { motion } from 'motion/react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { RetellWebClient } from 'retell-client-js-sdk'

type CallState = 'idle' | 'connecting' | 'connected' | 'error'

// ─── Animated Waveform ──────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center space-x-1 h-16">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-gradient-to-t from-teal-500 to-amber-400"
          style={{ width: '3px' }}
          animate={active ? {
            height: [8, Math.random() * 50 + 12, 8],
          } : {
            height: 4,
          }}
          transition={active ? {
            duration: 0.5 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.05,
          } : {
            duration: 0.3,
          }}
        />
      ))}
    </div>
  )
}

export function VoiceDemo() {
  const [callState, setCallState] = useState<CallState>('idle')
  const [retellWebClient, setRetellWebClient] = useState<RetellWebClient | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (retellWebClient) {
        retellWebClient.stopCall()
      }
    }
  }, [retellWebClient])

  const startCall = async () => {
    try {
      setCallState('connecting')
      setError('')

      const response = await fetch('/api/retell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get access token')
      }

      const { access_token } = await response.json()
      const webClient = new RetellWebClient()

      webClient.on('call_started', () => setCallState('connected'))
      webClient.on('call_ended', () => { setCallState('idle'); setRetellWebClient(null) })
      webClient.on('error', () => { setError('Call failed. Please try again.'); setCallState('error'); setRetellWebClient(null) })

      setRetellWebClient(webClient)
      await webClient.startCall({ accessToken: access_token })
    } catch (err: any) {
      setError(err.message || 'Failed to start call. Please try again.')
      setCallState('error')
      setRetellWebClient(null)
    }
  }

  const endCall = () => {
    if (retellWebClient) {
      retellWebClient.stopCall()
      setRetellWebClient(null)
    }
    setCallState('idle')
    setError('')
  }

  const resetError = () => {
    setCallState('idle')
    setError('')
  }

  return (
    <section id="voice-demo" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-card p-8 lg:p-10 relative overflow-hidden gradient-border-animated">
            <div className="text-center relative z-10">
              {/* Avatar with breathing glow */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full bg-teal-500/20"
                  animate={callState === 'connected'
                    ? { scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }
                    : { scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }
                  }
                  transition={{ duration: callState === 'connected' ? 1 : 3, repeat: Infinity }}
                />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <span className="text-3xl font-bold text-white">O</span>
                </div>
              </div>

              {callState === 'idle' && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">OIOS — AI Voice Receptionist</h3>
                    <p className="text-slate-400">by Omnia Intelligence AI</p>
                  </div>

                  <p className="text-slate-300">
                    Click below to start a live voice conversation. Ask her anything — services, scheduling, pricing.
                  </p>

                  <div className="flex justify-center">
                    <MagneticButton>
                      <button
                        onClick={startCall}
                        data-glow
                        className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white min-w-[220px] px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 btn-glow flex items-center justify-center gap-3"
                      >
                        <Phone className="w-6 h-6" />
                        Live Demo
                      </button>
                    </MagneticButton>
                  </div>
                </motion.div>
              )}

              {callState === 'connecting' && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Waveform active={false} />
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-amber-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-lg">Connecting to OIOS...</p>
                  <p className="text-slate-400 text-sm">This may take a few seconds</p>
                  <button
                    onClick={endCall}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}

              {callState === 'connected' && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Waveform active={true} />

                  <p className="text-emerald-400 font-medium text-lg flex items-center justify-center gap-2">
                    <motion.span
                      className="w-3 h-3 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Connected — Speaking with OIOS
                  </p>
                  <p className="text-slate-400">OIOS can hear you. Speak naturally!</p>

                  <button
                    onClick={endCall}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all flex items-center gap-3 mx-auto"
                  >
                    <PhoneOff className="w-6 h-6" />
                    End Call
                  </button>
                </motion.div>
              )}

              {callState === 'error' && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-medium mb-2">Call Failed</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={resetError}
                    className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

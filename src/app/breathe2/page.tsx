'use client'

import { useState, useRef, useEffect } from 'react'

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false)
  const [action, setAction] = useState('Start')
  const animationRef = useRef<number | null>(null)
  const [scale, setScale] = useState(1)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    let startTime: number
    let animationDirection = 'in'
    const MIN_SCALE = 1
    const MAX_SCALE = 1.3
    const CYCLE_DURATION = 4000 // 4 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress > CYCLE_DURATION) {
        startTime = timestamp
        animationDirection = animationDirection === 'in' ? 'out' : 'in'
        setAction(animationDirection === 'in' ? 'Breathe In' : 'Exhale two times')
      }

      const cycleProgress = (progress % CYCLE_DURATION) / CYCLE_DURATION

      let newScale, newOpacity
      if (animationDirection === 'in') {
        newScale = MIN_SCALE + cycleProgress * (MAX_SCALE - MIN_SCALE)
        newOpacity = 1 // Solid during inhale
      } else {
        newScale = MAX_SCALE - cycleProgress * (MAX_SCALE - MIN_SCALE)
        newOpacity = 0.6 + 0.4 * Math.sin(cycleProgress * Math.PI * 2) // Pulsating effect
      }

      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
      setScale(newScale)
      setOpacity(newOpacity)
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  const handleStart = () => {
    setIsActive(true)
    setAction('Breathe In')
  }

  const handleStop = () => {
    setIsActive(false)
    setAction('Start')
    setScale(1)
    setOpacity(1)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black p-4">
      {/* Control buttons */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 space-x-4">
        <button
          onClick={handleStart}
          disabled={isActive}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-all
            ${isActive
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'}`}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isActive}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-all
            ${!isActive
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'}`}
        >
          Stop
        </button>
      </div>

      {/* Action text */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2">
        <p className="text-2xl font-bold text-white mb-8">
          {action}
        </p>
      </div>

      {/* Breathing disc */}
      <div
        className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-all duration-75"
        style={{
          transform: `scale(${scale})`,
          opacity: `${opacity}`,
          boxShadow: '0 0 40px rgba(66, 153, 225, 0.6)'
        }}
      >
        <div
          className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 opacity-80"
        />
      </div>

      {/* Timer display */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-xl text-white font-mono">
          {isActive ? 'Breathing...' : 'Press Start'}
        </p>
      </div>
    </div>
  )
}

export default BreathingExercise

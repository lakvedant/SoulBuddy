'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Menu, X } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  isFollowing: boolean
  baseVx: number
  baseVy: number
  color: string
  size: number
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after a brief delay
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    resizeCanvas()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }

    const getRandomColor = () => {
      const colors = ['#8B5CF6', '#6D28D9', '#4C1D95', '#7C3AED']
      return colors[Math.floor(Math.random() * colors.length)]
    }

    const initParticles = () => {
      const particles: Particle[] = []
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000)

      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.2 + Math.random() * 0.3
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          isFollowing: false,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          color: getRandomColor(),
          size: 1 + Math.random()
        })
      }
      particlesRef.current = particles
    }
    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleClick = (e: MouseEvent) => {
      // Create burst effect
      const burstParticles = 20
      for (let i = 0; i < burstParticles; i++) {
        const angle = (i / burstParticles) * Math.PI * 2
        const speed = 2 + Math.random() * 2
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          isFollowing: false,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          color: getRandomColor(),
          size: 2 + Math.random()
        })
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('click', handleClick)
    }

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a1a40')
      gradient.addColorStop(1, '#000000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          particle.isFollowing = true
        } else if (distance > 250) {
          particle.isFollowing = false
        }

        if (particle.isFollowing) {
          const idealDistance = 250
          const distanceDiff = distance - idealDistance
          particle.vx = (dx / distance) * distanceDiff * 0.05
          particle.vy = (dy / distance) * distanceDiff * 0.05
        } else {
          particle.vx = particle.baseVx
          particle.vy = particle.baseVy
        }

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        particlesRef.current.forEach((p2, j) => {
          if (i === j) return

          if (particle.isFollowing && p2.isFollowing) {
            const dx2 = p2.x - particle.x
            const dy2 = p2.y - particle.y
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

            if (distance2 < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance2 / 100)})`
              ctx.stroke()
            }
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleClick)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full font-sans position-absolute overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
      {showContent && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl text-white font-extrabold tracking-tight mb-6">
              Unveil Your{' '}
              <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                Cosmic Blueprint
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-2xl font-bold leading-relaxed mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            with AI-Powered Spiritual Insights
          </motion.p>

          <motion.p
            className="text-lg font-bold text-purple-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Join 10,000+ spiritual seekers on their journey
          </motion.p>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="px-8 py-4 bg-purple-600 text-white  rounded-lg text-lg font-medium transition-all hover:bg-purple-700 hover:scale-105">
              Start Your Journey
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
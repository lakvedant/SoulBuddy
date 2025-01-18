'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  isFollowing: boolean
  baseVx: number
  baseVy: number
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

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

    const initParticles = () => {
      const particles: Particle[] = []
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000) // Adjusted particle count

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
          baseVy: Math.sin(angle) * speed
        })
      }
      particlesRef.current = particles
    }
    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
    }

    const animate = () => {
      // Set gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a1a40') // Purple
      gradient.addColorStop(1, '#000000') // Black
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

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
        ctx.arc(particle.x, particle.y, 1.2, 0, Math.PI * 2)
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
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance2 / 100)})`
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
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

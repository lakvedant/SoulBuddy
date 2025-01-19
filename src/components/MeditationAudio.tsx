'use client'

import { useEffect, useRef } from 'react'

interface MeditationAudioProps {
  audioSrc: string
  isPlaying: boolean
  volume?: number
}

export function MeditationAudio({ audioSrc, isPlaying, volume = 0.5 }: MeditationAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  return (
    <audio
      ref={audioRef}
      src={audioSrc}
      loop
      className="hidden"
    />
  )
}


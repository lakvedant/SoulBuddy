'use client'

import { useEffect, useRef } from 'react'

interface MeditationAudioProps {
  backgroundSound?: string
  isPlaying: boolean
  volume?: number
}

export function MeditationAudio({ backgroundSound, isPlaying, volume = 0.5 }: MeditationAudioProps) {
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

  if (!backgroundSound || backgroundSound === 'none') return null

  return (
    <audio
      ref={audioRef}
      src={`/meditation-sounds/${backgroundSound}.mp3`}
      loop
      className="hidden"
    />
  )
}


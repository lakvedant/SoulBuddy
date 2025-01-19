// 'use client'

// import { useEffect, useRef } from 'react'

// interface MeditationAudioProps {
//   audioSrc: string
//   isPlaying: boolean
//   volume?: number
// }

// export function MeditationAudio({ audioSrc, isPlaying, volume = 0.5 }: MeditationAudioProps) {
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     if (!audioRef.current) return

//     if (isPlaying) {
//       audioRef.current.play().catch(error => console.error('Audio playback failed:', error))
//     } else {
//       audioRef.current.pause()
//     }
//   }, [isPlaying])

//   useEffect(() => {
//     if (!audioRef.current) return
//     audioRef.current.volume = volume
//   }, [volume])

//   useEffect(() => {
//     if (!audioRef.current) return
//     audioRef.current.src = audioSrc
//   }, [audioSrc])

//   return (
//     <audio
//       ref={audioRef}
//       loop
//       className="hidden"
//     />
//   )
// }


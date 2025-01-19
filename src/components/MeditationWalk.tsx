'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as LabelPrimitives from '@radix-ui/react-label'
import { cn } from '@/lib/utils'
import { Pause, Play, SkipForward, Moon, Sun, Cloud, Focus, Music2 } from 'lucide-react'
import { MeditationAudio } from './meditation-audio' // Updated import statement

// Updated types to include music selection
type MeditationGoal = 'calm' | 'visualize' | 'manifest' | 'focus'
type MeditationDuration = 5 | 10 | 15
type MusicTrack = 'cosmic' | 'nature' | 'crystal'

interface MeditationSettings {
  goal: MeditationGoal
  duration: MeditationDuration
  backgroundSound?: string
  musicTrack: MusicTrack
  skipIntro?: boolean
}

interface MeditationProgress {
  currentStep: number
  isPlaying: boolean
  currentTime: number
}

// Music tracks data
const musicTracks = {
  5: {
    cosmic: '/meditation-sounds/cosmic-5min.mp3',
    nature: '/meditation-sounds/5 Minute Music Meditation  5 Minutes to Calm  Scenic Waterfall and Nature Sounds.mp3',
    crystal: '/meditation-sounds/crystal-5min.mp3',
  },
  10: {
    cosmic: '/meditation-sounds/cosmic-10min.mp3',
    nature: '/meditation-sounds/nature-10min.mp3',
    crystal: '/meditation-sounds/Guided 10 Minute Mountain Meditation _ Become the Mountain [h-orIuh4FhQ].mp3',
  },
  15: {
    cosmic: '/meditation-sounds/cosmic-15min.mp3',
    nature: '/meditation-sounds/nature-15min.mp3',
    crystal: '/meditation-sounds/crystal-15min.mp3',
  },
}

// Components remain the same as before...
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitives.Root
    ref={ref}
    className={cn(
      "text-lg font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-6 w-full overflow-hidden rounded-full bg-purple-900/20 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))

export default function MeditationWalkthrough() {
  const [settings, setSettings] = useState<MeditationSettings>({
    goal: 'calm',
    duration: 5,
    musicTrack: 'cosmic',
    skipIntro: false,
  })

  const [progress, setProgress] = useState<MeditationProgress>({
    currentStep: 0,
    isPlaying: false,
    currentTime: 0,
  })

  const [showSetup, setShowSetup] = useState(true)

  useEffect(() => {
    if (progress.isPlaying) {
      const timer = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          currentTime: Math.min(prev.currentTime + 1, settings.duration * 60)
        }))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [progress.isPlaying, settings.duration])

  const handleStart = () => {
    setShowSetup(false)
    setProgress(prev => ({ ...prev, isPlaying: true }))
  }

  const togglePlayPause = () => {
    setProgress(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a103d] via-[#2d1b69] to-[#1a103d] p-6 md:p-12">
      <Card className="mx-auto max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/20 shadow-2xl shadow-purple-500/20">
        <CardHeader className="space-y-4">
          <CardTitle className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-fuchsia-300 via-white to-purple-300 bg-clip-text text-transparent">
            Cosmic Meditation Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {showSetup ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="goal" className="text-2xl">Choose your meditation goal</Label>
                <Select
                  value={settings.goal}
                  onValueChange={(value) => setSettings({ ...settings, goal: value as MeditationGoal })}
                >
                  <SelectTrigger 
                    id="goal" 
                    className="h-14 text-lg bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border-purple-500/30 text-white hover:from-purple-800/40 hover:to-fuchsia-800/40 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-900/95 to-fuchsia-900/95 border-purple-500/30 text-white backdrop-blur-xl">
                    <SelectItem value="calm" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-purple-300" />
                        Calm the mind
                      </div>
                    </SelectItem>
                    <SelectItem value="visualize" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-300" />
                        Visualization
                      </div>
                    </SelectItem>
                    <SelectItem value="manifest" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-blue-300" />
                        Manifestation
                      </div>
                    </SelectItem>
                    <SelectItem value="focus" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Focus className="h-5 w-5 text-green-300" />
                        Improve focus
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="duration" className="text-2xl">Duration (minutes)</Label>
                <Select
                  value={settings.duration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, duration: parseInt(value) as MeditationDuration })}
                >
                  <SelectTrigger 
                    id="duration" 
                    className="h-14 text-lg bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border-purple-500/30 text-white hover:from-purple-800/40 hover:to-fuchsia-800/40 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-900/95 to-fuchsia-900/95 border-purple-500/30 text-white backdrop-blur-xl">
                    <SelectItem value="5" className="text-lg focus:bg-white/10 cursor-pointer">5 minutes</SelectItem>
                    <SelectItem value="10" className="text-lg focus:bg-white/10 cursor-pointer">10 minutes</SelectItem>
                    <SelectItem value="15" className="text-lg focus:bg-white/10 cursor-pointer">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="music" className="text-2xl">Choose Your Music</Label>
                <Select
                  value={settings.musicTrack}
                  onValueChange={(value) => setSettings({ ...settings, musicTrack: value as MusicTrack })}
                >
                  <SelectTrigger 
                    id="music" 
                    className="h-14 text-lg bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border-purple-500/30 text-white hover:from-purple-800/40 hover:to-fuchsia-800/40 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select music" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-900/95 to-fuchsia-900/95 border-purple-500/30 text-white backdrop-blur-xl">
                    <SelectItem value="cosmic" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Music2 className="h-5 w-5 text-purple-300" />
                        Cosmic Harmony
                      </div>
                    </SelectItem>
                    <SelectItem value="nature" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Music2 className="h-5 w-5 text-green-300" />
                        Nature's Symphony
                      </div>
                    </SelectItem>
                    <SelectItem value="crystal" className="text-lg focus:bg-white/10 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Music2 className="h-5 w-5 text-blue-300" />
                        Crystal Resonance
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-4 bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <Label htmlFor="skip-intro" className="text-xl">Skip introduction</Label>
                <Switch
                  id="skip-intro"
                  checked={settings.skipIntro}
                  onCheckedChange={(checked) => setSettings({ ...settings, skipIntro: checked })}
                />
              </div>

              <Button 
                onClick={handleStart} 
                className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 hover:from-purple-500 hover:via-fuchsia-400 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                Begin Your Journey
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold mb-2">
                  <h3 className="bg-gradient-to-r from-fuchsia-300 via-white to-purple-300 bg-clip-text text-transparent">
                    {settings.goal === 'calm' && 'Finding Inner Peace'}
                    {settings.goal === 'visualize' && 'Creative Visualization'}
                    {settings.goal === 'manifest' && 'Manifestation Journey'}
                    {settings.goal === 'focus' && 'Focused Attention'}
                  </h3>
                </div>
                <p className="text-xl text-purple-200/80">
                  {Math.floor(progress.currentTime / 60)}:{(progress.currentTime % 60).toString().padStart(2, '0')} / {settings.duration}:00
                </p>
              </div>

              <Progress 
                value={(progress.currentTime / (settings.duration * 60)) * 100}
                className="h-8"
              />

              <div className="flex justify-center gap-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 hover:from-purple-800/50 hover:to-fuchsia-800/50 transition-all duration-300"
                >
                  {progress.isPlaying ? 
                    <Pause className="h-8 w-8 text-purple-200" /> : 
                    <Play className="h-8 w-8 text-purple-200" />
                  }
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-16 h-16 rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 hover:from-purple-800/50 hover:to-fuchsia-800/50 transition-all duration-300"
                >
                  <SkipForward className="h-8 w-8 text-purple-200" />
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xl text-purple-200/80">Current Streak: 3 days</p>
                <p className="text-lg text-purple-300/60">Total Sessions: 12</p>
              </div>

              <MeditationAudio
                isPlaying={progress.isPlaying}
                audioSrc={musicTracks[settings.duration][settings.musicTrack]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


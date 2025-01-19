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
import { Pause, Play, SkipForward, Moon, Sun, Cloud, Focus } from 'lucide-react'

// Types defined in the same file
type MeditationGoal = 'calm' | 'visualize' | 'manifest' | 'focus'
type MeditationDuration = 5 | 10 | 15

interface MeditationSettings {
  goal: MeditationGoal
  duration: MeditationDuration
  backgroundSound?: string
  skipIntro?: boolean
}

interface MeditationProgress {
  currentStep: number
  isPlaying: boolean
  currentTime: number
}

// Switch Component with updated styling
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
Switch.displayName = SwitchPrimitives.Root.displayName

// Label Component with updated styling
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
Label.displayName = LabelPrimitives.Root.displayName

// Progress Component with updated styling
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
      className="h-full w-full flex-1 bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export default function MeditationWalkthrough() {
  const [settings, setSettings] = useState<MeditationSettings>({
    goal: 'calm',
    duration: 5,
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

  const getGoalIcon = (goal: MeditationGoal) => {
    switch (goal) {
      case 'calm': return <Moon className="h-6 w-6" />
      case 'visualize': return <Sun className="h-6 w-6" />
      case 'manifest': return <Cloud className="h-6 w-6" />
      case 'focus': return <Focus className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a103d] to-[#2d1b69] p-6 md:p-12">
      <Card className="mx-auto max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/20">
        <CardHeader className="space-y-4">
          <CardTitle className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
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
                  onValueChange={(value) => setSettings({ ...settings, goal: value as any })}
                >
                  <SelectTrigger id="goal" className="h-14 text-lg bg-purple-900/20 border-purple-500/30">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a103d] border-purple-500/30">
                    <SelectItem value="calm" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5" />
                        Calm the mind
                      </div>
                    </SelectItem>
                    <SelectItem value="visualize" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        Visualization
                      </div>
                    </SelectItem>
                    <SelectItem value="manifest" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-5 w-5" />
                        Manifestation
                      </div>
                    </SelectItem>
                    <SelectItem value="focus" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Focus className="h-5 w-5" />
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
                  onValueChange={(value) => setSettings({ ...settings, duration: parseInt(value) as any })}
                >
                  <SelectTrigger id="duration" className="h-14 text-lg bg-purple-900/20 border-purple-500/30">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a103d] border-purple-500/30">
                    <SelectItem value="5" className="text-lg">5 minutes</SelectItem>
                    <SelectItem value="10" className="text-lg">10 minutes</SelectItem>
                    <SelectItem value="15" className="text-lg">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="sound" className="text-2xl">Background Sound</Label>
                <Select
                  value={settings.backgroundSound}
                  onValueChange={(value) => setSettings({ ...settings, backgroundSound: value })}
                >
                  <SelectTrigger id="sound" className="h-14 text-lg bg-purple-900/20 border-purple-500/30">
                    <SelectValue placeholder="Choose background sound" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a103d] border-purple-500/30">
                    <SelectItem value="rain" className="text-lg">Cosmic Rain</SelectItem>
                    <SelectItem value="forest" className="text-lg">Mystical Forest</SelectItem>
                    <SelectItem value="waves" className="text-lg">Celestial Waves</SelectItem>
                    <SelectItem value="none" className="text-lg">No Sound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-4 bg-purple-900/20 p-6 rounded-xl">
                <Label htmlFor="skip-intro" className="text-xl">Skip introduction</Label>
                <Switch
                  id="skip-intro"
                  checked={settings.skipIntro}
                  onCheckedChange={(checked) => setSettings({ ...settings, skipIntro: checked })}
                />
              </div>

              <Button 
                onClick={handleStart} 
                className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all duration-300"
              >
                Begin Your Journey
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  {getGoalIcon(settings.goal)}
                  <h3>
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
                  className="w-16 h-16 rounded-full border-2 border-purple-500/50 bg-purple-900/30 hover:bg-purple-800/50 transition-all duration-300"
                >
                  {progress.isPlaying ? 
                    <Pause className="h-8 w-8 text-purple-200" /> : 
                    <Play className="h-8 w-8 text-purple-200" />
                  }
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-16 h-16 rounded-full border-2 border-purple-500/50 bg-purple-900/30 hover:bg-purple-800/50 transition-all duration-300"
                >
                  <SkipForward className="h-8 w-8 text-purple-200" />
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xl text-purple-200/80">Current Streak: 3 days</p>
                <p className="text-lg text-purple-300/60">Total Sessions: 12</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


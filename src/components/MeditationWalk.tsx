'use client'

import { useState } from 'react'
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
import { Pause, Play, SkipForward } from 'lucide-react'

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

// Switch Component
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

// Label Component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitives.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitives.Root.displayName

// Progress Component
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
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

  const handleStart = () => {
    setShowSetup(false)
    setProgress(prev => ({ ...prev, isPlaying: true }))
  }

  const togglePlayPause = () => {
    setProgress(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Meditation Walkthrough</CardTitle>
        </CardHeader>
        <CardContent>
          {showSetup ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Choose your meditation goal</Label>
                <Select
                  value={settings.goal}
                  onValueChange={(value) => setSettings({ ...settings, goal: value as any })}
                >
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calm the mind</SelectItem>
                    <SelectItem value="visualize">Visualization</SelectItem>
                    <SelectItem value="manifest">Manifestation</SelectItem>
                    <SelectItem value="focus">Improve focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={settings.duration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, duration: parseInt(value) as any })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sound">Background Sound</Label>
                <Select
                  value={settings.backgroundSound}
                  onValueChange={(value) => setSettings({ ...settings, backgroundSound: value })}
                >
                  <SelectTrigger id="sound">
                    <SelectValue placeholder="Choose background sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="waves">Ocean Waves</SelectItem>
                    <SelectItem value="none">No Sound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-intro"
                  checked={settings.skipIntro}
                  onCheckedChange={(checked) => setSettings({ ...settings, skipIntro: checked })}
                />
                <Label htmlFor="skip-intro">Skip introduction</Label>
              </div>

              <Button onClick={handleStart} className="w-full">
                Begin Meditation
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">
                  {settings.goal === 'calm' && 'Finding Inner Peace'}
                  {settings.goal === 'visualize' && 'Creative Visualization'}
                  {settings.goal === 'manifest' && 'Manifestation Journey'}
                  {settings.goal === 'focus' && 'Focused Attention'}
                </h3>
                <p className="text-muted-foreground">
                  {progress.currentTime} / {settings.duration * 60} seconds
                </p>
              </div>

              <Progress value={(progress.currentTime / (settings.duration * 60)) * 100} />

              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                  {progress.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Current Streak: 3 days</p>
                <p>Total Sessions: 12</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


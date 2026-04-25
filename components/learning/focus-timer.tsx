"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Timer, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

const FOCUS_TIME = 25 * 60 // 25 minutes in seconds

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME)
  const [isRunning, setIsRunning] = useState(false)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(FOCUS_TIME)
  }, [])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Timer className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">Focus Timer</span>
        </div>

        {/* Circular Progress */}
        <div className="relative w-36 h-36 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-secondary"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="url(#focusTimerGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 64}
              strokeDashoffset={2 * Math.PI * 64 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="focusTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground mt-1">minutes</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            aria-label="Reset timer"
            className="border-border/60 hover:bg-secondary rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            className={cn(
              "px-8 rounded-xl transition-all duration-200 cursor-pointer shadow-md",
              isRunning
                ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent/15"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/15"
            )}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Screen reader announcement for timer completion */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {timeLeft === 0 && "Focus session complete. Great work! Take a short break."}
        </div>

        {/* Break reminder */}
        <div className="mt-5 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coffee className="w-4 h-4 text-accent" />
            <span>Take a 5 min break after each session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

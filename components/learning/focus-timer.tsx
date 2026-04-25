"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Focus Timer</span>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="border-border/50 hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "px-8 transition-all duration-300",
              isRunning
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
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
      </CardContent>
    </Card>
  )
}

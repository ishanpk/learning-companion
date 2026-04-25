"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "./progress-ring"
import { Flame, Clock, BookOpen, Play } from "lucide-react"

interface CourseCardProps {
  title: string
  description: string
  progress: number
  streak: number
  lessonsLeft: number
  estimatedTime: string
  category: string
  onResume: () => void
}

export function CourseCard({
  title,
  description,
  progress,
  streak,
  lessonsLeft,
  estimatedTime,
  category,
  onResume,
}: CourseCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      {/* Glassmorphism highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Progress Ring */}
          <ProgressRing progress={progress} size={72} strokeWidth={5} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {category}
              </Badge>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-4 h-4 fill-orange-400" />
                  <span className="text-xs font-semibold">{streak} day streak</span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-lg text-foreground truncate mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lessonsLeft} lessons left</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{estimatedTime}</span>
                </div>
              </div>

              <Button 
                size="sm" 
                onClick={onResume}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300"
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Resume
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

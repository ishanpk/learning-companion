import { memo } from "react"
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

export const CourseCard = memo(({
  title,
  description,
  progress,
  streak,
  lessonsLeft,
  estimatedTime,
  category,
  onResume,
}: CourseCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="relative p-6">
        <div className="flex items-start gap-5">
          {/* Progress Ring */}
          <ProgressRing progress={progress} size={76} strokeWidth={6} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0 rounded-full px-3">
                {category}
              </Badge>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold">{streak} days</span>
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg text-foreground truncate mb-1.5">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{lessonsLeft} lessons left</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{estimatedTime}</span>
                </div>
              </div>

              <Button 
                size="sm" 
                onClick={onResume}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md shadow-primary/10 transition-all duration-200 rounded-xl cursor-pointer px-5"
              >
                <Play className="w-4 h-4 mr-1.5 fill-current" />
                Continue
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

CourseCard.displayName = "CourseCard"

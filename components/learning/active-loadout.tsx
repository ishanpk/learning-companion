"use client"

import { Star, Zap, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActiveSkill {
  id: string
  name: string
  icon: string
  isEvolved: boolean
  level: number
}

interface ActiveLoadoutProps {
  skills?: ActiveSkill[]
}

const defaultSkills: ActiveSkill[] = [
  { id: "1", name: "Pattern Recognition", icon: "🧠", isEvolved: true, level: 15 },
  { id: "2", name: "Data Preprocessing", icon: "📊", isEvolved: false, level: 12 },
]

export function ActiveLoadout({ skills = defaultSkills }: ActiveLoadoutProps) {
  const evolvedCount = skills.filter(s => s.isEvolved).length

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">Active Skills</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full cursor-help">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span className="font-medium">{evolvedCount}/2</span>
                  <Info className="w-3 h-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Maximum 2 evolved skills per session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-3">
          {skills.map((skill) => (
            <TooltipProvider key={skill.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl relative transition-all duration-200 hover:scale-105 cursor-pointer",
                      skill.isEvolved
                        ? "bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-200 shadow-sm"
                        : "bg-secondary/50 border border-border/60"
                    )}
                  >
                    {skill.icon}
                    {skill.isEvolved && (
                      <Star className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-400" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-semibold">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">Level {skill.level}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Empty slots */}
          {[...Array(Math.max(0, 4 - skills.length))].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-12 rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center"
            >
              <span className="text-muted-foreground/40 text-lg">+</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

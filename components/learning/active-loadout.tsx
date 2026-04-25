"use client"

import { Crown, Zap, Info } from "lucide-react"
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
    <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Active Focus Loadout</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span>{evolvedCount}/2</span>
                <Info className="w-3 h-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Maximum 2 evolved skills per session</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-2">
        {skills.map((skill) => (
          <TooltipProvider key={skill.id}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-lg relative transition-transform hover:scale-110",
                    skill.isEvolved
                      ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20 ring-1 ring-yellow-400/30"
                      : "bg-primary/10"
                  )}
                >
                  {skill.icon}
                  {skill.isEvolved && (
                    <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">Level {skill.level}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Empty slots */}
        {[...Array(Math.max(0, 5 - skills.length))].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-10 h-10 rounded-lg border border-dashed border-border/50 flex items-center justify-center"
          >
            <span className="text-muted-foreground/30 text-sm">+</span>
          </div>
        ))}
      </div>
    </div>
  )
}

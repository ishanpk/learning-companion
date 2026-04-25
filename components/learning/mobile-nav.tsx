"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Route, Zap, Settings } from "lucide-react"

interface MobileNavProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "paths", label: "Paths", icon: Route },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
]

export function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/60 shadow-lg shadow-black/5">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl transition-all duration-200 cursor-pointer",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

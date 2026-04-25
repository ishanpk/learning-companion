"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Route, BarChart3, Settings, Zap } from "lucide-react"

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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_var(--primary)]")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

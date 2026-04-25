"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Route,
  BarChart3,
  Settings,
  Sparkles,
  GraduationCap,
  Zap,
  Sun,
} from "lucide-react"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "paths", label: "My Paths", icon: Route },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-border/60 bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/60">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent" />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">Learning</h1>
          <p className="text-sm text-muted-foreground">Companion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Motivational Footer */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="w-5 h-5 text-accent" />
          <p className="text-sm font-semibold text-foreground">Daily Tip</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Take breaks every 25 minutes to keep your mind fresh and focused.
        </p>
      </div>
    </aside>
  )
}

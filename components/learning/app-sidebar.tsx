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
} from "lucide-react"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "paths", label: "My Paths", icon: Route },
  { id: "skills", label: "Skill Loadout", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Learning</h1>
          <p className="text-xs text-muted-foreground">Companion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">Pro Tip</p>
          <p className="text-sm text-foreground mt-1">
            Study for 25 mins, then take a 5 min break
          </p>
        </div>
      </div>
    </aside>
  )
}

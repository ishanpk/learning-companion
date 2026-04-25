"use client"

import { useState, useEffect, Suspense } from "react"
import { AppSidebar } from "@/components/learning/app-sidebar"
import { MobileNav } from "@/components/learning/mobile-nav"
import dynamic from "next/dynamic"
import { DashboardView } from "@/components/learning/dashboard-view"

// Performance: Lazy load heavy components to reduce initial bundle size
const StudyView = dynamic(() => import("@/components/learning/study-view").then(m => m.StudyView), {
  loading: () => <ViewSkeleton />
})
const QuizView = dynamic(() => import("@/components/learning/quiz-view").then(m => m.QuizView), {
  loading: () => <ViewSkeleton />
})
const DailyWarmup = dynamic(() => import("@/components/learning/daily-warmup").then(m => m.DailyWarmup))
const ScenarioMode = dynamic(() => import("@/components/learning/scenario-mode").then(m => m.ScenarioMode), {
  loading: () => <ViewSkeleton />
})
const LearningPathsView = dynamic(() => import("@/components/learning/learning-paths-view").then(m => m.LearningPathsView), {
  loading: () => <ViewSkeleton />
})
const SkillLoadout = dynamic(() => import("@/components/learning/skill-loadout").then(m => m.SkillLoadout), {
  loading: () => <ViewSkeleton />
})
const CapstoneView = dynamic(() => import("@/components/learning/capstone-view").then(m => m.CapstoneView), {
  loading: () => <ViewSkeleton />
})

/**
 * Loading skeleton for smooth view transitions
 */
function ViewSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading study session...</p>
      </div>
    </div>
  )
}

type ViewType = "dashboard" | "study" | "quiz" | "scenario" | "paths" | "skills" | "analytics" | "settings" | "capstone"

export default function LearningCompanion() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard")
  const [showWarmup, setShowWarmup] = useState(false)
  const [hasCompletedWarmup, setHasCompletedWarmup] = useState(false)

  // Show warmup modal when user navigates to study for the first time
  useEffect(() => {
    if (activeView === "study" && !hasCompletedWarmup) {
      // Small delay to let the view transition first
      const timer = setTimeout(() => {
        setShowWarmup(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [activeView, hasCompletedWarmup])

  const handleStartStudy = () => {
    setActiveView("study")
  }

  const handleCompleteLesson = () => {
    setActiveView("quiz")
  }

  const handleBackToDashboard = () => {
    setActiveView("dashboard")
  }

  const handleBackToStudy = () => {
    setActiveView("study")
  }

  const handleQuizComplete = () => {
    // Show capstone after quiz completion (simulating course completion)
    setActiveView("capstone")
  }

  const handleWarmupComplete = () => {
    setShowWarmup(false)
    setHasCompletedWarmup(true)
  }

  const handleSwitchToScenario = () => {
    setActiveView("scenario")
  }

  const handleScenarioComplete = () => {
    setActiveView("dashboard")
  }

  const handleAcceptProject = (projectId: string) => {
    // In a real app, this would start the capstone project
    setActiveView("dashboard")
  }

  const renderView = () => {
    switch (activeView) {
      case "study":
        return (
          <StudyView 
            onBack={handleBackToDashboard} 
            onComplete={handleCompleteLesson} 
          />
        )
      case "quiz":
        return (
          <QuizView 
            onBack={handleBackToStudy} 
            onComplete={handleQuizComplete}
            onSwitchToScenario={handleSwitchToScenario}
          />
        )
      case "scenario":
        return (
          <ScenarioMode
            onBack={() => setActiveView("quiz")}
            onComplete={handleScenarioComplete}
          />
        )
      case "paths":
        return (
          <LearningPathsView
            onBack={handleBackToDashboard}
            onStartLesson={handleStartStudy}
          />
        )
      case "skills":
        return (
          <SkillLoadout
            onBack={handleBackToDashboard}
          />
        )
      case "capstone":
        return (
          <CapstoneView
            onBack={handleBackToDashboard}
            onAcceptProject={handleAcceptProject}
          />
        )
      case "analytics":
      case "settings":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2 capitalize">
                {activeView}
              </h2>
              <p className="text-muted-foreground">
                This section is coming soon!
              </p>
            </div>
          </div>
        )
      default:
        return <DashboardView onStartStudy={handleStartStudy} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Daily Warmup Modal */}
      <DailyWarmup
        isOpen={showWarmup}
        onClose={() => setShowWarmup(false)}
        onComplete={handleWarmupComplete}
      />

      {/* Desktop Sidebar */}
      <AppSidebar 
        activeView={activeView} 
        onViewChange={(view) => setActiveView(view as ViewType)} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <Suspense fallback={<ViewSkeleton />}>
          {renderView()}
        </Suspense>
      </main>

      {/* Mobile Navigation */}
      <MobileNav 
        activeView={activeView} 
        onViewChange={(view) => setActiveView(view as ViewType)} 
      />
    </div>
  )
}

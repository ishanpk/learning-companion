"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Circle, Lock, Zap, TrendingUp, RotateCcw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LearningPathsViewProps {
  onBack: () => void
  onStartLesson: () => void
}

interface PathNode {
  id: string
  title: string
  status: "completed" | "current" | "upcoming" | "locked" | "review" | "fast-track"
  type: "lesson" | "quiz" | "project"
  estimatedTime: string
}

const pathNodes: PathNode[] = [
  { id: "1", title: "Introduction to ML", status: "completed", type: "lesson", estimatedTime: "15m" },
  { id: "2", title: "Data Preprocessing", status: "completed", type: "lesson", estimatedTime: "25m" },
  { id: "3", title: "Quiz: Basics", status: "completed", type: "quiz", estimatedTime: "10m" },
  { id: "4", title: "Neural Networks", status: "current", type: "lesson", estimatedTime: "30m" },
  { id: "5", title: "Activation Functions", status: "fast-track", type: "lesson", estimatedTime: "20m" },
  { id: "6", title: "Backpropagation", status: "upcoming", type: "lesson", estimatedTime: "35m" },
  { id: "7", title: "Quiz: Networks", status: "upcoming", type: "quiz", estimatedTime: "15m" },
  { id: "8", title: "Practice Project", status: "locked", type: "project", estimatedTime: "1h" },
  { id: "9", title: "Advanced Topics", status: "locked", type: "lesson", estimatedTime: "45m" },
]

const reviewNodes: PathNode[] = [
  { id: "r1", title: "Review: Data Types", status: "review", type: "lesson", estimatedTime: "10m" },
  { id: "r2", title: "Review: Functions", status: "review", type: "quiz", estimatedTime: "8m" },
]

export function LearningPathsView({ onBack, onStartLesson }: LearningPathsViewProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"fast-track" | "review">("fast-track")

  useEffect(() => {
    // Simulate path adjustment notification
    const timer = setTimeout(() => {
      setToastType("fast-track")
      setToastMessage("You're doing great! Skipping ahead to Activation Functions.")
      setShowToast(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const getNodeIcon = (node: PathNode) => {
    switch (node.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-accent" />
      case "current":
        return <div className="w-5 h-5 rounded-full bg-primary animate-pulse" />
      case "fast-track":
        return <Zap className="w-5 h-5 text-yellow-400" />
      case "review":
        return <RotateCcw className="w-5 h-5 text-orange-400" />
      case "locked":
        return <Lock className="w-4 h-4 text-muted-foreground" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getNodeStyles = (node: PathNode) => {
    switch (node.status) {
      case "completed":
        return "border-accent/30 bg-accent/5"
      case "current":
        return "border-primary bg-primary/10 ring-2 ring-primary/30"
      case "fast-track":
        return "border-yellow-400/30 bg-yellow-400/5 border-dashed"
      case "review":
        return "border-orange-400/30 bg-orange-400/5 border-dashed"
      case "locked":
        return "border-border/30 bg-secondary/30 opacity-60"
      default:
        return "border-border/50 bg-card/50"
    }
  }

  return (
    <div className="flex-1 overflow-auto relative">
      {/* Toast Notification */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 transition-all duration-500 transform",
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <Card className={cn(
          "border shadow-xl max-w-sm",
          toastType === "fast-track" 
            ? "border-yellow-400/30 bg-yellow-400/10 backdrop-blur-xl" 
            : "border-orange-400/30 bg-orange-400/10 backdrop-blur-xl"
        )}>
          <CardContent className="p-4 flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              toastType === "fast-track" ? "bg-yellow-400/20" : "bg-orange-400/20"
            )}>
              {toastType === "fast-track" ? (
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              ) : (
                <RotateCcw className="w-5 h-5 text-orange-400" />
              )}
            </div>
            <div>
              <p className={cn(
                "font-semibold text-sm",
                toastType === "fast-track" ? "text-yellow-400" : "text-orange-400"
              )}>
                Path Adjusted
              </p>
              <p className="text-sm text-foreground/80 mt-1">{toastMessage}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Introduction to Machine Learning
          </h1>
          <p className="text-muted-foreground">Your personalized learning path adapts based on your performance</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-muted-foreground">Fast-track</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-orange-400" />
            <span className="text-muted-foreground">Review</span>
          </div>
        </div>

        {/* Review Detour (if any) */}
        {reviewNodes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Suggested Review</h3>
                <p className="text-xs text-muted-foreground">Based on your quiz performance</p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {reviewNodes.map((node) => (
                <Card
                  key={node.id}
                  className={cn(
                    "shrink-0 border-2 cursor-pointer hover:scale-[1.02] transition-all",
                    getNodeStyles(node)
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    {getNodeIcon(node)}
                    <div>
                      <p className="font-medium text-foreground text-sm">{node.title}</p>
                      <p className="text-xs text-muted-foreground">{node.estimatedTime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Learning Path */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-border" />

          <div className="space-y-4">
            {pathNodes.map((node, index) => {
              const isLast = index === pathNodes.length - 1
              const showBranch = node.status === "fast-track" || node.status === "review"

              return (
                <div key={node.id} className="relative">
                  {/* Branch indicator for adaptive paths */}
                  {showBranch && (
                    <div className="absolute left-6 -ml-px w-8 h-0.5 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-yellow-400/50" />
                  )}

                  <Card
                    className={cn(
                      "ml-12 border-2 transition-all cursor-pointer",
                      getNodeStyles(node),
                      node.status !== "locked" && "hover:scale-[1.01]"
                    )}
                    onClick={() => {
                      if (node.status !== "locked") {
                        onStartLesson()
                      }
                    }}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Node indicator on the line */}
                        <div
                          className={cn(
                            "absolute left-4 w-5 h-5 rounded-full flex items-center justify-center",
                            node.status === "completed" && "bg-accent",
                            node.status === "current" && "bg-primary",
                            node.status === "fast-track" && "bg-yellow-400",
                            node.status === "review" && "bg-orange-400",
                            node.status === "upcoming" && "bg-secondary border-2 border-border",
                            node.status === "locked" && "bg-secondary border-2 border-border"
                          )}
                        >
                          {node.status === "completed" && <CheckCircle2 className="w-3 h-3 text-accent-foreground" />}
                          {node.status === "fast-track" && <Zap className="w-3 h-3 text-yellow-900" />}
                          {node.status === "review" && <RotateCcw className="w-3 h-3 text-orange-900" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{node.title}</p>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              node.type === "lesson" && "bg-primary/20 text-primary",
                              node.type === "quiz" && "bg-accent/20 text-accent",
                              node.type === "project" && "bg-purple-500/20 text-purple-400"
                            )}>
                              {node.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{node.estimatedTime}</p>
                        </div>
                      </div>

                      {node.status === "current" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStartLesson()
                          }}
                        >
                          Continue
                        </Button>
                      )}
                      {node.status === "locked" && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

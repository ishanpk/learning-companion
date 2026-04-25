"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CourseCard } from "./course-card"
import { Sparkles, Search, TrendingUp, Target, Clock, Zap, BookOpen, CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { useStudyStore } from "@/store/useStudyStore"
import type { GeneratedCourse } from "@/store/useStudyStore"
import { cn } from "@/lib/utils"

interface DashboardViewProps {
  onStartStudy: () => void
}

const staticCourses = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of ML algorithms, neural networks, and data preprocessing techniques.",
    progress: 65,
    streak: 7,
    lessonsLeft: 8,
    estimatedTime: "2h 15m",
    category: "AI & ML",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    description: "Master advanced TypeScript concepts including generics, decorators, and design patterns.",
    progress: 42,
    streak: 3,
    lessonsLeft: 12,
    estimatedTime: "4h 30m",
    category: "Programming",
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    description: "Build scalable systems with load balancing, caching, database sharding, and microservices.",
    progress: 28,
    streak: 0,
    lessonsLeft: 18,
    estimatedTime: "6h 45m",
    category: "Architecture",
  },
]

const stats = [
  { label: "Study Hours", value: "47.5", icon: Clock, change: "+12%" },
  { label: "Completed", value: "23", icon: Target, change: "+3" },
  { label: "Current Streak", value: "7", icon: Zap, change: "Best: 14" },
  { label: "This Week", value: "8.2h", icon: TrendingUp, change: "+23%" },
]

function GeneratedCourseCard({ course, onStartStudy }: { course: GeneratedCourse; onStartStudy: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="group relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      {/* AI-generated indicator glow */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-60" />

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="text-xs bg-primary/20 text-primary border-primary/30 border">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20 border">
                {course.modules.length} modules
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1 leading-tight">{course.courseTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {course.modules[0]?.description || "Your personalized AI-generated learning path"}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Module preview */}
        {expanded && (
          <div className="mt-4 space-y-2 border-t border-border/30 pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modules</p>
            {course.modules.map((mod, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-background/40 border border-border/20">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{mod.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{mod.description}</p>
                  {mod.quiz?.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {mod.quiz.length} quiz questions
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide modules" : "Preview modules"}
          </button>
          <Button
            size="sm"
            onClick={onStartStudy}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardView({ onStartStudy }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { generatedCourses, addGeneratedCourse } = useStudyStore()

  const handleGeneratePath = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery.trim() }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || `Server error ${res.status}`)
      }

      const data = await res.json()
      addGeneratedCourse({
        courseTitle: data.courseTitle,
        modules: data.modules,
      })
      setSearchQuery("")
    } catch (e: any) {
      setError(e.message || "Failed to generate learning path. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGeneratePath()
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">learner</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Ready to continue your learning journey? Let's make today count."}
          </p>
        </div>

        {/* Create New Learning Path */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-card to-accent/5 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="What do you want to learn today? (e.g. React hooks, Python basics)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="pl-12 pr-4 py-6 text-lg bg-background/50 border-border/50 focus:border-primary/50 placeholder:text-muted-foreground disabled:opacity-60"
                />
              </div>
              <Button
                size="lg"
                onClick={handleGeneratePath}
                disabled={isLoading || !searchQuery.trim()}
                className="px-8 bg-gradient-to-r from-primary via-primary/90 to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Learning Path
                  </>
                )}
              </Button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {!error && (
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                AI will generate a personalized curriculum with modules and quizzes — press Enter or click the button
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-accent font-medium">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Generated Paths */}
        {generatedCourses.length > 0 && (
          <div>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your AI Learning Paths
                <Badge variant="secondary" className="ml-1 text-xs bg-primary/10 text-primary border-primary/20 border">
                  {generatedCourses.length} new
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="grid gap-4">
              {generatedCourses.map((course) => (
                <GeneratedCourseCard
                  key={course.id}
                  course={course}
                  onStartStudy={onStartStudy}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current Progress */}
        <div>
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Current Progress
            </CardTitle>
          </CardHeader>
          <div className="grid gap-4">
            {staticCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onResume={onStartStudy}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

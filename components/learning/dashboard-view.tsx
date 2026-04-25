"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseCard } from "./course-card"
import { Sparkles, Search, TrendingUp, Target, Clock, Zap, Sun, Heart, BookOpen, Loader2, Trash2 } from "lucide-react"
import { useCourseStore } from "@/store/useCourseStore"
import type { GeneratedCourse } from "@/store/types"
import { Badge } from "@/components/ui/badge"

interface DashboardViewProps {
  onStartStudy: () => void
}

const courses = [
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
  { label: "Study Hours", value: "47.5", icon: Clock, change: "+12%", color: "text-primary" },
  { label: "Completed", value: "23", icon: Target, change: "+3", color: "text-accent" },
  { label: "Current Streak", value: "7", icon: Zap, change: "Best: 14", color: "text-amber-500" },
  { label: "This Week", value: "8.2h", icon: TrendingUp, change: "+23%", color: "text-primary" },
]

export function DashboardView({ onStartStudy }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Connect to Zustand store (backed by Firebase)
  const generatedCourses = useCourseStore((s) => s.generatedCourses)
  const addGeneratedCourse = useCourseStore((s) => s.addGeneratedCourse)
  const clearCourses = useCourseStore((s) => s.clearCourses)
  const selectCourse = useCourseStore((s) => s.selectCourse)

  /**
   * Calls the Gemini backend API to generate a learning path,
   * then saves the result to Firebase via the Zustand store.
   */
  const handleCreatePath = async () => {
    if (!searchQuery.trim()) return
    setIsGenerating(true)

    try {
      const res = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery.trim() }),
      })

      if (!res.ok) throw new Error("Failed to generate path")

      const data = await res.json()

      // Save to Zustand + Firebase (this also sets selectedCourseId)
      addGeneratedCourse({
        courseTitle: data.courseTitle,
        modules: data.modules,
      })

      // Navigate to the study view
      onStartStudy()

      setSearchQuery("")
    } catch (err) {
      console.error("Error creating path:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 lg:p-8 pb-28 lg:pb-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Good morning</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Ready to continue learning? You&apos;re doing great.
            </p>
          </div>
        </div>

        {/* Create New Learning Path */}
        <Card className="border-border/60 bg-card shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="What would you like to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreatePath() }}
                  className="pl-12 pr-4 py-6 text-base bg-secondary/50 border-border/60 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground rounded-xl"
                  disabled={isGenerating}
                  aria-label="Search for a learning topic"
                />
              </div>
              <Button 
                size="lg"
                className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15 transition-all duration-200 rounded-xl cursor-pointer whitespace-nowrap"
                onClick={handleCreatePath}
                disabled={isGenerating || !searchQuery.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Path
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI will create a personalized learning path just for you
            </p>
          </CardContent>
        </Card>

        {/* AI-Generated Learning Paths (from Firebase) */}
        {generatedCourses.length > 0 && (
          <div>
            <CardHeader className="px-0 pt-0 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Generated Paths
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0 rounded-full ml-1">
                    {generatedCourses.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                  onClick={clearCourses}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              </div>
            </CardHeader>
            <div className="grid gap-4">
              {generatedCourses.map((course: GeneratedCourse) => (
                <Card
                  key={course.id}
                  className="group border-border/60 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                  onClick={() => {
                    selectCourse(course.id)
                    onStartStudy()
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div className="w-[76px] h-[76px] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                        <BookOpen className="w-8 h-8 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0 rounded-full px-3">
                            AI Generated
                          </Badge>
                          <Badge variant="secondary" className="text-xs font-semibold bg-accent/10 text-accent border-0 rounded-full px-3">
                            {course.modules.length} modules
                          </Badge>
                        </div>

                        <h3 className="font-bold text-lg text-foreground truncate mb-1.5">
                          {course.courseTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {course.modules[0]?.description || "A personalized learning path generated by AI."}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4" />
                              <span>{course.modules.length} lessons</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md shadow-primary/10 transition-all duration-200 rounded-xl cursor-pointer px-5"
                            onClick={(e) => { e.stopPropagation(); onStartStudy() }}
                          >
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-secondary flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Current Progress */}
        <div>
          <CardHeader className="px-0 pt-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Your Learning Journey
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground cursor-pointer">
                View all
              </Button>
            </div>
          </CardHeader>
          <div className="grid gap-4">
            {courses.map((course) => (
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

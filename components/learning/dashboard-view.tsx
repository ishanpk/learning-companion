"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseCard } from "./course-card"
import { Sparkles, Search, TrendingUp, Target, Clock, Zap } from "lucide-react"

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
  { label: "Study Hours", value: "47.5", icon: Clock, change: "+12%" },
  { label: "Completed", value: "23", icon: Target, change: "+3" },
  { label: "Current Streak", value: "7", icon: Zap, change: "Best: 14" },
  { label: "This Week", value: "8.2h", icon: TrendingUp, change: "+23%" },
]

export function DashboardView({ onStartStudy }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

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
                  placeholder="What do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-background/50 border-border/50 focus:border-primary/50 placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                size="lg"
                className="px-8 bg-gradient-to-r from-primary via-primary/90 to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Learning Path
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              AI will generate a personalized curriculum based on your goals
            </p>
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

        {/* Current Progress */}
        <div>
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Current Progress
            </CardTitle>
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

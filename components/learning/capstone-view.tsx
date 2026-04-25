"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles, Clock, Star, Rocket, Code2, Layers, ArrowRight, Confetti, Crown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CapstoneViewProps {
  onBack: () => void
  onAcceptProject: (projectId: string) => void
}

// Removed hardcoded array, fetching from backend

export function CapstoneView({ onBack, onAcceptProject }: CapstoneViewProps) {
  const [showCelebration, setShowCelebration] = useState(true)
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['bg-primary', 'bg-accent', 'bg-yellow-400', 'bg-pink-400', 'bg-teal-400'][Math.floor(Math.random() * 5)],
    }))
    setConfettiPieces(pieces)

    // Hide celebration after animation
    const timer = setTimeout(() => setShowCelebration(false), 4000)

    // Fetch projects from backend
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/capstone')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setProjects(data.projects || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()

    return () => clearTimeout(timer)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-accent/20 text-accent"
      case "Intermediate": return "bg-primary/20 text-primary"
      case "Advanced": return "bg-orange-500/20 text-orange-400"
      default: return "bg-secondary text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 overflow-auto relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md overflow-hidden">
          {/* Confetti */}
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={cn("absolute w-3 h-3 rounded-sm", piece.color)}
              style={{
                left: `${piece.left}%`,
                top: '-20px',
                animation: `confetti-fall 3s ease-out ${piece.delay}s forwards`,
              }}
            />
          ))}

          <div className="text-center z-10 animate-in zoom-in-50 duration-700">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-primary flex items-center justify-center animate-pulse">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-accent animate-bounce delay-100" />
              <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Course Completed!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {"You've mastered Introduction to Machine Learning"}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">+500 XP</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">12 Lessons</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">New Badge</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8"
            >
              <Rocket className="w-5 h-5 mr-2" />
              View Capstone Projects
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Course Complete
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Choose Your Capstone Project
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Apply everything you have learned in a comprehensive project. These challenges are designed to test your mastery and build your portfolio.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Skills Unlocked</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">95%</p>
              <p className="text-xs text-muted-foreground">Quiz Average</p>
            </CardContent>
          </Card>
        </div>

        {/* Capstone Project Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-muted-foreground animate-pulse">Generating your personalized capstone challenges with AI...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                "border-2 transition-all cursor-pointer overflow-hidden group",
                selectedProject === project.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/50 hover:border-primary/30"
              )}
              onClick={() => setSelectedProject(project.id)}
            >
              {/* Gradient Header */}
              <div className={cn(
                "h-24 bg-gradient-to-br relative overflow-hidden",
                project.gradient
              )}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50 group-hover:scale-110 transition-transform">
                  {project.icon}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    getDifficultyColor(project.difficulty)
                  )}>
                    {project.difficulty}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Estimated Time */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Est. {project.estimatedHours} hours
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Button
                  className={cn(
                    "w-full transition-all",
                    selectedProject === project.id
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAcceptProject(project.id)
                  }}
                >
                  {selectedProject === project.id ? (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Accept Challenge
                    </>
                  ) : (
                    <>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={onBack} className="border-border/50">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles, Clock, Star, Rocket, Code2, Layers, ArrowRight, Crown, CheckCircle2, ArrowLeft, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"

interface CapstoneViewProps {
  onBack: () => void
  onAcceptProject: (projectId: string) => void
}

export function CapstoneView({ onBack, onAcceptProject }: CapstoneViewProps) {
  const [showCelebration, setShowCelebration] = useState(true)
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['bg-primary', 'bg-accent', 'bg-amber-400', 'bg-rose-300', 'bg-teal-400'][Math.floor(Math.random() * 5)],
    }))
    setConfettiPieces(pieces)

    const timer = setTimeout(() => setShowCelebration(false), 4000)

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
      case "Beginner": return "bg-primary/10 text-primary"
      case "Intermediate": return "bg-accent/10 text-accent"
      case "Advanced": return "bg-amber-100 text-amber-700"
      default: return "bg-secondary text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 overflow-auto relative bg-background">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm overflow-hidden">
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
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-200 via-primary/30 to-accent/30 flex items-center justify-center shadow-xl">
                <Trophy className="w-16 h-16 text-amber-600" />
              </div>
              <PartyPopper className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-bounce delay-100" />
              <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Course Completed!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              You&apos;ve mastered Introduction to Machine Learning
            </p>
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">+500 XP</span>
              </div>
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">12 Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">New Badge</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowCelebration(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-xl cursor-pointer shadow-md shadow-primary/15"
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

      <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-28 lg:pb-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <Trophy className="w-4 h-4" />
            Course Complete
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Choose Your Capstone Project
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Apply everything you have learned in a comprehensive project. These challenges are designed to test your mastery and build your portfolio.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">Skills Unlocked</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">95%</p>
              <p className="text-sm text-muted-foreground">Quiz Average</p>
            </CardContent>
          </Card>
        </div>

        {/* Capstone Project Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-muted-foreground">Generating your personalized capstone challenges...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                "border-2 transition-all duration-200 cursor-pointer overflow-hidden group hover:shadow-lg",
                selectedProject === project.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/60 hover:border-primary/40"
              )}
              onClick={() => setSelectedProject(project.id)}
            >
              {/* Gradient Header */}
              <div className={cn(
                "h-24 bg-gradient-to-br relative overflow-hidden",
                project.gradient || "from-primary/20 to-accent/20"
              )}>
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-70 group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    getDifficultyColor(project.difficulty)
                  )}>
                    {project.difficulty}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
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
                  {project.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full bg-secondary/50 text-xs text-muted-foreground font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Button
                  className={cn(
                    "w-full transition-all duration-200 rounded-xl cursor-pointer",
                    selectedProject === project.id
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15"
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
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Brain, Sparkles, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyWarmupProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const flashcards = [
  {
    id: 1,
    concept: "What does 'backpropagation' do in neural networks?",
    options: [
      "Stores training data",
      "Adjusts weights based on errors",
      "Visualizes network architecture",
      "Encrypts model outputs",
    ],
    correct: 1,
    topic: "Machine Learning",
    lastReviewed: "3 days ago",
  },
  {
    id: 2,
    concept: "Which TypeScript utility type makes all properties optional?",
    options: [
      "Required<T>",
      "Partial<T>",
      "Pick<T, K>",
      "Readonly<T>",
    ],
    correct: 1,
    topic: "TypeScript",
    lastReviewed: "5 days ago",
  },
  {
    id: 3,
    concept: "What is the primary benefit of database sharding?",
    options: [
      "Improved data security",
      "Better data compression",
      "Horizontal scalability",
      "Simpler queries",
    ],
    correct: 2,
    topic: "System Design",
    lastReviewed: "1 week ago",
  },
]

export function DailyWarmup({ isOpen, onClose, onComplete }: DailyWarmupProps) {
  const [currentCard, setCurrentCard] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [isExiting, setIsExiting] = useState(false)

  if (!isOpen) return null

  const card = flashcards[currentCard]
  const progress = ((currentCard + 1) / flashcards.length) * 100
  const isCorrect = selectedAnswer === card.correct

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    setResults([...results, selectedAnswer === card.correct])
  }

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsExiting(true)
    setTimeout(() => {
      onComplete()
      // Reset state for next time
      setCurrentCard(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setResults([])
      setIsExiting(false)
    }, 300)
  }

  const handleSkip = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
      setIsExiting(false)
    }, 300)
  }

  const correctCount = results.filter(Boolean).length + (showResult && isCorrect ? 1 : 0)

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isExiting ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div 
        className={cn(
          "relative w-full max-w-lg transition-all duration-300",
          isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 px-6 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    Daily Warm-Up
                    <Flame className="w-4 h-4 text-orange-400" />
                  </h2>
                  <p className="text-xs text-muted-foreground">Spaced repetition review</p>
                </div>
              </div>
              <button 
                onClick={handleSkip}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Card {currentCard + 1} of {flashcards.length}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  {card.topic}
                </span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Flashcard Stack Visual */}
            <div className="relative mb-6">
              {/* Background cards */}
              {currentCard < flashcards.length - 1 && (
                <>
                  <div className="absolute inset-0 transform translate-y-2 translate-x-2 bg-card border border-border/30 rounded-xl opacity-50" />
                  {currentCard < flashcards.length - 2 && (
                    <div className="absolute inset-0 transform translate-y-4 translate-x-4 bg-card border border-border/20 rounded-xl opacity-30" />
                  )}
                </>
              )}

              {/* Main card */}
              <div className="relative bg-secondary/30 border border-border/50 rounded-xl p-6">
                <p className="text-xs text-muted-foreground mb-2">Last reviewed: {card.lastReviewed}</p>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {card.concept}
                </h3>

                <div className="space-y-2">
                  {card.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrectAnswer = index === card.correct

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        disabled={showResult}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200",
                          "flex items-center gap-3 text-sm",
                          !showResult && !isSelected && "border-border/50 hover:border-primary/30 hover:bg-primary/5",
                          !showResult && isSelected && "border-primary bg-primary/10",
                          showResult && isCorrectAnswer && "border-accent bg-accent/10",
                          showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/10"
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-medium",
                            !showResult && !isSelected && "border-border text-muted-foreground",
                            !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                            showResult && isCorrectAnswer && "border-accent bg-accent text-accent-foreground",
                            showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive text-destructive-foreground"
                          )}
                        >
                          {showResult && isCorrectAnswer ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : showResult && isSelected && !isCorrectAnswer ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </div>
                        <span className={cn(
                          "text-foreground/90",
                          showResult && isCorrectAnswer && "text-accent font-medium"
                        )}>
                          {option}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-semibold text-accent">{correctCount}/{results.length + (showResult ? 1 : 0)}</span>
              </div>

              <div className="flex gap-2">
                {!showResult ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                  >
                    {currentCard < flashcards.length - 1 ? (
                      <>
                        Next Card
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Start Learning
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

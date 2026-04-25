"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, ChevronRight, CheckCircle2, XCircle, Brain, Sparkles, Sun } from "lucide-react"
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
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div 
        className={cn(
          "relative w-full max-w-lg transition-all duration-300",
          isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Card className="border-border/60 bg-card shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 px-6 py-5 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                    Daily Warm-Up
                    <Sun className="w-5 h-5 text-accent" />
                  </h2>
                  <p className="text-sm text-muted-foreground">Quick review to refresh your memory</p>
                </div>
              </div>
              <button 
                onClick={handleSkip}
                className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">
                  Card {currentCard + 1} of {flashcards.length}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-primary" />
                  {card.topic}
                </span>
              </div>
              <Progress value={progress} className="h-2 rounded-full" />
            </div>

            {/* Flashcard */}
            <div className="relative mb-6">
              {/* Background cards for stack effect */}
              {currentCard < flashcards.length - 1 && (
                <>
                  <div className="absolute inset-0 transform translate-y-2 translate-x-2 bg-secondary/30 border border-border/40 rounded-2xl" />
                  {currentCard < flashcards.length - 2 && (
                    <div className="absolute inset-0 transform translate-y-4 translate-x-4 bg-secondary/20 border border-border/30 rounded-2xl" />
                  )}
                </>
              )}

              {/* Main card */}
              <div className="relative bg-secondary/30 border border-border/60 rounded-2xl p-6">
                <p className="text-xs text-muted-foreground mb-3">Last reviewed: {card.lastReviewed}</p>
                <h3 className="text-lg font-bold text-foreground mb-5 leading-relaxed">
                  {card.concept}
                </h3>

                <div className="space-y-2.5">
                  {card.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrectAnswer = index === card.correct

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        disabled={showResult}
                        className={cn(
                          "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                          "flex items-center gap-3 text-sm",
                          !showResult && !isSelected && "border-border/60 hover:border-primary/40 hover:bg-primary/5",
                          !showResult && isSelected && "border-primary bg-primary/10",
                          showResult && isCorrectAnswer && "border-primary bg-primary/10",
                          showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/10"
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold",
                            !showResult && !isSelected && "border-border text-muted-foreground",
                            !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                            showResult && isCorrectAnswer && "border-primary bg-primary text-primary-foreground",
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
                          "text-foreground/90 font-medium",
                          showResult && isCorrectAnswer && "text-primary"
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
                <span className="font-bold text-primary">{correctCount}/{results.length + (showResult ? 1 : 0)}</span>
              </div>

              <div className="flex gap-2">
                {!showResult ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
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

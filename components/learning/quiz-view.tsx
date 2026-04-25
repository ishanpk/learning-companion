"use client"

import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, Terminal, FileQuestion, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCourseStore } from "@/store/useCourseStore"
import { createReviewCard } from "@/lib/spaced-repetition"

interface QuizViewProps {
  onBack: () => void
  onComplete: () => void
  onSwitchToScenario?: () => void
}

const questions = [
  {
    id: 1,
    question: "What is the primary purpose of neural networks?",
    options: [
      "To store large amounts of data efficiently",
      "To recognize patterns and relationships in data",
      "To encrypt sensitive information",
      "To compress files for storage",
    ],
    correct: 1,
  },
  {
    id: 2,
    question: "Which layer receives the initial data in a neural network?",
    options: [
      "Output Layer",
      "Hidden Layer",
      "Input Layer",
      "Processing Layer",
    ],
    correct: 2,
  },
  {
    id: 3,
    question: "What process do neural networks use to learn from their mistakes?",
    options: [
      "Forward propagation",
      "Data mining",
      "Backpropagation",
      "Feature scaling",
    ],
    correct: 2,
  },
  {
    id: 4,
    question: "For a digit classifier (0-9), how many output neurons are needed?",
    options: [
      "1 neuron",
      "5 neurons",
      "10 neurons",
      "784 neurons",
    ],
    correct: 2,
  },
  {
    id: 5,
    question: "What do hidden layers primarily perform?",
    options: [
      "Display the final results",
      "Store the training data",
      "Computations and feature extraction",
      "Connect to the database",
    ],
    correct: 2,
  },
]

export function QuizView({ onBack, onComplete, onSwitchToScenario }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [quizMode, setQuizMode] = useState<"standard" | "scenario">("standard")
  const addReviewCard = useCourseStore((s) => s.addReviewCard)
  const selectedCourseId = useCourseStore((s) => s.selectedCourseId)

  useEffect(() => {
    trackEvent({ name: 'quiz_started', moduleId: 'module_1' })
  }, [])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isCorrect = selectedAnswer === question.correct

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    setAnswers([...answers, selectedAnswer])
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsComplete(true)
      
      // Phase 4: Create review cards for spaced repetition
      questions.forEach((q, idx) => {
        const cardId = `${selectedCourseId || 'default'}:module_1:q_${idx}`;
        addReviewCard({
          ...createReviewCard(cardId),
          question: q.question,
          options: q.options,
          correctAnswer: q.options[q.correct],
          topic: "Machine Learning" // Should be dynamic from course
        });
      });

      trackEvent({ 
        name: 'quiz_completed', 
        moduleId: 'module_1', 
        score: correctAnswers, 
        total: questions.length 
      })
    }
  }

  const correctAnswers = answers.filter(
    (answer, index) => answer === questions[index].correct
  ).length + (showResult && isCorrect ? 1 : 0)

  const totalAnswered = answers.length + (showResult ? 1 : 0)
  const score = Math.round((correctAnswers / questions.length) * 100)

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full border-border/60 bg-card shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              Great job on finishing the assessment!
            </p>
            
            <div className="bg-secondary/50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-sm text-muted-foreground">
                {correctAnswers} of {questions.length} correct
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 border-border/60 rounded-xl cursor-pointer"
              >
                Review Lesson
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 lg:p-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Lesson</span>
          </button>

          {/* Mode Toggle */}
          {onSwitchToScenario && (
            <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
              <button
                onClick={() => setQuizMode("standard")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                  quizMode === "standard"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileQuestion className="w-4 h-4" />
                Quiz
              </button>
              <button
                onClick={() => {
                  setQuizMode("scenario")
                  onSwitchToScenario()
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                  quizMode === "scenario"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="w-4 h-4" />
                Scenario
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {totalAnswered > 0 && `${correctAnswers}/${totalAnswered} correct`}
            </span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
        </div>

        {/* Question Card */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === question.correct
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                    "flex items-center gap-4",
                    !showResult && !isSelected && "border-border/60 hover:border-primary/40 hover:bg-primary/5",
                    !showResult && isSelected && "border-primary bg-primary/10",
                    showResult && isCorrectAnswer && "border-primary bg-primary/10",
                    showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-200",
                      !showResult && !isSelected && "border-border text-muted-foreground",
                      !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                      showResult && isCorrectAnswer && "border-primary bg-primary text-primary-foreground",
                      showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive text-destructive-foreground"
                    )}
                  >
                    {showResult && isCorrectAnswer ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : showResult && isSelected && !isCorrectAnswer ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-foreground/90 font-medium",
                      showResult && isCorrectAnswer && "text-primary",
                      showResult && isSelected && !isCorrectAnswer && "text-destructive"
                    )}
                  >
                    {option}
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Feedback Message */}
        {showResult && (
          <div className={cn(
            "mt-4 p-4 rounded-xl",
            isCorrect ? "bg-primary/10 border border-primary/20" : "bg-accent/10 border border-accent/20"
          )}>
            <p className={cn(
              "text-sm font-medium",
              isCorrect ? "text-primary" : "text-accent"
            )}>
              {isCorrect ? "Excellent! That&apos;s correct." : "Not quite, but don&apos;t worry - learning from mistakes is part of the journey!"}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-xl cursor-pointer shadow-md shadow-primary/15"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

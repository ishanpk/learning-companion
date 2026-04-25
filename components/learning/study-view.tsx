"use client"

import { Button } from "@/components/ui/button"
import { FocusTimer } from "./focus-timer"
import { ActiveLoadout } from "./active-loadout"
import { ArrowLeft, CheckCircle2, BookOpen } from "lucide-react"

interface StudyViewProps {
  onBack: () => void
  onComplete: () => void
}

export function StudyView({ onBack, onComplete }: StudyViewProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Lesson 5 of 12</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <article className="prose prose-invert prose-lg max-w-none">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Understanding Neural Networks
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Learn how artificial neural networks mimic the human brain to solve complex problems.
              </p>

              <div className="space-y-6 text-foreground/90">
                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  What is a Neural Network?
                </h2>
                <p className="leading-relaxed">
                  A neural network is a series of algorithms that endeavors to recognize underlying 
                  relationships in a set of data through a process that mimics the way the human brain 
                  operates. Neural networks can adapt to changing input; so the network generates the 
                  best possible result without needing to redesign the output criteria.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8">
                  <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">💡</span>
                    Key Concept
                  </h3>
                  <p className="text-foreground/80">
                    Neural networks consist of layers of interconnected nodes or neurons that process 
                    information using connectionist approaches to computation.
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  The Structure of Neural Networks
                </h2>
                <p className="leading-relaxed">
                  Neural networks consist of three main types of layers:
                </p>
                <ul className="space-y-3 text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-semibold shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-foreground">Input Layer:</strong> The layer that receives the initial data for processing.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-semibold shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-foreground">Hidden Layers:</strong> Intermediate layers that perform computations and feature extraction.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-semibold shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-foreground">Output Layer:</strong> The final layer that produces the prediction or classification.
                    </div>
                  </li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 mt-8">
                  How Neural Networks Learn
                </h2>
                <p className="leading-relaxed">
                  Neural networks learn through a process called backpropagation. During training, 
                  the network makes predictions on training data, compares those predictions to the 
                  actual outcomes, and then adjusts the weights of connections between neurons to 
                  minimize the error.
                </p>

                <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 my-8">
                  <h3 className="text-lg font-semibold text-accent mb-3">
                    Practice Exercise
                  </h3>
                  <p className="text-foreground/80 mb-4">
                    Consider a simple neural network that classifies images of handwritten digits. 
                    The input layer would have 784 neurons (one for each pixel in a 28x28 image). 
                    How many output neurons would this network need?
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Think about it before moving on to the quiz!
                  </p>
                </div>
              </div>
            </article>

            {/* Complete Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button
                size="lg"
                onClick={onComplete}
                className="w-full sm:w-auto px-8 bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 text-accent-foreground font-semibold shadow-lg shadow-accent/25 transition-all duration-300"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mark as Complete & Take Quiz
              </Button>
            </div>
          </div>

          {/* Sidebar - Focus Timer & Active Loadout */}
          <div className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-8 space-y-4">
              <ActiveLoadout />
              <FocusTimer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FocusTimer } from "./focus-timer"
import { ActiveLoadout } from "./active-loadout"
import { ArrowLeft, CheckCircle2, BookOpen, Lightbulb, Target } from "lucide-react"

interface StudyViewProps {
  onBack: () => void
  onComplete: () => void
}

export function StudyView({ onBack, onComplete }: StudyViewProps) {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-medium">Lesson 5 of 12</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="border-border/60 bg-card shadow-sm p-8">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  Understanding Neural Networks
                </h1>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Learn how artificial neural networks mimic the human brain to solve complex problems.
                </p>

                <div className="space-y-6 text-foreground">
                  <h2 className="text-xl font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </span>
                    What is a Neural Network?
                  </h2>
                  <p className="leading-relaxed text-foreground/80">
                    A neural network is a series of algorithms that endeavors to recognize underlying 
                    relationships in a set of data through a process that mimics the way the human brain 
                    operates. Neural networks can adapt to changing input; so the network generates the 
                    best possible result without needing to redesign the output criteria.
                  </p>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-8">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </span>
                      Key Concept
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Neural networks consist of layers of interconnected nodes or neurons that process 
                      information using connectionist approaches to computation.
                    </p>
                  </div>

                  <h2 className="text-xl font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </span>
                    The Structure of Neural Networks
                  </h2>
                  <p className="leading-relaxed text-foreground/80">
                    Neural networks consist of three main types of layers:
                  </p>
                  <ul className="space-y-4 text-foreground/80 list-none pl-0">
                    <li className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">1</span>
                      <div>
                        <strong className="text-foreground">Input Layer:</strong> The layer that receives the initial data for processing.
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">2</span>
                      <div>
                        <strong className="text-foreground">Hidden Layers:</strong> Intermediate layers that perform computations and feature extraction.
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">3</span>
                      <div>
                        <strong className="text-foreground">Output Layer:</strong> The final layer that produces the prediction or classification.
                      </div>
                    </li>
                  </ul>

                  <h2 className="text-xl font-bold text-foreground border-b border-border/60 pb-3 mt-8">
                    How Neural Networks Learn
                  </h2>
                  <p className="leading-relaxed text-foreground/80">
                    Neural networks learn through a process called backpropagation. During training, 
                    the network makes predictions on training data, compares those predictions to the 
                    actual outcomes, and then adjusts the weights of connections between neurons to 
                    minimize the error.
                  </p>

                  <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 my-8">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                      </span>
                      Practice Exercise
                    </h3>
                    <p className="text-foreground/80 mb-4 leading-relaxed">
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
              <div className="mt-10 pt-8 border-t border-border/60">
                <Button
                  size="lg"
                  onClick={onComplete}
                  className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/15 transition-all duration-200 rounded-xl cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Mark Complete & Take Quiz
                </Button>
              </div>
            </Card>
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Terminal, AlertTriangle, CheckCircle2, XCircle, Lightbulb, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScenarioModeProps {
  onBack: () => void
  onComplete: () => void
}

const scenarios = [
  {
    id: 1,
    title: "Fix the Memory Leak",
    description: "This React component has a memory leak due to improper cleanup. Find and fix the issue.",
    category: "React Hooks",
    difficulty: "Medium",
    buggyCode: `function UserStatus({ userId }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserStatus(userId).then(setStatus);
    }, 5000);
  }, [userId]);

  return <div>{status}</div>;
}`,
    hint: "Think about what happens when the component unmounts or userId changes.",
    solution: "clearInterval",
    explanation: "The useEffect is missing a cleanup function. When the component unmounts or userId changes, the interval continues running, causing a memory leak. Add a return statement with clearInterval(interval) to properly clean up.",
  },
  {
    id: 2,
    title: "Debug the API Response",
    description: "This async function is not handling errors correctly. Fix the error handling to prevent crashes.",
    category: "Async/Await",
    difficulty: "Easy",
    buggyCode: `async function fetchUserData(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = response.json();
  return data.user;
}`,
    hint: "There are two issues: one with awaiting and one with error handling.",
    solution: "await response.json()",
    explanation: "Two fixes needed: 1) response.json() returns a Promise, so it needs 'await'. 2) No error handling for failed requests. Should check response.ok and wrap in try/catch.",
  },
  {
    id: 3,
    title: "Optimize the Query",
    description: "This database query is causing N+1 problems. Refactor to improve performance.",
    category: "System Design",
    difficulty: "Hard",
    buggyCode: `async function getOrdersWithProducts(userId) {
  const orders = await db.query(
    'SELECT * FROM orders WHERE user_id = ?', 
    [userId]
  );
  
  for (const order of orders) {
    order.products = await db.query(
      'SELECT * FROM products WHERE order_id = ?',
      [order.id]
    );
  }
  
  return orders;
}`,
    hint: "Instead of querying products one order at a time, how can you get all products in a single query?",
    solution: "JOIN",
    explanation: "Use a SQL JOIN to fetch orders and products in a single query, or fetch all products for all order IDs at once using IN clause, then map them in memory.",
  },
]

export function ScenarioMode({ onBack, onComplete }: ScenarioModeProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [userSolution, setUserSolution] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const scenario = scenarios[currentScenario]
  const progress = ((currentScenario + 1) / scenarios.length) * 100

  const handleSubmit = () => {
    const correct = userSolution.toLowerCase().includes(scenario.solution.toLowerCase())
    setIsCorrect(correct)
    setSubmitted(true)
    setResults([...results, correct])
  }

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setUserSolution("")
      setShowHint(false)
      setSubmitted(false)
      setIsCorrect(false)
    } else {
      setIsComplete(true)
    }
  }

  const correctCount = results.filter(Boolean).length
  const score = Math.round((correctCount / scenarios.length) * 100)

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Terminal className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Scenario Mode Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              {"You've applied your knowledge to real-world scenarios."}
            </p>

            <div className="bg-secondary/50 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-accent mb-2">{score}%</div>
              <p className="text-sm text-muted-foreground">
                {correctCount} of {scenarios.length} scenarios solved
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 border-border/50"
              >
                Back to Quiz
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
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
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Quiz</span>
          </button>
          <div className="flex items-center gap-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              scenario.difficulty === "Easy" && "bg-accent/20 text-accent",
              scenario.difficulty === "Medium" && "bg-primary/20 text-primary",
              scenario.difficulty === "Hard" && "bg-destructive/20 text-destructive"
            )}>
              {scenario.difficulty}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <span className="text-sm text-muted-foreground">{scenario.category}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Buggy Code */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                {scenario.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">buggy-code.js</span>
                </div>
                <pre className="p-4 pt-10 bg-background/50 rounded-b-xl overflow-x-auto">
                  <code className="text-sm font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {scenario.buggyCode}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Right: Solution Input */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Your Solution
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Describe or write the fix for this issue
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">solution.txt</span>
                </div>
                <Textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Type your solution here... Explain what's wrong and how to fix it."
                  disabled={submitted}
                  className={cn(
                    "min-h-[200px] pt-10 bg-background/50 border-border/50 font-mono text-sm resize-none",
                    submitted && isCorrect && "border-accent",
                    submitted && !isCorrect && "border-destructive"
                  )}
                />
              </div>

              {/* Hint */}
              {!submitted && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
              )}
              
              {showHint && !submitted && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground/80">{scenario.hint}</p>
                </div>
              )}

              {/* Result */}
              {submitted && (
                <div className={cn(
                  "rounded-lg p-4 border",
                  isCorrect 
                    ? "bg-accent/10 border-accent/30" 
                    : "bg-orange-500/10 border-orange-500/30"
                )}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={cn(
                        "font-medium mb-1",
                        isCorrect ? "text-accent" : "text-orange-400"
                      )}>
                        {isCorrect ? "Great job!" : "Almost there!"}
                      </p>
                      <p className="text-sm text-foreground/80">{scenario.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end pt-2">
                {!submitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!userSolution.trim()}
                    className="px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground disabled:opacity-50"
                  >
                    Submit Solution
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                  >
                    {currentScenario < scenarios.length - 1 ? (
                      <>
                        Next Scenario
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

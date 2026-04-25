"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Terminal, AlertTriangle, CheckCircle2, Lightbulb, Code2, Trophy } from "lucide-react"
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
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full border-border/60 bg-card shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Scenario Mode Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve applied your knowledge to real-world scenarios.
            </p>

            <div className="bg-secondary/50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-sm text-muted-foreground">
                {correctCount} of {scenarios.length} scenarios solved
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 border-border/60 rounded-xl cursor-pointer"
              >
                Back to Quiz
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
      <div className="max-w-7xl mx-auto p-6 lg:p-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Quiz</span>
          </button>
          <div className="flex items-center gap-4">
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold",
              scenario.difficulty === "Easy" && "bg-primary/10 text-primary",
              scenario.difficulty === "Medium" && "bg-accent/10 text-accent",
              scenario.difficulty === "Hard" && "bg-amber-100 text-amber-700"
            )}>
              {scenario.difficulty}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <span className="text-sm text-muted-foreground font-medium">{scenario.category}</span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
        </div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Buggy Code */}
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" />
                {scenario.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 font-medium">buggy-code.js</span>
                </div>
                <pre className="p-4 pt-10 bg-secondary/30 rounded-b-xl overflow-x-auto">
                  <code className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                    {scenario.buggyCode}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Right: Solution Input */}
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
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
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">solution.txt</span>
                </div>
                <Textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Type your solution here... Explain what's wrong and how to fix it."
                  disabled={submitted}
                  aria-label="Your Solution"
                  className={cn(
                    "min-h-[200px] pt-10 bg-secondary/30 border-border/60 font-mono text-sm resize-none rounded-xl",
                    submitted && isCorrect && "border-primary",
                    submitted && !isCorrect && "border-accent"
                  )}
                />
              </div>

              {/* Hint */}
              {!submitted && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer font-medium"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
              )}
              
              {showHint && !submitted && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-foreground/80">{scenario.hint}</p>
                </div>
              )}

              {/* Result */}
              {submitted && (
                <div className={cn(
                  "rounded-xl p-4 border",
                  isCorrect 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-accent/5 border-accent/20"
                )}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={cn(
                        "font-bold mb-1",
                        isCorrect ? "text-primary" : "text-accent"
                      )}>
                        {isCorrect ? "Great job!" : "Almost there!"}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{scenario.explanation}</p>
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
                    className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-xl cursor-pointer shadow-md shadow-primary/15"
                  >
                    Submit Solution
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
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

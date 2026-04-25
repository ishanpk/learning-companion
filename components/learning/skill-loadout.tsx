"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Sparkles, Star, Zap, Lock, Info, X, Plus, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkillLoadoutProps {
  onBack: () => void
}

interface Skill {
  id: string
  name: string
  category: string
  level: number
  maxLevel: number
  xp: number
  xpToNext: number
  isEvolved: boolean
  icon: string
  description: string
}

const skills: Skill[] = [
  { id: "1", name: "Pattern Recognition", category: "ML Core", level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: "🧠", description: "Master of identifying complex patterns in data" },
  { id: "2", name: "Neural Architecture", category: "Deep Learning", level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: "🔮", description: "Expert in designing neural network structures" },
  { id: "3", name: "Data Preprocessing", category: "ML Core", level: 12, maxLevel: 15, xp: 380, xpToNext: 450, isEvolved: false, icon: "📊", description: "Skilled at preparing data for model training" },
  { id: "4", name: "TypeScript Generics", category: "Programming", level: 10, maxLevel: 15, xp: 280, xpToNext: 350, isEvolved: false, icon: "⚡", description: "Proficient with advanced type patterns" },
  { id: "5", name: "API Design", category: "System Design", level: 8, maxLevel: 15, xp: 190, xpToNext: 280, isEvolved: false, icon: "🔗", description: "Building RESTful and GraphQL APIs" },
  { id: "6", name: "Caching Strategies", category: "System Design", level: 6, maxLevel: 15, xp: 120, xpToNext: 200, isEvolved: false, icon: "💾", description: "Optimizing performance with caching" },
  { id: "7", name: "React Patterns", category: "Frontend", level: 14, maxLevel: 15, xp: 460, xpToNext: 500, isEvolved: false, icon: "⚛️", description: "Advanced React component patterns" },
  { id: "8", name: "Database Optimization", category: "Backend", level: 4, maxLevel: 15, xp: 80, xpToNext: 150, isEvolved: false, icon: "🗄️", description: "Query optimization and indexing" },
]

export function SkillLoadout({ onBack }: SkillLoadoutProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeLoadout, setActiveLoadout] = useState<string[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const categories = Array.from(new Set(skills.map(s => s.category)))
  const evolvedSkills = skills.filter(s => s.isEvolved)
  const evolvedInLoadout = activeLoadout.filter(id => 
    skills.find(s => s.id === id)?.isEvolved
  ).length

  const filteredSkills = selectedCategory 
    ? skills.filter(s => s.category === selectedCategory)
    : skills

  const handleAddToLoadout = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    if (!skill) return

    // Check evolved skill limit
    if (skill.isEvolved && evolvedInLoadout >= 2) return

    // Max 5 skills in loadout
    if (activeLoadout.length >= 5) return

    if (!activeLoadout.includes(skillId)) {
      setActiveLoadout([...activeLoadout, skillId])
    }
  }

  const handleRemoveFromLoadout = (skillId: string) => {
    setActiveLoadout(activeLoadout.filter(id => id !== skillId))
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <Card className="max-w-md w-full border-border/50 bg-card/95 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                  selectedSkill.isEvolved 
                    ? "bg-gradient-to-br from-yellow-400/30 to-orange-500/30 ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/20" 
                    : "bg-primary/20"
                )}>
                  {selectedSkill.icon}
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-foreground">{selectedSkill.name}</h3>
                {selectedSkill.isEvolved && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{selectedSkill.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold text-foreground">
                    {selectedSkill.level} / {selectedSkill.maxLevel}
                    {selectedSkill.isEvolved && " (MAX)"}
                  </span>
                </div>
                <Progress 
                  value={(selectedSkill.level / selectedSkill.maxLevel) * 100} 
                  className={cn("h-3", selectedSkill.isEvolved && "[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500")}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{selectedSkill.xp} XP</span>
                  <span>{selectedSkill.xpToNext} XP to next level</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                onClick={() => {
                  handleAddToLoadout(selectedSkill.id)
                  setSelectedSkill(null)
                }}
                disabled={activeLoadout.includes(selectedSkill.id) || activeLoadout.length >= 5 || (selectedSkill.isEvolved && evolvedInLoadout >= 2)}
              >
                {activeLoadout.includes(selectedSkill.id) 
                  ? "Already in Loadout" 
                  : selectedSkill.isEvolved && evolvedInLoadout >= 2
                    ? "Evolved Slot Limit Reached"
                    : "Add to Loadout"
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Skill Loadout
          </h1>
          <p className="text-muted-foreground">Manage your acquired micro-skills and equip them for focused learning sessions</p>
        </div>

        {/* Active Loadout Section */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-card to-accent/5 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Active Focus Loadout
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {activeLoadout.length}/5 slots | {evolvedInLoadout}/2 evolved
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((index) => {
                const skillId = activeLoadout[index]
                const skill = skillId ? skills.find(s => s.id === skillId) : null

                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative transition-all",
                      skill
                        ? skill.isEvolved
                          ? "border-yellow-400/50 bg-yellow-400/5"
                          : "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-secondary/20"
                    )}
                  >
                    {skill ? (
                      <>
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                          skill.isEvolved && "animate-pulse"
                        )}>
                          {skill.icon}
                        </div>
                        <button
                          onClick={() => handleRemoveFromLoadout(skill.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {skill.isEvolved && (
                          <Crown className="absolute -top-1 -left-1 w-4 h-4 text-yellow-400" />
                        )}
                        <p className="absolute -bottom-6 text-xs text-center text-muted-foreground truncate w-full px-1">
                          {skill.name}
                        </p>
                      </>
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-8 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Limit of 2 Evolved skills per session to prevent cognitive overload
            </p>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-primary text-primary-foreground" : ""}
          >
            All Skills
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Evolved Skills Section */}
        {evolvedSkills.length > 0 && !selectedCategory && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Evolved Skills
              <span className="text-sm font-normal text-muted-foreground">({evolvedSkills.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evolvedSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isInLoadout={activeLoadout.includes(skill.id)}
                  onSelect={() => setSelectedSkill(skill)}
                  onAdd={() => handleAddToLoadout(skill.id)}
                  canAdd={!activeLoadout.includes(skill.id) && activeLoadout.length < 5 && evolvedInLoadout < 2}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Skills Grid */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {selectedCategory || "All"} Skills
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredSkills.filter(s => !s.isEvolved || selectedCategory).length})
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.filter(s => selectedCategory || !s.isEvolved).map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isInLoadout={activeLoadout.includes(skill.id)}
                onSelect={() => setSelectedSkill(skill)}
                onAdd={() => handleAddToLoadout(skill.id)}
                canAdd={!activeLoadout.includes(skill.id) && activeLoadout.length < 5 && (!skill.isEvolved || evolvedInLoadout < 2)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface SkillCardProps {
  skill: Skill
  isInLoadout: boolean
  onSelect: () => void
  onAdd: () => void
  canAdd: boolean
}

function SkillCard({ skill, isInLoadout, onSelect, onAdd, canAdd }: SkillCardProps) {
  return (
    <Card
      className={cn(
        "border-2 cursor-pointer transition-all hover:scale-[1.02]",
        skill.isEvolved
          ? "border-yellow-400/30 bg-gradient-to-br from-yellow-400/5 to-orange-500/5 shadow-lg shadow-yellow-400/10"
          : "border-border/50 bg-card/50",
        isInLoadout && "ring-2 ring-primary/50"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative",
            skill.isEvolved 
              ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20" 
              : "bg-primary/10"
          )}>
            {skill.icon}
            {skill.isEvolved && (
              <div className="absolute -inset-1 rounded-xl bg-yellow-400/20 blur-sm -z-10" />
            )}
          </div>
          <div className="flex items-center gap-1">
            {skill.isEvolved && <Crown className="w-4 h-4 text-yellow-400" />}
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              skill.isEvolved 
                ? "bg-yellow-400/20 text-yellow-400" 
                : "bg-primary/20 text-primary"
            )}>
              Lv.{skill.level}
            </span>
          </div>
        </div>

        <h4 className="font-semibold text-foreground mb-1">{skill.name}</h4>
        <p className="text-xs text-muted-foreground mb-3">{skill.category}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{skill.level}/{skill.maxLevel}</span>
          </div>
          <Progress 
            value={(skill.level / skill.maxLevel) * 100} 
            className={cn("h-2", skill.isEvolved && "[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500")}
          />
        </div>

        <Button
          size="sm"
          variant={isInLoadout ? "secondary" : "outline"}
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation()
            if (canAdd) onAdd()
          }}
          disabled={!canAdd && !isInLoadout}
        >
          {isInLoadout ? "In Loadout" : canAdd ? "Add to Loadout" : "Slot Full"}
        </Button>
      </CardContent>
    </Card>
  )
}

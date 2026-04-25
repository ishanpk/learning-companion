"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Sparkles, Star, Zap, Info, X, Plus } from "lucide-react"
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

    if (skill.isEvolved && evolvedInLoadout >= 2) return
    if (activeLoadout.length >= 5) return

    if (!activeLoadout.includes(skillId)) {
      setActiveLoadout([...activeLoadout, skillId])
    }
  }

  const handleRemoveFromLoadout = (skillId: string) => {
    setActiveLoadout(activeLoadout.filter(id => id !== skillId))
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
          <Card className="max-w-md w-full border-border/60 bg-card shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                  selectedSkill.isEvolved 
                    ? "bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-200 shadow-md" 
                    : "bg-primary/10"
                )}>
                  {selectedSkill.icon}
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-foreground">{selectedSkill.name}</h3>
                {selectedSkill.isEvolved && (
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{selectedSkill.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-bold text-foreground">
                    {selectedSkill.level} / {selectedSkill.maxLevel}
                    {selectedSkill.isEvolved && " (MAX)"}
                  </span>
                </div>
                <Progress 
                  value={(selectedSkill.level / selectedSkill.maxLevel) * 100} 
                  className={cn("h-3", selectedSkill.isEvolved && "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-orange-400")}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{selectedSkill.xp} XP</span>
                  <span>{selectedSkill.xpToNext} XP to next level</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15"
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
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            Skill Loadout
          </h1>
          <p className="text-muted-foreground">Manage your acquired micro-skills and equip them for focused learning sessions</p>
        </div>

        {/* Active Loadout Section */}
        <Card className="border-border/60 bg-gradient-to-r from-primary/5 via-card to-accent/5 mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Active Focus Loadout
              </span>
              <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                {activeLoadout.length}/5 slots | {evolvedInLoadout}/2 evolved
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((index) => {
                const skillId = activeLoadout[index]
                const skill = skillId ? skills.find(s => s.id === skillId) : null

                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center relative transition-all duration-200",
                      skill
                        ? skill.isEvolved
                          ? "border-amber-300 bg-amber-50"
                          : "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-secondary/20"
                    )}
                  >
                    {skill ? (
                      <>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                          {skill.icon}
                        </div>
                        <button
                          onClick={() => handleRemoveFromLoadout(skill.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {skill.isEvolved && (
                          <Star className="absolute -top-1 -left-1 w-5 h-5 text-amber-500 fill-amber-400" />
                        )}
                        <p className="absolute -bottom-6 text-xs text-center text-muted-foreground truncate w-full px-1 font-medium">
                          {skill.name}
                        </p>
                      </>
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground/40" />
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-8 flex items-center gap-2 p-3 bg-secondary/30 rounded-xl">
              <Info className="w-4 h-4 text-primary" />
              Limit of 2 Evolved skills per session to keep focus sharp
            </p>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "rounded-xl cursor-pointer",
              selectedCategory === null ? "bg-primary text-primary-foreground shadow-md shadow-primary/15" : ""
            )}
          >
            All Skills
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-xl cursor-pointer",
                selectedCategory === category ? "bg-primary text-primary-foreground shadow-md shadow-primary/15" : ""
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Evolved Skills Section */}
        {evolvedSkills.length > 0 && !selectedCategory && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              Mastered Skills
              <span className="text-sm font-medium text-muted-foreground">({evolvedSkills.length})</span>
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
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {selectedCategory || "All"} Skills
            <span className="text-sm font-medium text-muted-foreground">
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
        "border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
        skill.isEvolved
          ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
          : "border-border/60 bg-card",
        isInLoadout && "ring-2 ring-primary/30"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
            skill.isEvolved 
              ? "bg-gradient-to-br from-amber-100 to-orange-100" 
              : "bg-primary/10"
          )}>
            {skill.icon}
          </div>
          <div className="flex items-center gap-1">
            {skill.isEvolved && <Star className="w-4 h-4 text-amber-500 fill-amber-400" />}
            <span className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full",
              skill.isEvolved 
                ? "bg-amber-100 text-amber-700" 
                : "bg-primary/10 text-primary"
            )}>
              Lv.{skill.level}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-foreground mb-1">{skill.name}</h4>
        <p className="text-xs text-muted-foreground mb-3">{skill.category}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{skill.level}/{skill.maxLevel}</span>
          </div>
          <Progress 
            value={(skill.level / skill.maxLevel) * 100} 
            className={cn("h-2", skill.isEvolved && "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-orange-400")}
          />
        </div>

        <Button
          size="sm"
          variant={isInLoadout ? "secondary" : "outline"}
          className="w-full mt-4 rounded-xl cursor-pointer"
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

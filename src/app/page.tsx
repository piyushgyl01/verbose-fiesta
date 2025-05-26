'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Calendar, TrendingUp, CheckCircle2, Circle, Flame, Award, BarChart3, Clock, RefreshCw } from 'lucide-react'

interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: 'daily' | 'weekly'
  targetCount: number
  color: string
  createdAt: Date
  completions: Record<string, number> // date -> count
}

interface FilterState {
  category: string
  frequency: string
  showCompleted: boolean
}

// Header Component
const Header = () => {
  return (
    <motion.header
      className="bg-black border-b border-white/20 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">HabitFlow</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Building momentum</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Habit Card Component
const HabitCard = ({
  habit,
  onToggleCompletion,
  onEdit,
  onDelete,
}: {
  habit: Habit
  onToggleCompletion: (habitId: string, date: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}) => {
  const today = new Date().toISOString().split('T')[0]
  const todayCount = habit.completions[today] || 0
  const isCompleted = todayCount >= habit.targetCount

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0
    const date = new Date()
    
    while (true) {
      const dateStr = date.toISOString().split('T')[0]
      const completion = habit.completions[dateStr] || 0
      
      if (completion >= habit.targetCount) {
        streak++
        date.setDate(date.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const streak = calculateStreak()

  // Get last 7 days for mini calendar
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const completion = habit.completions[dateStr] || 0
      const isComplete = completion >= habit.targetCount
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        isComplete,
        isToday: dateStr === today
      })
    }
    return days
  }

  const weekDays = getLast7Days()

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'health': return 'bg-white/20 text-white border-white/40'
      case 'productivity': return 'bg-white/15 text-white border-white/30'
      case 'learning': return 'bg-white/25 text-white border-white/50'
      case 'mindfulness': return 'bg-white/10 text-white border-white/25'
      default: return 'bg-white/10 text-white border-white/20'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-black border border-white/20 rounded-lg p-6 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-white">{habit.name}</h3>
            {streak > 0 && (
              <motion.div
                className="flex items-center space-x-1 text-white/80"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{streak}</span>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-white/60 mb-2">{habit.description}</p>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryStyle(habit.category)}`}>
            {habit.category}
          </span>
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(habit)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(habit.id)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Today's Progress</span>
          <span className="text-sm text-white font-medium">
            {todayCount}/{habit.targetCount}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((todayCount / habit.targetCount) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="mb-4">
        <span className="text-sm text-white/60 mb-2 block">Last 7 Days</span>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <motion.div
              key={day.date}
              className={`w-8 h-8 rounded border text-xs flex items-center justify-center ${
                day.isComplete 
                  ? 'bg-white text-black border-white' 
                  : day.isToday
                  ? 'border-white/60 text-white/80'
                  : 'border-white/20 text-white/40'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {day.day}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggleCompletion(habit.id, today)}
        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
          isCompleted
            ? 'bg-white text-black'
            : 'border border-white/20 text-white hover:bg-white/10'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>Completed Today</span>
          </>
        ) : (
          <>
            <Circle className="w-5 h-5" />
            <span>Mark Complete</span>
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

// Habit Editor Modal
const HabitEditor = ({
  habit,
  isOpen,
  onClose,
  onSave,
}: {
  habit: Habit | null
  isOpen: boolean
  onClose: () => void
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily' as 'daily' | 'weekly',
    targetCount: 1,
    color: '#ffffff',
  })

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        targetCount: habit.targetCount,
        color: habit.color,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        targetCount: 1,
        color: '#ffffff',
      })
    }
  }, [habit, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-black border border-white/20 rounded-lg w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>{habit ? 'Edit Habit' : 'Create Habit'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Habit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40"
              placeholder="e.g., Drink 8 glasses of water"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40"
              placeholder="Why is this habit important to you?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="health">Health</option>
                <option value="productivity">Productivity</option>
                <option value="learning">Learning</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="fitness">Fitness</option>
                <option value="social">Social</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Target</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.targetCount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              {habit ? 'Update Habit' : 'Create Habit'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 bg-black border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Filters Component
const Filters = ({
  filters,
  onFilterChange,
}: {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}) => {
  return (
    <motion.div
      className="bg-black border border-white/20 rounded-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Categories</option>
            <option value="health">Health</option>
            <option value="productivity">Productivity</option>
            <option value="learning">Learning</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="fitness">Fitness</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Frequency</label>
          <select
            value={filters.frequency}
            onChange={(e) => onFilterChange({ ...filters, frequency: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) => onFilterChange({ ...filters, showCompleted: e.target.checked })}
              className="w-4 h-4 rounded border-white/20"
            />
            <span className="text-sm text-white">Show completed only</span>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

// Main App Component
export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    frequency: '',
    showCompleted: false,
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const today = new Date().toISOString().split('T')[0]

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits).map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
      }))
      setHabits(parsedHabits)
    }
  }, [])

  // Save habits to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits))
    }
  }, [habits])

  const createHabit = () => {
    setEditingHabit(null)
    setIsEditorOpen(true)
  }

  const editHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsEditorOpen(true)
  }

  const saveHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prev => prev.map(habit => 
        habit.id === editingHabit.id 
          ? { ...habit, ...habitData }
          : habit
      ))
    } else {
      // Create new habit
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        createdAt: new Date(),
        completions: {},
      }
      setHabits(prev => [newHabit, ...prev])
    }
  }

  const toggleCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const currentCount = habit.completions[date] || 0
        const newCount = currentCount < habit.targetCount ? currentCount + 1 : 0
        
        return {
          ...habit,
          completions: {
            ...habit.completions,
            [date]: newCount
          }
        }
      }
      return habit
    }))
  }

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId))
  }

  // Filter habits
  const filteredHabits = habits.filter(habit => {
    if (filters.category && habit.category !== filters.category) return false
    if (filters.frequency && habit.frequency !== filters.frequency) return false
    if (filters.showCompleted) {
      const todayCount = habit.completions[today] || 0
      if (todayCount < habit.targetCount) return false
    }
    return true
  })

  const stats = {
    total: habits.length,
    completed: habits.filter(h => (h.completions[today] || 0) >= h.targetCount).length,
    streak: habits.reduce((acc, habit) => {
      let streak = 0
      const date = new Date()
      
      while (true) {
        const dateStr = date.toISOString().split('T')[0]
        const completion = habit.completions[dateStr] || 0
        
        if (completion >= habit.targetCount) {
          streak++
          date.setDate(date.getDate() - 1)
        } else {
          break
        }
      }
      
      return Math.max(acc, streak)
    }, 0),
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-white/60 flex items-center justify-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Total Habits</span>
            </div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{stats.completed}</div>
            <div className="text-white/60 flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Today</span>
            </div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{stats.streak}</div>
            <div className="text-white/60 flex items-center justify-center space-x-1">
              <Flame className="w-4 h-4" />
              <span>Best Streak</span>
            </div>
          </div>
        </motion.div>

        {/* Create Habit Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createHabit}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Habit</span>
          </motion.button>
        </motion.div>

        <Filters filters={filters} onFilterChange={setFilters} />

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={toggleCompletion}
                onEdit={editHabit}
                onDelete={deleteHabit}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredHabits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">No habits found</h3>
            <p className="text-white/60">
              {habits.length === 0
                ? 'Create your first habit to start building momentum!'
                : 'Try adjusting your filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Habit Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <HabitEditor
            habit={editingHabit}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveHabit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
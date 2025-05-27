'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChefHat, Plus, Clock, Users, Flame, Star, BookOpen,
  ShoppingCart, Calendar, Timer, Utensils, Coffee, Soup,
  Cookie, Apple, Fish, Beef, Carrot, Filter, Search,
  Heart, CheckCircle2, Circle, Play, Pause, RotateCcw
} from 'lucide-react'

interface Ingredient {
  name: string
  amount: number
  unit: string
  category: string
}

interface Recipe {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTime: number
  cookTime: number
  servings: number
  calories: number
  ingredients: Ingredient[]
  instructions: string[]
  tags: string[]
  isFavorite: boolean
  timesCooked: number
  rating: number
  createdAt: Date
}

interface MealPlan {
  id: string
  date: Date
  breakfast?: Recipe
  lunch?: Recipe
  dinner?: Recipe
  snacks: Recipe[]
}

interface ShoppingItem {
  name: string
  amount: number
  unit: string
  category: string
  purchased: boolean
  recipeId?: string
}

interface FilterState {
  category: string
  difficulty: string
  maxTime: string
  favorites: boolean
  searchQuery: string
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
            <ChefHat className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">CookFlow</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Ready to cook</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Recipe Stats Dashboard
const RecipeStats = ({ recipes, mealPlans }: { recipes: Recipe[], mealPlans: MealPlan[] }) => {
  const totalRecipes = recipes.length
  const favoriteRecipes = recipes.filter(r => r.isFavorite).length
  const totalTimesCooked = recipes.reduce((sum, r) => sum + r.timesCooked, 0)
  const avgRating = recipes.length > 0 
    ? recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length 
    : 0

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalRecipes}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <BookOpen className="w-3 h-3" />
          <span>Total Recipes</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{favoriteRecipes}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Heart className="w-3 h-3" />
          <span>Favorites</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalTimesCooked}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <ChefHat className="w-3 h-3" />
          <span>Times Cooked</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Star className="w-3 h-3" />
          <span>Avg Rating</span>
        </div>
      </div>
    </motion.div>
  )
}

// Recipe Card Component
const RecipeCard = ({
  recipe,
  onView,
  onCook,
  onToggleFavorite,
  onEdit,
  onDelete,
}: {
  recipe: Recipe
  onView: (recipe: Recipe) => void
  onCook: (recipe: Recipe) => void
  onToggleFavorite: (id: string) => void
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      breakfast: Coffee,
      lunch: Soup,
      dinner: Utensils,
      dessert: Cookie,
      snack: Apple,
      vegetarian: Carrot,
      meat: Beef,
      seafood: Fish,
      other: ChefHat,
    }
    const Icon = icons[category as keyof typeof icons] || ChefHat
    return <Icon className="w-4 h-4" />
  }

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-white/10 text-white border-white/30'
      case 'medium': return 'bg-white/20 text-white border-white/40'
      case 'hard': return 'bg-white/30 text-white border-white/50'
      default: return 'bg-white/10 text-white border-white/20'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-white fill-current' : 'text-white/30'}`}
      />
    ))
  }

  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-black border border-white/20 rounded-lg p-6 transition-all duration-200 group cursor-pointer"
      onClick={() => onView(recipe)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white">{recipe.name}</h3>
            {recipe.isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Heart className="w-4 h-4 text-white fill-current" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-white/60 mb-3 line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center space-x-3 text-sm text-white/60 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{totalTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-3 h-3" />
              <span>{recipe.calories} cal</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded border flex items-center space-x-1 ${getDifficultyStyle(recipe.difficulty)}`}>
              {getCategoryIcon(recipe.category)}
              <span className="capitalize">{recipe.category}</span>
            </span>
            <span className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded border border-white/10 capitalize">
              {recipe.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(recipe.rating)}
            </div>
            {recipe.timesCooked > 0 && (
              <span className="text-xs text-white/40">
                Cooked {recipe.timesCooked} time{recipe.timesCooked !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(recipe.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'text-white fill-current' : 'text-white/40'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(recipe)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(recipe.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs text-white/60 mb-1">Ingredients preview:</div>
        {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm text-white/70">
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span>{ingredient.amount} {ingredient.unit} {ingredient.name}</span>
          </div>
        ))}
        {recipe.ingredients.length > 3 && (
          <div className="text-xs text-white/40">+{recipe.ingredients.length - 3} more ingredients</div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation()
          onCook(recipe)
        }}
        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
      >
        <Play className="w-4 h-4" />
        <span>Start Cooking</span>
      </motion.button>
    </motion.div>
  )
}

// Recipe Editor Modal
const RecipeEditor = ({
  recipe,
  isOpen,
  onClose,
  onSave,
}: {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onSave: (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'timesCooked'>) => void
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'dinner',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    calories: 300,
    isFavorite: false,
    rating: 0,
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories,
        isFavorite: recipe.isFavorite,
        rating: recipe.rating,
      })
      setIngredients(recipe.ingredients)
      setInstructions(recipe.instructions)
      setTags(recipe.tags)
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'dinner',
        difficulty: 'medium',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        calories: 300,
        isFavorite: false,
        rating: 0,
      })
      setIngredients([])
      setInstructions([''])
      setTags([])
    }
  }, [recipe, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    onSave({
      ...formData,
      ingredients,
      instructions: instructions.filter(i => i.trim()),
      tags,
    })
    onClose()
  }

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', amount: 1, unit: 'cup', category: 'other' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    ))
  }

  const addInstruction = () => {
    setInstructions(prev => [...prev, ''])
  }

  const removeInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index))
  }

  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev => prev.map((instruction, i) => 
      i === index ? value : instruction
    ))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
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
        className="bg-black border border-white/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ChefHat className="w-5 h-5" />
            <span>{recipe ? 'Edit Recipe' : 'Create Recipe'}</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Recipe Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., Spaghetti Carbonara"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="meat">Meat</option>
                <option value="seafood">Seafood</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Describe your recipe..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Prep Time (min)</label>
              <input
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Cook Time (min)</label>
              <input
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Servings</label>
              <input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Calories</label>
              <input
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="0">No Rating</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Ingredients</h3>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addIngredient}
                className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors text-sm"
              >
                Add Ingredient
              </motion.button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="px-3 py-2 bg-black border border-white/20 rounded text-white placeholder-white/40 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="px-3 py-2 bg-black border border-white/20 rounded text-white placeholder-white/40 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="px-3 py-2 bg-black border border-white/20 rounded text-white placeholder-white/40 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 bg-white/5 border border-white/20 text-white/60 rounded hover:bg-white/10 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Instructions</h3>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addInstruction}
                className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-colors text-sm"
              >
                Add Step
              </motion.button>
            </div>

            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <textarea
                    placeholder={`Step ${index + 1}...`}
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-black border border-white/20 rounded text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="flex-shrink-0 px-3 py-2 bg-white/5 border border-white/20 text-white/60 rounded hover:bg-white/10 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Tags</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="Add tags..."
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTag}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Add
              </motion.button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/20"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="w-4 h-4 rounded border-white/20"
            />
            <label htmlFor="favorite" className="text-sm font-medium text-white flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Add to favorites</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              {recipe ? 'Update Recipe' : 'Create Recipe'}
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

// Search and Filters Component
const SearchAndFilters = ({
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
        <Search className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">Search & Filter Recipes</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Search recipes..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="meat">Meat</option>
            <option value="seafood">Seafood</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Max Time</label>
          <select
            value={filters.maxTime}
            onChange={(e) => onFilterChange({ ...filters, maxTime: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">Any Time</option>
            <option value="15">Under 15 min</option>
            <option value="30">Under 30 min</option>
            <option value="60">Under 1 hour</option>
            <option value="120">Under 2 hours</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.favorites}
            onChange={(e) => onFilterChange({ ...filters, favorites: e.target.checked })}
            className="w-4 h-4 rounded border-white/20"
          />
          <span className="text-sm text-white flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>Favorites only</span>
          </span>
        </label>
      </div>
    </motion.div>
  )
}

// Main App Component
export default function RecipeTracker() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    difficulty: '',
    maxTime: '',
    favorites: false,
    searchQuery: '',
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)

  // Load recipes from localStorage
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes')
    if (savedRecipes) {
      const parsedRecipes = JSON.parse(savedRecipes).map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
      }))
      setRecipes(parsedRecipes)
    }
  }, [])

  // Save recipes to localStorage
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('recipes', JSON.stringify(recipes))
    }
  }, [recipes])

  const createRecipe = () => {
    setEditingRecipe(null)
    setIsEditorOpen(true)
  }

  const editRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setIsEditorOpen(true)
  }

  const viewRecipe = (recipe: Recipe) => {
    setViewingRecipe(recipe)
  }

  const cookRecipe = (recipe: Recipe) => {
    // Increment times cooked
    setRecipes(prev => prev.map(r => 
      r.id === recipe.id 
        ? { ...r, timesCooked: r.timesCooked + 1 }
        : r
    ))
  }

  const saveRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'timesCooked'>) => {
    if (editingRecipe) {
      // Update existing recipe
      setRecipes(prev => prev.map(recipe => 
        recipe.id === editingRecipe.id 
          ? { ...recipe, ...recipeData }
          : recipe
      ))
    } else {
      // Create new recipe
      const newRecipe: Recipe = {
        ...recipeData,
        id: Date.now().toString(),
        createdAt: new Date(),
        timesCooked: 0,
      }
      setRecipes(prev => [newRecipe, ...prev])
    }
  }

  const toggleFavorite = (id: string) => {
    setRecipes(prev => prev.map(recipe =>
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ))
  }

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id))
  }

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    if (filters.category && recipe.category !== filters.category) return false
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false
    if (filters.favorites && !recipe.isFavorite) return false
    if (filters.maxTime) {
      const totalTime = recipe.prepTime + recipe.cookTime
      if (totalTime > parseInt(filters.maxTime)) return false
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <RecipeStats recipes={recipes} mealPlans={mealPlans} />

        {/* Create Recipe Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createRecipe}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Recipe</span>
          </motion.button>
        </motion.div>

        <SearchAndFilters filters={filters} onFilterChange={setFilters} />

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={viewRecipe}
                onCook={cookRecipe}
                onToggleFavorite={toggleFavorite}
                onEdit={editRecipe}
                onDelete={deleteRecipe}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">👨‍🍳</div>
            <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
            <p className="text-white/60">
              {recipes.length === 0
                ? 'Create your first recipe to start your culinary journey!'
                : 'Try adjusting your search or filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Recipe Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <RecipeEditor
            recipe={editingRecipe}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
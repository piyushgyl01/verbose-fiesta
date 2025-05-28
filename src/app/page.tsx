'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, Plus, Clock, BookOpen, Trophy, Star, Play,
  Pause, CheckCircle2, Circle, Target, TrendingUp, Calendar,
  Filter, Search, Video, FileText, Award, Brain, Code,
  Palette, DollarSign, Users, Globe, Laptop, Phone,
  Zap, BarChart3, Settings, Eye, EyeOff, Edit, Trash2
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'exercise' | 'quiz'
  duration: number // in minutes
  completed: boolean
  notes: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalLessons: number
  completedLessons: number
  estimatedHours: number
  actualHours: number
  progress: number // 0-100
  rating: number // 0-5
  status: 'not-started' | 'in-progress' | 'completed' | 'paused'
  startDate?: Date
  completedDate?: Date
  targetDate?: Date
  skills: string[]
  lessons: Lesson[]
  certificate: boolean
  certificateUrl?: string
  isFavorite: boolean
  createdAt: Date
}

interface LearningGoal {
  id: string
  title: string
  description: string
  targetDate: Date
  courses: string[] // course IDs
  progress: number
  completed: boolean
}

interface FilterState {
  category: string
  difficulty: string
  status: string
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
            <GraduationCap className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">LearnFlow</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Keep learning</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Learning Stats Dashboard
const LearningStats = ({ courses, goals }: { courses: Course[], goals: LearningGoal[] }) => {
  const totalCourses = courses.length
  const completedCourses = courses.filter(c => c.status === 'completed').length
  const inProgressCourses = courses.filter(c => c.status === 'in-progress').length
  const totalHoursLearned = courses.reduce((sum, c) => sum + c.actualHours, 0)
  const avgProgress = courses.length > 0 
    ? courses.reduce((sum, c) => sum + c.progress, 0) / courses.length 
    : 0

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalCourses}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <BookOpen className="w-3 h-3" />
          <span>Total Courses</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{completedCourses}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Trophy className="w-3 h-3" />
          <span>Completed</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{inProgressCourses}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Play className="w-3 h-3" />
          <span>In Progress</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{Math.round(totalHoursLearned)}h</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Hours Learned</span>
        </div>
      </div>
    </motion.div>
  )
}

// Course Card Component
const CourseCard = ({
  course,
  onView,
  onStart,
  onToggleFavorite,
  onEdit,
  onDelete,
}: {
  course: Course
  onView: (course: Course) => void
  onStart: (course: Course) => void
  onToggleFavorite: (id: string) => void
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      programming: Code,
      design: Palette,
      business: DollarSign,
      marketing: TrendingUp,
      'data-science': BarChart3,
      'web-development': Globe,
      'mobile-development': Phone,
      ai: Brain,
      other: BookOpen,
    }
    const Icon = icons[category as keyof typeof icons] || BookOpen
    return <Icon className="w-4 h-4" />
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-white/20 text-white border-white/40'
      case 'in-progress': return 'bg-white/15 text-white border-white/30'
      case 'paused': return 'bg-white/10 text-white border-white/20'
      default: return 'bg-white/5 text-white/60 border-white/10'
    }
  }

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-white/10 text-white border-white/30'
      case 'intermediate': return 'bg-white/20 text-white border-white/40'
      case 'advanced': return 'bg-white/30 text-white border-white/50'
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-black border border-white/20 rounded-lg p-6 transition-all duration-200 group cursor-pointer"
      onClick={() => onView(course)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white">{course.title}</h3>
            {course.isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Star className="w-4 h-4 text-white fill-current" />
              </motion.div>
            )}
            {course.certificate && (
              <Award className="w-4 h-4 text-white" />
            )}
          </div>
          <p className="text-sm text-white/60 mb-2">{course.instructor}</p>
          <p className="text-sm text-white/60 mb-3 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center space-x-3 text-sm text-white/60 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{course.estimatedHours}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{course.totalLessons} lessons</span>
            </div>
            {course.actualHours > 0 && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>{course.actualHours}h learned</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded border flex items-center space-x-1 ${getDifficultyStyle(course.difficulty)}`}>
              {getCategoryIcon(course.category)}
              <span className="capitalize">{course.category.replace('-', ' ')}</span>
            </span>
            <span className={`px-2 py-1 text-xs rounded border capitalize ${getStatusStyle(course.status)}`}>
              {course.status.replace('-', ' ')}
            </span>
            <span className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded border border-white/10 capitalize">
              {course.difficulty}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60">Progress</span>
              <span className="text-xs text-white">{Math.round(course.progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div 
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>

          {course.rating > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(course.rating)}
              </div>
              <span className="text-xs text-white/40">
                {course.completedLessons}/{course.totalLessons} lessons completed
              </span>
            </div>
          )}

          {course.skills.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-white/60 mb-1">Skills:</div>
              <div className="flex flex-wrap gap-1">
                {course.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded border border-white/10">
                    {skill}
                  </span>
                ))}
                {course.skills.length > 3 && (
                  <span className="text-xs text-white/40">+{course.skills.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(course.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Star className={`w-4 h-4 ${course.isFavorite ? 'text-white fill-current' : 'text-white/40'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(course)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Edit className="w-4 h-4 text-white/40 hover:text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(course.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white/40 hover:text-white" />
          </motion.button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation()
          onStart(course)
        }}
        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
      >
        {course.status === 'completed' ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Review Course</span>
          </>
        ) : course.status === 'in-progress' ? (
          <>
            <Play className="w-4 h-4" />
            <span>Continue Learning</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Course</span>
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

// Course Editor Modal
const CourseEditor = ({
  course,
  isOpen,
  onClose,
  onSave,
}: {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onSave: (courseData: Omit<Course, 'id' | 'createdAt'>) => void
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'programming',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    totalLessons: 10,
    estimatedHours: 5,
    isFavorite: false,
    certificate: false,
    rating: 0,
    status: 'not-started' as 'not-started' | 'in-progress' | 'completed' | 'paused',
  })

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        category: course.category,
        difficulty: course.difficulty,
        totalLessons: course.totalLessons,
        estimatedHours: course.estimatedHours,
        isFavorite: course.isFavorite,
        certificate: course.certificate,
        rating: course.rating,
        status: course.status,
      })
      setSkills(course.skills)
      setLessons(course.lessons)
    } else {
      setFormData({
        title: '',
        description: '',
        instructor: '',
        category: 'programming',
        difficulty: 'intermediate',
        totalLessons: 10,
        estimatedHours: 5,
        isFavorite: false,
        certificate: false,
        rating: 0,
        status: 'not-started',
      })
      setSkills([])
      setLessons([])
    }
  }, [course, isOpen])

  const handleSubmit = () => {
    if (!formData.title.trim()) return

    const progress = lessons.length > 0 
      ? (lessons.filter(l => l.completed).length / lessons.length) * 100 
      : 0

    onSave({
      ...formData,
      skills,
      lessons,
      progress,
      completedLessons: lessons.filter(l => l.completed).length,
      actualHours: 0,
      startDate: formData.status !== 'not-started' ? new Date() : undefined,
      completedDate: formData.status === 'completed' ? new Date() : undefined,
    })
    onClose()
  }

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const addLesson = () => {
    setLessons(prev => [...prev, {
      id: Date.now().toString(),
      title: '',
      type: 'video',
      duration: 30,
      completed: false,
      notes: ''
    }])
  }

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index))
  }

  const updateLesson = (index: number, field: keyof Lesson, value: any) => {
    setLessons(prev => prev.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    ))
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
            <GraduationCap className="w-5 h-5" />
            <span>{course ? 'Edit Course' : 'Add Course'}</span>
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

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., React Complete Guide"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Instructor</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Describe what you'll learn in this course..."
              rows={2}
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
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'not-started' | 'in-progress' | 'completed' | 'paused' }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Total Lessons</label>
              <input
                type="number"
                min="1"
                value={formData.totalLessons}
                onChange={(e) => setFormData(prev => ({ ...prev, totalLessons: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Est. Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
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
            <label className="block text-sm font-medium text-white mb-2">Skills You'll Learn</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="Add skills..."
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addSkill}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Add
              </motion.button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/20"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
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

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm text-white flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>Add to favorites</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.certificate}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm text-white flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Offers certificate</span>
              </span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              {course ? 'Update Course' : 'Add Course'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-black border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
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
        <h3 className="font-semibold text-white">Search & Filter Courses</h3>
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
              placeholder="Search courses..."
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
            <option value="programming">Programming</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
            <option value="data-science">Data Science</option>
            <option value="ai">AI & Machine Learning</option>
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
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
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
            <Star className="w-4 h-4" />
            <span>Favorites only</span>
          </span>
        </label>
      </div>
    </motion.div>
  )
}

// Main App Component
export default function LearningTracker() {
  const [courses, setCourses] = useState<Course[]>([])
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    difficulty: '',
    status: '',
    favorites: false,
    searchQuery: '',
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null)

  // Load courses from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses).map((course: any) => ({
        ...course,
        createdAt: new Date(course.createdAt),
        startDate: course.startDate ? new Date(course.startDate) : undefined,
        completedDate: course.completedDate ? new Date(course.completedDate) : undefined,
        targetDate: course.targetDate ? new Date(course.targetDate) : undefined,
      }))
      setCourses(parsedCourses)
    }
  }, [])

  // Save courses to localStorage
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('courses', JSON.stringify(courses))
    }
  }, [courses])

  const createCourse = () => {
    setEditingCourse(null)
    setIsEditorOpen(true)
  }

  const editCourse = (course: Course) => {
    setEditingCourse(course)
    setIsEditorOpen(true)
  }

  const viewCourse = (course: Course) => {
    setViewingCourse(course)
  }

  const startCourse = (course: Course) => {
    setCourses(prev => prev.map(c => 
      c.id === course.id 
        ? { 
            ...c, 
            status: c.status === 'not-started' ? 'in-progress' : c.status,
            startDate: c.startDate || new Date(),
            actualHours: c.actualHours + 0.5
          }
        : c
    ))
  }

  const saveCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    if (editingCourse) {
      // Update existing course
      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...courseData }
          : course
      ))
    } else {
      // Create new course
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        createdAt: new Date(),
        lessons: [],
      }
      setCourses(prev => [newCourse, ...prev])
    }
  }

  const toggleFavorite = (id: string) => {
    setCourses(prev => prev.map(course =>
      course.id === id ? { ...course, isFavorite: !course.isFavorite } : course
    ))
  }

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id))
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    if (filters.category && course.category !== filters.category) return false
    if (filters.difficulty && course.difficulty !== filters.difficulty) return false
    if (filters.status && course.status !== filters.status) return false
    if (filters.favorites && !course.isFavorite) return false
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.skills.some(skill => skill.toLowerCase().includes(query))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <LearningStats courses={courses} goals={goals} />

        {/* Create Course Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createCourse}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Course</span>
          </motion.button>
        </motion.div>

        <SearchAndFilters filters={filters} onFilterChange={setFilters} />

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onView={viewCourse}
                onStart={startCourse}
                onToggleFavorite={toggleFavorite}
                onEdit={editCourse}
                onDelete={deleteCourse}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-white/60">
              {courses.length === 0
                ? 'Add your first course to start your learning journey!'
                : 'Try adjusting your search or filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Course Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <CourseEditor
            course={editingCourse}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveCourse}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
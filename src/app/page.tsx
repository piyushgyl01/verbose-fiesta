'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Music, Plus, Clock, Heart, Star, Play, Pause, SkipForward,
  SkipBack, Volume2, Shuffle, Repeat, Headphones, Mic2,
  Album, Users, TrendingUp, Calendar, Filter, Search,
  User, Globe, Award, Eye, EyeOff, Edit, Trash2, Radio,
  Disc3, Guitar, Piano, Circle, Zap, Coffee, Moon, Sun,
  Target, BarChart3, Waves, Settings, Share2, Download
} from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number // in seconds
  releaseYear: number
  playCount: number
  rating: number // 0-5
  isFavorite: boolean
  mood: string
  energy: 'low' | 'medium' | 'high'
  language: string
  explicit: boolean
  dateAdded: Date
  lastPlayed?: Date
  tags: string[]
  lyrics?: string
  notes: string
  fileFormat: 'mp3' | 'flac' | 'wav' | 'aac'
  bitrate: number
  fileSize: number // in MB
  albumArtColor: string
  createdAt: Date
}

interface Playlist {
  id: string
  name: string
  description: string
  songIds: string[]
  totalDuration: number
  songCount: number
  isPublic: boolean
  isFavorite: boolean
  mood: string
  tags: string[]
  createdAt: Date
  lastModified: Date
  playCount: number
}

interface Artist {
  id: string
  name: string
  genre: string
  songCount: number
  totalPlayCount: number
  isFavorite: boolean
}

interface FilterState {
  genre: string
  mood: string
  energy: string
  artist: string
  favorites: boolean
  searchQuery: string
  year: string
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
            <Music className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">MusicFlow</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Keep listening</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Music Stats Dashboard
const MusicStats = ({ songs, playlists }: { songs: Song[], playlists: Playlist[] }) => {
  const totalSongs = songs.length
  const totalPlaylists = playlists.length
  const favoriteSongs = songs.filter(s => s.isFavorite).length
  const totalPlayTime = songs.reduce((sum, s) => sum + s.duration * s.playCount, 0)
  const totalHours = Math.round(totalPlayTime / 3600)
  const uniqueArtists = new Set(songs.map(s => s.artist)).size
  const avgRating = songs.filter(s => s.rating > 0).length > 0 
    ? songs.filter(s => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / songs.filter(s => s.rating > 0).length 
    : 0

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalSongs}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Music className="w-3 h-3" />
          <span>Total Songs</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalPlaylists}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Album className="w-3 h-3" />
          <span>Playlists</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{uniqueArtists}</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Users className="w-3 h-3" />
          <span>Artists</span>
        </div>
      </div>
      
      <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{totalHours}h</div>
        <div className="text-white/60 text-sm flex items-center justify-center space-x-1">
          <Headphones className="w-3 h-3" />
          <span>Listening Time</span>
        </div>
      </div>
    </motion.div>
  )
}

// Song Card Component
const SongCard = ({
  song,
  onView,
  onPlay,
  onToggleFavorite,
  onEdit,
  onDelete,
}: {
  song: Song
  onView: (song: Song) => void
  onPlay: (song: Song) => void
  onToggleFavorite: (id: string) => void
  onEdit: (song: Song) => void
  onDelete: (id: string) => void
}) => {
  const getGenreIcon = (genre: string) => {
    const icons = {
      rock: Guitar,
      pop: Mic2,
      jazz: Piano,
      electronic: Zap,
      classical: Piano,
      'hip-hop': Mic2,
      country: Guitar,
      folk: Guitar,
      blues: Guitar,
      reggae: Guitar,
      metal: Guitar,
      indie: Guitar,
      alternative: Guitar,
      funk: Circle,
      disco: Disc3,
      other: Music,
    }
    const Icon = icons[genre.toLowerCase() as keyof typeof icons] || Music
    return <Icon className="w-4 h-4" />
  }

  const getMoodIcon = (mood: string) => {
    const icons = {
      happy: Sun,
      sad: Moon,
      energetic: Zap,
      chill: Coffee,
      romantic: Heart,
      party: Disc3,
      workout: Target,
      focus: Target,
      other: Music,
    }
    const Icon = icons[mood.toLowerCase() as keyof typeof icons] || Music
    return <Icon className="w-4 h-4" />
  }

  const getEnergyStyle = (energy: string) => {
    switch (energy) {
      case 'high': return 'bg-white/20 text-white border-white/40'
      case 'medium': return 'bg-white/15 text-white border-white/30'
      case 'low': return 'bg-white/10 text-white border-white/20'
      default: return 'bg-white/10 text-white border-white/20'
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (mb: number) => {
    return mb >= 1000 ? `${(mb / 1000).toFixed(1)}GB` : `${mb}MB`
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
      onClick={() => onView(song)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white">{song.title}</h3>
            {song.isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Heart className="w-4 h-4 text-white fill-current" />
              </motion.div>
            )}
            {song.explicit && (
              <span className="text-xs bg-white/20 text-white px-1 py-0.5 rounded">E</span>
            )}
          </div>
          <p className="text-sm text-white/60 mb-1">{song.artist}</p>
          <p className="text-sm text-white/60 mb-3">{song.album} • {song.releaseYear}</p>
          
          <div className="flex items-center space-x-3 text-sm text-white/60 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(song.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="w-3 h-3" />
              <span>{song.playCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3" />
              <span>{song.bitrate}kbps</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded border flex items-center space-x-1 ${getEnergyStyle(song.energy)}`}>
              {getGenreIcon(song.genre)}
              <span className="capitalize">{song.genre}</span>
            </span>
            <span className="px-2 py-1 text-xs bg-white/10 text-white border border-white/20 rounded flex items-center space-x-1">
              {getMoodIcon(song.mood)}
              <span className="capitalize">{song.mood}</span>
            </span>
            <span className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded border border-white/10 capitalize">
              {song.energy} energy
            </span>
          </div>

          {song.rating > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(song.rating)}
              </div>
              <span className="text-xs text-white/40">
                {song.fileFormat.toUpperCase()} • {formatFileSize(song.fileSize)}
              </span>
            </div>
          )}

          {song.tags.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-white/60 mb-1">Tags:</div>
              <div className="flex flex-wrap gap-1">
                {song.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded border border-white/10">
                    {tag}
                  </span>
                ))}
                {song.tags.length > 3 && (
                  <span className="text-xs text-white/40">+{song.tags.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {song.lastPlayed && (
            <div className="text-xs text-white/40 mb-3">
              Last played: {song.lastPlayed.toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(song.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Heart className={`w-4 h-4 ${song.isFavorite ? 'text-white fill-current' : 'text-white/40'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(song)
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
              onDelete(song.id)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white/40 hover:text-white" />
          </motion.button>
        </div>
      </div>

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation()
            onPlay(song)
          }}
          className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Play Now</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation()
            // Add to queue functionality
          }}
          className="px-4 py-3 bg-black border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Song Editor Modal
const SongEditor = ({
  song,
  isOpen,
  onClose,
  onSave,
}: {
  song: Song | null
  isOpen: boolean
  onClose: () => void
  onSave: (songData: Omit<Song, 'id' | 'createdAt'>) => void
}) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'pop',
    duration: 180,
    releaseYear: new Date().getFullYear(),
    rating: 0,
    isFavorite: false,
    mood: 'happy',
    energy: 'medium' as 'low' | 'medium' | 'high',
    language: 'English',
    explicit: false,
    fileFormat: 'mp3' as 'mp3' | 'flac' | 'wav' | 'aac',
    bitrate: 320,
    fileSize: 5,
    albumArtColor: '#ffffff',
  })

  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        duration: song.duration,
        releaseYear: song.releaseYear,
        rating: song.rating,
        isFavorite: song.isFavorite,
        mood: song.mood,
        energy: song.energy,
        language: song.language,
        explicit: song.explicit,
        fileFormat: song.fileFormat,
        bitrate: song.bitrate,
        fileSize: song.fileSize,
        albumArtColor: song.albumArtColor,
      })
      setTags(song.tags)
      setLyrics(song.lyrics || '')
      setNotes(song.notes)
    } else {
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: 'pop',
        duration: 180,
        releaseYear: new Date().getFullYear(),
        rating: 0,
        isFavorite: false,
        mood: 'happy',
        energy: 'medium',
        language: 'English',
        explicit: false,
        fileFormat: 'mp3',
        bitrate: 320,
        fileSize: 5,
        albumArtColor: '#ffffff',
      })
      setTags([])
      setLyrics('')
      setNotes('')
    }
  }, [song, isOpen])

  const handleSubmit = () => {
    if (!formData.title.trim()) return

    onSave({
      ...formData,
      tags,
      lyrics,
      notes,
      playCount: song?.playCount || 0,
      dateAdded: song?.dateAdded || new Date(),
      lastPlayed: song?.lastPlayed,
    })
    onClose()
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
            <Music className="w-5 h-5" />
            <span>{song ? 'Edit Song' : 'Add Song'}</span>
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
              <label className="block text-sm font-medium text-white mb-2">Song Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., Bohemian Rhapsody"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., Queen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Album</label>
              <input
                type="text"
                value={formData.album}
                onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="e.g., A Night at the Opera"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Release Year</label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={formData.releaseYear}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Genre</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="electronic">Electronic</option>
                <option value="classical">Classical</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="country">Country</option>
                <option value="folk">Folk</option>
                <option value="blues">Blues</option>
                <option value="reggae">Reggae</option>
                <option value="metal">Metal</option>
                <option value="indie">Indie</option>
                <option value="alternative">Alternative</option>
                <option value="funk">Funk</option>
                <option value="disco">Disco</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Mood</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="energetic">Energetic</option>
                <option value="chill">Chill</option>
                <option value="romantic">Romantic</option>
                <option value="party">Party</option>
                <option value="workout">Workout</option>
                <option value="focus">Focus</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Energy Level</label>
              <select
                value={formData.energy}
                onChange={(e) => setFormData(prev => ({ ...prev, energy: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Duration (sec)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
              <span className="text-xs text-white/40">{formatDuration(formData.duration)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Bitrate (kbps)</label>
              <select
                value={formData.bitrate}
                onChange={(e) => setFormData(prev => ({ ...prev, bitrate: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="128">128</option>
                <option value="192">192</option>
                <option value="256">256</option>
                <option value="320">320</option>
                <option value="1411">1411 (CD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">File Format</label>
              <select
                value={formData.fileFormat}
                onChange={(e) => setFormData(prev => ({ ...prev, fileFormat: e.target.value as any }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="mp3">MP3</option>
                <option value="flac">FLAC</option>
                <option value="wav">WAV</option>
                <option value="aac">AAC</option>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">File Size (MB)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.fileSize}
                onChange={(e) => setFormData(prev => ({ ...prev, fileSize: parseFloat(e.target.value) || 0.1 }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Tags</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="Add tags..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTag}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Add
              </motion.button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/20"
                  >
                    <span>{tag}</span>
                    <button
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

          <div>
            <label className="block text-sm font-medium text-white mb-2">Lyrics (Optional)</label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Song lyrics..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Personal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Your thoughts about this song..."
              rows={2}
            />
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
                <Heart className="w-4 h-4" />
                <span>Add to favorites</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.explicit}
                onChange={(e) => setFormData(prev => ({ ...prev, explicit: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm text-white flex items-center space-x-1">
                <span>Explicit content</span>
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
              {song ? 'Update Song' : 'Add Song'}
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
        <h3 className="font-semibold text-white">Search & Filter Music</h3>
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
              placeholder="Search songs..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Genres</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="electronic">Electronic</option>
            <option value="classical">Classical</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="country">Country</option>
            <option value="folk">Folk</option>
            <option value="blues">Blues</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Mood</label>
          <select
            value={filters.mood}
            onChange={(e) => onFilterChange({ ...filters, mood: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Moods</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
            <option value="chill">Chill</option>
            <option value="romantic">Romantic</option>
            <option value="party">Party</option>
            <option value="workout">Workout</option>
            <option value="focus">Focus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Energy</label>
          <select
            value={filters.energy}
            onChange={(e) => onFilterChange({ ...filters, energy: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Energy Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
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
export default function MusicTracker() {
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [filters, setFilters] = useState<FilterState>({
    genre: '',
    mood: '',
    energy: '',
    artist: '',
    favorites: false,
    searchQuery: '',
    year: '',
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [viewingSong, setViewingSong] = useState<Song | null>(null)

  // Load songs from localStorage
  useEffect(() => {
    const savedSongs = localStorage.getItem('songs')
    if (savedSongs) {
      const parsedSongs = JSON.parse(savedSongs).map((song: any) => ({
        ...song,
        dateAdded: new Date(song.dateAdded),
        lastPlayed: song.lastPlayed ? new Date(song.lastPlayed) : undefined,
        createdAt: new Date(song.createdAt),
      }))
      setSongs(parsedSongs)
    }
  }, [])

  // Save songs to localStorage
  useEffect(() => {
    if (songs.length > 0) {
      localStorage.setItem('songs', JSON.stringify(songs))
    }
  }, [songs])

  const createSong = () => {
    setEditingSong(null)
    setIsEditorOpen(true)
  }

  const editSong = (song: Song) => {
    setEditingSong(song)
    setIsEditorOpen(true)
  }

  const viewSong = (song: Song) => {
    setViewingSong(song)
  }

  const playSong = (song: Song) => {
    setSongs(prev => prev.map(s => 
      s.id === song.id 
        ? { 
            ...s, 
            playCount: s.playCount + 1,
            lastPlayed: new Date()
          }
        : s
    ))
  }

  const saveSong = (songData: Omit<Song, 'id' | 'createdAt'>) => {
    if (editingSong) {
      // Update existing song
      setSongs(prev => prev.map(song => 
        song.id === editingSong.id 
          ? { ...song, ...songData }
          : song
      ))
    } else {
      // Create new song
      const newSong: Song = {
        ...songData,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setSongs(prev => [newSong, ...prev])
    }
  }

  const toggleFavorite = (id: string) => {
    setSongs(prev => prev.map(song =>
      song.id === id ? { ...song, isFavorite: !song.isFavorite } : song
    ))
  }

  const deleteSong = (id: string) => {
    setSongs(prev => prev.filter(song => song.id !== id))
  }

  // Filter songs
  const filteredSongs = songs.filter(song => {
    if (filters.genre && song.genre !== filters.genre) return false
    if (filters.mood && song.mood !== filters.mood) return false
    if (filters.energy && song.energy !== filters.energy) return false
    if (filters.favorites && !song.isFavorite) return false
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query) ||
        song.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <MusicStats songs={songs} playlists={playlists} />

        {/* Add Song Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createSong}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Song</span>
          </motion.button>
        </motion.div>

        <SearchAndFilters filters={filters} onFilterChange={setFilters} />

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onView={viewSong}
                onPlay={playSong}
                onToggleFavorite={toggleFavorite}
                onEdit={editSong}
                onDelete={deleteSong}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredSongs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-white mb-2">No songs found</h3>
            <p className="text-white/60">
              {songs.length === 0
                ? 'Add your first song to start building your music library!'
                : 'Try adjusting your search or filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Song Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <SongEditor
            song={editingSong}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveSong}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
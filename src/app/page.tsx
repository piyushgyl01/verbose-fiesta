"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Star,
  Trash2,
  Edit3,
  BookOpen,
  Tag,
  Calendar,
  Filter,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FilterState {
  category: string;
  isFavorite: boolean;
  searchQuery: string;
}

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
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">NoteVault</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Auto-save enabled</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Note Card Component
const NoteCard = ({
  note,
  onToggleFavorite,
  onDelete,
  onEdit,
}: {
  note: Note;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-white/20 text-white border-white/40";
      case "personal":
        return "bg-white/15 text-white border-white/30";
      case "ideas":
        return "bg-white/25 text-white border-white/50";
      case "projects":
        return "bg-white/10 text-white border-white/25";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-black border border-white/20 rounded-lg p-6 transition-all duration-200 cursor-pointer group"
      onClick={() => onEdit(note)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white line-clamp-1">
              {note.title}
            </h3>
            {note.isFavorite && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Star className="w-4 h-4 text-white fill-current" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-white/70 line-clamp-3 mb-3">
            {note.content}
          </p>
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                note.isFavorite ? "text-white fill-current" : "text-white/40"
              }`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white/40 hover:text-white" />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(
              note.category
            )}`}
          >
            {note.category}
          </span>
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded border border-white/10"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-xs text-white/40">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 text-xs text-white/40">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const NoteEditor = ({
  note,
  isOpen,
  onClose,
  onSave,
}: {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "personal",
    tags: [] as string[],
    isFavorite: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        isFavorite: note.isFavorite,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category: "personal",
        tags: [],
        isFavorite: false,
      });
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave(formData);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  if (!isOpen) return null;

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
            <Edit3 className="w-5 h-5" />
            <span>{note ? "Edit Note" : "Create Note"}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40 text-lg"
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="projects">Projects</option>
                <option value="study">Study</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.isFavorite}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFavorite: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-white/20"
              />
              <label
                htmlFor="favorite"
                className="text-sm font-medium text-white flex items-center space-x-1"
              >
                <Star className="w-4 h-4" />
                <span>Add to favorites</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40 min-h-[200px] resize-y"
              placeholder="Write your note content..."
              rows={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                placeholder="Add tags..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addTag}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <Tag className="w-4 h-4" />
              </motion.button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/20"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              {note ? "Update Note" : "Create Note"}
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
  );
};

const SearchAndFilters = ({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) => {
  return (
    <motion.div
      className="bg-black border border-white/20 rounded-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">Search & Filter</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="Search notes..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value })
            }
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Categories</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="ideas">Ideas</option>
            <option value="projects">Projects</option>
            <option value="study">Study</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isFavorite}
            onChange={(e) =>
              onFilterChange({ ...filters, isFavorite: e.target.checked })
            }
            className="w-4 h-4 rounded border-white/20"
          />
          <span className="text-sm text-white flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Favorites only</span>
          </span>
        </label>
      </div>
    </motion.div>
  );
};

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    isFavorite: false,
    searchQuery: "",
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const saveNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: new Date() }
            : note
        )
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const toggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, isFavorite: !note.isFavorite, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter((note) => {
    if (filters.category && note.category !== filters.category) return false;
    if (filters.isFavorite && !note.isFavorite) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const stats = {
    total: notes.length,
    favorites: notes.filter((n) => n.isFavorite).length,
    categories: new Set(notes.map((n) => n.category)).size,
  };

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
            <div className="text-white/60">Total Notes</div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.favorites}
            </div>
            <div className="text-white/60">Favorites</div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.categories}
            </div>
            <div className="text-white/60">Categories</div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNote}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Note</span>
          </motion.button>
        </motion.div>

        <SearchAndFilters filters={filters} onFilterChange={setFilters} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteNote}
                onEdit={editNote}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No notes found
            </h3>
            <p className="text-white/60">
              {notes.length === 0
                ? "Create your first note to get started!"
                : "Try adjusting your search or filters."}
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <NoteEditor
            note={editingNote}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

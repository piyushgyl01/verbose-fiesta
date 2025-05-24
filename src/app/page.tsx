"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
}

interface FilterState {
  category: string;
  priority: string;
  completed: string;
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
          <motion.h1
            className="text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            TaskFlow
          </motion.h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const TaskCard = ({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const priorityStyles = {
    low: "bg-white/10 text-white border-white/30",
    medium: "bg-white/20 text-white border-white/40",
    high: "bg-white text-black border-white",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-black border border-white/20 rounded-lg p-6 transition-all duration-200 ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? "bg-white border-white"
                : "border-white/40 hover:border-white"
            }`}
          >
            {task.completed && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </motion.svg>
            )}
          </motion.button>
          <div>
            <h3
              className={`font-semibold text-white ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            <p className="text-sm text-white/60">{task.description}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded border ${
              priorityStyles[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-white/10 text-white rounded border border-white/20">
            {task.category}
          </span>
        </div>
        <span className="text-xs text-white/40">
          {task.createdAt.toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

const AddTaskForm = ({
  onAdd,
}: {
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    category: "work",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAdd({
      ...formData,
      completed: false,
    });

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
    });
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors"
      >
        + Add New Task
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-black border border-white/20 rounded-lg overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40"
                  placeholder="Enter task title..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white placeholder-white/40"
                  placeholder="Task description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Task["priority"],
                      })
                    }
                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none transition-colors text-white"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-white text-black py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                >
                  Add Task
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-black border border-white/20 text-white py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Filters = ({
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
      <h3 className="font-semibold text-white mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              onFilterChange({ ...filters, priority: e.target.value })
            }
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Status
          </label>
          <select
            value={filters.completed}
            onChange={(e) =>
              onFilterChange({ ...filters, completed: e.target.value })
            }
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Tasks</option>
            <option value="false">Active</option>
            <option value="true">Completed</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priority: "",
    completed: "",
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, []);

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (
      filters.completed !== "" &&
      task.completed.toString() !== filters.completed
    )
      return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-white/60">Total Tasks</div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.completed}
            </div>
            <div className="text-white/60">Completed</div>
          </div>
          <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{stats.pending}</div>
            <div className="text-white/60">Pending</div>
          </div>
        </motion.div>

        <AddTaskForm onAdd={addTask} />
        <Filters filters={filters} onFilterChange={setFilters} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No tasks found
            </h3>
            <p className="text-white/60">
              {tasks.length === 0
                ? "Add your first task to get started!"
                : "Try adjusting your filters."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

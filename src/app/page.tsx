'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, Plus, TrendingUp, TrendingDown, Wallet, 
  CreditCard, ShoppingBag, Car, Home, Coffee, Book, 
  Gamepad2, Heart, PiggyBank, BarChart3, Calendar,
  Filter, ArrowUpCircle, ArrowDownCircle, Eye, EyeOff
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: Date
  createdAt: Date
}

interface Budget {
  category: string
  limit: number
  spent: number
}

interface FilterState {
  type: string
  category: string
  dateRange: string
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
            <DollarSign className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">CashFlow</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Financial tracking active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Balance Card Component
const BalanceCard = ({ 
  transactions, 
  showBalance, 
  onToggleBalance 
}: { 
  transactions: Transaction[]
  showBalance: boolean
  onToggleBalance: () => void
}) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpenses

  return (
    <motion.div
      className="bg-black border border-white/20 rounded-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Current Balance</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleBalance}
          className="text-white/60 hover:text-white transition-colors"
        >
          {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ArrowUpCircle className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Income</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {showBalance ? `$${totalIncome.toFixed(2)}` : '••••••'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ArrowDownCircle className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {showBalance ? `$${totalExpenses.toFixed(2)}` : '••••••'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Wallet className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Balance</span>
          </div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-white/70'}`}>
            {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Transaction Card Component
const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      food: Coffee,
      transport: Car,
      housing: Home,
      shopping: ShoppingBag,
      entertainment: Gamepad2,
      health: Heart,
      education: Book,
      salary: DollarSign,
      freelance: CreditCard,
      investment: TrendingUp,
      other: PiggyBank,
    }
    const Icon = icons[category as keyof typeof icons] || PiggyBank
    return <Icon className="w-4 h-4" />
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-black border border-white/20 rounded-lg p-4 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            transaction.type === 'income' 
              ? 'bg-white/10 border-white/30' 
              : 'bg-white/5 border-white/20'
          }`}>
            {getCategoryIcon(transaction.category)}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-white">{transaction.description}</h3>
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <span className="capitalize">{transaction.category}</span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className={`font-bold ${
              transaction.type === 'income' ? 'text-white' : 'text-white/80'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
            <div className="text-xs text-white/40 capitalize">{transaction.type}</div>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(transaction)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(transaction.id)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/40 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Transaction Editor Modal
const TransactionEditor = ({
  transaction,
  isOpen,
  onClose,
  onSave,
}: {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onSave: (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => void
}) => {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date.toISOString().split('T')[0],
      })
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
      })
    }
  }, [transaction, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.description.trim()) return

    onSave({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date),
    })
    onClose()
  }

  const expenseCategories = ['food', 'transport', 'housing', 'shopping', 'entertainment', 'health', 'education', 'other']
  const incomeCategories = ['salary', 'freelance', 'investment', 'other']

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
            <DollarSign className="w-5 h-5" />
            <span>{transaction ? 'Edit Transaction' : 'Add Transaction'}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: 'food' }))}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                    formData.type === 'expense'
                      ? 'bg-white/10 border-white/40 text-white'
                      : 'border-white/20 text-white/60 hover:bg-white/5'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Expense</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'salary' }))}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                    formData.type === 'income'
                      ? 'bg-white/10 border-white/40 text-white'
                      : 'border-white/20 text-white/60 hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Income</span>
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white placeholder-white/40"
              placeholder="What was this for?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
              >
                {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
              {transaction ? 'Update Transaction' : 'Add Transaction'}
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
        <Filter className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Type</label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="housing">Housing</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg focus:border-white outline-none text-white"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

// Quick Actions Component
const QuickActions = ({ onAddTransaction }: { onAddTransaction: (type: 'income' | 'expense') => void }) => {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAddTransaction('income')}
        className="bg-white/10 border border-white/20 text-white py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
      >
        <TrendingUp className="w-5 h-5" />
        <span>Add Income</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAddTransaction('expense')}
        className="bg-white/10 border border-white/20 text-white py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
      >
        <TrendingDown className="w-5 h-5" />
        <span>Add Expense</span>
      </motion.button>
    </motion.div>
  )
}

// Main App Component
export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    category: '',
    dateRange: '',
  })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('expense')

  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.createdAt),
      }))
      setTransactions(parsedTransactions)
    }
  }, [])

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions))
    }
  }, [transactions])

  const addTransaction = (type: 'income' | 'expense') => {
    setDefaultType(type)
    setEditingTransaction(null)
    setIsEditorOpen(true)
  }

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsEditorOpen(true)
  }

  const saveTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => prev.map(transaction => 
        transaction.id === editingTransaction.id 
          ? { ...transaction, ...transactionData }
          : transaction
      ))
    } else {
      // Create new transaction
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setTransactions(prev => [newTransaction, ...prev])
    }
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type && transaction.type !== filters.type) return false
    if (filters.category && transaction.category !== filters.category) return false
    
    if (filters.dateRange) {
      const now = new Date()
      const transactionDate = transaction.date
      
      switch (filters.dateRange) {
        case 'today':
          if (transactionDate.toDateString() !== now.toDateString()) return false
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (transactionDate < weekAgo) return false
          break
        case 'month':
          if (transactionDate.getMonth() !== now.getMonth() || 
              transactionDate.getFullYear() !== now.getFullYear()) return false
          break
      }
    }
    
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <BalanceCard 
          transactions={transactions} 
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
        />

        <QuickActions onAddTransaction={addTransaction} />
        <Filters filters={filters} onFilterChange={setFilters} />

        {/* Transactions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <span className="text-sm text-white/60">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={editTransaction}
                onDelete={deleteTransaction}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-white/20 text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">No transactions found</h3>
            <p className="text-white/60">
              {transactions.length === 0
                ? 'Add your first transaction to start tracking your finances!'
                : 'Try adjusting your filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Transaction Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <TransactionEditor
            transaction={editingTransaction}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveTransaction}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
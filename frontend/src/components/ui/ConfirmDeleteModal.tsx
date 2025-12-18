import { Loader2, AlertTriangle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  targetName: string
  isLoading: boolean
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, targetName, isLoading }: Props) {
  const [userInput, setUserInput] = useState('')

  // Reset input when modal closes
  useEffect(() => {
    if (!isOpen) setUserInput('')
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            This action is permanent. To confirm, please type <span className="font-mono font-bold text-red-600 dark:text-red-400 px-1 bg-red-50 dark:bg-red-900/20 rounded">{targetName}</span> below.
          </p>

          <input 
            autoFocus
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-red-500 focus:outline-none transition-all mb-6"
            placeholder="Type name to confirm..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={userInput !== targetName || isLoading}
              className="flex-[2] py-3 px-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              Confirm Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
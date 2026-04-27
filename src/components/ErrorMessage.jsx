import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px]"
    >
      <div className="glass rounded-2xl p-8 text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ErrorMessage

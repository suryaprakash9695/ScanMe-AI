import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-12 h-12 text-blue-400" />
      </motion.div>
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  )
}

export default LoadingSpinner

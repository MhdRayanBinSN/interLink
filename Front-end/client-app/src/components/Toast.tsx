import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

export const CustomToast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-gradient-to-r from-[#1d2132] to-[#222839] border border-green-500/20' 
          : 'bg-gradient-to-r from-[#1d2132] to-[#222839] border border-red-500/20'
      }`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <div className="rounded-full bg-green-500/10 p-1.5">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        ) : (
          <div className="rounded-full bg-red-500/10 p-1.5">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
        <p className={`font-medium ${type === 'success' ? 'text-white' : 'text-white'}`}>
          {message}
        </p>
      </div>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-gray-700/50"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </motion.div>
  );
};
import React, { useState, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ResponsiveDrawerProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  children,
  isOpen,
  onClose,
  title,
  className = ''
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {isDesktop ? (
            // Desktop: Modal in center
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none"
            >
              <div 
                className={`bg-gradient-to-br from-[#222839] to-[#1c2030] border border-gray-700 rounded-xl max-w-md w-full pointer-events-auto ${className}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-[#1d2132]/30">
                  <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{title}</h2>
                  <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                    aria-label="Close"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          ) : (
            // Mobile: Drawer from bottom
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl bg-gradient-to-br from-[#222839] to-[#1c2030] border-t border-x border-gray-700 shadow-2xl"
              style={{ maxHeight: "calc(100vh - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#1d2132]/30">
                <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{title}</h2>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-5 overflow-auto" style={{ maxHeight: "calc(80vh - 4rem)" }}>
                {children}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveDrawer;
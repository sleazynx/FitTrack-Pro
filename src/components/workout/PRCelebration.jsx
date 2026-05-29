import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function PRCelebration({ pr, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="fixed top-14 left-4 right-4 z-[100] pointer-events-none"
    >
      <div className="bg-amber-500 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Trophy size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm">New Personal Record! 🎉</p>
          <p className="text-xs text-white/90 truncate">{pr.exerciseName} — {pr.weight > 0 ? `${pr.weight}kg × ${pr.reps}` : `${pr.reps} reps`}</p>
        </div>
        <p className="text-xs font-bold text-white/80 flex-shrink-0">
          {pr.weight > 0 ? `1RM: ${pr.est1RM}kg` : `${pr.reps} reps`}
        </p>
      </div>
    </motion.div>
  );
}
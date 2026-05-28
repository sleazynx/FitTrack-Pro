import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

const CONFETTI_COLORS = ['#3A5BF0', '#FF6B6B', '#F59E0B', '#10B981', '#8B5CF6'];

export default function PRCelebration({ pr, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: Math.random() * 10 + 6,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
    >
      {/* Confetti */}
      {confettiPieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute top-10 rounded-sm animate-confetti-fall pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: 300, opacity: 0, rotate: 360 }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeIn' }}
        />
      ))}

      {/* Card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-card rounded-3xl p-8 mx-6 text-center shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 tap-scale">
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={40} className="text-amber-500" />
        </div>

        <div className="text-4xl font-black text-foreground mb-1">New PR! 🎉</div>
        <div className="text-xl font-bold text-primary mb-2">{pr.exerciseName}</div>
        <div className="text-3xl font-black text-foreground mb-1">
          {pr.weight}kg × {pr.reps}
        </div>
        <div className="text-muted-foreground">
          Est. 1RM: <span className="font-bold text-foreground">{pr.est1RM}kg</span>
        </div>

        <div className="mt-6 flex gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex-1 py-2 bg-primary/10 rounded-xl text-primary font-semibold text-sm"
          >
            🏆 Personal Record
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
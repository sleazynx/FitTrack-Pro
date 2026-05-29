import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SkipForward, Plus, Minus } from 'lucide-react';

export default function RestTimer({ seconds, defaultSeconds, onDone, onSkip }) {
  // Use a ref for the target end timestamp so it survives background throttling
  const endTimeRef = useRef(Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(seconds);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // When `seconds` prop changes (user adjusts), shift the end time
  const adjustRef = useRef(false);
  useEffect(() => {
    if (!adjustRef.current) { adjustRef.current = true; return; }
    endTimeRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setTimeout(() => doneRef.current(), 50);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    const rafRef = { current: requestAnimationFrame(tick) };
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const adjust = useCallback((delta) => {
    endTimeRef.current = Math.max(Date.now() + 5000, endTimeRef.current + delta * 1000);
    setRemaining(r => Math.max(5, r + delta));
  }, []);

  const pct = defaultSeconds > 0 ? remaining / defaultSeconds : 0;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="flex-shrink-0 mx-5 my-2 bg-primary rounded-2xl p-3 flex items-center gap-3 shadow-lg overflow-hidden"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-primary-foreground/80 text-xs font-medium">Rest Timer</span>
          <span className="text-primary-foreground font-black text-lg tabular-nums">
            {m}:{s.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full">
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => adjust(-30)} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center tap-scale">
          <Minus size={14} className="text-white" />
        </button>
        <button onClick={() => adjust(30)} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center tap-scale">
          <Plus size={14} className="text-white" />
        </button>
        <button onClick={onSkip} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center tap-scale">
          <SkipForward size={14} className="text-white" />
        </button>
      </div>
    </motion.div>
  );
}
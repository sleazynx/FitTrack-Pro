import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, ChevronDown, ChevronUp, Timer, Dumbbell, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../lib/useAppStore';
import { getAllExercises, calculate1RM } from '../../lib/exercises';
import { saveActiveWorkout, getActiveWorkout, clearActiveWorkout } from '../../lib/storage';
import PRCelebration from '../../components/workout/PRCelebration';
import RestTimer from '../../components/workout/RestTimer';
import ExercisePicker from '../../components/workout/ExercisePicker';

function makeSet(prev = null) {
  return {
    id: Date.now().toString() + Math.random(),
    weight: prev?.weight ?? '',
    reps: prev?.reps ?? '',
    completed: false,
  };
}

export default function ActiveWorkout() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { routines, customExercises, completeWorkout, prHistory, checkAndSavePR, settings } = useApp();
  const allExercises = getAllExercises(customExercises);
  const routine = routineId !== 'empty' ? routines.find(r => r.id === routineId) : null;

  // ── Session start: fixed at mount time so midnight splits don't occur ──
  const sessionStartRef = useRef(null);

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [startTimestamp, setStartTimestamp] = useState(null); // epoch ms
  const [elapsed, setElapsed] = useState(0);
  const [showExPicker, setShowExPicker] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [prAlert, setPrAlert] = useState(null);
  const [showWarmup, setShowWarmup] = useState(null); // exerciseIdx or null
  const [initialized, setInitialized] = useState(false);

  // ── Load or resume session ──
  useEffect(() => {
    const saved = getActiveWorkout();
    if (saved && saved.routineId === routineId) {
      // Resume crashed/backgrounded session
      setWorkoutName(saved.workoutName);
      setExercises(saved.exercises);
      setStartTimestamp(saved.startTimestamp);
    } else {
      // Fresh session — record start time once (midnight-safe: one fixed timestamp)
      const now = Date.now();
      setStartTimestamp(now);
      const initExercises = routine?.exercises
        ? routine.exercises.map(ex => ({
            ...ex,
            sets: [makeSet()],
          }))
        : [];
      setWorkoutName(routine?.name || 'Quick Workout');
      setExercises(initExercises);
    }
    setInitialized(true);
  }, []);

  // ── Auto-save on every change (crash recovery) ──
  useEffect(() => {
    if (!initialized || startTimestamp === null) return;
    saveActiveWorkout({ routineId, workoutName, exercises, startTimestamp });
  }, [exercises, workoutName, initialized, startTimestamp]);

  // ── Elapsed timer (timestamp-based, background-safe) ──
  useEffect(() => {
    if (!startTimestamp) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startTimestamp) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTimestamp]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Set operations ──
  const addSet = (exIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets = [...ex.sets, makeSet(lastSet)];
      updated[exIdx] = ex;
      return updated;
    });
  };

  const removeSet = (exIdx, setIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      if (ex.sets.length <= 1) return prev;
      ex.sets = ex.sets.filter((_, i) => i !== setIdx);
      updated[exIdx] = ex;
      return updated;
    });
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      ex.sets = ex.sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s);
      updated[exIdx] = ex;
      return updated;
    });
  };

  const completeSet = (exIdx, setIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const set = ex.sets[setIdx];

      // ── Validation: fill from previous set if empty ──
      const prevSet = setIdx > 0 ? ex.sets[setIdx - 1] : null;
      const weight = set.weight !== '' ? set.weight : (prevSet?.weight ?? '0');
      const reps   = set.reps   !== '' ? set.reps   : (prevSet?.reps   ?? '1');

      if (!reps) return prev; // still nothing to log

      // Update with resolved values before marking complete
      ex.sets = ex.sets.map((s, i) =>
        i === setIdx ? { ...s, weight, reps, completed: true } : s
      );
      updated[exIdx] = ex;

      // PR check (runs after state update via resolved values)
      const { isNew, est1RM } = checkAndSavePR(ex.exerciseId, ex.exerciseName, parseFloat(weight), parseInt(reps));
      if (isNew) setPrAlert({ exerciseName: ex.exerciseName, weight, reps, est1RM });

      if (navigator.vibrate) navigator.vibrate([50]);
      setRestTimer(settings?.restTimerDefault || 180);

      return updated;
    });
  };

  const addExercise = (ex) => {
    setExercises(prev => [...prev, {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: [makeSet()],
    }]);
    setShowExPicker(false);
  };

  const removeExercise = (exIdx) => setExercises(prev => prev.filter((_, i) => i !== exIdx));

  const handleFinish = () => {
    const session = {
      name: workoutName,
      routineId: routine?.id || null,
      // completedAt uses Date.now() so it's recorded when finished, not when started
      exercises,
      duration: Math.floor(elapsed / 60),
      totalVolume: exercises.reduce((total, ex) =>
        total + ex.sets.filter(s => s.completed && s.weight && s.reps)
          .reduce((sum, s) => sum + parseFloat(s.weight) * parseInt(s.reps), 0), 0),
    };
    completeWorkout(session);
    clearActiveWorkout();
    navigate('/workout', { replace: true });
  };

  const handleDiscard = () => {
    clearActiveWorkout();
    navigate('/workout', { replace: true });
  };

  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

  if (!initialized) return null;

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14 pb-3 bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowFinish(true)} className="p-2 -ml-2 tap-scale">
            <X size={22} className="text-muted-foreground" />
          </button>
          <input
            type="text"
            value={workoutName}
            onChange={e => setWorkoutName(e.target.value)}
            className="flex-1 text-xl font-black text-foreground bg-transparent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Timer size={14} /> {formatTime(elapsed)}</span>
          <span className="flex items-center gap-1"><Dumbbell size={14} /> {exercises.length} exercises</span>
          <span className="flex items-center gap-1"><Check size={14} /> {completedSets} sets done</span>
        </div>
      </div>

      {/* Rest Timer Banner */}
      <AnimatePresence>
        {restTimer !== null && (
          <RestTimer
            seconds={restTimer}
            defaultSeconds={settings?.restTimerDefault || 180}
            onDone={() => setRestTimer(null)}
            onSkip={() => setRestTimer(null)}
            onChange={(s) => setRestTimer(s)}
          />
        )}
      </AnimatePresence>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto ios-scroll px-5 py-4 pb-32 space-y-4">
        {exercises.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto mb-3 text-muted-foreground" size={40} />
            <p className="text-muted-foreground font-medium">Add exercises to start</p>
          </div>
        )}

        {exercises.map((ex, exIdx) => (
          <ExerciseCard
            key={`${ex.exerciseId}-${exIdx}`}
            exercise={ex}
            exIdx={exIdx}
            prHistory={prHistory}
            onAddSet={() => addSet(exIdx)}
            onRemoveSet={(setIdx) => removeSet(exIdx, setIdx)}
            onUpdateSet={(setIdx, field, value) => updateSet(exIdx, setIdx, field, value)}
            onCompleteSet={(setIdx) => completeSet(exIdx, setIdx)}
            onRemoveExercise={() => removeExercise(exIdx)}
            onShowWarmup={() => setShowWarmup(exIdx)}
          />
        ))}

        <button
          onClick={() => setShowExPicker(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-primary font-semibold tap-scale"
        >
          <Plus size={18} /> Add Exercise
        </button>
      </div>

      {/* Finish button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={handleFinish}
          disabled={exercises.length === 0}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg disabled:opacity-40 tap-scale"
        >
          Finish Workout
        </button>
      </div>

      {/* Exercise Picker */}
      <AnimatePresence>
        {showExPicker && (
          <ExercisePicker
            allExercises={allExercises}
            customExercises={customExercises}
            onAdd={addExercise}
            onClose={() => setShowExPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* Warmup Calculator */}
      <AnimatePresence>
        {showWarmup !== null && (
          <WarmupModal
            exercise={exercises[showWarmup]}
            onClose={() => setShowWarmup(null)}
          />
        )}
      </AnimatePresence>

      {/* Cancel confirm */}
      <AnimatePresence>
        {showFinish && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFinish(false)}>
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-card w-full rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-2">End Workout?</h3>
              <p className="text-muted-foreground mb-6">Save your progress or discard this session.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowFinish(false)} className="flex-1 py-3.5 border border-border rounded-xl font-semibold tap-scale">Keep Going</button>
                <button onClick={handleDiscard} className="flex-1 py-3.5 bg-destructive text-white rounded-xl font-semibold tap-scale">Discard</button>
              </div>
              <button onClick={handleFinish} className="w-full mt-3 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold tap-scale">Save & Exit</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PR Celebration */}
      <AnimatePresence>
        {prAlert && <PRCelebration pr={prAlert} onClose={() => setPrAlert(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Warmup Calculator ──────────────────────────────────────────────────────────
function WarmupModal({ exercise, onClose }) {
  const completedSets = exercise.sets.filter(s => s.completed && s.weight);
  const lastWeight = completedSets.length > 0
    ? parseFloat(completedSets[completedSets.length - 1].weight)
    : parseFloat(exercise.sets.find(s => s.weight)?.weight || 0);

  const [targetWeight, setTargetWeight] = useState(lastWeight > 0 ? String(lastWeight) : '');

  const target = parseFloat(targetWeight) || 0;
  const warmups = target > 0
    ? [
        { pct: '50%', weight: Math.round(target * 0.5 / 2.5) * 2.5, reps: 10 },
        { pct: '65%', weight: Math.round(target * 0.65 / 2.5) * 2.5, reps: 6 },
        { pct: '80%', weight: Math.round(target * 0.8 / 2.5) * 2.5, reps: 3 },
        { pct: '90%', weight: Math.round(target * 0.9 / 2.5) * 2.5, reps: 1 },
      ]
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        className="bg-card w-full rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-amber-500" />
          <h3 className="text-xl font-bold text-foreground">Warmup Calculator</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{exercise.exerciseName}</p>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1 block">Working weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={targetWeight}
            onChange={e => setTargetWeight(e.target.value)}
            onFocus={e => e.target.select()}
            placeholder="e.g. 100"
            className="w-full bg-muted rounded-xl px-4 py-3 text-foreground text-lg font-bold focus:outline-none"
            autoFocus
          />
        </div>
        {warmups.length > 0 ? (
          <div className="space-y-2">
            {warmups.map((w, i) => (
              <div key={i} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-muted-foreground">{w.pct}</span>
                <span className="text-base font-black text-foreground">{w.weight} kg</span>
                <span className="text-sm text-muted-foreground">× {w.reps} reps</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">Enter a working weight above</p>
        )}
        <button onClick={onClose} className="w-full mt-4 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold tap-scale">Done</button>
      </motion.div>
    </div>
  );
}

// ── Exercise Card ──────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, exIdx, prHistory, onAddSet, onRemoveSet, onUpdateSet, onCompleteSet, onRemoveExercise, onShowWarmup }) {
  const [collapsed, setCollapsed] = useState(false);
  const pr = prHistory[exercise.exerciseId];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{exercise.exerciseName}</h3>
          <p className="text-xs text-muted-foreground">
            {exercise.muscleGroup}
            {pr && <span className="text-primary ml-2">PR: {pr.weight > 0 ? `${pr.weight}kg × ${pr.reps}` : `${pr.reps} reps`}</span>}
          </p>
        </div>
        <button onClick={onShowWarmup} className="p-1 tap-scale" title="Warmup Calculator">
          <Zap size={17} className="text-amber-500" />
        </button>
        <button onClick={() => setCollapsed(c => !c)} className="p-1 tap-scale">
          {collapsed ? <ChevronDown size={18} className="text-muted-foreground" /> : <ChevronUp size={18} className="text-muted-foreground" />}
        </button>
        <button onClick={onRemoveExercise} className="p-1 tap-scale">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground mb-2 px-1">
            <div className="col-span-1">Set</div>
            <div className="col-span-4">Previous</div>
            <div className="col-span-3 text-center">kg</div>
            <div className="col-span-2 text-center">Reps</div>
            <div className="col-span-2 text-center">Done</div>
          </div>

          {exercise.sets.map((set, setIdx) => {
            const est1RM = set.weight && set.reps ? calculate1RM(parseFloat(set.weight), parseInt(set.reps)) : null;
            return (
              <SetRow
                key={set.id}
                setNumber={setIdx + 1}
                set={set}
                pr={pr}
                est1RM={est1RM}
                onUpdate={(f, v) => onUpdateSet(setIdx, f, v)}
                onComplete={() => onCompleteSet(setIdx)}
                onRemove={() => onRemoveSet(setIdx)}
                canRemove={exercise.sets.length > 1}
              />
            );
          })}

          <button
            onClick={onAddSet}
            className="w-full flex items-center justify-center gap-1.5 py-3 text-primary text-sm font-semibold tap-scale mt-1"
          >
            <Plus size={16} /> Add Set
          </button>
        </div>
      )}
    </div>
  );
}

// ── Set Row ────────────────────────────────────────────────────────────────────
function SetRow({ setNumber, set, pr, est1RM, onUpdate, onComplete, onRemove, canRemove }) {
  const isPR = pr && est1RM && est1RM > pr.estimated1RM;

  return (
    <motion.div
      animate={{ backgroundColor: set.completed ? 'hsl(var(--primary)/0.05)' : 'transparent' }}
      className="grid grid-cols-12 gap-2 items-center py-2 rounded-lg mb-1"
    >
      <div className="col-span-1 text-sm font-bold text-muted-foreground text-center">{setNumber}</div>
      <div className="col-span-4 text-xs text-muted-foreground pl-1">
        {pr ? (pr.weight > 0 ? `${pr.weight}×${pr.reps}` : `${pr.reps}r`) : '–'}
        {isPR && <span className="text-xs text-amber-500 ml-1">↑PR</span>}
      </div>
      <div className="col-span-3">
        <input
          type="number"
          inputMode="decimal"
          value={set.weight}
          onChange={e => onUpdate('weight', e.target.value)}
          onFocus={e => e.target.select()}
          placeholder="0"
          disabled={set.completed}
          className="w-full bg-muted rounded-lg px-2 py-2 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          inputMode="numeric"
          value={set.reps}
          onChange={e => onUpdate('reps', e.target.value)}
          onFocus={e => e.target.select()}
          placeholder="0"
          disabled={set.completed}
          className="w-full bg-muted rounded-lg px-2 py-2 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60"
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <button
          onClick={set.completed ? undefined : onComplete}
          className={`w-8 h-8 rounded-lg flex items-center justify-center tap-scale transition-all ${set.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          <Check size={15} />
        </button>
      </div>
    </motion.div>
  );
}
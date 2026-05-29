import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, ChevronDown, ChevronUp, Timer, Dumbbell, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../lib/useAppStore';
import { getAllExercises, calculate1RM, MUSCLE_GROUPS } from '../../lib/exercises';
import PRCelebration from '../../components/workout/PRCelebration';
import RestTimer from '../../components/workout/RestTimer';

export default function ActiveWorkout() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { routines, customExercises, completeWorkout, prHistory, checkAndSavePR, settings } = useApp();
  const allExercises = getAllExercises(customExercises);

  const routine = routineId !== 'empty' ? routines.find(r => r.id === routineId) : null;

  const [workoutName, setWorkoutName] = useState(routine?.name || 'Quick Workout');
  const [exercises, setExercises] = useState(() => {
    if (routine?.exercises) {
      return routine.exercises.map(ex => ({
        ...ex,
        sets: [{ id: Date.now().toString() + Math.random(), weight: '', reps: '', completed: false, previous: null }],
      }));
    }
    return [];
  });
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showExPicker, setShowExPicker] = useState(false);
  const [exSearch, setExSearch] = useState('');
  const [exFilter, setExFilter] = useState('All');
  const [restTimer, setRestTimer] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [prAlert, setPrAlert] = useState(null);
  const [newPRs, setNewPRs] = useState([]);

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const addSet = (exIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets = [...ex.sets, {
        id: Date.now().toString() + Math.random(),
        weight: lastSet?.weight || '',
        reps: lastSet?.reps || '',
        completed: false,
        previous: null,
      }];
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
    const ex = exercises[exIdx];
    const set = ex.sets[setIdx];
    if (!set.weight || !set.reps) return;

    // Check PR
    const { isNew, est1RM } = checkAndSavePR(ex.exerciseId, ex.exerciseName, parseFloat(set.weight), parseInt(set.reps));
    if (isNew) {
      setPrAlert({ exerciseName: ex.exerciseName, weight: set.weight, reps: set.reps, est1RM });
      setNewPRs(prev => [...prev, { exerciseName: ex.exerciseName, weight: set.weight, reps: set.reps, est1RM }]);
    }

    updateSet(exIdx, setIdx, 'completed', true);

    // Haptic
    if (navigator.vibrate) navigator.vibrate([50]);

    // Start rest timer
    const defaultRest = settings?.restTimerDefault || 180;
    setRestTimer(defaultRest);
  };

  const addExercise = (ex) => {
    setExercises(prev => [...prev, {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: [{ id: Date.now().toString(), weight: '', reps: '', completed: false }],
    }]);
    setShowExPicker(false);
    setExSearch('');
  };

  const removeExercise = (exIdx) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const handleFinish = () => {
    const session = {
      name: workoutName,
      routineId: routine?.id || null,
      exercises,
      duration: Math.floor(elapsed / 60),
      totalVolume: exercises.reduce((total, ex) =>
        total + ex.sets.filter(s => s.completed && s.weight && s.reps)
          .reduce((sum, s) => sum + parseFloat(s.weight) * parseInt(s.reps), 0), 0),
    };
    const { newPRs: savedPRs } = completeWorkout(session);
    navigate('/workout', { replace: true });
  };

  const filteredEx = allExercises.filter(e => {
    const ms = e.name.toLowerCase().includes(exSearch.toLowerCase());
    const mf = exFilter === 'All' || e.muscleGroup === exFilter;
    return ms && mf;
  });

  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

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
      {restTimer !== null && (
        <RestTimer
          seconds={restTimer}
          defaultSeconds={settings?.restTimerDefault || 180}
          onDone={() => setRestTimer(null)}
          onSkip={() => setRestTimer(null)}
          onChange={(s) => setRestTimer(s)}
        />
      )}

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
            prHistory={prHistory}
            onAddSet={() => addSet(exIdx)}
            onRemoveSet={(setIdx) => removeSet(exIdx, setIdx)}
            onUpdateSet={(setIdx, field, value) => updateSet(exIdx, setIdx, field, value)}
            onCompleteSet={(setIdx) => completeSet(exIdx, setIdx)}
            onRemoveExercise={() => removeExercise(exIdx)}
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-background w-full h-[80dvh] rounded-t-3xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={exSearch}
                    onChange={e => setExSearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="bg-transparent text-foreground text-sm flex-1 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button onClick={() => { setShowExPicker(false); setExSearch(''); }} className="tap-scale">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex gap-2 px-5 py-2.5 overflow-x-auto flex-shrink-0">
                {['All', ...MUSCLE_GROUPS].map(m => (
                  <button
                    key={m}
                    onClick={() => setExFilter(m)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${exFilter === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto ios-scroll px-5 pb-5">
                {filteredEx.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full flex items-center gap-3 py-3.5 border-b border-border last:border-0 text-left tap-scale"
                  >
                    <div>
                      <p className="font-semibold text-foreground text-sm">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.muscleGroup} · {ex.type}</p>
                    </div>
                    <Plus size={18} className="text-muted-foreground ml-auto" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
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
              <p className="text-muted-foreground mb-6">Your progress will be lost if you don't finish.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowFinish(false)} className="flex-1 py-3.5 border border-border rounded-xl font-semibold tap-scale">Keep Going</button>
                <button onClick={() => navigate('/workout')} className="flex-1 py-3.5 bg-destructive text-white rounded-xl font-semibold tap-scale">Discard</button>
              </div>
              <button onClick={handleFinish} className="w-full mt-3 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold tap-scale">Save & Exit</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PR Celebration */}
      <AnimatePresence>
        {prAlert && (
          <PRCelebration pr={prAlert} onClose={() => setPrAlert(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ExerciseCard({ exercise, prHistory, onAddSet, onRemoveSet, onUpdateSet, onCompleteSet, onRemoveExercise }) {
  const [collapsed, setCollapsed] = useState(false);
  const pr = prHistory[exercise.exerciseId];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Exercise header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{exercise.exerciseName}</h3>
          <p className="text-xs text-muted-foreground">
            {exercise.muscleGroup}
            {pr && <span className="text-primary ml-2">PR: {pr.weight}kg × {pr.reps}</span>}
          </p>
        </div>
        <button onClick={() => setCollapsed(c => !c)} className="p-1 tap-scale">
          {collapsed ? <ChevronDown size={18} className="text-muted-foreground" /> : <ChevronUp size={18} className="text-muted-foreground" />}
        </button>
        <button onClick={onRemoveExercise} className="p-1 tap-scale">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          {/* Set headers */}
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

function SetRow({ setNumber, set, pr, est1RM, onUpdate, onComplete, onRemove, canRemove }) {
  const isPR = pr && est1RM && est1RM > pr.estimated1RM;

  return (
    <motion.div
      animate={{ backgroundColor: set.completed ? 'hsl(var(--primary)/0.05)' : 'transparent' }}
      className="grid grid-cols-12 gap-2 items-center py-2 rounded-lg mb-1"
    >
      <div className="col-span-1 text-sm font-bold text-muted-foreground text-center">{setNumber}</div>
      <div className="col-span-4 text-xs text-muted-foreground pl-1">
        {pr ? `${pr.weight}×${pr.reps}` : '–'}
        {isPR && <span className="text-xs text-amber-500 ml-1">↑PR</span>}
      </div>
      <div className="col-span-3">
        <input
          type="number"
          inputMode="decimal"
          value={set.weight}
          onChange={e => onUpdate('weight', e.target.value)}
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
          placeholder="0"
          disabled={set.completed}
          className="w-full bg-muted rounded-lg px-2 py-2 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60"
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <button
          onClick={set.completed ? undefined : onComplete}
          disabled={!set.weight || !set.reps}
          className={`w-8 h-8 rounded-lg flex items-center justify-center tap-scale transition-all ${set.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground disabled:opacity-30'}`}
        >
          <Check size={15} />
        </button>
      </div>
    </motion.div>
  );
}
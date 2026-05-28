import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, GripVertical, Search, X, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../lib/useAppStore';
import { getAllExercises, MUSCLE_GROUPS } from '../../lib/exercises';

export default function RoutineBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routines, createRoutine, editRoutine, customExercises } = useApp();

  const existing = id !== 'new' ? routines.find(r => r.id === id) : null;

  const [name, setName] = useState(existing?.name || '');
  const [exercises, setExercises] = useState(existing?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('All');

  const allExercises = getAllExercises(customExercises);
  const filtered = allExercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = filterMuscle === 'All' || e.muscleGroup === filterMuscle;
    return matchSearch && matchMuscle;
  });

  const addExercise = (ex) => {
    if (!exercises.find(e => e.exerciseId === ex.id)) {
      setExercises(prev => [...prev, {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: [{ id: Date.now().toString(), reps: '', weight: '' }],
      }]);
    }
    setShowPicker(false);
    setSearch('');
  };

  const removeExercise = (exerciseId) => {
    setExercises(prev => prev.filter(e => e.exerciseId !== exerciseId));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const routineData = { name, exercises };
    if (existing) {
      editRoutine(existing.id, routineData);
    } else {
      createRoutine(routineData);
    }
    navigate('/workout');
  };

  const PRESET_NAMES = ['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body', 'Full Body', 'Chest & Triceps', 'Back & Biceps'];

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-14 pb-2 flex items-center gap-3 sticky top-0 bg-background/90 backdrop-blur-sm z-10 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 tap-scale">
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="font-bold text-foreground text-xl flex-1">{existing ? 'Edit Routine' : 'New Routine'}</h1>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-40 tap-scale"
        >
          Save
        </button>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Routine Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Push Day"
            className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {/* Quick name suggestions */}
          {!existing && (
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESET_NAMES.map(n => (
                <button
                  key={n}
                  onClick={() => setName(n)}
                  className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground tap-scale"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exercise list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Exercises <span className="text-muted-foreground font-normal">({exercises.length})</span></h2>
          </div>

          <AnimatePresence>
            {exercises.map((ex, i) => (
              <motion.div
                key={ex.exerciseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5 mb-2.5"
              >
                <GripVertical size={18} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{ex.exerciseName}</p>
                  <p className="text-xs text-muted-foreground">{ex.muscleGroup}</p>
                </div>
                <button
                  onClick={() => removeExercise(ex.exerciseId)}
                  className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center tap-scale flex-shrink-0"
                >
                  <Trash2 size={14} className="text-destructive" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-xl text-primary font-semibold text-sm tap-scale"
          >
            <Plus size={18} /> Add Exercise
          </button>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-background w-full h-[85dvh] rounded-t-3xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
                  <Search size={16} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="bg-transparent text-foreground text-sm flex-1 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button onClick={() => { setShowPicker(false); setSearch(''); }} className="p-2 tap-scale">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Muscle filter */}
              <div className="flex gap-2 px-5 py-2.5 overflow-x-auto flex-shrink-0">
                {['All', ...MUSCLE_GROUPS].map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMuscle(m)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterMuscle === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Exercise list */}
              <div className="flex-1 overflow-y-auto ios-scroll px-5 pb-5">
                {filtered.map(ex => {
                  const added = exercises.find(e => e.exerciseId === ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => addExercise(ex)}
                      className="w-full flex items-center gap-3 py-3.5 border-b border-border last:border-0 text-left tap-scale"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">{ex.muscleGroup} · {ex.type}</p>
                      </div>
                      {added ? (
                        <Check size={18} className="text-primary flex-shrink-0" />
                      ) : (
                        <Plus size={18} className="text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-8">No exercises found</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
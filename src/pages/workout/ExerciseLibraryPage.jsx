import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Plus, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/useAppStore';
import { getAllExercises, MUSCLE_GROUPS, EXERCISE_TYPES } from '../../lib/exercises';

export default function ExerciseLibraryPage() {
  const navigate = useNavigate();
  const { customExercises, createCustomExercise, prHistory } = useApp();
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEx, setSelectedEx] = useState(null);
  const [newEx, setNewEx] = useState({ name: '', muscleGroup: 'Chest', type: 'Barbell', notes: '' });

  const allExercises = getAllExercises(customExercises);
  const filtered = allExercises.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    const mf = filterMuscle === 'All' || e.muscleGroup === filterMuscle;
    return ms && mf;
  });

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = [];
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {});

  const handleCreate = () => {
    if (!newEx.name.trim()) return;
    createCustomExercise(newEx);
    setShowCreateModal(false);
    setNewEx({ name: '', muscleGroup: 'Chest', type: 'Barbell', notes: '' });
  };

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-14 pb-3 sticky top-0 bg-background/90 backdrop-blur-sm z-10 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 tap-scale">
            <ChevronLeft size={24} className="text-primary" />
          </button>
          <h1 className="font-black text-foreground text-xl flex-1">Exercise Library</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold tap-scale"
          >
            <Plus size={16} /> Custom
          </button>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 mb-3">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="bg-transparent text-foreground text-sm flex-1 focus:outline-none"
          />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-muted-foreground" /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', ...MUSCLE_GROUPS].map(m => (
            <button
              key={m}
              onClick={() => setFilterMuscle(m)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterMuscle === m ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {filterMuscle === 'All' ? (
          Object.entries(grouped).map(([muscle, exercises]) => (
            <div key={muscle} className="mb-5">
              <h2 className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">{muscle}</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {exercises.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedEx(ex)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left tap-scale ${i !== exercises.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {ex.name}
                        {ex.custom && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-md font-medium">Custom</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{ex.type}</div>
                    </div>
                    {prHistory[ex.id] && (
                      <div className="text-right">
                        <div className="text-xs font-semibold text-primary">PR</div>
                        <div className="text-xs text-muted-foreground">{prHistory[ex.id].weight}kg</div>
                      </div>
                    )}
                    <Info size={16} className="text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {filtered.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => setSelectedEx(ex)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left tap-scale ${i !== filtered.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-foreground text-sm">{ex.name}</div>
                  <div className="text-xs text-muted-foreground">{ex.type}</div>
                </div>
                {prHistory[ex.id] && (
                  <div className="text-xs font-semibold text-primary">PR: {prHistory[ex.id].weight}kg</div>
                )}
                <Info size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No exercises found</p>
        )}
      </div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedEx && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedEx(null)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-card w-full rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">{selectedEx.name}</h2>
                  <p className="text-muted-foreground">{selectedEx.muscleGroup} · {selectedEx.type}</p>
                </div>
                <button onClick={() => setSelectedEx(null)} className="ml-auto p-2 tap-scale"><X size={20} className="text-muted-foreground" /></button>
              </div>
              {prHistory[selectedEx.id] && (
                <div className="bg-primary/10 rounded-xl p-3 mb-4">
                  <p className="text-primary font-semibold text-sm">🏆 Personal Record</p>
                  <p className="text-foreground font-bold">{prHistory[selectedEx.id].weight}kg × {prHistory[selectedEx.id].reps} reps</p>
                  <p className="text-muted-foreground text-xs">Est. 1RM: {prHistory[selectedEx.id].estimated1RM}kg</p>
                </div>
              )}
              {selectedEx.notes && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-sm font-medium text-foreground mb-1">Coaching Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedEx.notes}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Custom Exercise Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-background w-full rounded-t-3xl p-6 pb-10 max-h-[85dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-foreground flex-1">Create Exercise</h2>
                <button onClick={() => setShowCreateModal(false)} className="tap-scale"><X size={20} className="text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Exercise Name *</label>
                  <input
                    type="text"
                    value={newEx.name}
                    onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Bulgarian Split Squat"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Muscle Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MUSCLE_GROUPS.map(m => (
                      <button
                        key={m}
                        onClick={() => setNewEx(p => ({ ...p, muscleGroup: m }))}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${newEx.muscleGroup === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Exercise Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXERCISE_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => setNewEx(p => ({ ...p, type: t }))}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${newEx.type === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Notes (optional)</label>
                  <textarea
                    value={newEx.notes}
                    onChange={e => setNewEx(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Coaching cues, tips..."
                    rows={3}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!newEx.name.trim()}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base disabled:opacity-40 tap-scale"
                >
                  Create Exercise
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
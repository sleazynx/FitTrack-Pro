import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Search } from 'lucide-react';
import { MUSCLE_GROUPS, EXERCISE_TYPES } from '../../lib/exercises';
import { useApp } from '../../lib/useAppStore';

export default function ExercisePicker({ allExercises, onAdd, onClose }) {
  const { createCustomExercise } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customEx, setCustomEx] = useState({ name: '', muscleGroup: 'Chest', type: 'Barbell' });

  const filtered = allExercises.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || e.muscleGroup === filter;
    return ms && mf;
  });

  const handleAddCustom = () => {
    if (!customEx.name.trim()) return;
    const newEx = {
      id: 'custom_' + Date.now(),
      name: customEx.name.trim(),
      muscleGroup: customEx.muscleGroup,
      type: customEx.type,
      notes: '',
      isCustom: true,
    };
    createCustomExercise(newEx);
    onAdd(newEx);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-border bg-background">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xl font-black text-foreground flex-1">Add Exercise</h2>
          <button
            onClick={() => setShowCustomForm(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold tap-scale"
          >
            <Plus size={15} /> Custom
          </button>
          <button onClick={onClose} className="tap-scale p-1">
            <X size={22} className="text-muted-foreground" />
          </button>
        </div>

        {/* Custom exercise form */}
        {showCustomForm && (
          <div className="bg-muted rounded-2xl p-4 mb-3 space-y-3">
            <p className="text-sm font-bold text-foreground">New Custom Exercise</p>
            <input
              type="text"
              value={customEx.name}
              onChange={e => setCustomEx(p => ({ ...p, name: e.target.value }))}
              placeholder="Exercise name..."
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={customEx.muscleGroup}
                onChange={e => setCustomEx(p => ({ ...p, muscleGroup: e.target.value }))}
                className="bg-background border border-border rounded-xl px-3 py-2.5 text-foreground text-sm focus:outline-none"
              >
                {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={customEx.type}
                onChange={e => setCustomEx(p => ({ ...p, type: e.target.value }))}
                className="bg-background border border-border rounded-xl px-3 py-2.5 text-foreground text-sm focus:outline-none"
              >
                {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button
              onClick={handleAddCustom}
              disabled={!customEx.name.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-40 tap-scale"
            >
              Add & Start Tracking
            </button>
          </div>
        )}

        {/* Search — user must tap to focus */}
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="bg-transparent text-foreground text-sm flex-1 focus:outline-none"
          />
          {search.length > 0 && (
            <button onClick={() => setSearch('')} className="tap-scale">
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Muscle group filter */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5">
          {['All', ...MUSCLE_GROUPS].map(m => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list — scrollable, never pushes header up */}
      <div className="flex-1 overflow-y-auto ios-scroll px-5 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No exercises found</div>
        ) : (
          filtered.map(ex => (
            <button
              key={ex.id}
              onClick={() => onAdd(ex)}
              className="w-full flex items-center gap-3 py-3.5 border-b border-border last:border-0 text-left tap-scale"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{ex.name}</p>
                <p className="text-xs text-muted-foreground">{ex.muscleGroup} · {ex.type}{ex.isCustom ? ' · Custom' : ''}</p>
              </div>
              <Plus size={18} className="text-muted-foreground flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Dumbbell, Play, Trash2, ChevronRight, Clock, Flame, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/useAppStore';

export default function WorkoutHome() {
  const { routines, workoutHistory, removeRoutine } = useApp();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const handleDelete = () => {
    if (deletingId) {
      removeRoutine(deletingId);
      setDeletingId(null);
    }
  };

  const recentWorkouts = workoutHistory.slice(0, 5);

  return (
    <div className="min-h-full bg-background pb-4">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-3xl font-black text-foreground">Workout</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Build strength, track progress</p>
      </div>

      <div className="px-5 space-y-5 mt-4">
        {/* Quick Start */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/workout/active/empty')}
            className="bg-primary text-primary-foreground rounded-2xl p-4 text-left tap-scale shadow-lg"
            style={{ boxShadow: '0 8px 30px rgba(58,91,240,0.25)' }}
          >
            <Play size={24} className="mb-3" />
            <div className="font-bold text-base">Quick Start</div>
            <div className="text-primary-foreground/70 text-xs">Empty workout</div>
          </button>
          <Link
            to="/workout/library"
            className="bg-card border border-border rounded-2xl p-4 text-left tap-scale"
          >
            <Dumbbell size={24} className="mb-3 text-foreground" />
            <div className="font-bold text-base text-foreground">Exercise Library</div>
            <div className="text-muted-foreground text-xs">Browse exercises</div>
          </Link>
        </div>

        {/* My Routines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-lg">My Routines</h2>
            <Link to="/workout/routine/new" className="flex items-center gap-1 text-primary text-sm font-semibold tap-scale">
              <Plus size={16} /> Create
            </Link>
          </div>

          {routines.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center">
              <Dumbbell className="mx-auto mb-3 text-muted-foreground" size={32} />
              <p className="text-muted-foreground font-medium text-sm">No routines yet</p>
              <p className="text-muted-foreground text-xs mt-1 mb-4">Create a routine like Push Day, Pull Day, or Legs</p>
              <Link to="/workout/routine/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold tap-scale">
                <Plus size={16} /> Create Routine
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {routines.map((routine) => (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Dumbbell size={22} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{routine.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {routine.exercises?.length || 0} exercises
                          {routine.lastPerformed ? ` · Last: ${new Date(routine.lastPerformed).toLocaleDateString()}` : ' · Never performed'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/workout/routine/${routine.id}`}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center tap-scale"
                          onClick={e => e.stopPropagation()}
                        >
                          <Edit2 size={14} className="text-muted-foreground" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(routine.id)}
                          className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center tap-scale"
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                        <button
                          onClick={() => navigate(`/workout/active/${routine.id}`)}
                          className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center tap-scale"
                        >
                          <Play size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* History */}
        {recentWorkouts.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground text-lg mb-3">Recent Workouts</h2>
            <div className="space-y-2.5">
              {recentWorkouts.map(w => (
                <div key={w.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{w.name || 'Workout'}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Clock size={10} /> {w.duration || 0} min
                      <Flame size={10} /> {w.exercises?.length || 0} exercises
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(w.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setDeletingId(null)}>
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-card w-full rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Routine?</h3>
              <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-3.5 border border-border rounded-xl font-semibold text-foreground tap-scale">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3.5 bg-destructive text-white rounded-xl font-semibold tap-scale">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
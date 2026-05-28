import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Flame, Zap, Scale, Ruler, Trophy, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/useAppStore';
import ProgressRing from '../components/ui/ProgressRing';
import MacroBar from '../components/ui/MacroBar';

export default function Dashboard() {
  const {
    profile, calorieGoal, macroGoals,
    todayCalories, todayProtein, todayCarbs, todayFat,
    todayWater, waterGoal,
    todayLog, updateDailyLog,
    logWater,
    workoutHistory,
  } = useApp();

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [heightInput, setHeightInput] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Streak
  const today = new Date().toDateString();
  let streak = 0;
  const sortedWorkouts = [...workoutHistory].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const workoutDates = [...new Set(sortedWorkouts.map(w => new Date(w.completedAt).toDateString()))];
  const todayIdx = 0;
  for (let i = 0; i < workoutDates.length; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (workoutDates[i] === d.toDateString()) streak++;
    else break;
  }

  // This week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const thisWeekWorkouts = workoutHistory.filter(w => new Date(w.completedAt) >= weekStart).length;

  const caloriesPct = calorieGoal > 0 ? todayCalories / calorieGoal : 0;
  const waterPct = waterGoal > 0 ? todayWater / waterGoal : 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="min-h-full bg-background pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-muted-foreground text-sm font-medium">{greeting()},</p>
          <h1 className="text-3xl font-black text-foreground">{profile?.name || 'Athlete'} 👋</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </motion.div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="px-5 space-y-4 mt-4">
        {/* Calorie + Macro Card */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-foreground text-lg">Today's Calories</h2>
              <p className="text-muted-foreground text-sm">
                <span className="text-2xl font-black text-foreground">{todayCalories}</span> / {calorieGoal} kcal
              </p>
            </div>
            <ProgressRing
              value={todayCalories}
              max={calorieGoal}
              size={72}
              strokeWidth={7}
              color="hsl(231,87%,60%)"
              bg="hsl(231,87%,60%,0.1)"
            >
              <span className="text-xs font-bold text-primary">{Math.round(caloriesPct * 100)}%</span>
            </ProgressRing>
          </div>
          <div className="space-y-2.5">
            <MacroBar label="Protein" value={todayProtein} max={macroGoals.protein} color="#3A5BF0" />
            <MacroBar label="Carbs" value={todayCarbs} max={macroGoals.carbs} color="#F59E0B" />
            <MacroBar label="Fat" value={todayFat} max={macroGoals.fat} color="#EF4444" />
          </div>
          <Link to="/nutrition" className="flex items-center justify-center gap-2 mt-4 py-2.5 bg-primary/8 rounded-xl text-primary font-semibold text-sm tap-scale">
            <Plus size={16} /> Log Meal
          </Link>
        </motion.div>

        {/* Quick stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Water */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Droplets size={16} className="text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Water</span>
            </div>
            <div className="text-2xl font-black text-foreground">{(todayWater / 1000).toFixed(1)}<span className="text-sm font-normal text-muted-foreground">L</span></div>
            <div className="text-xs text-muted-foreground mb-2">Goal: {(waterGoal / 1000).toFixed(1)}L</div>
            <div className="h-1.5 bg-muted rounded-full">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, waterPct * 100)}%` }} />
            </div>
            <button onClick={() => logWater(250)} className="mt-3 w-full py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 text-xs font-semibold tap-scale">
              + 250ml
            </button>
          </div>

          {/* Streak */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame size={16} className="text-orange-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Streak</span>
            </div>
            <div className="text-2xl font-black text-foreground">{streak}<span className="text-sm font-normal text-muted-foreground"> days</span></div>
            <div className="text-xs text-muted-foreground">This week: {thisWeekWorkouts}/{profile?.workoutFrequency || 4}</div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const ds = d.toDateString();
                const done = workoutDates.includes(ds);
                return <div key={i} className={`flex-1 h-5 rounded-sm ${done ? 'bg-orange-500' : 'bg-muted'}`} />;
              })}
            </div>
          </div>
        </motion.div>

        {/* Energy + Sleep row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Energy Level */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Zap size={16} className="text-yellow-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Energy</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => updateDailyLog({ energy: n })}
                  className={`flex-1 h-8 rounded-lg text-sm font-bold transition-all tap-scale ${(todayLog?.energy || 0) >= n ? 'bg-yellow-400 text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Level {todayLog?.energy || 0}/5</p>
          </div>

          {/* Weight */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Scale size={16} className="text-purple-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Weight</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {todayLog?.weight || profile?.weightKg || '--'}
              <span className="text-sm font-normal text-muted-foreground"> kg</span>
            </div>
            <button
              onClick={() => setShowWeightModal(true)}
              className="mt-3 w-full py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 text-xs font-semibold tap-scale"
            >
              Log weight
            </button>
          </div>
        </motion.div>

        {/* Weight + Height track row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Weight history hint */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Scale size={16} className="text-purple-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Weight</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {todayLog?.weight || profile?.weightKg || '--'}
              <span className="text-sm font-normal text-muted-foreground"> kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Today's log</p>
            <button
              onClick={() => setShowWeightModal(true)}
              className="mt-2 w-full py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 text-xs font-semibold tap-scale"
            >
              Update
            </button>
          </div>

          {/* Height */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Ruler size={16} className="text-teal-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Height</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {todayLog?.height || profile?.heightCm || '--'}
              <span className="text-sm font-normal text-muted-foreground"> cm</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Today's log</p>
            <button
              onClick={() => setShowHeightModal(true)}
              className="mt-2 w-full py-2 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 dark:text-teal-400 text-xs font-semibold tap-scale"
            >
              Update
            </button>
          </div>
        </motion.div>

        {/* Recent workouts */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-foreground">Recent Workouts</h2>
            <Link to="/workout" className="text-primary text-sm font-semibold flex items-center gap-0.5">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          {workoutHistory.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Trophy className="mx-auto mb-3 text-muted-foreground" size={32} />
              <p className="text-muted-foreground text-sm">No workouts yet</p>
              <Link to="/workout" className="text-primary text-sm font-semibold">Start your first workout →</Link>
            </div>
          ) : (
            <div>
              {workoutHistory.slice(0, 3).map(w => (
                <div key={w.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 border-border">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{w.name || 'Workout'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(w.completedAt).toLocaleDateString()} · {w.duration ? `${w.duration}min` : ''} · {w.exercises?.length || 0} exercises</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3 border-t border-border">
            <Link to="/workout" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm tap-scale">
              <Plus size={16} /> Start Workout
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowWeightModal(false)}>
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            className="bg-card w-full rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Log Weight</h3>
            <input
              type="number"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              placeholder="e.g. 75.5"
              className="w-full bg-muted rounded-xl px-4 py-3.5 text-foreground text-lg focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                if (weightInput) {
                  updateDailyLog({ weight: parseFloat(weightInput) });
                  setShowWeightModal(false);
                  setWeightInput('');
                }
              }}
              className="w-full mt-4 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg tap-scale"
            >
              Save
            </button>
          </motion.div>
        </div>
      )}

      {/* Height Modal */}
      {showHeightModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowHeightModal(false)}>
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            className="bg-card w-full rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Log Height</h3>
            <input
              type="number"
              value={heightInput}
              onChange={e => setHeightInput(e.target.value)}
              placeholder="e.g. 175"
              className="w-full bg-muted rounded-xl px-4 py-3.5 text-foreground text-lg focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                if (heightInput) {
                  updateDailyLog({ height: parseFloat(heightInput) });
                  setShowHeightModal(false);
                  setHeightInput('');
                }
              }}
              className="w-full mt-4 py-4 bg-teal-500 text-white rounded-xl font-bold text-lg tap-scale"
            >
              Save
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
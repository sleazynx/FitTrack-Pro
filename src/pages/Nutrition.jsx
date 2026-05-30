import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Flame, ChevronRight } from 'lucide-react';
import { useApp } from '../lib/useAppStore';
import MacroBar from '../components/ui/MacroBar';
import ProgressRing from '../components/ui/ProgressRing';

const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const MEAL_EMOJIS = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snack: '🍎' };

const EMPTY_ENTRY = { name: '', calories: '', protein: '', carbs: '', fat: '', category: 'Breakfast' };

export default function Nutrition() {
  const { todayNutrition, addMeal, removeMeal, calorieGoal, macroGoals, todayCalories, todayProtein, todayCarbs, todayFat } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [entry, setEntry] = useState({ ...EMPTY_ENTRY });
  const [deletingId, setDeletingId] = useState(null);

  const update = (key, value) => setEntry(prev => ({ ...prev, [key]: value }));

  const handleAdd = () => {
    if (!entry.name.trim() || !entry.calories) return;
    addMeal({
      name: entry.name,
      calories: parseFloat(entry.calories) || 0,
      protein: parseFloat(entry.protein) || 0,
      carbs: parseFloat(entry.carbs) || 0,
      fat: parseFloat(entry.fat) || 0,
      category: entry.category,
    });
    setEntry({ ...EMPTY_ENTRY });
    setShowAdd(false);
  };

  const grouped = MEAL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = todayNutrition.filter(e => e.category === cat);
    return acc;
  }, {});

  const calRemaining = calorieGoal - todayCalories;

  return (
    <div className="min-h-full bg-background pb-4">
      <div className="px-5 pt-14 pb-3">
        <h1 className="text-3xl font-black text-foreground">Nutrition</h1>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="px-5 space-y-4">
        {/* Calorie Summary */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-5 mb-4">
            <ProgressRing
              value={todayCalories}
              max={calorieGoal}
              size={80}
              strokeWidth={8}
              color="hsl(231,87%,60%)"
              bg="hsl(240,6%,90%)"
            >
              <div className="text-center">
                <div className="text-xs font-black text-primary">{Math.round((todayCalories / calorieGoal) * 100)}%</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Eaten</span>
                <span className="font-bold text-foreground">{todayCalories} kcal</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-bold text-foreground">{calorieGoal} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-bold ${calRemaining < 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {calRemaining < 0 ? '-' : ''}{Math.abs(calRemaining)} kcal
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            <MacroBar label="Protein" value={todayProtein} max={macroGoals.protein} color="#3A5BF0" />
            <MacroBar label="Carbs" value={todayCarbs} max={macroGoals.carbs} color="#F59E0B" />
            <MacroBar label="Fat" value={todayFat} max={macroGoals.fat} color="#EF4444" />
          </div>
        </div>

        {/* Add meal button */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base tap-scale shadow-md"
          style={{ boxShadow: '0 8px 24px rgba(58,91,240,0.25)' }}
        >
          <Plus size={20} /> Log Meal
        </button>

        {/* Meals by category */}
        {MEAL_CATEGORIES.map(cat => (
          grouped[cat].length > 0 && (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">{MEAL_EMOJIS[cat]}</span>
                <h2 className="font-bold text-foreground">{cat}</h2>
                <span className="text-muted-foreground text-sm">
                  {grouped[cat].reduce((s, e) => s + e.calories, 0)} kcal
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {grouped[cat].map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i !== grouped[cat].length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{entry.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        P: {entry.protein}g · C: {entry.carbs}g · F: {entry.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground text-sm">{entry.calories}</span>
                      <button
                        onClick={() => setDeletingId(entry.id)}
                        className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center tap-scale"
                      >
                        <Trash2 size={13} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {todayNutrition.length === 0 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🥗</div>
            <p className="text-muted-foreground font-medium">No meals logged today</p>
            <p className="text-muted-foreground text-sm mt-1">Tap "Log Meal" to add your first entry</p>
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-background w-full rounded-t-3xl p-6 max-h-[80dvh] overflow-y-auto"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold text-foreground flex-1">Add Meal</h2>
                <button onClick={() => setShowAdd(false)} className="tap-scale"><X size={20} className="text-muted-foreground" /></button>
              </div>

              <div className="space-y-4">
                {/* Category */}
                <div className="flex gap-2">
                  {MEAL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => update('category', cat)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${entry.category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {MEAL_EMOJIS[cat]} {cat}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Food Name *</label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="e.g. Chicken breast"
                    enterKeyHint="next"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Calories *</label>
                  <input
                    type="number"
                    value={entry.calories}
                    onChange={e => update('calories', e.target.value)}
                    placeholder="0"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['protein', 'carbs', 'fat'].map(macro => (
                    <div key={macro}>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block capitalize">{macro} (g)</label>
                      <input
                        type="number"
                        value={entry[macro]}
                        onChange={e => update(macro, e.target.value)}
                        placeholder="0"
                        className="w-full bg-card border border-border rounded-xl px-3 py-3 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!entry.name.trim() || !entry.calories}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base disabled:opacity-40 tap-scale"
                >
                  Add Meal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setDeletingId(null)}>
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-card w-full rounded-t-3xl p-6"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Remove this entry?</h3>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-3.5 border border-border rounded-xl font-semibold tap-scale">Cancel</button>
                <button onClick={() => { removeMeal(deletingId); setDeletingId(null); }} className="flex-1 py-3.5 bg-destructive text-white rounded-xl font-semibold tap-scale">Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
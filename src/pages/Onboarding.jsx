import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Dumbbell } from 'lucide-react';
import { useApp } from '../lib/useAppStore';
import { calculateTDEE, calculateCalorieGoal, calculateMacros, calculateWaterIntake, calculateAge } from '../lib/calculations';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: '3-5 days/week' },
  { value: 'active', label: 'Very Active', desc: '6-7 days/week' },
  { value: 'very_active', label: 'Athlete', desc: '2x/day training' },
];

const GOALS = [
  { value: 'cut', label: 'Lose Weight', emoji: '🔥', desc: 'Reduce body fat' },
  { value: 'maintain', label: 'Maintain', emoji: '⚖️', desc: 'Stay at current weight' },
  { value: 'bulk', label: 'Build Muscle', emoji: '💪', desc: 'Gain size & strength' },
];

const AGGRESSION_LEVELS = [
  { value: 'very_mild', label: 'Very Mild', desc: '±100 kcal' },
  { value: 'mild', label: 'Mild', desc: '±200-250 kcal' },
  { value: 'moderate', label: 'Moderate', desc: '±350-500 kcal' },
  { value: 'aggressive', label: 'Aggressive', desc: '±500-750 kcal' },
  { value: 'extreme', label: 'Extreme', desc: '±750-1000 kcal' },
];

const STEPS = ['welcome', 'basics', 'body', 'activity', 'goal', 'summary'];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    birthdate: '',
    gender: 'male',
    heightCm: 175,
    weightKg: 75,
    activityLevel: 'moderate',
    goal: 'maintain',
    aggressionLevel: 'moderate',
    workoutFrequency: 4,
    units: 'metric',
  });

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const age = calculateAge(data.birthdate) || 25;
  const tdee = calculateTDEE(data.weightKg, data.heightCm, age, data.gender, data.activityLevel);
  const calorieGoal = calculateCalorieGoal(tdee, data.goal, data.aggressionLevel);
  const macros = calculateMacros(calorieGoal, data.weightKg, data.goal);
  const waterGoal = calculateWaterIntake(data.weightKg, data.activityLevel);

  const canNext = () => {
    if (step === 1) return data.name.trim().length > 0 && data.birthdate;
    if (step === 2) return data.heightCm > 0 && data.weightKg > 0;
    return true;
  };

  const handleFinish = () => {
    completeOnboarding({
      ...data,
      tdee,
      calorieGoal,
      macros,
      waterGoal,
    });
  };

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="p-2 -ml-2 tap-scale">
            <ChevronLeft className="text-primary" size={24} />
          </button>
        ) : <div />}
        <div className="flex gap-1.5">
          {STEPS.slice(1).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i < step ? 'w-6 bg-primary' : i === step - 1 ? 'w-6 bg-primary' : 'w-3 bg-muted'}`}
            />
          ))}
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full px-6 pt-4 pb-8"
          >
            {step === 0 && <WelcomeStep />}
            {step === 1 && <BasicsStep data={data} update={update} />}
            {step === 2 && <BodyStep data={data} update={update} />}
            {step === 3 && <ActivityStep data={data} update={update} />}
            {step === 4 && <GoalStep data={data} update={update} />}
            {step === 5 && <SummaryStep data={data} tdee={tdee} calorieGoal={calorieGoal} macros={macros} waterGoal={waterGoal} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 safe-bottom">
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 tap-scale disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {step === 0 ? 'Get Started' : 'Continue'}
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 tap-scale"
          >
            <Check size={20} />
            Start FitTrack Pro
          </button>
        )}
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-lg"
        style={{ boxShadow: '0 20px 60px rgba(58,91,240,0.3)' }}
      >
        <Dumbbell className="text-white" size={44} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-foreground mb-3 tracking-tight"
      >
        FitTrack Pro
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-lg leading-relaxed max-w-xs"
      >
        Your personal fitness companion. Everything stored privately on your device.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col gap-3 w-full max-w-xs"
      >
        {['🏋️ Track workouts & PRs', '🥗 Log meals & macros', '📊 Visualize progress', '🔒 100% offline & private'].map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border">
            <span className="text-lg">{f.split(' ')[0]}</span>
            <span className="text-sm font-medium text-foreground">{f.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function BasicsStep({ data, update }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">Who are you?</h2>
        <p className="text-muted-foreground">Let's personalize your experience</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Your Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Date of Birth</label>
          <input
            type="date"
            value={data.birthdate}
            onChange={e => update('birthdate', e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {['male', 'female'].map(g => (
              <button
                key={g}
                onClick={() => update('gender', g)}
                className={`py-3.5 rounded-xl font-semibold capitalize text-base border transition-all ${data.gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'}`}
              >
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BodyStep({ data, update }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">Your body</h2>
        <p className="text-muted-foreground">Used to calculate your calorie needs</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Height (cm)</label>
          <input
            type="number"
            value={data.heightCm}
            onChange={e => update('heightCm', parseFloat(e.target.value) || 0)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Weight (kg)</label>
          <input
            type="number"
            value={data.weightKg}
            onChange={e => update('weightKg', parseFloat(e.target.value) || 0)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Weekly Workout Target</label>
          <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3.5">
            <button onClick={() => update('workoutFrequency', Math.max(1, data.workoutFrequency - 1))} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl font-bold tap-scale">−</button>
            <span className="flex-1 text-center text-2xl font-bold text-foreground">{data.workoutFrequency}<span className="text-sm text-muted-foreground font-normal"> days/week</span></span>
            <button onClick={() => update('workoutFrequency', Math.min(7, data.workoutFrequency + 1))} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl font-bold tap-scale">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityStep({ data, update }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">Activity level</h2>
        <p className="text-muted-foreground">How active are you outside the gym?</p>
      </div>
      <div className="space-y-2.5">
        {ACTIVITY_LEVELS.map(a => (
          <button
            key={a.value}
            onClick={() => update('activityLevel', a.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${data.activityLevel === a.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${data.activityLevel === a.value ? 'border-primary' : 'border-muted-foreground'}`}>
              {data.activityLevel === a.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div>
              <div className={`font-semibold ${data.activityLevel === a.value ? 'text-primary' : 'text-foreground'}`}>{a.label}</div>
              <div className="text-sm text-muted-foreground">{a.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GoalStep({ data, update }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">Your goal</h2>
        <p className="text-muted-foreground">We'll calculate your targets automatically</p>
      </div>
      <div className="space-y-3">
        {GOALS.map(g => (
          <button
            key={g.value}
            onClick={() => update('goal', g.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${data.goal === g.value ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
          >
            <span className="text-3xl">{g.emoji}</span>
            <div>
              <div className={`font-bold text-lg ${data.goal === g.value ? 'text-primary' : 'text-foreground'}`}>{g.label}</div>
              <div className="text-sm text-muted-foreground">{g.desc}</div>
            </div>
          </button>
        ))}
      </div>
      {data.goal !== 'maintain' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Aggression level</label>
          <div className="grid grid-cols-5 gap-1.5">
            {AGGRESSION_LEVELS.map((a, i) => (
              <button
                key={a.value}
                onClick={() => update('aggressionLevel', a.value)}
                className={`py-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${data.aggressionLevel === a.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {AGGRESSION_LEVELS.find(a => a.value === data.aggressionLevel)?.label} — {AGGRESSION_LEVELS.find(a => a.value === data.aggressionLevel)?.desc}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SummaryStep({ data, tdee, calorieGoal, macros, waterGoal }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">You're all set, {data.name}! 🎉</h2>
        <p className="text-muted-foreground">Here are your personalized targets</p>
      </div>
      <div className="space-y-3">
        <SummaryCard emoji="🔥" label="Daily Calories" value={`${calorieGoal} kcal`} sub={`Maintenance: ${tdee} kcal`} />
        <SummaryCard emoji="🥩" label="Protein" value={`${macros.protein}g`} sub={`≈${Math.round(macros.protein * 4)} kcal`} />
        <SummaryCard emoji="🌾" label="Carbohydrates" value={`${macros.carbs}g`} sub={`≈${Math.round(macros.carbs * 4)} kcal`} />
        <SummaryCard emoji="🫒" label="Fats" value={`${macros.fat}g`} sub={`≈${Math.round(macros.fat * 9)} kcal`} />
        <SummaryCard emoji="💧" label="Water Intake" value={`${(waterGoal / 1000).toFixed(1)}L`} sub="Daily recommendation" />
      </div>
      <p className="text-xs text-muted-foreground text-center">These can be adjusted anytime in your Profile settings.</p>
    </div>
  );
}

function SummaryCard({ emoji, label, value, sub }) {
  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
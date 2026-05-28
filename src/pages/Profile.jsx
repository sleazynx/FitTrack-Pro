import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Moon, Sun, Scale, Ruler, Dumbbell, Target, ChevronRight, Download, Timer } from 'lucide-react';
import { useApp } from '../lib/useAppStore';
import { calculateAge, calculateTDEE, calculateCalorieGoal, calculateMacros, calculateWaterIntake } from '../lib/calculations';
import { exportAllData } from '../lib/storage';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Lightly Active' },
  { value: 'moderate', label: 'Moderately Active' },
  { value: 'active', label: 'Very Active' },
  { value: 'very_active', label: 'Athlete' },
];

const GOALS = [
  { value: 'cut', label: '🔥 Cut' },
  { value: 'maintain', label: '⚖️ Maintain' },
  { value: 'bulk', label: '💪 Bulk' },
];

const AGGRESSION_LEVELS = [
  { value: 'very_mild', label: 'Very Mild' },
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'extreme', label: 'Extreme' },
];

export default function Profile() {
  const { profile, updateProfile, settings, updateSettings, tdee, calorieGoal, macroGoals, waterGoal } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {});

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const age = calculateAge(form.birthdate) || 25;
    const newTdee = calculateTDEE(form.weightKg, form.heightCm, age, form.gender, form.activityLevel);
    const newCal = calculateCalorieGoal(newTdee, form.goal, form.aggressionLevel || 'moderate');
    const newMacros = calculateMacros(newCal, form.weightKg, form.goal);
    const newWater = calculateWaterIntake(form.weightKg, form.activityLevel);
    updateProfile({ ...form, tdee: newTdee, calorieGoal: newCal, macros: newMacros, waterGoal: newWater });
    setEditing(false);
  };

  const age = profile ? calculateAge(profile.birthdate) : '--';

  const restTimerOptions = [60, 90, 120, 180, 240, 300];

  return (
    <div className="min-h-full bg-background pb-4">
      <div className="px-5 pt-14 pb-3">
        <h1 className="text-3xl font-black text-foreground">Profile</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-foreground">{profile?.name || 'Set up profile'}</h2>
              <p className="text-muted-foreground text-sm">
                {age !== '--' ? `Age ${age}` : ''}{profile?.gender ? ` · ${profile.gender}` : ''}
              </p>
            </div>
            <button
              onClick={() => { setForm(profile || {}); setEditing(!editing); }}
              className="px-3 py-2 bg-muted rounded-xl text-sm font-semibold text-muted-foreground tap-scale"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <InputField label="Name" value={form.name || ''} onChange={v => update('name', v)} />
              <InputField label="Date of Birth" type="date" value={form.birthdate || ''} onChange={v => update('birthdate', v)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Height (cm)" type="number" value={form.heightCm || ''} onChange={v => update('heightCm', parseFloat(v))} />
                <InputField label="Weight (kg)" type="number" value={form.weightKg || ''} onChange={v => update('weightKg', parseFloat(v))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['male', 'female'].map(g => (
                    <button key={g} onClick={() => update('gender', g)} className={`py-2.5 rounded-xl capitalize text-sm font-semibold ${form.gender === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Activity Level</label>
                <select value={form.activityLevel || 'moderate'} onChange={e => update('activityLevel', e.target.value)} className="w-full bg-muted rounded-xl px-4 py-3 text-foreground focus:outline-none">
                  {ACTIVITY_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {GOALS.map(g => (
                    <button key={g.value} onClick={() => update('goal', g.value)} className={`py-2.5 rounded-xl text-sm font-semibold ${form.goal === g.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{g.label}</button>
                  ))}
                </div>
              </div>
              {form.goal !== 'maintain' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Aggression</label>
                  <select value={form.aggressionLevel || 'moderate'} onChange={e => update('aggressionLevel', e.target.value)} className="w-full bg-muted rounded-xl px-4 py-3 text-foreground focus:outline-none">
                    {AGGRESSION_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              )}
              <InputField label="Workout Target (days/week)" type="number" value={form.workoutFrequency || 4} onChange={v => update('workoutFrequency', parseInt(v))} />
              <button onClick={handleSave} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold tap-scale">Save Changes</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Height" value={profile?.heightCm ? `${profile.heightCm} cm` : '--'} />
              <Stat label="Weight" value={profile?.weightKg ? `${profile.weightKg} kg` : '--'} />
              <Stat label="Goal" value={profile?.goal || '--'} capitalize />
              <Stat label="Activity" value={ACTIVITY_LEVELS.find(a => a.value === profile?.activityLevel)?.label || '--'} />
            </div>
          )}
        </div>

        {/* Nutrition Targets */}
        {!editing && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-foreground mb-3">Nutrition Targets</h2>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Daily Calories" value={`${calorieGoal} kcal`} />
              <Stat label="Protein" value={`${macroGoals.protein}g`} />
              <Stat label="Carbs" value={`${macroGoals.carbs}g`} />
              <Stat label="Fat" value={`${macroGoals.fat}g`} />
              <Stat label="Water" value={`${(waterGoal / 1000).toFixed(1)}L`} />
              <Stat label="TDEE" value={`${tdee} kcal`} />
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <h2 className="font-bold text-foreground px-5 py-4 border-b border-border">Settings</h2>

          {/* Dark mode */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              {settings.darkMode ? <Moon size={18} className="text-foreground" /> : <Sun size={18} className="text-foreground" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Dark Mode</p>
            </div>
            <button
              onClick={() => updateSettings({ ...settings, darkMode: !settings.darkMode })}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${settings.darkMode ? 'bg-primary' : 'bg-muted'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Rest timer */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Timer size={18} className="text-foreground" />
              </div>
              <p className="font-semibold text-foreground text-sm flex-1">Default Rest Timer</p>
              <span className="text-primary font-bold text-sm">{Math.floor((settings.restTimerDefault || 180) / 60)}:{((settings.restTimerDefault || 180) % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex gap-2">
              {restTimerOptions.map(s => (
                <button
                  key={s}
                  onClick={() => updateSettings({ ...settings, restTimerDefault: s })}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${(settings.restTimerDefault || 180) === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {s < 60 ? `${s}s` : `${s / 60}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Export data */}
          <button
            onClick={exportAllData}
            className="flex items-center gap-4 px-5 py-4 w-full text-left tap-scale"
          >
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Download size={18} className="text-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground">Download all your data as JSON</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">FitTrack Pro · All data stored locally on your device 🔒</p>
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-muted rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function Stat({ label, value, capitalize }) {
  return (
    <div className="bg-muted/50 rounded-xl p-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={`font-bold text-foreground text-sm ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}
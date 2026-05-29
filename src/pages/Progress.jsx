import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Scale, Activity, ChevronLeft } from 'lucide-react';
import { useApp } from '../lib/useAppStore';
import { getAllExercises, calculate1RM } from '../lib/exercises';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const CHART_COLORS = { primary: '#3A5BF0', purple: '#8B5CF6', teal: '#14b8a6' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}{(p.name.includes('1RM') || p.name === 'weight') ? 'kg' : (p.name === 'height' ? 'cm' : '')}
        </p>
      ))}
    </div>
  );
};

export default function Progress() {
  const { workoutHistory, prHistory, measurements, addBodyMeasurement, customExercises } = useApp();
  const [activeTab, setActiveTab] = useState('strength');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [measure, setMeasure] = useState({ waist: '', chest: '', arms: '', legs: '', bodyFat: '' });

  const allExercises = getAllExercises(customExercises);
  const prExercises = Object.keys(prHistory);

  // Weight & height history from daily logs
  const dailyLogs = (() => {
    try {
      const raw = localStorage.getItem('fittrack_daily');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();
  const sortedLogs = [...dailyLogs].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);
  const weightData = sortedLogs.filter(l => l.weight).map(l => ({
    date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: l.weight,
  }));
  const heightData = sortedLogs.filter(l => l.height).map(l => ({
    date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    height: l.height,
  }));

  // Exercise strength data — build from ALL workout history for the selected exercise
  const exerciseData = selectedExercise
    ? workoutHistory
        .filter(w => w.exercises?.some(e => e.exerciseId === selectedExercise))
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
        .map(w => {
          const ex = w.exercises.find(e => e.exerciseId === selectedExercise);
          const bestSet = ex?.sets
            ?.filter(s => s.completed && s.reps)
            .reduce((best, s) => {
              const est = calculate1RM(parseFloat(s.weight || 0), parseInt(s.reps), ex.exerciseId);
              const bestEst = best ? calculate1RM(parseFloat(best.weight || 0), parseInt(best.reps), ex.exerciseId) : 0;
              return est > bestEst ? s : best;
            }, null);
          if (!bestSet) return null;
          const w_ = parseFloat(bestSet.weight || 0);
          const r = parseInt(bestSet.reps);
          return {
            date: new Date(w.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            '1RM': calculate1RM(w_, r, ex.exerciseId),
            weight: w_,
            reps: r,
          };
        })
        .filter(Boolean)
    : [];

  const tabList = [
    { id: 'strength', label: 'Strength', icon: Trophy },
    { id: 'body', label: 'Body', icon: Scale },
    { id: 'measurements', label: 'Measurements', icon: Activity },
  ];

  const prList = Object.entries(prHistory).map(([id, pr]) => ({ id, ...pr }));

  const totalVolume = workoutHistory.reduce((s, w) => s + (w.totalVolume || 0), 0);
  const totalVolumeT = (totalVolume / 1000).toFixed(2);

  return (
    <div className="min-h-full bg-background pb-4">
      <div className="px-5 pt-14 pb-3">
        <h1 className="text-3xl font-black text-foreground">Progress</h1>
        <p className="text-muted-foreground text-sm">Track your growth over time</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {tabList.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {activeTab === 'strength' && (
          <>
            {/* If an exercise is selected, show its detail view */}
            {selectedExercise ? (
              <div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="flex items-center gap-1.5 text-primary text-sm font-semibold mb-4 tap-scale"
                >
                  <ChevronLeft size={16} /> All Records
                </button>

                <div className="bg-card border border-border rounded-2xl p-4 mb-4">
                  <h3 className="font-bold text-foreground mb-0.5">
                    {prHistory[selectedExercise]?.exerciseName}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">Estimated 1RM progress over time</p>

                  {exerciseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={exerciseData}>
                        <defs>
                          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="1RM" stroke={CHART_COLORS.primary} fill="url(#colorPrimary)" strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.primary }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-6">No sets logged yet for this exercise.</p>
                  )}
                </div>

                {/* Session history for this exercise */}
                <h3 className="font-bold text-foreground mb-2">Session History</h3>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  {exerciseData.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-6">No data yet.</p>
                  ) : (
                    [...exerciseData].reverse().map((d, i) => (
                      <div key={i} className={`flex items-center justify-between px-4 py-3 ${i !== exerciseData.length - 1 ? 'border-b border-border' : ''}`}>
                        <p className="text-sm text-muted-foreground">{d.date}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {d.weight > 0 ? `${d.weight} kg × ${d.reps}` : `${d.reps} reps`}
                        </p>
                        <p className="text-xs text-primary font-bold">
                          {d.weight > 0 ? `1RM: ${d['1RM']}kg` : `Score: ${d['1RM']}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* PR list — tap to drill in */}
                <div>
                  <h2 className="font-bold text-foreground mb-1">Personal Records 🏆</h2>
                  <p className="text-xs text-muted-foreground mb-3">Tap a record to see progress chart</p>
                  {prList.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                      <Trophy className="mx-auto mb-2 text-muted-foreground" size={32} />
                      <p className="text-muted-foreground text-sm">No PRs yet — start logging workouts!</p>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      {prList.map((pr, i) => (
                        <button
                          key={pr.id}
                          onClick={() => setSelectedExercise(pr.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 tap-scale text-left ${i !== prList.length - 1 ? 'border-b border-border' : ''}`}
                        >
                          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Trophy size={16} className="text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{pr.exerciseName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(pr.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-foreground text-sm">
                              {pr.weight > 0 ? `${pr.weight}kg × ${pr.reps}` : `${pr.reps} reps`}
                            </p>
                            <p className="text-xs text-primary">
                              {pr.weight > 0 ? `1RM: ${pr.estimated1RM}kg` : 'Bodyweight'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'body' && (
          <>
            {weightData.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-bold text-foreground mb-1">Body Weight</h3>
                <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="weight" stroke={CHART_COLORS.purple} fill="url(#colorWeight)" strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.purple }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {heightData.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-bold text-foreground mb-1">Height</h3>
                <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={heightData}>
                    <defs>
                      <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="height" stroke={CHART_COLORS.teal} fill="url(#colorHeight)" strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.teal }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Workouts</p>
                <p className="text-3xl font-black text-foreground">{workoutHistory.length}</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                <p className="text-3xl font-black text-foreground">
                  {totalVolumeT}
                  <span className="text-lg font-normal text-muted-foreground"> t</span>
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'measurements' && (
          <>
            <button
              onClick={() => setShowMeasureForm(!showMeasureForm)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base tap-scale"
            >
              <Activity size={20} /> Log Measurements
            </button>

            {showMeasureForm && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Body Measurements (cm)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['waist', 'chest', 'arms', 'legs'].map(m => (
                    <div key={m}>
                      <label className="text-xs text-muted-foreground capitalize mb-1 block">{m}</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={measure[m]}
                        onChange={e => setMeasure(p => ({ ...p, [m]: e.target.value }))}
                        placeholder="cm"
                        className="w-full bg-muted rounded-xl px-3 py-2.5 text-foreground text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Body Fat % (optional)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={measure.bodyFat}
                    onChange={e => setMeasure(p => ({ ...p, bodyFat: e.target.value }))}
                    placeholder="%"
                    className="w-full bg-muted rounded-xl px-3 py-2.5 text-foreground text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    addBodyMeasurement(measure);
                    setMeasure({ waist: '', chest: '', arms: '', legs: '', bodyFat: '' });
                    setShowMeasureForm(false);
                  }}
                  className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold tap-scale"
                >
                  Save Measurements
                </button>
              </motion.div>
            )}

            {measurements.length > 0 && (
              <div>
                <h2 className="font-bold text-foreground mb-3">History</h2>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  {measurements.slice(0, 10).map((m, i) => (
                    <div key={m.id} className={`px-4 py-3.5 ${i !== Math.min(measurements.length, 10) - 1 ? 'border-b border-border' : ''}`}>
                      <p className="text-xs text-muted-foreground mb-1">{new Date(m.date).toLocaleDateString()}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {m.waist && <span className="text-foreground"><span className="text-muted-foreground">Waist </span>{m.waist}cm</span>}
                        {m.chest && <span className="text-foreground"><span className="text-muted-foreground">Chest </span>{m.chest}cm</span>}
                        {m.arms && <span className="text-foreground"><span className="text-muted-foreground">Arms </span>{m.arms}cm</span>}
                        {m.legs && <span className="text-foreground"><span className="text-muted-foreground">Legs </span>{m.legs}cm</span>}
                        {m.bodyFat && <span className="text-foreground"><span className="text-muted-foreground">BF </span>{m.bodyFat}%</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {measurements.length === 0 && !showMeasureForm && (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📏</div>
                <p className="text-muted-foreground font-medium">No measurements logged yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
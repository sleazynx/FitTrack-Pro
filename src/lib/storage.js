// Local storage utility for FitTrack Pro

const KEYS = {
  PROFILE: 'fittrack_profile',
  WORKOUTS: 'fittrack_workouts',
  ROUTINES: 'fittrack_routines',
  EXERCISES: 'fittrack_exercises',
  NUTRITION: 'fittrack_nutrition',
  WATER_LOG: 'fittrack_water',
  BODY_MEASUREMENTS: 'fittrack_measurements',
  CARDIO: 'fittrack_cardio',
  PR_HISTORY: 'fittrack_prs',
  DAILY_LOGS: 'fittrack_daily',
  SETTINGS: 'fittrack_settings',
  ONBOARDED: 'fittrack_onboarded',
  ACTIVE_WORKOUT: 'fittrack_active_workout',
};

function get(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Profile
export function getProfile() {
  return get(KEYS.PROFILE, null);
}
export function saveProfile(profile) {
  set(KEYS.PROFILE, { ...profile, updatedAt: new Date().toISOString() });
}
export function isOnboarded() {
  return !!get(KEYS.ONBOARDED, false);
}
export function setOnboarded() {
  set(KEYS.ONBOARDED, true);
}

// Settings
export function getSettings() {
  return get(KEYS.SETTINGS, {
    darkMode: false,
    units: 'metric',
    restTimerDefault: 180,
    notifications: true,
  });
}
export function saveSettings(settings) {
  set(KEYS.SETTINGS, settings);
}

// Routines
export function getRoutines() {
  return get(KEYS.ROUTINES, []);
}
export function saveRoutines(routines) {
  set(KEYS.ROUTINES, routines);
}
export function addRoutine(routine) {
  const routines = getRoutines();
  const newRoutine = { ...routine, id: Date.now().toString(), createdAt: new Date().toISOString() };
  routines.push(newRoutine);
  saveRoutines(routines);
  return newRoutine;
}
export function updateRoutine(id, updates) {
  const routines = getRoutines();
  const idx = routines.findIndex(r => r.id === id);
  if (idx !== -1) {
    routines[idx] = { ...routines[idx], ...updates, updatedAt: new Date().toISOString() };
    saveRoutines(routines);
  }
}
export function deleteRoutine(id) {
  saveRoutines(getRoutines().filter(r => r.id !== id));
}

// Custom exercises
export function getCustomExercises() {
  return get(KEYS.EXERCISES, []);
}
export function saveCustomExercise(exercise) {
  const exercises = getCustomExercises();
  const newEx = { ...exercise, id: `custom_${Date.now()}`, custom: true, createdAt: new Date().toISOString() };
  exercises.push(newEx);
  set(KEYS.EXERCISES, exercises);
  return newEx;
}

// Workout history
export function getWorkoutHistory() {
  return get(KEYS.WORKOUTS, []);
}
export function saveWorkoutSession(session) {
  const history = getWorkoutHistory();
  const newSession = { ...session, id: Date.now().toString(), completedAt: new Date().toISOString() };
  history.unshift(newSession);
  set(KEYS.WORKOUTS, history);
  return newSession;
}

// PR History
export function getPRHistory() {
  return get(KEYS.PR_HISTORY, {});
}
export function savePR(exerciseId, exerciseName, weight, reps, estimated1RM) {
  const prs = getPRHistory();
  const entry = {
    weight,
    reps,
    estimated1RM,
    date: new Date().toISOString(),
  };
  if (!prs[exerciseId] || estimated1RM > prs[exerciseId].estimated1RM) {
    prs[exerciseId] = { exerciseName, ...entry };
    set(KEYS.PR_HISTORY, prs);
    return true; // new PR
  }
  return false;
}

// Nutrition
export function getNutritionLog() {
  return get(KEYS.NUTRITION, []);
}
export function addNutritionEntry(entry) {
  const log = getNutritionLog();
  const newEntry = { ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() };
  log.unshift(newEntry);
  set(KEYS.NUTRITION, log);
  return newEntry;
}
export function deleteNutritionEntry(id) {
  set(KEYS.NUTRITION, getNutritionLog().filter(e => e.id !== id));
}

// Water
export function getWaterLog() {
  return get(KEYS.WATER_LOG, []);
}
export function addWater(ml) {
  const log = getWaterLog();
  log.unshift({ id: Date.now().toString(), ml, date: new Date().toISOString() });
  set(KEYS.WATER_LOG, log);
}
export function getTodayWater() {
  const today = new Date().toDateString();
  return getWaterLog()
    .filter(w => new Date(w.date).toDateString() === today)
    .reduce((sum, w) => sum + w.ml, 0);
}

// Daily Logs (steps, sleep, energy, weight)
export function getDailyLogs() {
  return get(KEYS.DAILY_LOGS, []);
}
export function getTodayLog() {
  const today = new Date().toDateString();
  const logs = getDailyLogs();
  return logs.find(l => new Date(l.date).toDateString() === today) || null;
}
export function upsertDailyLog(data) {
  const logs = getDailyLogs();
  const today = new Date().toDateString();
  const idx = logs.findIndex(l => new Date(l.date).toDateString() === today);
  if (idx !== -1) {
    logs[idx] = { ...logs[idx], ...data, date: new Date().toISOString() };
  } else {
    logs.unshift({ ...data, date: new Date().toISOString() });
  }
  set(KEYS.DAILY_LOGS, logs);
}

// Body Measurements
export function getMeasurements() {
  return get(KEYS.BODY_MEASUREMENTS, []);
}
export function addMeasurement(measurement) {
  const measurements = getMeasurements();
  const newM = { ...measurement, id: Date.now().toString(), date: new Date().toISOString() };
  measurements.unshift(newM);
  set(KEYS.BODY_MEASUREMENTS, measurements);
  return newM;
}

// Active workout session (crash recovery)
export function saveActiveWorkout(session) {
  set(KEYS.ACTIVE_WORKOUT, session);
}
export function getActiveWorkout() {
  return get(KEYS.ACTIVE_WORKOUT, null);
}
export function clearActiveWorkout() {
  localStorage.removeItem(KEYS.ACTIVE_WORKOUT);
}

// Export all data
export function exportAllData() {
  const data = {
    profile: getProfile(),
    routines: getRoutines(),
    workouts: getWorkoutHistory(),
    nutrition: getNutritionLog(),
    water: getWaterLog(),
    daily: getDailyLogs(),
    measurements: getMeasurements(),
    prs: getPRHistory(),
    settings: getSettings(),
    customExercises: getCustomExercises(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fittrack-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export { KEYS };
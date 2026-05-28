// Central app state using React context + localStorage
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getProfile, saveProfile, isOnboarded, setOnboarded,
  getSettings, saveSettings, getRoutines, addRoutine, updateRoutine, deleteRoutine,
  getCustomExercises, saveCustomExercise, getWorkoutHistory, saveWorkoutSession,
  getPRHistory, savePR, getNutritionLog, addNutritionEntry, deleteNutritionEntry,
  getTodayWater, addWater, getDailyLogs, getTodayLog, upsertDailyLog,
  getMeasurements, addMeasurement,
} from './storage';
import { calculateAge, calculateTDEE, calculateCalorieGoal, calculateMacros, calculateWaterIntake } from './calculations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState(getProfile);
  const [settings, setSettingsState] = useState(getSettings);
  const [routines, setRoutinesState] = useState(getRoutines);
  const [customExercises, setCustomExercises] = useState(getCustomExercises);
  const [workoutHistory, setWorkoutHistory] = useState(getWorkoutHistory);
  const [prHistory, setPrHistory] = useState(getPRHistory);
  const [nutritionLog, setNutritionLog] = useState(getNutritionLog);
  const [todayWater, setTodayWater] = useState(getTodayWater);
  const [todayLog, setTodayLog] = useState(getTodayLog);
  const [measurements, setMeasurements] = useState(getMeasurements);
  const [onboarded, setOnboardedState] = useState(isOnboarded);

  const updateProfile = useCallback((data) => {
    saveProfile(data);
    setProfileState(data);
  }, []);

  const updateSettings = useCallback((data) => {
    saveSettings(data);
    setSettingsState(data);
  }, []);

  const createRoutine = useCallback((routine) => {
    const newR = addRoutine(routine);
    setRoutinesState(getRoutines());
    return newR;
  }, []);

  const editRoutine = useCallback((id, updates) => {
    updateRoutine(id, updates);
    setRoutinesState(getRoutines());
  }, []);

  const removeRoutine = useCallback((id) => {
    deleteRoutine(id);
    setRoutinesState(getRoutines());
  }, []);

  const createCustomExercise = useCallback((exercise) => {
    const ex = saveCustomExercise(exercise);
    setCustomExercises(getCustomExercises());
    return ex;
  }, []);

  const completeWorkout = useCallback((session) => {
    const saved = saveWorkoutSession(session);
    setWorkoutHistory(getWorkoutHistory());
    setPrHistory(getPRHistory());
    return { saved, newPRs: [] };
  }, []);

  const checkAndSavePR = useCallback((exerciseId, exerciseName, weight, reps) => {
    const est1RM = Math.round(parseFloat(weight) * (1 + parseInt(reps) / 30));
    const isNew = savePR(exerciseId, exerciseName, parseFloat(weight), parseInt(reps), est1RM);
    setPrHistory(getPRHistory());
    return { isNew, est1RM };
  }, []);

  const addMeal = useCallback((entry) => {
    const saved = addNutritionEntry(entry);
    setNutritionLog(getNutritionLog());
    return saved;
  }, []);

  const removeMeal = useCallback((id) => {
    deleteNutritionEntry(id);
    setNutritionLog(getNutritionLog());
  }, []);

  const logWater = useCallback((ml) => {
    addWater(ml);
    setTodayWater(getTodayWater());
  }, []);

  const updateDailyLog = useCallback((data) => {
    upsertDailyLog(data);
    setTodayLog(getTodayLog());
  }, []);

  const addBodyMeasurement = useCallback((measurement) => {
    const saved = addMeasurement(measurement);
    setMeasurements(getMeasurements());
    return saved;
  }, []);

  const completeOnboarding = useCallback((profileData) => {
    saveProfile(profileData);
    setProfileState(profileData);
    setOnboarded();
    setOnboardedState(true);
  }, []);

  // Computed values
  const age = profile ? calculateAge(profile.birthdate) : 0;
  const tdee = profile ? calculateTDEE(
    profile.weightKg || 70,
    profile.heightCm || 170,
    age || 25,
    profile.gender || 'male',
    profile.activityLevel || 'moderate'
  ) : 2000;
  const calorieGoal = profile ? calculateCalorieGoal(tdee, profile.goal || 'maintain', profile.aggressionLevel || 'moderate') : 2000;
  const macroGoals = profile ? calculateMacros(calorieGoal, profile.weightKg || 70, profile.goal || 'maintain') : { protein: 150, fat: 67, carbs: 200 };
  const waterGoal = profile ? calculateWaterIntake(profile.weightKg || 70, profile.activityLevel || 'moderate') : 2500;

  const today = new Date().toDateString();
  const todayNutrition = nutritionLog.filter(e => new Date(e.createdAt).toDateString() === today);
  const todayCalories = todayNutrition.reduce((sum, e) => sum + (e.calories || 0), 0);
  const todayProtein = todayNutrition.reduce((sum, e) => sum + (e.protein || 0), 0);
  const todayCarbs = todayNutrition.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const todayFat = todayNutrition.reduce((sum, e) => sum + (e.fat || 0), 0);

  const todayWorkouts = workoutHistory.filter(w => new Date(w.completedAt).toDateString() === today);

  const isDark = settings.darkMode;

  // Apply dark mode to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <AppContext.Provider value={{
      profile, updateProfile,
      settings, updateSettings,
      routines, createRoutine, editRoutine, removeRoutine,
      customExercises, createCustomExercise,
      workoutHistory, completeWorkout,
      prHistory, checkAndSavePR,
      nutritionLog, todayNutrition, addMeal, removeMeal,
      todayWater, waterGoal, logWater,
      todayLog, updateDailyLog,
      measurements, addBodyMeasurement,
      onboarded, completeOnboarding,
      // Computed
      age, tdee, calorieGoal, macroGoals, waterGoal,
      todayCalories, todayProtein, todayCarbs, todayFat,
      todayWorkouts,
      isDark,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
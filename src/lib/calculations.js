// Fitness calculations utilities

// Mifflin-St Jeor BMR
export function calculateBMR(weight, height, age, gender) {
  // weight in kg, height in cm, age in years
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE(weight, height, age, gender, activityLevel) {
  const bmr = calculateBMR(weight, height, age, gender);
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));
}

// Goal calorie adjustments
const GOAL_ADJUSTMENTS = {
  maintain: { very_mild: 0, mild: 0, moderate: 0, aggressive: 0, extreme: 0 },
  bulk: {
    very_mild: 100,
    mild: 200,
    moderate: 350,
    aggressive: 500,
    extreme: 750,
  },
  cut: {
    very_mild: -100,
    mild: -250,
    moderate: -500,
    aggressive: -750,
    extreme: -1000,
  },
};

export function calculateCalorieGoal(tdee, goal, aggressionLevel = 'moderate') {
  const adj = GOAL_ADJUSTMENTS[goal]?.[aggressionLevel] || 0;
  return Math.max(1200, tdee + adj);
}

// Macro recommendations (grams)
export function calculateMacros(calorieGoal, weight, goal) {
  // Protein: 1.8-2.2g/kg
  const proteinMultiplier = goal === 'bulk' ? 2.0 : goal === 'cut' ? 2.2 : 1.8;
  const protein = Math.round(weight * proteinMultiplier);
  const proteinCals = protein * 4;

  // Fat: ~25% of calories
  const fatCals = Math.round(calorieGoal * 0.25);
  const fat = Math.round(fatCals / 9);

  // Carbs: remaining
  const carbCals = calorieGoal - proteinCals - fatCals;
  const carbs = Math.round(Math.max(0, carbCals) / 4);

  return { protein, fat, carbs };
}

// Water intake recommendation (ml)
export function calculateWaterIntake(weight, activityLevel) {
  const base = weight * 35; // 35ml/kg
  const activityBonus = {
    sedentary: 0,
    light: 300,
    moderate: 500,
    active: 700,
    very_active: 1000,
  };
  return Math.round(base + (activityBonus[activityLevel] || 0));
}

// Calculate age from birthdate
export function calculateAge(birthdate) {
  if (!birthdate) return 0;
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Convert units
export function kgToLbs(kg) { return Math.round(kg * 2.20462 * 10) / 10; }
export function lbsToKg(lbs) { return Math.round(lbs / 2.20462 * 10) / 10; }
export function cmToFtIn(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}
export function ftInToCm(feet, inches) {
  return Math.round((feet * 12 + inches) * 2.54);
}

// Weekly streak calculation
export function calculateStreak(workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) return { current: 0, longest: 0 };
  
  const dates = workoutHistory.map(w => {
    const d = new Date(w.completedAt || w.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  });
  
  const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
  
  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const date = new Date(uniqueDates[i]);
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    expected.setHours(0, 0, 0, 0);
    
    if (date.getTime() === expected.getTime()) {
      streak++;
      if (i === 0 || i === 1) current = streak;
    } else {
      break;
    }
  }
  
  longest = Math.max(streak, longest);
  return { current, longest };
}
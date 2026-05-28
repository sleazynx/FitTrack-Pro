// Preloaded exercise library

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'
];

export const EXERCISE_TYPES = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Cardio'];

export const PRELOADED_EXERCISES = [

  // =========================
  // CHEST (FULL EXPANSION)
  // =========================
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Standard compound press' },
  { id: 'pause_bench', name: 'Paused Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Pause on chest for strength' },
  { id: 'spoto_press', name: 'Spoto Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Stop just above chest' },
  { id: 'close_grip_bench_chest', name: 'Close Grip Bench (Chest Focus)', muscleGroup: 'Chest', type: 'Barbell', notes: 'Triceps + chest' },

  { id: 'incline_bench', name: 'Incline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Upper chest focus' },
  { id: 'low_incline_db', name: 'Low Incline Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Slight incline angle' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Lower chest emphasis' },

  { id: 'db_press', name: 'Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Full ROM' },
  { id: 'neutral_grip_db_press', name: 'Neutral Grip Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Shoulder friendly' },

  { id: 'cable_fly_low_to_high', name: 'Cable Fly (Low to High)', muscleGroup: 'Chest', type: 'Cable', notes: 'Upper chest emphasis' },
  { id: 'cable_fly_high_to_low', name: 'Cable Fly (High to Low)', muscleGroup: 'Chest', type: 'Cable', notes: 'Lower chest emphasis' },
  { id: 'pec_dec', name: 'Pec Deck Fly', muscleGroup: 'Chest', type: 'Machine', notes: 'Isolation squeeze' },

  { id: 'pushup', name: 'Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Basic calisthenics' },
  { id: 'weighted_pushup', name: 'Weighted Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Add load' },
  { id: 'deficit_pushup', name: 'Deficit Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Deeper stretch' },

  { id: 'chest_dips', name: 'Chest Dips', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Lean forward' },

  // =========================
  // BACK (FULL EXPANSION)
  // =========================
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Full posterior chain' },
  { id: 'conventional_deadlift', name: 'Conventional Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Standard form' },
  { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Wide stance' },
  { id: 'deficit_deadlift', name: 'Deficit Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Increased range' },

  { id: 'barbell_row', name: 'Barbell Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Mid-back thickness' },
  { id: 'pendlay_row', name: 'Pendlay Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Explosive from floor' },
  { id: 't_bar_row', name: 'T-Bar Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Heavy rowing' },

  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Vertical pull' },
  { id: 'wide_grip_pulldown', name: 'Wide Grip Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Lat width' },

  { id: 'pullup', name: 'Pull-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Bodyweight vertical pull' },
  { id: 'weighted_pullup', name: 'Weighted Pull-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Advanced strength' },

  { id: 'seated_cable_row', name: 'Seated Cable Row', muscleGroup: 'Back', type: 'Cable', notes: 'Controlled pull' },
  { id: 'wide_cable_row', name: 'Wide Cable Row', muscleGroup: 'Back', type: 'Cable', notes: 'Upper back focus' },

  { id: 'straight_arm_pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'Back', type: 'Cable', notes: 'Lat isolation' },

  { id: 'reverse_fly', name: 'Reverse Fly', muscleGroup: 'Back', type: 'Dumbbell', notes: 'Rear delts + upper back' },

  // =========================
  // SHOULDERS (FULL EXPANSION)
  // =========================
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Main shoulder strength lift' },
  { id: 'push_press', name: 'Push Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Leg drive assisted press' },
  { id: 'arnold_press', name: 'Arnold Press', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Rotation press' },

  { id: 'lateral_raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Side delts' },
  { id: 'cable_lateral_raise', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', type: 'Cable', notes: 'Constant tension' },

  { id: 'front_raise', name: 'Front Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Front delts' },
  { id: 'rear_delt_fly', name: 'Rear Delt Fly', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Posterior delts' },
  { id: 'rear_delt_machine', name: 'Rear Delt Machine', muscleGroup: 'Shoulders', type: 'Machine', notes: 'Isolation machine' },

  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'Shoulders', type: 'Cable', notes: 'Shoulder health' },

  // =========================
  // BICEPS (FULL EXPANSION)
  // =========================
  { id: 'barbell_curl', name: 'Barbell Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Heavy curl' },
  { id: 'ez_bar_curl', name: 'EZ Bar Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Wrist friendly' },

  { id: 'db_curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Standard curl' },
  { id: 'alternating_curl', name: 'Alternating Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'One arm at a time' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Brachialis focus' },
  { id: 'cross_body_hammer', name: 'Cross Body Hammer Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Diagonal path' },

  { id: 'cable_curl', name: 'Cable Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Constant tension' },
  { id: 'rope_cable_curl', name: 'Rope Cable Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Peak contraction' },

  { id: 'preacher_curl', name: 'Preacher Curl', muscleGroup: 'Biceps', type: 'Machine', notes: 'Strict isolation' },
  { id: 'incline_curl', name: 'Incline Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Long head stretch' },

  // =========================
  // TRICEPS (FULL EXPANSION)
  // =========================
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', type: 'Cable', notes: 'Basic pushdown' },
  { id: 'rope_pushdown', name: 'Rope Pushdown', muscleGroup: 'Triceps', type: 'Cable', notes: 'Spread at bottom' },

  { id: 'skull_crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Elbow extension' },
  { id: 'ez_skull_crusher', name: 'EZ Bar Skull Crusher', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Wrist friendly' },

  { id: 'overhead_tricep_ext', name: 'Overhead Extension', muscleGroup: 'Triceps', type: 'Dumbbell', notes: 'Long head focus' },

  { id: 'tricep_dips', name: 'Tricep Dips', muscleGroup: 'Triceps', type: 'Bodyweight', notes: 'Upright position' },
  { id: 'assisted_dips', name: 'Assisted Dips', muscleGroup: 'Triceps', type: 'Machine', notes: 'Beginner version' },

  // =========================
  // LEGS (FULL EXPANSION)
  // =========================
  { id: 'squat', name: 'Back Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Main lower body lift' },
  { id: 'front_squat', name: 'Front Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Quad dominant' },

  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'Legs', type: 'Machine', notes: 'Machine strength' },
  { id: 'hack_squat', name: 'Hack Squat', muscleGroup: 'Legs', type: 'Machine', notes: 'Quad focus' },

  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'Legs', type: 'Machine', notes: 'Quad isolation' },
  { id: 'leg_curl', name: 'Lying Leg Curl', muscleGroup: 'Legs', type: 'Machine', notes: 'Hamstrings' },
  { id: 'seated_leg_curl', name: 'Seated Leg Curl', muscleGroup: 'Legs', type: 'Machine', notes: 'Different hamstring angle' },

  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'Legs', type: 'Barbell', notes: 'Hip hinge' },
  { id: 'good_morning', name: 'Good Morning', muscleGroup: 'Legs', type: 'Barbell', notes: 'Posterior chain' },

  { id: 'lunge', name: 'Lunge', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Unilateral' },
  { id: 'walking_lunge', name: 'Walking Lunge', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Dynamic' },

  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Hard unilateral' },

  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Legs', type: 'Machine', notes: 'Gastrocnemius' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscleGroup: 'Legs', type: 'Machine', notes: 'Soleus' },

  // =========================
  // GLUTES
  // =========================
  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'Glutes', type: 'Barbell', notes: 'Glute strength king' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Basic activation' },
  { id: 'cable_kickback', name: 'Cable Kickback', muscleGroup: 'Glutes', type: 'Cable', notes: 'Isolation' },
  { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscleGroup: 'Glutes', type: 'Barbell', notes: 'Wide stance' },

  // =========================
  // CORE
  // =========================
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Anti-extension' },
  { id: 'side_plank', name: 'Side Plank', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Obliques' },

  { id: 'crunch', name: 'Crunch', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Basic flexion' },
  { id: 'weighted_crunch', name: 'Weighted Crunch', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Progression' },

  { id: 'leg_raise', name: 'Hanging Leg Raise', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Lower abs' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Hard core movement' },

  { id: 'russian_twist', name: 'Russian Twist', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Rotation' },

  // =========================
  // CARDIO (EXPANDED)
  // =========================
  { id: 'running', name: 'Running', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Endurance' },
  { id: 'sprinting', name: 'Sprinting', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Explosive cardio' },

  { id: 'cycling', name: 'Cycling', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Low impact' },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Full body cardio' },

  { id: 'jump_rope', name: 'Jump Rope', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Coordination' },
  { id: 'stair_climber', name: 'Stair Climber', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Leg endurance' },

  { id: 'hiit', name: 'HIIT', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Intervals' },
];

export function getAllExercises(customExercises = []) {
  return [...PRELOADED_EXERCISES, ...customExercises];
}

export function getExerciseById(id, customExercises = []) {
  return getAllExercises(customExercises).find(e => e.id === id);
}

// Epley formula: 1RM = weight * (1 + reps/30)
export function calculate1RM(weight, reps) {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}
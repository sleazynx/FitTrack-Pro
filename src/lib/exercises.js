// Preloaded exercise library

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'
];

export const EXERCISE_TYPES = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Cardio'];

export const PRELOADED_EXERCISES = [
  // Chest
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Keep shoulder blades retracted' },
  { id: 'incline_bench', name: 'Incline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: '30-45 degree incline' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Targets lower chest' },
  { id: 'db_press', name: 'Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Full range of motion' },
  { id: 'incline_db', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: '30-45 degree incline' },
  { id: 'db_fly', name: 'Dumbbell Fly', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Slight bend in elbows' },
  { id: 'cable_fly', name: 'Cable Fly', muscleGroup: 'Chest', type: 'Cable', notes: 'Keep chest tall' },
  { id: 'pushup', name: 'Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Full depth' },
  { id: 'dips_chest', name: 'Chest Dips', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Lean forward for chest emphasis' },
  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Neutral spine, drive through heels' },
  { id: 'barbell_row', name: 'Barbell Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Pull to lower chest/upper abdomen' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Pull to upper chest' },
  { id: 'seated_row', name: 'Seated Cable Row', muscleGroup: 'Back', type: 'Cable', notes: 'Keep torso upright' },
  { id: 'pullup', name: 'Pull-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Full extension at bottom' },
  { id: 'chinup', name: 'Chin-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Supinated grip, biceps emphasis' },
  { id: 'db_row', name: 'Dumbbell Row', muscleGroup: 'Back', type: 'Dumbbell', notes: 'Brace core, row to hip' },
  { id: 'rack_pull', name: 'Rack Pull', muscleGroup: 'Back', type: 'Barbell', notes: 'Partial deadlift from knee height' },
  // Shoulders
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Press from chin level' },
  { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Seated or standing' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Lead with elbow, slight forward lean' },
  { id: 'front_raise', name: 'Front Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Arms to shoulder height' },
  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'Shoulders', type: 'Cable', notes: 'External rotation at end range' },
  { id: 'arnold_press', name: 'Arnold Press', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Rotate palms as you press' },
  // Biceps
  { id: 'bicep_curl', name: 'Bicep Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Full supination at top' },
  { id: 'db_curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Alternate or simultaneous' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Neutral grip, targets brachialis' },
  { id: 'cable_curl', name: 'Cable Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Constant tension' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscleGroup: 'Biceps', type: 'Machine', notes: 'Full stretch at bottom' },
  { id: 'incline_curl', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Great stretch position' },
  // Triceps
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', type: 'Cable', notes: 'Elbows tucked, full extension' },
  { id: 'skull_crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Lower to forehead' },
  { id: 'overhead_tricep', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', type: 'Dumbbell', notes: 'Full stretch overhead' },
  { id: 'dips_tri', name: 'Tricep Dips', muscleGroup: 'Triceps', type: 'Bodyweight', notes: 'Upright torso' },
  { id: 'close_grip_bench', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Shoulder-width grip' },
  // Legs
  { id: 'squat', name: 'Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Hip crease below parallel' },
  { id: 'front_squat', name: 'Front Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'More quad emphasis' },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'Legs', type: 'Machine', notes: 'Full range, do not lock knees' },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'Legs', type: 'Machine', notes: 'Squeeze at top' },
  { id: 'leg_curl', name: 'Leg Curl', muscleGroup: 'Legs', type: 'Machine', notes: 'Full contraction' },
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'Legs', type: 'Barbell', notes: 'Hamstring stretch, slight knee bend' },
  { id: 'lunge', name: 'Lunge', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Step forward, knee over toe' },
  { id: 'hack_squat', name: 'Hack Squat', muscleGroup: 'Legs', type: 'Machine', notes: 'Feet shoulder width on platform' },
  { id: 'calf_raise', name: 'Calf Raise', muscleGroup: 'Legs', type: 'Machine', notes: 'Full range, pause at top' },
  // Glutes
  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'Glutes', type: 'Barbell', notes: 'Squeeze at top, chin to chest' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Drive hips to ceiling' },
  { id: 'cable_kickback', name: 'Cable Kickback', muscleGroup: 'Glutes', type: 'Cable', notes: 'Squeeze glute at top' },
  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Neutral spine, brace core' },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Full contraction at top' },
  { id: 'leg_raise', name: 'Hanging Leg Raise', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Posterior pelvic tilt at top' },
  { id: 'cable_crunch', name: 'Cable Crunch', muscleGroup: 'Core', type: 'Cable', notes: 'Round spine, crunch hips to chest' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Maintain hollow body' },
  // Cardio
  { id: 'running', name: 'Running', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Drive with legs, pull to chest' },
  { id: 'jump_rope', name: 'Jump Rope', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'hiit', name: 'HIIT', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
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
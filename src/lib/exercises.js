// Preloaded exercise library

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'
];

export const EXERCISE_TYPES = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Cardio'];

// Bodyweight exercises – PR uses reps only (no weight multiplier)
export const BODYWEIGHT_EXERCISE_IDS = new Set([
  'pushup', 'dips_chest', 'pullup', 'chinup', 'dips_tri',
  'lunge', 'glute_bridge', 'plank', 'crunch', 'leg_raise',
  'ab_wheel', 'jump_rope', 'bodyweight_squat', 'box_jump', 'burpee',
  'mountain_climber', 'sit_up', 'russian_twist', 'side_plank',
  'superman', 'hip_raise', 'nordic_curl', 'inverted_row',
  'pike_pushup', 'diamond_pushup', 'wide_pushup', 'decline_pushup',
  'archer_pushup', 'handstand_pushup', 'muscle_up', 'australian_pullup',
  'pistol_squat', 'jump_squat', 'split_squat_bw', 'reverse_lunge_bw',
  'step_up_bw', 'calf_raise_bw', 'good_morning_bw', 'glute_kickback_bw',
  'fire_hydrant', 'donkey_kick', 'lying_hip_abduction',
  'hollow_body_hold', 'l_sit', 'tuck_planche', 'dragon_flag',
  'hanging_knee_raise', 'toes_to_bar',
]);

export const PRELOADED_EXERCISES = [
  // ── CHEST ──────────────────────────────────────────────────────────────
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Keep shoulder blades retracted' },
  { id: 'incline_bench', name: 'Incline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: '30-45 degree incline' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: 'Targets lower chest' },
  { id: 'paused_bench', name: 'Paused Bench Press', muscleGroup: 'Chest', type: 'Barbell', notes: '2-second pause on chest' },
  { id: 'spoto_press', name: 'Spoto Press', muscleGroup: 'Chest', type: 'Barbell', notes: '1-2 inch above chest pause' },
  { id: 'close_grip_bench_chest', name: 'Close Grip Bench (Chest Focus)', muscleGroup: 'Chest', type: 'Barbell', notes: 'Narrow grip, elbows flared' },
  { id: 'low_incline_db', name: 'Low Incline Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: '15-20 degree incline' },
  { id: 'db_press', name: 'Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Full range of motion' },
  { id: 'incline_db', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: '30-45 degree incline' },
  { id: 'decline_db_press', name: 'Decline Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Targets lower chest' },
  { id: 'neutral_db_press', name: 'Neutral Grip Dumbbell Press', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Palms facing each other' },
  { id: 'db_fly', name: 'Dumbbell Fly', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Slight bend in elbows' },
  { id: 'incline_db_fly', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest', type: 'Dumbbell', notes: 'Upper chest emphasis' },
  { id: 'cable_fly', name: 'Cable Fly', muscleGroup: 'Chest', type: 'Cable', notes: 'Keep chest tall' },
  { id: 'high_cable_fly', name: 'High-to-Low Cable Fly', muscleGroup: 'Chest', type: 'Cable', notes: 'Targets lower chest' },
  { id: 'low_cable_fly', name: 'Low-to-High Cable Fly', muscleGroup: 'Chest', type: 'Cable', notes: 'Targets upper chest' },
  { id: 'machine_chest_press', name: 'Machine Chest Press', muscleGroup: 'Chest', type: 'Machine', notes: 'Adjust seat height' },
  { id: 'pec_deck', name: 'Pec Deck / Chest Fly Machine', muscleGroup: 'Chest', type: 'Machine', notes: 'Full contraction' },
  { id: 'pushup', name: 'Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Full depth' },
  { id: 'wide_pushup', name: 'Wide Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'More chest activation' },
  { id: 'decline_pushup', name: 'Decline Push-Up', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Feet elevated, upper chest' },
  { id: 'dips_chest', name: 'Chest Dips', muscleGroup: 'Chest', type: 'Bodyweight', notes: 'Lean forward for chest emphasis' },

  // ── BACK ───────────────────────────────────────────────────────────────
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Neutral spine, drive through heels' },
  { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscleGroup: 'Back', type: 'Barbell', notes: 'Wide stance, toes out' },
  { id: 'barbell_row', name: 'Barbell Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Pull to lower chest/upper abdomen' },
  { id: 'pendlay_row', name: 'Pendlay Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Dead stop each rep from floor' },
  { id: 'tbar_row', name: 'T-Bar Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Chest supported or standing' },
  { id: 'rack_pull', name: 'Rack Pull', muscleGroup: 'Back', type: 'Barbell', notes: 'Partial deadlift from knee height' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Pull to upper chest' },
  { id: 'wide_lat_pulldown', name: 'Wide Grip Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Wide pronated grip' },
  { id: 'reverse_lat_pulldown', name: 'Reverse Grip Lat Pulldown', muscleGroup: 'Back', type: 'Machine', notes: 'Supinated grip, more bicep' },
  { id: 'seated_row', name: 'Seated Cable Row', muscleGroup: 'Back', type: 'Cable', notes: 'Keep torso upright' },
  { id: 'wide_cable_row', name: 'Wide Grip Cable Row', muscleGroup: 'Back', type: 'Cable', notes: 'Elbows flared' },
  { id: 'straight_arm_pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'Back', type: 'Cable', notes: 'Arms straight, hinge at shoulder' },
  { id: 'pullup', name: 'Pull-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Full extension at bottom' },
  { id: 'chinup', name: 'Chin-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Supinated grip, biceps emphasis' },
  { id: 'australian_pullup', name: 'Australian Pull-Up', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Inverted row on bar' },
  { id: 'inverted_row', name: 'Inverted Row', muscleGroup: 'Back', type: 'Bodyweight', notes: 'Keep body straight' },
  { id: 'db_row', name: 'Dumbbell Row', muscleGroup: 'Back', type: 'Dumbbell', notes: 'Brace core, row to hip' },
  { id: 'chest_supported_row', name: 'Chest Supported Row', muscleGroup: 'Back', type: 'Dumbbell', notes: 'Eliminate momentum' },
  { id: 'machine_row', name: 'Machine Row', muscleGroup: 'Back', type: 'Machine', notes: 'Chest pad for support' },
  { id: 'meadows_row', name: 'Meadows Row', muscleGroup: 'Back', type: 'Barbell', notes: 'Landmine row, great stretch' },
  { id: 'good_morning', name: 'Good Morning', muscleGroup: 'Back', type: 'Barbell', notes: 'Hinge at hips, neutral spine' },

  // ── SHOULDERS ──────────────────────────────────────────────────────────
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Press from chin level' },
  { id: 'push_press', name: 'Push Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Use leg drive' },
  { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Seated or standing' },
  { id: 'arnold_press', name: 'Arnold Press', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Rotate palms as you press' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Lead with elbow' },
  { id: 'cable_lateral_raise', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', type: 'Cable', notes: 'Constant tension' },
  { id: 'front_raise', name: 'Front Raise', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Arms to shoulder height' },
  { id: 'face_pull', name: 'Face Pull', muscleGroup: 'Shoulders', type: 'Cable', notes: 'External rotation at end range' },
  { id: 'rear_delt_fly', name: 'Rear Delt Fly', muscleGroup: 'Shoulders', type: 'Dumbbell', notes: 'Hinge forward, lead with elbows' },
  { id: 'cable_rear_delt', name: 'Cable Rear Delt Fly', muscleGroup: 'Shoulders', type: 'Cable', notes: 'Cross-cable for better angle' },
  { id: 'machine_lateral_raise', name: 'Machine Lateral Raise', muscleGroup: 'Shoulders', type: 'Machine', notes: 'Consistent arc' },
  { id: 'upright_row', name: 'Upright Row', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Wide grip to reduce impingement' },
  { id: 'handstand_pushup', name: 'Handstand Push-Up', muscleGroup: 'Shoulders', type: 'Bodyweight', notes: 'Wall supported' },
  { id: 'pike_pushup', name: 'Pike Push-Up', muscleGroup: 'Shoulders', type: 'Bodyweight', notes: 'Inverted V position' },
  { id: 'landmine_press', name: 'Landmine Press', muscleGroup: 'Shoulders', type: 'Barbell', notes: 'Single arm, great for pressing path' },

  // ── BICEPS ─────────────────────────────────────────────────────────────
  { id: 'bicep_curl', name: 'Bicep Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Full supination at top' },
  { id: 'ez_bar_curl', name: 'EZ Bar Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Easier on wrists' },
  { id: 'db_curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Alternate or simultaneous' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Neutral grip, targets brachialis' },
  { id: 'incline_curl', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Great stretch position' },
  { id: 'concentration_curl', name: 'Concentration Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Elbow on inner thigh' },
  { id: 'spider_curl', name: 'Spider Curl', muscleGroup: 'Biceps', type: 'Dumbbell', notes: 'Chest on incline bench, arms hang' },
  { id: 'cable_curl', name: 'Cable Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Constant tension' },
  { id: 'high_cable_curl', name: 'High Cable Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Arms at shoulder height' },
  { id: 'rope_hammer_curl', name: 'Rope Hammer Curl', muscleGroup: 'Biceps', type: 'Cable', notes: 'Neutral grip cable' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscleGroup: 'Biceps', type: 'Machine', notes: 'Full stretch at bottom' },
  { id: 'machine_curl', name: 'Machine Curl', muscleGroup: 'Biceps', type: 'Machine', notes: 'Controlled ROM' },
  { id: 'reverse_curl', name: 'Reverse Curl', muscleGroup: 'Biceps', type: 'Barbell', notes: 'Pronated grip, forearm emphasis' },

  // ── TRICEPS ────────────────────────────────────────────────────────────
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', type: 'Cable', notes: 'Elbows tucked, full extension' },
  { id: 'rope_pushdown', name: 'Rope Pushdown', muscleGroup: 'Triceps', type: 'Cable', notes: 'Spread rope at bottom' },
  { id: 'overhead_cable_tricep', name: 'Overhead Cable Tricep Extension', muscleGroup: 'Triceps', type: 'Cable', notes: 'Full stretch overhead' },
  { id: 'skull_crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Lower to forehead' },
  { id: 'ez_skull_crusher', name: 'EZ Bar Skull Crusher', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Easier on wrists' },
  { id: 'close_grip_bench', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Shoulder-width grip' },
  { id: 'overhead_tricep', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', type: 'Dumbbell', notes: 'Full stretch overhead' },
  { id: 'kickback', name: 'Tricep Kickback', muscleGroup: 'Triceps', type: 'Dumbbell', notes: 'Elbow fixed, full extension' },
  { id: 'dips_tri', name: 'Tricep Dips', muscleGroup: 'Triceps', type: 'Bodyweight', notes: 'Upright torso' },
  { id: 'diamond_pushup', name: 'Diamond Push-Up', muscleGroup: 'Triceps', type: 'Bodyweight', notes: 'Hands form diamond shape' },
  { id: 'machine_tricep', name: 'Machine Tricep Extension', muscleGroup: 'Triceps', type: 'Machine', notes: 'Elbows on pad' },
  { id: 'jm_press', name: 'JM Press', muscleGroup: 'Triceps', type: 'Barbell', notes: 'Hybrid skull crusher and close grip' },

  // ── LEGS ───────────────────────────────────────────────────────────────
  { id: 'squat', name: 'Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Hip crease below parallel' },
  { id: 'front_squat', name: 'Front Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'More quad emphasis' },
  { id: 'safety_bar_squat', name: 'Safety Bar Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Reduced shoulder stress' },
  { id: 'pause_squat', name: 'Pause Squat', muscleGroup: 'Legs', type: 'Barbell', notes: '2 second pause at bottom' },
  { id: 'box_squat', name: 'Box Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Sit back onto box' },
  { id: 'zercher_squat', name: 'Zercher Squat', muscleGroup: 'Legs', type: 'Barbell', notes: 'Bar in elbow crooks' },
  { id: 'goblet_squat', name: 'Goblet Squat', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Hold at chest, great for depth' },
  { id: 'db_split_squat', name: 'Dumbbell Split Squat', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Bulgarian variation' },
  { id: 'split_squat_bw', name: 'Bodyweight Split Squat', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Rear foot elevated' },
  { id: 'pistol_squat', name: 'Pistol Squat', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Single leg squat' },
  { id: 'bodyweight_squat', name: 'Bodyweight Squat', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Feet shoulder width' },
  { id: 'jump_squat', name: 'Jump Squat', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Explosive, land soft' },
  { id: 'box_jump', name: 'Box Jump', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Land softly with bent knees' },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'Legs', type: 'Machine', notes: 'Full range, do not lock knees' },
  { id: 'single_leg_press', name: 'Single Leg Press', muscleGroup: 'Legs', type: 'Machine', notes: 'Unilateral for balance' },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'Legs', type: 'Machine', notes: 'Squeeze at top' },
  { id: 'leg_curl', name: 'Lying Leg Curl', muscleGroup: 'Legs', type: 'Machine', notes: 'Full contraction' },
  { id: 'seated_leg_curl', name: 'Seated Leg Curl', muscleGroup: 'Legs', type: 'Machine', notes: 'Better stretch position' },
  { id: 'hack_squat', name: 'Hack Squat', muscleGroup: 'Legs', type: 'Machine', notes: 'Feet shoulder width on platform' },
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'Legs', type: 'Barbell', notes: 'Hamstring stretch, slight knee bend' },
  { id: 'db_rdl', name: 'Dumbbell RDL', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Hamstrings, slight knee bend' },
  { id: 'single_leg_rdl', name: 'Single Leg RDL', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Balance, hip hinge' },
  { id: 'nordic_curl', name: 'Nordic Curl', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Knees anchored, lower slowly' },
  { id: 'lunge', name: 'Lunge', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Step forward, knee over toe' },
  { id: 'reverse_lunge_bw', name: 'Reverse Lunge', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Step back, easier on knees' },
  { id: 'walking_lunge', name: 'Walking Lunge', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Continuous steps forward' },
  { id: 'step_up', name: 'Step Up', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Drive through heel on box' },
  { id: 'step_up_bw', name: 'Bodyweight Step Up', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Drive through heel on box' },
  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Legs', type: 'Machine', notes: 'Full range, pause at top' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscleGroup: 'Legs', type: 'Machine', notes: 'Soleus emphasis' },
  { id: 'db_calf_raise', name: 'Dumbbell Calf Raise', muscleGroup: 'Legs', type: 'Dumbbell', notes: 'Single or double leg' },
  { id: 'calf_raise_bw', name: 'Bodyweight Calf Raise', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Use step edge for ROM' },
  { id: 'sissy_squat', name: 'Sissy Squat', muscleGroup: 'Legs', type: 'Bodyweight', notes: 'Knees forward, heels raised' },

  // ── GLUTES ─────────────────────────────────────────────────────────────
  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'Glutes', type: 'Barbell', notes: 'Squeeze at top, chin to chest' },
  { id: 'db_hip_thrust', name: 'Dumbbell Hip Thrust', muscleGroup: 'Glutes', type: 'Dumbbell', notes: 'Shoulder on bench' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Drive hips to ceiling' },
  { id: 'single_leg_hip_thrust', name: 'Single Leg Hip Thrust', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Unilateral, full range' },
  { id: 'cable_kickback', name: 'Cable Kickback', muscleGroup: 'Glutes', type: 'Cable', notes: 'Squeeze glute at top' },
  { id: 'donkey_kick', name: 'Donkey Kick', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'On all fours, squeeze at top' },
  { id: 'fire_hydrant', name: 'Fire Hydrant', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Lateral leg raise on all fours' },
  { id: 'glute_kickback_bw', name: 'Glute Kickback', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Standing, squeeze at top' },
  { id: 'abduction_machine', name: 'Hip Abduction Machine', muscleGroup: 'Glutes', type: 'Machine', notes: 'Targets glute medius' },
  { id: 'sumo_squat', name: 'Sumo Squat', muscleGroup: 'Glutes', type: 'Dumbbell', notes: 'Wide stance, goblet hold' },
  { id: 'lying_hip_abduction', name: 'Lying Hip Abduction', muscleGroup: 'Glutes', type: 'Bodyweight', notes: 'Side lying, raise top leg' },

  // ── CORE ───────────────────────────────────────────────────────────────
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Neutral spine, brace core' },
  { id: 'side_plank', name: 'Side Plank', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Stack feet or stagger' },
  { id: 'hollow_body_hold', name: 'Hollow Body Hold', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Lower back pressed to floor' },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Full contraction at top' },
  { id: 'sit_up', name: 'Sit-Up', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Full ROM' },
  { id: 'bicycle_crunch', name: 'Bicycle Crunch', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Twist and extend opposite leg' },
  { id: 'russian_twist', name: 'Russian Twist', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Rotate side to side' },
  { id: 'leg_raise', name: 'Hanging Leg Raise', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Posterior pelvic tilt at top' },
  { id: 'hanging_knee_raise', name: 'Hanging Knee Raise', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Easier variation' },
  { id: 'toes_to_bar', name: 'Toes to Bar', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Strict, no swing' },
  { id: 'cable_crunch', name: 'Cable Crunch', muscleGroup: 'Core', type: 'Cable', notes: 'Round spine, crunch hips to chest' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Maintain hollow body' },
  { id: 'dragon_flag', name: 'Dragon Flag', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Advanced, lower slowly' },
  { id: 'l_sit', name: 'L-Sit', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Hold for time' },
  { id: 'pallof_press', name: 'Pallof Press', muscleGroup: 'Core', type: 'Cable', notes: 'Anti-rotation, resist twist' },
  { id: 'woodchop', name: 'Woodchop', muscleGroup: 'Core', type: 'Cable', notes: 'Rotational power' },
  { id: 'mountain_climber', name: 'Mountain Climber', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Fast pace or slow and controlled' },
  { id: 'superman', name: 'Superman', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Lift arms and legs simultaneously' },
  { id: 'hip_raise', name: 'Lying Hip Raise', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Lift hips from floor, legs up' },
  { id: 'dead_bug', name: 'Dead Bug', muscleGroup: 'Core', type: 'Bodyweight', notes: 'Opposite arm and leg extend' },
  { id: 'weighted_crunch', name: 'Weighted Crunch', muscleGroup: 'Core', type: 'Dumbbell', notes: 'Hold plate or dumbbell' },

  // ── CARDIO ─────────────────────────────────────────────────────────────
  { id: 'running', name: 'Running', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'treadmill', name: 'Treadmill', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'stationary_bike', name: 'Stationary Bike', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'Cardio', type: 'Cardio', notes: 'Drive with legs, pull to chest' },
  { id: 'jump_rope', name: 'Jump Rope', muscleGroup: 'Cardio', type: 'Bodyweight', notes: '' },
  { id: 'hiit', name: 'HIIT', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'stair_climber', name: 'Stair Climber', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'burpee', name: 'Burpee', muscleGroup: 'Cardio', type: 'Bodyweight', notes: 'Full body explosive' },
  { id: 'battle_ropes', name: 'Battle Ropes', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'sled_push', name: 'Sled Push', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },
  { id: 'assault_bike', name: 'Assault Bike', muscleGroup: 'Cardio', type: 'Cardio', notes: '' },

  // ── FULL BODY ──────────────────────────────────────────────────────────
  { id: 'clean', name: 'Power Clean', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Explosive pull, receive in front rack' },
  { id: 'clean_jerk', name: 'Clean & Jerk', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Olympic lift' },
  { id: 'snatch', name: 'Snatch', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Wide grip Olympic lift' },
  { id: 'thruster', name: 'Thruster', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Front squat into push press' },
  { id: 'farmers_carry', name: "Farmer's Carry", muscleGroup: 'Full Body', type: 'Dumbbell', notes: 'Walk with heavy weights' },
  { id: 'kb_swing', name: 'Kettlebell Swing', muscleGroup: 'Full Body', type: 'Dumbbell', notes: 'Hip hinge, not squat' },
  { id: 'kb_clean', name: 'Kettlebell Clean', muscleGroup: 'Full Body', type: 'Dumbbell', notes: 'Pull to rack position' },
  { id: 'kb_snatch', name: 'Kettlebell Snatch', muscleGroup: 'Full Body', type: 'Dumbbell', notes: 'Overhead catch, straight arm' },
  { id: 'bear_complex', name: 'Bear Complex', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Clean, front squat, push press, back squat, behind neck press' },
  { id: 'muscle_up', name: 'Muscle-Up', muscleGroup: 'Full Body', type: 'Bodyweight', notes: 'Pull-up into dip transition' },
  { id: 'turkish_getup', name: 'Turkish Get-Up', muscleGroup: 'Full Body', type: 'Dumbbell', notes: 'Slow, controlled full body movement' },
  { id: 'box_squat_jump', name: 'Jump Squat with Weight', muscleGroup: 'Full Body', type: 'Barbell', notes: 'Explosive squat jump' },
];

export function getAllExercises(customExercises = []) {
  return [...PRELOADED_EXERCISES, ...customExercises];
}

export function getExerciseById(id, customExercises = []) {
  return getAllExercises(customExercises).find(e => e.id === id);
}

export function isBodyweightExercise(exerciseId) {
  return BODYWEIGHT_EXERCISE_IDS.has(exerciseId);
}

// Epley formula for weighted exercises: 1RM = weight * (1 + reps/30)
// For bodyweight exercises with 0 weight: score is reps (so we can still rank progress)
export function calculate1RM(weight, reps, exerciseId = '') {
  if (isBodyweightExercise(exerciseId) || weight === 0) {
    // Return reps as a "score" when no added weight
    // If there IS added weight (weighted pull-ups etc) use normal formula
    if (weight === 0) return reps; // pure bodyweight – score = reps
  }
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}
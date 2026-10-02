// EVOLVE Domain Types & Data Contracts

export type FitnessGoal = 
  | 'lose_fat'
  | 'build_muscle'
  | 'improve_strength'
  | 'improve_endurance'
  | 'improve_mobility'
  | 'general_fitness'
  | 'improve_consistency'
  | 'athletic_performance';

export type FitnessExperience = 
  | 'complete_beginner'
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type ActivityLevel = 
  | 'mostly_sitting'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type TrainingEquipment = 
  | 'bodyweight'
  | 'mat'
  | 'resistance_bands'
  | 'dumbbells'
  | 'pull_up_bar'
  | 'kettlebell'
  | 'bench'
  | 'full_gym';

export type TrainingPreference = 
  | 'strength'
  | 'calisthenics'
  | 'cardio'
  | 'hiit'
  | 'mobility'
  | 'core'
  | 'functional';

export type PhysicalLimitation = 
  | 'none'
  | 'shoulder'
  | 'knee'
  | 'back'
  | 'wrist'
  | 'ankle'
  | 'other';

export type FitnessLevel = 
  | 'Beginner 1'
  | 'Beginner 2'
  | 'Beginner 3'
  | 'Beginner 4'
  | 'Intermediate 1'
  | 'Intermediate 2'
  | 'Intermediate 3'
  | 'Intermediate 4'
  | 'Advanced 1'
  | 'Advanced 2'
  | 'Advanced 3';

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email?: string;
  photoURL?: string;
  provider?: string;
  age: number;
  sex: 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';
  heightCm: number;
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  goals: FitnessGoal[];
  primaryGoal: FitnessGoal;
  experience: FitnessExperience;
  activityLevel: ActivityLevel;
  trainingDaysPerWeek: number;
  preferredDurationMinutes: number;
  equipment: TrainingEquipment[];
  preferences: TrainingPreference[];
  limitations: PhysicalLimitation[];
  safetyAcknowledged: boolean;
  isOnboarded: boolean;
  hasCompletedAssessment: boolean;
  reminderPreferences?: ReminderPreferences;
  createdAt: string;
}

export interface ReminderPreferences {
  enabled: boolean;
  // Hydration settings
  hydrationReminderEnabled: boolean;
  hydrationIntervalHours: number; // e.g. 1, 2, 3, 4
  hydrationStartTime: string; // "08:00"
  hydrationEndTime: string; // "21:00"
  hydrationDailyTargetLiters: number; // e.g. 2.5
  // Workout settings
  workoutReminderEnabled: boolean;
  workoutTime: string; // "18:00"
  workoutDays: number[]; // 1=Lunes ... 7=Domingo
  // Audio & In-App alert
  soundEnabled: boolean;
}

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  enabled: true,
  hydrationReminderEnabled: true,
  hydrationIntervalHours: 2,
  hydrationStartTime: '08:00',
  hydrationEndTime: '21:00',
  hydrationDailyTargetLiters: 2.5,
  workoutReminderEnabled: true,
  workoutTime: '18:00',
  workoutDays: [1, 2, 3, 4, 5],
  soundEnabled: true,
};

export interface AssessmentTestResult {
  testId: string;
  name: string;
  variationTested: string;
  repsOrSeconds: number;
  difficultyPerceived: 'easy' | 'moderate' | 'challenging' | 'failed';
  scoreContribution: number;
}

export interface FitnessScores {
  overallScore: number; // 0 - 100 non-medical fitness estimate
  strengthScore: number;
  enduranceScore: number;
  coreScore: number;
  mobilityScore: number;
  consistencyScore: number; // 0 - 100 based on streaks and completion
  calculatedLevel: FitnessLevel;
  testedAt: string;
}

export interface DailyReadiness {
  date: string; // YYYY-MM-DD
  feeling: 'poor' | 'okay' | 'good' | 'great';
  energyLevel: 1 | 2 | 3 | 4 | 5;
  muscleSoreness: 'none' | 'light' | 'moderate' | 'high';
  readinessScore: number; // 0 - 100%
  tier: 'HIGH READINESS' | 'MEDIUM READINESS' | 'LOW READINESS';
  recommendation: string;
}

export type ExerciseCategory = 
  | 'Strength'
  | 'Calisthenics'
  | 'Functional'
  | 'Core'
  | 'Cardio'
  | 'HIIT'
  | 'Mobility'
  | 'Recovery';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: TrainingEquipment[];
  instructions: string[];
  commonMistakes: string[];
  beginnerVariation?: string;
  standardVariation: string;
  advancedVariation?: string;
  defaultSets: number;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  defaultRestSeconds: number;
  progressionLevel: number; // 1 to 7
  progressionPathwayId?: string;
  regressionOptions: string[];
  progressionOptions: string[];
  safetyNotes: string;
  imageUrl: string;
}

export interface ProgressionStage {
  stageNumber: number;
  exerciseId: string;
  name: string;
  targetCriteria: string;
  isUnlocked: boolean;
  isCurrent: boolean;
}

export interface ProgressionPathway {
  id: string;
  name: string;
  description: string;
  stages: ProgressionStage[];
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps?: number;
  targetDurationSeconds?: number;
  restSeconds: number;
  notes?: string;
  completedSets: number;
  actualRepsCompleted?: number[];
  category: ExerciseCategory;
  imageUrl: string;
}

export interface Workout {
  id: string;
  title: string;
  subtitle: string;
  category: ExerciseCategory;
  estimatedDurationMinutes: number;
  intensity: 'Light' | 'Moderate' | 'High';
  estimatedCalories: number;
  rationale: string;
  exercises: WorkoutExercise[];
  isQuickWorkout?: boolean;
  scheduledDay?: string;
}

export type WorkoutFeedbackRating = 
  | 'too_easy'
  | 'easy'
  | 'perfect'
  | 'hard'
  | 'too_hard';

export type PostWorkoutFeeling = 
  | 'great'
  | 'good'
  | 'okay'
  | 'tired';

export interface WorkoutSessionHistory {
  id: string;
  workoutId: string;
  workoutTitle: string;
  category: ExerciseCategory;
  date: string;
  durationSeconds: number;
  caloriesBurned: number;
  exercisesCompletedCount: number;
  totalExercisesCount: number;
  feedbackRating: WorkoutFeedbackRating;
  postFeeling: PostWorkoutFeeling;
  xpEarned: number;
  adaptationNote?: string;
}

export interface ProgramDay {
  dayNumber: number; // 1 to 7
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  workoutTitle: string;
  category: ExerciseCategory;
  durationMinutes: number;
  isRestDay: boolean;
  isCompleted: boolean;
  workoutId: string;
}

export interface FourWeekProgram {
  id: string;
  name: string;
  currentWeek: number; // 1 to 4
  weeks: {
    weekNumber: number;
    title: string;
    theme: string;
    description: string;
    schedule: ProgramDay[];
  }[];
}

export interface DailyHabit {
  id: string;
  title: string;
  iconName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  category: 'hydration' | 'movement' | 'recovery' | 'nutrition' | 'mindfulness';
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  name: string;
  calories: number;
  proteinGrams: number;
  proteinAnimalGrams?: number;
  proteinPlantGrams?: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMinutes: number;
  ingredients: string[];
  instructions?: string[];
  description: string;
  dietaryTags: string[];
  benefitTip?: string;
}

export type DietaryPreferenceType = 'omnivore' | 'vegetarian' | 'vegan' | 'dukan_keto';

export interface NutritionPlan {
  dailyCalorieTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
  hydrationTargetLiters: number;
  hydrationCurrentLiters: number;
  dietaryPreference: DietaryPreferenceType;
  selectedChallengeDay?: number;
  todayMeals: Meal[];
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  metric: string;
  value: string;
  achievedAt: string;
  isRecent: boolean;
}

export interface GamificationState {
  xp: number;
  currentLevelNumber: number;
  levelTitle: string;
  xpToNextLevel: number;
  currentStreakDays: number;
  bestStreakDays: number;
  totalWorkoutsCompleted: number;
  totalTrainingMinutes: number;
  totalEstimatedCalories: number;
  personalRecords: PersonalRecord[];
  activeWeeklyChallenge: {
    title: string;
    description: string;
    current: number;
    target: number;
    xpReward: number;
  };
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    actionType: 'shorten_workout' | 'reduce_intensity' | 'replace_movement' | 'switch_to_recovery';
  };
}

export interface InAppReminder {
  id: string;
  type: 'hydration' | 'workout';
  title: string;
  message: string;
  timestamp: number;
  metadata?: {
    currentLiters?: number;
    targetLiters?: number;
    workoutTitle?: string;
    workoutDuration?: number;
  };
}

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  UserProfile, 
  FitnessScores, 
  FitnessLevel, 
  DailyReadiness, 
  Workout, 
  WorkoutSessionHistory, 
  WorkoutFeedbackRating, 
  PostWorkoutFeeling, 
  FourWeekProgram, 
  DailyHabit, 
  NutritionPlan, 
  GamificationState, 
  AICoachMessage,
  Meal,
  ProgressionPathway,
  DietaryPreferenceType,
  ReminderPreferences,
  DEFAULT_REMINDER_PREFERENCES,
  InAppReminder,
  PhysicalLimitation
} from '../types/fitness';
import { 
  sendLocalBrowserNotification, 
  getNotificationPermission, 
  requestNotificationPermission, 
  AppNotificationPermission 
} from '../services/notificationService';
import { playHydrationChime, playWorkoutChime } from '../services/reminderSound';
import { 
  calculateDailyReadiness, 
  generateTodayWorkout, 
  generateFourWeekProgram, 
  getExerciseReplacement, 
  generateQuickWorkout,
  generateCustomWorkout,
  getExerciseById
} from '../services/adaptiveEngine';
import { PROGRESSION_PATHWAYS } from '../data/exerciseLibrary';
import { getMealPlanForDay, getAllAvailableRecipes } from '../data/nutritionPlans';
import { 
  auth, 
  logOut, 
  syncUserProfileToFirestore, 
  fetchUserProfileFromFirestore, 
  saveWorkoutSessionToFirestore, 
  fetchWorkoutHistoryFromFirestore, 
  saveGamificationToFirestore,
  fetchGamificationFromFirestore
} from '../lib/firebase';

const STORAGE_KEY = 'evolve_fitness_app_state_v3';

// Clean Initial Default User: Starts with 0 metrics and clean slate
const DEFAULT_USER: UserProfile = {
  id: 'user-default',
  name: 'Daniela',
  age: 30,
  sex: 'prefer_not_to_say',
  heightCm: 168,
  weightKg: 62,
  unitSystem: 'metric',
  goals: ['general_fitness', 'improve_strength', 'lose_fat'],
  primaryGoal: 'general_fitness',
  experience: 'beginner',
  activityLevel: 'moderately_active',
  trainingDaysPerWeek: 4,
  preferredDurationMinutes: 25,
  equipment: ['bodyweight'],
  preferences: ['calisthenics', 'functional', 'mobility'],
  limitations: ['none'],
  safetyAcknowledged: true,
  isOnboarded: true,
  hasCompletedAssessment: false,
  reminderPreferences: DEFAULT_REMINDER_PREFERENCES,
  createdAt: new Date().toISOString()
};

const DEFAULT_SCORES: FitnessScores = {
  overallScore: 50,
  strengthScore: 45,
  enduranceScore: 50,
  coreScore: 50,
  mobilityScore: 55,
  consistencyScore: 0,
  calculatedLevel: 'Beginner 1',
  testedAt: new Date().toISOString()
};

const DEFAULT_READINESS: DailyReadiness = {
  date: new Date().toISOString().split('T')[0],
  feeling: 'good',
  energyLevel: 4,
  muscleSoreness: 'none',
  readinessScore: 80,
  tier: 'HIGH READINESS',
  recommendation: 'Tu cuerpo está listo para comenzar tu camino físico. ¡Disfrutá de tu primer entrenamiento!'
};

// Starts at ZERO workouts completed for initial users
const DEFAULT_WORKOUT_HISTORY: WorkoutSessionHistory[] = [];

// Starts at ZERO completed habits for initial users
const DEFAULT_HABITS: DailyHabit[] = [
  { id: 'h1', title: 'Consumo de agua (2,5 L)', iconName: 'Droplet', targetValue: 2.5, currentValue: 0, unit: 'L', completed: false, category: 'hydration' },
  { id: 'h2', title: 'Pasos activos (8.000)', iconName: 'Footprints', targetValue: 8000, currentValue: 0, unit: 'pasos', completed: false, category: 'movement' },
  { id: 'h3', title: 'Movilidad matutina (10 min)', iconName: 'Sparkles', targetValue: 10, currentValue: 0, unit: 'min', completed: false, category: 'recovery' },
  { id: 'h4', title: 'Completar serie de ejercicios de hoy', iconName: 'Dumbbell', targetValue: 1, currentValue: 0, unit: 'sesión', completed: false, category: 'movement' },
  { id: 'h5', title: 'Dormir 7+ horas de descanso', iconName: 'Moon', targetValue: 7.5, currentValue: 0, unit: 'hs', completed: false, category: 'recovery' }
];

const initialPlan = getMealPlanForDay(1, 'omnivore');

const DEFAULT_NUTRITION: NutritionPlan = {
  dailyCalorieTarget: 2000,
  proteinTargetGrams: 125,
  carbsTargetGrams: 210,
  fatTargetGrams: 65,
  hydrationTargetLiters: 2.5,
  hydrationCurrentLiters: 0,
  dietaryPreference: 'omnivore',
  selectedChallengeDay: 1,
  todayMeals: [
    initialPlan.meals.breakfast,
    initialPlan.meals.lunch,
    initialPlan.meals.dinner,
    initialPlan.meals.snack
  ]
};

// Gamification starts at 0 for new user
const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 0,
  currentLevelNumber: 1,
  levelTitle: 'Iniciador de Hábito',
  xpToNextLevel: 300,
  currentStreakDays: 0,
  bestStreakDays: 0,
  totalWorkoutsCompleted: 0,
  totalTrainingMinutes: 0,
  totalEstimatedCalories: 0,
  personalRecords: [],
  activeWeeklyChallenge: {
    title: 'Completar 3 entrenamientos esta semana',
    description: 'Iniciá tu camino de constancia física.',
    current: 0,
    target: 3,
    xpReward: 150
  }
};

const DEFAULT_COACH_MESSAGES: AICoachMessage[] = [
  {
    id: 'c1',
    sender: 'coach',
    text: "¡Te doy la bienvenida a SOYFIT! Tu plan está preparado para acompañarte desde cero y adaptarse a cada sesión. ¿Listo para dar el primer paso?",
    timestamp: 'Hoy'
  }
];

interface FitnessContextType {
  user: UserProfile;
  scores: FitnessScores;
  readiness: DailyReadiness;
  todayWorkout: Workout;
  program: FourWeekProgram;
  workoutHistory: WorkoutSessionHistory[];
  habits: DailyHabit[];
  nutrition: NutritionPlan;
  gamification: GamificationState;
  progressionPathways: ProgressionPathway[];
  coachMessages: AICoachMessage[];
  activeWorkout: Workout | null;
  completedSessionSummary: WorkoutSessionHistory | null;
  isAssessmentModalOpen: boolean;
  isOnboardingModalOpen: boolean;
  isOnboardingOpen: boolean;
  isCoachModalOpen: boolean;
  isReassessmentModalOpen: boolean;
  isWeeklyReviewOpen: boolean;
  isAuthModalOpen: boolean;
  authUser: User | null;
  isAuthLoading: boolean;
  currentTab: 'home' | 'train' | 'journey' | 'nutrition' | 'profile';
  setCurrentTab: (tab: 'home' | 'train' | 'journey' | 'nutrition' | 'profile') => void;
  
  // Actions
  updateUser: (profile: Partial<UserProfile>) => void;
  recalibrateWorkoutWithLimitations: (limitations: PhysicalLimitation[]) => void;
  submitAssessment: (scores: FitnessScores) => void;
  updateReadiness: (feeling: 'poor' | 'okay' | 'good' | 'great', energy: 1|2|3|4|5, soreness: 'none'|'light'|'moderate'|'high') => void;
  startWorkout: (workout?: Workout) => void;
  cancelActiveWorkout: () => void;
  finishActiveWorkout: (feedback: WorkoutFeedbackRating, feeling: PostWorkoutFeeling, durationSeconds: number) => void;
  replaceExerciseInActiveWorkout: (exerciseIndex: number, reason: 'too_easy' | 'too_hard' | 'no_equipment' | 'pain_discomfort' | 'different') => { replacementName: string; advice: string };
  toggleHabit: (habitId: string) => void;
  addWater: (amountLiters: number) => void;
  resetHydration: () => void;
  swapMeal: (mealId: string) => void;
  selectCustomRecipeForMeal: (mealId: string, recipe: Meal) => void;
  setDietaryPreference: (diet: DietaryPreferenceType) => void;
  selectChallengeDay: (day: number) => void;
  sendCoachMessage: (userText: string) => void;
  launchQuickWorkout: (minutes: 5 | 10 | 15) => void;
  generateCustomSession: (params: Parameters<typeof generateCustomWorkout>[0]) => void;
  activeReminder: InAppReminder | null;
  notificationPermission: AppNotificationPermission;
  dismissReminder: () => void;
  snoozeReminder: (minutes?: number) => void;
  triggerTestReminder: (type: 'hydration' | 'workout') => void;
  requestBrowserNotificationPermission: () => Promise<AppNotificationPermission>;
  updateReminderPreferences: (prefs: Partial<ReminderPreferences>) => void;
  setIsAssessmentModalOpen: (open: boolean) => void;
  setIsOnboardingModalOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsCoachModalOpen: (open: boolean) => void;
  setIsReassessmentModalOpen: (open: boolean) => void;
  setIsWeeklyReviewOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isLandingCarouselOpen: boolean;
  setIsLandingCarouselOpen: (open: boolean) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  logoutUser: () => Promise<void>;
  resetToDemoData: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Helper for user-scoped cache keys
  const getScopedKey = (key: string, uid?: string | null) => {
    const effectiveId = uid || authUser?.uid || 'guest';
    return `${STORAGE_KEY}_${effectiveId}_${key}`;
  };

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(getScopedKey('user'));
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [scores, setScores] = useState<FitnessScores>(() => {
    const saved = localStorage.getItem(getScopedKey('scores'));
    return saved ? JSON.parse(saved) : DEFAULT_SCORES;
  });

  const [readiness, setReadiness] = useState<DailyReadiness>(() => {
    const saved = localStorage.getItem(getScopedKey('readiness'));
    return saved ? JSON.parse(saved) : DEFAULT_READINESS;
  });

  // Always starts at 0/empty for new users
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSessionHistory[]>(() => {
    const saved = localStorage.getItem(getScopedKey('history'));
    return saved ? JSON.parse(saved) : DEFAULT_WORKOUT_HISTORY;
  });

  const [program, setProgram] = useState<FourWeekProgram>(() => {
    const saved = localStorage.getItem(getScopedKey('program'));
    return saved ? JSON.parse(saved) : generateFourWeekProgram(DEFAULT_USER);
  });

  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem(getScopedKey('habits'));
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [nutrition, setNutrition] = useState<NutritionPlan>(() => {
    const saved = localStorage.getItem(getScopedKey('nutrition'));
    return saved ? JSON.parse(saved) : DEFAULT_NUTRITION;
  });

  // Always starts at 0 for new users
  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem(getScopedKey('gamification'));
    return saved ? JSON.parse(saved) : DEFAULT_GAMIFICATION;
  });

  const [progressionPathways, setProgressionPathways] = useState<ProgressionPathway[]>(() => {
    const saved = localStorage.getItem(getScopedKey('pathways'));
    return saved ? JSON.parse(saved) : PROGRESSION_PATHWAYS;
  });

  const [coachMessages, setCoachMessages] = useState<AICoachMessage[]>(() => {
    const saved = localStorage.getItem(getScopedKey('coach'));
    return saved ? JSON.parse(saved) : DEFAULT_COACH_MESSAGES;
  });

  // Today's dynamic workout
  const [todayWorkout, setTodayWorkout] = useState<Workout>(() => {
    return generateTodayWorkout(user, readiness, workoutHistory);
  });

  // Modals & Active Session state
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [completedSessionSummary, setCompletedSessionSummary] = useState<WorkoutSessionHistory | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isReassessmentModalOpen, setIsReassessmentModalOpen] = useState(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLandingCarouselOpen, setIsLandingCarouselOpen] = useState(() => {
    // Show carousel if not previously dismissed
    return !localStorage.getItem('SOYFIT_dismissed_carousel');
  });

  const isAdmin = useMemo(() => {
    const adminEmail = 'lucas.ferreyra@gmail.com';
    const currentEmail = (authUser?.email || user?.email || '').toLowerCase().trim();
    return currentEmail === adminEmail;
  }, [authUser, user]);

  const [currentTab, setCurrentTab] = useState<'home' | 'train' | 'journey' | 'nutrition' | 'profile'>('home');
  const [activeReminder, setActiveReminder] = useState<InAppReminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<AppNotificationPermission>(() => getNotificationPermission());

  // Firebase Auth & Cloud Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        try {
          // 1. Sync or initialize User Profile in Firestore
          const cloudProfile = await fetchUserProfileFromFirestore(currentUser.uid);
          if (cloudProfile) {
            const nowIso = new Date().toISOString();
            syncUserProfileToFirestore(currentUser.uid, {
              ...cloudProfile,
              lastActiveAt: nowIso
            }).catch(() => {});

            setUser(prev => ({
              ...prev,
              ...cloudProfile,
              uid: currentUser.uid,
              name: cloudProfile.name || currentUser.displayName || prev.name,
              email: currentUser.email || cloudProfile.email || prev.email,
              photoURL: currentUser.photoURL || cloudProfile.photoURL,
              provider: currentUser.providerData?.[0]?.providerId || 'firebase',
              lastActiveAt: nowIso
            }));

            // If user has not calibrated their goals/injuries yet, trigger calibration modal
            if (!cloudProfile.hasCompletedAssessment) {
              setIsAssessmentModalOpen(true);
            }
          } else {
            // New user in Firestore: initialize profile with zeroed baseline
            const providerId = currentUser.providerData?.[0]?.providerId || 'firebase';
            const rawName = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Daniela');
            const initialCloudProfile: Partial<UserProfile> & { email?: string; photoURL?: string; provider?: string } = {
              name: rawName,
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              provider: providerId,
              experience: 'beginner',
              goals: ['general_fitness', 'improve_strength', 'lose_fat'],
              primaryGoal: 'general_fitness',
              activityLevel: 'moderately_active',
              trainingDaysPerWeek: 4,
              preferredDurationMinutes: 25,
              equipment: ['bodyweight'],
              limitations: ['none'],
              safetyAcknowledged: true,
              isOnboarded: true,
              hasCompletedAssessment: false,
              reminderPreferences: DEFAULT_REMINDER_PREFERENCES,
              createdAt: new Date().toISOString()
            };
            await syncUserProfileToFirestore(currentUser.uid, initialCloudProfile);
            setUser(prev => ({
              ...prev,
              ...initialCloudProfile,
              uid: currentUser.uid,
              name: rawName,
              email: initialCloudProfile.email,
              photoURL: initialCloudProfile.photoURL,
              provider: providerId
            }));

            // Initialize clean zero gamification document in Firestore
            await saveGamificationToFirestore(currentUser.uid, DEFAULT_GAMIFICATION);

            // Automatically open Biomechanical Calibration modal for new user
            setIsAssessmentModalOpen(true);
          }

          // 2. Fetch individual workout history from Firestore
          const cloudHistory = await fetchWorkoutHistoryFromFirestore(currentUser.uid);
          if (cloudHistory && cloudHistory.length > 0) {
            setWorkoutHistory(cloudHistory);
          } else {
            // New user has 0 sessions
            setWorkoutHistory([]);
          }

          // 3. Fetch individual gamification state from Firestore
          const cloudGamification = await fetchGamificationFromFirestore(currentUser.uid);
          if (cloudGamification) {
            setGamification({
              ...DEFAULT_GAMIFICATION,
              ...cloudGamification,
              personalRecords: cloudGamification.personalRecords || []
            });
          } else {
            // Initialize zero metrics
            setGamification(DEFAULT_GAMIFICATION);
            await saveGamificationToFirestore(currentUser.uid, DEFAULT_GAMIFICATION);
          }

          // 4. Initialize clean habit checklist starting at 0 progress
          setHabits(DEFAULT_HABITS.map(h => ({ ...h, currentValue: 0, completed: false })));

        } catch (e) {
          console.error('Error syncing user with Firestore:', e);
        }
      } else {
        // User logged out or guest: reset state cleanly to initial zero baseline
        setUser(DEFAULT_USER);
        setWorkoutHistory([]);
        setGamification(DEFAULT_GAMIFICATION);
        setHabits(DEFAULT_HABITS.map(h => ({ ...h, currentValue: 0, completed: false })));
        setScores(DEFAULT_SCORES);
        setNutrition(DEFAULT_NUTRITION);
        setReadiness(DEFAULT_READINESS);
      }
    });

    return () => unsubscribe();
  }, []);

  // User-scoped Persistence to localStorage
  useEffect(() => {
    localStorage.setItem(getScopedKey('user'), JSON.stringify(user));
  }, [user, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('scores'), JSON.stringify(scores));
  }, [scores, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('readiness'), JSON.stringify(readiness));
  }, [readiness, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('history'), JSON.stringify(workoutHistory));
  }, [workoutHistory, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('program'), JSON.stringify(program));
  }, [program, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('habits'), JSON.stringify(habits));
  }, [habits, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('nutrition'), JSON.stringify(nutrition));
  }, [nutrition, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('gamification'), JSON.stringify(gamification));
  }, [gamification, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('pathways'), JSON.stringify(progressionPathways));
  }, [progressionPathways, authUser]);

  useEffect(() => {
    localStorage.setItem(getScopedKey('coach'), JSON.stringify(coachMessages));
  }, [coachMessages, authUser]);

  // Re-generate today's workout whenever readiness or user experience updates
  useEffect(() => {
    if (!activeWorkout) {
      setTodayWorkout(generateTodayWorkout(user, readiness, workoutHistory));
    }
  }, [user, readiness, workoutHistory]);

  // Actions
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      setTodayWorkout(generateTodayWorkout(updated, readiness, workoutHistory));
      if (authUser) {
        syncUserProfileToFirestore(authUser.uid, updated).catch(err => {
          console.error('Failed to sync profile update to Firestore:', err);
        });
      }
      return updated;
    });
  };

  const submitAssessment = (newScores: FitnessScores) => {
    setScores(newScores);
    const calculatedExperience = newScores.overallScore > 65 ? 'intermediate' : newScores.overallScore > 40 ? 'beginner' : 'complete_beginner';
    
    setUser(prev => {
      const updated = {
        ...prev,
        hasCompletedAssessment: true,
        experience: calculatedExperience
      };
      if (authUser) {
        syncUserProfileToFirestore(authUser.uid, updated).catch(err => {
          console.error('Failed to sync assessment results to Firestore:', err);
        });
      }
      return updated;
    });

    setProgressionPathways(prev => prev.map(pathway => {
      if (pathway.id === 'pushup-journey') {
        const stages = pathway.stages.map((s, idx) => ({
          ...s,
          isUnlocked: newScores.strengthScore > 60 ? idx <= 3 : newScores.strengthScore > 35 ? idx <= 2 : idx <= 1,
          isCurrent: newScores.strengthScore > 60 ? idx === 3 : newScores.strengthScore > 35 ? idx === 2 : idx === 1
        }));
        return { ...pathway, stages };
      }
      return pathway;
    }));

    setProgram(generateFourWeekProgram({
      ...user,
      hasCompletedAssessment: true,
      experience: calculatedExperience
    }));
  };

  const updateReadiness = (
    feeling: 'poor' | 'okay' | 'good' | 'great',
    energy: 1 | 2 | 3 | 4 | 5,
    soreness: 'none' | 'light' | 'moderate' | 'high'
  ) => {
    const newReadiness = calculateDailyReadiness(feeling, energy, soreness);
    setReadiness(newReadiness);
    setTodayWorkout(generateTodayWorkout(user, newReadiness, workoutHistory));
  };

  const startWorkout = (workoutToStart?: Workout) => {
    let selected = workoutToStart || todayWorkout;
    if (!selected || !selected.exercises || selected.exercises.length === 0) {
      selected = generateTodayWorkout(user, readiness, workoutHistory);
    }
    setActiveWorkout(selected);
  };

  const recalibrateWorkoutWithLimitations = (limitations: PhysicalLimitation[]) => {
    const updatedUser: UserProfile = { ...user, limitations };
    setUser(updatedUser);
    const newWorkout = generateTodayWorkout(updatedUser, readiness, workoutHistory);
    setTodayWorkout(newWorkout);
    setActiveWorkout(newWorkout);
    if (authUser) {
      syncUserProfileToFirestore(authUser.uid, { limitations }).catch(err => {
        console.error('Failed to sync limitations to Firestore:', err);
      });
    }
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
  };

  const finishActiveWorkout = (
    feedback: WorkoutFeedbackRating,
    feeling: PostWorkoutFeeling,
    durationSeconds: number
  ) => {
    if (!activeWorkout) return;

    const burned = Math.round((durationSeconds / 60) * (activeWorkout.intensity === 'High' ? 12 : activeWorkout.intensity === 'Moderate' ? 9.5 : 6));
    const xpGained = feedback === 'perfect' || feedback === 'hard' ? 150 : 120;

    let adaptationNote = 'Sesión completada según lo planificado.';
    if (feedback === 'too_easy') {
      adaptationNote = 'Marcaste la sesión como fácil. El motor adaptativo aumentará repeticiones y variantes de progresión.';
    } else if (feedback === 'too_hard') {
      adaptationNote = 'Marcaste la sesión como exigente. La próxima sesión enfatizará recuperación activa y rango controlado.';
    }

    const todayDateStr = new Date().toISOString().split('T')[0];
    const newHistoryEntry: WorkoutSessionHistory = {
      id: `hist-${Date.now()}`,
      workoutId: activeWorkout.id,
      workoutTitle: activeWorkout.title,
      category: activeWorkout.category,
      date: todayDateStr,
      durationSeconds,
      caloriesBurned: burned,
      exercisesCompletedCount: activeWorkout.exercises.length,
      totalExercisesCount: activeWorkout.exercises.length,
      feedbackRating: feedback,
      postFeeling: feeling,
      xpEarned: xpGained,
      adaptationNote
    };

    // Update history locally
    setWorkoutHistory(prev => [newHistoryEntry, ...prev]);

    // Calculate updated metrics
    const newMinutes = Math.max(1, Math.round(durationSeconds / 60));
    const newStreak = gamification.currentStreakDays + 1;
    const newXp = gamification.xp + xpGained;
    const newWorkoutsCount = gamification.totalWorkoutsCompleted + 1;
    const newCalories = gamification.totalEstimatedCalories + burned;

    let level = gamification.currentLevelNumber;
    let levelTitle = gamification.levelTitle;
    if (newXp >= 1000) {
      level = 3;
      levelTitle = 'Constancia Consolidada';
    } else if (newXp >= 300) {
      level = 2;
      levelTitle = 'Atleta Activo';
    }

    const updatedGamification: GamificationState = {
      ...gamification,
      xp: newXp,
      currentStreakDays: newStreak,
      bestStreakDays: Math.max(newStreak, gamification.bestStreakDays),
      currentLevelNumber: level,
      levelTitle,
      totalTrainingMinutes: gamification.totalTrainingMinutes + newMinutes,
      totalEstimatedCalories: newCalories,
      totalWorkoutsCompleted: newWorkoutsCount,
      activeWeeklyChallenge: {
        ...gamification.activeWeeklyChallenge,
        current: Math.min(gamification.activeWeeklyChallenge.target, gamification.activeWeeklyChallenge.current + 1)
      }
    };

    // Update gamification locally
    setGamification(updatedGamification);

    // Mark workout habit as completed
    setHabits(prev => prev.map(h => h.id === 'h4' ? { ...h, completed: true, currentValue: 1 } : h));

    // Cloud sync to Firestore per individual authenticated user
    if (authUser) {
      saveWorkoutSessionToFirestore(authUser.uid, newHistoryEntry).catch(err => {
        console.error('Failed to save workout session to Firestore:', err);
      });
      saveGamificationToFirestore(authUser.uid, updatedGamification).catch(err => {
        console.error('Failed to save gamification metrics to Firestore:', err);
      });
    }

    // Show completion summary
    setCompletedSessionSummary(newHistoryEntry);
    setActiveWorkout(null);
  };

  const replaceExerciseInActiveWorkout = (
    exerciseIndex: number,
    reason: 'too_easy' | 'too_hard' | 'no_equipment' | 'pain_discomfort' | 'different'
  ) => {
    if (!activeWorkout) return { replacementName: '', advice: '' };

    const currentExercise = activeWorkout.exercises[exerciseIndex];
    const { replacement, advice } = getExerciseReplacement(currentExercise.exerciseId, reason, user);

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...currentExercise,
      exerciseId: replacement.id,
      exerciseName: replacement.name,
      category: replacement.category,
      imageUrl: replacement.imageUrl,
      notes: advice
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });

    return { replacementName: replacement.name, advice };
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const nextCompleted = !h.completed;
        return {
          ...h,
          completed: nextCompleted,
          currentValue: nextCompleted ? h.targetValue : 0
        };
      }
      return h;
    }));
  };

  const addWater = (amountLiters: number) => {
    setNutrition(prev => {
      const updated = Math.min(prev.hydrationTargetLiters * 1.5, Math.round((prev.hydrationCurrentLiters + amountLiters) * 10) / 10);
      return { ...prev, hydrationCurrentLiters: updated };
    });
    setHabits(prev => prev.map(h => {
      if (h.id === 'h1') {
        const nextVal = Math.min(h.targetValue, Math.round((h.currentValue + amountLiters) * 10) / 10);
        return { ...h, currentValue: nextVal, completed: nextVal >= h.targetValue };
      }
      return h;
    }));
  };

  const resetHydration = () => {
    setNutrition(prev => ({ ...prev, hydrationCurrentLiters: 0 }));
    setHabits(prev => prev.map(h => h.id === 'h1' ? { ...h, currentValue: 0, completed: false } : h));
  };

  const setDietaryPreference = (pref: DietaryPreferenceType) => {
    setNutrition(prev => {
      const day = prev.selectedChallengeDay || 1;
      const plan = getMealPlanForDay(day, pref);
      return {
        ...prev,
        dietaryPreference: pref,
        todayMeals: [
          plan.meals.breakfast,
          plan.meals.lunch,
          plan.meals.dinner,
          plan.meals.snack
        ]
      };
    });
  };

  const selectChallengeDay = (day: number) => {
    setNutrition(prev => {
      const plan = getMealPlanForDay(day, prev.dietaryPreference || 'omnivore');
      return {
        ...prev,
        selectedChallengeDay: day,
        todayMeals: [
          plan.meals.breakfast,
          plan.meals.lunch,
          plan.meals.dinner,
          plan.meals.snack
        ]
      };
    });
  };

  const swapMeal = (mealId: string) => {
    setNutrition(prev => {
      const currentMeal = prev.todayMeals.find(m => m.id === mealId);
      if (!currentMeal) return prev;

      const allRecipes = getAllAvailableRecipes();
      // Filter by the same meal type (Breakfast, Lunch, Dinner, Snack)
      const matchingType = allRecipes.filter(r => r.type === currentMeal.type);
      if (matchingType.length === 0) return prev;

      // Find current index and pick next one in rotation
      const currentIndex = matchingType.findIndex(r => 
        r.name.trim().toLowerCase() === currentMeal.name.trim().toLowerCase() || r.id === currentMeal.id
      );
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % matchingType.length : 0;
      const replacement = matchingType[nextIndex];

      return {
        ...prev,
        todayMeals: prev.todayMeals.map(m => m.id === mealId ? { ...replacement, id: `swap-${Date.now()}` } : m)
      };
    });
  };

  const selectCustomRecipeForMeal = (mealId: string, recipe: Meal) => {
    setNutrition(prev => ({
      ...prev,
      todayMeals: prev.todayMeals.map(m => 
        m.id === mealId || m.type === recipe.type ? { ...recipe, id: `custom-${Date.now()}` } : m
      )
    }));
  };

  const sendCoachMessage = (userText: string) => {
    const newMsg: AICoachMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCoachMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let replyText = "Estoy analizando tu rendimiento y tu recuperación de hoy. Contame cómo te sentís o qué querés ajustar en tu rutina de hoy.";
      let action: AICoachMessage['quickAction'];

      if (lower.includes('15 min') || lower.includes('15 minutos') || lower.includes('corto') || lower.includes('poco tiempo')) {
        replyText = "Adapté tu rutina de hoy a un bloque express de 15 minutos. Mantiene los ejercicios clave de fuerza (flexiones inclinadas y sentadillas al aire) reduciendo los descansos.";
        action = { label: 'Aplicar rutina express de 15 min', actionType: 'shorten_workout' };
        setTodayWorkout(generateQuickWorkout(15));
      } else if (lower.includes('cansado') || lower.includes('agotado') || lower.includes('fatiga') || lower.includes('dolor') || lower.includes('pesado')) {
        replyText = "Entendido. Forzar el cuerpo con fatiga acumulada no ayuda a progresar. Bajé el volumen un 35% y pasamos a una sesión de movilidad articular para cuidar tu cuerpo.";
        action = { label: 'Cambiar a movilidad y recuperación', actionType: 'switch_to_recovery' };
        updateReadiness('okay', 2, 'moderate');
      } else if (lower.includes('por qué') || lower.includes('porque') || lower.includes('suave') || lower.includes('fácil')) {
        replyText = `¿Por qué esta sesión? Tu disposición calculada para hoy fue del ${readiness.readinessScore}%. El motor adaptativo prioriza recuperación activa para que no acumules fatiga en articulaciones.`;
      } else if (lower.includes('flexion') || lower.includes('push-up') || lower.includes('pushup')) {
        replyText = `En el camino de flexiones podés avanzar escalón por escalón: primero flexiones inclinadas en pared o banco, luego de rodillas y finalmente en suelo plano.`;
      } else if (lower.includes('semana') || lower.includes('resumen') || lower.includes('progreso')) {
        replyText = `Tu balance hasta ahora: ${gamification.totalWorkoutsCompleted} entrenamientos completados, ${gamification.currentStreakDays} días de racha continua y ${gamification.totalEstimatedCalories} kcal activas. ¡Buen trabajo!`;
      }

      setCoachMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: action
        }
      ]);
    }, 600);
  };

  const launchQuickWorkout = (minutes: 5 | 10 | 15) => {
    const quick = generateQuickWorkout(minutes, user?.limitations || []);
    startWorkout(quick);
  };

  const generateCustomSession = (params: Parameters<typeof generateCustomWorkout>[0]) => {
    const custom = generateCustomWorkout(params);
    startWorkout(custom);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setScores(DEFAULT_SCORES);
    setReadiness(DEFAULT_READINESS);
    setWorkoutHistory(DEFAULT_WORKOUT_HISTORY);
    setProgram(generateFourWeekProgram(DEFAULT_USER));
    setHabits(DEFAULT_HABITS);
    setNutrition(DEFAULT_NUTRITION);
    setGamification(DEFAULT_GAMIFICATION);
    setProgressionPathways(PROGRESSION_PATHWAYS);
    setCoachMessages(DEFAULT_COACH_MESSAGES);
    setTodayWorkout(generateTodayWorkout(DEFAULT_USER, DEFAULT_READINESS, DEFAULT_WORKOUT_HISTORY));
  };

  const logoutUser = async () => {
    await logOut();
    setAuthUser(null);
    setWorkoutHistory([]);
    setGamification(DEFAULT_GAMIFICATION);
  };

  // Reminders Management
  const updateReminderPreferences = (prefs: Partial<ReminderPreferences>) => {
    const currentPrefs = user.reminderPreferences || DEFAULT_REMINDER_PREFERENCES;
    const merged = { ...currentPrefs, ...prefs };
    updateUser({ reminderPreferences: merged });
  };

  const requestBrowserNotificationPermission = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    return res;
  };

  const dismissReminder = () => {
    setActiveReminder(null);
    localStorage.setItem(getScopedKey('last_hydration_reminder'), String(Date.now()));
  };

  const snoozeReminder = (minutes: number = 15) => {
    setActiveReminder(null);
    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(`${STORAGE_KEY}_snooze_until`, String(snoozeUntil));
    localStorage.setItem(getScopedKey('last_hydration_reminder'), String(Date.now()));
  };

  const triggerTestReminder = (type: 'hydration' | 'workout') => {
    const prefs = user.reminderPreferences || DEFAULT_REMINDER_PREFERENCES;
    const firstName = user.name ? user.name.trim().split(/\s+/)[0] : 'Daniela';

    if (type === 'hydration') {
      const current = nutrition.hydrationCurrentLiters || 0;
      const target = prefs.hydrationDailyTargetLiters || 2.5;
      const title = '💧 ¡Momento de hidratarte!';
      const message = `Llevás ${current.toFixed(1)} L de ${target.toFixed(1)} L objetivo. Tomá un vaso de agua fresca para mantener tu rendimiento muscular y cognitivo.`;

      if (prefs.soundEnabled) {
        playHydrationChime();
      }

      sendLocalBrowserNotification({
        title,
        body: message,
        tag: 'hydration-reminder-test',
        onClick: () => setCurrentTab('nutrition')
      });

      setActiveReminder({
        id: `reminder-hydration-test-${Date.now()}`,
        type: 'hydration',
        title,
        message,
        timestamp: Date.now(),
        metadata: {
          currentLiters: current,
          targetLiters: target
        }
      });
    } else {
      const title = `🏋️ ¡Hora de entrenar, ${firstName}!`;
      const message = `Tu sesión de hoy "${todayWorkout.title}" (${todayWorkout.estimatedDurationMinutes} min) te espera. ¡Mantené tu constancia y alcanzá tus metas!`;

      if (prefs.soundEnabled) {
        playWorkoutChime();
      }

      sendLocalBrowserNotification({
        title,
        body: message,
        tag: 'workout-reminder-test',
        onClick: () => setCurrentTab('train')
      });

      setActiveReminder({
        id: `reminder-workout-test-${Date.now()}`,
        type: 'workout',
        title,
        message,
        timestamp: Date.now(),
        metadata: {
          workoutTitle: todayWorkout.title,
          workoutDuration: todayWorkout.estimatedDurationMinutes
        }
      });
    }
  };

  // Periodic Daily Reminders Engine (Hydration & Workout Schedules)
  useEffect(() => {
    const checkReminders = () => {
      // Never show reminders while user is viewing the landing carousel or auth flow
      if (isLandingCarouselOpen || isAuthModalOpen) return;

      const prefs = user.reminderPreferences || DEFAULT_REMINDER_PREFERENCES;
      if (!prefs.enabled) return;

      // Check if snoozed
      const snoozeUntil = Number(localStorage.getItem(`${STORAGE_KEY}_snooze_until`) || 0);
      if (Date.now() < snoozeUntil) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 1=Mon ... 7=Sun
      const todayDateStr = now.toISOString().split('T')[0];

      // 1. Check Hydration Reminder
      if (prefs.hydrationReminderEnabled) {
        const [startH, startM] = (prefs.hydrationStartTime || '08:00').split(':').map(Number);
        const [endH, endM] = (prefs.hydrationEndTime || '21:00').split(':').map(Number);
        const startTotalMinutes = (startH || 8) * 60 + (startM || 0);
        const endTotalMinutes = (endH || 21) * 60 + (endM || 0);

        if (currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes) {
          const currentWater = nutrition.hydrationCurrentLiters || 0;
          const targetWater = prefs.hydrationDailyTargetLiters || 2.5;

          // Only remind if hydration goal has not been reached yet
          if (currentWater < targetWater) {
            const rawLastHydration = localStorage.getItem(getScopedKey('last_hydration_reminder'));
            // If never recorded before (first moment/launch), establish the baseline NOW and do not trigger immediately
            if (!rawLastHydration) {
              localStorage.setItem(getScopedKey('last_hydration_reminder'), String(Date.now()));
              return;
            }

            const lastHydrationTime = Number(rawLastHydration);
            const intervalMs = (prefs.hydrationIntervalHours || 2) * 60 * 60 * 1000;

            if (Date.now() - lastHydrationTime >= intervalMs) {
              localStorage.setItem(getScopedKey('last_hydration_reminder'), String(Date.now()));

              const title = '💧 ¡Momento de hidratarte!';
              const message = `Llevás ${currentWater.toFixed(1)} L de ${targetWater.toFixed(1)} L objetivo. Tomá un vaso de agua fresca para mantener tu balance óptimo.`;

              if (prefs.soundEnabled) {
                playHydrationChime();
              }

              sendLocalBrowserNotification({
                title,
                body: message,
                tag: 'hydration-scheduled',
                onClick: () => setCurrentTab('nutrition')
              });

              setActiveReminder({
                id: `reminder-hydration-${Date.now()}`,
                type: 'hydration',
                title,
                message,
                timestamp: Date.now(),
                metadata: {
                  currentLiters: currentWater,
                  targetLiters: targetWater
                }
              });
            }
          }
        }
      }

      // 2. Check Workout Reminder
      if (prefs.workoutReminderEnabled) {
        const isScheduledDay = (prefs.workoutDays || [1, 2, 3, 4, 5]).includes(dayOfWeek);

        if (isScheduledDay) {
          const alreadyCompletedToday = workoutHistory.some(s => s.date === todayDateStr);

          if (!alreadyCompletedToday && !activeWorkout) {
            const [workoutH, workoutM] = (prefs.workoutTime || '18:00').split(':').map(Number);
            const workoutTotalMinutes = (workoutH || 18) * 60 + (workoutM || 0);

            // Trigger when within scheduled time window (0 to 35 min after)
            if (currentMinutes >= workoutTotalMinutes && currentMinutes <= workoutTotalMinutes + 35) {
              const lastWorkoutReminderDate = localStorage.getItem(getScopedKey('last_workout_reminder_date'));

              if (lastWorkoutReminderDate !== todayDateStr) {
                localStorage.setItem(getScopedKey('last_workout_reminder_date'), todayDateStr);

                const firstName = user.name ? user.name.trim().split(/\s+/)[0] : 'Daniela';
                const title = `🏋️ ¡Hora de entrenar, ${firstName}!`;
                const message = `Tu plan de hoy "${todayWorkout.title}" (${todayWorkout.estimatedDurationMinutes} min) te espera. ¡Completalo para mantener tu racha activa!`;

                if (prefs.soundEnabled) {
                  playWorkoutChime();
                }

                sendLocalBrowserNotification({
                  title,
                  body: message,
                  tag: 'workout-scheduled',
                  onClick: () => setCurrentTab('train')
                });

                setActiveReminder({
                  id: `reminder-workout-${Date.now()}`,
                  type: 'workout',
                  title,
                  message,
                  timestamp: Date.now(),
                  metadata: {
                    workoutTitle: todayWorkout.title,
                    workoutDuration: todayWorkout.estimatedDurationMinutes
                  }
                });
              }
            }
          }
        }
      }
    };

    // Run check immediately and then every 30 seconds
    checkReminders();
    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [user, nutrition, workoutHistory, activeWorkout, todayWorkout, isLandingCarouselOpen, isAuthModalOpen]);

  return (
    <FitnessContext.Provider value={{
      user,
      scores,
      readiness,
      todayWorkout,
      program,
      workoutHistory,
      habits,
      nutrition,
      gamification,
      progressionPathways,
      coachMessages,
      activeWorkout,
      completedSessionSummary,
      activeReminder,
      notificationPermission,
      dismissReminder,
      snoozeReminder,
      triggerTestReminder,
      requestBrowserNotificationPermission,
      updateReminderPreferences,
      isAssessmentModalOpen,
      isOnboardingModalOpen,
      isOnboardingOpen: isOnboardingModalOpen,
      isCoachModalOpen,
      isReassessmentModalOpen,
      isWeeklyReviewOpen,
      isAuthModalOpen,
      authUser,
      isAuthLoading,
      currentTab,
      setCurrentTab,
      updateUser,
      recalibrateWorkoutWithLimitations,
      submitAssessment,
      updateReadiness,
      startWorkout,
      cancelActiveWorkout,
      finishActiveWorkout,
      replaceExerciseInActiveWorkout,
      toggleHabit,
      addWater,
      resetHydration,
      swapMeal,
      selectCustomRecipeForMeal,
      setDietaryPreference,
      selectChallengeDay,
      sendCoachMessage,
      launchQuickWorkout,
      generateCustomSession,
      setIsAssessmentModalOpen,
      setIsOnboardingModalOpen,
      setIsOnboardingOpen: setIsOnboardingModalOpen,
      setIsCoachModalOpen,
      setIsReassessmentModalOpen,
      setIsWeeklyReviewOpen,
      setIsAuthModalOpen,
      isAdmin,
      isAdminModalOpen,
      setIsAdminModalOpen,
      isLandingCarouselOpen,
      setIsLandingCarouselOpen,
      isGoalModalOpen,
      setIsGoalModalOpen,
      logoutUser,
      resetToDemoData
    }}>
      {children}
    </FitnessContext.Provider>
  );
};

export function useFitness(): FitnessContextType {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}

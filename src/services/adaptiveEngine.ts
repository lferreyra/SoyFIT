import { 
  UserProfile, 
  FitnessScores, 
  FitnessLevel, 
  DailyReadiness, 
  Workout, 
  WorkoutExercise, 
  WorkoutFeedbackRating, 
  WorkoutSessionHistory, 
  FourWeekProgram, 
  Exercise, 
  ExerciseCategory 
} from '../types/fitness';
import { EXERCISE_LIBRARY, PROGRESSION_PATHWAYS } from '../data/exerciseLibrary';
import { formatCalories } from '../i18n';

/**
 * Calculates a non-medical Fitness Estimate score out of 100
 * from functional fitness assessment inputs.
 */
export function calculateFitnessScores(assessment: {
  pushupVariation: string;
  pushupReps: number;
  squatReps: number;
  plankSeconds: number;
  mobilityScore: number; // 1 - 5
}): FitnessScores {
  // Pushup score calculation (0 - 25)
  let pushupBase = 5;
  if (assessment.pushupVariation === 'incline') pushupBase = 10;
  if (assessment.pushupVariation === 'knee') pushupBase = 14;
  if (assessment.pushupVariation === 'standard') pushupBase = 18;
  const strengthScore = Math.min(100, Math.round((pushupBase * 2.5) + (assessment.pushupReps * 2.2)));

  // Squat score for endurance (0 - 100)
  const enduranceScore = Math.min(100, Math.round(assessment.squatReps * 3.1));

  // Plank score for core (0 - 100)
  const coreScore = Math.min(100, Math.round(assessment.plankSeconds * 1.35));

  // Mobility score (0 - 100)
  const mobilityScore = Math.min(100, Math.round(assessment.mobilityScore * 20));

  // Overall combined score
  const overallScore = Math.min(100, Math.max(15, Math.round(
    (strengthScore * 0.35) + 
    (enduranceScore * 0.25) + 
    (coreScore * 0.25) + 
    (mobilityScore * 0.15)
  )));

  // Level determination
  let calculatedLevel: FitnessLevel = 'Beginner 1';
  if (overallScore >= 85) calculatedLevel = 'Advanced 2';
  else if (overallScore >= 75) calculatedLevel = 'Advanced 1';
  else if (overallScore >= 66) calculatedLevel = 'Intermediate 4';
  else if (overallScore >= 58) calculatedLevel = 'Intermediate 3';
  else if (overallScore >= 50) calculatedLevel = 'Intermediate 2';
  else if (overallScore >= 42) calculatedLevel = 'Intermediate 1';
  else if (overallScore >= 35) calculatedLevel = 'Beginner 4';
  else if (overallScore >= 28) calculatedLevel = 'Beginner 3';
  else if (overallScore >= 20) calculatedLevel = 'Beginner 2';

  return {
    overallScore,
    strengthScore: Math.min(100, strengthScore),
    enduranceScore: Math.min(100, enduranceScore),
    coreScore: Math.min(100, coreScore),
    mobilityScore: Math.min(100, mobilityScore),
    consistencyScore: 85, // starting estimate
    calculatedLevel,
    testedAt: new Date().toISOString()
  };
}

/**
 * Calculates Daily Readiness based on subjective feeling, energy rating, and muscle soreness.
 */
export function calculateDailyReadiness(
  feeling: 'poor' | 'okay' | 'good' | 'great',
  energyLevel: 1 | 2 | 3 | 4 | 5,
  muscleSoreness: 'none' | 'light' | 'moderate' | 'high'
): DailyReadiness {
  let score = 50;

  // Feeling factor
  if (feeling === 'great') score += 25;
  else if (feeling === 'good') score += 15;
  else if (feeling === 'okay') score += 5;
  else score -= 15;

  // Energy factor (1-5)
  score += (energyLevel - 3) * 6;

  // Soreness deduction
  if (muscleSoreness === 'none') score += 10;
  else if (muscleSoreness === 'light') score += 0;
  else if (muscleSoreness === 'moderate') score -= 12;
  else if (muscleSoreness === 'high') score -= 25;

  const readinessScore = Math.max(15, Math.min(98, score));

  let tier: 'HIGH READINESS' | 'MEDIUM READINESS' | 'LOW READINESS' = 'HIGH READINESS';
  let recommendation = 'Tu cuerpo está listo para rendir al máximo hoy. Continuá con tu entrenamiento programado.';

  if (readinessScore < 50) {
    tier = 'LOW READINESS';
    recommendation = 'Detectamos fatiga o molestia muscular. Hoy priorizamos movilidad articular suave, descompresión y recuperación activa.';
  } else if (readinessScore < 72) {
    tier = 'MEDIUM READINESS';
    recommendation = 'Disposición moderada. Realizaremos movimientos funcionales con volumen controlado y pausas bien aprovechadas.';
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    date: todayStr,
    feeling,
    energyLevel,
    muscleSoreness,
    readinessScore,
    tier,
    recommendation
  };
}

/**
 * Finds an exercise by ID safely with fallback
 */
export function getExerciseById(id: string): Exercise {
  const found = EXERCISE_LIBRARY.find(e => e.id === id);
  if (found) return found;
  return EXERCISE_LIBRARY[0];
}

/**
 * Suggests exercise replacement based on specific user reason
 */
export function getExerciseReplacement(
  currentExerciseId: string,
  reason: 'too_easy' | 'too_hard' | 'no_equipment' | 'pain_discomfort' | 'different',
  userProfile?: UserProfile
): { replacement: Exercise; advice: string } {
  const current = getExerciseById(currentExerciseId);

  // If exercise is part of a progression pathway
  if (current.progressionPathwayId) {
    const pathway = PROGRESSION_PATHWAYS.find(p => p.id === current.progressionPathwayId);
    if (pathway) {
      const currentIndex = pathway.stages.findIndex(s => s.exerciseId === current.id);
      
      // Need easier
      if (reason === 'too_hard' && currentIndex > 0) {
        const easierStage = pathway.stages[currentIndex - 1];
        const easierEx = getExerciseById(easierStage.exerciseId);
        return {
          replacement: easierEx,
          advice: `Ajustamos a ${easierEx.name} para mantener una técnica perfecta y cuidar tus articulaciones.`
        };
      }

      // Need harder
      if (reason === 'too_easy' && currentIndex < pathway.stages.length - 1) {
        const harderStage = pathway.stages[currentIndex + 1];
        const harderEx = getExerciseById(harderStage.exerciseId);
        return {
          replacement: harderEx,
          advice: `Avanzamos al siguiente escalón con ${harderEx.name} para darte un estímulo más desafiante.`
        };
      }
    }
  }

  if (reason === 'no_equipment') {
    const bodyweightAlt = EXERCISE_LIBRARY.find(e => 
      e.category === current.category && 
      e.id !== current.id && 
      e.equipment.includes('bodyweight')
    );
    if (bodyweightAlt) {
      return { 
        replacement: bodyweightAlt, 
        advice: `Elegimos la alternativa de peso corporal ${bodyweightAlt.name}, que no requiere ningún equipamiento.` 
      };
    }
  }

  if (reason === 'pain_discomfort') {
    const mobilityAlt = EXERCISE_LIBRARY.find(e => e.category === 'Mobility' && e.id !== current.id) || EXERCISE_LIBRARY[7];
    return {
      replacement: mobilityAlt,
      advice: `Aviso de cuidado: Descargamos la zona articular y cambiamos a movilidad suave (${mobilityAlt.name}). Si la molestia persiste, consultá a un profesional.`
    };
  }

  // General variation
  const randomAlt = EXERCISE_LIBRARY.find(e => e.category === current.category && e.id !== current.id) || EXERCISE_LIBRARY[0];
  return { 
    replacement: randomAlt, 
    advice: `Cambiamos a ${randomAlt.name} para darle frescura y variedad a tu sesión.` 
  };
}

/**
 * Builds Today's Workout dynamically based on profile, readiness, and recent feedback history.
 */
export function generateTodayWorkout(
  userProfile: UserProfile,
  readiness: DailyReadiness,
  workoutHistory: WorkoutSessionHistory[]
): Workout {
  const isLowReadiness = readiness.tier === 'LOW READINESS';

  // Check last workout feedback
  const lastSession = workoutHistory[0];
  const wasTooHard = lastSession?.feedbackRating === 'too_hard';
  const wasTooEasy = lastSession?.feedbackRating === 'too_easy';

  let title = 'Fuerza y control de cuerpo completo';
  let category: ExerciseCategory = 'Strength';
  let estimatedDuration = userProfile.preferredDurationMinutes || 28;
  let intensity: 'Light' | 'Moderate' | 'High' = 'Moderate';
  let rationale = `Calibrado para tu nivel y tu puntaje de disposición de hoy (${readiness.readinessScore}%).`;

  if (isLowReadiness || wasTooHard) {
    title = 'Recuperación activa y movilidad articular';
    category = 'Mobility';
    estimatedDuration = Math.min(20, estimatedDuration);
    intensity = 'Light';
    rationale = wasTooHard 
      ? 'Tu sesión anterior fue exigente. Hoy nos enfocamos en descomprimir articulaciones y favorecer la recuperación celular.'
      : 'Detectamos menor disposición diaria. Priorizamos descarga articular y movilidad rotacional suave.';
  } else if (wasTooEasy && readiness.tier === 'HIGH READINESS') {
    title = 'Progresión de calistenia y fuerza';
    category = 'Calisthenics';
    intensity = 'Moderate';
    rationale = 'Tus comentarios recientes mostraron gran solvencia. Hoy sumamos volumen de repeticiones y control de postura.';
  }

  // Select appropriate exercises
  let selectedExercises: WorkoutExercise[] = [];

  if (category === 'Mobility') {
    selectedExercises = [
      createWorkoutExercise('mobility-catcow', 2, 10, undefined, 30, 'Enfocate en la respiración lenta'),
      createWorkoutExercise('mobility-worlds-greatest', 2, 6, undefined, 30, 'Abrí el pecho con fluidez'),
      createWorkoutExercise('mobility-9090-hips', 2, 8, undefined, 30, 'Sentí la movilidad profunda en caderas'),
      createWorkoutExercise('core-deadbug', 2, 8, undefined, 45, 'Mantené la espalda baja bien apoyada')
    ];
  } else if (category === 'Calisthenics') {
    selectedExercises = [
      createWorkoutExercise('pushup-incline', 3, wasTooEasy ? 12 : 10, undefined, 45, 'Codos a 45 grados'),
      createWorkoutExercise('squat-air', 3, 15, undefined, 45, 'Profundidad controlada y pecho erguido'),
      createWorkoutExercise('pull-band-row', 3, 12, undefined, 45, 'Juntá escápulas al final de la tracción'),
      createWorkoutExercise('core-plank', 3, undefined, 40, 45, 'Apretá glúteos y abdomen'),
      createWorkoutExercise('glute-bridge', 3, 15, undefined, 45, 'Pausa de 1 segundo arriba')
    ];
  } else {
    // Strength default
    selectedExercises = [
      createWorkoutExercise('squat-air', 3, 12, undefined, 45, 'Ritmo constante y controlado'),
      createWorkoutExercise('pushup-incline', 3, 10, undefined, 45, 'Bajada en 2 segundos'),
      createWorkoutExercise('pull-band-row', 3, 12, undefined, 45, 'Tracción firme con espalda recta'),
      createWorkoutExercise('core-birddog', 3, 8, undefined, 30, 'Sostené 2 segundos en extensión'),
      createWorkoutExercise('glute-bridge', 3, 12, undefined, 45, 'Activación total de glúteos')
    ];
  }

  const multiplier = intensity === 'Moderate' ? 9.5 : intensity === 'Light' ? 6 : 12;
  const estimatedCalories = Math.round(estimatedDuration * multiplier);

  return {
    id: `workout-today-${Date.now()}`,
    title,
    subtitle: `${estimatedDuration} min • ${intensity === 'Light' ? 'Suave' : intensity === 'Moderate' ? 'Moderada' : 'Alta'} • ~${formatCalories(estimatedCalories)}`,
    category,
    estimatedDurationMinutes: estimatedDuration,
    intensity,
    estimatedCalories,
    rationale,
    exercises: selectedExercises,
    isQuickWorkout: false
  };
}

/**
 * Creates quick time-crunched workouts (5, 10, 15 mins)
 */
export function generateQuickWorkout(durationMinutes: 5 | 10 | 15): Workout {
  let title = 'Activación rápida de 5 minutos';
  let category: ExerciseCategory = 'Functional';
  let intensity: 'Light' | 'Moderate' | 'High' = 'Light';
  let exercises: WorkoutExercise[] = [];

  if (durationMinutes === 5) {
    title = 'Activación y movilidad express (5 min)';
    category = 'Mobility';
    intensity = 'Light';
    exercises = [
      createWorkoutExercise('mobility-catcow', 1, 10, undefined, 15, 'Fluidez y respiración'),
      createWorkoutExercise('squat-air', 1, 12, undefined, 20, 'Activación de piernas'),
      createWorkoutExercise('mobility-worlds-greatest', 1, 4, undefined, 15, 'Apertura articular')
    ];
  } else if (durationMinutes === 10) {
    title = 'Circuito funcional express (10 min)';
    category = 'Functional';
    intensity = 'Moderate';
    exercises = [
      createWorkoutExercise('squat-air', 2, 12, undefined, 30, 'Ritmo dinámico'),
      createWorkoutExercise('pushup-incline', 2, 8, undefined, 30, 'Empuje sólido'),
      createWorkoutExercise('core-deadbug', 2, 8, undefined, 30, 'Estabilidad de core'),
      createWorkoutExercise('cardio-marching-knees', 2, undefined, 30, 20, 'Elevación de pulso')
    ];
  } else {
    title = 'Core dinámico y movilidad (15 min)';
    category = 'Core';
    intensity = 'Moderate';
    exercises = [
      createWorkoutExercise('core-plank', 2, undefined, 35, 30, 'Tabla rígida'),
      createWorkoutExercise('squat-air', 2, 15, undefined, 30, 'Tren inferior activo'),
      createWorkoutExercise('pushup-incline', 2, 10, undefined, 30, 'Empuje controlado'),
      createWorkoutExercise('mobility-9090-hips', 2, 6, undefined, 30, 'Rotación de caderas'),
      createWorkoutExercise('cardio-mountain-climbers', 2, undefined, 25, 30, 'Cierre con energía')
    ];
  }

  const estimatedCalories = Math.round(durationMinutes * 9.5);

  return {
    id: `quick-${durationMinutes}-${Date.now()}`,
    title,
    subtitle: `${durationMinutes} min • ${intensity === 'Light' ? 'Suave' : 'Moderada'} • ~${formatCalories(estimatedCalories)}`,
    category,
    estimatedDurationMinutes: durationMinutes,
    intensity,
    estimatedCalories,
    rationale: `Secuencia optimizada para generar el máximo beneficio funcional en un bloque exacto de ${durationMinutes} minutos.`,
    exercises,
    isQuickWorkout: true
  };
}

/**
 * Creates custom user generated workouts
 */
export function generateCustomWorkout(params: {
  goal: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  focus: 'Full body' | 'Upper body' | 'Lower body' | 'Core' | 'Mobility';
}): Workout {
  const exercises: WorkoutExercise[] = [];
  const count = params.durationMinutes <= 15 ? 3 : params.durationMinutes <= 30 ? 5 : 7;
  const sets = params.durationMinutes <= 15 ? 2 : 3;

  if (params.focus === 'Mobility') {
    exercises.push(createWorkoutExercise('mobility-worlds-greatest', 2, 5, undefined, 30));
    exercises.push(createWorkoutExercise('mobility-catcow', 2, 10, undefined, 20));
    exercises.push(createWorkoutExercise('mobility-9090-hips', 2, 6, undefined, 30));
    if (count > 3) exercises.push(createWorkoutExercise('core-deadbug', 2, 8, undefined, 40));
  } else if (params.focus === 'Core') {
    exercises.push(createWorkoutExercise('core-deadbug', sets, 10, undefined, 45));
    exercises.push(createWorkoutExercise('core-birddog', sets, 10, undefined, 45));
    exercises.push(createWorkoutExercise('core-plank', sets, undefined, 40, 45));
    if (count > 3) exercises.push(createWorkoutExercise('core-sideplank', sets, undefined, 30, 45));
  } else if (params.focus === 'Upper body') {
    exercises.push(createWorkoutExercise('pushup-incline', sets, 10, undefined, 45));
    exercises.push(createWorkoutExercise('pull-band-row', sets, 12, undefined, 45));
    exercises.push(createWorkoutExercise('pushup-knee', sets, 8, undefined, 45));
    if (count > 3) exercises.push(createWorkoutExercise('core-plank', sets, undefined, 40, 45));
  } else if (params.focus === 'Lower body') {
    exercises.push(createWorkoutExercise('squat-air', sets, 15, undefined, 45));
    exercises.push(createWorkoutExercise('squat-split', sets, 10, undefined, 60));
    exercises.push(createWorkoutExercise('squat-chair', sets, 12, undefined, 45));
    if (count > 3) exercises.push(createWorkoutExercise('cardio-marching-knees', sets, undefined, 40, 30));
  } else {
    // Full Body default
    exercises.push(createWorkoutExercise('squat-air', sets, 12, undefined, 45));
    exercises.push(createWorkoutExercise('pushup-incline', sets, 10, undefined, 45));
    exercises.push(createWorkoutExercise('pull-band-row', sets, 12, undefined, 45));
    exercises.push(createWorkoutExercise('core-deadbug', sets, 8, undefined, 45));
    if (count > 4) exercises.push(createWorkoutExercise('core-plank', sets, undefined, 35, 45));
  }

  const estimatedCalories = Math.round(params.durationMinutes * 9.2);

  const focusLabels: Record<string, string> = {
    'Full body': 'Cuerpo completo',
    'Upper body': 'Tren superior',
    'Lower body': 'Tren inferior',
    'Core': 'Core',
    'Mobility': 'Movilidad'
  };

  const diffLabels: Record<string, string> = {
    Beginner: 'Principiante',
    Intermediate: 'Intermedio',
    Advanced: 'Avanzado'
  };

  const focusName = focusLabels[params.focus] || params.focus;
  const diffName = diffLabels[params.difficulty] || params.difficulty;

  return {
    id: `custom-${Date.now()}`,
    title: `Rutina a medida • ${focusName}`,
    subtitle: `${params.durationMinutes} min • ${diffName} • ~${formatCalories(estimatedCalories)}`,
    category: params.focus === 'Mobility' ? 'Mobility' : 'Functional',
    estimatedDurationMinutes: params.durationMinutes,
    intensity: params.difficulty === 'Advanced' ? 'High' : params.difficulty === 'Intermediate' ? 'Moderate' : 'Light',
    estimatedCalories,
    rationale: `Sesión a medida diseñada para ${focusName.toLowerCase()} con exigencia ${diffName.toLowerCase()}.`,
    exercises,
    isQuickWorkout: false
  };
}

/**
 * Builds standard 4-Week Program structure
 */
export function generateFourWeekProgram(userProfile: UserProfile): FourWeekProgram {
  return {
    id: 'program-adaptive-4wk',
    name: 'Programa de Progresión Adaptativa',
    currentWeek: 1,
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1 — Fundamentos y activación neural',
        theme: 'Fundamentos',
        description: 'Establecemos patrones de movimiento base, evaluamos tolerancia articular y consolidamos el hábito diario.',
        schedule: [
          { dayNumber: 1, dayName: 'Monday', workoutTitle: 'Fuerza de cuerpo completo y activación', category: 'Strength', durationMinutes: 28, isRestDay: false, isCompleted: false, workoutId: 'w1d1' },
          { dayNumber: 2, dayName: 'Tuesday', workoutTitle: 'Movilidad activa y cuidado de columna', category: 'Mobility', durationMinutes: 15, isRestDay: false, isCompleted: false, workoutId: 'w1d2' },
          { dayNumber: 3, dayName: 'Wednesday', workoutTitle: 'Tren superior y calibración de core', category: 'Calisthenics', durationMinutes: 25, isRestDay: false, isCompleted: false, workoutId: 'w1d3' },
          { dayNumber: 4, dayName: 'Thursday', workoutTitle: 'Recuperación activa y respiración', category: 'Recovery', durationMinutes: 15, isRestDay: true, isCompleted: false, workoutId: 'w1d4' },
          { dayNumber: 5, dayName: 'Friday', workoutTitle: 'Tren inferior y estabilidad de cadera', category: 'Strength', durationMinutes: 28, isRestDay: false, isCompleted: false, workoutId: 'w1d5' },
          { dayNumber: 6, dayName: 'Saturday', workoutTitle: 'Cardio funcional de bajo impacto', category: 'Cardio', durationMinutes: 20, isRestDay: false, isCompleted: false, workoutId: 'w1d6' },
          { dayNumber: 7, dayName: 'Sunday', workoutTitle: 'Descanso y recuperación total', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w1d7' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2 — Progresión y control de tiempo',
        theme: 'Progresión',
        description: 'Introducimos microprogresiones en la bajada lenta, aumentando el tiempo bajo tensión un 15%.',
        schedule: [
          { dayNumber: 1, dayName: 'Monday', workoutTitle: 'Carga y volumen de cuerpo completo', category: 'Strength', durationMinutes: 30, isRestDay: false, isCompleted: false, workoutId: 'w2d1' },
          { dayNumber: 2, dayName: 'Tuesday', workoutTitle: 'Movilidad profunda de cadera y tórax', category: 'Mobility', durationMinutes: 20, isRestDay: false, isCompleted: false, workoutId: 'w2d2' },
          { dayNumber: 3, dayName: 'Wednesday', workoutTitle: 'Balance de empuje y tracción', category: 'Calisthenics', durationMinutes: 28, isRestDay: false, isCompleted: false, workoutId: 'w2d3' },
          { dayNumber: 4, dayName: 'Thursday', workoutTitle: 'Descanso y caminata suave', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w2d4' },
          { dayNumber: 5, dayName: 'Friday', workoutTitle: 'Balance unilateral de tren inferior', category: 'Strength', durationMinutes: 30, isRestDay: false, isCompleted: false, workoutId: 'w2d5' },
          { dayNumber: 6, dayName: 'Saturday', workoutTitle: 'Aceleración funcional y core', category: 'Functional', durationMinutes: 25, isRestDay: false, isCompleted: false, workoutId: 'w2d6' },
          { dayNumber: 7, dayName: 'Sunday', workoutTitle: 'Descanso total', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w2d7' }
        ]
      },
      {
        weekNumber: 3,
        title: 'Semana 3 — Desafío y densidad',
        theme: 'Desafío',
        description: 'Semana de mayor exigencia: desafiamos la resistencia con descansos más cortos y variantes avanzadas.',
        schedule: [
          { dayNumber: 1, dayName: 'Monday', workoutTitle: 'Circuito de fuerza y densidad', category: 'Strength', durationMinutes: 32, isRestDay: false, isCompleted: false, workoutId: 'w3d1' },
          { dayNumber: 2, dayName: 'Tuesday', workoutTitle: 'Rotación espinal y cadena posterior', category: 'Mobility', durationMinutes: 18, isRestDay: false, isCompleted: false, workoutId: 'w3d2' },
          { dayNumber: 3, dayName: 'Wednesday', workoutTitle: 'Umbral de fuerza en calistenia', category: 'Calisthenics', durationMinutes: 30, isRestDay: false, isCompleted: false, workoutId: 'w3d3' },
          { dayNumber: 4, dayName: 'Thursday', workoutTitle: 'Caminata de descompresión articular', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w3d4' },
          { dayNumber: 5, dayName: 'Friday', workoutTitle: 'Piernas y resistencia de core', category: 'Strength', durationMinutes: 32, isRestDay: false, isCompleted: false, workoutId: 'w3d5' },
          { dayNumber: 6, dayName: 'Saturday', workoutTitle: 'Motor funcional y HIIT', category: 'HIIT', durationMinutes: 25, isRestDay: false, isCompleted: false, workoutId: 'w3d6' },
          { dayNumber: 7, dayName: 'Sunday', workoutTitle: 'Descanso y nutrición regenerativa', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w3d7' }
        ]
      },
      {
        weekNumber: 4,
        title: 'Semana 4 — Reevaluación y ajuste adaptativo',
        theme: 'Evaluación y adaptación',
        description: 'Repetimos las pruebas funcionales, medimos la curva de evolución de 4 semanas y diseñamos el siguiente ciclo.',
        schedule: [
          { dayNumber: 1, dayName: 'Monday', workoutTitle: 'Rutina de activación pre-evaluación', category: 'Functional', durationMinutes: 20, isRestDay: false, isCompleted: false, workoutId: 'w4d1' },
          { dayNumber: 2, dayName: 'Tuesday', workoutTitle: 'Chequeo integral de rango y movilidad', category: 'Mobility', durationMinutes: 20, isRestDay: false, isCompleted: false, workoutId: 'w4d2' },
          { dayNumber: 3, dayName: 'Wednesday', workoutTitle: '★ REEVALUACIÓN FÍSICA DE 4 SEMANAS', category: 'Strength', durationMinutes: 25, isRestDay: false, isCompleted: false, workoutId: 'w4d3' },
          { dayNumber: 4, dayName: 'Thursday', workoutTitle: 'Recuperación y calibración del nuevo plan', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w4d4' },
          { dayNumber: 5, dayName: 'Friday', workoutTitle: 'Entrenamiento de transición al nuevo nivel', category: 'Strength', durationMinutes: 28, isRestDay: false, isCompleted: false, workoutId: 'w4d5' },
          { dayNumber: 6, dayName: 'Saturday', workoutTitle: 'Movimiento funcional suave de celebración', category: 'Cardio', durationMinutes: 20, isRestDay: false, isCompleted: false, workoutId: 'w4d6' },
          { dayNumber: 7, dayName: 'Sunday', workoutTitle: 'Reflexión del programa y descanso', category: 'Recovery', durationMinutes: 0, isRestDay: true, isCompleted: false, workoutId: 'w4d7' }
        ]
      }
    ]
  };
}

function createWorkoutExercise(
  exerciseId: string, 
  targetSets: number, 
  targetReps?: number, 
  targetDurationSeconds?: number, 
  restSeconds: number = 45, 
  notes?: string
): WorkoutExercise {
  const ex = getExerciseById(exerciseId);
  return {
    exerciseId: ex.id,
    exerciseName: ex.name,
    targetSets,
    targetReps,
    targetDurationSeconds,
    restSeconds,
    notes,
    completedSets: 0,
    category: ex.category,
    imageUrl: ex.imageUrl
  };
}

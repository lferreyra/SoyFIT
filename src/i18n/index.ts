import { esLATAM } from '../locales/es-LATAM';
import { enUS } from '../locales/en-US';
import { ptBR } from '../locales/pt-BR';

export type SupportedLocale = 'es-LATAM' | 'en-US' | 'pt-BR';

const dictionaries: Record<SupportedLocale, typeof esLATAM> = {
  'es-LATAM': esLATAM,
  'en-US': enUS,
  'pt-BR': ptBR
};

// Default language is Latin American Spanish (es-LATAM) as specified
let activeLocale: SupportedLocale = 'es-LATAM';

export function setLocale(locale: SupportedLocale) {
  if (dictionaries[locale]) {
    activeLocale = locale;
  }
}

export function getLocale(): SupportedLocale {
  return activeLocale;
}

/**
 * Type-safe / dot-notation translation lookup
 * Example: t('home.todayWorkout') -> "Entrenamiento de hoy"
 * Example: t('workout.earnedSummary', { xp: 120, kcal: 310 })
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[activeLocale] || dictionaries['es-LATAM'];
  const keys = keyPath.split('.');
  
  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback: return last key fragment or the path itself
      return keyPath;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  if (!params) return current;

  return Object.entries(params).reduce((str, [paramKey, val]) => {
    return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
  }, current);
}

/**
 * Latin American number formatting (using '.' for thousands separator and ',' for decimal separator)
 * Example: 2000 -> "2.000"
 * Example: 72.5 -> "72,5"
 */
export function formatNumber(value: number, options?: { decimals?: number }): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  
  const decimals = options?.decimals ?? (Number.isInteger(value) ? 0 : 1);
  const fixed = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');

  // Add dots as thousand separators
  const withDots = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decimalPart && decimals > 0) {
    return `${withDots},${decimalPart}`;
  }
  return withDots;
}

/**
 * Formats calorie strings in Latin American Spanish: e.g. "2.150 kcal"
 */
export function formatCalories(kcal: number): string {
  return `${formatNumber(Math.round(kcal))} kcal`;
}

/**
 * Formats weight in Latin American Spanish: e.g. "72,5 kg" or "73 kg"
 */
export function formatWeight(kg: number): string {
  const isInt = Number.isInteger(kg);
  return `${formatNumber(kg, { decimals: isInt ? 0 : 1 })} kg`;
}

/**
 * Formats height in cm: e.g. "176 cm"
 */
export function formatHeight(cm: number): string {
  return `${formatNumber(Math.round(cm))} cm`;
}

/**
 * Formats seconds into mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Formats date into Latin American format:
 * 'short' -> '10/09/2026'
 * 'long'  -> '10 de septiembre'
 */
export function formatDate(dateInput: string | Date, style: 'short' | 'long' = 'long'): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    // If it's already a descriptive label like "Ayer" or "Hoy"
    return typeof dateInput === 'string' ? dateInput : '';
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (style === 'short') {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(day)}/${pad(month + 1)}/${year}`;
  }

  return `${day} de ${MONTH_NAMES_ES[month]}`;
}

export const CATEGORY_LABELS_ES: Record<string, string> = {
  Strength: 'Fuerza',
  Calisthenics: 'Calistenia',
  Functional: 'Funcional',
  Core: 'Core',
  Cardio: 'Cardio',
  HIIT: 'HIIT',
  Mobility: 'Movilidad',
  Recovery: 'Recuperación'
};

export const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado'
};

export const INTENSITY_LABELS_ES: Record<string, string> = {
  Light: 'Suave',
  Moderate: 'Moderada',
  High: 'Alta'
};

export const EQUIPMENT_LABELS_ES: Record<string, string> = {
  bodyweight: 'Peso corporal',
  mat: 'Colchoneta',
  resistance_bands: 'Bandas elásticas',
  dumbbells: 'Mancuernas',
  pull_up_bar: 'Barra de dominadas',
  kettlebell: 'Pesa rusa',
  bench: 'Banco o silla firme',
  full_gym: 'Gimnasio completo'
};

export const GOAL_LABELS_ES: Record<string, string> = {
  general_fitness: 'Condición física general',
  lose_fat: 'Perder grasa y tonificar',
  build_muscle: 'Ganar masa muscular',
  improve_strength: 'Aumentar fuerza',
  improve_endurance: 'Mejorar resistencia cardiovascular',
  improve_mobility: 'Mejorar movilidad y flexibilidad',
  improve_consistency: 'Construir el hábito de entrenar',
  athletic_performance: 'Rendimiento atlético funcional'
};

export const LIMITATION_LABELS_ES: Record<string, string> = {
  none: 'Sin dolores ni molestias',
  shoulder: 'Hombro',
  knee: 'Rodilla',
  back: 'Espalda / Lumbar',
  wrist: 'Muñeca',
  ankle: 'Tobillo',
  other: 'Otra articulación'
};

export const DAY_NAMES_ES: Record<string, string> = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo'
};

export const LEVEL_LABELS_ES: Record<string, string> = {
  'Beginner 1': 'Principiante 1',
  'Beginner 2': 'Principiante 2',
  'Beginner 3': 'Principiante 3',
  'Beginner 4': 'Principiante 4',
  'Intermediate 1': 'Intermedio 1',
  'Intermediate 2': 'Intermedio 2',
  'Intermediate 3': 'Intermedio 3',
  'Advanced 1': 'Avanzado 1',
  'Advanced 2': 'Avanzado 2',
  'Elite': 'Élite'
};

export function formatFitnessLevel(level: string): string {
  if (!level) return 'Principiante 1';
  return LEVEL_LABELS_ES[level] || level
    .replace('Beginner', 'Principiante')
    .replace('Intermediate', 'Intermedio')
    .replace('Advanced', 'Avanzado');
}



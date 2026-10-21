// Fotos de ejercicios por genero (2026-10-21): cada ejercicio tiene una foto en casa con una mujer y
// otra con un hombre, en public/ejercicios/<archivo>-mujer.jpg y -hombre.jpg. La app muestra la del
// genero que eligio la persona en el cuestionario; si no hay respuesta, la de mujer.

import type { Exercise } from '../types/fitness';
import { leerRespuestas } from './estado';

const ARCHIVO: Record<string, string> = {
  'pushup-wall': 'wallpushup',
  'pushup-incline': 'inclinepushup',
  'pushup-knee': 'kneepushup',
  'pushup-negative': 'negativepushup',
  'pushup-standard': 'standardpushup',
  'pushup-diamond': 'diamondpushup',
  'squat-chair': 'boxsquat',
  'squat-air': 'airsquat',
  'squat-split': 'sentadilla_split',
  'squat-bulgarian': 'bulgariansquat',
  'core-deadbug': 'deadbug',
  'core-birddog': 'birddog',
  'core-plank': 'plank',
  'core-sideplank': 'sideplank',
  'core-hollowhold': 'hollowhold',
  'pull-band-row': 'bandrow',
  'glute-bridge': 'glutebridge',
  'mobility-worlds-greatest': 'worldsgreatest',
  'mobility-catcow': 'postura_gato',
  'mobility-9090-hips': 'hip9090',
  'cardio-marching-knees': 'highknees',
  'cardio-mountain-climbers': 'mountainclimbers',
};

export type Genero = 'mujer' | 'hombre';

export const generoActual = (): Genero => (leerRespuestas().sexo === 'hombre' ? 'hombre' : 'mujer');

export const fotoArchivo = (archivo: string, genero: Genero = generoActual()) => `/ejercicios/${archivo}-${genero}.jpg`;

export function fotoEjercicio(e: Pick<Exercise, 'id' | 'imageUrl'>, genero: Genero = generoActual()): string {
  const archivo = ARCHIVO[e.id];
  return archivo ? fotoArchivo(archivo, genero) : e.imageUrl;
}

// Para las portadas que nombran la foto vieja ('/ejercicios/birddog.jpg'): devuelve la version del genero.
export function porGenero(foto: string, sexo?: string): string {
  const m = foto.match(/^\/ejercicios\/([a-z0-9_]+)\.jpg$/);
  const genero: Genero = sexo === 'hombre' ? 'hombre' : sexo === 'mujer' ? 'mujer' : generoActual();
  return m && Object.values(ARCHIVO).includes(m[1]) ? fotoArchivo(m[1], genero) : foto;
}

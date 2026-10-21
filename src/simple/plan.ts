// Arma el programa de 4 semanas a partir de las respuestas del cuestionario.
// Es determinista: las mismas respuestas dan siempre el mismo plan, asi no hace falta guardarlo.

import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { Exercise } from '../types/fitness';
import { Respuestas } from './cuestionario';

export interface Bloque {
  ejercicio: Exercise;
  series: number;
  reps?: number;
  segundos?: number;
  descanso: number;
}

export interface Sesion {
  id: string; // s1d2 = semana 1, dia 2
  semana: number;
  dia: number;
  titulo: string;
  minutos: number;
  calentamiento: Bloque[];
  principal: Bloque[];
}

export interface Plan {
  nivel: 1 | 2 | 3;
  nombreNivel: string;
  dias: number;
  minutos: number;
  semanas: { numero: number; tema: string; sesiones: Sesion[] }[];
}

const porId = (id: string) => EXERCISE_LIBRARY.find(e => e.id === id)!;

// Escalones de cada progresion, del mas facil al mas dificil.
const EMPUJE = ['pushup-wall', 'pushup-incline', 'pushup-knee', 'pushup-negative', 'pushup-standard', 'pushup-diamond'];
const PIERNAS = ['squat-chair', 'squat-air', 'squat-split', 'squat-bulgarian'];
const CORE = ['core-deadbug', 'core-birddog', 'core-plank', 'core-sideplank', 'core-hollowhold'];

// Donde arranca cada nivel dentro de cada progresion.
const INICIO: Record<1 | 2 | 3, { empuje: number; piernas: number; core: number }> = {
  1: { empuje: 0, piernas: 0, core: 0 },
  2: { empuje: 2, piernas: 1, core: 1 },
  3: { empuje: 4, piernas: 2, core: 3 },
};

const TEMAS = [
  'Aprender la técnica',
  'Sumar repeticiones',
  'Subir un escalón',
  'Consolidar',
];

export function nivelDesdeRespuestas(r: Respuestas): 1 | 2 | 3 {
  if (r.flexiones === '15+') return 3;
  if (r.flexiones === '6-15') return 2;
  return 1;
}

export const NOMBRE_NIVEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' } as const;

function escalon(lista: string[], inicio: number, semana: number, tope = lista.length - 1): Exercise {
  // Las semanas 3 y 4 suben un escalon en cada progresion.
  const subida = semana >= 3 ? 1 : 0;
  return porId(lista[Math.min(inicio + subida, tope)]);
}

// Con una molestia, la progresion afectada no pasa de un escalon de bajo impacto:
// rodillas hasta la sentadilla libre (sin zancadas ni bulgara), hombros y munecas hasta
// la flexion con rodillas apoyadas.
export function topes(r: Respuestas) {
  const m = r.molestias ?? [];
  return {
    piernas: m.includes('rodilla') ? 1 : PIERNAS.length - 1,
    empuje: m.includes('hombro') || m.includes('muneca') ? 2 : EMPUJE.length - 1,
  };
}

function bloque(e: Exercise, semana: number, cortas: boolean): Bloque {
  const series = cortas ? 2 : e.defaultSets;
  // Semana 2 y 4 suman volumen sobre el escalon en el que esten.
  const extra = semana % 2 === 0 ? 2 : 0;
  return {
    ejercicio: e,
    series,
    reps: e.defaultReps ? e.defaultReps + extra : undefined,
    segundos: e.defaultDurationSeconds ? e.defaultDurationSeconds + extra * 5 : undefined,
    descanso: e.defaultRestSeconds,
  };
}

function calentamiento(dia: number): Bloque[] {
  const mov = dia % 2 === 0 ? 'mobility-9090-hips' : 'mobility-worlds-greatest';
  return [
    { ejercicio: porId('mobility-catcow'), series: 1, reps: 10, descanso: 10 },
    { ejercicio: porId(mov), series: 1, reps: 6, descanso: 10 },
    { ejercicio: porId('cardio-marching-knees'), series: 1, segundos: 45, descanso: 15 },
  ];
}

export function armarPlan(r: Respuestas): Plan {
  const nivel = nivelDesdeRespuestas(r);
  const dias = r.dias ?? 3;
  const minutos = r.minutos ?? 20;
  const cortas = minutos <= 15;
  const inicio = INICIO[nivel];
  const tope = topes(r);

  const semanas = [1, 2, 3, 4].map(semana => {
    const empuje = escalon(EMPUJE, Math.min(inicio.empuje, tope.empuje), semana, tope.empuje);
    const piernas = escalon(PIERNAS, Math.min(inicio.piernas, tope.piernas), semana, tope.piernas);
    const core = escalon(CORE, inicio.core, semana);

    // Tres tipos de dia que se van rotando.
    const tipos = [
      { titulo: 'Empuje y core', ejercicios: [empuje, core, porId('glute-bridge'), porId('core-birddog')] },
      { titulo: 'Piernas y glúteos', ejercicios: [piernas, porId('glute-bridge'), core, porId('cardio-mountain-climbers')] },
      { titulo: 'Cuerpo completo', ejercicios: [empuje, piernas, core, porId('cardio-mountain-climbers')] },
    ];

    const sesiones: Sesion[] = Array.from({ length: dias }, (_, i) => {
      const tipo = tipos[i % tipos.length];
      const cantidad = minutos >= 30 ? 4 : 3;
      let lista = tipo.ejercicios.slice(0, cantidad);
      if (r.objetivo === 'bajar_grasa' && !lista.some(e => e.id === 'cardio-mountain-climbers')) {
        lista = [...lista.slice(0, cantidad - 1), porId('cardio-mountain-climbers')];
      }
      // Sin repetir el mismo ejercicio dentro de una sesion.
      lista = lista.filter((e, j) => lista.findIndex(x => x.id === e.id) === j);
      return {
        id: `s${semana}d${i + 1}`,
        semana,
        dia: i + 1,
        titulo: tipo.titulo,
        minutos,
        calentamiento: calentamiento(i + 1),
        principal: lista.map(e => bloque(e, semana, cortas)),
      };
    });

    return { numero: semana, tema: TEMAS[semana - 1], sesiones };
  });

  return { nivel, nombreNivel: NOMBRE_NIVEL[nivel], dias, minutos, semanas };
}

export function proximaSesion(plan: Plan, completadas: string[]): Sesion | null {
  for (const s of plan.semanas) {
    for (const ses of s.sesiones) {
      if (!completadas.includes(ses.id)) return ses;
    }
  }
  return null;
}

export function textoCarga(b: Bloque): string {
  const cuanto = b.segundos ? `${b.segundos} seg` : `${b.reps} reps`;
  return b.series > 1 ? `${b.series} × ${cuanto}` : cuanto;
}

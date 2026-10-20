// Que se vende y donde se cobra. Precios, nombres y links de pago los define el dueno:
// mientras un link este vacio, el boton muestra "Link de pago pendiente".

import { Dieta } from './cuestionario';

export type ProductoId =
  | 'programa'
  | 'recetario_omnivoro'
  | 'recetario_vegetariano'
  | 'recetario_vegano'
  | 'recetario_proteico'
  | 'movilidad'
  | 'habitos'
  | 'plan_comidas'
  | 'avanzado'
  | 'desafio14';

export interface Producto {
  id: ProductoId;
  tipo: 'principal' | 'bono' | 'upsell';
  nombre: string;
  resumen: string;
  precio: string; // texto tal cual se muestra; vacio = pendiente
  linkPago: string; // checkout de la plataforma de cobro; vacio = pendiente
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'programa',
    tipo: 'principal',
    nombre: 'Programa Kalisfy de 4 semanas',
    resumen: 'Rutina de calistenia en casa armada para tu nivel, con temporizador y avance semana a semana.',
    precio: '',
    linkPago: '',
  },
  // Los 4 recetarios son bonos separados (decision del dueno, 2026-10-19). Cantidades
  // contadas en public/recetas.json el 2026-10-20.
  {
    id: 'recetario_omnivoro',
    tipo: 'bono',
    nombre: 'Recetario Como de Todo',
    resumen: 'Más de 1.800 recetas sin azúcar y sin gluten para todos los días, con ingredientes y paso a paso.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'recetario_vegetariano',
    tipo: 'bono',
    nombre: 'Recetario Vegetariano',
    resumen: 'Más de 1.700 recetas vegetarianas sin azúcar y sin gluten.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'recetario_vegano',
    tipo: 'bono',
    nombre: 'Recetario Vegano',
    resumen: 'Más de 1.100 recetas veganas sin azúcar y sin gluten.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'recetario_proteico',
    tipo: 'bono',
    nombre: 'Recetario Alto en Proteína',
    resumen: 'Recetas altas en proteína escritas para acompañar el entrenamiento, con ingredientes de todos los días.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'movilidad',
    tipo: 'bono',
    nombre: 'Movilidad de 10 minutos',
    resumen: 'Una rutina corta para los días de descanso o para arrancar la mañana.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'habitos',
    tipo: 'bono',
    nombre: 'Guía de hábitos',
    resumen: 'Agua, sueño y pasos: lo mínimo que acompaña al entrenamiento.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'plan_comidas',
    tipo: 'upsell',
    nombre: 'Plan de comidas semanal',
    resumen: 'Qué comer cada día de la semana, con porciones.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'avanzado',
    tipo: 'upsell',
    nombre: 'Nivel avanzado',
    resumen: 'Dominadas, fondos y flexiones diamante para cuando terminás las 4 semanas.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'desafio14',
    tipo: 'upsell',
    nombre: 'Desafío de 14 días',
    resumen: 'Dos semanas enfocadas en abdomen y glúteos.',
    precio: '',
    linkPago: '',
  },
];

export const RECETARIO_DE: Record<Dieta, ProductoId> = {
  omnivoro: 'recetario_omnivoro',
  vegetariano: 'recetario_vegetariano',
  vegano: 'recetario_vegano',
  proteico: 'recetario_proteico',
};

export const RECETARIOS: ProductoId[] = Object.values(RECETARIO_DE);

// Los bonos vienen con el programa: quien compro el principal los tiene.
// Movilidad y habitos siguen como bonos hasta que el dueno decida si quedan.
export const BONOS_DEL_PROGRAMA: ProductoId[] = [...RECETARIOS, 'movilidad', 'habitos'];

export function producto(id: ProductoId): Producto {
  return PRODUCTOS.find(p => p.id === id)!;
}

export function linkDePago(id: ProductoId, email?: string, nombre?: string): string {
  const base = producto(id).linkPago;
  if (!base) return '';
  const url = new URL(base);
  if (email) url.searchParams.set('email', email);
  if (nombre) url.searchParams.set('name', nombre);
  return url.toString();
}

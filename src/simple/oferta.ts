// Que se vende y donde se cobra. Precios, nombres y links de pago los define el dueno:
// mientras un link este vacio, el boton muestra "Link de pago pendiente".

export type ProductoId =
  | 'programa'
  | 'recetario'
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
    nombre: 'Programa SoyFit de 4 semanas',
    resumen: 'Rutina de calistenia en casa armada para tu nivel, con temporizador y avance semana a semana.',
    precio: '',
    linkPago: '',
  },
  {
    id: 'recetario',
    tipo: 'bono',
    nombre: 'Recetario según tu alimentación',
    resumen: 'Recetas simples para tu tipo de dieta, con ingredientes y paso a paso.',
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

// Los bonos vienen con el programa: quien compro el principal los tiene.
export const BONOS_DEL_PROGRAMA: ProductoId[] = ['recetario', 'movilidad', 'habitos'];

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

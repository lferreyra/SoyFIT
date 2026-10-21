// Recetario (public/recetas.json, sacado del PDF "+2000 Recetas Para Comer Bien", modulo 6).
// La dieta, la dificultad de conseguir ingredientes y la simplicidad se marcaron por
// palabras clave al importarlas: son aproximadas.

import { useEffect, useState } from 'react';
import { Dieta } from './cuestionario';

export type Categoria = 'desayuno' | 'almuerzo' | 'cena' | 'snack' | 'dulce';

export interface Receta {
  c: Categoria;
  n: string; // nombre
  t: string; // preparacion
  d: Dieta; // la dieta mas restrictiva para la que sirve
  x: 0 | 1; // 1 = lleva algo dificil o caro de conseguir en Argentina (mango, tahini, tofu...)
  s: 0 | 1; // 1 = simple: ingredientes faciles, pocos y preparacion corta
  p: 0 | 1; // 1 = del recetario alto en proteina (escrito para Kalisfy, scripts/recetas-proteicas.json)
  f?: 1; // 1 = tiene foto en public/recetas/<slug>.jpg (por ahora, las de las 2 primeras semanas del menu)
}

export function slugReceta(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const fotoReceta = (r: Receta) => (r.f ? `/recetas/${slugReceta(r.n)}.jpg` : null);

// El menu sigue la semana del programa de cada persona (semana 1 desde el dia que entra por
// primera vez), no la del calendario: asi las 2 primeras semanas son siempre las mismas recetas.
const CLAVE_INICIO = 'kalisfy_inicio_menu';
const DIA = 86400000;

function inicioDelMenu(): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  try {
    const guardado = Number(localStorage.getItem(CLAVE_INICIO));
    if (guardado > 0) return guardado;
    localStorage.setItem(CLAVE_INICIO, String(hoy.getTime()));
  } catch {}
  return hoy.getTime();
}

export function semanaDelPrograma(fecha = new Date()): number {
  return Math.max(0, Math.floor((fecha.getTime() - inicioDelMenu()) / (7 * DIA)));
}

export const CATEGORIAS: { id: Categoria; nombre: string }[] = [
  { id: 'desayuno', nombre: 'Desayunos' },
  { id: 'almuerzo', nombre: 'Almuerzos' },
  { id: 'cena', nombre: 'Cenas' },
  { id: 'snack', nombre: 'Snacks' },
  { id: 'dulce', nombre: 'Dulces' },
];

export const NOMBRE_DIETA: Record<Dieta, string> = {
  omnivoro: 'Como de todo',
  vegetariano: 'Vegetariana',
  vegano: 'Vegana',
  proteico: 'Alta en proteína',
};

let cache: Receta[] | null = null;

export function useRecetas(): Receta[] | null {
  const [recetas, setRecetas] = useState<Receta[] | null>(cache);
  useEffect(() => {
    if (cache) return;
    fetch('/recetas.json')
      .then(r => r.json())
      .then((data: Receta[]) => {
        cache = data;
        setRecetas(data);
      })
      .catch(() => setRecetas([]));
  }, []);
  return recetas;
}

export function aptaPara(receta: Receta, dieta: Dieta): boolean {
  if (dieta === 'proteico') return receta.p === 1;
  if (dieta === 'vegano') return receta.d === 'vegano';
  if (dieta === 'vegetariano') return receta.d !== 'omnivoro';
  return true;
}

// Menu de la semana del programa: no repite dentro de la semana y cambia cada semana.
export function menuSemanal(recetas: Receta[], dieta: Dieta, fecha = new Date()) {
  const semana = semanaDelPrograma(fecha);
  const desde = inicioDelMenu() + semana * 7 * DIA;
  // El menu usa solo recetas simples con ingredientes faciles de conseguir.
  const por = (c: Categoria) => recetas.filter(r => r.c === c && r.s === 1 && aptaPara(r, dieta));
  const momentos: { c: Categoria; nombre: string }[] = [
    { c: 'desayuno', nombre: 'Desayuno' },
    { c: 'almuerzo', nombre: 'Almuerzo' },
    { c: 'snack', nombre: 'Merienda' },
    { c: 'cena', nombre: 'Cena' },
  ];
  const nombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hoy = new Date(fecha);
  hoy.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => ({
    dia: nombres[new Date(desde + i * DIA).getDay()],
    hoy: desde + i * DIA === hoy.getTime(),
    semana: semana + 1,
    comidas: momentos.map(m => {
      const lista = por(m.c);
      return { momento: m.nombre, receta: lista[(semana * 7 + i) % lista.length] };
    }),
  }));
}

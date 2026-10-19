// Recetario (public/recetas.json, sacado del PDF "+2000 Recetas Para Comer Bien", modulo 6).
// La dieta de cada receta se marco por palabras clave al importarlas: es aproximada.

import { useEffect, useState } from 'react';
import { Dieta } from './cuestionario';

export type Categoria = 'desayuno' | 'almuerzo' | 'cena' | 'snack' | 'dulce';

export interface Receta {
  c: Categoria;
  n: string; // nombre
  t: string; // preparacion
  d: Dieta; // la dieta mas restrictiva para la que sirve
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
  if (dieta === 'vegano') return receta.d === 'vegano';
  if (dieta === 'vegetariano') return receta.d !== 'omnivoro';
  return true;
}

// Menu de la semana: cambia cada semana del ano y no repite dentro de la semana.
export function menuSemanal(recetas: Receta[], dieta: Dieta, fecha = new Date()) {
  const inicioAno = new Date(fecha.getFullYear(), 0, 1);
  const semana = Math.floor((fecha.getTime() - inicioAno.getTime()) / (7 * 86400000));
  const por = (c: Categoria) => recetas.filter(r => r.c === c && aptaPara(r, dieta));
  const momentos: { c: Categoria; nombre: string }[] = [
    { c: 'desayuno', nombre: 'Desayuno' },
    { c: 'almuerzo', nombre: 'Almuerzo' },
    { c: 'snack', nombre: 'Merienda' },
    { c: 'cena', nombre: 'Cena' },
  ];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias.map((dia, i) => ({
    dia,
    comidas: momentos.map(m => {
      const lista = por(m.c);
      return { momento: m.nombre, receta: lista[(semana * 7 + i) % lista.length] };
    }),
  }));
}

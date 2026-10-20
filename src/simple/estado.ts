// Estado de la version simple: respuestas del cuestionario y avance en el navegador,
// compras en Firestore (coleccion compras/{email}, que solo escribe el servidor).

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Respuestas } from './cuestionario';
import { BONOS_DEL_PROGRAMA, ProductoId, PRODUCTOS, RECETARIOS } from './oferta';

const CLAVE_RESPUESTAS = 'soyfit_respuestas';
const ADMIN = 'lucas.ferreyra@gmail.com';

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {}
}

export const leerRespuestas = () => leer<Respuestas>(CLAVE_RESPUESTAS, {});
export const guardarRespuestas = (r: Respuestas) => escribir(CLAVE_RESPUESTAS, r);

const claveAvance = (uid: string) => `soyfit_completadas_${uid}`;
export const leerCompletadas = (uid: string) => leer<string[]>(claveAvance(uid), []);
export const guardarCompletadas = (uid: string, ids: string[]) => escribir(claveAvance(uid), ids);

// Vista previa sin login ni compra: solo existe corriendo en local (npm run dev).
export const esVistaPrevia = () =>
  (import.meta as any).env?.DEV && new URLSearchParams(location.search).has('preview');

export function useUsuario() {
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUsuario), []);
  return usuario; // undefined = todavia cargando
}

export async function leerCompras(usuario: User): Promise<ProductoId[]> {
  const email = (usuario.email || '').toLowerCase();
  if (email === ADMIN) return PRODUCTOS.map(p => p.id);
  if (!email) return [];
  try {
    const snap = await getDoc(doc(db, 'compras', email));
    let productos = (snap.exists() ? snap.data().productos : []) as string[];
    // Compras viejas con el recetario unico: equivalen a los 4 recetarios.
    if (productos.includes('recetario')) productos = [...productos.filter(p => p !== 'recetario'), ...RECETARIOS];
    const ids = productos as ProductoId[];
    return ids.includes('programa') ? [...new Set([...ids, ...BONOS_DEL_PROGRAMA])] : ids;
  } catch {
    return [];
  }
}

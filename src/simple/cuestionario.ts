// Preguntas del cuestionario de entrada. Cada respuesta se usa para armar el plan
// (ver plan.ts); las que no cambian el plan estan para que la persona se vea reflejada.

export type Sexo = 'mujer' | 'hombre';
export type Edad = '18-25' | '26-35' | '36-45' | '46+';
export type Objetivo = 'bajar_grasa' | 'tonificar' | 'ganar_musculo' | 'fuerza';
export type Flexiones = '0' | '1-5' | '6-15' | '15+';
export type Lugar = 'casa' | 'plaza' | 'ambos';
export type Dieta = 'omnivoro' | 'vegetariano' | 'vegano' | 'proteico';

export interface Respuestas {
  sexo?: Sexo;
  edad?: Edad;
  objetivo?: Objetivo;
  cuerpo?: string;
  flexiones?: Flexiones;
  dias?: 3 | 4 | 5;
  minutos?: 15 | 20 | 30;
  lugar?: Lugar;
  dieta?: Dieta;
  alturaCm?: number;
  pesoKg?: number;
  nombre?: string;
  email?: string;
}

export interface Opcion {
  valor: string | number;
  texto: string;
  detalle?: string;
}

export type Paso =
  | { tipo: 'opciones'; campo: keyof Respuestas; titulo: string; subtitulo?: string; opciones: Opcion[] }
  | { tipo: 'dato'; titulo: string; texto: string }
  | { tipo: 'medidas'; titulo: string }
  | { tipo: 'contacto'; titulo: string; subtitulo: string };

export const PASOS: Paso[] = [
  {
    tipo: 'opciones',
    campo: 'sexo',
    titulo: 'Plan de calistenia en casa',
    subtitulo: 'Respondé 1 minuto de preguntas y armamos tu rutina. Para empezar, ¿sos...?',
    opciones: [
      { valor: 'mujer', texto: 'Mujer' },
      { valor: 'hombre', texto: 'Hombre' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'edad',
    titulo: '¿Cuántos años tenés?',
    opciones: [
      { valor: '18-25', texto: '18 a 25' },
      { valor: '26-35', texto: '26 a 35' },
      { valor: '36-45', texto: '36 a 45' },
      { valor: '46+', texto: '46 o más' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'objetivo',
    titulo: '¿Qué querés lograr?',
    opciones: [
      { valor: 'bajar_grasa', texto: 'Bajar grasa' },
      { valor: 'tonificar', texto: 'Tonificar y marcar' },
      { valor: 'ganar_musculo', texto: 'Ganar músculo' },
      { valor: 'fuerza', texto: 'Ganar fuerza y agilidad' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'cuerpo',
    titulo: '¿Cómo describirías tu cuerpo hoy?',
    opciones: [
      { valor: 'delgado', texto: 'Delgado' },
      { valor: 'promedio', texto: 'Promedio' },
      { valor: 'algo_de_panza', texto: 'Con algo de panza' },
      { valor: 'sobrepeso', texto: 'Con unos kilos de más' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'flexiones',
    titulo: '¿Cuántas flexiones seguidas podés hacer?',
    subtitulo: 'Con esto elegimos desde qué nivel arrancás.',
    opciones: [
      { valor: '0', texto: 'Ninguna todavía' },
      { valor: '1-5', texto: 'Entre 1 y 5' },
      { valor: '6-15', texto: 'Entre 6 y 15' },
      { valor: '15+', texto: 'Más de 15' },
    ],
  },
  {
    tipo: 'dato',
    titulo: 'No necesitás ir al gimnasio',
    texto: 'La calistenia usa el peso de tu cuerpo. Cada ejercicio tiene una versión más fácil y una más difícil, así que siempre hay un punto de partida para vos.',
  },
  {
    tipo: 'opciones',
    campo: 'dias',
    titulo: '¿Cuántos días por semana podés entrenar?',
    opciones: [
      { valor: 3, texto: '3 días' },
      { valor: 4, texto: '4 días' },
      { valor: 5, texto: '5 días' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'minutos',
    titulo: '¿Cuánto tiempo tenés cada vez?',
    opciones: [
      { valor: 15, texto: '10 a 15 minutos' },
      { valor: 20, texto: '20 minutos' },
      { valor: 30, texto: '30 minutos' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'lugar',
    titulo: '¿Dónde vas a entrenar?',
    opciones: [
      { valor: 'casa', texto: 'En casa' },
      { valor: 'plaza', texto: 'En una plaza o parque' },
      { valor: 'ambos', texto: 'Un poco y un poco' },
    ],
  },
  {
    tipo: 'opciones',
    campo: 'dieta',
    titulo: '¿Cómo comés?',
    subtitulo: 'Todas las recetas son sin azúcar y sin gluten.',
    opciones: [
      { valor: 'omnivoro', texto: 'Como de todo' },
      { valor: 'vegetariano', texto: 'Vegetariano' },
      { valor: 'vegano', texto: 'Vegano' },
      { valor: 'proteico', texto: 'Alto en proteína' },
    ],
  },
  { tipo: 'medidas', titulo: 'Tu altura y tu peso' },
  {
    tipo: 'contacto',
    titulo: '¿A dónde te mandamos tu plan?',
    subtitulo: 'Con este mail vas a entrar a la app.',
  },
];

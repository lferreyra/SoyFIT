// Preguntas del cuestionario de entrada. Cada respuesta se usa para armar el plan
// (ver plan.ts) o para que la persona se vea reflejada: las de dolor (ultima vez que se
// sintio bien, escaleras, energia, frenos, sueno, habitos) vuelven en el resultado como
// "lo que nos contaste" y como se resuelve cada una.

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
  cuerpoMeta?: string;
  ultimaVez?: string;
  zonas?: string[];
  flexiones?: Flexiones;
  escaleras?: string;
  dia?: string;
  energia?: string;
  molestias?: string[];
  frenos?: string[];
  dias?: 3 | 4 | 5;
  minutos?: 15 | 20 | 30;
  lugar?: Lugar;
  sueno?: string;
  habitos?: string[];
  dieta?: Dieta;
  alturaCm?: number;
  pesoKg?: number;
  pesoMetaKg?: number;
  arranque?: string;
  nombre?: string;
  email?: string;
}

export interface Opcion {
  valor: string | number;
  texto: string;
  textoHombre?: string; // cuando el texto cambia con el genero
  detalle?: string;
  icono?: string; // nombre de un icono de lucide (ver ICONOS en Embudo.tsx)
  exclusiva?: boolean; // en las de eleccion multiple, "Ninguna" desmarca el resto
}

export type Seccion = 'Vos' | 'Tu cuerpo' | 'Tu día' | 'Hábitos' | 'Tu plan';

type Texto = string | ((r: Respuestas) => string);

export type Paso =
  | { tipo: 'opciones'; seccion: Seccion; campo: keyof Respuestas; titulo: Texto; subtitulo?: Texto; opciones: Opcion[]; multiple?: boolean }
  | { tipo: 'dato'; seccion: Seccion; titulo: Texto; texto: Texto; cifra?: Texto; cifraTexto?: Texto; foto: string }
  | { tipo: 'medidas'; seccion: Seccion; titulo: string; subtitulo: string }
  | { tipo: 'contacto'; seccion: Seccion; titulo: Texto; subtitulo: string };

export const resolver = (t: Texto | undefined, r: Respuestas) => (typeof t === 'function' ? t(r) : t ?? '');
export const textoOpcion = (o: Opcion, r: Respuestas) => (r.sexo === 'hombre' && o.textoHombre ? o.textoHombre : o.texto);
const g = (r: Respuestas, mujer: string, hombre: string) => (r.sexo === 'hombre' ? hombre : mujer);

export const PASOS: Paso[] = [
  {
    tipo: 'opciones',
    seccion: 'Vos',
    campo: 'sexo',
    titulo: 'Para empezar, ¿sos…?',
    subtitulo: 'Un minuto de preguntas y armamos tu rutina.',
    opciones: [
      { valor: 'mujer', texto: 'Mujer' },
      { valor: 'hombre', texto: 'Hombre' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Vos',
    campo: 'edad',
    titulo: '¿Cuántos años tenés?',
    subtitulo: 'El plan se ajusta a tu edad.',
    opciones: [
      { valor: '18-25', texto: '18 a 25' },
      { valor: '26-35', texto: '26 a 35' },
      { valor: '36-45', texto: '36 a 45' },
      { valor: '46+', texto: '46 o más' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Vos',
    campo: 'objetivo',
    titulo: '¿Qué querés lograr?',
    opciones: [
      { valor: 'bajar_grasa', texto: 'Bajar grasa', icono: 'flame' },
      { valor: 'tonificar', texto: 'Tonificar y marcar', icono: 'sparkles' },
      { valor: 'ganar_musculo', texto: 'Ganar músculo', icono: 'dumbbell' },
      { valor: 'fuerza', texto: 'Ganar fuerza y agilidad', icono: 'zap' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'cuerpo',
    titulo: '¿Cómo describirías tu cuerpo hoy?',
    subtitulo: 'Sin juzgar: es solo el punto de partida.',
    opciones: [
      { valor: 'delgado', texto: 'Delgada', textoHombre: 'Delgado' },
      { valor: 'promedio', texto: 'Promedio' },
      { valor: 'algo_de_panza', texto: 'Con algo de panza' },
      { valor: 'sobrepeso', texto: 'Con unos kilos de más' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'cuerpoMeta',
    titulo: '¿Y cómo te querés ver?',
    opciones: [
      { valor: 'liviano', texto: 'Más liviana', textoHombre: 'Más liviano', detalle: 'Bajar grasa sin perder forma' },
      { valor: 'tonificado', texto: 'Tonificada', textoHombre: 'Tonificado', detalle: 'Firme y con definición' },
      { valor: 'atletico', texto: 'Atlética', textoHombre: 'Atlético', detalle: 'Fuerte, ágil, que se note que entrenás' },
      { valor: 'fuerte', texto: 'Más fuerte', detalle: 'Poder con tu propio cuerpo' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'ultimaVez',
    titulo: '¿Cuánto hace que no te sentís bien con tu cuerpo?',
    opciones: [
      { valor: 'menos_1', texto: 'Menos de un año' },
      { valor: '1_3', texto: 'Entre 1 y 3 años' },
      { valor: 'mas_3', texto: 'Más de 3 años' },
      { valor: 'nunca', texto: 'Nunca me sentí del todo bien' },
      { valor: 'bien', texto: 'Hoy me siento bien, quiero más' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'zonas',
    multiple: true,
    titulo: '¿Qué zonas querés trabajar?',
    subtitulo: 'Elegí todas las que quieras.',
    opciones: [
      { valor: 'abdomen', texto: 'Abdomen' },
      { valor: 'gluteos', texto: 'Glúteos' },
      { valor: 'piernas', texto: 'Piernas' },
      { valor: 'brazos', texto: 'Brazos' },
      { valor: 'espalda', texto: 'Espalda y postura' },
      { valor: 'pecho', texto: 'Pecho' },
      { valor: 'todo', texto: 'Todo el cuerpo', exclusiva: true },
    ],
  },
  {
    tipo: 'dato',
    seccion: 'Tu cuerpo',
    foto: '/ejercicios/deadbug.jpg',
    titulo: r =>
      r.ultimaVez === 'mas_3' || r.ultimaVez === 'nunca'
        ? 'No es falta de voluntad'
        : r.ultimaVez === 'bien'
          ? 'Buen punto de partida'
          : 'Estás a tiempo',
    texto: r =>
      r.ultimaVez === 'mas_3' || r.ultimaVez === 'nunca'
        ? 'Casi siempre es un plan que no era para vos: demasiado difícil, demasiado largo o sin un orden claro. Por eso el tuyo arranca exactamente en tu nivel y sube de a un escalón.'
        : r.ultimaVez === 'bien'
          ? 'Con una base, la calistenia te lleva al siguiente nivel: cada ejercicio tiene una versión más difícil esperándote.'
          : 'Cuanto antes retomás, más rápido vuelve el cuerpo. Tu plan arranca suave la primera semana y después sube.',
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
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
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'escaleras',
    titulo: '¿Cómo llegás después de subir dos pisos por escalera?',
    opciones: [
      { valor: 'sin_aire', texto: 'Sin aire, me cuesta hablar', icono: 'wind' },
      { valor: 'algo', texto: 'Un poco agitada, pero bien', textoHombre: 'Un poco agitado, pero bien', icono: 'activity' },
      { valor: 'bien', texto: 'Sin problema', icono: 'check' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu cuerpo',
    campo: 'molestias',
    multiple: true,
    titulo: '¿Tenés alguna molestia?',
    subtitulo: 'Así elegimos variantes que te cuiden.',
    opciones: [
      { valor: 'rodilla', texto: 'Rodillas' },
      { valor: 'espalda', texto: 'Espalda baja' },
      { valor: 'hombro', texto: 'Hombros' },
      { valor: 'muneca', texto: 'Muñecas' },
      { valor: 'ninguna', texto: 'Ninguna', exclusiva: true },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu día',
    campo: 'dia',
    titulo: '¿Cómo es un día normal tuyo?',
    opciones: [
      { valor: 'sentado', texto: 'Casi todo el día sentada', textoHombre: 'Casi todo el día sentado', icono: 'armchair' },
      { valor: 'de_pie', texto: 'Mucho tiempo de pie', icono: 'footprints' },
      { valor: 'movimiento', texto: 'Me muevo bastante', icono: 'bike' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu día',
    campo: 'energia',
    titulo: '¿Cómo está tu energía durante el día?',
    opciones: [
      { valor: 'baja', texto: 'Ando cansada casi todo el día', textoHombre: 'Ando cansado casi todo el día', icono: 'battery-low' },
      { valor: 'bajon', texto: 'Tengo un bajón después de comer', icono: 'battery-medium' },
      { valor: 'alta', texto: 'Bien, estable', icono: 'battery-full' },
    ],
  },
  {
    tipo: 'dato',
    seccion: 'Tu día',
    foto: '/ejercicios/birddog.jpg',
    titulo: r => (r.energia === 'alta' ? 'Esa energía, bien usada' : 'Moverte te da energía, no te la saca'),
    texto: r =>
      r.dia === 'sentado'
        ? 'Pasar el día sentado apaga el cuerpo. Sesiones cortas de fuerza con tu propio peso lo despiertan: te movés mejor y con menos rigidez, sin quedar sin pilas.'
        : 'Entrenar fuerza con tu propio peso mejora cómo te movés en el día a día, sin quedar sin pilas.',
    cifra: '15',
    cifraTexto: 'minutos alcanzan para una sesión completa',
  },
  {
    tipo: 'opciones',
    seccion: 'Tu día',
    campo: 'frenos',
    multiple: true,
    titulo: 'Las otras veces, ¿qué te frenó?',
    subtitulo: 'Elegí todas las que te pasaron.',
    opciones: [
      { valor: 'tiempo', texto: 'No me daba el tiempo' },
      { valor: 'no_se', texto: 'No sabía qué hacer ni cómo' },
      { valor: 'dejo', texto: 'Arranco con todo y a las dos semanas lo dejo' },
      { valor: 'aburre', texto: 'Me aburro de hacer siempre lo mismo' },
      { valor: 'gym', texto: 'El gimnasio me queda lejos o es caro' },
      { valor: 'resultados', texto: 'No veía resultados' },
      { valor: 'primera', texto: 'Es mi primera vez', exclusiva: true },
    ],
  },
  {
    tipo: 'dato',
    seccion: 'Tu día',
    foto: '/ejercicios/postura_gato.jpg',
    titulo: r => (r.frenos?.includes('dejo') ? 'Esta vez no depende de las ganas' : 'Lo armamos para que lo sostengas'),
    texto: r => {
      const f = r.frenos ?? [];
      if (f.includes('dejo')) return 'Abrís la app y ya sabés qué toca hoy. Sesiones cortas, un avance que se ve y cada semana un desafío nuevo: así se sostiene más allá de la segunda semana.';
      if (f.includes('no_se')) return 'Cada ejercicio viene con foto, explicación y temporizador. No tenés que pensar nada: abrís, le das play y seguís.';
      if (f.includes('tiempo')) return 'Elegís cuántos días y cuántos minutos. El plan entra en tu semana, no al revés.';
      return 'Sin gimnasio, sin equipos y con un plan que sube de a poco: lo que hace falta para empezar y no frenar.';
    },
  },
  {
    tipo: 'opciones',
    seccion: 'Tu día',
    campo: 'dias',
    titulo: '¿Cuántos días por semana podés entrenar?',
    opciones: [
      { valor: 3, texto: '3 días', detalle: 'Ideal para arrancar' },
      { valor: 4, texto: '4 días' },
      { valor: 5, texto: '5 días' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Tu día',
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
    seccion: 'Tu día',
    campo: 'lugar',
    titulo: '¿Dónde vas a entrenar?',
    opciones: [
      { valor: 'casa', texto: 'En casa', icono: 'home' },
      { valor: 'plaza', texto: 'En una plaza o parque', icono: 'trees' },
      { valor: 'ambos', texto: 'Un poco y un poco', icono: 'shuffle' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Hábitos',
    campo: 'sueno',
    titulo: '¿Cuántas horas dormís por noche?',
    opciones: [
      { valor: 'menos_5', texto: 'Menos de 5' },
      { valor: '5_6', texto: 'Entre 5 y 6' },
      { valor: '7_8', texto: 'Entre 7 y 8' },
      { valor: 'mas_8', texto: 'Más de 8' },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Hábitos',
    campo: 'habitos',
    multiple: true,
    titulo: '¿Te pasa alguna de estas?',
    subtitulo: 'Elegí todas las que te pasen.',
    opciones: [
      { valor: 'ansiedad', texto: 'Como por ansiedad o aburrimiento' },
      { valor: 'noche', texto: 'Pico algo a la noche' },
      { valor: 'dulce', texto: 'No puedo dejar lo dulce' },
      { valor: 'saltear', texto: 'Salteo comidas' },
      { valor: 'ninguna', texto: 'Ninguna', exclusiva: true },
    ],
  },
  {
    tipo: 'opciones',
    seccion: 'Hábitos',
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
  {
    tipo: 'medidas',
    seccion: 'Tu plan',
    titulo: 'Tus medidas',
    subtitulo: 'Para calcular tu punto de partida. Solo lo ves vos.',
  },
  {
    tipo: 'opciones',
    seccion: 'Tu plan',
    campo: 'arranque',
    titulo: 'Tu plan está casi listo. ¿Cuándo hacés tu primera sesión?',
    opciones: [
      { valor: 'hoy', texto: 'Hoy mismo', icono: 'rocket' },
      { valor: 'manana', texto: 'Mañana', icono: 'sunrise' },
      { valor: 'semana', texto: 'Esta semana', icono: 'calendar' },
    ],
  },
  {
    tipo: 'contacto',
    seccion: 'Tu plan',
    titulo: '¿A dónde te mandamos tu plan?',
    subtitulo: 'Con este mail vas a entrar a la app.',
  },
];

// Lo que la persona conto en el cuestionario, devuelto como "lo que nos contaste" y como
// lo resuelve el plan. Solo se arma con respuestas reales; si no hay dolores, no se muestra.
export interface Reflejo { dolor: string; solucion: string }

export function reflejos(r: Respuestas): Reflejo[] {
  const lista: Reflejo[] = [];
  const f = r.frenos ?? [];
  if (r.ultimaVez === 'mas_3' || r.ultimaVez === 'nunca' || r.ultimaVez === '1_3')
    lista.push({
      dolor: r.ultimaVez === 'nunca' ? 'Nunca te sentiste del todo bien con tu cuerpo' : `Hace ${r.ultimaVez === '1_3' ? 'más de un año' : 'más de 3 años'} que no te sentís bien con tu cuerpo`,
      solucion: 'Un plan que arranca en tu nivel real y sube de a un escalón por semana.',
    });
  if (f.includes('dejo')) lista.push({ dolor: 'Arrancás y a las dos semanas lo dejás', solucion: 'Sesiones cortas, el día de hoy siempre a la vista y tu avance marcado.' });
  if (f.includes('no_se')) lista.push({ dolor: 'No sabías qué hacer ni cómo', solucion: 'Cada ejercicio con foto, explicación y temporizador.' });
  if (f.includes('tiempo')) lista.push({ dolor: 'No te daba el tiempo', solucion: `${r.dias ?? 3} días por semana de ${r.minutos ?? 20} minutos, en tu casa.` });
  if (f.includes('aburre')) lista.push({ dolor: 'Te aburre hacer siempre lo mismo', solucion: 'Tres tipos de sesión que rotan y un ejercicio nuevo cada vez que subís de nivel.' });
  if (f.includes('gym')) lista.push({ dolor: 'El gimnasio te queda lejos o es caro', solucion: 'Solo tu peso corporal: sin gimnasio y sin equipos.' });
  if (f.includes('resultados')) lista.push({ dolor: 'No veías resultados', solucion: 'Progresión semana a semana: más repeticiones y después un ejercicio más difícil.' });
  if (r.escaleras === 'sin_aire') lista.push({ dolor: 'Te quedás sin aire en la escalera', solucion: 'Trabajo de piernas y cardio de bajo impacto que sube de a poco.' });
  if (r.energia === 'baja' || r.energia === 'bajon') lista.push({ dolor: r.energia === 'baja' ? 'Andás con poca energía casi todo el día' : 'Tenés un bajón después de comer', solucion: 'Sesiones cortas que te activan sin agotarte, y recetas sin azúcar.' });
  if (r.dia === 'sentado') lista.push({ dolor: g(r, 'Pasás casi todo el día sentada', 'Pasás casi todo el día sentado'), solucion: 'Movilidad al inicio de cada sesión para soltar cadera y espalda.' });
  const h = r.habitos ?? [];
  if (h.includes('dulce') || h.includes('ansiedad') || h.includes('noche'))
    lista.push({ dolor: h.includes('dulce') ? 'Te cuesta dejar lo dulce' : h.includes('ansiedad') ? 'Comés por ansiedad o aburrimiento' : 'Picás algo a la noche', solucion: 'Recetas sin azúcar y sin gluten para tu forma de comer, también para los antojos.' });
  if (r.sueno === 'menos_5' || r.sueno === '5_6') lista.push({ dolor: 'Dormís menos de lo que el cuerpo necesita', solucion: 'Sesiones cortas que no te roban horas de descanso.' });
  return lista;
}

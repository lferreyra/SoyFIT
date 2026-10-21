// Embudo de venta: cuestionario -> armando tu plan -> resultado con la oferta.

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, Armchair, ArrowLeft, Battery, BatteryFull, BatteryLow, BatteryMedium, Bike, Calendar, Check,
  ChevronRight, Dumbbell, Flame, Footprints, Home, Lock, Rocket, Shuffle, Sparkles, Sunrise, Trees, Wind, X, Zap,
} from 'lucide-react';
import { Opcion, Paso, PASOS, reflejos, resolver, Respuestas, Seccion, textoOpcion } from './cuestionario';
import { armarPlan, textoCarga } from './plan';
import { guardarRespuestas, leerRespuestas } from './estado';
import { fotoArchivo, porGenero } from './fotos';
import { BONOS_DEL_PROGRAMA, linkDePago, producto, RECETARIO_DE } from './oferta';
import { Logo } from './Logo';
import { Portada } from './Portada';

const ICONOS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  flame: Flame, sparkles: Sparkles, dumbbell: Dumbbell, zap: Zap, wind: Wind, activity: Activity, check: Check,
  armchair: Armchair, footprints: Footprints, bike: Bike, 'battery-low': BatteryLow, 'battery-medium': BatteryMedium,
  'battery-full': BatteryFull, battery: Battery, home: Home, trees: Trees, shuffle: Shuffle, rocket: Rocket,
  sunrise: Sunrise, calendar: Calendar,
};

const SECCIONES: Seccion[] = ['Vos', 'Tu cuerpo', 'Tu día', 'Hábitos', 'Tu plan'];

// Si el anuncio ya es para mujeres o para hombres, el link trae ?sexo= y esa pregunta se saltea.
function sexoDesdeUrl(): Respuestas['sexo'] {
  try {
    const s = new URLSearchParams(location.search).get('sexo');
    return s === 'mujer' || s === 'hombre' ? s : undefined;
  } catch {
    return undefined;
  }
}

export const Embudo: React.FC = () => {
  const sexoUrl = useMemo(sexoDesdeUrl, []);
  const pasos = useMemo(() => (sexoUrl ? PASOS.filter(p => !(p.tipo === 'opciones' && p.campo === 'sexo')) : PASOS), [sexoUrl]);
  const [respuestas, setRespuestas] = useState<Respuestas>(() => ({ ...leerRespuestas(), ...(sexoUrl ? { sexo: sexoUrl } : {}) }));
  const [indice, setIndice] = useState(0);
  const [etapa, setEtapa] = useState<'preguntas' | 'armando' | 'resultado'>('preguntas');

  useEffect(() => { guardarRespuestas(respuestas); }, [respuestas]);
  useEffect(() => { window.scrollTo(0, 0); }, [indice, etapa]);

  const avanzar = () => {
    if (indice < pasos.length - 1) setIndice(indice + 1);
    else setEtapa('armando');
  };

  if (etapa === 'armando') return <Armando respuestas={respuestas} onListo={() => setEtapa('resultado')} />;
  if (etapa === 'resultado') return <Resultado respuestas={respuestas} />;

  const paso = pasos[indice];
  const titulo = resolver(paso.titulo, respuestas);
  const subtitulo = 'subtitulo' in paso ? resolver(paso.subtitulo, respuestas) : '';

  if (paso.tipo === 'dato') {
    return <Dato paso={paso} respuestas={respuestas} indice={indice} total={pasos.length} onVolver={() => setIndice(indice - 1)} onSeguir={avanzar} />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-32 flex flex-col">
      {indice === 0 ? (
        <Portada foto={sexoUrl === 'mujer' ? fotoArchivo('birddog', 'mujer') : fotoArchivo('diamondpushup', 'hombre')} className="-mx-4 h-[46vh] min-h-[320px]">
          <div className="h-full flex flex-col justify-between px-4 pt-5 pb-2">
            <div className="flex"><Logo size={30} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--k-accent)]">Calistenia en casa</p>
              <h1 className="text-[2.6rem] font-extrabold leading-[1.02] mt-2">Tu plan, armado para tu nivel</h1>
            </div>
          </div>
        </Portada>
      ) : (
        <Encabezado seccion={paso.seccion} indice={indice} total={pasos.length} onVolver={() => setIndice(indice - 1)} />
      )}

      <div key={indice} className={`${indice === 0 ? 'pt-4' : 'pt-7'} flex-1`}>
        <h2 className={`k-entrar font-extrabold leading-tight tracking-tight ${indice === 0 ? 'text-xl' : 'text-[1.65rem]'}`}>{titulo}</h2>
        {subtitulo && <p className="k-entrar text-[var(--k-muted)] mt-2">{subtitulo}</p>}

        {paso.tipo === 'opciones' && (
          <Opciones
            paso={paso}
            respuestas={respuestas}
            onElegir={(valor, cerrar) => {
              setRespuestas(r => ({ ...r, [paso.campo]: valor }) as Respuestas);
              if (cerrar) setTimeout(avanzar, 200);
            }}
            onSeguir={avanzar}
          />
        )}

        {paso.tipo === 'medidas' && <Medidas respuestas={respuestas} onCambio={setRespuestas} onSeguir={avanzar} />}

        {paso.tipo === 'contacto' && <Contacto respuestas={respuestas} onCambio={setRespuestas} onSeguir={avanzar} />}
      </div>
    </div>
  );
};

const Encabezado: React.FC<{ seccion: Seccion; indice: number; total: number; onVolver: () => void; sobreFoto?: boolean }> = ({ seccion, indice, total, onVolver, sobreFoto }) => {
  const actual = SECCIONES.indexOf(seccion);
  return (
    <div className="pt-3">
      <div className="flex items-center gap-2">
        <button onClick={onVolver} className="p-2 -ml-2 rounded-full active:bg-[var(--k-surface)]" aria-label="Volver">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center"><Logo size={22} /></div>
        <span className={`text-xs tabular-nums w-9 text-right ${sobreFoto ? 'text-white font-semibold' : 'text-[var(--k-muted)]'}`}>{indice + 1}/{total}</span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {SECCIONES.map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full bg-[var(--k-surface-2)] overflow-hidden">
            <div
              className="h-full bg-[var(--k-accent)] transition-all duration-500"
              style={{ width: i < actual ? '100%' : i > actual ? '0%' : `${Math.max(12, progresoDentro(seccion, indice, total))}%` }}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--k-accent)]">{seccion}</p>
    </div>
  );
};

// Que tan avanzada va la persona dentro de la seccion actual (solo para la barra).
function progresoDentro(seccion: Seccion, indice: number, total: number) {
  const ids = PASOS.map((p, i) => ({ s: p.seccion, i })).filter(x => x.s === seccion).map(x => x.i);
  const offset = PASOS.length - total; // si se salteo la pregunta de sexo
  const pos = ids.indexOf(indice + offset);
  return ids.length ? Math.round(((pos + 1) / ids.length) * 100) : 100;
}

const Opciones: React.FC<{
  paso: Extract<Paso, { tipo: 'opciones' }>;
  respuestas: Respuestas;
  onElegir: (valor: unknown, cerrar: boolean) => void;
  onSeguir: () => void;
}> = ({ paso, respuestas, onElegir, onSeguir }) => {
  const actual = respuestas[paso.campo];
  const elegidas: (string | number)[] = paso.multiple ? ((actual as (string | number)[] | undefined) ?? []) : [];

  const tocar = (o: Opcion) => {
    if (!paso.multiple) return onElegir(o.valor, true);
    if (o.exclusiva) return onElegir(elegidas.includes(o.valor) ? [] : [o.valor], false);
    const sinExclusivas = elegidas.filter(v => !paso.opciones.find(x => x.valor === v)?.exclusiva);
    onElegir(sinExclusivas.includes(o.valor) ? sinExclusivas.filter(v => v !== o.valor) : [...sinExclusivas, o.valor], false);
  };

  return (
    <>
      <div className="mt-6 space-y-2.5">
        {paso.opciones.map((o, i) => {
          const elegida = paso.multiple ? elegidas.includes(o.valor) : actual === o.valor;
          const Icono = o.icono ? ICONOS[o.icono] : undefined;
          return (
            <button
              key={String(o.valor)}
              onClick={() => tocar(o)}
              style={{ animationDelay: `${40 + i * 35}ms` }}
              className={`k-entrar w-full text-left px-4 py-4 rounded-2xl border flex items-center gap-3.5 transition active:scale-[0.99] ${
                elegida
                  ? 'border-[var(--k-accent)] bg-[var(--k-accent-soft)] shadow-[0_0_0_1px_var(--k-accent)]'
                  : 'border-[var(--k-line)] bg-[var(--k-surface)] hover:border-[#3a4134]'
              }`}
            >
              {Icono && (
                <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${elegida ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : 'bg-[var(--k-surface-2)] text-[var(--k-accent)]'}`}>
                  <Icono size={20} />
                </span>
              )}
              <span className="flex-1">
                <span className="block font-semibold text-[1.02rem] leading-snug">{textoOpcion(o, respuestas)}</span>
                {o.detalle && <span className="block text-sm text-[var(--k-muted)] mt-0.5">{o.detalle}</span>}
              </span>
              {paso.multiple ? (
                <span className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center ${elegida ? 'bg-[var(--k-accent)] border-[var(--k-accent)] text-[var(--k-on-accent)]' : 'border-[#454c3f]'}`}>
                  {elegida && <Check size={15} strokeWidth={3} />}
                </span>
              ) : elegida ? (
                <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--k-accent)] text-[var(--k-on-accent)] flex items-center justify-center"><Check size={15} strokeWidth={3} /></span>
              ) : (
                <ChevronRight size={18} className="shrink-0 text-[var(--k-muted)]" />
              )}
            </button>
          );
        })}
      </div>
      {paso.multiple && (
        <BarraInferior>
          <BotonPrincipal onClick={onSeguir} disabled={elegidas.length === 0}>Seguir</BotonPrincipal>
        </BarraInferior>
      )}
    </>
  );
};

const Dato: React.FC<{
  paso: Extract<Paso, { tipo: 'dato' }>;
  respuestas: Respuestas;
  indice: number;
  total: number;
  onVolver: () => void;
  onSeguir: () => void;
}> = ({ paso, respuestas, indice, total, onVolver, onSeguir }) => {
  const cifra = resolver(paso.cifra, respuestas);
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-32">
      <Portada foto={porGenero(paso.foto, respuestas.sexo)} className="-mx-4 h-[44vh] min-h-[300px]">
        <div className="px-4" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}>
          <Encabezado seccion={paso.seccion} indice={indice} total={total} onVolver={onVolver} sobreFoto />
        </div>
      </Portada>
      <div key={indice} className="-mt-10 relative">
        <h2 className="k-entrar text-[1.9rem] font-extrabold leading-[1.08] tracking-tight">{resolver(paso.titulo, respuestas)}</h2>
        <p className="k-entrar-2 mt-4 text-[1.08rem] leading-relaxed text-[var(--k-ink)]/85">{resolver(paso.texto, respuestas)}</p>
        {cifra && (
          <div className="k-entrar-2 mt-6 flex items-center gap-4 rounded-2xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
            <span className="text-5xl font-extrabold text-[var(--k-accent)] tabular-nums leading-none">{cifra}</span>
            <span className="text-sm text-[var(--k-muted)] leading-snug">{resolver(paso.cifraTexto, respuestas)}</span>
          </div>
        )}
      </div>
      <BarraInferior>
        <BotonPrincipal onClick={onSeguir}>Seguir</BotonPrincipal>
      </BarraInferior>
    </div>
  );
};

const BarraInferior: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed bottom-0 inset-x-0 z-10 bg-gradient-to-t from-[var(--k-bg)] via-[var(--k-bg)] to-transparent pt-8 pb-5 px-4">
    <div className="max-w-md mx-auto">{children}</div>
  </div>
);

const BotonPrincipal: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold text-lg transition active:scale-[0.99] disabled:opacity-35 shadow-[0_8px_30px_-8px_rgba(203,255,75,0.45)] disabled:shadow-none"
  >
    {children}
  </button>
);

const claseInput = 'w-full bg-transparent text-2xl font-bold outline-none tabular-nums placeholder:text-[#4a5244]';

const CampoNumero: React.FC<{ etiqueta: string; unidad: string; placeholder: string; valor?: number; opcional?: boolean; onCambio: (v?: number) => void }> = ({ etiqueta, unidad, placeholder, valor, opcional, onCambio }) => (
  <label className="block rounded-2xl border border-[var(--k-line)] bg-[var(--k-surface)] px-4 py-3 focus-within:border-[var(--k-accent)] transition">
    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--k-muted)]">
      {etiqueta}{opcional && <span className="normal-case tracking-normal font-normal"> · opcional</span>}
    </span>
    <span className="mt-1 flex items-baseline gap-2">
      <input
        inputMode="numeric"
        className={claseInput}
        placeholder={placeholder}
        value={valor ?? ''}
        onChange={e => onCambio(Number(e.target.value.replace(/\D/g, '').slice(0, 3)) || undefined)}
      />
      <span className="text-[var(--k-muted)] font-semibold">{unidad}</span>
    </span>
  </label>
);

export function imc(r: Respuestas): number | undefined {
  if (!r.alturaCm || !r.pesoKg || r.alturaCm < 120 || r.pesoKg < 35) return undefined;
  return r.pesoKg / (r.alturaCm / 100) ** 2;
}

const CATEGORIAS_IMC = [
  { hasta: 18.5, nombre: 'Bajo peso' },
  { hasta: 25, nombre: 'Normal' },
  { hasta: 30, nombre: 'Sobrepeso' },
  { hasta: Infinity, nombre: 'Obesidad' },
];

const MedidorImc: React.FC<{ valor: number }> = ({ valor }) => {
  const nombre = CATEGORIAS_IMC.find(c => valor < c.hasta)!.nombre;
  // Escala visual de 15 a 40.
  const pos = Math.min(100, Math.max(0, ((valor - 15) / 25) * 100));
  return (
    <div className="k-entrar rounded-2xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--k-muted)]">Tu IMC</span>
        <span className="text-sm font-bold">{nombre}</span>
      </div>
      <p className="text-3xl font-extrabold tabular-nums mt-1">{valor.toFixed(1)}</p>
      <div className="relative mt-3 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, #6fb6ff 0%, #CBFF4B 30%, #CBFF4B 40%, #FFC44C 60%, #FF8A4C 100%)' }}>
        <span className="absolute -top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[var(--k-bg)] shadow" style={{ left: `calc(${pos}% - 8px)` }} />
      </div>
      <p className="mt-3 text-xs text-[var(--k-muted)] leading-relaxed">Es una referencia general. Tu plan se arma con tu nivel real, no con este número.</p>
    </div>
  );
};

const Medidas: React.FC<{ respuestas: Respuestas; onCambio: (r: Respuestas) => void; onSeguir: () => void }> = ({ respuestas, onCambio, onSeguir }) => {
  const valido = (respuestas.alturaCm ?? 0) >= 120 && (respuestas.alturaCm ?? 0) <= 230 && (respuestas.pesoKg ?? 0) >= 35 && (respuestas.pesoKg ?? 0) <= 250;
  const valor = valido ? imc(respuestas) : undefined;
  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero etiqueta="Altura" unidad="cm" placeholder="170" valor={respuestas.alturaCm} onCambio={v => onCambio({ ...respuestas, alturaCm: v })} />
        <CampoNumero etiqueta="Peso" unidad="kg" placeholder="70" valor={respuestas.pesoKg} onCambio={v => onCambio({ ...respuestas, pesoKg: v })} />
      </div>
      <CampoNumero etiqueta="Peso que te gustaría" unidad="kg" placeholder="—" opcional valor={respuestas.pesoMetaKg} onCambio={v => onCambio({ ...respuestas, pesoMetaKg: v })} />
      {valor && <MedidorImc valor={valor} />}
      <BarraInferior>
        <BotonPrincipal onClick={onSeguir} disabled={!valido}>Seguir</BotonPrincipal>
      </BarraInferior>
    </div>
  );
};

const Contacto: React.FC<{ respuestas: Respuestas; onCambio: (r: Respuestas) => void; onSeguir: () => void }> = ({ respuestas, onCambio, onSeguir }) => {
  const valido = (respuestas.nombre ?? '').trim().length > 1 && /^\S+@\S+\.\S+$/.test(respuestas.email ?? '');
  const campo = 'block rounded-2xl border border-[var(--k-line)] bg-[var(--k-surface)] px-4 py-3 focus-within:border-[var(--k-accent)] transition';
  return (
    <div className="mt-6 space-y-3">
      <label className={campo}>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--k-muted)]">Tu nombre</span>
        <input className="mt-1 w-full bg-transparent text-lg font-semibold outline-none" autoComplete="given-name" value={respuestas.nombre ?? ''} onChange={e => onCambio({ ...respuestas, nombre: e.target.value })} />
      </label>
      <label className={campo}>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--k-muted)]">Tu mail</span>
        <input className="mt-1 w-full bg-transparent text-lg font-semibold outline-none" type="email" autoComplete="email" value={respuestas.email ?? ''} onChange={e => onCambio({ ...respuestas, email: e.target.value.trim() })} />
      </label>
      <p className="flex items-center gap-2 text-xs text-[var(--k-muted)] pt-1"><Lock size={13} /> Solo lo usamos para tu acceso y tu plan. Nada de spam.</p>
      <BarraInferior>
        <BotonPrincipal onClick={onSeguir} disabled={!valido}>Ver mi plan</BotonPrincipal>
      </BarraInferior>
    </div>
  );
};

const NOMBRE_DIETA: Record<string, string> = { omnivoro: 'para los que comen de todo', vegetariano: 'vegetarianas', vegano: 'veganas', proteico: 'altas en proteína' };

// Lo que va mostrando mientras "arma" el plan: cada linea sale de una respuesta real.
function lineasArmando(r: Respuestas): string[] {
  const plan = armarPlan(r);
  const m = r.molestias ?? [];
  const cuida = [m.includes('rodilla') && 'tus rodillas', (m.includes('hombro') || m.includes('muneca')) && (m.includes('hombro') ? 'tus hombros' : 'tus muñecas')].filter(Boolean);
  return [
    `Nivel de arranque: ${plan.nombreNivel}`,
    cuida.length ? `Eligiendo variantes que cuidan ${cuida.join(' y ')}` : 'Eligiendo tus ejercicios',
    `Ordenando tus ${plan.dias} días de ${plan.minutos} minutos`,
    `Sumando recetas ${NOMBRE_DIETA[r.dieta ?? 'omnivoro']}`,
  ];
}

const Armando: React.FC<{ respuestas: Respuestas; onListo: () => void }> = ({ respuestas, onListo }) => {
  const lineas = useMemo(() => lineasArmando(respuestas), [respuestas]);
  const [paso, setPaso] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct(p => Math.min(100, p + 1)), 38);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    setPaso(Math.min(lineas.length, Math.floor(pct / (100 / lineas.length))));
    if (pct >= 100) {
      const t = setTimeout(onListo, 700);
      return () => clearTimeout(t);
    }
  }, [pct]);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <Portada foto={porGenero('/ejercicios/wallpushup.jpg', respuestas.sexo)} className="min-h-screen">
      <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col justify-end pb-14">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <circle cx="60" cy="60" r={r} fill="none" stroke="var(--k-accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tabular-nums">{pct}%</span>
        </div>
        <h1 className="text-3xl font-extrabold mt-6">Armando tu plan</h1>
        <div className="mt-6 space-y-2.5">
          {lineas.map((m, i) => (
            <div key={m} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[var(--k-surface)]/90 backdrop-blur transition duration-500 ${i <= paso ? 'opacity-100' : 'opacity-30'}`}>
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition ${i < paso ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : 'bg-[var(--k-bg)]'}`}>
                {i < paso && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="font-semibold">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </Portada>
  );
};

const NOMBRE_OBJETIVO: Record<string, string> = {
  bajar_grasa: 'Bajar grasa',
  tonificar: 'Tonificar y marcar',
  ganar_musculo: 'Ganar músculo',
  fuerza: 'Ganar fuerza y agilidad',
};

const CUANDO: Record<string, string> = { hoy: 'Hoy', manana: 'Mañana', semana: 'Esta semana' };

const Resultado: React.FC<{ respuestas: Respuestas }> = ({ respuestas }) => {
  const plan = useMemo(() => armarPlan(respuestas), [respuestas]);
  const lista = useMemo(() => reflejos(respuestas).slice(0, 4), [respuestas]);
  const principal = producto('programa');
  const link = linkDePago('programa', respuestas.email, respuestas.nombre);
  const primera = plan.semanas[0].sesiones[0];
  // El recetario de su alimentacion va primero; los otros 3 vienen igual.
  const recetarioTuyo = respuestas.dieta && RECETARIO_DE[respuestas.dieta] ? RECETARIO_DE[respuestas.dieta] : undefined;
  const bonosEnOrden = recetarioTuyo ? [recetarioTuyo, ...BONOS_DEL_PROGRAMA.filter(id => id !== recetarioTuyo)] : BONOS_DEL_PROGRAMA;
  const nombre = respuestas.nombre ? respuestas.nombre.trim().split(/\s+/)[0] : '';

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-28">
      <Portada foto={porGenero('/ejercicios/glutebridge.jpg', respuestas.sexo)} className="-mx-4 h-[38vh] min-h-[260px]">
        <div className="h-full flex flex-col justify-between px-4 pt-5 pb-2">
          <div className="flex"><Logo size={28} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--k-accent)]">Tu plan está listo</p>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.05] mt-2">{nombre ? `${nombre}, arrancamos` : 'Arrancamos'}</h1>
          </div>
        </div>
      </Portada>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DatoPlan etiqueta="Objetivo" valor={NOMBRE_OBJETIVO[respuestas.objetivo ?? ''] ?? '—'} />
        <DatoPlan etiqueta="Nivel de arranque" valor={plan.nombreNivel} />
        <DatoPlan etiqueta="Frecuencia" valor={`${plan.dias} días por semana`} />
        <DatoPlan etiqueta="Duración" valor={`${plan.minutos} minutos`} />
        {respuestas.arranque && <DatoPlan etiqueta="Primera sesión" valor={CUANDO[respuestas.arranque]} />}
        {respuestas.pesoMetaKg && respuestas.pesoKg && respuestas.pesoMetaKg !== respuestas.pesoKg && (
          <DatoPlan etiqueta="Tu meta" valor={`${respuestas.pesoKg} → ${respuestas.pesoMetaKg} kg`} />
        )}
      </div>

      {lista.length > 0 && (
        <div className="mt-6 rounded-3xl border border-[var(--k-line)] bg-[var(--k-surface)] p-5">
          <p className="text-xs font-bold text-[var(--k-accent)] uppercase tracking-wide">Lo que nos contaste</p>
          <ul className="mt-3 space-y-4">
            {lista.map(x => (
              <li key={x.dolor}>
                <p className="flex gap-2.5 text-[var(--k-muted)] text-sm"><X size={16} className="shrink-0 mt-0.5 text-[var(--k-warm)]" />{x.dolor}</p>
                <p className="flex gap-2.5 font-semibold mt-1.5"><Check size={16} className="shrink-0 mt-1 text-[var(--k-accent)]" />{x.solucion}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-[var(--k-surface)] p-5">
        <p className="text-xs font-bold text-[var(--k-accent)] uppercase tracking-wide">Así arranca tu semana 1</p>
        <p className="font-extrabold text-lg mt-1">Día 1 · {primera.titulo}</p>
        <ul className="mt-3 space-y-2">
          {primera.principal.map(b => (
            <li key={b.ejercicio.id} className="flex justify-between gap-3 text-sm">
              <span className="font-semibold">{b.ejercicio.name}</span>
              <span className="text-[var(--k-muted)] whitespace-nowrap">{textoCarga(b)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-[var(--k-line)] space-y-2">
          {plan.semanas.slice(1).map(s => (
            <div key={s.numero} className="flex items-center gap-2 text-sm text-[var(--k-muted)]">
              <Lock size={14} /> Semana {s.numero} · {s.tema}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-[var(--k-surface-2)] text-white p-5">
        <p className="text-xs font-bold text-[var(--k-accent)] uppercase tracking-wide">Lo que incluye</p>
        <Item titulo={principal.nombre} texto={principal.resumen} />
        {bonosEnOrden.map(id => {
          const b = producto(id);
          const tuyo = id === recetarioTuyo;
          return <Item key={id} titulo={`Bono: ${b.nombre}${tuyo ? ' · el de tu alimentación' : ''}`} texto={b.resumen} />;
        })}
        {principal.precio && <p className="mt-5 text-3xl font-extrabold">{principal.precio}</p>}
      </div>

      <p className="mt-6 text-xs text-[var(--k-muted)] leading-relaxed">
        Si tenés una lesión, dolor o una condición médica, consultá con un profesional antes de empezar.
      </p>

      <div className="fixed bottom-0 inset-x-0 bg-[var(--k-bg)]/95 backdrop-blur px-4 py-3">
        <div className="max-w-md mx-auto">
          {link ? (
            <a href={link} className="block w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold text-lg text-center">
              Quiero mi plan
            </a>
          ) : (
            <button disabled className="w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold text-lg opacity-50">
              Link de pago pendiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DatoPlan: React.FC<{ etiqueta: string; valor: string }> = ({ etiqueta, valor }) => (
  <div className="rounded-2xl bg-[var(--k-surface)] p-4">
    <p className="text-xs text-[var(--k-muted)]">{etiqueta}</p>
    <p className="font-bold mt-1 leading-tight">{valor}</p>
  </div>
);

const Item: React.FC<{ titulo: string; texto: string }> = ({ titulo, texto }) => (
  <div className="mt-4 flex gap-3">
    <Check size={18} className="text-[var(--k-accent)] shrink-0 mt-0.5" />
    <div>
      <p className="font-bold">{titulo}</p>
      <p className="text-sm text-white/70">{texto}</p>
    </div>
  </div>
);

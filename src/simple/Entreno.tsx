// Ficha de ejercicio desplegable y reproductor de la sesion: reloj circular que avanza solo,
// pausa, listo, saltar, descanso con +/-15 s y arranque automatico (interfaz de la app original).

import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Minus, Pause, Play, Plus, SkipForward, X } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { Bloque, Sesion, textoCarga } from './plan';
import { fotoEjercicio } from './fotos';

export const FichaEjercicio: React.FC<{ bloque: Bloque }> = ({ bloque }) => {
  const [abierta, setAbierta] = useState(false);
  const e = bloque.ejercicio;
  return (
    <div className="rounded-2xl bg-[var(--k-surface)] overflow-hidden">
      <button onClick={() => setAbierta(!abierta)} className="w-full flex items-center gap-3 p-3 text-left">
        <img src={getAssetUrl(fotoEjercicio(e))} alt="" className="w-14 h-14 rounded-xl object-cover bg-[var(--k-bg)] shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight">{e.name}</p>
          <p className="text-sm text-[var(--k-muted)]">{textoCarga(bloque)}</p>
        </div>
        <ChevronDown size={18} className={`text-[var(--k-muted)] transition ${abierta ? 'rotate-180' : ''}`} />
      </button>
      {abierta && (
        <div className="px-4 pb-4">
          <img src={getAssetUrl(fotoEjercicio(e))} alt={e.name} className="w-full aspect-video object-cover rounded-xl bg-[var(--k-bg)]" />
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--k-accent)]">Cómo se hace</p>
          <ol className="mt-2 space-y-2 text-sm list-decimal pl-5">
            {e.instructions.map((p, i) => <li key={i}>{p}</li>)}
          </ol>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--k-warm)]">Errores comunes</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            {e.commonMistakes.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {e.regressionOptions[0] && (
            <p className="mt-4 text-sm"><span className="font-bold">Si te cuesta:</span> {e.regressionOptions[0]}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const VistaSesion: React.FC<{ sesion: Sesion }> = ({ sesion }) => (
  <div className="space-y-5">
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Calentamiento · 3 minutos</p>
      <div className="mt-2 space-y-2">
        {sesion.calentamiento.map(b => <FichaEjercicio key={b.ejercicio.id} bloque={b} />)}
      </div>
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Rutina</p>
      <div className="mt-2 space-y-2">
        {sesion.principal.map(b => <FichaEjercicio key={b.ejercicio.id} bloque={b} />)}
      </div>
    </div>
  </div>
);

interface Tramo {
  bloque: Bloque;
  serie: number;
  etapa: 'Calentamiento' | 'Rutina';
}

type Fase = 'prepara' | 'ejercicio' | 'descanso';

const PREPARA = 5;

// Duracion del tramo: lo que dice el plan si es con tiempo; si es por repeticiones, unos 3 s por rep
// (entre 20 y 60) y se puede cortar antes con "Listo". Asi el reloj avanza solo, como en la app original.
const duracionTramo = (b: Bloque) => (b.segundos ? b.segundos : Math.max(20, Math.min(60, (b.reps ?? 10) * 3)));

// Pitido corto para los ultimos 3 segundos y vibracion al cambiar de fase (si el telefono lo permite).
let audio: AudioContext | null = null;
function pitido(agudo = false) {
  try {
    audio = audio ?? new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.frequency.value = agudo ? 1320 : 880;
    g.gain.setValueAtTime(0.15, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.2);
  } catch {}
}
const vibrar = () => { try { navigator.vibrate?.(120); } catch {} };

// Reloj circular con marcas (diseno de la app original, en los colores de Kalisfy).
const Dial: React.FC<{ progreso: number; color: string; children: React.ReactNode }> = ({ progreso, color, children }) => {
  const tam = 220, grosor = 9, centro = tam / 2, radio = centro - grosor - 10;
  const circ = 2 * Math.PI * radio;
  const p = Math.min(100, Math.max(0, progreso));
  const marcas = useMemo(() => Array.from({ length: 60 }, (_, k) => {
    const a = (k / 60) * 2 * Math.PI;
    const largo = k % 15 === 0 ? 7 : k % 5 === 0 ? 5 : 3;
    const ext = radio + 9, int = ext - largo;
    return { k, x1: centro + int * Math.cos(a), y1: centro + int * Math.sin(a), x2: centro + ext * Math.cos(a), y2: centro + ext * Math.sin(a), fuerte: k % 5 === 0 };
  }), [centro, radio]);
  const ang = (p / 100) * 2 * Math.PI;
  return (
    <div className="relative mx-auto" style={{ width: tam, height: tam }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${tam} ${tam}`}>
        {marcas.map(m => (
          <line key={m.k} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} strokeLinecap="round"
            stroke={(m.k / 60) * 100 <= p ? color : 'rgba(243,245,239,0.16)'} strokeWidth={m.fuerte ? 2 : 1} />
        ))}
        <circle cx={centro} cy={centro} r={radio} stroke="rgba(243,245,239,0.08)" strokeWidth={grosor} fill="none" />
        <circle cx={centro} cy={centro} r={radio} stroke={color} strokeWidth={grosor} fill="none" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (p / 100) * circ}
          style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${color}66)` }} />
        <circle cx={centro + radio * Math.cos(ang)} cy={centro + radio * Math.sin(ang)} r={grosor / 2 + 1.5}
          fill="#F3F5EF" stroke="#0D0F0C" strokeWidth={2} style={{ transition: 'cx 1s linear, cy 1s linear' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">{children}</div>
    </div>
  );
};

const Boton: React.FC<{ onClick: () => void; children: React.ReactNode; tipo?: 'acento' | 'suave' | 'alerta'; className?: string; disabled?: boolean; titulo?: string }> =
  ({ onClick, children, tipo = 'suave', className = '', disabled, titulo }) => (
  <button onClick={onClick} disabled={disabled} aria-label={titulo} title={titulo}
    className={`py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.97] disabled:opacity-30 ${
      tipo === 'acento' ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]'
      : tipo === 'alerta' ? 'bg-[var(--k-warm)] text-[var(--k-on-accent)]'
      : 'bg-[var(--k-surface-2)] text-[var(--k-ink)] border border-[var(--k-line)]'} ${className}`}>
    {children}
  </button>
);

export const Reproductor: React.FC<{ sesion: Sesion; onCerrar: () => void; onTerminar: (segundos: number) => void }> = ({ sesion, onCerrar, onTerminar }) => {
  const tramos = useMemo<Tramo[]>(() => {
    const lista: Tramo[] = [];
    sesion.calentamiento.forEach(b => lista.push({ bloque: b, serie: 1, etapa: 'Calentamiento' }));
    sesion.principal.forEach(b => {
      for (let s = 1; s <= b.series; s++) lista.push({ bloque: b, serie: s, etapa: 'Rutina' });
    });
    return lista;
  }, [sesion]);

  const [i, setI] = useState(0);
  const [fase, setFase] = useState<Fase>('prepara');
  const [total, setTotal] = useState(PREPARA); // duracion de la fase actual
  const [quedan, setQuedan] = useState(PREPARA); // segundos que faltan
  const [pausa, setPausa] = useState(false);
  const [tecnica, setTecnica] = useState(false);
  const [inicio] = useState(() => Date.now());
  const [terminado, setTerminado] = useState(false);

  const tramo = tramos[i];
  const proximo = tramos[i + 1];

  function arrancar(f: Fase, segs: number) {
    setFase(f);
    setTotal(segs);
    setQuedan(segs);
    setTecnica(false);
    vibrar();
  }

  function terminarTodo() {
    setTerminado(true);
    vibrar();
    onTerminar(Math.round((Date.now() - inicio) / 1000));
  }

  // Termina el ejercicio: descanso (si hay) o directo al siguiente.
  function listo() {
    if (i + 1 >= tramos.length) return terminarTodo();
    const d = tramo.bloque.descanso;
    if (d > 0) arrancar('descanso', d);
    else siguiente();
  }

  function siguiente() {
    if (i + 1 >= tramos.length) return terminarTodo();
    setI(i + 1);
    arrancar('ejercicio', duracionTramo(tramos[i + 1].bloque));
  }

  function saltarEjercicio() {
    // Salta todas las series que quedan de este ejercicio.
    let j = i + 1;
    while (j < tramos.length && tramos[j].bloque === tramo.bloque) j++;
    if (j >= tramos.length) return terminarTodo();
    setI(j);
    arrancar('ejercicio', duracionTramo(tramos[j].bloque));
  }

  useEffect(() => {
    if (pausa || terminado) return;
    if (quedan <= 0) {
      if (fase === 'prepara') arrancar('ejercicio', duracionTramo(tramo.bloque));
      else if (fase === 'ejercicio') listo();
      else siguiente();
      return;
    }
    const t = setTimeout(() => {
      if (quedan <= 4 && quedan > 1) pitido();
      if (quedan === 1) pitido(true);
      setQuedan(q => q - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [quedan, pausa, fase, terminado]);

  if (terminado) {
    const min = Math.max(1, Math.round((Date.now() - inicio) / 60000));
    return (
      <Pantalla onCerrar={onCerrar}>
        <div className="flex-1 flex flex-col items-center justify-center text-center k-entrar">
          <div className="w-24 h-24 rounded-full bg-[var(--k-accent)] text-[var(--k-on-accent)] flex items-center justify-center shadow-[0_0_40px_rgba(203,255,75,0.35)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">¡Sesión completa!</h2>
          <p className="mt-2 text-[var(--k-muted)]">Semana {sesion.semana}, día {sesion.dia} · {min} min</p>
          <p className="mt-1 text-[var(--k-muted)]">Quedó marcada en tu programa.</p>
          <button onClick={onCerrar} className="mt-10 w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">Volver</button>
        </div>
      </Pantalla>
    );
  }

  const e = tramo.bloque.ejercicio;
  const enDescanso = fase === 'descanso';
  const muestra = enDescanso && proximo ? proximo : tramo;
  const transcurrido = total - quedan;
  const color = enDescanso ? '#9BA294' : fase === 'prepara' ? '#FF8A4C' : '#CBFF4B';

  return (
    <Pantalla onCerrar={onCerrar}>
      {/* Avance de la sesion */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-[var(--k-surface)] overflow-hidden">
          <div className="h-full bg-[var(--k-accent)] transition-all" style={{ width: `${(i / tramos.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums text-[var(--k-muted)]">{i + 1}/{tramos.length}</span>
      </div>

      {/* Foto del ejercicio (en el descanso, la del que sigue) */}
      <div className="relative mt-3 rounded-3xl overflow-hidden bg-[var(--k-surface)]">
        <img key={muestra.bloque.ejercicio.id} src={getAssetUrl(fotoEjercicio(muestra.bloque.ejercicio))} alt={muestra.bloque.ejercicio.name}
          className={`w-full aspect-[16/10] object-cover k-entrar ${enDescanso ? 'opacity-60' : ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F0C] via-[#0D0F0C]/30 to-transparent" />
        <div className="absolute left-4 right-4 bottom-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide">
            <span className={enDescanso ? 'text-[var(--k-muted)]' : 'text-[var(--k-accent)]'}>
              {enDescanso ? 'Sigue' : fase === 'prepara' ? 'Preparate' : tramo.etapa}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/50 text-[var(--k-ink)] border border-white/10">
              {muestra.bloque.series > 1 ? `Serie ${muestra.serie}/${muestra.bloque.series}` : 'Una vuelta'}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight">{muestra.bloque.ejercicio.name}</h2>
        </div>
      </div>

      {/* Reloj */}
      <div className="mt-5">
        <Dial progreso={(transcurrido / Math.max(1, total)) * 100} color={color}>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--k-muted)]">
            {pausa ? 'En pausa' : enDescanso ? 'Descanso' : fase === 'prepara' ? 'Arrancamos en' : 'Tiempo'}
          </span>
          <span className="text-6xl font-extrabold tabular-nums leading-none mt-1">{quedan}<span className="text-xl text-[var(--k-muted)] ml-0.5">s</span></span>
          {fase === 'ejercicio' && (
            <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-[var(--k-surface-2)] border border-[var(--k-line)]">
              {tramo.bloque.segundos ? `Meta ${tramo.bloque.segundos} s` : `${tramo.bloque.reps} reps`}
            </span>
          )}
          {enDescanso && <span className="mt-2 text-xs text-[var(--k-muted)]">Inhalá · Exhalá</span>}
        </Dial>
        {enDescanso && <p className="mt-2 text-center text-xs text-[var(--k-muted)]">Arranca solo al llegar a 0</p>}
      </div>

      {/* Controles */}
      <div className="mt-auto pt-5 pb-[env(safe-area-inset-bottom)] space-y-3">
        {fase !== 'descanso' ? (
          <>
            <div className="grid grid-cols-4 gap-2">
              <Boton onClick={() => setPausa(!pausa)} tipo={pausa ? 'alerta' : 'suave'} className="col-span-2" titulo={pausa ? 'Seguir' : 'Pausar'}>
                {pausa ? <><Play size={18} fill="currentColor" /> Seguir</> : <><Pause size={18} fill="currentColor" /> Pausa</>}
              </Boton>
              <Boton onClick={fase === 'prepara' ? () => setQuedan(0) : listo} tipo="acento" titulo="Listo">
                <Check size={18} strokeWidth={3} /> Listo
              </Boton>
              <Boton onClick={saltarEjercicio} titulo="Saltar ejercicio">
                <SkipForward size={18} />
              </Boton>
            </div>
            <button onClick={() => setTecnica(!tecnica)} className="w-full rounded-2xl bg-[var(--k-surface)] border border-[var(--k-line)] px-4 py-3 flex items-center justify-between text-sm">
              <span className="font-bold">Cómo se hace</span>
              <ChevronDown size={18} className={`text-[var(--k-muted)] transition ${tecnica ? 'rotate-180' : ''}`} />
            </button>
            {tecnica && (
              <div className="rounded-2xl bg-[var(--k-surface)] border border-[var(--k-line)] p-4 text-sm k-entrar">
                <ol className="space-y-2 list-decimal pl-5">{e.instructions.map((p, k) => <li key={k}>{p}</li>)}</ol>
                {e.commonMistakes.length > 0 && (
                  <>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--k-warm)]">Errores comunes</p>
                    <ul className="mt-2 space-y-1 list-disc pl-5">{e.commonMistakes.map((p, k) => <li key={k}>{p}</li>)}</ul>
                  </>
                )}
                {e.regressionOptions[0] && <p className="mt-4"><span className="font-bold">Si te cuesta:</span> {e.regressionOptions[0]}</p>}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <Boton onClick={() => setQuedan(q => Math.max(1, q - 15))} disabled={quedan <= 5} titulo="Restar 15 segundos"><Minus size={16} /> 15</Boton>
            <Boton onClick={() => setPausa(!pausa)} tipo={pausa ? 'alerta' : 'suave'} titulo={pausa ? 'Seguir' : 'Pausar'}>
              {pausa ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            </Boton>
            <Boton onClick={() => { setQuedan(q => q + 15); setTotal(t => t + 15); }} titulo="Sumar 15 segundos"><Plus size={16} /> 15</Boton>
            <Boton onClick={siguiente} tipo="acento" titulo="Arrancar ya"><Check size={18} strokeWidth={3} /> Ya</Boton>
          </div>
        )}
      </div>
    </Pantalla>
  );
};

const Pantalla: React.FC<{ onCerrar: () => void; children: React.ReactNode }> = ({ onCerrar, children }) => (
  <div className="fixed inset-0 z-50 bg-[var(--k-bg)] overflow-y-auto">
    <div className="min-h-full max-w-md mx-auto px-4 py-3 flex flex-col">
      <div className="flex justify-end">
        <button onClick={onCerrar} className="p-2 -mr-2 rounded-full" aria-label="Cerrar"><X size={22} /></button>
      </div>
      {children}
    </div>
  </div>
);

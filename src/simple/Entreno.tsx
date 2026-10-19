// Ficha de ejercicio desplegable y reproductor de la sesion (series, descansos, temporizador).

import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Pause, Play, SkipForward, X } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { Bloque, Sesion, textoCarga } from './plan';

export const FichaEjercicio: React.FC<{ bloque: Bloque }> = ({ bloque }) => {
  const [abierta, setAbierta] = useState(false);
  const e = bloque.ejercicio;
  return (
    <div className="rounded-2xl bg-[var(--k-surface)] overflow-hidden">
      <button onClick={() => setAbierta(!abierta)} className="w-full flex items-center gap-3 p-3 text-left">
        <img src={getAssetUrl(e.imageUrl)} alt="" className="w-14 h-14 rounded-xl object-cover bg-[var(--k-bg)] shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight">{e.name}</p>
          <p className="text-sm text-[var(--k-muted)]">{textoCarga(bloque)}</p>
        </div>
        <ChevronDown size={18} className={`text-[var(--k-muted)] transition ${abierta ? 'rotate-180' : ''}`} />
      </button>
      {abierta && (
        <div className="px-4 pb-4">
          <img src={getAssetUrl(e.imageUrl)} alt={e.name} className="w-full aspect-video object-cover rounded-xl bg-[var(--k-bg)]" />
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
  const [descansando, setDescansando] = useState(false);
  const [reloj, setReloj] = useState(0); // segundos restantes del tramo con tiempo o del descanso
  const [corriendo, setCorriendo] = useState(false);
  const [inicio] = useState(() => Date.now());
  const [terminado, setTerminado] = useState(false);

  const tramo = tramos[i];
  const conTiempo = !!tramo?.bloque.segundos;

  useEffect(() => {
    if (!corriendo) return;
    if (reloj <= 0) {
      setCorriendo(false);
      if (descansando) siguiente();
      return;
    }
    const t = setTimeout(() => setReloj(reloj - 1), 1000);
    return () => clearTimeout(t);
  }, [corriendo, reloj]);

  useEffect(() => {
    if (tramo && conTiempo && !descansando) setReloj(tramo.bloque.segundos!);
  }, [i, descansando]);

  function siguiente() {
    setDescansando(false);
    setCorriendo(false);
    if (i + 1 >= tramos.length) {
      setTerminado(true);
      onTerminar(Math.round((Date.now() - inicio) / 1000));
    } else setI(i + 1);
  }

  function hecho() {
    if (i + 1 >= tramos.length) return siguiente();
    setDescansando(true);
    setReloj(tramo.bloque.descanso);
    setCorriendo(true);
  }

  if (terminado) {
    return (
      <Pantalla onCerrar={onCerrar}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--k-accent)] text-[var(--k-on-accent)] flex items-center justify-center">
            <Check size={40} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold">¡Sesión completa!</h2>
          <p className="mt-2 text-[var(--k-muted)]">Semana {sesion.semana}, día {sesion.dia}. Quedó marcada en tu programa.</p>
          <button onClick={onCerrar} className="mt-8 w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">Volver</button>
        </div>
      </Pantalla>
    );
  }

  const e = tramo.bloque.ejercicio;
  const proximo = tramos[i + 1];

  return (
    <Pantalla onCerrar={onCerrar}>
      <div className="h-1.5 rounded-full bg-[var(--k-surface)] overflow-hidden">
        <div className="h-full bg-[var(--k-accent)] transition-all" style={{ width: `${(i / tramos.length) * 100}%` }} />
      </div>

      {descansando ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--k-muted)]">Descanso</p>
          <p className="text-7xl font-extrabold mt-2 tabular-nums">{reloj}</p>
          {proximo && <p className="mt-6 text-[var(--k-muted)]">Ahora: <span className="font-bold text-[var(--k-ink)]">{proximo.bloque.ejercicio.name}</span></p>}
          <button onClick={siguiente} className="mt-8 px-6 py-3 rounded-2xl bg-[var(--k-surface)] font-bold flex items-center gap-2">
            <SkipForward size={18} /> Saltar descanso
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--k-accent)]">{tramo.etapa}</p>
          <h2 className="text-2xl font-extrabold leading-tight mt-1">{e.name}</h2>
          <img src={getAssetUrl(e.imageUrl)} alt={e.name} className="mt-4 w-full aspect-video object-cover rounded-2xl bg-[var(--k-surface)]" />
          <p className="mt-4 text-[var(--k-muted)]">
            {tramo.bloque.series > 1 ? `Serie ${tramo.serie} de ${tramo.bloque.series}` : 'Una vuelta'}
          </p>
          {conTiempo ? (
            <p className="text-6xl font-extrabold tabular-nums">{reloj}<span className="text-2xl"> seg</span></p>
          ) : (
            <p className="text-6xl font-extrabold">{tramo.bloque.reps}<span className="text-2xl"> reps</span></p>
          )}
          <p className="mt-3 text-sm">{e.instructions[e.instructions.length - 1]}</p>
          <div className="mt-auto pt-6 flex gap-3">
            {conTiempo && (
              <button onClick={() => setCorriendo(!corriendo)} className="flex-1 py-4 rounded-2xl bg-[var(--k-surface)] font-bold flex items-center justify-center gap-2">
                {corriendo ? <><Pause size={18} /> Pausa</> : <><Play size={18} /> Empezar</>}
              </button>
            )}
            <button onClick={hecho} className="flex-1 py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">Hecho</button>
          </div>
        </div>
      )}
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

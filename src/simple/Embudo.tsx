// Embudo de venta: cuestionario -> armando tu plan -> resultado con la oferta.

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Dumbbell, Lock } from 'lucide-react';
import { PASOS, Respuestas } from './cuestionario';
import { armarPlan, textoCarga } from './plan';
import { guardarRespuestas, leerRespuestas } from './estado';
import { BONOS_DEL_PROGRAMA, linkDePago, producto, RECETARIO_DE } from './oferta';
import { Logo } from './Logo';
import { Portada } from './Portada';

const Marca = () => (
  <div className="py-4">
    <Logo size={32} />
  </div>
);

export const Embudo: React.FC = () => {
  const [respuestas, setRespuestas] = useState<Respuestas>(leerRespuestas);
  const [indice, setIndice] = useState(0);
  const [etapa, setEtapa] = useState<'preguntas' | 'armando' | 'resultado'>('preguntas');

  useEffect(() => { guardarRespuestas(respuestas); }, [respuestas]);
  useEffect(() => { window.scrollTo(0, 0); }, [indice, etapa]);

  const avanzar = () => {
    if (indice < PASOS.length - 1) setIndice(indice + 1);
    else setEtapa('armando');
  };

  if (etapa === 'armando') return <Armando onListo={() => setEtapa('resultado')} />;
  if (etapa === 'resultado') return <Resultado respuestas={respuestas} />;

  const paso = PASOS[indice];
  const progreso = Math.round(((indice + 1) / PASOS.length) * 100);

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-10 flex flex-col">
      {indice === 0 && (
        <Portada foto="/ejercicios/diamondpushup.jpg" className="-mx-4 h-[52vh] min-h-[340px]">
          <div className="h-full flex flex-col justify-between px-4 pt-5 pb-2">
            <div className="flex"><Logo size={30} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--k-accent)]">Calistenia en casa</p>
              <h1 className="text-[2.6rem] font-extrabold leading-[1.02] mt-2">Tu plan, armado para tu nivel</h1>
            </div>
          </div>
        </Portada>
      )}
      <div className={`flex items-center gap-3 pt-3 ${indice === 0 ? 'hidden' : ''}`}>
        <button
          onClick={() => setIndice(Math.max(0, indice - 1))}
          className={`p-2 -ml-2 rounded-full ${indice === 0 ? 'invisible' : ''}`}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 h-2 rounded-full bg-[var(--k-surface)] overflow-hidden">
          <div className="h-full bg-[var(--k-accent)] transition-all" style={{ width: `${progreso}%` }} />
        </div>
        <span className="text-xs text-[var(--k-muted)] w-8 text-right">{indice + 1}/{PASOS.length}</span>
      </div>

      <div className={`${indice === 0 ? 'pt-3' : 'pt-6'} flex-1`}>
        {indice > 0 && <h1 className="text-2xl font-extrabold leading-tight">{paso.titulo}</h1>}

        {paso.tipo === 'opciones' && (
          <>
            {paso.subtitulo && <p className="text-[var(--k-muted)] mt-2">{paso.subtitulo}</p>}
            <div className="mt-6 space-y-3">
              {paso.opciones.map(o => {
                const elegida = respuestas[paso.campo] === o.valor;
                return (
                  <button
                    key={String(o.valor)}
                    onClick={() => {
                      setRespuestas({ ...respuestas, [paso.campo]: o.valor });
                      setTimeout(avanzar, 180);
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold flex items-center justify-between transition ${
                      elegida ? 'border-[var(--k-accent)] bg-[var(--k-accent-soft)]' : 'border-transparent bg-[var(--k-surface)]'
                    }`}
                  >
                    {o.texto}
                    <ChevronRight size={18} className="text-[var(--k-muted)]" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {paso.tipo === 'dato' && (
          <>
            <div className="mt-6 rounded-3xl bg-[var(--k-surface)] p-6">
              <Dumbbell className="text-[var(--k-accent)]" size={32} />
              <p className="mt-4 text-lg leading-relaxed">{paso.texto}</p>
            </div>
            <BotonPrincipal onClick={avanzar}>Seguir</BotonPrincipal>
          </>
        )}

        {paso.tipo === 'medidas' && (
          <Medidas respuestas={respuestas} onCambio={setRespuestas} onSeguir={avanzar} />
        )}

        {paso.tipo === 'contacto' && (
          <Contacto subtitulo={paso.subtitulo} respuestas={respuestas} onCambio={setRespuestas} onSeguir={avanzar} />
        )}
      </div>
    </div>
  );
};

const BotonPrincipal: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="mt-8 w-full py-4 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold text-lg disabled:opacity-40"
  >
    {children}
  </button>
);

const Campo: React.FC<{ etiqueta: string; children: React.ReactNode }> = ({ etiqueta, children }) => (
  <label className="block">
    <span className="text-sm font-semibold text-[var(--k-muted)]">{etiqueta}</span>
    {children}
  </label>
);

const claseInput = 'mt-1 w-full px-4 py-4 rounded-2xl bg-[var(--k-surface)] text-lg font-semibold outline-none focus:ring-2 focus:ring-[var(--k-accent)]';

const Medidas: React.FC<{ respuestas: Respuestas; onCambio: (r: Respuestas) => void; onSeguir: () => void }> = ({ respuestas, onCambio, onSeguir }) => {
  const valido = (respuestas.alturaCm ?? 0) >= 120 && (respuestas.alturaCm ?? 0) <= 230 && (respuestas.pesoKg ?? 0) >= 35 && (respuestas.pesoKg ?? 0) <= 250;
  return (
    <div className="mt-6 space-y-4">
      <Campo etiqueta="Altura (cm)">
        <input
          inputMode="numeric"
          className={claseInput}
          placeholder="170"
          value={respuestas.alturaCm ?? ''}
          onChange={e => onCambio({ ...respuestas, alturaCm: Number(e.target.value.replace(/\D/g, '')) || undefined })}
        />
      </Campo>
      <Campo etiqueta="Peso (kg)">
        <input
          inputMode="numeric"
          className={claseInput}
          placeholder="70"
          value={respuestas.pesoKg ?? ''}
          onChange={e => onCambio({ ...respuestas, pesoKg: Number(e.target.value.replace(/\D/g, '')) || undefined })}
        />
      </Campo>
      <BotonPrincipal onClick={onSeguir} disabled={!valido}>Seguir</BotonPrincipal>
    </div>
  );
};

const Contacto: React.FC<{ subtitulo: string; respuestas: Respuestas; onCambio: (r: Respuestas) => void; onSeguir: () => void }> = ({ subtitulo, respuestas, onCambio, onSeguir }) => {
  const valido = (respuestas.nombre ?? '').trim().length > 1 && /^\S+@\S+\.\S+$/.test(respuestas.email ?? '');
  return (
    <div className="mt-2">
      <p className="text-[var(--k-muted)]">{subtitulo}</p>
      <div className="mt-6 space-y-4">
        <Campo etiqueta="Tu nombre">
          <input className={claseInput} autoComplete="given-name" value={respuestas.nombre ?? ''} onChange={e => onCambio({ ...respuestas, nombre: e.target.value })} />
        </Campo>
        <Campo etiqueta="Tu mail">
          <input className={claseInput} type="email" autoComplete="email" value={respuestas.email ?? ''} onChange={e => onCambio({ ...respuestas, email: e.target.value.trim() })} />
        </Campo>
      </div>
      <BotonPrincipal onClick={onSeguir} disabled={!valido}>Ver mi plan</BotonPrincipal>
    </div>
  );
};

const MENSAJES_ARMANDO = ['Eligiendo tu nivel de arranque', 'Ordenando tus días de entrenamiento', 'Sumando tus recetas', 'Listo'];

const Armando: React.FC<{ onListo: () => void }> = ({ onListo }) => {
  const [paso, setPaso] = useState(0);
  useEffect(() => {
    if (paso >= MENSAJES_ARMANDO.length - 1) {
      const t = setTimeout(onListo, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPaso(paso + 1), 900);
    return () => clearTimeout(t);
  }, [paso]);
  return (
    <Portada foto="/ejercicios/sideplank.jpg" className="min-h-screen">
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col justify-end pb-16">
      <h1 className="text-3xl font-extrabold">Armando tu plan</h1>
      <div className="mt-8 space-y-3">
        {MENSAJES_ARMANDO.slice(0, -1).map((m, i) => (
          <div key={m} className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-[var(--k-surface)]/90 backdrop-blur transition ${i <= paso ? 'opacity-100' : 'opacity-30'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${i < paso ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : 'bg-[var(--k-bg)]'}`}>
              {i < paso && <Check size={14} />}
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

const Resultado: React.FC<{ respuestas: Respuestas }> = ({ respuestas }) => {
  const plan = useMemo(() => armarPlan(respuestas), [respuestas]);
  const principal = producto('programa');
  const link = linkDePago('programa', respuestas.email, respuestas.nombre);
  const primera = plan.semanas[0].sesiones[0];
  // El recetario de su alimentacion va primero; los otros 3 vienen igual.
  const recetarioTuyo = respuestas.dieta && RECETARIO_DE[respuestas.dieta] ? RECETARIO_DE[respuestas.dieta] : undefined;
  const bonosEnOrden = recetarioTuyo ? [recetarioTuyo, ...BONOS_DEL_PROGRAMA.filter(id => id !== recetarioTuyo)] : BONOS_DEL_PROGRAMA;

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-28">
      <Portada foto="/ejercicios/glutebridge.jpg" className="-mx-4 h-[38vh] min-h-[260px]">
        <div className="h-full flex flex-col justify-between px-4 pt-5 pb-2">
          <div className="flex"><Logo size={28} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--k-accent)]">Tu plan está listo</p>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.05] mt-2">
              {respuestas.nombre ? `${respuestas.nombre.trim().split(/\s+/)[0]}, arrancamos` : 'Arrancamos'}
            </h1>
          </div>
        </div>
      </Portada>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Dato etiqueta="Objetivo" valor={NOMBRE_OBJETIVO[respuestas.objetivo ?? ''] ?? '—'} />
        <Dato etiqueta="Nivel de arranque" valor={plan.nombreNivel} />
        <Dato etiqueta="Frecuencia" valor={`${plan.dias} días por semana`} />
        <Dato etiqueta="Duración" valor={`${plan.minutos} minutos`} />
      </div>

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

const Dato: React.FC<{ etiqueta: string; valor: string }> = ({ etiqueta, valor }) => (
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

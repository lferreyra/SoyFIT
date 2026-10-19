// Embudo de venta: cuestionario -> armando tu plan -> resultado con la oferta.

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Dumbbell, Lock } from 'lucide-react';
import { PASOS, Respuestas } from './cuestionario';
import { armarPlan, textoCarga } from './plan';
import { guardarRespuestas, leerRespuestas } from './estado';
import { BONOS_DEL_PROGRAMA, linkDePago, producto } from './oferta';

const Marca = () => (
  <div className="flex items-center justify-center gap-2 py-4">
    <div className="w-8 h-8 rounded-xl bg-[#20312D] text-white flex items-center justify-center font-extrabold">S</div>
    <span className="font-extrabold tracking-tight text-lg">SOYFIT</span>
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
      <div className="flex items-center gap-3 pt-3">
        <button
          onClick={() => setIndice(Math.max(0, indice - 1))}
          className={`p-2 -ml-2 rounded-full ${indice === 0 ? 'invisible' : ''}`}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
          <div className="h-full bg-[#56B89D] transition-all" style={{ width: `${progreso}%` }} />
        </div>
        <span className="text-xs text-[#6F7D78] w-8 text-right">{indice + 1}/{PASOS.length}</span>
      </div>

      {indice === 0 && <Marca />}

      <div className="pt-6 flex-1">
        <h1 className="text-2xl font-extrabold leading-tight">{paso.titulo}</h1>

        {paso.tipo === 'opciones' && (
          <>
            {paso.subtitulo && <p className="text-[#6F7D78] mt-2">{paso.subtitulo}</p>}
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
                      elegida ? 'border-[#56B89D] bg-[#DCEFE8]' : 'border-transparent bg-white'
                    }`}
                  >
                    {o.texto}
                    <ChevronRight size={18} className="text-[#6F7D78]" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {paso.tipo === 'dato' && (
          <>
            <div className="mt-6 rounded-3xl bg-white p-6">
              <Dumbbell className="text-[#56B89D]" size={32} />
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
    className="mt-8 w-full py-4 rounded-2xl bg-[#20312D] text-white font-bold text-lg disabled:opacity-40"
  >
    {children}
  </button>
);

const Campo: React.FC<{ etiqueta: string; children: React.ReactNode }> = ({ etiqueta, children }) => (
  <label className="block">
    <span className="text-sm font-semibold text-[#6F7D78]">{etiqueta}</span>
    {children}
  </label>
);

const claseInput = 'mt-1 w-full px-4 py-4 rounded-2xl bg-white text-lg font-semibold outline-none focus:ring-2 focus:ring-[#56B89D]';

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
      <p className="text-[#6F7D78]">{subtitulo}</p>
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
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col justify-center">
      <h1 className="text-2xl font-extrabold text-center">Armando tu plan</h1>
      <div className="mt-8 space-y-3">
        {MENSAJES_ARMANDO.slice(0, -1).map((m, i) => (
          <div key={m} className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white transition ${i <= paso ? 'opacity-100' : 'opacity-30'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${i < paso ? 'bg-[#56B89D] text-white' : 'bg-[#F4F3EC]'}`}>
              {i < paso && <Check size={14} />}
            </span>
            <span className="font-semibold">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NOMBRE_OBJETIVO: Record<string, string> = {
  bajar_grasa: 'Bajar grasa',
  tonificar: 'Tonificar y marcar',
  ganar_musculo: 'Ganar músculo',
  fuerza: 'Ganar fuerza y agilidad',
};

const NOMBRE_DIETA: Record<string, string> = {
  omnivoro: 'Como de todo',
  vegetariano: 'Vegetariana',
  vegano: 'Vegana',
};

const Resultado: React.FC<{ respuestas: Respuestas }> = ({ respuestas }) => {
  const plan = useMemo(() => armarPlan(respuestas), [respuestas]);
  const principal = producto('programa');
  const link = linkDePago('programa', respuestas.email, respuestas.nombre);
  const primera = plan.semanas[0].sesiones[0];

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-28">
      <Marca />
      <h1 className="text-2xl font-extrabold leading-tight">
        {respuestas.nombre ? `${respuestas.nombre.trim().split(/\s+/)[0]}, tu plan está listo` : 'Tu plan está listo'}
      </h1>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Dato etiqueta="Objetivo" valor={NOMBRE_OBJETIVO[respuestas.objetivo ?? ''] ?? '—'} />
        <Dato etiqueta="Nivel de arranque" valor={plan.nombreNivel} />
        <Dato etiqueta="Frecuencia" valor={`${plan.dias} días por semana`} />
        <Dato etiqueta="Duración" valor={`${plan.minutos} minutos`} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5">
        <p className="text-xs font-bold text-[#56B89D] uppercase tracking-wide">Así arranca tu semana 1</p>
        <p className="font-extrabold text-lg mt-1">Día 1 · {primera.titulo}</p>
        <ul className="mt-3 space-y-2">
          {primera.principal.map(b => (
            <li key={b.ejercicio.id} className="flex justify-between gap-3 text-sm">
              <span className="font-semibold">{b.ejercicio.name}</span>
              <span className="text-[#6F7D78] whitespace-nowrap">{textoCarga(b)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-[#F4F3EC] space-y-2">
          {plan.semanas.slice(1).map(s => (
            <div key={s.numero} className="flex items-center gap-2 text-sm text-[#6F7D78]">
              <Lock size={14} /> Semana {s.numero} · {s.tema}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-[#20312D] text-white p-5">
        <p className="text-xs font-bold text-[#A8D5C7] uppercase tracking-wide">Lo que incluye</p>
        <Item titulo={principal.nombre} texto={principal.resumen} />
        {BONOS_DEL_PROGRAMA.map(id => {
          const b = producto(id);
          const texto = id === 'recetario' && respuestas.dieta && NOMBRE_DIETA[respuestas.dieta] ? `Más de 1.700 recetas sin azúcar y sin gluten, filtradas para alimentación ${NOMBRE_DIETA[respuestas.dieta].toLowerCase()}.` : b.resumen;
          return <Item key={id} titulo={`Bono: ${b.nombre}`} texto={texto} />;
        })}
        {principal.precio && <p className="mt-5 text-3xl font-extrabold">{principal.precio}</p>}
      </div>

      <p className="mt-6 text-xs text-[#6F7D78] leading-relaxed">
        Si tenés una lesión, dolor o una condición médica, consultá con un profesional antes de empezar.
      </p>

      <div className="fixed bottom-0 inset-x-0 bg-[#F4F3EC]/95 backdrop-blur px-4 py-3">
        <div className="max-w-md mx-auto">
          {link ? (
            <a href={link} className="block w-full py-4 rounded-2xl bg-[#56B89D] text-white font-bold text-lg text-center">
              Quiero mi plan
            </a>
          ) : (
            <button disabled className="w-full py-4 rounded-2xl bg-[#56B89D] text-white font-bold text-lg opacity-50">
              Link de pago pendiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Dato: React.FC<{ etiqueta: string; valor: string }> = ({ etiqueta, valor }) => (
  <div className="rounded-2xl bg-white p-4">
    <p className="text-xs text-[#6F7D78]">{etiqueta}</p>
    <p className="font-bold mt-1 leading-tight">{valor}</p>
  </div>
);

const Item: React.FC<{ titulo: string; texto: string }> = ({ titulo, texto }) => (
  <div className="mt-4 flex gap-3">
    <Check size={18} className="text-[#56B89D] shrink-0 mt-0.5" />
    <div>
      <p className="font-bold">{titulo}</p>
      <p className="text-sm text-white/70">{texto}</p>
    </div>
  </div>
);

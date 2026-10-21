// La app de quien compro: 4 pantallas (Hoy, Programa, Recetas, Perfil).

import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { BookOpen, Calendar, Check, ChevronDown, Home, Lock, LogOut, Search, User as UserIcon } from 'lucide-react';
import { logOut, saveWorkoutSessionToFirestore } from '../lib/firebase';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { Dieta, Objetivo, Respuestas } from './cuestionario';
import { armarPlan, Bloque, proximaSesion, Sesion } from './plan';
import { guardarCompletadas, guardarRespuestas, leerCompletadas, leerRespuestas } from './estado';
import { linkDePago, producto, ProductoId, RECETARIO_DE } from './oferta';
import { FichaEjercicio, Reproductor, VistaSesion } from './Entreno';
import { Cargador, Logo } from './Logo';
import { Portada } from './Portada';
import { fotoEjercicio } from './fotos';
import { aptaPara, CATEGORIAS, Categoria, fotoReceta, menuSemanal, NOMBRE_DIETA, priorizaProteina, Receta, useRecetas } from './recetas';

type Pestana = 'hoy' | 'programa' | 'recetas' | 'perfil';

export const AppSimple: React.FC<{ usuario: User | null; compras: ProductoId[] }> = ({ usuario, compras }) => {
  const uid = usuario?.uid ?? 'vista-previa';
  const [pestana, setPestana] = useState<Pestana>('hoy');
  const [respuestas, setRespuestas] = useState<Respuestas>(leerRespuestas);
  const [completadas, setCompletadas] = useState<string[]>(() => leerCompletadas(uid));
  const [enCurso, setEnCurso] = useState<Sesion | null>(null);

  const plan = useMemo(() => armarPlan(respuestas), [respuestas]);
  const tiene = (id: ProductoId) => compras.includes(id);

  useEffect(() => { guardarCompletadas(uid, completadas); }, [uid, completadas]);
  useEffect(() => { guardarRespuestas(respuestas); }, [respuestas]);
  useEffect(() => { window.scrollTo(0, 0); }, [pestana]);

  const terminar = (sesion: Sesion, segundos: number) => {
    setCompletadas(c => (c.includes(sesion.id) ? c : [...c, sesion.id]));
    if (usuario) {
      saveWorkoutSessionToFirestore(usuario.uid, {
        id: `${sesion.id}-${Date.now()}`,
        workoutId: sesion.id,
        workoutTitle: sesion.titulo,
        category: 'Calisthenics',
        date: new Date().toISOString(),
        durationSeconds: segundos,
        caloriesBurned: 0,
        exercisesCompletedCount: sesion.principal.length,
        totalExercisesCount: sesion.principal.length,
        feedbackRating: 'perfect',
        postFeeling: 'good',
        xpEarned: 0,
      }).catch(() => {});
    }
  };

  const nombre = (usuario?.displayName || respuestas.nombre || '').trim().split(/\s+/)[0];

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pt-4 pb-28">
      <div className="flex mb-5">
        <Logo size={26} />
      </div>
      <div key={pestana} className="k-entrar">
      {pestana === 'hoy' && (
        <Hoy nombre={nombre} plan={plan} completadas={completadas} onEmpezar={setEnCurso} />
      )}
      {pestana === 'programa' && (
        <Programa plan={plan} completadas={completadas} onEmpezar={setEnCurso} tiene={tiene} email={usuario?.email ?? ''} />
      )}
      {pestana === 'recetas' && (
        <Recetas dieta={respuestas.dieta && NOMBRE_DIETA[respuestas.dieta] ? respuestas.dieta : 'omnivoro'} objetivo={respuestas.objetivo} tiene={tiene} email={usuario?.email ?? ''} />
      )}
      {pestana === 'perfil' && (
        <Perfil usuario={usuario} respuestas={respuestas} onCambio={setRespuestas} compras={compras} />
      )}
      </div>

      <nav className="fixed bottom-0 inset-x-0 bg-[var(--k-surface)]/95 backdrop-blur border-t border-[var(--k-line)] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto grid grid-cols-4">
          {([
            ['hoy', 'Hoy', Home],
            ['programa', 'Programa', Calendar],
            ['recetas', 'Recetas', BookOpen],
            ['perfil', 'Perfil', UserIcon],
          ] as const).map(([id, texto, Icono]) => (
            <button
              key={id}
              onClick={() => setPestana(id)}
              className={`relative py-3 flex flex-col items-center gap-1 text-xs font-semibold ${pestana === id ? 'text-[var(--k-ink)]' : 'text-[var(--k-muted)]'}`}
            >
              {pestana === id && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--k-accent)]" />}
              <Icono size={22} className={pestana === id ? 'text-[var(--k-accent)]' : ''} />
              {texto}
            </button>
          ))}
        </div>
      </nav>

      {enCurso && (
        <Reproductor
          sesion={enCurso}
          onCerrar={() => setEnCurso(null)}
          onTerminar={s => terminar(enCurso, s)}
        />
      )}
    </div>
  );
};

const Titulo: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="mb-5">
    <h1 className="text-2xl font-extrabold leading-tight">{children}</h1>
    {sub && <p className="text-[var(--k-muted)] mt-1">{sub}</p>}
  </div>
);

const Hoy: React.FC<{ nombre: string; plan: ReturnType<typeof armarPlan>; completadas: string[]; onEmpezar: (s: Sesion) => void }> = ({ nombre, plan, completadas, onEmpezar }) => {
  const sesion = proximaSesion(plan, completadas);
  const total = plan.semanas.reduce((n, s) => n + s.sesiones.length, 0);
  const hechas = completadas.filter(id => plan.semanas.some(s => s.sesiones.some(x => x.id === id))).length;

  return (
    <>
      <Titulo sub={`${hechas} de ${total} sesiones hechas`}>{nombre ? `Hola, ${nombre}` : 'Hola'}</Titulo>
      <div className="h-2 rounded-full bg-[var(--k-surface)] overflow-hidden -mt-2 mb-6">
        <div className="h-full bg-[var(--k-accent)]" style={{ width: `${(hechas / total) * 100}%` }} />
      </div>

      {sesion ? (
        <>
          <Portada foto={fotoEjercicio(sesion.principal[0].ejercicio)} className="rounded-3xl mb-5 min-h-[260px]">
          <div className="p-5 pt-24 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-accent)]">Semana {sesion.semana} · Día {sesion.dia}</p>
            <p className="text-xl font-extrabold mt-1">{sesion.titulo}</p>
            <p className="text-sm text-white/70 mt-1">{sesion.minutos} minutos · {sesion.principal.length} ejercicios</p>
            <button onClick={() => onEmpezar(sesion)} className="mt-4 w-full py-3.5 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">
              Empezar
            </button>
          </div>
          </Portada>
          <p className="text-sm text-[var(--k-muted)] mb-3">Tocá un ejercicio para ver cómo se hace antes de empezar.</p>
          <VistaSesion sesion={sesion} />
        </>
      ) : (
        <div className="rounded-3xl bg-[var(--k-surface)] p-6 text-center">
          <p className="text-xl font-extrabold">¡Terminaste las 4 semanas!</p>
          <p className="text-[var(--k-muted)] mt-2">Podés repetir el programa desde la pestaña Programa.</p>
        </div>
      )}
    </>
  );
};

const Programa: React.FC<{
  plan: ReturnType<typeof armarPlan>;
  completadas: string[];
  onEmpezar: (s: Sesion) => void;
  tiene: (id: ProductoId) => boolean;
  email: string;
}> = ({ plan, completadas, onEmpezar, tiene, email }) => {
  const [abierta, setAbierta] = useState<string | null>(null);
  const movilidad: Sesion = {
    id: 'movilidad',
    semana: 0,
    dia: 0,
    titulo: 'Movilidad de 10 minutos',
    minutos: 10,
    calentamiento: [],
    principal: ['mobility-catcow', 'mobility-worlds-greatest', 'mobility-9090-hips', 'glute-bridge'].map(id => {
      const e = EXERCISE_LIBRARY.find(x => x.id === id)!;
      return { ejercicio: e, series: 2, reps: e.defaultReps, descanso: 20 } as Bloque;
    }),
  };

  return (
    <>
      <Titulo sub={`Nivel ${plan.nombreNivel.toLowerCase()} · ${plan.dias} días por semana · ${plan.minutos} min`}>Tu programa</Titulo>
      {plan.semanas.map(s => (
        <div key={s.numero} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Semana {s.numero} · {s.tema}</p>
          <div className="mt-2 space-y-2">
            {s.sesiones.map(ses => {
              const hecha = completadas.includes(ses.id);
              const open = abierta === ses.id;
              return (
                <div key={ses.id} className="rounded-2xl bg-[var(--k-surface)] overflow-hidden">
                  <button onClick={() => setAbierta(open ? null : ses.id)} className="w-full p-4 flex items-center gap-3 text-left">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${hecha ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : 'bg-[var(--k-bg)]'}`}>
                      {hecha ? <Check size={16} /> : <span className="text-xs font-bold">{ses.dia}</span>}
                    </span>
                    <span className="flex-1 font-bold">Día {ses.dia} · {ses.titulo}</span>
                    <ChevronDown size={18} className={`text-[var(--k-muted)] transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-3 pb-4 bg-[var(--k-bg)] pt-3">
                      <VistaSesion sesion={ses} />
                      <button onClick={() => onEmpezar(ses)} className="mt-4 w-full py-3.5 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">
                        {hecha ? 'Repetir sesión' : 'Empezar'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Extras</p>
      <div className="mt-2 space-y-2">
        {tiene('movilidad') && (
          <div className="rounded-2xl bg-[var(--k-surface)] overflow-hidden">
            <button onClick={() => setAbierta(abierta === 'movilidad' ? null : 'movilidad')} className="w-full p-4 flex items-center gap-3 text-left">
              <span className="flex-1 font-bold">Bono · {movilidad.titulo}</span>
              <ChevronDown size={18} className={`text-[var(--k-muted)] transition ${abierta === 'movilidad' ? 'rotate-180' : ''}`} />
            </button>
            {abierta === 'movilidad' && (
              <div className="px-3 pb-4 pt-3 bg-[var(--k-bg)] space-y-2">
                {movilidad.principal.map(b => <FichaEjercicio key={b.ejercicio.id} bloque={b} />)}
                <button onClick={() => onEmpezar(movilidad)} className="mt-2 w-full py-3.5 rounded-2xl bg-[var(--k-accent)] text-[var(--k-on-accent)] font-bold">Empezar</button>
              </div>
            )}
          </div>
        )}
        {(['avanzado', 'desafio14'] as ProductoId[]).map(id =>
          tiene(id) ? (
            <div key={id} className="rounded-2xl bg-[var(--k-surface)] p-4">
              <p className="font-bold">{producto(id).nombre}</p>
              <p className="text-sm text-[var(--k-muted)] mt-1">Contenido en preparación.</p>
            </div>
          ) : (
            <Bloqueado key={id} id={id} email={email} />
          ),
        )}
      </div>
    </>
  );
};

const Bloqueado: React.FC<{ id: ProductoId; email: string }> = ({ id, email }) => {
  const p = producto(id);
  const link = linkDePago(id, email);
  return (
    <div className="rounded-2xl bg-[var(--k-surface)] p-4 flex gap-3">
      <Lock size={18} className="text-[var(--k-warm)] shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-bold">{p.nombre}</p>
        <p className="text-sm text-[var(--k-muted)] mt-1">{p.resumen}</p>
        {link ? (
          <a href={link} className="inline-block mt-3 px-4 py-2 rounded-xl bg-[var(--k-warm)] text-white text-sm font-bold">
            Desbloquear{p.precio ? ` · ${p.precio}` : ''}
          </a>
        ) : (
          <p className="mt-3 text-xs text-[var(--k-muted)]">Link de pago pendiente</p>
        )}
      </div>
    </div>
  );
};

const FichaReceta: React.FC<{ receta: Receta; etiqueta?: string }> = ({ receta, etiqueta }) => {
  const [abierta, setAbierta] = useState(false);
  const foto = fotoReceta(receta);
  return (
    <div className="rounded-2xl bg-[var(--k-surface)] overflow-hidden">
      <button onClick={() => setAbierta(!abierta)} className={`w-full flex gap-3 text-left items-center ${foto ? 'p-3' : 'p-4'}`}>
        {foto && !abierta && <img src={foto} alt="" loading="lazy" className="w-16 h-16 rounded-xl object-cover bg-[var(--k-bg)] shrink-0" />}
        <div className="flex-1">
          {etiqueta && <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-accent)]">{etiqueta}</p>}
          <p className="font-bold leading-tight mt-0.5">{receta.n}</p>
        </div>
        <ChevronDown size={18} className={`text-[var(--k-muted)] transition shrink-0 mt-1 ${abierta ? 'rotate-180' : ''}`} />
      </button>
      {abierta && (
        <div className="px-4 pb-4 k-entrar">
          {foto && <img src={foto} alt={receta.n} className="w-full aspect-[3/2] object-cover rounded-xl mb-3 bg-[var(--k-bg)]" />}
          <p className="text-sm leading-relaxed">{receta.t}</p>
        </div>
      )}
    </div>
  );
};

const POR_PAGINA = 30;

const Recetas: React.FC<{ dieta: Dieta; objetivo?: Objetivo; tiene: (id: ProductoId) => boolean; email: string }> = ({ dieta: suDieta, objetivo, tiene, email }) => {
  const recetas = useRecetas();
  // Cada recetario es un bono aparte: se ve el de su alimentacion y puede pasar a los otros que tenga.
  const disponibles = (Object.keys(RECETARIO_DE) as Dieta[]).filter(d => tiene(RECETARIO_DE[d]));
  const [dieta, setDieta] = useState<Dieta>(disponibles.includes(suDieta) ? suDieta : disponibles[0] ?? suDieta);
  const [vista, setVista] = useState<'menu' | 'todas'>(tiene('plan_comidas') ? 'menu' : 'todas');
  const [categoria, setCategoria] = useState<Categoria>('almuerzo');
  const [busqueda, setBusqueda] = useState('');
  const [faciles, setFaciles] = useState(true);
  const [cantidad, setCantidad] = useState(POR_PAGINA);

  const filtradas = useMemo(() => {
    if (!recetas) return [];
    const q = busqueda.trim().toLowerCase();
    return recetas
      .filter(r =>
        aptaPara(r, dieta) && (!faciles || r.x === 0) && (q ? (r.n + ' ' + r.t).toLowerCase().includes(q) : r.c === categoria),
      )
      .sort((a, b) => b.s - a.s); // las simples primero
  }, [recetas, dieta, categoria, busqueda, faciles]);

  useEffect(() => { setCantidad(POR_PAGINA); }, [categoria, busqueda, faciles, dieta]);

  if (disponibles.length === 0) {
    return (
      <>
        <Titulo>Recetas</Titulo>
        <Bloqueado id={RECETARIO_DE[suDieta]} email={email} />
      </>
    );
  }

  const chip = (activo: boolean) => `px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${activo ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : 'bg-[var(--k-surface)]'}`;

  return (
    <>
      <Titulo sub={`Sin azúcar y sin gluten · ${producto(RECETARIO_DE[dieta]).nombre}`}>Recetas</Titulo>

      {disponibles.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-3">
          {disponibles.map(d => (
            <button key={d} onClick={() => setDieta(d)} className={chip(dieta === d)}>{NOMBRE_DIETA[d]}</button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-2xl bg-[var(--k-surface)]">
        <button onClick={() => setVista('menu')} className={`py-2.5 rounded-xl text-sm font-bold ${vista === 'menu' ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : ''}`}>Menú de la semana</button>
        <button onClick={() => setVista('todas')} className={`py-2.5 rounded-xl text-sm font-bold ${vista === 'todas' ? 'bg-[var(--k-accent)] text-[var(--k-on-accent)]' : ''}`}>Todas las recetas</button>
      </div>

      {!recetas && <div className="py-12 flex justify-center"><Cargador size={112} texto="Cargando recetas…" /></div>}

      {recetas && vista === 'menu' && (
        tiene('plan_comidas') ? (
          <div className="space-y-6">
            <p className="text-sm text-[var(--k-muted)]">Semana {menuSemanal(recetas, dieta, undefined, objetivo)[0].semana} de tu menú · cambia cada semana</p>
            {priorizaProteina(objetivo) && (
              <p className="text-sm rounded-2xl bg-[var(--k-accent-soft)] text-[var(--k-ink)] px-4 py-3">
                Como querés bajar grasa, los desayunos y las cenas son altos en proteína: te dan saciedad por más tiempo.
              </p>
            )}
            {menuSemanal(recetas, dieta, undefined, objetivo).map(d => (
              <div key={d.dia}>
                <p className={`text-xs font-bold uppercase tracking-wide ${d.hoy ? 'text-[var(--k-accent)]' : 'text-[var(--k-muted)]'}`}>{d.dia}{d.hoy ? ' · hoy' : ''}</p>
                <div className="mt-2 space-y-2">
                  {d.comidas.map(c => c.receta && <FichaReceta key={c.momento} receta={c.receta} etiqueta={c.momento} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Bloqueado id="plan_comidas" email={email} />
        )
      )}

      {recetas && vista === 'todas' && (
        <>
          <label className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--k-surface)] mb-3">
            <Search size={18} className="text-[var(--k-muted)]" />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por ingrediente o nombre"
              className="flex-1 outline-none bg-transparent"
            />
          </label>
          {!busqueda && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-3">
              {CATEGORIAS.map(c => (
                <button key={c.id} onClick={() => setCategoria(c.id)} className={chip(categoria === c.id)}>{c.nombre}</button>
              ))}
            </div>
          )}
          <label className="flex items-center gap-3 mb-3 text-sm font-semibold">
            <input type="checkbox" checked={faciles} onChange={e => setFaciles(e.target.checked)} className="w-5 h-5 accent-[var(--k-accent)]" />
            Solo ingredientes fáciles de conseguir
          </label>
          <p className="text-sm text-[var(--k-muted)] mb-3">{filtradas.length} recetas</p>
          <div className="space-y-2">
            {filtradas.slice(0, cantidad).map(r => <FichaReceta key={r.c + r.n} receta={r} />)}
          </div>
          {cantidad < filtradas.length && (
            <button onClick={() => setCantidad(cantidad + POR_PAGINA)} className="mt-4 w-full py-3.5 rounded-2xl bg-[var(--k-surface)] font-bold">
              Ver más
            </button>
          )}
        </>
      )}
    </>
  );
};

const Perfil: React.FC<{ usuario: User | null; respuestas: Respuestas; onCambio: (r: Respuestas) => void; compras: ProductoId[] }> = ({ usuario, respuestas, onCambio, compras }) => {
  const select = 'mt-1 w-full px-4 py-3 rounded-2xl bg-[var(--k-surface)] font-semibold';
  return (
    <>
      <Titulo sub={usuario?.email ?? 'Vista previa'}>Perfil</Titulo>

      <p className="text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Tu plan</p>
      <div className="mt-2 space-y-3">
        <label className="block text-sm text-[var(--k-muted)]">Flexiones seguidas
          <select className={select} value={respuestas.flexiones ?? '0'} onChange={e => onCambio({ ...respuestas, flexiones: e.target.value as Respuestas['flexiones'] })}>
            <option value="0">Ninguna todavía</option>
            <option value="1-5">Entre 1 y 5</option>
            <option value="6-15">Entre 6 y 15</option>
            <option value="15+">Más de 15</option>
          </select>
        </label>
        <label className="block text-sm text-[var(--k-muted)]">Días por semana
          <select className={select} value={respuestas.dias ?? 3} onChange={e => onCambio({ ...respuestas, dias: Number(e.target.value) as 3 | 4 | 5 })}>
            <option value={3}>3 días</option>
            <option value={4}>4 días</option>
            <option value={5}>5 días</option>
          </select>
        </label>
        <label className="block text-sm text-[var(--k-muted)]">Minutos por sesión
          <select className={select} value={respuestas.minutos ?? 20} onChange={e => onCambio({ ...respuestas, minutos: Number(e.target.value) as 15 | 20 | 30 })}>
            <option value={15}>10 a 15 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
          </select>
        </label>
        <label className="block text-sm text-[var(--k-muted)]">Alimentación
          <select className={select} value={respuestas.dieta ?? 'omnivoro'} onChange={e => onCambio({ ...respuestas, dieta: e.target.value as Dieta })}>
            {(Object.keys(NOMBRE_DIETA) as Dieta[]).map(d => <option key={d} value={d}>{NOMBRE_DIETA[d]}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-8 text-xs font-bold uppercase tracking-wide text-[var(--k-muted)]">Lo que tenés</p>
      <div className="mt-2 rounded-2xl bg-[var(--k-surface)] p-4 space-y-2">
        {compras.length === 0 && <p className="text-sm text-[var(--k-muted)]">Todavía no hay compras asociadas a este mail.</p>}
        {compras.map(id => (
          <p key={id} className="text-sm flex items-center gap-2"><Check size={16} className="text-[var(--k-accent)]" />{producto(id).nombre}</p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[var(--k-surface)] p-4">
        <p className="font-bold">Hábitos que acompañan</p>
        <ul className="mt-2 text-sm space-y-1 list-disc pl-5 text-[var(--k-ink)]">
          <li>Tomá agua durante el día, más los días que entrenás.</li>
          <li>Apuntá a dormir 7 horas o más.</li>
          <li>Caminá todos los días, aunque sea un rato.</li>
        </ul>
      </div>

      {usuario && (
        <button onClick={() => logOut()} className="mt-8 w-full py-3.5 rounded-2xl bg-[var(--k-surface)] font-bold flex items-center justify-center gap-2">
          <LogOut size={18} /> Cerrar sesión
        </button>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Trophy,
  Dumbbell,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../../context/FitnessContext';
import { calculateFitnessScores } from '../../services/adaptiveEngine';
import { ProgressRing } from '../common/ProgressRing';
import { t } from '../../i18n';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose }) => {
  const { submitAssessment } = useFitness();
  const [assessmentStep, setAssessmentStep] = useState<'intro' | 'pushup' | 'squat' | 'plank' | 'mobility' | 'results'>('intro');

  // Pushup Test State
  const [pushupVariation, setPushupVariation] = useState<'wall' | 'incline' | 'knee' | 'standard'>('incline');
  const [pushupReps, setPushupReps] = useState(10);

  // Squat Test State
  const [squatReps, setSquatReps] = useState(18);

  // Plank Test State (with real timer!)
  const [plankSeconds, setPlankSeconds] = useState(35);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mobility Test State (1 to 5)
  const [mobilityRating, setMobilityRating] = useState(3);

  // Calculated Results
  const [results, setResults] = useState<ReturnType<typeof calculateFitnessScores> | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPlankSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const handleComputeResults = () => {
    const computed = calculateFitnessScores({
      pushupVariation,
      pushupReps,
      squatReps,
      plankSeconds,
      mobilityScore: mobilityRating
    });
    setResults(computed);
    submitAssessment(computed);
    setAssessmentStep('results');

    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#56B89D', '#F5D5C2', '#E9A06D', '#20312D']
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md overflow-y-auto">
      <div 
        id="assessment-modal"
        className="relative w-full max-w-lg bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* INTRO STEP */}
        {assessmentStep === 'intro' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center mx-auto shadow-sm">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                {t('assessment.title')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#20312D] mt-1">
                Descubramos tu punto de partida
              </h2>
              <p className="text-sm text-[#6F7D78] mt-2 max-w-md mx-auto">
                Tomará unos 5 a 10 minutos. Evaluaremos fuerza de empuje, resistencia de piernas, estabilidad del core y movilidad para calibrar tu nivel inicial sin suposiciones.
              </p>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-4 text-left space-y-2 text-xs text-[#6F7D78]">
              <div className="flex items-center gap-2 font-bold text-[#20312D]">
                <ShieldCheck className="w-4 h-4 text-[#56B89D]" />
                <span>Calibración de rendimiento físico (no médica)</span>
              </div>
              <p>
                Los puntajes son estimaciones funcionales para ajustar tus rutinas, no diagnósticos de salud. Suspendé la prueba de inmediato si sentís cualquier dolor articular.
              </p>
            </div>

            <button
              onClick={() => setAssessmentStep('pushup')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#20312D] text-white font-extrabold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <span>Comenzar Prueba 1: Empuje de tren superior</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: PUSH-UP TEST */}
        {assessmentStep === 'pushup' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Prueba 1 de 4 • Tren superior
              </span>
              <h2 className="text-2xl font-black text-[#20312D] mt-1">
                Capacidad de flexiones
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Elegí tu variante y anotá cuántas repeticiones continuas podés realizar con técnica limpia sin detenerte.
              </p>
            </div>

            {/* Variation Selection */}
            <div>
              <label className="block text-xs font-bold text-[#20312D] mb-2">Variante seleccionada</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'wall', label: 'En pared' },
                  { id: 'incline', label: 'Inclinadas (banco/silla)' },
                  { id: 'knee', label: 'De rodillas' },
                  { id: 'standard', label: 'Estándar (en suelo)' }
                ].map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPushupVariation(v.id as any)}
                    className={`
                      p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer
                      ${pushupVariation === v.id ? 'bg-[#56B89D] text-white border-[#56B89D] shadow-xs' : 'bg-white/80 text-[#20312D] border-black/5'}
                    `}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rep Counter */}
            <div className="bg-white/80 border border-white rounded-3xl p-6 text-center space-y-4 shadow-xs">
              <span className="text-xs text-[#6F7D78] font-semibold">Repeticiones logradas</span>
              <div className="text-5xl font-black text-[#20312D] tracking-tight">
                {pushupReps}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPushupReps(Math.max(0, pushupReps - 1))}
                  className="w-12 h-12 rounded-2xl bg-white border border-black/10 text-xl font-bold flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setPushupReps(pushupReps + 1)}
                  className="w-12 h-12 rounded-2xl bg-white border border-black/10 text-xl font-bold flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setAssessmentStep('squat')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#20312D] text-white font-extrabold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <span>Siguiente prueba: Tren inferior</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SQUAT TEST */}
        {assessmentStep === 'squat' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Prueba 2 de 4 • Resistencia de tren inferior
              </span>
              <h2 className="text-2xl font-black text-[#20312D] mt-1">
                Sentadillas libres (peso corporal)
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Realizá sentadillas completas con buena profundidad durante 45 segundos. Mantené el torso firme y los talones apoyados.
              </p>
            </div>

            <div className="bg-white/80 border border-white rounded-3xl p-6 text-center space-y-4 shadow-xs">
              <span className="text-xs text-[#6F7D78] font-semibold">Repeticiones contadas</span>
              <div className="text-5xl font-black text-[#20312D] tracking-tight">
                {squatReps}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setSquatReps(Math.max(0, squatReps - 1))}
                  className="w-12 h-12 rounded-2xl bg-white border border-black/10 text-xl font-bold flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setSquatReps(squatReps + 1)}
                  className="w-12 h-12 rounded-2xl bg-white border border-black/10 text-xl font-bold flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setAssessmentStep('plank')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#20312D] text-white font-extrabold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <span>Siguiente prueba: Resistencia de core</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: PLANK TEST */}
        {assessmentStep === 'plank' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Prueba 3 de 4 • Core y estabilidad
              </span>
              <h2 className="text-2xl font-black text-[#20312D] mt-1">
                Plancha isométrica sobre antebrazos
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Mantené una plancha estricta durante el mayor tiempo posible sin que la cadera caiga ni se eleve.
              </p>
            </div>

            <div className="bg-white/80 border border-white rounded-3xl p-6 text-center space-y-4 shadow-xs">
              <span className="text-xs text-[#6F7D78] font-semibold">Tiempo sostenido</span>
              <div className="text-5xl font-mono font-black text-[#20312D] tracking-tight">
                {plankSeconds} <span className="text-xl font-normal text-[#6F7D78]">seg</span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer
                    ${isTimerRunning ? 'bg-[#E9A06D] text-white' : 'bg-[#56B89D] text-white'}
                  `}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pausar' : 'Iniciar cronómetro'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setPlankSeconds(0);
                  }}
                  className="p-2.5 rounded-2xl bg-white border border-black/10 text-[#6F7D78] hover:text-[#20312D] cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setPlankSeconds(Math.max(0, plankSeconds - 5))}
                  className="text-xs text-[#6F7D78] underline cursor-pointer"
                >
                  -5s
                </button>
                <span className="text-xs text-[#6F7D78]">•</span>
                <button
                  onClick={() => setPlankSeconds(plankSeconds + 5)}
                  className="text-xs text-[#6F7D78] underline cursor-pointer"
                >
                  +5s
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setAssessmentStep('mobility');
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#20312D] text-white font-extrabold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <span>Siguiente prueba: Movilidad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: MOBILITY TEST */}
        {assessmentStep === 'mobility' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Prueba 4 de 4 • Movilidad funcional
              </span>
              <h2 className="text-2xl font-black text-[#20312D] mt-1">
                Rango articular y flexibilidad
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                ¿Con qué soltura lográs sentarte en una sentadilla profunda y elevar los brazos sobre la cabeza sin compensar con la columna?
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { val: 1, label: 'Muy restringido', desc: 'Caderas, tobillos u hombros tensos; la sentadilla profunda se siente lejana.' },
                { val: 2, label: 'Algo rígido', desc: 'Bajo en sentadilla con talones algo elevados; rigidez en hombros o espalda alta.' },
                { val: 3, label: 'Rango moderado', desc: 'Movilidad estándar cómoda para el día a día con leve rigidez ocasional.' },
                { val: 4, label: 'Buena movilidad', desc: 'Sentadilla profunda con talones apoyados; extensión de brazos fluida.' },
                { val: 5, label: 'Movilidad excepcional', desc: 'Gran apertura de cadera y rotación de hombros sin restricciones ni tensión.' }
              ].map(item => (
                <div
                  key={item.val}
                  onClick={() => setMobilityRating(item.val)}
                  className={`
                    p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between
                    ${mobilityRating === item.val ? 'bg-white border-[#56B89D] shadow-xs' : 'bg-white/60 border-black/5'}
                  `}
                >
                  <div>
                    <span className="text-xs font-bold text-[#20312D] block">{item.label}</span>
                    <span className="text-[11px] text-[#6F7D78]">{item.desc}</span>
                  </div>
                  {mobilityRating === item.val && (
                    <div className="w-5 h-5 rounded-full bg-[#56B89D] flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleComputeResults}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#56B89D] hover:bg-[#46A389] text-white font-black text-sm shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calcular nivel inicial y puntaje</span>
            </button>
          </div>
        )}

        {/* STEP 5: RESULTS & CALIBRATION DISPLAY */}
        {assessmentStep === 'results' && results && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Evaluación completada
              </span>
              <h2 className="text-3xl font-black text-[#20312D] mt-1">
                Tu nivel físico inicial
              </h2>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                Línea base calibrada. Estimación funcional para dosificar tus rutinas, no un indicador médico.
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex justify-center my-2">
              <ProgressRing 
                progress={results.overallScore} 
                size={140} 
                strokeWidth={12}
                color="#56B89D"
                backgroundColor="#DCEFE8"
              >
                <div className="text-3xl font-black text-[#20312D] leading-none">
                  {results.overallScore}
                </div>
                <span className="text-[11px] font-bold text-[#6F7D78] uppercase mt-1">
                  / 100 Puntos
                </span>
              </ProgressRing>
            </div>

            {/* Starting Level Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#DCEFE8] to-[#F5D5C2] text-[#20312D] font-extrabold text-sm shadow-xs">
              <Trophy className="w-4 h-4 text-[#E9A06D]" />
              <span>Nivel inicial: Nivel {results.calculatedLevel}</span>
            </div>

            {/* Subscores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Fuerza</span>
                <span className="text-xl font-black text-[#20312D]">{results.strengthScore}</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Resistencia</span>
                <span className="text-xl font-black text-[#20312D]">{results.enduranceScore}</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Core</span>
                <span className="text-xl font-black text-[#20312D]">{results.coreScore}</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Movilidad</span>
                <span className="text-xl font-black text-[#20312D]">{results.mobilityScore}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#6F7D78] bg-white/60 p-3 rounded-2xl border border-black/5 text-left">
              <span className="font-bold text-[#20312D] block mb-0.5">Tu plan adaptativo de 4 semanas está listo</span>
              Tus entrenamientos se calibrarán automáticamente con cada sesión completada. Brindá tu feedback al terminar para progresar con precisión.
            </div>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#20312D] text-white font-black text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <span>Ir al entrenamiento de hoy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


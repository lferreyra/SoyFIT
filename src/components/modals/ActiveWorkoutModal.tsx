import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  RefreshCw, 
  Check, 
  Clock, 
  Flame, 
  Info, 
  ShieldAlert, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Trophy,
  Dumbbell,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../../context/FitnessContext';
import { getExerciseById } from '../../services/adaptiveEngine';
import { WorkoutFeedbackRating, PostWorkoutFeeling, PhysicalLimitation } from '../../types/fitness';
import { CATEGORY_LABELS_ES } from '../../i18n';
import { RestRecoveryClock } from '../workout/RestRecoveryClock';
import { ExerciseProgressClock } from '../workout/ExerciseProgressClock';
import { playTransitionBeep } from '../../services/reminderSound';
import { getAssetUrl } from '../../utils/assets';

const AILMENT_OPTIONS: { id: PhysicalLimitation; label: string; icon: string }[] = [
  { id: 'none', label: 'Sin dolor ni molestias', icon: '✨' },
  { id: 'back', label: 'Espalda baja / Lumbar', icon: '🛡️' },
  { id: 'knee', label: 'Rodillas', icon: '🦵' },
  { id: 'shoulder', label: 'Hombros', icon: '🦾' },
  { id: 'neck', label: 'Cuello / Cervical', icon: '🧣' },
  { id: 'wrist', label: 'Muñecas / Codos', icon: '🖐️' },
  { id: 'hip', label: 'Caderas / Tobillos', icon: '🦶' },
];

const WARMUP_STEPS = [
  {
    number: 1,
    name: 'Gato-Camello fluido (Cat-Cow)',
    desc: '8 a 10 ciclos lentos para lubricar discos espinales y descomprimir columna.',
    duration: '45s',
    imageUrl: '/src/assets/images/postura_gato_1791287487776.jpg'
  },
  {
    number: 2,
    name: 'Puente de glúteos suave',
    desc: '8 reps con pausa de 1 segundo arriba para despertar glúteos y quitar sobrecarga lumbar.',
    duration: '45s',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    number: 3,
    name: 'Rotación torácica y respiración diafragmática',
    desc: '5 por lado con apertura de pecho y movilidad escapular controlada.',
    duration: '45s',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  }
];

export const ActiveWorkoutModal: React.FC = () => {
  const { 
    user,
    activeWorkout, 
    cancelActiveWorkout, 
    finishActiveWorkout, 
    replaceExerciseInActiveWorkout,
    recalibrateWorkoutWithLimitations,
    gamification,
    setIsAssessmentModalOpen
  } = useFitness();

  const [isPreviewStage, setIsPreviewStage] = useState(true);
  const [isAilmentsAccordionOpen, setIsAilmentsAccordionOpen] = useState(false);
  const [ailmentFeedback, setAilmentFeedback] = useState<string | null>(null);
  const [isWarmupExpanded, setIsWarmupExpanded] = useState(true);

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedTotalSeconds, setElapsedTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Interval timer for timed exercises or rest countdown
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(45);
  const [totalRestSeconds, setTotalRestSeconds] = useState(45);
  const [timerExerciseSeconds, setTimerExerciseSeconds] = useState(0);

  // Replacement modal within workout
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [replaceNotice, setReplaceNotice] = useState<string | null>(null);

  // Feedback step at end
  const [isCompletionScreen, setIsCompletionScreen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<WorkoutFeedbackRating>('perfect');
  const [selectedFeeling, setSelectedFeeling] = useState<PostWorkoutFeeling>('great');

  // Reset all session state whenever a new workout is loaded or started
  useEffect(() => {
    if (activeWorkout) {
      setIsPreviewStage(true);
      setIsWarmupExpanded(true);
      setCurrentExIndex(0);
      setCurrentSet(1);
      setElapsedTotalSeconds(0);
      setIsPaused(false);
      setIsResting(false);
      setIsCompletionScreen(false);
      setTimerExerciseSeconds(0);
      setSelectedFeedback('perfect');
      setSelectedFeeling('great');
      setTotalRestSeconds(45);
      setRestSecondsLeft(45);
    }
  }, [activeWorkout?.id]);

  const totalExercises = activeWorkout?.exercises?.length || 0;
  const safeIndex = totalExercises > 0 ? Math.min(Math.max(0, currentExIndex), totalExercises - 1) : 0;
  const currentExercise = (activeWorkout?.exercises && activeWorkout.exercises[safeIndex]) || (activeWorkout?.exercises && activeWorkout.exercises[0]) || null;
  const fullExerciseData = currentExercise ? getExerciseById(currentExercise.exerciseId) : null;
  const isTimedExercise = !!currentExercise?.targetDurationSeconds;

  // Global workout elapsed timer
  useEffect(() => {
    if (!activeWorkout || isCompletionScreen || isPaused || isPreviewStage) return;
    const interval = setInterval(() => {
      setElapsedTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout, isCompletionScreen, isPaused, isPreviewStage]);

  // Rest countdown timer: auto-advances when reaching 0 without button presses
  useEffect(() => {
    let interval: any = null;
    if (activeWorkout && isResting && !isPaused && !isPreviewStage) {
      interval = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            // Rest finished! Auto-start next set or exercise immediately
            setIsResting(false);
            setTimerExerciseSeconds(0);
            try { playTransitionBeep(false); } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting, isPaused, isPreviewStage]);

  // Exercise countdown timer: runs automatically for timed exercises AND rep-based sets
  useEffect(() => {
    let interval: any = null;
    if (activeWorkout && !isResting && !isPaused && !isCompletionScreen && !isPreviewStage && currentExercise) {
      interval = setInterval(() => {
        setTimerExerciseSeconds(prev => {
          const target = isTimedExercise
            ? (currentExercise.targetDurationSeconds || 30)
            : Math.max(20, Math.min(60, (currentExercise.targetReps || 10) * 3));

          if (prev + 1 >= target) {
            // Auto-advance set to rest countdown!
            handleCompleteSet();
            try { playTransitionBeep(true); } catch {}
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isTimedExercise, isResting, isPaused, isCompletionScreen, isPreviewStage, currentExIndex, currentSet, currentExercise]);

  if (!activeWorkout || !activeWorkout.exercises || activeWorkout.exercises.length === 0 || !currentExercise) {
    return null;
  }

  const handleAdjustRestTime = (deltaSeconds: number) => {
    setRestSecondsLeft(prev => {
      const nextVal = Math.max(0, prev + deltaSeconds);
      if (nextVal === 0) {
        setIsResting(false);
        return 0;
      }
      return nextVal;
    });
    if (deltaSeconds > 0) {
      setTotalRestSeconds(prev => Math.max(prev, restSecondsLeft + deltaSeconds));
    }
  };

  const handleToggleAilment = (id: PhysicalLimitation) => {
    const currentLimits: PhysicalLimitation[] = user?.limitations || ['none'];
    let newLimits: PhysicalLimitation[] = [];
    if (id === 'none') {
      newLimits = ['none'];
    } else {
      const withoutNone = currentLimits.filter(l => l !== 'none');
      if (withoutNone.includes(id)) {
        newLimits = withoutNone.filter(l => l !== id);
        if (newLimits.length === 0) newLimits = ['none'];
      } else {
        newLimits = [...withoutNone, id];
      }
    }
    recalibrateWorkoutWithLimitations(newLimits);
    const names = newLimits.includes('none')
      ? 'Modo estándar (sin restricciones)'
      : newLimits.map(l => AILMENT_OPTIONS.find(o => o.id === l)?.label || l).join(', ');
    setAilmentFeedback(`🛡️ Plan calibrado: protección activa para ${names}`);
    setTimeout(() => setAilmentFeedback(null), 4000);
  };

  const handleCompleteSet = () => {
    if (currentSet < currentExercise.targetSets) {
      setCurrentSet(prev => prev + 1);
      setTimerExerciseSeconds(0);
      const rest = currentExercise.restSeconds || 45;
      setTotalRestSeconds(rest);
      setRestSecondsLeft(rest);
      setIsResting(true);
    } else {
      // Completed all sets for this exercise
      if (currentExIndex < totalExercises - 1) {
        setCurrentExIndex(prev => prev + 1);
        setCurrentSet(1);
        setTimerExerciseSeconds(0);
        const nextEx = activeWorkout.exercises[currentExIndex + 1];
        const rest = nextEx?.restSeconds || currentExercise.restSeconds || 45;
        setTotalRestSeconds(rest);
        setRestSecondsLeft(rest);
        setIsResting(true);
      } else {
        // Finished whole workout!
        setIsCompletionScreen(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#56B89D', '#F5D5C2', '#E9A06D', '#20312D']
          });
        } catch {}
      }
    }
  };

  const handleSkipExercise = () => {
    if (safeIndex < totalExercises - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimerExerciseSeconds(0);
    } else {
      setIsCompletionScreen(true);
    }
  };

  const handleExecuteReplacement = (reason: 'too_easy' | 'too_hard' | 'no_equipment' | 'pain_discomfort' | 'different') => {
    const res = replaceExerciseInActiveWorkout(safeIndex, reason);
    setReplaceNotice(res.advice);
    setIsReplaceModalOpen(false);
    setTimeout(() => setReplaceNotice(null), 5000);
  };

  const handleFinalSubmit = () => {
    finishActiveWorkout(selectedFeedback, selectedFeeling, elapsedTotalSeconds);
    setIsCompletionScreen(false);
    setCurrentExIndex(0);
    setCurrentSet(1);
    setElapsedTotalSeconds(0);
    setIsResting(false);
  };

  const handleClose = () => {
    cancelActiveWorkout();
    setIsCompletionScreen(false);
    setCurrentExIndex(0);
    setCurrentSet(1);
    setElapsedTotalSeconds(0);
    setIsResting(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xl ${isPreviewStage || isCompletionScreen ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <div 
        id="active-workout-runner"
        className={`relative w-full ${
          isPreviewStage || isCompletionScreen
            ? 'max-w-xl bg-[#F4F3EC] border border-white/80 rounded-[32px] p-4 sm:p-6 shadow-2xl my-auto text-[#20312D] overflow-hidden max-h-[92vh] flex flex-col justify-between'
            : 'max-w-md bg-[#121B18] border border-white/15 rounded-[28px] p-3 sm:p-4 shadow-2xl my-auto text-white overflow-hidden max-h-[96vh] flex flex-col justify-between select-none'
        }`}
      >
        {/* Replacement Notice Alert */}
        {replaceNotice && (
          <div className="absolute top-4 left-6 right-6 z-20 bg-[#DCEFE8] border border-[#56B89D] text-[#20312D] text-xs font-semibold px-4 py-3 rounded-2xl shadow-md flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <Info className="w-4 h-4 text-[#56B89D] shrink-0" />
            <span>{replaceNotice}</span>
          </div>
        )}

        {/* WORKOUT COMPLETION & FEEDBACK VIEW */}
        {isCompletionScreen ? (
          <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#56B89D] uppercase">
                Sesión finalizada
              </span>
              <h2 className="text-3xl font-black text-[#20312D] mt-1 tracking-tight">
                ¡Entrenamiento completado!
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                ¡Excelente constancia! Tu esfuerzo calibra de inmediato tu modelo adaptativo.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-2 text-left">
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Tiempo</span>
                <span className="text-lg font-black text-[#20312D]">{formatTime(elapsedTotalSeconds)}</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Gasto est.</span>
                <span className="text-lg font-black text-[#20312D]">~{Math.round((elapsedTotalSeconds / 60) * 9.5)} kcal</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">XP ganada</span>
                <span className="text-lg font-black text-[#56B89D]">+150 XP</span>
              </div>
              <div className="bg-white/80 border border-white rounded-2xl p-3">
                <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Racha</span>
                <span className="text-lg font-black text-[#E9A06D]">🔥 {gamification.currentStreakDays} días</span>
              </div>
            </div>

            {/* ADAPTIVE QUESTION 1: HOW DID THAT FEEL? */}
            <div className="bg-white/80 border border-white rounded-3xl p-5 text-left space-y-3">
              <div>
                <h4 className="text-sm font-black text-[#20312D]">
                  ¿Cómo se sintió el entrenamiento?
                </h4>
                <p className="text-[11px] text-[#6F7D78]">
                  El motor adaptativo ajusta el volumen y las repeticiones de tu próxima rutina según esta respuesta.
                </p>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'too_easy', label: 'Muy suave' },
                  { id: 'easy', label: 'Suave' },
                  { id: 'perfect', label: 'Perfecto' },
                  { id: 'hard', label: 'Exigente' },
                  { id: 'too_hard', label: 'Muy exigente' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedFeedback(r.id as WorkoutFeedbackRating)}
                    className={`
                      py-2.5 px-1 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer
                      ${selectedFeedback === r.id ? 'bg-[#20312D] text-white border-[#20312D] shadow-xs' : 'bg-white text-[#6F7D78] border-black/5 hover:bg-gray-50'}
                    `}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 2: RECOVERY FEELING */}
            <div className="bg-white/80 border border-white rounded-3xl p-5 text-left space-y-3">
              <h4 className="text-sm font-black text-[#20312D]">
                ¿Cómo están tu energía y tus músculos ahora mismo?
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'great', label: 'Genial ⚡' },
                  { id: 'good', label: 'Bien 👍' },
                  { id: 'okay', label: 'Regular 😐' },
                  { id: 'tired', label: 'Fatigado 💤' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFeeling(f.id as PostWorkoutFeeling)}
                    className={`
                      py-2 px-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer
                      ${selectedFeeling === f.id ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5 hover:bg-gray-50'}
                    `}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-4 rounded-2xl bg-[#56B89D] hover:bg-[#46A389] text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Guardar progreso y actualizar plan adaptativo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : isPreviewStage ? (
          /* PRE-WORKOUT PREVIEW & EXERCISE INSTRUCTION LIST */
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Bar: Title, Stats & Close */}
            <div className="flex items-start justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#56B89D] block">
                  Vista Previa de la Sesión
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#20312D] tracking-tight mt-0.5">
                  {activeWorkout.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#6F7D78] font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>{activeWorkout.estimatedDurationMinutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>{totalExercises} ejercicios</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#E9A06D]" />
                    <span>~{activeWorkout.estimatedCalories} kcal</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelActiveWorkout}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer shrink-0 border border-black/5"
                title="Cerrar y volver"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable container for preview items */}
            <div className="max-h-[62vh] overflow-y-auto pr-1 space-y-4 text-left">
              {/* FEEDBACK TOAST IF AILMENT WAS TOGGLED */}
              {ailmentFeedback && (
                <div className="bg-[#EBF5F1] border border-[#56B89D] text-[#20312D] rounded-2xl p-3 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <ShieldCheck className="w-4 h-4 text-[#3A8E77] shrink-0" />
                  <span>{ailmentFeedback}</span>
                </div>
              )}

              {/* 1) ACORDEÓN DESPLEGABLE DE DOLENCIAS (Antes de la entrada en calor) */}
              <div className="bg-white/90 border border-black/10 rounded-3xl p-4 shadow-sm space-y-3 transition-all">
                <button
                  type="button"
                  onClick={() => setIsAilmentsAccordionOpen(!isAilmentsAccordionOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-2xl bg-[#EBF5F1] text-[#3A8E77] flex items-center justify-center shrink-0 border border-[#56B89D]/30">
                      <ShieldCheck className="w-5 h-5 text-[#3A8E77]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#3A8E77] bg-[#DCEFE8] px-2 py-0.5 rounded-full">
                          Calibración Articular
                        </span>
                        {user?.limitations && !user.limitations.includes('none') && user.limitations.length > 0 ? (
                          <span className="text-[10px] font-extrabold text-[#E9A06D] truncate">
                            {user.limitations.length} {user.limitations.length === 1 ? 'zona protegida' : 'zonas protegidas'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500">Sin molestias</span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#20312D] mt-0.5 truncate">
                        ¿Sentís alguna molestia o dolor hoy?
                      </h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#6F7D78] shrink-0 transition-transform duration-200 ${isAilmentsAccordionOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAilmentsAccordionOpen && (
                  <div className="pt-2 border-t border-black/5 space-y-2 animate-in fade-in duration-200">
                    <p className="text-[11px] text-[#6F7D78]">
                      Tocá una zona para protegerla inmediatamente. Adaptamos los ejercicios en tiempo real para evitar dolor y cuidar tu salud:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {AILMENT_OPTIONS.map(opt => {
                        const isSelected = opt.id === 'none'
                          ? (!user?.limitations || user.limitations.includes('none') || user.limitations.length === 0)
                          : (user?.limitations?.includes(opt.id));

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleToggleAilment(opt.id)}
                            className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#20312D] text-white border-[#20312D] shadow-xs'
                                : 'bg-white/70 hover:bg-white text-[#20312D] border-black/5'
                            }`}
                          >
                            <span className="text-base shrink-0">{opt.icon}</span>
                            <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#20312D]'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2) ENTRADA EN CALOR COLAPSABLE CON IMÁGENES EN DEGRADÉ OSCURO (Ajustadas a la sección) */}
              <div className="bg-[#241A1C] text-white rounded-3xl p-4 shadow-sm border border-red-500/20 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsWarmupExpanded(!isWarmupExpanded)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-red-500/20 text-[#E9A06D] flex items-center justify-center shrink-0 border border-red-500/30">
                      <AlertTriangle className="w-5 h-5 text-[#E9A06D]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-widest text-[#E9A06D] uppercase">
                          OBLIGATORIO
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold">• 2 a 3 min</span>
                      </div>
                      <h3 className="text-base font-black text-white mt-0.5">
                        Entrada en calor previa
                      </h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isWarmupExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isWarmupExpanded && (
                  <div className="pt-2 border-t border-white/10 space-y-2.5 animate-in fade-in duration-200">
                    {WARMUP_STEPS.map(step => (
                      <div
                        key={step.number}
                        className="relative h-20 sm:h-22 rounded-2xl overflow-hidden border border-white/10 shadow-sm flex items-center"
                      >
                        {/* Imagen ilustrativa de fondo que se ajusta exactamente al tamaño de la sección */}
                        <img
                          src={getAssetUrl(step.imageUrl)}
                          alt={step.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Degradado oscuro para máxima legibilidad de letras blancas o claras */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/45 p-3.5 flex items-center justify-between text-white z-10">
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="w-7 h-7 rounded-full bg-[#E9A06D] text-[#1C2623] font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                              {step.number}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-sm text-white tracking-tight drop-shadow-xs truncate">
                                {step.name}
                              </h4>
                              <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1 drop-shadow-xs">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#DCEFE8] bg-white/15 px-2.5 py-1 rounded-lg shrink-0 border border-white/15">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3) LISTADO SIMPLE DE LOS EJERCICIOS A REALIZAR (Sin explicaciones largas aquí) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-[#20312D] tracking-tight">
                    Ejercicios de la sesión
                  </h3>
                  <span className="text-xs text-[#6F7D78] font-bold">
                    {totalExercises} movimientos pautados
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeWorkout.exercises.map((ex, idx) => {
                    const full = getExerciseById(ex.exerciseId);

                    return (
                      <div
                        key={ex.exerciseId + idx}
                        className="bg-white/90 border border-black/5 hover:border-black/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Number Badge */}
                          <div className="w-7 h-7 rounded-full bg-[#E9A06D] text-[#1C2623] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {idx + 1}
                          </div>

                          {/* Exercise Thumbnail image adjusted to section */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-black/5 bg-[#14201D]">
                            <img
                              src={getAssetUrl(full?.imageUrl || 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80')}
                              alt={ex.exerciseName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Title & Sets */}
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-[#20312D] truncate">
                              {ex.exerciseName}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6F7D78] font-semibold">
                              <span className="text-[#3A8E77] font-bold">
                                {ex.targetSets} {ex.targetSets === 1 ? 'serie' : 'series'} × {ex.targetReps ? `${ex.targetReps} reps` : `${ex.targetDurationSeconds}s`}
                              </span>
                              <span>•</span>
                              <span>Descanso: {ex.restSeconds || 45}s</span>
                            </div>
                          </div>
                        </div>

                        {/* Protection Badge if adapted */}
                        {ex.notes && (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#3A8E77] text-[10px] font-extrabold border border-[#56B89D]/20 shrink-0">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Adaptado</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Elevated Primary Action Button: Start Workout with Gemini AI Glowing Border Animation */}
            <div className="pt-2">
              <div className="relative group p-[1.5px] rounded-2xl overflow-hidden shadow-lg transition-transform active:scale-[0.99] cursor-pointer">
                {/* Rotating conic light beam around the border (Gemini AI effect) */}
                <div className="gemini-border-glow" />

                {/* Subtle ambient glow behind button */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#56B89D]/20 via-[#A8D5C7]/15 to-[#E9A06D]/20 rounded-2xl blur-xs pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Inner button container */}
                <button
                  type="button"
                  onClick={() => setIsPreviewStage(false)}
                  className="relative z-10 w-full py-3.5 px-5 rounded-[14.5px] bg-[#172421] group-hover:bg-[#1D2E2A] text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] text-[#14201D] flex items-center justify-center shadow-md shrink-0">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-sm text-white tracking-tight leading-snug group-hover:text-[#DCEFE8] transition-colors">
                        Comenzar entrenamiento
                      </span>
                      <span className="block text-[11px] text-gray-400 font-semibold leading-tight">
                        Flujo automático manos libres
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-black text-[#56B89D] bg-white/5 group-hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-[#E9A06D] animate-pulse" />
                    <span>Iniciar</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#56B89D] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE DISTRACTION-FREE RUNNER */
          <div className="space-y-2.5">
            {/* Top Bar: Compact header with iconography */}
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                <span className="text-[11px] font-black text-[#56B89D] uppercase tracking-wider font-mono">
                  {currentExIndex + 1}/{totalExercises}
                </span>
                <span className="text-gray-500">•</span>
                <h3 className="text-xs font-bold text-gray-300 truncate max-w-[140px] sm:max-w-[200px]">
                  {activeWorkout.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
                  <Clock className="w-3 h-3 text-[#56B89D]" />
                  <span>{formatTime(elapsedTotalSeconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewStage(true)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                  title="Ver lista de ejercicios"
                >
                  <Info className="w-3.5 h-3.5 text-[#56B89D]" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                  title="Salir"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* REST STATE OVERLAY OR ACTIVE EXERCISE CLOCK */}
            {isResting ? (
              <RestRecoveryClock
                restSecondsLeft={restSecondsLeft}
                totalRestSeconds={totalRestSeconds}
                currentSet={currentSet}
                targetSets={currentExercise.targetSets}
                nextExerciseName={
                  currentSet < currentExercise.targetSets 
                    ? currentExercise.exerciseName 
                    : currentExIndex < totalExercises - 1 
                      ? activeWorkout.exercises[currentExIndex + 1]?.exerciseName 
                      : 'Último ejercicio completado'
                }
                nextTargetReps={currentSet < currentExercise.targetSets ? currentExercise.targetReps : activeWorkout.exercises[currentExIndex + 1]?.targetReps}
                nextTargetDuration={currentSet < currentExercise.targetSets ? currentExercise.targetDurationSeconds : activeWorkout.exercises[currentExIndex + 1]?.targetDurationSeconds}
                nextExerciseNotes={currentSet < currentExercise.targetSets ? currentExercise.notes : activeWorkout.exercises[currentExIndex + 1]?.notes}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(prev => !prev)}
                onSkipRest={() => setIsResting(false)}
                onAdjustTime={handleAdjustRestTime}
              />
            ) : (
              <ExerciseProgressClock
                exerciseName={currentExercise.exerciseName}
                category={CATEGORY_LABELS_ES[currentExercise.category] || currentExercise.category}
                currentSet={currentSet}
                targetSets={currentExercise.targetSets}
                isTimed={isTimedExercise}
                targetDurationSeconds={currentExercise.targetDurationSeconds}
                timerExerciseSeconds={timerExerciseSeconds}
                targetReps={currentExercise.targetReps}
                briefInstruction={fullExerciseData?.instructions?.[0]}
                safetyNote={currentExercise.notes || fullExerciseData?.safetyNotes}
                instructions={fullExerciseData?.instructions}
                commonMistakes={fullExerciseData?.commonMistakes}
                imageUrl={fullExerciseData?.imageUrl}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(prev => !prev)}
                onCompleteSet={handleCompleteSet}
                onSkipExercise={handleSkipExercise}
                onOpenReplaceModal={() => setIsReplaceModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* EXERCISE REPLACEMENT MODAL SUB-POPUP */}
        {isReplaceModalOpen && (
          <div className="absolute inset-0 z-40 bg-[#F4F3EC]/95 backdrop-blur-md p-6 flex flex-col justify-between rounded-[36px] animate-in fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-[#56B89D] uppercase">Ajuste de ejercicio</span>
                  <h3 className="text-xl font-black text-[#20312D]">¿Por qué querés cambiar {currentExercise.exerciseName}?</h3>
                </div>
                <button 
                  onClick={() => setIsReplaceModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'too_easy', title: 'Muy fácil', desc: 'Avanzar a una variante de mayor dificultad o etapa superior.' },
                  { id: 'too_hard', title: 'Muy difícil', desc: 'Pasar a una regresión más accesible para cuidar las articulaciones.' },
                  { id: 'no_equipment', title: 'Sin equipo disponible', desc: 'Cambiar por una alternativa 100% con peso corporal.' },
                  { id: 'pain_discomfort', title: 'Dolor o molestia articular', desc: 'Descargar de inmediato pasando a movilidad suave.' },
                  { id: 'different', title: 'Quiero una variante distinta', desc: 'Elegir otro movimiento equivalente para el mismo grupo muscular.' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleExecuteReplacement(opt.id as any)}
                    className="w-full p-3.5 rounded-2xl bg-white/90 border border-black/5 text-left hover:border-[#56B89D] transition-all flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#20312D] block">{opt.title}</span>
                      <span className="text-[11px] text-[#6F7D78]">{opt.desc}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6F7D78] shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-[#6F7D78] italic text-center">
              Nota de seguridad: Nunca ignores el dolor. Si sentís un dolor agudo o punzante, detené el ejercicio de inmediato y consultá a un profesional médico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

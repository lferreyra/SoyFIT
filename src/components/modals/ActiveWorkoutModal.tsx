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
  Sparkles,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../../context/FitnessContext';
import { getExerciseById } from '../../services/adaptiveEngine';
import { WorkoutFeedbackRating, PostWorkoutFeeling } from '../../types/fitness';
import { CATEGORY_LABELS_ES } from '../../i18n';

export const ActiveWorkoutModal: React.FC = () => {
  const { 
    activeWorkout, 
    cancelActiveWorkout, 
    finishActiveWorkout, 
    replaceExerciseInActiveWorkout,
    gamification 
  } = useFitness();

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedTotalSeconds, setElapsedTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Interval timer for timed exercises or rest countdown
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(45);
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
      setCurrentExIndex(0);
      setCurrentSet(1);
      setElapsedTotalSeconds(0);
      setIsPaused(false);
      setIsResting(false);
      setIsCompletionScreen(false);
      setTimerExerciseSeconds(0);
      setSelectedFeedback('perfect');
      setSelectedFeeling('great');
    }
  }, [activeWorkout?.id]);

  const totalExercises = activeWorkout?.exercises?.length || 0;
  const safeIndex = totalExercises > 0 ? Math.min(Math.max(0, currentExIndex), totalExercises - 1) : 0;
  const currentExercise = (activeWorkout?.exercises && activeWorkout.exercises[safeIndex]) || (activeWorkout?.exercises && activeWorkout.exercises[0]) || null;
  const fullExerciseData = currentExercise ? getExerciseById(currentExercise.exerciseId) : null;
  const isTimedExercise = !!currentExercise?.targetDurationSeconds;

  // Global workout elapsed timer
  useEffect(() => {
    if (!activeWorkout || isCompletionScreen || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout, isCompletionScreen, isPaused]);

  // Rest countdown timer
  useEffect(() => {
    let interval: any = null;
    if (activeWorkout && isResting && !isPaused) {
      interval = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting, isPaused]);

  // Timed exercise countdown
  useEffect(() => {
    let interval: any = null;
    if (activeWorkout && isTimedExercise && !isResting && !isPaused && !isCompletionScreen && currentExercise) {
      interval = setInterval(() => {
        setTimerExerciseSeconds(prev => {
          const target = currentExercise.targetDurationSeconds || 30;
          if (prev >= target) {
            handleCompleteSet();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isTimedExercise, isResting, isPaused, isCompletionScreen, currentExIndex, currentSet, currentExercise]);

  if (!activeWorkout || !activeWorkout.exercises || activeWorkout.exercises.length === 0 || !currentExercise) {
    return null;
  }

  const handleCompleteSet = () => {
    if (currentSet < currentExercise.targetSets) {
      setCurrentSet(prev => prev + 1);
      setTimerExerciseSeconds(0);
      setRestSecondsLeft(currentExercise.restSeconds || 45);
      setIsResting(true);
    } else {
      // Completed all sets for this exercise
      if (currentExIndex < totalExercises - 1) {
        setCurrentExIndex(prev => prev + 1);
        setCurrentSet(1);
        setTimerExerciseSeconds(0);
        setRestSecondsLeft(currentExercise.restSeconds || 45);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xl overflow-y-auto">
      <div 
        id="active-workout-runner"
        className="relative w-full max-w-2xl bg-[#F4F3EC] border border-white/80 rounded-[36px] p-6 sm:p-8 shadow-2xl my-auto text-[#20312D] overflow-hidden"
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
        ) : (
          /* ACTIVE DISTRACTION-FREE RUNNER */
          <div className="space-y-5">
            {/* Top Bar: Progress, Elapsed time, and Exit */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-[#56B89D] uppercase tracking-wider block">
                  Ejercicio {currentExIndex + 1} de {totalExercises}
                </span>
                <h3 className="text-sm font-bold text-[#6F7D78] truncate max-w-xs">
                  {activeWorkout.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-white text-xs font-mono font-bold text-[#20312D]">
                  <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                  <span>{formatTime(elapsedTotalSeconds)}</span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] cursor-pointer transition-colors"
                  title="Salir del entrenamiento"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Exercise Visual Card */}
            <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-white/80 shadow-md">
              <img 
                src={fullExerciseData?.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'} 
                alt={currentExercise.exerciseName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#DCEFE8]">
                  {CATEGORY_LABELS_ES[currentExercise.category] || currentExercise.category} • Etapa {fullExerciseData?.progressionLevel || 1}
                </span>
                <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">
                  {currentExercise.exerciseName}
                </h2>
              </div>
            </div>

            {/* REST STATE OVERLAY OR ACTIVE TARGET DISPLAY */}
            {isResting ? (
              <div className="bg-[#DCEFE8]/90 border border-white rounded-3xl p-6 text-center space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-[#20312D] uppercase tracking-widest">
                  Descanso y recuperación
                </span>
                <div className="text-6xl font-black font-mono text-[#20312D]">
                  {restSecondsLeft}s
                </div>
                <p className="text-xs text-[#6F7D78]">
                  Respirá profundo y controlado. Siguiente: Serie {currentSet} de {currentExercise.targetSets}
                </p>
                <button
                  onClick={() => setIsResting(false)}
                  className="px-6 py-2 rounded-full bg-[#20312D] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Omitir descanso
                </button>
              </div>
            ) : (
              <div className="bg-white/80 border border-white rounded-3xl p-6 text-center space-y-3 shadow-xs">
                {/* Sets Pill */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 text-xs font-extrabold text-[#20312D]">
                  SERIE {currentSet} DE {currentExercise.targetSets}
                </div>

                {/* Big Target Metric */}
                {isTimedExercise ? (
                  <div>
                    <div className="text-6xl font-black font-mono text-[#20312D] tracking-tight">
                      {(currentExercise.targetDurationSeconds || 30) - timerExerciseSeconds}
                      <span className="text-xl font-normal text-[#6F7D78] ml-1">seg</span>
                    </div>
                    <span className="text-xs text-[#6F7D78] font-semibold">Mantené la tensión constante</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl font-black text-[#20312D] tracking-tight">
                      {currentExercise.targetReps}
                      <span className="text-xl font-bold text-[#6F7D78] ml-1.5 uppercase">Reps</span>
                    </div>
                    <span className="text-xs text-[#6F7D78] font-semibold">Ritmo controlado y técnica prolija</span>
                  </div>
                )}

                {/* Coaching cue */}
                {currentExercise.notes && (
                  <div className="text-xs text-[#6F7D78] italic pt-1 max-w-md mx-auto">
                    💡 "{currentExercise.notes}"
                  </div>
                )}
              </div>
            )}

            {/* CONTROLS */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsReplaceModalOpen(true)}
                className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white/80 border border-black/5 text-xs font-bold text-[#6F7D78] hover:text-[#20312D] hover:bg-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mb-1 text-[#56B89D]" />
                <span>Cambiar</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white/80 border border-black/5 text-xs font-bold text-[#6F7D78] hover:text-[#20312D] hover:bg-white transition-all cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4 mb-1 text-[#E9A06D]" /> : <Pause className="w-4 h-4 mb-1 text-[#6F7D78]" />}
                <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
              </button>

              <button
                type="button"
                onClick={handleSkipExercise}
                className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white/80 border border-black/5 text-xs font-bold text-[#6F7D78] hover:text-[#20312D] hover:bg-white transition-all cursor-pointer"
              >
                <SkipForward className="w-4 h-4 mb-1 text-[#6F7D78]" />
                <span>Saltear</span>
              </button>
            </div>

            {/* PRIMARY ACTION: COMPLETE SET */}
            <button
              onClick={handleCompleteSet}
              className="w-full py-4 rounded-2xl bg-[#20312D] hover:bg-black text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5 text-[#56B89D]" />
              <span>
                {currentSet < currentExercise.targetSets 
                  ? `Completar serie ${currentSet}` 
                  : currentExIndex < totalExercises - 1 ? 'Siguiente ejercicio' : 'Terminar entrenamiento'
                }
              </span>
            </button>
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

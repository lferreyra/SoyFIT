import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Sparkles, 
  Sliders, 
  Clock, 
  Flame, 
  CheckCircle2, 
  X,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard, GlassPill } from '../common/GlassCard';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { Exercise } from '../../types/fitness';
import { t, CATEGORY_LABELS_ES, DIFFICULTY_LABELS_ES, formatCalories } from '../../i18n';

export const TrainView: React.FC = () => {
  const { 
    user,
    todayWorkout, 
    startWorkout, 
    launchQuickWorkout, 
    generateCustomSession, 
    program,
    setIsGoalModalOpen
  } = useFitness();

  // Custom Workout Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [customGoal, setCustomGoal] = useState('strength');
  const [customDuration, setCustomDuration] = useState(25);
  const [customDifficulty, setCustomDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [customFocus, setCustomFocus] = useState<'Full body' | 'Upper body' | 'Lower body' | 'Core' | 'Mobility'>('Full body');

  // Exercise Library Browser State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);

  const categories = [
    { id: 'All', label: 'Todos' },
    { id: 'Calisthenics', label: 'Calistenia' },
    { id: 'Strength', label: 'Fuerza' },
    { id: 'Core', label: 'Zona media' },
    { id: 'Mobility', label: 'Movilidad' },
    { id: 'Functional', label: 'Funcional' },
    { id: 'Cardio', label: 'Cardio' },
  ];

  // Filtered exercises
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesQuery = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleGenerateAndStart = () => {
    generateCustomSession({
      goal: customGoal,
      durationMinutes: customDuration,
      difficulty: customDifficulty,
      equipment: ['bodyweight'],
      focus: customFocus
    });
    setIsGeneratorOpen(false);
  };

  const focusLabels: Record<string, string> = {
    'Full body': 'Cuerpo completo',
    'Upper body': 'Tren superior',
    'Lower body': 'Tren inferior',
    'Core': 'Zona media',
    'Mobility': 'Movilidad'
  };

  const dayAbbrES: Record<string, string> = {
    'Monday': 'LUN',
    'Tuesday': 'MAR',
    'Wednesday': 'MIÉ',
    'Thursday': 'JUE',
    'Friday': 'VIE',
    'Saturday': 'SÁB',
    'Sunday': 'DOM',
    'Lunes': 'LUN',
    'Martes': 'MAR',
    'Miércoles': 'MIÉ',
    'Jueves': 'JUE',
    'Viernes': 'VIE',
    'Sábado': 'SÁB',
    'Domingo': 'DOM',
  };

  const todayCategoryLabel = CATEGORY_LABELS_ES[todayWorkout.category] || todayWorkout.category;

  return (
    <div id="train-dashboard" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#20312D] tracking-tight">
          {t('train.title')}
        </h1>
        <p className="text-sm text-[#6F7D78] mt-0.5">
          {t('train.subtitle')}
        </p>
      </div>

      {/* TODAY'S FEATURED WORKOUT HERO */}
      <GlassCard className="p-6 sm:p-7 bg-white/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-black uppercase tracking-wider">
                {t('train.recommendedToday')}
              </span>
              <span className="text-xs text-[#6F7D78] font-bold">
                {todayCategoryLabel}
              </span>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-[#DCEFE8] text-[10px] font-extrabold text-[#20312D] transition-colors cursor-pointer"
                title="Modificar objetivo principal"
              >
                <Target className="w-3 h-3 text-[#56B89D]" />
                <span className="capitalize">{user.primaryGoal ? user.primaryGoal.replace(/_/g, ' ') : 'Fuerza'}</span>
              </button>
            </div>
            <h2 className="text-2xl font-black text-[#20312D] tracking-tight">
              {todayWorkout.title}
            </h2>
            <p className="text-xs text-[#6F7D78] leading-relaxed">
              "{todayWorkout.rationale}"
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#20312D] pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#56B89D]" />
                {todayWorkout.estimatedDurationMinutes} min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E9A06D]" />
                ~{formatCalories(todayWorkout.estimatedCalories)}
              </span>
              <span>•</span>
              <span>{todayWorkout.exercises.length} movimientos</span>
            </div>
          </div>

          <button
            onClick={() => startWorkout(todayWorkout)}
            className="self-start sm:self-center px-6 py-4 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2.5 shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-[#56B89D]" />
            <span>{t('train.startSession')}</span>
          </button>
        </div>
      </GlassCard>

      {/* WORKOUT GENERATOR & QUICK OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* QUICK WORKOUT STRIP */}
        <div className="md:col-span-6">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
                Sin excusas
              </span>
              <h3 className="text-xl font-black text-[#20312D] mt-0.5 mb-2">
                {t('train.quickWorkouts')}
              </h3>
              <p className="text-xs text-[#6F7D78]">
                Sesiones instantáneas ajustadas a bloques exactos de tiempo.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4">
              <button
                onClick={() => launchQuickWorkout(5)}
                className="p-3 rounded-2xl bg-white border border-black/5 hover:border-[#56B89D] text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-black text-[#20312D]">5 min</div>
                <div className="text-[10px] text-[#6F7D78] mt-0.5">Movilidad</div>
              </button>
              <button
                onClick={() => launchQuickWorkout(10)}
                className="p-3 rounded-2xl bg-white border border-black/5 hover:border-[#56B89D] text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-black text-[#20312D]">10 min</div>
                <div className="text-[10px] text-[#6F7D78] mt-0.5">Cuerpo total</div>
              </button>
              <button
                onClick={() => launchQuickWorkout(15)}
                className="p-3 rounded-2xl bg-white border border-black/5 hover:border-[#56B89D] text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-black text-[#20312D]">15 min</div>
                <div className="text-[10px] text-[#6F7D78] mt-0.5">Metabólico</div>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* CUSTOM GENERATOR TRIGGER CARD */}
        <div className="md:col-span-6">
          <GlassCard className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-[#F5D5C2]/40 to-white/90">
            <div>
              <span className="text-[11px] font-extrabold tracking-wider text-[#E9A06D] uppercase block">
                {t('train.generatorSubtitle')}
              </span>
              <h3 className="text-xl font-black text-[#20312D] mt-0.5 mb-2">
                {t('train.generator')}
              </h3>
              <p className="text-xs text-[#6F7D78]">
                Elegí duración, grupo muscular e intensidad. El motor compilará una rutina balanceada y adaptada a vos.
              </p>
            </div>

            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="mt-4 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#20312D] text-white font-extrabold text-xs hover:bg-black transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#E9A06D]" />
              <span>{t('train.configureCustom')}</span>
            </button>
          </GlassCard>
        </div>
      </div>

      {/* 4-WEEK PROGRAM SCHEDULE VIEWER */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Estructura Progresiva
            </span>
            <h3 className="text-xl font-black text-[#20312D]">
              {t('train.program')}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#DCEFE8] text-[#20312D] text-xs font-bold">
            Semana {program.currentWeek} de 4 • {program.weeks[program.currentWeek - 1]?.theme}
          </span>
        </div>

        <p className="text-xs text-[#6F7D78] mb-4">
          {program.weeks[program.currentWeek - 1]?.description}
        </p>

        {/* Days of Week Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {program.weeks[program.currentWeek - 1]?.schedule.map(day => (
            <div
              key={day.dayNumber}
              onClick={() => {
                if (!day.isRestDay) {
                  generateCustomSession({
                    goal: 'strength',
                    durationMinutes: day.durationMinutes || 25,
                    difficulty: 'Beginner',
                    equipment: ['bodyweight'],
                    focus: day.category === 'Mobility' ? 'Mobility' : day.category === 'Core' ? 'Core' : 'Full body'
                  });
                }
              }}
              className={`
                p-3 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all
                ${!day.isRestDay ? 'cursor-pointer hover:border-[#56B89D] hover:shadow-xs hover:scale-[1.02]' : 'cursor-default'}
                ${day.dayNumber === 3 
                  ? 'bg-white border-[#56B89D] shadow-xs ring-2 ring-[#56B89D]/20' 
                  : day.isCompleted 
                    ? 'bg-[#DCEFE8]/40 border-black/5 opacity-80' 
                    : 'bg-white/70 border-white/90'
                }
              `}
              title={day.isRestDay ? 'Día de descanso' : 'Tocar para entrenar esta sesión'}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#6F7D78]">
                    {dayAbbrES[day.dayName] || day.dayName.slice(0, 3).toUpperCase()}
                  </span>
                  {day.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#56B89D]" />}
                  {day.dayNumber === 3 && <span className="w-2 h-2 rounded-full bg-[#56B89D]" />}
                </div>
                <h4 className="text-[11px] font-bold text-[#20312D] mt-1 line-clamp-2 leading-tight">
                  {day.workoutTitle}
                </h4>
              </div>

              <div className="text-[9px] font-semibold text-[#6F7D78] flex items-center justify-between">
                <span>{day.isRestDay ? 'Descanso activo' : `${day.durationMinutes} min`}</span>
                {!day.isRestDay && <Play className="w-2.5 h-2.5 text-[#56B89D] fill-current" />}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* EXERCISE LIBRARY & PROGRESSION BROWSER */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Catálogo de técnica
            </span>
            <h3 className="text-xl font-black text-[#20312D]">
              {t('train.library')}
            </h3>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#6F7D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar ejercicios, músculos..."
              className="w-full pl-10 pr-4 py-2 bg-white/90 border border-black/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {categories.map(cat => (
            <GlassPill
              key={cat.id}
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </GlassPill>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExerciseForDetail(exercise)}
              className="group cursor-pointer rounded-2xl bg-white/80 border border-white/90 overflow-hidden shadow-2xs hover:shadow-md transition-all"
            >
              <div className="h-32 relative overflow-hidden bg-gray-100">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                  Nivel {exercise.progressionLevel}
                </div>
              </div>
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#56B89D]">
                  {CATEGORY_LABELS_ES[exercise.category] || exercise.category}
                </span>
                <h4 className="font-black text-sm text-[#20312D] truncate">
                  {exercise.name}
                </h4>
                <p className="text-[11px] text-[#6F7D78] line-clamp-1">
                  {exercise.muscleGroups.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CUSTOM WORKOUT GENERATOR MODAL */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-[#56B89D] uppercase">Síntesis con IA</span>
                <h3 className="text-xl font-black text-[#20312D]">Generador de rutina</h3>
              </div>
              <button 
                onClick={() => setIsGeneratorOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6F7D78] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Muscle Focus */}
            <div>
              <label className="block text-xs font-bold text-[#20312D] mb-1.5">Enfoque principal</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Full body', 'Upper body', 'Lower body', 'Core', 'Mobility'] as const).map(focus => (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setCustomFocus(focus)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${customFocus === focus ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                  >
                    {focusLabels[focus]}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#20312D]">Duración</label>
                <span className="text-xs font-black text-[#56B89D]">{customDuration} minutos</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={customDuration}
                onChange={e => setCustomDuration(Number(e.target.value))}
                className="w-full accent-[#56B89D]"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-[#20312D] mb-1.5">Nivel de dificultad</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setCustomDifficulty(diff)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${customDifficulty === diff ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                  >
                    {DIFFICULTY_LABELS_ES[diff] || diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAndStart}
              className="w-full py-4 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#56B89D]" />
              <span>Generar e iniciar rutina</span>
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE DETAIL DRAWER / POPUP */}
      {selectedExerciseForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#56B89D]">
                  {CATEGORY_LABELS_ES[selectedExerciseForDetail.category] || selectedExerciseForDetail.category} • Nivel {selectedExerciseForDetail.progressionLevel}
                </span>
                <h3 className="text-2xl font-black text-[#20312D]">
                  {selectedExerciseForDetail.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedExerciseForDetail(null)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6F7D78] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden shadow-xs">
              <img
                src={selectedExerciseForDetail.imageUrl}
                alt={selectedExerciseForDetail.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#20312D]">
                Instrucciones de ejecución
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-xs text-[#20312D]">
                {selectedExerciseForDetail.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-1 bg-white/70 p-3.5 rounded-2xl border border-black/5">
              <span className="text-[11px] font-bold text-[#E9A06D] uppercase block">
                Errores comunes a evitar
              </span>
              <ul className="list-disc pl-4 text-xs text-[#6F7D78] space-y-0.5">
                {selectedExerciseForDetail.commonMistakes.map((mis, i) => (
                  <li key={i}>{mis}</li>
                ))}
              </ul>
            </div>

            {/* Safety notes */}
            <div className="flex items-start gap-2.5 text-[11px] text-[#6F7D78] bg-[#DCEFE8]/60 p-3 rounded-2xl border border-[#56B89D]/30">
              <ShieldCheck className="w-4 h-4 text-[#56B89D] shrink-0 mt-0.5" />
              <span>{selectedExerciseForDetail.safetyNotes}</span>
            </div>

            {/* Quick Practice Button */}
            <button
              type="button"
              onClick={() => {
                startWorkout({
                  id: `practice-${selectedExerciseForDetail.id}-${Date.now()}`,
                  title: `Práctica guiada: ${selectedExerciseForDetail.name}`,
                  subtitle: `Enfoque técnico • ${selectedExerciseForDetail.category}`,
                  category: selectedExerciseForDetail.category,
                  estimatedDurationMinutes: 8,
                  intensity: 'Light',
                  estimatedCalories: 45,
                  rationale: `Sesión de práctica técnica dedicada a dominar ${selectedExerciseForDetail.name} con forma controlada.`,
                  exercises: [{
                    exerciseId: selectedExerciseForDetail.id,
                    exerciseName: selectedExerciseForDetail.name,
                    targetSets: 3,
                    targetReps: selectedExerciseForDetail.defaultReps || 10,
                    targetDurationSeconds: selectedExerciseForDetail.defaultDurationSeconds,
                    restSeconds: selectedExerciseForDetail.defaultRestSeconds || 45,
                    completedSets: 0,
                    category: selectedExerciseForDetail.category,
                    imageUrl: selectedExerciseForDetail.imageUrl,
                    notes: selectedExerciseForDetail.instructions[0] || 'Enfocate en la técnica prolija'
                  }],
                  isQuickWorkout: true
                });
                setSelectedExerciseForDetail(null);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Play className="w-4 h-4 fill-current text-[#56B89D]" />
              <span>Entrenar este ejercicio ahora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


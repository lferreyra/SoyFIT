import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown,
  Footprints, 
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard } from '../common/GlassCard';
import { t, CATEGORY_LABELS_ES, INTENSITY_LABELS_ES, formatNumber, formatCalories } from '../../i18n';
import { renderHabitIcon } from '../common/HabitIcons';

export const HomeView: React.FC = () => {
  const { 
    user, 
    readiness, 
    updateReadiness, 
    todayWorkout, 
    startWorkout, 
    habits, 
    toggleHabit, 
    gamification, 
    setIsCoachModalOpen,
    setIsWeeklyReviewOpen,
    isAdmin,
    setIsAdminModalOpen,
    setIsLandingCarouselOpen
  } = useFitness();

  const [isReadinessCheckinOpen, setIsReadinessCheckinOpen] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<'poor' | 'okay' | 'good' | 'great'>('good');
  const [selectedEnergy, setSelectedEnergy] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [selectedSoreness, setSelectedSoreness] = useState<'none' | 'light' | 'moderate' | 'high'>('light');

  // Habits accordion state: expanded by default, can be toggled
  const [isHabitsOpen, setIsHabitsOpen] = useState(true);

  const handleSaveReadiness = () => {
    updateReadiness(selectedFeeling, selectedEnergy, selectedSoreness);
    setIsReadinessCheckinOpen(false);
  };

  // Readiness color styling
  const readinessBg = readiness.tier === 'HIGH READINESS' ? 'from-[#DCEFE8] to-white/90' : readiness.tier === 'MEDIUM READINESS' ? 'from-[#F5D5C2] to-white/90' : 'from-[#F5D5C2]/70 to-[#F4F3EC]';

  const tierLabel = readiness.tier === 'HIGH READINESS' 
    ? 'DISPOSICIÓN ALTA' 
    : readiness.tier === 'MEDIUM READINESS' 
      ? 'DISPOSICIÓN MODERADA' 
      : 'RECUPERACIÓN PRIORITARIA';

  const feelingLabels: Record<string, string> = {
    poor: 'Bajo',
    okay: 'Regular',
    good: 'Bien',
    great: 'Excelente'
  };

  const sorenessLabels: Record<string, string> = {
    none: 'Ninguna',
    light: 'Leve',
    moderate: 'Moderada',
    high: 'Alta'
  };

  const categoryLabel = CATEGORY_LABELS_ES[todayWorkout.category] || todayWorkout.category;
  const intensityLabel = INTENSITY_LABELS_ES[todayWorkout.intensity] || todayWorkout.intensity;

  const getFirstName = (fullName?: string, email?: string): string => {
    if (fullName && fullName.trim()) {
      const first = fullName.trim().split(/\s+/)[0];
      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }
    if (email && email.trim()) {
      const userPart = email.split('@')[0];
      const first = userPart.split(/[._-]/)[0];
      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }
    return 'Atleta';
  };

  const completedHabitsCount = habits.filter(h => h.completed).length;
  const habitCompletionPct = Math.round((completedHabitsCount / habits.length) * 100);

  return (
    <div id="home-dashboard" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#20312D]">
            ¡Hola, {getFirstName(user.name, user.email)}! 👋
          </h1>
          <p className="text-sm font-medium text-[#6F7D78] mt-0.5">
            "{t('app.tagline')}" ¿Listo para moverte hoy?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Tour App Carousel Pill */}
          <button
            onClick={() => setIsLandingCarouselOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white border border-white text-xs font-bold text-[#20312D] shadow-xs transition-all cursor-pointer"
            title="Conocer funcionalidades de SOYFIT"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>Tour SOYFIT</span>
          </button>

          {/* Admin Mode Pill */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#16221F] hover:bg-[#20312D] border border-[#56B89D]/40 text-xs font-extrabold text-[#56B89D] shadow-xs transition-all cursor-pointer"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Admin</span>
            </button>
          )}

          {/* Weekly Digest Pill */}
          <button
            onClick={() => setIsWeeklyReviewOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 border border-white text-xs font-extrabold text-[#20312D] hover:bg-white shadow-xs transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>{t('home.weeklyReview')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6F7D78]" />
          </button>
        </div>
      </div>

      {/* CORE PRODUCT HERO: WHAT SHOULD I DO TODAY? */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#20312D] to-[#14201D] text-white p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(32,49,45,0.25)] border border-white/10">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#56B89D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#E9A06D]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#56B89D]/20 text-[#56B89D] text-[11px] font-extrabold tracking-widest uppercase border border-[#56B89D]/30">
                {t('home.todayPlan')}
              </span>
              <span className="text-xs text-[#DCEFE8]/80 font-medium">
                {categoryLabel}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                {todayWorkout.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80 mt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#56B89D]" />
                  {todayWorkout.estimatedDurationMinutes} minutos
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#E9A06D]" />
                  Intensidad {intensityLabel.toLowerCase()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#E9A06D]" />
                  ~{formatCalories(todayWorkout.estimatedCalories)} estimados
                </span>
              </div>
            </div>

            {/* Why this workout? Rationale */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-xs text-white/90">
              <span className="font-bold text-[#56B89D] block mb-0.5">{t('home.whyThisWorkout')}</span>
              "{todayWorkout.rationale}"
            </div>

            <div className="text-[11px] text-white/60 pt-1">
              {t('home.tomorrow')}: <span className="text-white/90 font-semibold">Movilidad y cuidado de columna • 15 min</span>
            </div>
          </div>

          {/* REFINED GEMINI-AI STYLE GLOWING START BUTTON */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative p-[2px] rounded-[24px] overflow-hidden group">
              {/* Animated glowing border beam inspired by Gemini AI */}
              <div className="gemini-border-glow" />

              <button
                id="home-start-today-workout-btn"
                onClick={() => startWorkout(todayWorkout)}
                className="relative z-10 px-8 py-5 rounded-[22px] bg-[#16221F]/95 hover:bg-[#1C2C28] text-white transition-all flex items-center justify-center gap-3.5 cursor-pointer shadow-xl shadow-black/30 backdrop-blur-xl group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] text-[#14201D] flex items-center justify-center shrink-0 shadow-md shadow-[#56B89D]/30 group-hover:rotate-6 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5 text-[#14201D]" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black tracking-wide text-white group-hover:text-[#DCEFE8] transition-colors">
                    {t('workout.start')}
                  </span>
                  <span className="block text-[11px] text-[#A8D5C7] font-semibold">
                    {todayWorkout.estimatedDurationMinutes} min • {todayWorkout.exercises.length} movimientos
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#56B89D] group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            </div>
            <span className="text-[10px] text-white/50 tracking-wider uppercase mt-2.5">
              Rutina adaptada a tu perfil
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S READINESS & TODAY'S PROGRESS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* DAILY READINESS CARD */}
        <div className="md:col-span-6">
          <GlassCard className={`p-6 bg-gradient-to-br ${readinessBg}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
                  Estado fisiológico
                </span>
                <h3 className="text-xl font-black text-[#20312D] mt-0.5">
                  {t('home.readiness')}
                </h3>
              </div>

              <button
                onClick={() => setIsReadinessCheckinOpen(!isReadinessCheckinOpen)}
                className="px-3 py-1 rounded-full bg-white/90 border border-white text-xs font-bold text-[#20312D] shadow-2xs hover:bg-white cursor-pointer"
              >
                {isReadinessCheckinOpen ? t('common.close') : t('common.edit')}
              </button>
            </div>

            {/* Readiness Survey Dropdown */}
            {isReadinessCheckinOpen ? (
              <div className="space-y-3 mt-4 pt-4 border-t border-black/5 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-bold text-[#20312D] block mb-1">¿Cómo te sentís hoy?</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['poor', 'okay', 'good', 'great'] as const).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSelectedFeeling(f)}
                        className={`py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${selectedFeeling === f ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white/80 text-[#6F7D78] border-black/5'}`}
                      >
                        {feelingLabels[f]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#20312D] block mb-1">Nivel de energía (1 al 5)</label>
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4, 5] as const).map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSelectedEnergy(n)}
                        className={`flex-1 py-1 text-xs font-bold rounded-xl transition-all border cursor-pointer ${selectedEnergy === n ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white/80 text-[#6F7D78] border-black/5'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#20312D] block mb-1">¿Molestia o fatiga muscular?</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['none', 'light', 'moderate', 'high'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSoreness(s)}
                        className={`py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${selectedSoreness === s ? 'bg-[#E9A06D] text-white border-[#E9A06D]' : 'bg-white/80 text-[#6F7D78] border-black/5'}`}
                      >
                        {sorenessLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveReadiness}
                  className="w-full py-2.5 rounded-xl bg-[#20312D] text-white font-extrabold text-xs mt-2 cursor-pointer hover:opacity-95"
                >
                  Recalcular disposición y rutina
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/90 border border-white flex flex-col items-center justify-center shadow-xs shrink-0">
                  <span className="text-3xl font-black text-[#20312D] leading-none">
                    {readiness.readinessScore}%
                  </span>
                  <span className="text-[9px] font-bold text-[#56B89D] uppercase tracking-wider mt-1">
                    Puntaje
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#56B89D]/20 text-[#20312D] text-[10px] font-extrabold">
                    {tierLabel}
                  </div>
                  <p className="text-xs text-[#20312D] font-medium leading-snug">
                    {readiness.recommendation}
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* TODAY'S METRICS & PROGRESS */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Resumen del día
            </span>
            <h3 className="text-xl font-black text-[#20312D] mt-0.5 mb-4">
              {t('home.todayProgress')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 border border-white rounded-2xl p-3">
                <div className="flex items-center gap-2 text-[#6F7D78] text-[11px] font-bold uppercase">
                  <Flame className="w-3.5 h-3.5 text-[#E9A06D]" />
                  <span>{t('home.calories')}</span>
                </div>
                <div className="text-2xl font-black text-[#20312D] mt-1">
                  {formatNumber(gamification.totalEstimatedCalories)} <span className="text-xs font-normal text-[#6F7D78]">kcal</span>
                </div>
              </div>

              <div className="bg-white/70 border border-white rounded-2xl p-3">
                <div className="flex items-center gap-2 text-[#6F7D78] text-[11px] font-bold uppercase">
                  <Footprints className="w-3.5 h-3.5 text-[#56B89D]" />
                  <span>{t('home.steps')}</span>
                </div>
                <div className="text-2xl font-black text-[#20312D] mt-1">
                  {formatNumber(habits.find(h => h.id === 'h2')?.currentValue || 0)} <span className="text-xs font-normal text-[#6F7D78]">/ 8.000</span>
                </div>
              </div>

              <div className="bg-white/70 border border-white rounded-2xl p-3">
                <div className="flex items-center gap-2 text-[#6F7D78] text-[11px] font-bold uppercase">
                  <Activity className="w-3.5 h-3.5 text-[#56B89D]" />
                  <span>{t('home.activeMinutes')}</span>
                </div>
                <div className="text-2xl font-black text-[#20312D] mt-1">
                  {formatNumber(gamification.totalTrainingMinutes)} <span className="text-xs font-normal text-[#6F7D78]">min</span>
                </div>
              </div>

              <div className="bg-white/70 border border-white rounded-2xl p-3">
                <div className="flex items-center gap-2 text-[#6F7D78] text-[11px] font-bold uppercase">
                  <Heart className="w-3.5 h-3.5 text-[#E9A06D]" />
                  <span>{t('home.streak')}</span>
                </div>
                <div className="text-2xl font-black text-[#20312D] mt-1">
                  🔥 {gamification.currentStreakDays} <span className="text-xs font-normal text-[#6F7D78]">días</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* TODAY'S HABITS COLLAPSIBLE ACCORDION WITH RICH ICONIC GRAPHICS */}
      <GlassCard className="p-5 sm:p-6 transition-all">
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsHabitsOpen(!isHabitsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Hábitos de salud
            </span>
            <h3 className="text-xl font-black text-[#20312D] group-hover:text-[#3B967D] transition-colors">
              Constancia diaria
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#DCEFE8] text-[#20312D] text-xs font-black shadow-2xs">
              {completedHabitsCount} de {habits.length} ({habitCompletionPct}%)
            </span>
            <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${isHabitsOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-[#20312D]" />
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {isHabitsOpen && (
          <div className="mt-4 pt-4 border-t border-black/5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {habits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`
                    p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group/card
                    ${habit.completed 
                      ? 'bg-[#DCEFE8]/70 border-[#56B89D]/40 text-[#20312D] shadow-xs' 
                      : 'bg-white/80 border-white/90 text-[#20312D] hover:bg-white hover:border-[#56B89D]/30 shadow-2xs'
                    }
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rich custom iconic graphic */}
                    <div className="p-1 rounded-xl bg-white/60 border border-white/80 shrink-0 group-hover/card:scale-105 transition-transform">
                      {renderHabitIcon(habit.id, habit.completed)}
                    </div>
                    <div>
                      <span className={`text-xs font-black block leading-snug ${habit.completed ? 'line-through text-[#20312D]/70' : 'text-[#20312D]'}`}>
                        {habit.title}
                      </span>
                      <span className="text-[10px] text-[#6F7D78] font-bold block mt-0.5">
                        Meta: {habit.targetValue} {habit.unit}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {habit.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#56B89D]" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 group-hover/card:text-[#56B89D]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* FIT COACH CONTEXTUAL HIGHLIGHT */}
      <div 
        onClick={() => setIsCoachModalOpen(true)}
        className="cursor-pointer p-6 rounded-[28px] bg-gradient-to-r from-[#DCEFE8] via-[#F4F3EC] to-[#F5D5C2] border border-white/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#56B89D] shadow-xs shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#20312D] uppercase tracking-wider">
                {t('coach.title')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-[#20312D] font-bold">
                IA Adaptativa
              </span>
            </div>
            <p className="text-xs text-[#6F7D78] mt-0.5">
              "Tu constancia viene con un impulso enorme. ¿Tenés preguntas o querés ajustar las repeticiones de hoy? Tocá para chatear."
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6F7D78] shrink-0" />
      </div>
    </div>
  );
};

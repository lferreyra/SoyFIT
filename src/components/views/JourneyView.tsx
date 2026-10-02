import React, { useState } from 'react';
import { 
  Trophy, 
  Milestone, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard } from '../common/GlassCard';
import { t, LEVEL_LABELS_ES } from '../../i18n';

export const JourneyView: React.FC = () => {
  const { 
    scores, 
    gamification, 
    workoutHistory,
    progressionPathways, 
    setIsReassessmentModalOpen,
    setIsWeeklyReviewOpen
  } = useFitness();

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Chart data for fitness score trajectory & workouts
  const scoreEvolutionData = workoutHistory.length > 0
    ? [
        { name: 'Inicio', score: Math.max(15, scores.overallScore - Math.min(15, workoutHistory.length * 2)), calories: 0 },
        ...workoutHistory.slice(0, 5).reverse().map((w, idx) => ({
          name: `Sesión ${idx + 1}`,
          score: Math.min(100, Math.max(15, scores.overallScore - (workoutHistory.length - 1 - idx) * 2)),
          calories: w.caloriesBurned
        }))
      ]
    : [
        { name: 'Inicio', score: scores.overallScore, calories: 0 },
        { name: 'Objetivo', score: Math.min(100, scores.overallScore + 10), calories: 350 }
      ];

  const milestones = [
    { title: 'Primer entrenamiento completado', date: gamification.totalWorkoutsCompleted >= 1 ? '¡Logrado!' : 'Pendiente', done: gamification.totalWorkoutsCompleted >= 1 },
    { title: 'Constancia activa de 3 días', date: gamification.currentStreakDays >= 3 ? '¡Logrado!' : `${gamification.currentStreakDays}/3 días`, done: gamification.currentStreakDays >= 3 },
    { title: 'Completar 5 entrenamientos', date: gamification.totalWorkoutsCompleted >= 5 ? '¡Logrado!' : `${gamification.totalWorkoutsCompleted}/5 sesiones`, done: gamification.totalWorkoutsCompleted >= 5 },
    { title: 'Racha de 7 días continuos', date: gamification.currentStreakDays >= 7 ? '¡Logrado!' : `${gamification.currentStreakDays}/7 días`, done: gamification.currentStreakDays >= 7 },
    { title: 'Dominar flexiones estrictas', date: 'Meta técnica adaptativa', done: scores.overallScore >= 65 },
    { title: 'Desbloquear nivel Intermedio 1', date: 'Meta de evaluación: 50+ pts', done: scores.overallScore >= 50 }
  ];

  const currentLevelEs = LEVEL_LABELS_ES[scores.calculatedLevel] || scores.calculatedLevel;

  return (
    <div id="journey-dashboard" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#20312D] tracking-tight">
            {t('journey.title')}
          </h1>
          <p className="text-sm text-[#6F7D78] mt-0.5">
            {t('journey.subtitle')}
          </p>
        </div>

        {/* Header Action CTAs */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsWeeklyReviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 border border-white text-xs font-bold text-[#20312D] hover:bg-white shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>Revisión semanal</span>
          </button>
          <button
            onClick={() => setIsReassessmentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#56B89D] text-white text-xs font-black shadow-xs hover:bg-[#46A389] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('journey.reassessmentCTA')}</span>
          </button>
        </div>
      </div>

      {/* FITNESS SCORE EVOLUTION CARDS */}
      <GlassCard className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Trayectoria y Progreso
            </span>
            <h3 className="text-xl font-black text-[#20312D]">
              {t('journey.fitnessEvolution')}
            </h3>
            <span className="text-xs text-[#6F7D78]">
              {t('journey.scoreDisclaimer')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6F7D78] font-bold">Actual:</span>
            <div className="px-3 py-1 rounded-full bg-[#20312D] text-white text-xs font-black">
              {scores.overallScore} / 100 • {currentLevelEs}
            </div>
          </div>
        </div>

        {/* Evolution Timeline Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-white/90 border border-white rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Inicio</span>
            <span className="text-lg font-black text-[#20312D]">48</span>
          </div>
          <div className="bg-white/90 border border-white rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Semana 2</span>
            <span className="text-lg font-black text-[#20312D]">54</span>
          </div>
          <div className="bg-white/90 border border-white rounded-2xl p-3 text-center">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Semana 4</span>
            <span className="text-lg font-black text-[#56B89D]">61</span>
          </div>
          <div className="bg-[#DCEFE8] border border-[#56B89D]/40 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-extrabold text-[#20312D] uppercase block">Meta</span>
            <span className="text-lg font-black text-[#20312D]">72</span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scoreEvolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#56B89D" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#56B89D" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#6F7D78" fontSize={11} tickLine={false} />
              <YAxis domain={[35, 75]} stroke="#6F7D78" fontSize={11} tickLine={false} />
              <Tooltip 
                formatter={(val: any) => [`${val} pts`, 'Puntuación']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  borderRadius: '16px', 
                  border: '1px solid #DCEFE8',
                  boxShadow: '0 8px 24px -6px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#56B89D" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#scoreGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* EXERCISE PROGRESSION PATHWAYS */}
      <GlassCard className="p-6 sm:p-7">
        <div className="mb-5">
          <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
            Escaleras de Dominio Técnico
          </span>
          <h3 className="text-xl font-black text-[#20312D]">
            {t('journey.progressionPathways')}
          </h3>
          <p className="text-xs text-[#6F7D78]">
            El progreso físico genuino se basa en desbloquear movimientos funcionales de mayor dificultad y control.
          </p>
        </div>

        <div className="space-y-6">
          {progressionPathways.map(pathway => {
            const unlockedCount = pathway.stages.filter(s => s.isUnlocked).length;
            return (
              <div key={pathway.id} className="bg-white/80 border border-white rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-base text-[#20312D]">{pathway.name}</h4>
                    <p className="text-[11px] text-[#6F7D78] mt-0.5">{pathway.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#DCEFE8] text-xs font-black text-[#20312D] shrink-0">
                    {unlockedCount} de {pathway.stages.length} desbloqueados
                  </span>
                </div>

                {/* Stages Pipeline */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                  {pathway.stages.map((stage) => (
                    <div
                      key={stage.stageNumber}
                      className={`
                        p-3 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all
                        ${stage.isCurrent 
                          ? 'bg-gradient-to-br from-[#DCEFE8] to-white border-[#56B89D] shadow-xs' 
                          : stage.isUnlocked 
                            ? 'bg-white border-black/5' 
                            : 'bg-black/[0.03] border-dashed border-black/10 opacity-60'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-[#6F7D78]">
                          <span>FASE {stage.stageNumber}</span>
                          {stage.isUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#56B89D]" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#6F7D78]" />
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-[#20312D] mt-1 line-clamp-2">
                          {stage.name}
                        </h5>
                      </div>

                      <div className="text-[9px] text-[#6F7D78] line-clamp-1">
                        {stage.isCurrent ? '★ Enfoque actual' : stage.targetCriteria}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* PERSONAL RECORDS & MILESTONES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* PERSONAL RECORDS */}
        <div className="md:col-span-6">
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-[#E9A06D] uppercase block">
                  Logros Deportivos
                </span>
                <h3 className="text-xl font-black text-[#20312D]">
                  {t('journey.personalRecords')}
                </h3>
              </div>
              <Trophy className="w-5 h-5 text-[#E9A06D]" />
            </div>

            {gamification.personalRecords.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/70 border border-black/5 text-center space-y-2">
                <Trophy className="w-8 h-8 text-[#E9A06D]/60 mx-auto" />
                <h4 className="text-xs font-bold text-[#20312D]">Sin marcas personales registradas</h4>
                <p className="text-[11px] text-[#6F7D78]">
                  Tus récords de repeticiones y marcas personales se calcularán y exhibirán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {gamification.personalRecords.map(pr => (
                  <div 
                    key={pr.id}
                    className="p-3.5 rounded-2xl bg-white/80 border border-white flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#20312D]">{pr.exerciseName}</h4>
                        {pr.isRecent && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F5D5C2] text-[#E9A06D] text-[9px] font-black uppercase">
                            Nuevo PR
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#6F7D78]">{pr.metric} • {pr.achievedAt}</span>
                    </div>

                    <div className="text-base font-black text-[#20312D]">
                      {pr.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* MILESTONE TIMELINE */}
        <div className="md:col-span-6">
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
                  Marcadores de Progreso
                </span>
                <h3 className="text-xl font-black text-[#20312D]">
                  {t('journey.milestones')}
                </h3>
              </div>
              <Milestone className="w-5 h-5 text-[#56B89D]" />
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold
                    ${m.done ? 'bg-[#DCEFE8] text-[#56B89D]' : 'bg-black/5 text-[#6F7D78]'}
                  `}>
                    {m.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 pb-2 border-b border-black/5">
                    <span className={`text-xs font-bold block ${m.done ? 'text-[#20312D]' : 'text-[#6F7D78]'}`}>
                      {m.title}
                    </span>
                    <span className="text-[10px] text-[#6F7D78]">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};


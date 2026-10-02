import React from 'react';
import { X, Sparkles, Trophy, ArrowRight, Flame, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { WeeklyPerformanceChart } from '../charts/WeeklyPerformanceChart';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewNextWeek: () => void;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  onClose,
  onViewNextWeek
}) => {
  const { user, gamification, workoutHistory, scores } = useFitness();

  if (!isOpen) return null;

  const firstName = user.name ? user.name.trim().split(/\s+/)[0] : 'Daniela';
  const targetDays = user.trainingDaysPerWeek || 4;
  const sessionsCount = workoutHistory.length;
  const consistencyPct = targetDays > 0 ? Math.min(100, Math.round((sessionsCount / targetDays) * 100)) : 100;
  const caloriesBurned = gamification.totalEstimatedCalories;
  const activeStreak = gamification.currentStreakDays;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div 
        id="weekly-review-modal"
        className="relative w-full max-w-2xl bg-[#F4F3EC] border border-white/80 rounded-[36px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D] max-h-[92vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] cursor-pointer transition-colors shadow-2xs z-10"
          title="Cerrar resumen"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="pr-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Revisión de la Semana Pasada
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#56B89D]/15 text-[#20312D] text-[10px] font-bold">
                Ciclo completado
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#20312D] mt-1 tracking-tight">
              Tu constancia y volumen en resumen
            </h2>
            <p className="text-xs text-[#6F7D78] mt-1 leading-relaxed">
              Análisis biométrico y adaptativo: verifica la tendencia de cumplimiento de tus metas y los minutos de entrenamiento ejecutados.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/85 border border-white rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Sesiones</span>
              <div className="text-2xl font-black text-[#20312D] mt-0.5">
                {sessionsCount} <span className="text-xs font-normal text-[#6F7D78]">/ {targetDays}</span>
              </div>
            </div>

            <div className="bg-white/85 border border-white rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Constancia</span>
              <div className="text-2xl font-black text-[#56B89D] mt-0.5">
                {consistencyPct}%
              </div>
            </div>

            <div className="bg-white/85 border border-white rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Gasto total</span>
              <div className="text-2xl font-black text-[#20312D] mt-0.5">
                ~{caloriesBurned} <span className="text-xs font-normal text-[#6F7D78]">kcal</span>
              </div>
            </div>

            <div className="bg-white/85 border border-white rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Racha activa</span>
              <div className="text-2xl font-black text-[#E9A06D] mt-0.5">
                🔥 {activeStreak}d
              </div>
            </div>
          </div>

          {/* RECHARTS DATA VISUALIZATION: WEEKLY PERFORMANCE & GOAL COMPLIANCE TREND */}
          <WeeklyPerformanceChart 
            workoutHistory={workoutHistory}
            targetDaysPerWeek={targetDays}
            preferredDurationMinutes={user.preferredDurationMinutes || 30}
          />

          {/* Performance Highlight Banner */}
          <div className="bg-[#DCEFE8]/80 border border-[#56B89D]/40 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#56B89D] shadow-xs shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-[#20312D] block">
                  Nivel de atleta adaptativo: {scores.calculatedLevel}
                </span>
                <span className="text-[11px] text-[#6F7D78] leading-tight block mt-0.5">
                  Puntuación física general estimada en {scores.overallScore}/100 basada en constancia y volumen acumulado.
                </span>
              </div>
            </div>
          </div>

          {/* AI Fit Coach Insight */}
          <div className="bg-white/95 border border-white rounded-3xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#56B89D]" />
              <span className="text-xs font-black text-[#20312D] uppercase tracking-wider">
                Análisis del Entrenador IA
              </span>
            </div>
            <p className="text-xs text-[#20312D] leading-relaxed">
              "¡Gran compromiso, {firstName}! Tu volumen semanal y la curva de cumplimiento demuestran que tu capacidad de recuperación está lista para el siguiente ciclo. Mantené la hidratación en los días de descanso para consolidar las adaptaciones neuromusculares."
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={onClose}
              className="w-full sm:w-1/3 py-4 rounded-2xl bg-white hover:bg-gray-100 text-[#20312D] border border-black/5 font-extrabold text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              Cerrar resumen
            </button>
            <button
              onClick={() => {
                onClose();
                onViewNextWeek();
              }}
              className="w-full sm:w-2/3 py-4 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ver plan de la próxima semana</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

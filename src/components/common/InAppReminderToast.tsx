import React, { useEffect, useState } from 'react';
import { 
  Droplet, 
  Dumbbell, 
  X, 
  Plus, 
  Play, 
  Clock, 
  CheckCircle2, 
  BellRing,
  ArrowRight
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const InAppReminderToast: React.FC = () => {
  const { 
    activeReminder, 
    dismissReminder, 
    snoozeReminder, 
    addWater, 
    startWorkout, 
    todayWorkout, 
    setCurrentTab,
    isLandingCarouselOpen,
    isAuthModalOpen
  } = useFitness();

  const [waterLoggedNotice, setWaterLoggedNotice] = useState(false);
  const [locallyDismissedId, setLocallyDismissedId] = useState<string | null>(null);

  useEffect(() => {
    if (activeReminder) {
      setWaterLoggedNotice(false);
    }
  }, [activeReminder]);

  // Do not render if there's no reminder, or if it was dismissed locally, or while viewing the landing carousel or auth modal
  if (!activeReminder || activeReminder.id === locallyDismissedId || isLandingCarouselOpen || isAuthModalOpen) {
    return null;
  }

  const isHydration = activeReminder.type === 'hydration';

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activeReminder) {
      setLocallyDismissedId(activeReminder.id);
    }
    dismissReminder();
  };

  const handleQuickAddWater = () => {
    addWater(0.25);
    setWaterLoggedNotice(true);
    setTimeout(() => {
      handleDismiss();
    }, 1800);
  };

  const handleStartWorkoutNow = () => {
    startWorkout(todayWorkout);
    handleDismiss();
  };

  const handleGoToView = () => {
    if (isHydration) {
      setCurrentTab('nutrition');
    } else {
      setCurrentTab('train');
    }
    handleDismiss();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
      <div className="pointer-events-auto bg-[#20312D] text-white rounded-3xl p-5 shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
        {/* Glowing Background Accent - pointer-events-none to prevent click obstruction */}
        <div 
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none ${isHydration ? 'bg-[#56B89D]' : 'bg-[#E9A06D]'}`} 
        />

        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-ping ${isHydration ? 'bg-[#56B89D]' : 'bg-[#E9A06D]'}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${isHydration ? 'text-[#56B89D]' : 'text-[#E9A06D]'}`}>
              {isHydration ? 'Recordatorio de Hidratación' : 'Meta de Entrenamiento Diaria'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Ahora
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="relative z-20 text-white/70 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/20 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
              title="Cerrar recordatorio"
              aria-label="Cerrar recordatorio"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isHydration ? 'bg-[#56B89D]/20 text-[#56B89D] border border-[#56B89D]/30' : 'bg-[#E9A06D]/20 text-[#E9A06D] border border-[#E9A06D]/30'}`}>
            {isHydration ? (
              <Droplet className="w-6 h-6 animate-bounce" />
            ) : (
              <Dumbbell className="w-6 h-6 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white leading-snug">
              {activeReminder.title}
            </h4>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              {activeReminder.message}
            </p>
          </div>
        </div>

        {/* Quick action feedback state */}
        {waterLoggedNotice ? (
          <div className="py-2 px-3 rounded-xl bg-[#56B89D]/20 border border-[#56B89D]/40 text-[#56B89D] text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡+250 ml registrados con éxito!</span>
          </div>
        ) : (
          /* Interactive Action Buttons */
          <div className="flex items-center gap-2 pt-1">
            {isHydration ? (
              <>
                <button
                  type="button"
                  onClick={handleQuickAddWater}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#56B89D] hover:bg-[#48a289] text-[#20312D] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+250 ml</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToView}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver Hábitos</span>
                  <ArrowRight className="w-3 h-3 text-[#56B89D]" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartWorkoutNow}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#56B89D] hover:bg-[#48a289] text-[#20312D] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Entrenar Ahora</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToView}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver Rutina</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => snoozeReminder(15)}
              className="py-2 px-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-[11px] transition-colors cursor-pointer shrink-0"
              title="Recordarme en 15 minutos"
            >
              Pausar 15m
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

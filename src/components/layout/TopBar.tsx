import React from 'react';
import { Sparkles, Flame, Activity, LogIn, User as UserIcon } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const TopBar: React.FC = () => {
  const { readiness, gamification, setIsCoachModalOpen, authUser, user, setIsAuthModalOpen, setCurrentTab } = useFitness();

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-xl border-b border-white/60 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
          E
        </div>
        <span className="font-extrabold text-base tracking-tight text-[#20312D]">
          EVOLVE
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Streak Pill */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 border border-white text-xs font-bold text-[#20312D] shadow-xs">
          <Flame className="w-3.5 h-3.5 text-[#E9A06D]" />
          <span>{gamification.currentStreakDays}d</span>
        </div>

        {/* Readiness Pill */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#DCEFE8]/70 border border-white text-xs font-bold text-[#20312D] shadow-xs">
          <Activity className="w-3.5 h-3.5 text-[#56B89D]" />
          <span>{readiness.readinessScore}%</span>
        </div>

        {/* AI Coach Button */}
        <button
          id="mobile-header-coach-btn"
          onClick={() => setIsCoachModalOpen(true)}
          className="p-1.5 rounded-full bg-gradient-to-r from-[#DCEFE8] to-[#F5D5C2] text-[#20312D] shadow-xs hover:scale-105 transition-transform cursor-pointer"
          aria-label="Abrir Entrenador IA"
        >
          <Sparkles className="w-4 h-4 text-[#56B89D]" />
        </button>

        {/* Auth / Avatar Button */}
        {authUser ? (
          <button
            id="mobile-header-profile-btn"
            onClick={() => setCurrentTab('profile')}
            className="w-7 h-7 rounded-full overflow-hidden border border-[#56B89D] cursor-pointer"
            title={user.name}
          >
            {authUser.photoURL ? (
              <img src={authUser.photoURL} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center text-[10px] font-bold">
                {(user.name || 'U')[0].toUpperCase()}
              </div>
            )}
          </button>
        ) : (
          <button
            id="mobile-header-login-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#20312D] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <LogIn className="w-3 h-3 text-[#56B89D]" />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

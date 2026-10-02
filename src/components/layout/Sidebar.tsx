import React from 'react';
import { 
  Home, 
  Dumbbell, 
  Milestone, 
  Salad, 
  User as UserIcon, 
  Sparkles, 
  Flame, 
  Award, 
  RotateCcw,
  LogIn,
  LogOut,
  Github
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { t } from '../../i18n';

export type NavTab = 'HOME' | 'TRAIN' | 'JOURNEY' | 'NUTRITION' | 'PROFILE';

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab: propTab, onTabChange: propChange }) => {
  const { 
    gamification, 
    setIsCoachModalOpen, 
    resetToDemoData, 
    currentTab: contextTab, 
    setCurrentTab,
    authUser,
    setIsAuthModalOpen,
    logoutUser,
    user
  } = useFitness();

  const activeTabKey = (propTab || contextTab || 'home').toUpperCase();
  const handleSelectTab = (tabId: string) => {
    if (propChange) {
      propChange(tabId);
    } else {
      setCurrentTab(tabId.toLowerCase() as any);
    }
  };

  const navItems: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'HOME', label: t('nav.home'), icon: Home },
    { id: 'TRAIN', label: t('nav.train'), icon: Dumbbell },
    { id: 'JOURNEY', label: t('nav.journey'), icon: Milestone },
    { id: 'NUTRITION', label: t('nav.nutrition'), icon: Salad },
    { id: 'PROFILE', label: t('nav.profile'), icon: UserIcon },
  ];

  return (
    <aside 
      id="desktop-sidebar"
      className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 p-6 bg-white/60 backdrop-blur-2xl border-r border-white/80 z-30"
    >
      {/* Brand & Tagline */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#56B89D]/20">
            E
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#20312D]">
              EVOLVE
            </h1>
            <span className="text-[11px] font-medium tracking-wide text-[#6F7D78] block">
              ENTRENAMIENTO ADAPTATIVO
            </span>
          </div>
        </div>

        <p className="text-xs text-[#6F7D78]/80 italic mt-2 mb-8 pl-1">
          "{t('app.tagline')}"
        </p>

        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTabKey === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id.toLowerCase()}`}
                onClick={() => handleSelectTab(item.id)}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-[#20312D] text-white shadow-sm' 
                    : 'text-[#6F7D78] hover:text-[#20312D] hover:bg-white/80'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#56B89D]' : 'text-[#6F7D78]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Status & AI Coach Trigger */}
      <div className="space-y-3 pt-6 border-t border-black/5">
        {/* Streak & XP pill */}
        <div className="bg-white/80 border border-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F5D5C2]/70 flex items-center justify-center text-[#E9A06D]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#20312D]">
                {gamification.currentStreakDays} {gamification.currentStreakDays === 1 ? 'día de racha' : 'días de racha'}
              </div>
              <div className="text-[10px] text-[#6F7D78]">
                Nivel {gamification.currentLevelNumber} • {gamification.xp} XP
              </div>
            </div>
          </div>
          <Award className="w-4 h-4 text-[#56B89D]" />
        </div>

        {/* AI Fit Coach Button */}
        <button
          id="sidebar-open-coach-btn"
          onClick={() => setIsCoachModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#DCEFE8] to-[#F5D5C2] text-[#20312D] text-xs font-bold shadow-sm hover:opacity-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#56B89D]" />
          <span>{t('nav.coach')}</span>
        </button>

        {/* User Account / Auth Card */}
        {authUser ? (
          <div className="bg-white/90 border border-white rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {authUser.photoURL ? (
                  <img 
                    src={authUser.photoURL} 
                    alt={user.name} 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-[#56B89D]/40 shrink-0" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center font-bold text-xs shrink-0">
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-[#20312D] truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#6F7D78] truncate">
                    {authUser.email || 'Conectado'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => logoutUser()}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-[#6F7D78] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-black/5 text-[10px] text-[#56B89D] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#56B89D] animate-pulse"></span>
                Nube Sincronizada
              </span>
              <span className="uppercase text-[#6F7D78] font-semibold">
                {authUser.providerData[0]?.providerId === 'google.com' ? 'Google' : authUser.providerData[0]?.providerId === 'github.com' ? 'GitHub' : 'Email'}
              </span>
            </div>
          </div>
        ) : (
          <button
            id="sidebar-login-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#20312D] text-white hover:bg-black text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>Iniciar sesión / Sincronizar</span>
          </button>
        )}

        {/* Demo reset option */}
        <button
          onClick={resetToDemoData}
          title="Reiniciar a datos de demostración"
          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-[#6F7D78]/70 hover:text-[#20312D] py-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reiniciar demo</span>
        </button>
      </div>
    </aside>
  );
};

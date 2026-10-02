import React from 'react';
import { Home, Dumbbell, Milestone, Salad, User } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { t } from '../../i18n';

interface BottomNavProps {
  currentTab?: string;
  onTabChange?: (tab: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab: propTab, onTabChange: propChange }) => {
  const { currentTab: contextTab, setCurrentTab } = useFitness();
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
    { id: 'PROFILE', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav 
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2 bg-white/80 backdrop-blur-2xl border-t border-white/80 shadow-[0_-8px_30px_-10px_rgba(32,49,45,0.08)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTabKey === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id.toLowerCase()}`}
              onClick={() => handleSelectTab(item.id)}
              className={`
                flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200
                ${isActive ? 'text-[#20312D] font-bold' : 'text-[#6F7D78] font-medium'}
              `}
            >
              <div className={`
                p-1.5 rounded-xl transition-all
                ${isActive ? 'bg-[#DCEFE8] text-[#20312D]' : 'text-[#6F7D78]'}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


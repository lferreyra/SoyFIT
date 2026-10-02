/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/views/HomeView';
import { TrainView } from './components/views/TrainView';
import { JourneyView } from './components/views/JourneyView';
import { NutritionView } from './components/views/NutritionView';
import { ProfileView } from './components/views/ProfileView';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AssessmentModal } from './components/modals/AssessmentModal';
import { ActiveWorkoutModal } from './components/modals/ActiveWorkoutModal';
import { AICoachModal } from './components/modals/AICoachModal';
import { WeeklyReviewModal } from './components/modals/WeeklyReviewModal';
import { ReassessmentModal } from './components/modals/ReassessmentModal';
import { AuthModal } from './components/modals/AuthModal';
import { InAppReminderToast } from './components/common/InAppReminderToast';

const AppContent: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab,
    isOnboardingOpen, 
    isAssessmentModalOpen, 
    setIsAssessmentModalOpen,
    isCoachModalOpen, 
    setIsCoachModalOpen,
    isWeeklyReviewOpen, 
    setIsWeeklyReviewOpen,
    isReassessmentModalOpen, 
    setIsReassessmentModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen
  } = useFitness();

  return (
    <div className="min-h-screen bg-[#F4F3EC] text-[#20312D] flex flex-col md:flex-row antialiased selection:bg-[#56B89D] selection:text-white">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Mobile Top Header */}
        <TopBar />

        {/* Dynamic Main View Screen */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {currentTab === 'home' && <HomeView />}
          {currentTab === 'train' && <TrainView />}
          {currentTab === 'journey' && <JourneyView />}
          {currentTab === 'nutrition' && <NutritionView />}
          {currentTab === 'profile' && <ProfileView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Global Modals & Runners */}
      <OnboardingModal />
      <AssessmentModal 
        isOpen={isAssessmentModalOpen} 
        onClose={() => setIsAssessmentModalOpen(false)} 
      />
      <ActiveWorkoutModal />
      <AICoachModal 
        isOpen={isCoachModalOpen} 
        onClose={() => setIsCoachModalOpen(false)} 
      />
      <WeeklyReviewModal 
        isOpen={isWeeklyReviewOpen} 
        onClose={() => setIsWeeklyReviewOpen(false)}
        onViewNextWeek={() => setCurrentTab('train')}
      />
      <ReassessmentModal 
        isOpen={isReassessmentModalOpen} 
        onClose={() => setIsReassessmentModalOpen(false)} 
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <InAppReminderToast />
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <AppContent />
    </FitnessProvider>
  );
}


import React from 'react';

// Custom iconic visual for Water Hydration with Glass + "H2O"
export const WaterGlassH2OIcon: React.FC<{ className?: string; isCompleted?: boolean }> = ({ 
  className = "w-7 h-7", 
  isCompleted = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Glass cup body */}
    <path 
      d="M12 8L15 40C15.2 42.2 17 44 19.2 44H28.8C31 44 32.8 42.2 33 40L36 8H12Z" 
      fill={isCompleted ? "#DCEFE8" : "#EAF4F0"} 
      stroke="#56B89D" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Water level wave */}
    <path 
      d="M14 20C17 21.5 21 19.5 24 20C27 20.5 31 22 34 20.5L34.8 11H13.2L14 20Z" 
      fill={isCompleted ? "#56B89D" : "#56B89D"} 
      fillOpacity={isCompleted ? "0.45" : "0.3"}
    />
    {/* Water surface line */}
    <path 
      d="M14 20C17 21.5 21 19.5 24 20C27 20.5 31 22 34 20.5" 
      stroke="#3B967D" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    {/* Clean, legible H2O Typography */}
    <text 
      x="24" 
      y="33" 
      textAnchor="middle" 
      fontSize="10" 
      fontWeight="900" 
      fontFamily="system-ui, sans-serif" 
      fill="#20312D"
      letterSpacing="0.5"
    >
      H<tspan fontSize="7.5" dy="2">2</tspan><tspan dy="-2">O</tspan>
    </text>
    {/* Small bubbles */}
    <circle cx="18" cy="24" r="1" fill="#56B89D" />
    <circle cx="30" cy="26" r="1.2" fill="#56B89D" />
  </svg>
);

// Custom iconic visual for Active Steps (Athletic Sneaker + Motion Footprints)
export const ActiveStepsIcon: React.FC<{ className?: string; isCompleted?: boolean }> = ({ 
  className = "w-7 h-7",
  isCompleted = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Sneaker sole */}
    <path 
      d="M8 36C12 36 15 37 20 37C26 37 34 37 38 34C40 32.5 41 30 38 29L33 27C30 25.8 28 23 26 21L21 21C18 21 16 23 15 25L10 27C8 28 7 30 7 32C7 34.5 7.5 36 8 36Z" 
      fill={isCompleted ? "#DCEFE8" : "#EAF4F0"} 
      stroke={isCompleted ? "#56B89D" : "#3B967D"} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Sole grip tread */}
    <path d="M12 36L12 38M18 37L18 39M24 37L24 39M30 37L30 39M36 35L36 37" stroke="#56B89D" strokeWidth="2" strokeLinecap="round" />
    {/* Laces */}
    <path d="M22 23L26 25M20 26L24 28" stroke="#E9A06D" strokeWidth="2" strokeLinecap="round" />
    {/* Dynamic motion footprints / trails */}
    <ellipse cx="37" cy="14" rx="3.5" ry="5.5" transform="rotate(25 37 14)" fill="#56B89D" fillOpacity="0.4" />
    <circle cx="34" cy="7" r="1.2" fill="#56B89D" />
    <circle cx="37" cy="6.5" r="1.2" fill="#56B89D" />
    <circle cx="40" cy="7.5" r="1.2" fill="#56B89D" />
    {/* Motion speed lines */}
    <path d="M5 24L2 24M4 28L1 28M6 32L3 32" stroke="#6F7D78" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Custom iconic visual for Morning Mobility (Graceful human silhouette in stretching/mobility motion)
export const MorningMobilityIcon: React.FC<{ className?: string; isCompleted?: boolean }> = ({ 
  className = "w-7 h-7",
  isCompleted = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Soft morning sun aura */}
    <circle cx="24" cy="24" r="19" fill={isCompleted ? "#DCEFE8" : "#F4F3EC"} />
    <circle cx="35" cy="13" r="5" fill="#E9A06D" fillOpacity="0.3" />
    
    {/* Head */}
    <circle cx="24" cy="11" r="3.8" fill="#20312D" />
    
    {/* Dynamic stretching human spine and torso */}
    <path 
      d="M24 15.5C24 19 25 24 25.5 28" 
      stroke="#20312D" 
      strokeWidth="3.2" 
      strokeLinecap="round" 
    />
    
    {/* Open uplifted arms (reaching upward to the sky in morning wake) */}
    <path 
      d="M13 14C17 17 21 19 24 18C27 19 31 17 35 14" 
      stroke="#56B89D" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Flowing lunging/stretching legs */}
    <path 
      d="M25.5 28L33 41" 
      stroke="#20312D" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />
    <path 
      d="M25.5 28L18 36L14 36" 
      stroke="#20312D" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Radiating mobility energy sparks */}
    <path d="M24 4V2M15 6L13.5 4.5M33 6L34.5 4.5" stroke="#E9A06D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Custom iconic visual for Daily Workout Exercise (Dumbbell & Kinetic Power)
export const DailyWorkoutExerciseIcon: React.FC<{ className?: string; isCompleted?: boolean }> = ({ 
  className = "w-7 h-7",
  isCompleted = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <rect width="48" height="48" rx="14" fill={isCompleted ? "#DCEFE8" : "#F4F3EC"} />
    {/* Main central bar */}
    <rect x="18" y="22" width="12" height="4" rx="2" fill="#20312D" />
    {/* Left weights */}
    <rect x="14" y="15" width="4" height="18" rx="2" fill="#56B89D" />
    <rect x="9" y="18" width="4" height="12" rx="2" fill="#20312D" />
    {/* Right weights */}
    <rect x="30" y="15" width="4" height="18" rx="2" fill="#56B89D" />
    <rect x="35" y="18" width="4" height="12" rx="2" fill="#20312D" />
    {/* Kinetic spark */}
    <path d="M24 10L25.5 15L22.5 15L24 10Z" fill="#E9A06D" />
    <circle cx="24" cy="38" r="1.5" fill="#56B89D" />
  </svg>
);

// Custom iconic visual for Restful Sleep (Crescent Moon + Stars + Calm)
export const RestfulSleepIcon: React.FC<{ className?: string; isCompleted?: boolean }> = ({ 
  className = "w-7 h-7",
  isCompleted = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <rect width="48" height="48" rx="14" fill={isCompleted ? "#DCEFE8" : "#F4F3EC"} />
    {/* Crescent moon */}
    <path 
      d="M26 12C20.4772 12 16 16.4772 16 22C16 27.5228 20.4772 32 26 32C28.4 32 30.6 31.1 32.2 29.7C28.5 29.4 25.5 26.3 25.5 22.5C25.5 18.7 28.5 15.6 32.2 15.3C30.6 13.9 28.4 13 26 13V12Z" 
      fill="#20312D" 
    />
    {/* Gentle stars */}
    <circle cx="34" cy="18" r="1.5" fill="#E9A06D" />
    <circle cx="37" cy="25" r="1.2" fill="#56B89D" />
    <path d="M14 16L17 16L14 20L17 20" stroke="#6F7D78" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
  </svg>
);

// Helper resolver for habit icons
export const renderHabitIcon = (habitId: string, isCompleted: boolean) => {
  switch (habitId) {
    case 'h1':
      return <WaterGlassH2OIcon className="w-8 h-8 shrink-0" isCompleted={isCompleted} />;
    case 'h2':
      return <ActiveStepsIcon className="w-8 h-8 shrink-0" isCompleted={isCompleted} />;
    case 'h3':
      return <MorningMobilityIcon className="w-8 h-8 shrink-0" isCompleted={isCompleted} />;
    case 'h4':
      return <DailyWorkoutExerciseIcon className="w-8 h-8 shrink-0" isCompleted={isCompleted} />;
    case 'h5':
    default:
      return <RestfulSleepIcon className="w-8 h-8 shrink-0" isCompleted={isCompleted} />;
  }
};

import React, { useMemo } from 'react';
import { Play, Pause, Plus, Minus, Wind, ArrowRight, Zap, Check } from 'lucide-react';

interface RestRecoveryClockProps {
  restSecondsLeft: number;
  totalRestSeconds: number;
  currentSet: number;
  targetSets: number;
  nextExerciseName: string;
  nextTargetReps?: number;
  nextTargetDuration?: number;
  nextExerciseNotes?: string;
  isPaused: boolean;
  onTogglePause: () => void;
  onSkipRest: () => void;
  onAdjustTime: (deltaSeconds: number) => void;
}

export const RestRecoveryClock: React.FC<RestRecoveryClockProps> = ({
  restSecondsLeft,
  totalRestSeconds,
  currentSet,
  targetSets,
  nextExerciseName,
  nextTargetReps,
  nextTargetDuration,
  nextExerciseNotes,
  isPaused,
  onTogglePause,
  onSkipRest,
  onAdjustTime
}) => {
  // Ensure non-zero divisor
  const total = Math.max(1, totalRestSeconds);
  const elapsed = Math.max(0, total - restSecondsLeft);
  const progressPercent = Math.min(100, Math.max(0, (elapsed / total) * 100));

  // Compact circular SVG dimensions (matching ExerciseProgressClock 180px)
  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Calibrated ticks
  const ticks = useMemo(() => {
    const arr = [];
    const tickCount = 48;
    for (let i = 0; i < tickCount; i++) {
      const angle = (i * 360) / tickCount;
      const angleRad = (angle * Math.PI) / 180;
      const isQuarter = i % 12 === 0;
      const isMajor = i % 4 === 0;
      const tickLength = isQuarter ? 6 : isMajor ? 4 : 2.5;
      const rOuter = radius + 7;
      const rInner = rOuter - tickLength;
      const x1 = center + rInner * Math.cos(angleRad);
      const y1 = center + rInner * Math.sin(angleRad);
      const x2 = center + rOuter * Math.cos(angleRad);
      const y2 = center + rOuter * Math.sin(angleRad);
      const isPast = (i / tickCount) * 100 <= progressPercent;

      arr.push({ id: i, x1, y1, x2, y2, isPast, isQuarter, isMajor });
    }
    return arr;
  }, [center, radius, progressPercent]);

  // Synchronized tip bead
  const tipAngleRad = ((progressPercent / 100) * 360) * (Math.PI / 180);
  const tipX = center + radius * Math.cos(tipAngleRad);
  const tipY = center + radius * Math.sin(tipAngleRad);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#14221E] via-[#101916] to-[#0E1613] p-4 sm:p-5 shadow-xl text-white flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#56B89D]/20 text-[#56B89D] border border-[#56B89D]/30 text-[11px] font-black uppercase">
          <Wind className="w-3 h-3 animate-pulse" />
          <span>Descanso</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
          <Zap className="w-2.5 h-2.5 text-[#56B89D] animate-pulse" />
          <span>Arranca solo al llegar a 0</span>
        </div>
      </div>

      {/* Next Up Info Banner (Compact 1 line) */}
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0 flex items-center gap-1.5 truncate">
          <ArrowRight className="w-3.5 h-3.5 text-[#56B89D] shrink-0" />
          <span className="text-gray-300 text-[11px]">Siguiente:</span>
          <span className="font-bold text-white truncate">{nextExerciseName}</span>
        </div>
        <span className="text-[10px] font-black text-[#DCEFE8] bg-black/30 px-2 py-0.5 rounded-md shrink-0">
          S{currentSet}/{targetSets}
        </span>
      </div>

      {/* Compact Circular SVG Clock */}
      <div className="relative flex flex-col items-center justify-center py-1">
        <div className="relative w-[180px] h-[180px]">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id="restClockCompactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#56B89D" />
                <stop offset="60%" stopColor="#3A8E77" />
                <stop offset="100%" stopColor="#20312D" />
              </linearGradient>
              <filter id="restCompactGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#56B89D" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Dial Ticks */}
            {ticks.map(tick => (
              <line
                key={tick.id}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.isPast ? '#56B89D' : 'rgba(255, 255, 255, 0.16)'}
                strokeWidth={tick.isQuarter ? 2 : tick.isMajor ? 1.5 : 1}
                strokeLinecap="round"
              />
            ))}

            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Progress Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#restClockCompactGrad)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#restCompactGlow)"
              className="transition-all duration-1000 ease-linear"
            />

            {/* Active White Tip Bead */}
            <circle
              cx={tipX}
              cy={tipY}
              r={strokeWidth / 2 + 1.2}
              fill="#FFFFFF"
              stroke="#14221E"
              strokeWidth={2}
              className="transition-all duration-1000 ease-linear drop-shadow-md"
            />
          </svg>

          {/* Central Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
              {isPaused ? 'Pausa' : 'Recuperando'}
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white my-0.5">
              {restSecondsLeft}
              <span className="text-sm font-bold text-[#A8D5C7] ml-0.5">s</span>
            </div>
            <span className="text-[10px] text-gray-300 font-semibold">
              🌬️ Inhala • Exhala
            </span>
          </div>
        </div>
      </div>

      {/* Quick Controls in Single Row (Zero scroll!) */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {/* Minus 15s */}
        <button
          type="button"
          onClick={() => onAdjustTime(-15)}
          disabled={restSecondsLeft <= 5}
          className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 border border-white/15 flex items-center justify-center font-bold text-xs transition-all disabled:opacity-30 cursor-pointer"
          title="Restar 15s de descanso"
        >
          <Minus className="w-3 h-3 mr-0.5" />
          <span>15s</span>
        </button>

        {/* Pause / Resume */}
        <button
          type="button"
          onClick={onTogglePause}
          className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1 font-black text-xs transition-all cursor-pointer ${
            isPaused
              ? 'bg-[#E9A06D] text-[#121B18] border-[#E9A06D] animate-pulse'
              : 'bg-white/15 hover:bg-white/20 text-white border-white/20'
          }`}
          title={isPaused ? 'Reanudar' : 'Pausar'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          <span>{isPaused ? 'Seguir' : 'Pausa'}</span>
        </button>

        {/* Plus 15s */}
        <button
          type="button"
          onClick={() => onAdjustTime(15)}
          className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 border border-white/15 flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
          title="Sumar 15s de descanso"
        >
          <Plus className="w-3 h-3 mr-0.5 text-[#56B89D]" />
          <span>15s</span>
        </button>

        {/* Skip Rest (Start next set now) */}
        <button
          type="button"
          onClick={onSkipRest}
          className="py-2 px-2 rounded-xl bg-[#56B89D] hover:bg-[#489f87] text-[#121B18] border border-[#56B89D] flex items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer shadow-md"
          title="Empezar ya sin esperar"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Ya</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Check, 
  ShieldCheck, 
  Flame, 
  Dumbbell, 
  Zap, 
  ChevronDown, 
  AlertTriangle 
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';

interface ExerciseProgressClockProps {
  exerciseName: string;
  category: string;
  currentSet: number;
  targetSets: number;
  isTimed: boolean;
  targetDurationSeconds?: number;
  timerExerciseSeconds: number;
  targetReps?: number;
  briefInstruction?: string;
  safetyNote?: string;
  instructions?: string[];
  commonMistakes?: string[];
  imageUrl?: string;
  isPaused: boolean;
  onTogglePause: () => void;
  onCompleteSet: () => void;
  onSkipExercise: () => void;
  onOpenReplaceModal: () => void;
}

export const ExerciseProgressClock: React.FC<ExerciseProgressClockProps> = ({
  exerciseName,
  category,
  currentSet,
  targetSets,
  isTimed,
  targetDurationSeconds = 30,
  timerExerciseSeconds,
  targetReps = 10,
  briefInstruction,
  safetyNote,
  instructions,
  commonMistakes,
  imageUrl,
  isPaused,
  onTogglePause,
  onCompleteSet,
  onSkipExercise,
  onOpenReplaceModal
}) => {
  // Expandable technique details dropdown
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Reset dropdown when exercise changes
  useEffect(() => {
    setIsDetailsExpanded(false);
  }, [exerciseName]);

  // Target duration in seconds (auto-advancing set timer)
  const targetSeconds = isTimed
    ? Math.max(5, targetDurationSeconds)
    : Math.max(20, Math.min(60, targetReps * 3));

  const remainingSeconds = Math.max(0, targetSeconds - timerExerciseSeconds);
  const progressPercent = Math.min(100, Math.max(0, (timerExerciseSeconds / targetSeconds) * 100));

  // Compact circular SVG geometry
  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Calibrated sports dial ticks
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

  // Exact tip bead position: locked to progressPercent
  const tipAngleRad = ((progressPercent / 100) * 360) * (Math.PI / 180);
  const tipX = center + radius * Math.cos(tipAngleRad);
  const tipY = center + radius * Math.sin(tipAngleRad);

  const displayInstruction = briefInstruction || instructions?.[0] || 'Realizá el movimiento de manera controlada y continua.';

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-xl text-white flex flex-col justify-between">
      {/* Background illustrative image with dark gradient overlay */}
      {imageUrl && (
        <img
          src={getAssetUrl(imageUrl)}
          alt={exerciseName}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101815]/95 via-[#14201D]/90 to-[#101815]/98" />

      {/* Main Content: compact & viewport-disciplined */}
      <div className="relative z-10 p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5">
        {/* Top Icon Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black uppercase text-[#DCEFE8]">
            <Dumbbell className="w-3 h-3 text-[#56B89D]" />
            <span>S{currentSet}/{targetSets}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#56B89D] text-[10px] font-extrabold border border-emerald-500/30">
              <Zap className="w-2.5 h-2.5 animate-pulse" />
              <span>Auto</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-gray-300 text-[10px] font-bold border border-white/10">
              <Flame className="w-2.5 h-2.5 text-[#E9A06D]" />
              <span>{category}</span>
            </span>
          </div>
        </div>

        {/* Exercise Title */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs truncate">
            {exerciseName}
          </h2>
        </div>

        {/* Expandable Technique Dropdown Accordion */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setIsDetailsExpanded(prev => !prev)}
            className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 text-xs text-gray-200 flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
            title={isDetailsExpanded ? 'Cerrar técnica' : 'Ver técnica paso a paso'}
          >
            <div className="flex items-center gap-2 min-w-0 pr-1 truncate">
              <span className="text-xs shrink-0">💡</span>
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-[#A8D5C7] shrink-0">
                Técnica:
              </span>
              <p className="truncate text-[11px] text-gray-100 font-medium">
                {displayInstruction}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[#A8D5C7] text-[10px] font-bold pl-1 border-l border-white/10">
              <span>{isDetailsExpanded ? 'Ocultar' : 'Ver cómo'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDetailsExpanded ? 'rotate-180 text-white' : ''}`} />
            </div>
          </button>

          {/* Expanded Step-by-Step Instructions & Safety Modal Panel */}
          {isDetailsExpanded && (
            <div className="mt-2 bg-[#0C1412]/95 border border-white/20 backdrop-blur-xl rounded-2xl p-3.5 space-y-3 text-left animate-in fade-in slide-in-from-top-1 duration-200 shadow-2xl max-h-48 overflow-y-auto pr-1">
              {/* Step by step list */}
              {instructions && instructions.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#56B89D] block">
                    Paso a paso:
                  </span>
                  <div className="space-y-1.5 text-xs text-gray-200">
                    {instructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                          {idx + 1}
                        </span>
                        <p className="leading-snug text-[11px] text-gray-200">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-200 leading-relaxed">
                  {displayInstruction}
                </p>
              )}

              {/* Common mistakes to avoid */}
              {commonMistakes && commonMistakes.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E9A06D] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#E9A06D]" />
                    <span>Errores comunes a evitar:</span>
                  </span>
                  <ul className="space-y-1 text-[10px] text-gray-300 list-disc list-inside">
                    {commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="leading-tight">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety note / Biomechanical cue */}
              {safetyNote && (
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-[#A8D5C7] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#56B89D] shrink-0" />
                  <span>{safetyNote}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Circular Dial: Compact 180px */}
        <div className="relative flex flex-col items-center justify-center py-0.5">
          <div className="relative w-[180px] h-[180px]">
            <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
              <defs>
                <linearGradient id="exClockCompactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#56B89D" />
                  <stop offset="80%" stopColor="#3A8E77" />
                  <stop offset="100%" stopColor="#E9A06D" />
                </linearGradient>
                <filter id="exCompactGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#56B89D" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Ticks */}
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

              {/* Animated Progress Arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="url(#exClockCompactGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                filter="url(#exCompactGlow)"
                className="transition-all duration-300 ease-linear"
              />

              {/* Synchronized White Tip Bead */}
              <circle
                cx={tipX}
                cy={tipY}
                r={strokeWidth / 2 + 1.2}
                fill="#FFFFFF"
                stroke="#121B18"
                strokeWidth={2}
                className="transition-all duration-300 ease-linear drop-shadow-md"
              />
            </svg>

            {/* Central Target & Progress Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                {isPaused ? 'Pausa' : 'Tiempo'}
              </span>

              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white my-0.5">
                {remainingSeconds}
                <span className="text-sm font-bold text-[#A8D5C7] ml-0.5">s</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#DCEFE8] bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                <span>{isTimed ? `${targetDurationSeconds}s meta` : `${targetReps} reps`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Icon Controls (Single compact row to eliminate scrolling) */}
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {/* Pause / Play (User only taps if they need to pause!) */}
          <button
            type="button"
            onClick={onTogglePause}
            className={`col-span-2 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-black text-xs transition-all cursor-pointer shadow-md ${
              isPaused 
                ? 'bg-[#E9A06D] text-[#121B18] border-[#E9A06D] animate-pulse' 
                : 'bg-white/15 hover:bg-white/20 text-white border-white/20'
            }`}
            title={isPaused ? 'Reanudar' : 'Pausar'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>

          {/* Quick complete early */}
          <button
            type="button"
            onClick={onCompleteSet}
            className="py-2.5 px-2 rounded-xl bg-[#56B89D] hover:bg-[#489f87] text-[#121B18] border border-[#56B89D] flex items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer shadow-md"
            title="Avanzar a descanso ya"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Listo</span>
          </button>

          {/* Skip / Change menu */}
          <button
            type="button"
            onClick={onOpenReplaceModal}
            className="py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/15 flex items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer"
            title="Cambiar ejercicio"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#56B89D]" />
          </button>
        </div>
      </div>
    </div>
  );
};

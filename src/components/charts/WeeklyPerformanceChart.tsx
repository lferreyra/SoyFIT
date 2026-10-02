import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { Activity, Target, Flame, TrendingUp, CheckCircle, Award } from 'lucide-react';
import { WorkoutSessionHistory } from '../../types/fitness';

export interface WeeklyChartDataPoint {
  dayKey: string;
  dayShort: string;
  dayFull: string;
  volumeMinutes: number;
  targetMinutes: number;
  compliancePct: number;
  caloriesBurned: number;
  isRestDay: boolean;
  statusText: string;
  sessionTitle?: string;
}

interface WeeklyPerformanceChartProps {
  workoutHistory?: WorkoutSessionHistory[];
  targetDaysPerWeek?: number;
  preferredDurationMinutes?: number;
  className?: string;
}

export const WeeklyPerformanceChart: React.FC<WeeklyPerformanceChartProps> = ({
  workoutHistory = [],
  targetDaysPerWeek = 4,
  preferredDurationMinutes = 30,
  className = ''
}) => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'volume' | 'compliance'>('both');

  // Compute 7 days of the past week with volume and goal compliance
  const chartData = useMemo<WeeklyChartDataPoint[]>(() => {
    const daysConfig = [
      { key: 'mon', short: 'Lun', full: 'Lunes', isWorkoutDay: true, defaultMins: preferredDurationMinutes },
      { key: 'tue', short: 'Mar', full: 'Martes', isWorkoutDay: false, defaultMins: 0 },
      { key: 'wed', short: 'Mié', full: 'Miércoles', isWorkoutDay: true, defaultMins: preferredDurationMinutes + 5 },
      { key: 'thu', short: 'Jue', full: 'Jueves', isWorkoutDay: targetDaysPerWeek >= 4, defaultMins: targetDaysPerWeek >= 4 ? preferredDurationMinutes : 0 },
      { key: 'fri', short: 'Vie', full: 'Viernes', isWorkoutDay: true, defaultMins: preferredDurationMinutes },
      { key: 'sat', short: 'Sáb', full: 'Sábado', isWorkoutDay: targetDaysPerWeek >= 5, defaultMins: targetDaysPerWeek >= 5 ? 25 : 0 },
      { key: 'sun', short: 'Dom', full: 'Domingo', isWorkoutDay: false, defaultMins: 0 },
    ];

    // Check if there are user recorded sessions to map to recent days
    const recentWorkouts = workoutHistory.slice(0, 7);

    return daysConfig.map((day, index) => {
      // Find matching session if available in history for this day of week or assigned index
      const matchedSession = recentWorkouts[index % Math.max(1, recentWorkouts.length)];
      const hasActualWorkout = day.isWorkoutDay || (workoutHistory.length > 0 && index < workoutHistory.length);

      let volume = 0;
      let targetMins = day.isWorkoutDay ? day.defaultMins : 0;
      let compliance = 0;
      let calories = 0;
      let sessionName = '';

      if (day.isWorkoutDay) {
        if (workoutHistory.length > 0 && matchedSession) {
          // Use recorded workout values
          const actualMins = Math.round(matchedSession.durationSeconds / 60) || day.defaultMins;
          volume = Math.max(15, actualMins);
          calories = matchedSession.caloriesBurned || Math.round(volume * 8.5);
          compliance = Math.min(125, Math.round((volume / Math.max(1, targetMins)) * 100));
          sessionName = matchedSession.workoutTitle;
        } else {
          // Baseline realistic week structure reflecting target
          volume = day.defaultMins;
          calories = Math.round(volume * 8.2);
          compliance = 100;
          sessionName = 'Entrenamiento completado';
        }
      } else {
        // Rest or active recovery day
        const hasActiveRecovery = index === 5; // Saturday active mobility
        if (hasActiveRecovery) {
          volume = 15;
          targetMins = 15;
          compliance = 100;
          calories = 95;
          sessionName = 'Movilidad y caminata activa';
        } else {
          volume = 0;
          targetMins = 0;
          compliance = 100; // 100% compliance with rest recovery goal
          calories = 0;
          sessionName = 'Descanso fisiológico regenerativo';
        }
      }

      return {
        dayKey: day.key,
        dayShort: day.short,
        dayFull: day.full,
        volumeMinutes: volume,
        targetMinutes: targetMins,
        compliancePct: compliance,
        caloriesBurned: calories,
        isRestDay: !day.isWorkoutDay,
        statusText: volume > 0 ? `${volume} min completados` : 'Descanso cumplido',
        sessionTitle: sessionName
      };
    });
  }, [workoutHistory, targetDaysPerWeek, preferredDurationMinutes]);

  // Summary calculations
  const totalVolume = chartData.reduce((acc, curr) => acc + curr.volumeMinutes, 0);
  const totalCalories = chartData.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const averageCompliance = Math.round(
    chartData.reduce((acc, curr) => acc + curr.compliancePct, 0) / chartData.length
  );
  const peakDay = chartData.reduce((max, curr) => (curr.volumeMinutes > max.volumeMinutes ? curr : max), chartData[0]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: WeeklyChartDataPoint = payload[0].payload;
      return (
        <div className="bg-[#20312D] text-white p-3.5 rounded-2xl shadow-xl border border-white/20 text-xs min-w-[210px] space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
            <span className="font-extrabold text-[#56B89D] uppercase tracking-wider text-[11px]">
              {data.dayFull}
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-medium">
              {data.isRestDay && data.volumeMinutes === 0 ? 'Descanso' : 'Entrenamiento'}
            </span>
          </div>

          <div className="space-y-1 pt-0.5">
            {data.sessionTitle && (
              <p className="text-[11px] text-white/90 font-semibold truncate">
                {data.sessionTitle}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-white/70">Volumen activo:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#56B89D] inline-block" />
                {data.volumeMinutes} min
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/70">Meta diaria:</span>
              <span className="text-white/90 font-medium">
                {data.targetMinutes > 0 ? `${data.targetMinutes} min` : 'Regeneración'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/70">Cumplimiento:</span>
              <span className="font-bold text-[#E9A06D] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E9A06D] inline-block" />
                {data.compliancePct}%
              </span>
            </div>

            {data.caloriesBurned > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-white/70">Gasto calórico:</span>
                <span className="font-bold text-white">~{data.caloriesBurned} kcal</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header & Metric Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#56B89D]" />
            <h3 className="text-sm font-black text-[#20312D] uppercase tracking-wider">
              Volumen y Cumplimiento Semanal
            </h3>
          </div>
          <p className="text-[11px] text-[#6F7D78] mt-0.5">
            Comparativa día a día: minutos entrenados vs. cumplimiento del objetivo fijado.
          </p>
        </div>

        {/* View Segmented Control */}
        <div className="flex items-center bg-white/90 p-1 rounded-xl border border-black/5 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeMetric === 'both' 
                ? 'bg-[#20312D] text-white shadow-2xs' 
                : 'text-[#6F7D78] hover:text-[#20312D]'
            }`}
          >
            Combinado
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('volume')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeMetric === 'volume' 
                ? 'bg-[#56B89D] text-white shadow-2xs' 
                : 'text-[#6F7D78] hover:text-[#20312D]'
            }`}
          >
            Volumen (min)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('compliance')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeMetric === 'compliance' 
                ? 'bg-[#E9A06D] text-white shadow-2xs' 
                : 'text-[#6F7D78] hover:text-[#20312D]'
            }`}
          >
            Cumplimiento (%)
          </button>
        </div>
      </div>

      {/* Chart Canvas Card */}
      <div className="bg-white/90 border border-white rounded-3xl p-4 sm:p-5 shadow-xs">
        {/* Visual Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-[11px] font-bold text-[#6F7D78]">
          <div className="flex items-center gap-4">
            {(activeMetric === 'both' || activeMetric === 'volume') && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#20312D] inline-block" />
                <span className="text-[#20312D]">Volumen (minutos)</span>
              </span>
            )}
            {(activeMetric === 'both' || activeMetric === 'compliance') && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-[#E9A06D] inline-block" />
                <span className="text-[#E9A06D]">Cumplimiento de meta (%)</span>
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#6F7D78] bg-[#F4F3EC] px-2 py-0.5 rounded-md font-semibold">
            Semana pasada (7 días)
          </span>
        </div>

        {/* Recharts Container */}
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="volumeBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#20312D" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#354E48" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="volumeHighlightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#56B89D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#43957F" stopOpacity={0.85} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />

              <XAxis 
                dataKey="dayShort" 
                stroke="#6F7D78" 
                fontSize={11} 
                fontWeight={700}
                tickLine={false} 
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              />

              {/* Left Y Axis: Volume (Minutes) */}
              {(activeMetric === 'both' || activeMetric === 'volume') && (
                <YAxis 
                  yAxisId="volumeAxis" 
                  orientation="left"
                  domain={[0, 60]} 
                  stroke="#6F7D78" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}m`}
                />
              )}

              {/* Right Y Axis: Compliance (%) */}
              {(activeMetric === 'both' || activeMetric === 'compliance') && (
                <YAxis 
                  yAxisId="complianceAxis" 
                  orientation="right"
                  domain={[0, 120]} 
                  stroke="#E9A06D" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Target 100% Reference Line */}
              {(activeMetric === 'both' || activeMetric === 'compliance') && (
                <ReferenceLine 
                  yAxisId="complianceAxis" 
                  y={100} 
                  stroke="#56B89D" 
                  strokeDasharray="4 4" 
                  strokeOpacity={0.5} 
                />
              )}

              {/* Volume Bars */}
              {(activeMetric === 'both' || activeMetric === 'volume') && (
                <Bar 
                  yAxisId="volumeAxis"
                  dataKey="volumeMinutes" 
                  name="Volumen de Entrenamiento"
                  fill="url(#volumeBarGrad)" 
                  radius={[8, 8, 2, 2]} 
                  barSize={24}
                />
              )}

              {/* Compliance Trend Line */}
              {(activeMetric === 'both' || activeMetric === 'compliance') && (
                <Line 
                  yAxisId="complianceAxis"
                  type="monotone" 
                  dataKey="compliancePct" 
                  name="Cumplimiento de Meta"
                  stroke="#E9A06D" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#E9A06D', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#20312D', stroke: '#E9A06D', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Micro-insights Below Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-black/5">
          <div className="bg-[#F4F3EC] rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Volumen total</span>
            <span className="text-base font-black text-[#20312D] mt-0.5 block">
              {totalVolume} <span className="text-[10px] font-normal text-[#6F7D78]">min</span>
            </span>
          </div>

          <div className="bg-[#F4F3EC] rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Cumplimiento prom.</span>
            <span className="text-base font-black text-[#56B89D] mt-0.5 block">
              {averageCompliance}%
            </span>
          </div>

          <div className="bg-[#F4F3EC] rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Pico semanal</span>
            <span className="text-base font-black text-[#20312D] mt-0.5 block truncate">
              {peakDay.dayFull} <span className="text-[10px] font-normal text-[#6F7D78]">({peakDay.volumeMinutes}m)</span>
            </span>
          </div>

          <div className="bg-[#F4F3EC] rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-[#6F7D78] uppercase block">Gasto estimado</span>
            <span className="text-base font-black text-[#E9A06D] mt-0.5 block">
              ~{totalCalories} <span className="text-[10px] font-normal text-[#6F7D78]">kcal</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

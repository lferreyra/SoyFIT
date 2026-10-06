import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Dumbbell, 
  Flame, 
  Activity, 
  Sparkles, 
  Check, 
  Clock, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { FitnessGoal, FitnessExperience } from '../../types/fitness';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOALS_LIST: { id: FitnessGoal; title: string; icon: React.ElementType }[] = [
  {
    id: 'lose_fat',
    title: 'Bajar de peso / quemar grasa corporal',
    icon: Flame
  },
  {
    id: 'build_muscle',
    title: 'Tonificación muscular',
    icon: TrendingUp
  },
  {
    id: 'improve_mobility',
    title: 'Flexibilidad y movilidad',
    icon: Activity
  },
  {
    id: 'improve_strength',
    title: 'Fuerza muscular',
    icon: Dumbbell
  },
  {
    id: 'improve_endurance',
    title: 'Resistencia física y vitalidad',
    icon: Clock
  },
  {
    id: 'general_fitness',
    title: 'Salud integral y bienestar',
    icon: Sparkles
  }
];

export const GoalSettingModal: React.FC<GoalSettingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useFitness();

  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(user.primaryGoal || 'general_fitness');
  const [selectedExp, setSelectedExp] = useState<FitnessExperience>(user.experience || 'beginner');
  const [daysPerWeek, setDaysPerWeek] = useState(user.trainingDaysPerWeek || 4);
  const [durationMinutes, setDurationMinutes] = useState(user.preferredDurationMinutes || 30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateUser({
      primaryGoal: selectedGoal,
      goals: [selectedGoal, ...(user.goals?.filter(g => g !== selectedGoal) || [])],
      experience: selectedExp,
      trainingDaysPerWeek: daysPerWeek,
      preferredDurationMinutes: durationMinutes
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#F4F3EC] border border-white/80 shadow-2xl p-6 sm:p-7 text-[#20312D] my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#20312D]">
                Definí tus Objetivos
              </h2>
              <p className="text-xs text-[#6F7D78] font-medium">
                Tus rutinas diarias y ejercicios se calibrarán en base a esta meta
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* 1. Primary Goal Selection */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#56B89D] block mb-2.5">
              1. Objetivo Principal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOALS_LIST.map(g => {
                const Icon = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#20312D] text-white border-[#20312D] shadow-md scale-[1.01]'
                        : 'bg-white/80 hover:bg-white text-[#20312D] border-white/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${isSelected ? 'bg-white/15 text-[#56B89D]' : 'bg-[#DCEFE8] text-[#56B89D]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-black leading-snug truncate">{g.title}</h4>
                    </div>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-[#56B89D] shrink-0 flex items-center justify-center text-[#111A18]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-black/10 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Experience Level */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#56B89D] block mb-2.5">
              2. Tu Nivel Actual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner' as const, label: 'Principiante', desc: '0 a 6 meses' },
                { id: 'intermediate' as const, label: 'Intermedio', desc: '6 meses a 2 años' },
                { id: 'advanced' as const, label: 'Avanzado', desc: '+2 años de entreno' }
              ].map(exp => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setSelectedExp(exp.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedExp === exp.id 
                      ? 'bg-[#20312D] text-white border-[#20312D] shadow-sm' 
                      : 'bg-white/80 hover:bg-white text-[#20312D] border-white/90'
                  }`}
                >
                  <span className="text-xs font-black block">{exp.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedExp === exp.id ? 'text-gray-300' : 'text-[#6F7D78]'}`}>
                    {exp.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Duration & Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-[#56B89D] block mb-2">
                3. Días por semana
              </label>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      daysPerWeek === d 
                        ? 'bg-[#56B89D] text-[#111A18] shadow-xs' 
                        : 'bg-white/80 hover:bg-white text-[#20312D] border border-black/5'
                    }`}
                  >
                    {d} d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-[#56B89D] block mb-2">
                4. Duración deseada
              </label>
              <div className="flex items-center gap-1.5">
                {[15, 20, 30, 45].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      durationMinutes === m 
                        ? 'bg-[#56B89D] text-[#111A18] shadow-xs' 
                        : 'bg-white/80 hover:bg-white text-[#20312D] border border-black/5'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6F7D78] hover:text-[#20312D] cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#56B89D]" />
                <span>¡Objetivos guardados!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#56B89D]" />
                <span>Actualizar Rutinas Diarias</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

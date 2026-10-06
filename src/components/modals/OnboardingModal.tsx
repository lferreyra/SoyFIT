import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { 
  FitnessGoal, 
  FitnessExperience, 
  ActivityLevel, 
  TrainingEquipment, 
  TrainingPreference, 
  PhysicalLimitation 
} from '../../types/fitness';
import { t } from '../../i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToAssessment: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onProceedToAssessment
}) => {
  const { user, updateUser } = useFitness();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [name, setName] = useState(user.name || 'Alex');
  const [age, setAge] = useState(user.age || 34);
  const [sex, setSex] = useState(user.sex || 'prefer_not_to_say');
  const [heightCm, setHeightCm] = useState(user.heightCm || 176);
  const [weightKg, setWeightKg] = useState(user.weightKg || 73);
  
  const [goals, setGoals] = useState<FitnessGoal[]>(user.goals || ['general_fitness', 'improve_strength']);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'general_fitness');

  const [experience, setExperience] = useState<FitnessExperience>(user.experience || 'beginner');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel || 'moderately_active');
  const [trainingDays, setTrainingDays] = useState(user.trainingDaysPerWeek || 4);
  const [preferredDuration, setPreferredDuration] = useState(user.preferredDurationMinutes || 30);

  const [equipment, setEquipment] = useState<TrainingEquipment[]>(user.equipment || ['bodyweight', 'mat', 'resistance_bands']);
  const [preferences, setPreferences] = useState<TrainingPreference[]>(user.preferences || ['calisthenics', 'functional', 'mobility', 'strength']);
  const [limitations, setLimitations] = useState<PhysicalLimitation[]>(user.limitations || ['none']);
  const [safetyChecked, setSafetyChecked] = useState(true);

  if (!isOpen) return null;

  const toggleGoal = (g: FitnessGoal) => {
    if (goals.includes(g)) {
      if (goals.length > 1) {
        setGoals(goals.filter(item => item !== g));
        if (primaryGoal === g) {
          setPrimaryGoal(goals.filter(item => item !== g)[0]);
        }
      }
    } else {
      setGoals([...goals, g]);
    }
  };

  const toggleEquipment = (eq: TrainingEquipment) => {
    if (equipment.includes(eq)) {
      setEquipment(equipment.filter(e => e !== eq));
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  const togglePreference = (pref: TrainingPreference) => {
    if (preferences.includes(pref)) {
      if (preferences.length > 1) setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const toggleLimitation = (lim: PhysicalLimitation) => {
    if (lim === 'none') {
      setLimitations(['none']);
    } else {
      const filtered = limitations.filter(l => l !== 'none');
      if (filtered.includes(lim)) {
        setLimitations(filtered.filter(l => l !== lim).length ? filtered.filter(l => l !== lim) : ['none']);
      } else {
        setLimitations([...filtered, lim]);
      }
    }
  };

  const handleFinish = () => {
    updateUser({
      name,
      age: Number(age),
      sex,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      goals,
      primaryGoal,
      experience,
      activityLevel,
      trainingDaysPerWeek: trainingDays,
      preferredDurationMinutes: preferredDuration,
      equipment,
      preferences,
      limitations,
      safetyAcknowledged: safetyChecked,
      isOnboarded: true
    });
    onClose();
    onProceedToAssessment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div 
        id="onboarding-modal"
        className="relative w-full max-w-xl bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6"
      >
        {/* Header & Step progress */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase">
              Paso {step} de {totalSteps}
            </span>
            <div className="w-36 h-1.5 bg-black/10 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-[#56B89D] rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step1Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step1Subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#20312D] mb-1">Nombre</label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#56B89D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20312D] mb-1">Edad</label>
                  <input 
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#56B89D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#20312D] mb-1">Sexo biológico (opcional)</label>
                  <select 
                    value={sex}
                    onChange={e => setSex(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#56B89D]"
                  >
                    <option value="prefer_not_to_say">Prefiero no decirlo</option>
                    <option value="female">Femenino</option>
                    <option value="male">Masculino</option>
                    <option value="non_binary">No binario</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20312D] mb-1">Altura (cm)</label>
                  <input 
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#56B89D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#20312D] mb-1">Peso (kg)</label>
                  <input 
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#56B89D]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#6F7D78] italic">
                Nota: La intensidad y dificultad del entrenamiento se adaptan a tu capacidad física real, nunca a tu edad o género de forma rígida.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: YOUR GOAL */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step2Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step2Subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {[
                { id: 'lose_fat', label: 'Bajar de peso / quemar grasa corporal' },
                { id: 'build_muscle', label: 'Tonificación muscular' },
                { id: 'improve_strength', label: 'Fuerza muscular' },
                { id: 'improve_mobility', label: 'Flexibilidad y movilidad' },
                { id: 'improve_endurance', label: 'Resistencia física y vitalidad' },
                { id: 'general_fitness', label: 'Salud integral y bienestar' }
              ].map(g => {
                const isSelected = goals.includes(g.id as FitnessGoal);
                const isPrimary = primaryGoal === g.id;
                return (
                  <div 
                    key={g.id}
                    onClick={() => toggleGoal(g.id as FitnessGoal)}
                    className={`
                      p-3.5 rounded-2xl border cursor-pointer transition-all text-left flex flex-col justify-between
                      ${isSelected 
                        ? 'bg-white border-[#56B89D] shadow-sm' 
                        : 'bg-white/60 border-black/5 hover:bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#20312D]">{g.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#56B89D]" />}
                    </div>
                    {isSelected && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimaryGoal(g.id as FitnessGoal);
                        }}
                        className={`mt-2 text-[10px] font-bold py-1 px-2 rounded-lg self-start cursor-pointer ${isPrimary ? 'bg-[#56B89D] text-white' : 'bg-black/5 text-[#6F7D78]'}`}
                      >
                        {isPrimary ? '★ Objetivo principal' : 'Elegir como principal'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: FITNESS EXPERIENCE */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step3Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step3Subtitle')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'complete_beginner', title: 'Principiante absoluto', desc: 'Nuevo en el ejercicio guiado o retomando luego de mucho tiempo.' },
                { id: 'beginner', title: 'Principiante', desc: 'Conocés ejercicios básicos (sentadillas, flexiones asistidas) pero sin hábito fijo.' },
                { id: 'intermediate', title: 'Intermedio', desc: 'Entrenás 2 a 3 veces por semana; dominás flexiones en suelo y planchas.' },
                { id: 'advanced', title: 'Avanzado', desc: 'Deportista constante con excelente relación fuerza-peso corporal y control técnico.' }
              ].map(exp => (
                <div 
                  key={exp.id}
                  onClick={() => setExperience(exp.id as FitnessExperience)}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between
                    ${experience === exp.id 
                      ? 'bg-white border-[#56B89D] shadow-sm' 
                      : 'bg-white/60 border-black/5 hover:bg-white'
                    }
                  `}
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#20312D]">{exp.title}</h4>
                    <p className="text-xs text-[#6F7D78] mt-0.5">{exp.desc}</p>
                  </div>
                  {experience === exp.id && (
                    <div className="w-5 h-5 rounded-full bg-[#56B89D] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: LIFESTYLE & AVAILABILITY */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step4Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step4Subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#20312D] mb-2">Nivel de actividad habitual</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mostly_sitting', label: 'Mayormente sentado (trabajo de escritorio)' },
                    { id: 'lightly_active', label: 'Ligeramente activo (caminatas suaves)' },
                    { id: 'moderately_active', label: 'Moderadamente activo (de pie a menudo)' },
                    { id: 'very_active', label: 'Muy activo (actividad física intensa)' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityLevel(act.id as ActivityLevel)}
                      className={`
                        p-3 text-left rounded-2xl border text-xs font-bold transition-all cursor-pointer
                        ${activityLevel === act.id ? 'bg-white border-[#56B89D] shadow-xs' : 'bg-white/60 border-black/5'}
                      `}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20312D] mb-2">¿Cuántos días podés entrenar?</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setTrainingDays(days)}
                      className={`
                        flex-1 py-3 rounded-2xl border text-sm font-extrabold transition-all cursor-pointer
                        ${trainingDays === days ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white/70 text-[#20312D] border-black/5'}
                      `}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20312D] mb-2">¿De cuánto tiempo disponés por sesión?</label>
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setPreferredDuration(mins)}
                      className={`
                        px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer
                        ${preferredDuration === mins ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white/70 text-[#20312D] border-black/5'}
                      `}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: EQUIPMENT */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step5Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step5Subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'bodyweight', label: 'Solo peso corporal (sin equipo)' },
                { id: 'mat', label: 'Colchoneta / Mat de yoga' },
                { id: 'resistance_bands', label: 'Bandas elásticas' },
                { id: 'dumbbells', label: 'Mancuernas' },
                { id: 'pull_up_bar', label: 'Barra de dominadas' },
                { id: 'kettlebell', label: 'Pesa rusa (kettlebell)' },
                { id: 'bench', label: 'Banco / Silla firme' },
                { id: 'full_gym', label: 'Gimnasio completo' }
              ].map(eq => {
                const isSelected = equipment.includes(eq.id as TrainingEquipment);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id as TrainingEquipment)}
                    className={`
                      p-3.5 text-left rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer
                      ${isSelected ? 'bg-white border-[#56B89D] shadow-xs' : 'bg-white/60 border-black/5'}
                    `}
                  >
                    <span>{eq.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#56B89D] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: PREFERENCES */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step6Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step6Subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'strength', label: 'Fuerza funcional' },
                { id: 'calisthenics', label: 'Calistenia (peso corporal)' },
                { id: 'cardio', label: 'Cardio metabólico' },
                { id: 'hiit', label: 'HIIT (intervalos)' },
                { id: 'mobility', label: 'Movilidad y descompresión' },
                { id: 'core', label: 'Core y estabilidad' },
                { id: 'functional', label: 'Movimientos integrales' }
              ].map(pref => {
                const isSelected = preferences.includes(pref.id as TrainingPreference);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id as TrainingPreference)}
                    className={`
                      p-3.5 text-left rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer
                      ${isSelected ? 'bg-white border-[#56B89D] shadow-xs' : 'bg-white/60 border-black/5'}
                    `}
                  >
                    <span>{pref.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#56B89D] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: LIMITATIONS & SAFETY */}
        {step === 7 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-[#20312D]">{t('onboarding.step7Title')}</h2>
              <p className="text-sm text-[#6F7D78] mt-1">
                {t('onboarding.step7Subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Sin dolor ni molestias' },
                { id: 'back', label: 'Espalda baja / Lumbar' },
                { id: 'knee', label: 'Rodillas' },
                { id: 'shoulder', label: 'Hombros' },
                { id: 'wrist', label: 'Muñecas / Codos' },
                { id: 'other', label: 'Cuello / Cervical' },
                { id: 'ankle', label: 'Tobillos' }
              ].map(lim => {
                const isSelected = limitations.includes(lim.id as PhysicalLimitation);
                return (
                  <button
                    key={lim.id}
                    type="button"
                    onClick={() => toggleLimitation(lim.id as PhysicalLimitation)}
                    className={`
                      p-3 text-left rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer
                      ${isSelected ? 'bg-white border-[#56B89D] shadow-xs' : 'bg-white/60 border-black/5'}
                    `}
                  >
                    <span>{lim.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#56B89D] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {/* MANDATORY MEDICAL SAFETY NOTICE */}
            <div className="bg-[#F5D5C2]/50 border border-[#E9A06D]/40 rounded-2xl p-4 flex items-start gap-3 mt-4">
              <ShieldAlert className="w-5 h-5 text-[#E9A06D] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#20312D] leading-relaxed">
                <span className="font-bold block text-xs mb-0.5">Aviso de seguridad y salud</span>
                {t('onboarding.safetyNotice')}
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#20312D]">
              <input 
                type="checkbox"
                checked={safetyChecked}
                onChange={e => setSafetyChecked(e.target.checked)}
                className="w-4 h-4 accent-[#56B89D] rounded cursor-pointer"
              />
              <span>{t('onboarding.safetyConsent')}</span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-black/5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white text-xs font-bold text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.back')}</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#20312D] text-white hover:bg-black text-xs font-bold shadow-md transition-all ml-auto cursor-pointer"
            >
              <span>{t('common.continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!safetyChecked}
              onClick={handleFinish}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black shadow-lg transition-all ml-auto cursor-pointer
                ${safetyChecked ? 'bg-[#56B89D] hover:bg-[#46A389] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('onboarding.startAssessment')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


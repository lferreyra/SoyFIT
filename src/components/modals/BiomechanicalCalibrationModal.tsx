import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Dumbbell, 
  Heart, 
  Flame, 
  Clock, 
  Calendar, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../../context/FitnessContext';
import { 
  FitnessGoal, 
  FitnessExperience, 
  TrainingEquipment, 
  PhysicalLimitation 
} from '../../types/fitness';

interface BiomechanicalCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinished?: () => void;
}

export const BiomechanicalCalibrationModal: React.FC<BiomechanicalCalibrationModalProps> = ({
  isOpen,
  onClose,
  onFinished
}) => {
  const { user, updateUser, submitAssessment } = useFitness();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: Main Goal & Cadence
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'general_fitness');
  const [durationMinutes, setDurationMinutes] = useState<number>(user.preferredDurationMinutes || 25);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(user.trainingDaysPerWeek || 4);
  const [experience, setExperience] = useState<FitnessExperience>(user.experience || 'beginner');

  // STEP 2: Biomechanical Joint & Pain Scanner
  const [limitations, setLimitations] = useState<PhysicalLimitation[]>(user.limitations || ['none']);
  const [painSeverity, setPainSeverity] = useState<'mild' | 'moderate' | 'rehab'>('moderate');

  // STEP 3: Available Equipment
  const [equipment, setEquipment] = useState<TrainingEquipment[]>(user.equipment || ['bodyweight']);

  if (!isOpen) return null;

  // Toggle joint limitations
  const handleToggleLimitation = (lim: PhysicalLimitation) => {
    if (lim === 'none') {
      setLimitations(['none']);
      return;
    }

    const withoutNone = limitations.filter(l => l !== 'none');
    if (withoutNone.includes(lim)) {
      const remaining = withoutNone.filter(l => l !== lim);
      setLimitations(remaining.length > 0 ? remaining : ['none']);
    } else {
      setLimitations([...withoutNone, lim]);
    }
  };

  // Toggle equipment
  const handleToggleEquipment = (eq: TrainingEquipment) => {
    if (equipment.includes(eq)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter(e => e !== eq));
      }
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  // Final confirmation
  const handleCompleteCalibration = () => {
    const goalsList: FitnessGoal[] = [primaryGoal];
    if (primaryGoal === 'lose_fat') goalsList.push('general_fitness');
    if (primaryGoal === 'build_muscle') goalsList.push('improve_strength');
    if (primaryGoal === 'improve_strength') goalsList.push('build_muscle');
    if (primaryGoal === 'general_fitness') goalsList.push('improve_mobility');

    // Update user profile in context and cloud
    updateUser({
      primaryGoal,
      goals: goalsList,
      preferredDurationMinutes: durationMinutes,
      trainingDaysPerWeek: daysPerWeek,
      experience,
      limitations,
      equipment,
      hasCompletedAssessment: true,
      isOnboarded: true,
      safetyAcknowledged: true
    });

    // Provide calibrated baseline fitness score registration
    try {
      submitAssessment({
        overallScore: experience === 'advanced' ? 88 : experience === 'intermediate' ? 74 : 62,
        strengthScore: limitations.includes('shoulder') ? 60 : 75,
        enduranceScore: limitations.includes('knee') ? 58 : 78,
        coreScore: limitations.includes('back') ? 65 : 80,
        mobilityScore: 72,
        consistencyScore: 85,
        calculatedLevel: experience === 'advanced' ? 'Advanced 1' : experience === 'intermediate' ? 'Intermediate 2' : 'Beginner 2',
        testedAt: new Date().toISOString()
      });
    } catch {}

    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#56B89D', '#F5D5C2', '#E9A06D', '#20312D']
      });
    } catch {}

    if (onFinished) onFinished();
    onClose();
  };

  const goalsConfig: Array<{
    id: FitnessGoal;
    title: string;
    description: string;
    icon: any;
    accent: string;
  }> = [
    {
      id: 'lose_fat',
      title: 'Definición & Pérdida de Grasa',
      description: 'Déficit calórico controlado, circuitos de densidad metabólica y preservación de masa muscular magra.',
      icon: Flame,
      accent: '#E9A06D'
    },
    {
      id: 'build_muscle',
      title: 'Hipertrofia & Tono Muscular',
      description: 'Tensión mecánica óptima, cadencia controlada y sobrecarga progresiva para máxima síntesis proteica.',
      icon: Dumbbell,
      accent: '#56B89D'
    },
    {
      id: 'improve_strength',
      title: 'Fuerza & Atletismo Calisténico',
      description: 'Dominio del peso corporal, potencia funcional neuromuscular y articulaciones resilientes.',
      icon: Zap,
      accent: '#20312D'
    },
    {
      id: 'general_fitness',
      title: 'Salud Articular & Longevidad',
      description: 'Moverse sin dolor, descompresión postural diaria, movilidad fluida y vitalidad cardiovascular.',
      icon: Heart,
      accent: '#3A8E77'
    }
  ];

  const jointLimitationsConfig: Array<{
    id: PhysicalLimitation;
    name: string;
    description: string;
    coachAction: string;
    iconText: string;
  }> = [
    {
      id: 'back',
      name: 'Espalda Baja / Zona Lumbar',
      description: 'Molestia al inclinarse o cargar peso en la columna.',
      coachAction: 'Protocolo McGill: Bloqueamos flexión bajo carga. Priorizamos Bird-Dog, Deadbug y puente de glúteos.',
      iconText: '🛡️'
    },
    {
      id: 'knee',
      name: 'Rodillas / Tendón Rotuliano',
      description: 'Molestia en sentadillas profundas o impactos.',
      coachAction: 'Limitamos la cizalla rotuliana. Reemplazamos por sentadilla a cajón y dominantes de cadera.',
      iconText: '🦵'
    },
    {
      id: 'shoulder',
      name: 'Hombros / Manguito Rotador',
      description: 'Pinchazo al empujar por encima de la cabeza.',
      coachAction: 'Alineación escapular estricta (45°), empujes inclinados neutros y tracción escapular.',
      iconText: '🦾'
    },
    {
      id: 'wrist',
      name: 'Muñecas / Codos',
      description: 'Dolor en apoyos rectos de flexiones.',
      coachAction: 'Soporte sobre puños cerrados, apoyos elevados o bandas elásticas sin torsión articular.',
      iconText: '🤲'
    },
    {
      id: 'neck',
      name: 'Cuello / Región Cervical',
      description: 'Tensión excesiva en trapecios o nuca.',
      coachAction: 'Columna cervical neutra: sin tirones manuales ni flexiones forzadas.',
      iconText: '🧠'
    },
    {
      id: 'none',
      name: '100% Sano y Operativo',
      description: 'Sin ninguna dolencia ni molestia articular actual.',
      coachAction: 'Acceso irrestricto al catálogo completo con máxima intensidad.',
      iconText: '✨'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div 
        id="biomechanical-calibration-modal"
        className="relative w-full max-w-2xl bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D] flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
          title="Cerrar test"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Coach Badge Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#20312D] text-[#56B89D] flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[#56B89D] block">
              Diagnóstico Biomecánico & Calibración
            </span>
            <span className="text-xs text-[#6F7D78] font-semibold">
              Metodología de Alto Rendimiento y Protección Articular
            </span>
          </div>
        </div>

        {/* Multi-step Progress indicator */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="space-y-1">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= s ? 'bg-[#20312D]' : 'bg-black/10'
                }`}
              />
              <span className={`text-[10px] font-bold block ${currentStep === s ? 'text-[#20312D]' : 'text-[#6F7D78]'}`}>
                {s === 1 ? '1. Objetivo' : s === 2 ? '2. Dolencias' : s === 3 ? '3. Entorno' : '4. Calibración'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: GOALS & CADENCE */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20312D] tracking-tight">
                ¿Cuál es tu Misión Principal?
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Como tu entrenador, calibraré los rangos de repetición, la cadencia y el gasto energético según este pilar.
              </p>
            </div>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalsConfig.map(goal => {
                const Icon = goal.icon;
                const isSelected = primaryGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setPrimaryGoal(goal.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-white border-[#20312D] shadow-md ring-2 ring-[#20312D]/10' 
                        : 'bg-white/60 border-black/5 hover:bg-white hover:border-black/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${goal.accent}15`, color: goal.accent }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#20312D] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#20312D] mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-[#6F7D78] leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cadence: Days & Minutes */}
            <div className="bg-white/70 p-4 rounded-2xl border border-black/5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Days per week */}
                <div>
                  <label className="text-xs font-bold text-[#20312D] flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>Días de entrenamiento por semana</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDaysPerWeek(days)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          daysPerWeek === days
                            ? 'bg-[#20312D] text-white border-[#20312D]'
                            : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white/90'
                        }`}
                      >
                        {days} días
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration per session */}
                <div>
                  <label className="text-xs font-bold text-[#20312D] flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>Tiempo disponible por sesión</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mins: 15, label: '15 min (Express)' },
                      { mins: 25, label: '25-30 min (Ideal)' },
                      { mins: 45, label: '45 min (Atleta)' }
                    ].map(d => (
                      <button
                        key={d.mins}
                        type="button"
                        onClick={() => setDurationMinutes(d.mins)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border text-center transition-all cursor-pointer truncate ${
                          durationMinutes === d.mins
                            ? 'bg-[#20312D] text-white border-[#20312D]'
                            : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white/90'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-6 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Siguiente: Escáner de Dolencias</span>
                <ArrowRight className="w-4 h-4 text-[#56B89D]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BIOMECHANICAL JOINT & PAIN SCANNER */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#E9A06D] uppercase tracking-wider">
                  Evaluación Articular Clínica
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20312D] tracking-tight">
                ¿Tenés alguna dolencia o zona articular sensible?
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Un entrenador de clase mundial adapta la carga a tus articulaciones. Activaremos filtros protectores para blindar tu cuerpo sin detener tu progreso.
              </p>
            </div>

            {/* Joint Limitations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {jointLimitationsConfig.map(joint => {
                const isSelected = limitations.includes(joint.id);
                return (
                  <button
                    key={joint.id}
                    type="button"
                    onClick={() => handleToggleLimitation(joint.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? joint.id === 'none'
                          ? 'bg-emerald-50/80 border-[#56B89D] shadow-xs'
                          : 'bg-amber-50/70 border-[#E9A06D] shadow-xs'
                        : 'bg-white/70 border-black/5 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{joint.iconText}</span>
                        <h4 className="text-xs font-black text-[#20312D]">
                          {joint.name}
                        </h4>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected 
                          ? joint.id === 'none' ? 'bg-[#56B89D] border-[#56B89D] text-white' : 'bg-[#E9A06D] border-[#E9A06D] text-white'
                          : 'border-black/20 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6F7D78] mb-1.5">
                      {joint.description}
                    </p>
                    <div className="bg-white/80 p-2 rounded-xl text-[10px] text-[#20312D] font-medium border border-black/5">
                      <span className="font-bold text-[#3A8E77]">Adaptación:</span> {joint.coachAction}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Severity selector if any pain is selected */}
            {!limitations.includes('none') && limitations.length > 0 && (
              <div className="bg-white/80 p-3.5 rounded-2xl border border-black/5 space-y-2">
                <span className="text-xs font-bold text-[#20312D] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#E9A06D]" />
                  <span>¿Cuál es el nivel habitual de molestia?</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mild', label: 'Leve / Rigidez ocasional' },
                    { id: 'moderate', label: 'Dolor recurrente con carga' },
                    { id: 'rehab', label: 'Post-lesión / Muy sensible' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setPainSeverity(lvl.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all cursor-pointer ${
                        painSeverity === lvl.id
                          ? 'bg-[#20312D] text-white border-[#20312D]'
                          : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white/90'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#6F7D78] hover:text-[#20312D] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-3 px-6 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Siguiente: Equipamiento & Entorno</span>
                <ArrowRight className="w-4 h-4 text-[#56B89D]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EQUIPMENT & ENVIRONMENT */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20312D] tracking-tight">
                ¿Qué equipamiento tenés a mano?
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Diseñamos rutinas 100% efectivas adaptadas a tu espacio real, sin exigir elementos innecesarios.
              </p>
            </div>

            {/* Equipment Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  id: 'bodyweight' as TrainingEquipment, 
                  title: 'Solo Peso Corporal', 
                  desc: 'Calistenia funcional y control corporal estricto sin necesidad de accesorios.',
                  icon: '🤸'
                },
                { 
                  id: 'resistance_bands' as TrainingEquipment, 
                  title: 'Bandas Elásticas & Colchoneta', 
                  desc: 'Tensión continua y descarga articular ideal para hipertrofia y rehabilitación.',
                  icon: '➰'
                },
                { 
                  id: 'dumbbells' as TrainingEquipment, 
                  title: 'Mancuernas / Pesas Libres', 
                  desc: 'Carga progresiva regulable para mayor volumen de sobrecarga.',
                  icon: '🏋️'
                },
                { 
                  id: 'full_gym' as TrainingEquipment, 
                  title: 'Gimnasio Completo', 
                  desc: 'Acceso a poleas, barras, máquinas y bancos especializados.',
                  icon: '🏢'
                }
              ].map(eq => {
                const isSelected = equipment.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleToggleEquipment(eq.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-[#20312D] shadow-md ring-2 ring-[#20312D]/10'
                        : 'bg-white/60 border-black/5 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{eq.icon}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#20312D] border-[#20312D] text-white' : 'border-black/20 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#20312D] mb-1">
                        {eq.title}
                      </h4>
                      <p className="text-xs text-[#6F7D78] leading-relaxed">
                        {eq.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Experience Level Pill */}
            <div className="bg-white/70 p-4 rounded-2xl border border-black/5 space-y-2">
              <label className="text-xs font-bold text-[#20312D] block">
                Nivel de experiencia en entrenamiento de fuerza
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Principiante', sub: 'Aprendiendo bases' },
                  { id: 'intermediate', label: 'Intermedio', sub: '1-3 años entrenando' },
                  { id: 'advanced', label: 'Avanzado', sub: '+3 años constante' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperience(lvl.id as FitnessExperience)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      experience === lvl.id
                        ? 'bg-[#20312D] text-white border-[#20312D]'
                        : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white/90'
                    }`}
                  >
                    <span className="text-xs font-black block">{lvl.label}</span>
                    <span className="text-[10px] opacity-80 block">{lvl.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#6F7D78] hover:text-[#20312D] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="py-3 px-6 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Generar Informe de Calibración</span>
                <Sparkles className="w-4 h-4 text-[#56B89D]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: WORLD-CLASS COACH PRESCRIPTION REPORT */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-2 py-2">
              <div className="w-16 h-16 rounded-3xl bg-[#DCEFE8] text-[#20312D] flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8 text-[#56B89D]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#56B89D] block">
                Dictamen Biomecánico Oficial
              </span>
              <h2 className="text-2xl font-black text-[#20312D] tracking-tight">
                ¡Tu Plan Ha Sido Calibrado con Éxito!
              </h2>
              <p className="text-xs text-[#6F7D78] max-w-md mx-auto">
                Hemos ajustado la biomecánica, las progresiones y las pausas de descanso a tus articulaciones exactas.
              </p>
            </div>

            {/* Diagnostic Summary Cards */}
            <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-3 border-b border-black/5 text-center">
                <div className="p-2 bg-[#F4F3EC] rounded-xl">
                  <span className="text-[10px] text-[#6F7D78] font-bold block uppercase">Enfoque</span>
                  <span className="text-xs font-black text-[#20312D] truncate block">
                    {goalsConfig.find(g => g.id === primaryGoal)?.title.split('&')[0] || 'Fuerza'}
                  </span>
                </div>
                <div className="p-2 bg-[#F4F3EC] rounded-xl">
                  <span className="text-[10px] text-[#6F7D78] font-bold block uppercase">Frecuencia</span>
                  <span className="text-xs font-black text-[#20312D] block">
                    {daysPerWeek} días/sem
                  </span>
                </div>
                <div className="p-2 bg-[#F4F3EC] rounded-xl">
                  <span className="text-[10px] text-[#6F7D78] font-bold block uppercase">Duración</span>
                  <span className="text-xs font-black text-[#20312D] block">
                    {durationMinutes} min
                  </span>
                </div>
                <div className="p-2 bg-[#F4F3EC] rounded-xl">
                  <span className="text-[10px] text-[#6F7D78] font-bold block uppercase">Nivel</span>
                  <span className="text-xs font-black text-[#20312D] block capitalize">
                    {experience}
                  </span>
                </div>
              </div>

              {/* Protective Rules Applied */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#20312D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#56B89D]" />
                  <span>Filtros Biomecánicos & Articulares Activados:</span>
                </span>
                
                {limitations.includes('none') || limitations.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#56B89D] shrink-0" />
                    <span>Sin limitaciones articulares detectadas. Tu plan operará con acceso al 100% del catálogo de alta intensidad.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {limitations.map(lim => {
                      const item = jointLimitationsConfig.find(j => j.id === lim);
                      if (!item || item.id === 'none') return null;
                      return (
                        <div key={lim} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-[#20312D] flex items-start gap-2">
                          <span className="text-base shrink-0">{item.iconText}</span>
                          <div>
                            <span className="font-black block">{item.name}</span>
                            <span className="text-[11px] text-[#6F7D78]">{item.coachAction}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Launch Action */}
            <button
              type="button"
              onClick={handleCompleteCalibration}
              className="w-full py-4 px-6 rounded-2xl bg-[#20312D] hover:bg-black text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Guardar Calibración y Comenzar Plan</span>
              <ArrowRight className="w-4 h-4 text-[#56B89D]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

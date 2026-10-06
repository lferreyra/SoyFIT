import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Cloud, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Bell,
  BellRing,
  Droplet,
  Dumbbell,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  AlertCircle,
  Play,
  Target,
  Activity,
  ChevronDown,
  User,
  Sliders
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard } from '../common/GlassCard';
import { t, LEVEL_LABELS_ES } from '../../i18n';
import { DEFAULT_REMINDER_PREFERENCES, ReminderPreferences, PhysicalLimitation } from '../../types/fitness';

const DAYS_OF_WEEK = [
  { id: 1, short: 'Lun', label: 'Lunes' },
  { id: 2, short: 'Mar', label: 'Martes' },
  { id: 3, short: 'Mié', label: 'Miércoles' },
  { id: 4, short: 'Jue', label: 'Jueves' },
  { id: 5, short: 'Vie', label: 'Viernes' },
  { id: 6, short: 'Sáb', label: 'Sábado' },
  { id: 7, short: 'Dom', label: 'Domingo' }
];

export const ProfileView: React.FC = () => {
  const { 
    user, 
    updateUser, 
    scores, 
    setIsAssessmentModalOpen, 
    setIsGoalModalOpen,
    workoutHistory,
    gamification,
    authUser,
    setIsAuthModalOpen,
    logoutUser,
    triggerTestReminder,
    notificationPermission,
    requestBrowserNotificationPermission
  } = useFitness();

  const [savedNotice, setSavedNotice] = useState(false);

  // Collapsible accordion cards state (clean, uncluttered by default)
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    goals: true, // goals open for easy inspection
    limitations: false,
    biometrics: false,
    reminders: false,
    account: false
  });

  const toggleCard = (cardKey: string) => {
    setOpenCards(prev => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  // Editable biometric local state
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal || 'strength');
  const [daysPerWeek, setDaysPerWeek] = useState(user.trainingDaysPerWeek || 4);
  const [durationMinutes, setDurationMinutes] = useState(user.preferredDurationMinutes || 30);
  const [equipment, setEquipment] = useState<string[]>(user.equipment || ['bodyweight']);
  const [injuries, setInjuries] = useState<string[]>(user.limitations || ['none']);

  // Reminder preferences state
  const userReminders = user.reminderPreferences || DEFAULT_REMINDER_PREFERENCES;
  const [reminderEnabled, setReminderEnabled] = useState(userReminders.enabled);
  const [hydrationEnabled, setHydrationEnabled] = useState(userReminders.hydrationReminderEnabled);
  const [hydrationInterval, setHydrationInterval] = useState(userReminders.hydrationIntervalHours || 2);
  const [hydrationStart, setHydrationStart] = useState(userReminders.hydrationStartTime || '08:00');
  const [hydrationEnd, setHydrationEnd] = useState(userReminders.hydrationEndTime || '21:00');
  const [workoutEnabled, setWorkoutEnabled] = useState(userReminders.workoutReminderEnabled);
  const [workoutTime, setWorkoutTime] = useState(userReminders.workoutTime || '18:00');
  const [workoutDays, setWorkoutDays] = useState<number[]>(userReminders.workoutDays || [1, 2, 3, 4, 5]);
  const [soundEnabled, setSoundEnabled] = useState(userReminders.soundEnabled ?? true);

  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const toggleInjury = (item: string) => {
    if (item === 'none') {
      setInjuries(['none']);
      return;
    }
    const cleanList = injuries.filter(i => i !== 'none');
    if (cleanList.includes(item)) {
      const next = cleanList.filter(i => i !== item);
      setInjuries(next.length === 0 ? ['none'] : next);
    } else {
      setInjuries([...cleanList, item]);
    }
  };

  const toggleWorkoutDay = (dayNum: number) => {
    if (workoutDays.includes(dayNum)) {
      if (workoutDays.length > 1) {
        setWorkoutDays(workoutDays.filter(d => d !== dayNum));
      }
    } else {
      setWorkoutDays([...workoutDays, dayNum].sort());
    }
  };

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    if (res === 'granted') {
      triggerTestReminder('hydration');
    }
  };

  const handleSaveProfile = () => {
    const updatedReminderPrefs: ReminderPreferences = {
      enabled: reminderEnabled,
      hydrationReminderEnabled: hydrationEnabled,
      hydrationIntervalHours: hydrationInterval,
      hydrationStartTime: hydrationStart,
      hydrationEndTime: hydrationEnd,
      hydrationDailyTargetLiters: userReminders.hydrationDailyTargetLiters || 2.5,
      workoutReminderEnabled: workoutEnabled,
      workoutTime: workoutTime,
      workoutDays: workoutDays,
      soundEnabled: soundEnabled
    };

    updateUser({
      name,
      age,
      weightKg,
      heightCm,
      primaryGoal,
      trainingDaysPerWeek: daysPerWeek,
      preferredDurationMinutes: durationMinutes,
      equipment: equipment as any,
      limitations: injuries as any,
      reminderPreferences: updatedReminderPrefs
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user,
      fitnessScores: scores,
      gamification,
      workoutHistory,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soyfit_perfil_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentLevelEs = LEVEL_LABELS_ES[scores.calculatedLevel] || scores.calculatedLevel;

  const goalLabels: Record<string, string> = {
    lose_fat: 'Bajar de peso / quemar grasa corporal',
    fat_loss: 'Bajar de peso / quemar grasa corporal',
    build_muscle: 'Tonificación muscular',
    muscle_tone: 'Tonificación muscular',
    improve_mobility: 'Flexibilidad y movilidad',
    mobility: 'Flexibilidad y movilidad',
    improve_strength: 'Fuerza muscular',
    strength: 'Fuerza muscular',
    calisthenics: 'Fuerza muscular',
    improve_endurance: 'Resistencia física y vitalidad',
    general_fitness: 'Salud integral y bienestar',
    longevity: 'Salud integral y bienestar'
  };

  const limitationLabels: Record<string, string> = {
    none: 'Sin dolencias articulares',
    lower_back: 'Espalda baja / Lumbar',
    knees: 'Rodillas',
    shoulders: 'Hombros',
    wrists: 'Muñecas / Codos',
    neck: 'Cuello / Cervicales',
    ankles: 'Tobillos'
  };

  return (
    <div id="profile-dashboard" className="space-y-5 max-w-4xl mx-auto pb-16">
      {/* Header & Quick Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#20312D] tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-[#6F7D78] mt-0.5">
            Configuración simplificada en tarjetas desplegables
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {savedNotice && (
            <div className="px-3.5 py-1.5 rounded-xl bg-[#DCEFE8] border border-[#56B89D] text-[#20312D] text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#56B89D]" />
              <span>Guardado</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-[#20312D] hover:bg-black text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#56B89D]" />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      {/* 1. HERO USER CARD (MINIMAL, CLEAN OVERVIEW) */}
      <GlassCard className="p-6 bg-gradient-to-r from-white/90 via-white/80 to-[#DCEFE8]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] text-[#14201D] font-black text-2xl flex items-center justify-center shadow-md shadow-[#56B89D]/20">
              {name ? name[0].toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-[#20312D]">{name || 'Atleta'}</h3>
                {authUser && (
                  <span className="px-2 py-0.5 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-bold">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                Nivel: <strong className="text-[#20312D]">{currentLevelEs}</strong> • Meta: <strong className="text-[#56B89D]">{goalLabels[primaryGoal] || primaryGoal}</strong>
              </p>
              <div className="flex items-center gap-3 text-xs font-bold text-[#20312D] mt-2">
                <span className="flex items-center gap-1">
                  🔥 {gamification.currentStreakDays} días de racha
                </span>
                <span>•</span>
                <span>
                  {workoutHistory.length} sesiones completadas
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsAssessmentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:border-[#56B89D] text-xs font-bold text-[#20312D] shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Reevaluar condición física</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 2. CARD DESPLEGABLE: OBJETIVOS Y FRECUENCIA DE ENTRENAMIENTO */}
      <GlassCard className="p-0 overflow-hidden transition-all border border-white/80">
        <button
          type="button"
          onClick={() => toggleCard('goals')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-white/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center shrink-0 shadow-2xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#20312D]">
                  Objetivos de Entrenamiento y Rutina
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#56B89D]/20 text-[#20312D] text-[10px] font-black uppercase">
                  {goalLabels[primaryGoal] || 'Fuerza'}
                </span>
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                {daysPerWeek} días por semana • {durationMinutes} min por sesión
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${openCards.goals ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-[#20312D]" />
          </div>
        </button>

        {openCards.goals && (
          <div className="p-5 sm:p-6 pt-0 border-t border-black/5 space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold text-[#20312D] block mb-2">
                Meta principal de entrenamiento:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'lose_fat', label: 'Bajar de peso / quemar grasa corporal' },
                  { id: 'build_muscle', label: 'Tonificación muscular' },
                  { id: 'improve_mobility', label: 'Flexibilidad y movilidad' },
                  { id: 'improve_strength', label: 'Fuerza muscular' },
                  { id: 'improve_endurance', label: 'Resistencia física y vitalidad' },
                  { id: 'general_fitness', label: 'Salud integral y bienestar' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPrimaryGoal(g.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${primaryGoal === g.id ? 'bg-[#20312D] text-white border-[#20312D] shadow-xs' : 'bg-white/80 text-[#6F7D78] border-black/5 hover:bg-white'}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1.5">
                  Frecuencia semanal deseada:
                </label>
                <div className="flex gap-1.5">
                  {[2, 3, 4, 5, 6].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysPerWeek(days)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${daysPerWeek === days ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                    >
                      {days} d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1.5">
                  Duración habitual por sesión:
                </label>
                <div className="flex gap-1.5">
                  {[15, 20, 30, 45].map(min => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDurationMinutes(min)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${durationMinutes === min ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                    >
                      {min} m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-[#20312D] block mb-1.5">
                Equipamiento disponible:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'bodyweight', label: 'Solo peso corporal' },
                  { id: 'mat', label: 'Colchoneta / Mat' },
                  { id: 'bench', label: 'Silla / Banco' },
                  { id: 'bands', label: 'Bandas elásticas' },
                  { id: 'pullup_bar', label: 'Barra de dominadas' }
                ].map(eq => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${equipment.includes(eq.id) ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white'}`}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 3. CARD DESPLEGABLE: CUIDADO ARTICULAR Y LIMITACIONES */}
      <GlassCard className="p-0 overflow-hidden transition-all border border-white/80">
        <button
          type="button"
          onClick={() => toggleCard('limitations')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-white/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5D5C2] text-[#E9A06D] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#E9A06D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#20312D]">
                  Cuidado Articular y Adaptabilidad
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  injuries.includes('none') || injuries.length === 0
                    ? 'bg-[#DCEFE8] text-[#20312D]'
                    : 'bg-[#FDE2D0] text-[#E9A06D]'
                }`}>
                  {injuries.includes('none') || injuries.length === 0
                    ? 'Sin molestias'
                    : `Protegiendo ${injuries.length} articulaciones`}
                </span>
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                Calibración de ejercicios de bajo impacto para cuidar articulaciones
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${openCards.limitations ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-[#20312D]" />
          </div>
        </button>

        {openCards.limitations && (
          <div className="p-5 sm:p-6 pt-0 border-t border-black/5 space-y-3 animate-in fade-in duration-200">
            <p className="text-xs text-[#6F7D78]">
              Si experimentás dolor o molestia recurrente, seleccioná la zona. SOYFIT reemplazará automáticamente los ejercicios lesivos por progresiones seguras:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Sin dolor o molestia' },
                { id: 'lower_back', label: 'Espalda baja / Lumbar' },
                { id: 'knees', label: 'Rodillas' },
                { id: 'shoulders', label: 'Hombros' },
                { id: 'wrists', label: 'Muñecas / Codos' },
                { id: 'neck', label: 'Cuello / Cervical' },
                { id: 'ankles', label: 'Tobillos' }
              ].map(lim => {
                const isSelected = injuries.includes(lim.id);
                return (
                  <button
                    key={lim.id}
                    type="button"
                    onClick={() => toggleInjury(lim.id)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${isSelected ? 'bg-[#E9A06D] text-white border-[#E9A06D] shadow-xs' : 'bg-white text-[#6F7D78] border-black/5 hover:bg-white'}`}
                  >
                    {lim.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 4. CARD DESPLEGABLE: DATOS BIOMÉTRICOS BÁSICOS */}
      <GlassCard className="p-0 overflow-hidden transition-all border border-white/80">
        <button
          type="button"
          onClick={() => toggleCard('biometrics')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-white/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-black/5 text-[#20312D] flex items-center justify-center shrink-0 shadow-2xs">
              <Activity className="w-5 h-5 text-[#56B89D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#20312D]">
                  Datos Biométricos Básicos
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#20312D] text-[10px] font-bold">
                  {age} años • {weightKg} kg • {heightCm} cm
                </span>
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                Utilizados para calcular gasto metabólico basal y calorías de entrenamiento
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${openCards.biometrics ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-[#20312D]" />
          </div>
        </button>

        {openCards.biometrics && (
          <div className="p-5 sm:p-6 pt-0 border-t border-black/5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1">Edad</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                />
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 5. CARD DESPLEGABLE: RECORDATORIOS Y NOTIFICACIONES */}
      <GlassCard className="p-0 overflow-hidden transition-all border border-white/80">
        <button
          type="button"
          onClick={() => toggleCard('reminders')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-white/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center shrink-0 shadow-2xs">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#20312D]">
                  Recordatorios y Notificaciones
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${reminderEnabled ? 'bg-[#56B89D] text-white' : 'bg-black/10 text-[#6F7D78]'}`}>
                  {reminderEnabled ? 'Activos' : 'Pausados'}
                </span>
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                {hydrationEnabled ? `Agua cada ${hydrationInterval}h` : 'Agua inactiva'} • {workoutEnabled ? `Entrenamiento ${workoutTime}` : 'Rutina inactiva'}
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${openCards.reminders ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-[#20312D]" />
          </div>
        </button>

        {openCards.reminders && (
          <div className="p-5 sm:p-6 pt-0 border-t border-black/5 space-y-4 animate-in fade-in duration-200">
            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${reminderEnabled ? 'bg-[#56B89D] text-white shadow-2xs' : 'bg-black/10 text-[#6F7D78]'}`}
              >
                {reminderEnabled ? 'Recordatorios Activos' : 'Activar Recordatorios'}
              </button>

              <button
                type="button"
                onClick={() => triggerTestReminder('hydration')}
                className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-[#20312D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Droplet className="w-3.5 h-3.5 text-[#56B89D]" />
                <span>Probar aviso agua</span>
              </button>

              <button
                type="button"
                onClick={() => triggerTestReminder('workout')}
                className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-[#20312D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Dumbbell className="w-3.5 h-3.5 text-[#E9A06D]" />
                <span>Probar aviso entreno</span>
              </button>

              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-xl bg-[#20312D] text-white text-xs font-bold cursor-pointer"
                >
                  Permitir en navegador
                </button>
              )}
            </div>

            {/* Hydration Settings */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#20312D]">Avisos de Hidratación</span>
                <input
                  type="checkbox"
                  checked={hydrationEnabled}
                  onChange={e => setHydrationEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#56B89D] rounded"
                />
              </div>
              {hydrationEnabled && (
                <div className="flex items-center gap-3 text-xs text-[#6F7D78]">
                  <span>Frecuencia:</span>
                  {[1, 2, 3].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHydrationInterval(h)}
                      className={`px-2.5 py-1 rounded-lg font-bold ${hydrationInterval === h ? 'bg-[#56B89D] text-white' : 'bg-white text-[#20312D]'}`}
                    >
                      Cada {h}h
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Workout Notification Settings */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#20312D]">Horario de Entrenamiento</span>
                <input
                  type="checkbox"
                  checked={workoutEnabled}
                  onChange={e => setWorkoutEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#56B89D] rounded"
                />
              </div>
              {workoutEnabled && (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6F7D78]">Hora:</span>
                    <input
                      type="time"
                      value={workoutTime}
                      onChange={e => setWorkoutTime(e.target.value)}
                      className="px-2 py-1 bg-white border border-black/10 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {DAYS_OF_WEEK.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleWorkoutDay(d.id)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-black ${workoutDays.includes(d.id) ? 'bg-[#20312D] text-white' : 'bg-white text-[#6F7D78]'}`}
                      >
                        {d.short[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 6. CARD DESPLEGABLE: CUENTA Y SINCRONIZACIÓN */}
      <GlassCard className="p-0 overflow-hidden transition-all border border-white/80">
        <button
          type="button"
          onClick={() => toggleCard('account')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-white/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#20312D]/5 text-[#20312D] flex items-center justify-center shrink-0 shadow-2xs">
              <Cloud className="w-5 h-5 text-[#56B89D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#20312D]">
                  Cuenta y Sincronización
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#20312D] text-[10px] font-bold">
                  {authUser?.email ? authUser.email : 'Modo local'}
                </span>
              </div>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                Respaldo en la nube con Google y exportación de datos
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center transition-transform duration-300 ${openCards.account ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-[#20312D]" />
          </div>
        </button>

        {openCards.account && (
          <div className="p-5 sm:p-6 pt-0 border-t border-black/5 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-xs font-bold text-[#20312D] block">
                  {authUser ? `Conectado como: ${authUser.email}` : 'Sesión local (sin cuenta vinculada)'}
                </span>
                <span className="text-[11px] text-[#6F7D78]">
                  {authUser 
                    ? 'Tus datos se sincronizan automáticamente con Firebase Firestore.'
                    : 'Podés conectar tu cuenta de Google para sincronizar tus progresos entre dispositivos.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {authUser ? (
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar sesión</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#20312D] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>Conectar con Google</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3.5 py-2 rounded-xl bg-white border border-black/10 text-[#20312D] text-xs font-bold hover:border-[#56B89D] transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Descargar copia de seguridad en JSON"
                >
                  <Download className="w-3.5 h-3.5 text-[#56B89D]" />
                  <span>Exportar datos</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

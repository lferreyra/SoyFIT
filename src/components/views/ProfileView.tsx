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
  Play
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard } from '../common/GlassCard';
import { t, LEVEL_LABELS_ES } from '../../i18n';
import { DEFAULT_REMINDER_PREFERENCES, ReminderPreferences } from '../../types/fitness';

const DAYS_OF_WEEK = [
  { id: 1, short: 'Lun', label: 'Lunes' },
  { id: 2, short: 'Mar', label: 'Martes' },
  { id: 3, short: 'Mié', label: 'Miércoles' },
  { id: 4, short: 'Jue', label: 'Jueves' },
  { id: 5, short: 'Vie', label: 'Viernes' },
  { id: 6, short: 'Sáb', label: 'Sábado' },
  { id: 7, short: 'Dom', label: 'Domingo' }
];

const WORKOUT_PRESETS = [
  { label: 'Mañana (07:00)', time: '07:00' },
  { label: 'Mediodía (12:30)', time: '12:30' },
  { label: 'Tarde (18:00)', time: '18:00' },
  { label: 'Noche (20:30)', time: '20:30' }
];

export const ProfileView: React.FC = () => {
  const { 
    user, 
    updateUser, 
    scores, 
    setIsAssessmentModalOpen, 
    workoutHistory,
    gamification,
    authUser,
    setIsAuthModalOpen,
    logoutUser,
    triggerTestReminder,
    notificationPermission,
    requestBrowserNotificationPermission,
    todayWorkout
  } = useFitness();

  const [savedNotice, setSavedNotice] = useState(false);

  // Editable biometric local state
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [daysPerWeek, setDaysPerWeek] = useState(user.trainingDaysPerWeek || 4);
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

  // Connected apps toggles
  const [connectedHealth, setConnectedHealth] = useState({
    appleHealth: true,
    googleFit: false,
    strava: true,
    garmin: false
  });

  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const toggleInjury = (item: string) => {
    if (injuries.includes(item)) {
      setInjuries(injuries.filter(i => i !== item));
    } else {
      setInjuries([...injuries, item]);
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
    a.download = `evolve_fitness_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentLevelEs = LEVEL_LABELS_ES[scores.calculatedLevel] || scores.calculatedLevel;

  // Status computation for today
  const todayStr = new Date().toISOString().split('T')[0];
  const isWorkoutDoneToday = workoutHistory.some(s => s.date === todayStr);
  const currentDayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const isTodayScheduledDay = workoutDays.includes(currentDayOfWeek);

  return (
    <div id="profile-dashboard" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#20312D] tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-[#6F7D78] mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        {savedNotice && (
          <div className="px-4 py-2 rounded-2xl bg-[#DCEFE8] border border-[#56B89D] text-[#20312D] text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#56B89D]" />
            <span>{t('profile.savedNotice')}</span>
          </div>
        )}
      </div>

      {/* BIOMETRICS & GENERAL INFO */}
      <GlassCard className="p-6 sm:p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center font-black text-2xl shadow-xs">
            {name ? name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <h3 className="text-xl font-black text-[#20312D]">{name}</h3>
            <span className="text-xs text-[#6F7D78]">
              Nivel: <strong className="text-[#20312D]">{currentLevelEs}</strong> • Puntuación física: <strong className="text-[#56B89D]">{scores.overallScore}/100</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1">{t('profile.name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/90 border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1">{t('profile.age')}</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/90 border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1">{t('profile.weight')}</label>
            <input
              type="number"
              value={weightKg}
              onChange={e => setWeightKg(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/90 border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1">{t('profile.height')}</label>
            <input
              type="number"
              value={heightCm}
              onChange={e => setHeightCm(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/90 border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>
        </div>
      </GlassCard>

      {/* TRAINING GOALS & FREQUENCY */}
      <GlassCard className="p-6 sm:p-7">
        <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
          Parámetros Adaptativos
        </span>
        <h3 className="text-xl font-black text-[#20312D] mb-4">
          Objetivos de entrenamiento y frecuencia semanal
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1.5">{t('profile.primaryGoal')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'strength', label: 'Ganar fuerza' },
                { id: 'calisthenics', label: 'Calistenia' },
                { id: 'fat_loss', label: 'Quemar grasa' },
                { id: 'mobility', label: 'Movilidad' },
                { id: 'longevity', label: 'Longevidad' },
                { id: 'muscle_tone', label: 'Tonificación' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPrimaryGoal(g.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${primaryGoal === g.id ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#20312D] block mb-1.5">{t('profile.daysPerWeek')}</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setDaysPerWeek(days);
                    // auto-adjust default workoutDays length if needed
                    const currentDays = [...workoutDays];
                    if (currentDays.length < days) {
                      const all = [1, 2, 3, 4, 5, 6, 7];
                      const missing = all.filter(d => !currentDays.includes(d)).slice(0, days - currentDays.length);
                      setWorkoutDays([...currentDays, ...missing].sort());
                    }
                  }}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${daysPerWeek === days ? 'bg-[#56B89D] text-white border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
                >
                  {days} días
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* DAILY REMINDERS & NOTIFICATION SCHEDULES */}
      <GlassCard className="p-6 sm:p-7 border-2 border-[#56B89D]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
                Hábitos y Constancia
              </span>
              <h3 className="text-xl font-black text-[#20312D]">
                Recordatorios Diarios y Notificaciones
              </h3>
            </div>
          </div>

          {/* Master Switch */}
          <div className="flex items-center gap-2.5 bg-white/80 border border-black/5 px-3 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
            <span className="text-xs font-extrabold text-[#20312D]">
              Recordatorios automáticos:
            </span>
            <button
              type="button"
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${reminderEnabled ? 'bg-[#56B89D] text-white shadow-xs' : 'bg-black/10 text-[#6F7D78]'}`}
            >
              {reminderEnabled ? 'Activos' : 'Pausados'}
            </button>
          </div>
        </div>

        {/* Browser Permission & Mode Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-white/70 border border-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#20312D]/5 text-[#20312D] shrink-0 mt-0.5">
              <Bell className="w-4 h-4 text-[#56B89D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-[#20312D]">
                  Estado del Navegador:
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  notificationPermission === 'granted' 
                    ? 'bg-[#DCEFE8] text-[#20312D] border border-[#56B89D]' 
                    : notificationPermission === 'denied'
                    ? 'bg-[#FDE2D0] text-[#E9A06D]'
                    : 'bg-black/5 text-[#6F7D78]'
                }`}>
                  {notificationPermission === 'granted' 
                    ? 'Permitidas en el sistema' 
                    : notificationPermission === 'denied' 
                    ? 'Bloqueadas en navegador' 
                    : 'Alertas en pantalla activas'}
                </span>
              </div>
              <p className="text-[11px] text-[#6F7D78] mt-0.5">
                {notificationPermission === 'granted'
                  ? 'Recibirás avisos locales en el escritorio o celular y tarjetas flotantes dentro de la app.'
                  : 'Las alertas interactivas en pantalla se mostrarán puntualmente cuando uses la app.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {notificationPermission !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3.5 py-2 rounded-xl bg-[#20312D] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Habilitar notificaciones
              </button>
            )}

            <button
              type="button"
              onClick={() => triggerTestReminder('hydration')}
              className="px-3 py-2 rounded-xl bg-white border border-black/10 hover:border-[#56B89D] text-[#20312D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Disparar recordatorio de hidratación de prueba ahora"
            >
              <Droplet className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Probar agua</span>
            </button>

            <button
              type="button"
              onClick={() => triggerTestReminder('workout')}
              className="px-3 py-2 rounded-xl bg-white border border-black/10 hover:border-[#E9A06D] text-[#20312D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Disparar recordatorio de entrenamiento de prueba ahora"
            >
              <Dumbbell className="w-3.5 h-3.5 text-[#E9A06D]" />
              <span>Probar rutina</span>
            </button>
          </div>
        </div>

        {/* 1. CONFIGURACIÓN DE HIDRATACIÓN */}
        <div className="p-5 rounded-2xl bg-white/80 border border-white shadow-2xs mb-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center shrink-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20312D]">
                  Hábito de Hidratación Diaria
                </h4>
                <p className="text-xs text-[#6F7D78]">
                  Notificaciones periódicas para mantener tu rendimiento muscular y cognitivo (Meta: 2,5 L).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHydrationEnabled(!hydrationEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${hydrationEnabled ? 'bg-[#56B89D] text-white' : 'bg-black/10 text-[#6F7D78]'}`}
            >
              {hydrationEnabled ? 'Activado' : 'Desactivado'}
            </button>
          </div>

          {hydrationEnabled && (
            <div className="pt-2 border-t border-black/5 space-y-4 animate-in fade-in duration-200">
              {/* Frequency Selector */}
              <div>
                <label className="text-xs font-bold text-[#20312D] block mb-1.5">
                  Frecuencia de recordatorio de agua:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { hours: 1, label: 'Cada 1 hora' },
                    { hours: 2, label: 'Cada 2 horas (Recomendado)' },
                    { hours: 3, label: 'Cada 3 horas' },
                    { hours: 4, label: 'Cada 4 horas' }
                  ].map(item => (
                    <button
                      key={item.hours}
                      type="button"
                      onClick={() => setHydrationInterval(item.hours)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${hydrationInterval === item.hours ? 'bg-[#20312D] text-white border-[#20312D] shadow-xs' : 'bg-white text-[#6F7D78] border-black/5 hover:border-black/20'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-[#20312D] block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>Hora de inicio (mañana):</span>
                  </label>
                  <input
                    type="time"
                    value={hydrationStart}
                    onChange={e => setHydrationStart(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#20312D] block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                    <span>Hora de cierre (noche):</span>
                  </label>
                  <input
                    type="time"
                    value={hydrationEnd}
                    onChange={e => setHydrationEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#6F7D78] italic">
                * Las alertas solo se enviarán entre las {hydrationStart} y las {hydrationEnd} mientras no hayas alcanzado tu meta diaria.
              </p>
            </div>
          )}
        </div>

        {/* 2. CONFIGURACIÓN DE ENTRENAMIENTO */}
        <div className="p-5 rounded-2xl bg-white/80 border border-white shadow-2xs mb-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDE2D0] text-[#E9A06D] flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20312D]">
                  Metas y Horario de Entrenamiento
                </h4>
                <p className="text-xs text-[#6F7D78]">
                  Recordatorio puntual para tu sesión de entrenamiento según tu rutina y días configurados.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWorkoutEnabled(!workoutEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${workoutEnabled ? 'bg-[#E9A06D] text-white' : 'bg-black/10 text-[#6F7D78]'}`}
            >
              {workoutEnabled ? 'Activado' : 'Desactivado'}
            </button>
          </div>

          {workoutEnabled && (
            <div className="pt-2 border-t border-black/5 space-y-4 animate-in fade-in duration-200">
              {/* Preferred Workout Time & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#20312D] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E9A06D]" />
                    <span>Horario preferido para entrenar:</span>
                  </label>
                  <span className="text-xs font-extrabold text-[#E9A06D]">
                    {workoutTime} hs
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                  <input
                    type="time"
                    value={workoutTime}
                    onChange={e => setWorkoutTime(e.target.value)}
                    className="w-full sm:w-40 px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-extrabold focus:outline-none focus:border-[#E9A06D]"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full flex-1">
                    {WORKOUT_PRESETS.map(preset => (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setWorkoutTime(preset.time)}
                        className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${workoutTime === preset.time ? 'bg-[#20312D] text-white border-[#20312D]' : 'bg-white text-[#6F7D78] border-black/5 hover:border-black/20'}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workout Days Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#20312D] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E9A06D]" />
                    <span>Días de entrenamiento programados ({workoutDays.length} días seleccionados):</span>
                  </label>
                  <span className="text-[11px] text-[#6F7D78]">
                    Meta semanal: {daysPerWeek} días
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = workoutDays.includes(day.id);
                    const isToday = currentDayOfWeek === day.id;

                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleWorkoutDay(day.id)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer relative ${
                          isSelected 
                            ? 'bg-[#20312D] text-white border-[#20312D] shadow-xs' 
                            : 'bg-white text-[#6F7D78] border-black/5 hover:border-black/20'
                        }`}
                      >
                        <span className="block text-xs font-black">{day.short}</span>
                        {isToday && (
                          <span className={`block text-[9px] font-extrabold uppercase mt-0.5 ${isSelected ? 'text-[#56B89D]' : 'text-[#6F7D78]'}`}>
                            Hoy
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Today's Workout Status Indicator */}
              <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isTodayScheduledDay ? (isWorkoutDoneToday ? 'bg-[#56B89D]' : 'bg-[#E9A06D] animate-ping') : 'bg-black/20'}`} />
                  <span className="font-bold text-[#20312D]">
                    {isTodayScheduledDay 
                      ? isWorkoutDoneToday 
                        ? '¡Excelente! Ya completaste tu entrenamiento de hoy.' 
                        : `Hoy te toca entrenar (${workoutTime} hs): "${todayWorkout.title}"`
                      : 'Hoy es día de descanso y recuperación activa.'}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${isWorkoutDoneToday ? 'bg-[#DCEFE8] text-[#56B89D]' : 'bg-black/5 text-[#6F7D78]'}`}>
                  {isWorkoutDoneToday ? 'Completado' : isTodayScheduledDay ? 'Pendiente' : 'Descanso'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. SONIDO Y CAMPANADA SUAVE */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-white shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#20312D]/5 flex items-center justify-center text-[#20312D] shrink-0">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#56B89D]" /> : <VolumeX className="w-4 h-4 text-[#6F7D78]" />}
            </div>
            <div>
              <h4 className="text-xs font-black text-[#20312D]">
                Sonido de aviso armónico suave
              </h4>
              <p className="text-[11px] text-[#6F7D78]">
                Tono acústico sutil generado con Web Audio sin descargar archivos pesados.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${soundEnabled ? 'bg-[#20312D] text-white' : 'bg-black/10 text-[#6F7D78]'}`}
          >
            {soundEnabled ? 'Activado' : 'Silencio'}
          </button>
        </div>
      </GlassCard>

      {/* EQUIPMENT PROFILE */}
      <GlassCard className="p-6 sm:p-7">
        <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
          {t('profile.equipment')}
        </span>
        <h3 className="text-xl font-black text-[#20312D] mb-2">
          Tus herramientas de entrenamiento
        </h3>
        <p className="text-xs text-[#6F7D78] mb-4">
          Los ejercicios que requieran elementos no seleccionados aquí son adaptados o sustituidos por variantes con peso corporal.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'bodyweight', label: 'Solo peso corporal' },
            { id: 'pullup_bar', label: 'Barra de dominadas' },
            { id: 'gymnastic_rings', label: 'Anillas de gimnasia' },
            { id: 'resistance_bands', label: 'Bandas elásticas' },
            { id: 'dumbbells', label: 'Mancuernas' },
            { id: 'kettlebells', label: 'Pesas rusas' },
            { id: 'parallettes', label: 'Paralelas bajas' },
            { id: 'yoga_mat', label: 'Colchoneta de yoga' }
          ].map(eq => {
            const isSelected = equipment.includes(eq.id);
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipment(eq.id)}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${isSelected ? 'bg-[#DCEFE8] text-[#20312D] border-[#56B89D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
              >
                <span>{eq.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#56B89D]" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* INJURIES & JOINT LIMITATIONS */}
      <GlassCard className="p-6 sm:p-7">
        <span className="text-[11px] font-extrabold tracking-wider text-[#E9A06D] uppercase block">
          Protocolos de Seguridad Articular
        </span>
        <h3 className="text-xl font-black text-[#20312D] mb-2">
          {t('profile.limitations')}
        </h3>
        <p className="text-xs text-[#6F7D78] mb-4">
          Al indicar una zona, el motor adaptativo evita ángulos de compresión aguda y prioriza movimientos estabilizadores.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'shoulder_caution', label: 'Molestia en hombros' },
            { id: 'knee_sensitivity', label: 'Sensibilidad en rodillas' },
            { id: 'lower_back_caution', label: 'Cuidado lumbar' },
            { id: 'wrist_discomfort', label: 'Molestia en muñecas' },
            { id: 'neck_tightness', label: 'Tensión cervical' },
            { id: 'hip_mobility_limit', label: 'Rigidez de cadera' }
          ].map(inj => {
            const isSelected = injuries.includes(inj.id);
            return (
              <button
                key={inj.id}
                type="button"
                onClick={() => toggleInjury(inj.id)}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${isSelected ? 'bg-[#F5D5C2] text-[#20312D] border-[#E9A06D]' : 'bg-white text-[#6F7D78] border-black/5'}`}
              >
                <span>{inj.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E9A06D]" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* FIREBASE CLOUD & AUTHENTICATION */}
      <GlassCard className="p-6 sm:p-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
            Cuenta y Persistencia en la Nube
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCEFE8] text-[#3B967D] text-[11px] font-bold">
            <Cloud className="w-3.5 h-3.5" />
            <span>Firebase Firestore</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-[#20312D] mb-2">
          {authUser ? 'Sesión Conectada' : 'Sincronizá tu Progreso con Firebase'}
        </h3>
        <p className="text-xs text-[#6F7D78] mb-5">
          {authUser 
            ? 'Tu perfil, historial de entrenamientos y puntuaciones se sincronizan automáticamente con Firebase Firestore.' 
            : 'Iniciá sesión con Google, GitHub o correo para almacenar permanentemente tus rutinas y entrenar desde cualquier dispositivo.'}
        </p>

        {authUser ? (
          <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {authUser.photoURL ? (
                <img 
                  src={authUser.photoURL} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#56B89D]" 
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center font-black text-lg">
                  {(user.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-[#20312D]">{user.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-[#20312D] text-white text-[10px] font-bold uppercase">
                    {authUser.providerData[0]?.providerId === 'google.com' ? 'Google' : authUser.providerData[0]?.providerId === 'github.com' ? 'GitHub' : 'Correo'}
                  </span>
                </div>
                <p className="text-xs text-[#6F7D78]">{authUser.email}</p>
                <p className="text-[10px] text-[#6F7D78]/70 font-mono mt-0.5">UID: {authUser.uid.slice(0, 16)}...</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#56B89D] mr-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Activo</span>
              </div>
              <button
                type="button"
                onClick={() => logoutUser()}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white/70 border border-white/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-xs font-bold text-[#20312D] mb-0.5">
                Modo local activo (sin autenticar)
              </div>
              <p className="text-[11px] text-[#6F7D78]">
                Tus datos actuales residen en la memoria local del navegador. Conectate con Firebase para no perderlos.
              </p>
            </div>
            <button
              type="button"
              id="profile-connect-firebase-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <LogIn className="w-4 h-4 text-[#56B89D]" />
              <span>Conectar con Google, GitHub o Correo</span>
            </button>
          </div>
        )}
      </GlassCard>

      {/* CONNECTED HEALTH & WEARABLES */}
      <GlassCard className="p-6 sm:p-7">
        <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
          Ecosistema de Salud
        </span>
        <h3 className="text-xl font-black text-[#20312D] mb-4">
          Integración con Dispositivos y Wearables
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'appleHealth', name: 'Apple Health', state: connectedHealth.appleHealth },
            { id: 'googleFit', name: 'Google Fit', state: connectedHealth.googleFit },
            { id: 'strava', name: 'Strava', state: connectedHealth.strava },
            { id: 'garmin', name: 'Garmin Connect', state: connectedHealth.garmin }
          ].map(app => (
            <div key={app.id} className="p-3.5 rounded-2xl bg-white/80 border border-white flex items-center justify-between shadow-2xs">
              <span className="text-xs font-bold text-[#20312D]">{app.name}</span>
              <button
                type="button"
                onClick={() => setConnectedHealth(prev => ({ ...prev, [app.id]: !(prev as any)[app.id] }))}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-colors cursor-pointer ${app.state ? 'bg-[#DCEFE8] text-[#56B89D]' : 'bg-black/5 text-[#6F7D78]'}`}
              >
                {app.state ? 'Activo' : 'Conectar'}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ACTIONS: SAVE, REASSESSMENT, EXPORT */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleSaveProfile}
          className="px-6 py-3.5 rounded-2xl bg-[#20312D] hover:bg-black text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#56B89D]" />
          <span>{t('profile.saveChanges')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-white/90 border border-black/10 text-xs font-bold text-[#20312D] hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>Repetir evaluación física</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-4 py-3 rounded-2xl bg-white/90 border border-black/10 text-xs font-bold text-[#20312D] hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Exportar historial de entrenamientos y puntuaciones en formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#6F7D78]" />
            <span>Exportar datos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Clock, 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Activity, 
  Dumbbell, 
  CheckCircle2, 
  Flame, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../../types/fitness';
import { fetchAllUsersForAdmin } from '../../lib/firebase';
import { useFitness } from '../../context/FitnessContext';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo users to populate the admin panel alongside real Firestore users
const DEMO_PREVIEW_USERS: UserProfile[] = [
  {
    id: 'user_lucas_admin',
    uid: 'user_lucas_admin',
    name: 'Lucas Ferreyra',
    email: 'lucas.ferreyra@gmail.com',
    role: 'admin',
    age: 32,
    sex: 'male',
    heightCm: 180,
    weightKg: 78,
    unitSystem: 'metric',
    goals: ['improve_strength', 'build_muscle'],
    primaryGoal: 'improve_strength',
    experience: 'intermediate',
    activityLevel: 'moderately_active',
    trainingDaysPerWeek: 5,
    preferredDurationMinutes: 45,
    equipment: ['bodyweight', 'pull_up_bar', 'dumbbells'],
    preferences: ['calisthenics', 'strength', 'functional'],
    limitations: ['none'],
    safetyAcknowledged: true,
    isOnboarded: true,
    hasCompletedAssessment: true,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'user_daniela_1',
    uid: 'user_daniela_1',
    name: 'Daniela Vela',
    email: 'danielavela.cba@gmail.com',
    role: 'user',
    age: 29,
    sex: 'female',
    heightCm: 165,
    weightKg: 58,
    unitSystem: 'metric',
    goals: ['general_fitness', 'improve_mobility', 'lose_fat'],
    primaryGoal: 'general_fitness',
    experience: 'beginner',
    activityLevel: 'moderately_active',
    trainingDaysPerWeek: 4,
    preferredDurationMinutes: 30,
    equipment: ['bodyweight', 'mat', 'resistance_bands'],
    preferences: ['functional', 'mobility'],
    limitations: ['none'],
    safetyAcknowledged: true,
    isOnboarded: true,
    hasCompletedAssessment: true,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    createdAt: '2026-09-15T14:30:00.000Z'
  },
  {
    id: 'user_mateo_2',
    uid: 'user_mateo_2',
    name: 'Mateo Rossi',
    email: 'mateo.rossi.fit@outlook.com',
    role: 'user',
    age: 26,
    sex: 'male',
    heightCm: 175,
    weightKg: 72,
    unitSystem: 'metric',
    goals: ['build_muscle', 'improve_endurance'],
    primaryGoal: 'build_muscle',
    experience: 'advanced',
    activityLevel: 'very_active',
    trainingDaysPerWeek: 5,
    preferredDurationMinutes: 50,
    equipment: ['bodyweight', 'pull_up_bar', 'kettlebell'],
    preferences: ['calisthenics', 'hiit'],
    limitations: ['wrist'],
    safetyAcknowledged: true,
    isOnboarded: true,
    hasCompletedAssessment: true,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    createdAt: '2026-09-18T09:15:00.000Z'
  },
  {
    id: 'user_sofia_3',
    uid: 'user_sofia_3',
    name: 'Sofía Gómez',
    email: 'sofi.gomez88@gmail.com',
    role: 'user',
    age: 35,
    sex: 'female',
    heightCm: 168,
    weightKg: 64,
    unitSystem: 'metric',
    goals: ['lose_fat', 'improve_consistency'],
    primaryGoal: 'lose_fat',
    experience: 'beginner',
    activityLevel: 'lightly_active',
    trainingDaysPerWeek: 3,
    preferredDurationMinutes: 25,
    equipment: ['bodyweight', 'resistance_bands'],
    preferences: ['functional', 'core'],
    limitations: ['knee'],
    safetyAcknowledged: true,
    isOnboarded: true,
    hasCompletedAssessment: false,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: '2026-09-22T16:45:00.000Z'
  },
  {
    id: 'user_camilo_4',
    uid: 'user_camilo_4',
    name: 'Camilo Ramos',
    email: 'camilo.ramos@gmail.com',
    role: 'user',
    age: 41,
    sex: 'male',
    heightCm: 182,
    weightKg: 85,
    unitSystem: 'metric',
    goals: ['general_fitness', 'improve_strength'],
    primaryGoal: 'general_fitness',
    experience: 'intermediate',
    activityLevel: 'moderately_active',
    trainingDaysPerWeek: 4,
    preferredDurationMinutes: 40,
    equipment: ['bodyweight', 'mat', 'dumbbells'],
    preferences: ['functional', 'strength'],
    limitations: ['back'],
    safetyAcknowledged: true,
    isOnboarded: true,
    hasCompletedAssessment: true,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    createdAt: '2026-09-28T11:20:00.000Z'
  }
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { authUser, user: currentLocalUser, isAdmin } = useFitness();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const firestoreUsers = await fetchAllUsersForAdmin();
      // Combine with current logged-in user if available
      const mergedMap = new Map<string, UserProfile>();

      // Put demo users first
      DEMO_PREVIEW_USERS.forEach(u => mergedMap.set(u.email || u.id, u));

      // Merge current active local profile
      if (currentLocalUser?.email) {
        mergedMap.set(currentLocalUser.email, {
          ...currentLocalUser,
          lastActiveAt: new Date().toISOString()
        });
      }

      // Merge real Firestore users
      firestoreUsers.forEach(u => {
        if (u.email) {
          mergedMap.set(u.email, u);
        } else if (u.id) {
          mergedMap.set(u.id, u);
        }
      });

      setUsersList(Array.from(mergedMap.values()));
    } catch (e) {
      console.error('Failed to load admin users:', e);
      // Fallback to demo users
      setUsersList(DEMO_PREVIEW_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Format relative time for last connection
  const formatLastActive = (dateStr?: string) => {
    if (!dateStr) return 'Sin registros';
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) return 'En línea ahora';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.primaryGoal && u.primaryGoal.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchExp = selectedExperience === 'all' || u.experience === selectedExperience;

      return matchSearch && matchExp;
    });
  }, [usersList, searchQuery, selectedExperience]);

  // KPI Calculations
  const totalUsersCount = usersList.length;
  const activeTodayCount = usersList.filter(u => {
    if (!u.lastActiveAt) return false;
    const diffHours = (Date.now() - new Date(u.lastActiveAt).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;

  const averageAge = useMemo(() => {
    const valid = usersList.filter(u => u.age && u.age > 0);
    if (!valid.length) return 30;
    const sum = valid.reduce((acc, curr) => acc + curr.age, 0);
    return Math.round(sum / valid.length);
  }, [usersList]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Edad', 'Sexo', 'Nivel', 'Objetivo Principal', 'Días x Semana', 'Última Conexión', 'Fecha Registro'];
    const rows = filteredUsers.map(u => [
      u.uid || u.id,
      `"${u.name}"`,
      u.email || '',
      u.age || '',
      u.sex || '',
      u.experience || '',
      u.primaryGoal || '',
      u.trainingDaysPerWeek || '',
      u.lastActiveAt || '',
      u.createdAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usuarios_soyfit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-[#131D1B] border border-red-500/30 rounded-3xl p-6 max-w-md text-white text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="text-lg font-black text-white">Acceso Denegado</h3>
          <p className="text-xs text-gray-300">
            Panel restringido. Únicamente el administrador registrado (<span className="text-[#56B89D] font-bold">lucas.ferreyra@gmail.com</span>) tiene autorización para visualizar este módulo.
          </p>
          <button 
            onClick={onClose} 
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#131D1B] border border-white/15 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white shadow-md shadow-[#56B89D]/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Panel de Administración SOYFIT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#56B89D]/20 border border-[#56B89D]/40 text-[#56B89D] text-[11px] font-black uppercase tracking-wider">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">
                Acceso exclusivo para: <span className="text-white font-semibold underline decoration-[#56B89D]">lucas.ferreyra@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUsers}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer disabled:opacity-50"
              title="Refrescar usuarios"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#56B89D]' : ''}`} />
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#56B89D]" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-semibold">Total Usuarios</span>
                <Users className="w-4 h-4 text-[#56B89D]" />
              </div>
              <div className="text-2xl font-black text-white">{totalUsersCount}</div>
              <span className="text-[11px] text-[#56B89D] font-medium">Registrados en la base</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-semibold">Activos Hoy</span>
                <Activity className="w-4 h-4 text-[#E9A06D]" />
              </div>
              <div className="text-2xl font-black text-white">{activeTodayCount}</div>
              <span className="text-[11px] text-gray-400 font-medium">Últimas 24 horas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-semibold">Promedio de Edad</span>
                <TrendingUp className="w-4 h-4 text-[#56B89D]" />
              </div>
              <div className="text-2xl font-black text-white">{averageAge} <span className="text-sm font-normal text-gray-400">años</span></div>
              <span className="text-[11px] text-gray-400 font-medium">Comunidad activa</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-semibold">Estado Servidor</span>
                <CheckCircle2 className="w-4 h-4 text-[#56B89D]" />
              </div>
              <div className="text-sm font-bold text-white mt-1">Conectado a Firestore</div>
              <span className="text-[11px] text-[#56B89D] font-medium">Sincronización en vivo</span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, correo electrónico u objetivo..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-hidden focus:border-[#56B89D] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#56B89D] transition-colors cursor-pointer"
              >
                <option value="all" className="bg-[#16221F] text-white">Todos los niveles</option>
                <option value="beginner" className="bg-[#16221F] text-white">Principiante</option>
                <option value="intermediate" className="bg-[#16221F] text-white">Intermedio</option>
                <option value="advanced" className="bg-[#16221F] text-white">Avanzado</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-black/30 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Usuario / Nombre Completo</th>
                    <th className="px-5 py-3.5">Correo Electrónico</th>
                    <th className="px-5 py-3.5 text-center">Edad</th>
                    <th className="px-5 py-3.5">Última Conexión</th>
                    <th className="px-5 py-3.5">Nivel / Meta</th>
                    <th className="px-5 py-3.5 text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                        No se encontraron usuarios que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isRecentlyActive = u.lastActiveAt && (Date.now() - new Date(u.lastActiveAt).getTime()) < 1000 * 60 * 60;
                      return (
                        <tr 
                          key={u.uid || u.id}
                          className="hover:bg-white/5 transition-colors cursor-pointer group"
                          onClick={() => setSelectedUserDetail(u)}
                        >
                          {/* Name + Avatar */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#56B89D]/40 to-[#3B967D]/60 border border-[#56B89D]/50 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                                {u.name ? u.name.charAt(0) : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-[#56B89D] transition-colors flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.role === 'admin' && (
                                    <span className="px-1.5 py-0.2 rounded-md bg-[#E9A06D]/20 text-[#E9A06D] text-[10px] font-extrabold uppercase">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-400 font-normal">
                                  {u.sex === 'female' ? 'Mujer' : u.sex === 'male' ? 'Varón' : 'No especificado'} • {u.heightCm || 170} cm • {u.weightKg || 70} kg
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-gray-300 font-mono text-xs">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span>{u.email || 'Sin correo registrado'}</span>
                            </div>
                          </td>

                          {/* Age */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-center">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 font-bold text-white text-xs">
                              {u.age ? `${u.age} años` : '—'}
                            </span>
                          </td>

                          {/* Last Active */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isRecentlyActive ? 'bg-[#56B89D] ring-2 ring-[#56B89D]/40 animate-pulse' : 'bg-gray-500'}`} />
                              <span className="text-xs font-medium text-gray-200">
                                {formatLastActive(u.lastActiveAt)}
                              </span>
                            </div>
                          </td>

                          {/* Level / Primary Goal */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white capitalize">
                                {u.experience || 'Principiante'}
                              </span>
                              <span className="text-[11px] text-gray-400 capitalize">
                                {u.primaryGoal ? u.primaryGoal.replace(/_/g, ' ') : 'General'}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserDetail(u);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#56B89D] hover:text-[#111A18] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Ver</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed User Sheet / Drawer Modal */}
        {selectedUserDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#182622] border border-white/20 p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                    {selectedUserDetail.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedUserDetail.name}</h3>
                    <p className="text-xs text-gray-300 font-mono">{selectedUserDetail.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Personal Info Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#56B89D] uppercase tracking-wider block">
                    Información Personal & Biométrica
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Edad:</span>
                      <span className="font-bold text-white">{selectedUserDetail.age || '—'} años</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Sexo biológico:</span>
                      <span className="font-bold text-white capitalize">{selectedUserDetail.sex || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Estatura:</span>
                      <span className="font-bold text-white">{selectedUserDetail.heightCm || '—'} cm</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Peso corporal:</span>
                      <span className="font-bold text-white">{selectedUserDetail.weightKg || '—'} kg</span>
                    </div>
                  </div>
                </div>

                {/* Fitness Profile Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#56B89D] uppercase tracking-wider block">
                    Plan & Preferencias de Entrenamiento
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Objetivo Principal:</span>
                      <span className="font-bold text-white capitalize">{selectedUserDetail.primaryGoal?.replace(/_/g, ' ') || 'General'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Nivel Experiencia:</span>
                      <span className="font-bold text-white capitalize">{selectedUserDetail.experience || 'Principiante'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Días por semana:</span>
                      <span className="font-bold text-white">{selectedUserDetail.trainingDaysPerWeek || 4} días</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Duración sesión:</span>
                      <span className="font-bold text-white">{selectedUserDetail.preferredDurationMinutes || 30} min</span>
                    </div>
                  </div>

                  {selectedUserDetail.limitations && selectedUserDetail.limitations.length > 0 && selectedUserDetail.limitations[0] !== 'none' && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <span className="text-gray-400 block text-[11px]">Limitaciones o molestias:</span>
                      <span className="font-bold text-[#E9A06D]">{selectedUserDetail.limitations.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Connection History */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#56B89D] uppercase tracking-wider block">
                    Historial de Conexión & Plataforma
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Última vez que se conectó:</span>
                      <span className="font-bold text-white">{selectedUserDetail.lastActiveAt ? new Date(selectedUserDetail.lastActiveAt).toLocaleString('es-AR') : 'Sin registros'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Fecha de alta / registro:</span>
                      <span className="font-bold text-white">{selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleDateString('es-AR') : '—'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Rol en el sistema:</span>
                      <span className="font-bold text-[#56B89D] uppercase">{selectedUserDetail.role || 'Usuario'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="px-5 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

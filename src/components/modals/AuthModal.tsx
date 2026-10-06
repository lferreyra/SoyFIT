import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, registerWithEmail, resetPassword } from '../../lib/firebase';
import { useFitness } from '../../context/FitnessContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { setIsAssessmentModalOpen } = useFitness();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setInfoMsg(null);
      await signInWithGoogle();
      setIsAssessmentModalOpen(true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de acceso cerrada antes de completar.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('El acceso con Google debe estar habilitado en la consola de Firebase (Authentication > Sign-in method > Google).');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setErrorMsg(`Dominio no autorizado. En Firebase Console (Authentication > Settings > Authorized domains) añade: ${window.location.hostname}`);
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('El navegador bloqueó la ventana emergente de Google. Permití las ventanas emergentes (popups) para continuar.');
      } else {
        setErrorMsg(err.message || 'No se pudo conectar con Google. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor ingresá un correo electrónico válido.');
      return;
    }

    if (mode === 'forgot') {
      try {
        setLoading(true);
        await resetPassword(email.trim());
        setInfoMsg('Te enviamos un enlace de recuperación a tu correo electrónico.');
      } catch (err: any) {
        if (err?.code === 'auth/user-not-found') {
          setErrorMsg('No encontramos ninguna cuenta registrada con este correo.');
        } else {
          setErrorMsg('No se pudo enviar el correo de recuperación.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        await registerWithEmail(email.trim(), password, displayName.trim() || 'Atleta');
        setIsAssessmentModalOpen(true);
      } else {
        await signInWithEmail(email.trim(), password);
        setIsAssessmentModalOpen(true);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err?.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo electrónico ya está registrado. Probá iniciar sesión.');
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('El acceso con correo y contraseña debe activarse en la consola de Firebase. Podés ingresar inmediatamente usando Google.');
      } else {
        setErrorMsg(err?.message || 'Ocurrió un error al autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-[#161412] border border-[#2B2723] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9E968E] hover:text-white transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'forgot' ? 'Recuperar contraseña' : mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9E968E] mt-1 font-medium">
            {mode === 'forgot'
              ? 'Ingresá tu correo para restablecer tu clave'
              : mode === 'signup'
              ? 'Comenzá a registrar tu entrenamiento y hábitos'
              : 'Bienvenido de vuelta a tu espacio'}
          </p>
        </div>

        {/* Tabs: Iniciar sesión / Crear cuenta (as seen in reference design) */}
        {mode !== 'forgot' && (
          <div className="p-1 rounded-2xl bg-[#23201D] border border-white/5 flex mb-5">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setInfoMsg(null);
                setMode('signin');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#2E2A26] text-white shadow-xs'
                  : 'text-[#8F877E] hover:text-white'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setInfoMsg(null);
                setMode('signup');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#2E2A26] text-white shadow-xs'
                  : 'text-[#8F877E] hover:text-white'
              }`}
            >
              Crear cuenta
            </button>
          </div>
        )}

        {/* Notification Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{infoMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-100 text-[#1F1B18] text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#332E2A] w-full" />
              <span className="bg-[#161412] px-3 text-[10px] sm:text-[11px] font-bold text-[#8C847B] uppercase tracking-widest shrink-0">
                O CON TU CORREO
              </span>
              <div className="border-t border-[#332E2A] w-full" />
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#7C756D] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Tu nombre o apodo"
                className="w-full pl-11 pr-4 py-3 bg-[#23201D] border border-[#3E3832] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-[#7C756D] focus:outline-none focus:border-[#F06A38] transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 text-[#7C756D] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-11 pr-4 py-3 bg-[#23201D] border border-[#3E3832] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-[#7C756D] focus:outline-none focus:border-[#F06A38] transition-colors"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C756D] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  className="w-full pl-11 pr-4 py-3 bg-[#23201D] border border-[#3E3832] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-[#7C756D] focus:outline-none focus:border-[#F06A38] transition-colors"
                />
              </div>

              {mode === 'signin' && (
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setInfoMsg(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] font-semibold text-[#A8A199] hover:text-[#F06A38] transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action button in vibrant coral/orange as shown in reference */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#F06A38] hover:bg-[#E25927] active:scale-[0.99] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F06A38]/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Entrar a SOYFIT'}
                  {mode === 'signup' && 'Crear cuenta en SOYFIT'}
                  {mode === 'forgot' && 'Enviar enlace de recuperación'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Back button if in forgot password mode */}
        {mode === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setInfoMsg(null);
                setMode('signin');
              }}
              className="text-xs font-bold text-[#A8A199] hover:text-white transition-colors cursor-pointer"
            >
              ← Volver a Iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

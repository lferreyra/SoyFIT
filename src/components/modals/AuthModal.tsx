import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2, ArrowRight, Loader2, Sparkles, Github } from 'lucide-react';
import { signInWithGoogle, signInWithGithub, signInWithEmail, registerWithEmail, resetPassword } from '../../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de acceso cerrada antes de completar.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('El acceso con Google debe estar habilitado en la consola de Firebase.');
      } else {
        setErrorMsg('No se pudo conectar con Google. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setInfoMsg(null);
      await signInWithGithub();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('GitHub login error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de acceso a GitHub cerrada antes de completar.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('GitHub Auth requiere habilitar el proveedor en la consola de Firebase (Authentication > Sign-in method) ingresando el Client ID y Secret de GitHub. Mientras tanto podés acceder con Google.');
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg('Ya existe una cuenta registrada con este correo electrónico usando otro método de acceso.');
      } else {
        setErrorMsg(err.message || 'No se pudo iniciar sesión con GitHub.');
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
          setErrorMsg('No encontramos ninguna cuenta con este correo.');
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
      } else {
        await signInWithEmail(email.trim(), password);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#FBF9F5] border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCEFE8] text-[#20312D] text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#56B89D]" />
            <span>Sincronización en la nube</span>
          </div>
          <h2 className="text-2xl font-black text-[#20312D] tracking-tight">
            {mode === 'signin' && 'Iniciar sesión'}
            {mode === 'signup' && 'Crear tu cuenta'}
            {mode === 'forgot' && 'Recuperar contraseña'}
          </h2>
          <p className="text-xs text-[#6F7D78] mt-1">
            {mode === 'signin' && 'Guardá tu historial de entrenamientos, nivel y racha en Firebase'}
            {mode === 'signup' && 'Comenzá a registrar tu progreso físico adaptativo y seguro'}
            {mode === 'forgot' && 'Ingresá tu correo para restablecer tu clave'}
          </p>
        </div>

        {/* Notification Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-relaxed">{infoMsg}</span>
          </div>
        )}

        {/* OAuth Buttons (Google & GitHub) */}
        {mode !== 'forgot' && (
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-bold text-[#20312D] flex items-center justify-center gap-3 transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#24292F] hover:bg-[#1B1F23] text-white text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Github className="w-4 h-4" />
              <span>Continuar con GitHub</span>
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-black/10 w-full" />
              <span className="bg-[#FBF9F5] px-3 text-[11px] font-semibold text-[#6F7D78] uppercase tracking-wider shrink-0">
                O con tu correo
              </span>
              <div className="border-t border-black/10 w-full" />
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-[#6F7D78] uppercase tracking-wider mb-1">
                Nombre o apodo
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#6F7D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs font-medium text-[#20312D] focus:outline-none focus:border-[#56B89D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#6F7D78] uppercase tracking-wider mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6F7D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs font-medium text-[#20312D] focus:outline-none focus:border-[#56B89D]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-[#6F7D78] uppercase tracking-wider">
                  Contraseña
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] font-bold text-[#56B89D] hover:underline cursor-pointer"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6F7D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs font-medium text-[#20312D] focus:outline-none focus:border-[#56B89D]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#56B89D]" />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Ingresar con correo'}
                  {mode === 'signup' && 'Registrarse'}
                  {mode === 'forgot' && 'Enviar enlace de recuperación'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switchers */}
        <div className="mt-5 text-center text-xs text-[#6F7D78] pt-4 border-t border-black/5">
          {mode === 'signin' && (
            <p>
              ¿No tenés una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('signup');
                }}
                className="font-black text-[#56B89D] hover:underline cursor-pointer"
              >
                Registrate acá
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('signin');
                }}
                className="font-black text-[#56B89D] hover:underline cursor-pointer"
              >
                Iniciá sesión
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('signin');
                }}
                className="font-black text-[#56B89D] hover:underline cursor-pointer"
              >
                Volver al inicio de sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Entrada de la version simple: "/" es el embudo de venta, "/app" es la app de quien compro.

import React, { useEffect, useState } from 'react';
import { registerWithEmail, resetPassword, signInWithEmail, signInWithGoogle } from '../lib/firebase';
import { Embudo } from './Embudo';
import { AppSimple } from './AppSimple';
import { esVistaPrevia, leerCompras, leerRespuestas, useUsuario } from './estado';
import { linkDePago, PRODUCTOS, ProductoId } from './oferta';
import { Logo } from './Logo';

export const Raiz: React.FC = () => {
  const enApp = location.pathname.startsWith('/app');
  if (!enApp) return <Embudo />;
  if (esVistaPrevia()) return <AppSimple usuario={null} compras={PRODUCTOS.map(p => p.id)} />;
  return <ConAcceso />;
};

const ConAcceso: React.FC = () => {
  const usuario = useUsuario();
  const [compras, setCompras] = useState<ProductoId[] | null>(null);

  useEffect(() => {
    setCompras(null);
    if (usuario) leerCompras(usuario).then(setCompras);
  }, [usuario]);

  if (usuario === undefined || (usuario && compras === null)) return <Cargando />;
  if (!usuario) return <Acceso />;
  if (!compras!.includes('programa')) return <SinCompra email={usuario.email ?? ''} />;
  return <AppSimple usuario={usuario} compras={compras!} />;
};

const Cargando = () => (
  <div className="min-h-screen flex items-center justify-center text-[#6F7D78]">Cargando…</div>
);

const SinCompra: React.FC<{ email: string }> = ({ email }) => {
  const link = linkDePago('programa', email);
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col justify-center text-center">
      <h1 className="text-2xl font-extrabold">No encontramos tu compra</h1>
      <p className="text-[#6F7D78] mt-3">
        Entraste con <span className="font-bold text-[#20312D]">{email}</span>. Si pagaste con otro mail, cerrá sesión y entrá con ese.
        Si acabás de pagar, esperá un minuto y recargá.
      </p>
      {link && <a href={link} className="mt-8 py-4 rounded-2xl bg-[#56B89D] text-white font-bold">Conseguir el programa</a>}
      <button onClick={() => import('../lib/firebase').then(m => m.logOut())} className="mt-3 py-4 rounded-2xl bg-white font-bold">
        Cerrar sesión
      </button>
    </div>
  );
};

const Acceso: React.FC = () => {
  const guardado = leerRespuestas();
  const [modo, setModo] = useState<'entrar' | 'crear'>('crear');
  const [email, setEmail] = useState(guardado.email ?? '');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      if (modo === 'crear') await registerWithEmail(email, clave, guardado.nombre ?? '');
      else await signInWithEmail(email, clave);
    } catch (err: any) {
      const c = err?.code ?? '';
      setError(
        c.includes('email-already-in-use') ? 'Ese mail ya tiene cuenta: tocá "Ya tengo cuenta".'
        : c.includes('weak-password') ? 'La contraseña tiene que tener al menos 6 caracteres.'
        : c.includes('invalid') || c.includes('wrong-password') || c.includes('user-not-found') ? 'Mail o contraseña incorrectos.'
        : 'No pudimos entrar. Probá de nuevo.',
      );
    } finally {
      setEnviando(false);
    }
  };

  const claseInput = 'mt-1 w-full px-4 py-4 rounded-2xl bg-white font-semibold outline-none focus:ring-2 focus:ring-[#56B89D]';

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 flex flex-col justify-center py-10">
      <div className="mb-8">
        <Logo size={36} />
      </div>
      <h1 className="text-2xl font-extrabold text-center">{modo === 'crear' ? 'Creá tu acceso' : 'Entrá a tu programa'}</h1>
      <p className="text-[#6F7D78] text-center mt-2">Usá el mismo mail con el que pagaste.</p>

      <form onSubmit={enviar} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold text-[#6F7D78]">Mail
          <input className={claseInput} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value.trim())} />
        </label>
        <label className="block text-sm font-semibold text-[#6F7D78]">Contraseña
          <input className={claseInput} type="password" autoComplete={modo === 'crear' ? 'new-password' : 'current-password'} value={clave} onChange={e => setClave(e.target.value)} />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {aviso && <p className="text-sm text-[#2f7d66]">{aviso}</p>}
        <button disabled={enviando || !email || !clave} className="w-full py-4 rounded-2xl bg-[#20312D] text-white font-bold disabled:opacity-40">
          {modo === 'crear' ? 'Crear acceso' : 'Entrar'}
        </button>
      </form>

      <button onClick={() => signInWithGoogle().catch(() => setError('No pudimos entrar con Google.'))} className="mt-3 w-full py-4 rounded-2xl bg-white font-bold">
        Seguir con Google
      </button>

      <div className="mt-6 text-center text-sm space-y-3">
        <button onClick={() => { setModo(modo === 'crear' ? 'entrar' : 'crear'); setError(''); }} className="font-semibold underline">
          {modo === 'crear' ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
        </button>
        {modo === 'entrar' && (
          <div>
            <button
              onClick={() => email ? resetPassword(email).then(() => setAviso('Te mandamos un mail para cambiar la contraseña.')).catch(() => setError('No pudimos mandar el mail.')) : setError('Escribí tu mail primero.')}
              className="text-[#6F7D78] underline"
            >
              Me olvidé la contraseña
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

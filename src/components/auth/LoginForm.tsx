'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Wallet, ArrowRight } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, profile, refreshProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor llena todos los campos');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      const updatedProfile = await refreshProfile();
      if (updatedProfile?.onboarded) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    } catch (err: any) {
      console.error('Error de login:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Correo electrónico inválido.');
      } else {
        setError(err.message || 'Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 mb-3">
          <Wallet className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Finanzas Personales</h1>
        <p className="text-xs text-slate-400 mt-1">Ingresa a tu entorno financiero independiente</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
        />

        <Button type="submit" isLoading={isLoading} className="w-full gap-2 mt-2">
          Iniciar sesión <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
        ¿No tienes una cuenta aún?{' '}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-bold underline">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/context/AuthContext';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (profile?.onboarded) {
        router.replace('/dashboard');
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner label="Cargando configuración inicial..." />
      </div>
    );
  }

  return <OnboardingWizard />;
}

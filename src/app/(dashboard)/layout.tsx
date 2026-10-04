'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardLayoutProvider } from '@/components/layout/DashboardLayoutContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GlobalQuickExpenseModal } from '@/components/layout/GlobalQuickExpenseModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (profile && !profile.onboarded) {
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner label="Verificando sesión privada..." />
      </div>
    );
  }

  return (
    <DashboardLayoutProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
        <MobileBottomNav />
        <GlobalQuickExpenseModal />
      </div>
    </DashboardLayoutProvider>
  );
}

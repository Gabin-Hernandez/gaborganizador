'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { SalaryForm } from '@/components/salario/SalaryForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const SalaryDistributionChart = dynamic(
  () => import('@/components/salario/SalaryDistributionChart').then((mod) => mod.SalaryDistributionChart),
  {
    ssr: false,
    loading: () => <div className="p-8 text-xs text-slate-500 text-center">Cargando gráfica...</div>
  }
);

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function SalarioPage({ onOpenMobileSidebar }: PageProps) {
  const { summary, loading } = useFinancialSummary();

  if (loading) {
    return <LoadingSpinner label="Cargando información salarial..." />;
  }

  return (
    <div className="space-y-6">
      <Header
        title="Gestión de Salario"
        subtitle="Visualiza y actualiza la base de tu ingreso mensual principal"
        moduleImage="/salario.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <SalaryForm />
        <SalaryDistributionChart summary={summary} />
      </div>
    </div>
  );
}

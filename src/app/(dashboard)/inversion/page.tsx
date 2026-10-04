'use client';

import React from 'react';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { InvestmentForm } from '@/components/inversiones/InvestmentForm';
import { InvestmentCard } from '@/components/inversiones/InvestmentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function InversionPage({ onOpenMobileSidebar }: PageProps) {
  const { summary, loading } = useFinancialSummary();

  if (loading) {
    return <LoadingSpinner label="Cargando entorno de inversión..." />;
  }

  return (
    <div className="space-y-6">
      <Header
        title="Estrategia de Inversión"
        subtitle="Asigna objetivos de patrimonio por porcentaje o monto fijo y registra tus aportaciones"
        moduleImage="/inversion.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
      />
      <InvestmentCard summary={summary} />
      <InvestmentForm salary={summary.salary} />
    </div>
  );
}

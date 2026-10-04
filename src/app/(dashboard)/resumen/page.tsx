'use client';

import React from 'react';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { ResumenOverview } from '@/components/resumen/ResumenOverview';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function ResumenPage({ onOpenMobileSidebar }: PageProps) {
  const { summary, loading } = useFinancialSummary();

  if (loading) {
    return <LoadingSpinner label="Cargando resumen financiero global..." />;
  }

  return (
    <div className="space-y-6">
      <Header
        title="Resumen Financiero Global"
        subtitle="Analítica consolidada de salud financiera, dinero sobrante y métricas de desempeño"
        moduleImage="/resumen.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
      />
      <ResumenOverview summary={summary} />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { ResumenOverview } from '@/components/resumen/ResumenOverview';
import { MonthSelector, formatPeriodLabel } from '@/components/ui/MonthSelector';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function ResumenPage({ onOpenMobileSidebar }: PageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() =>
    new Date().toISOString().slice(0, 7)
  );

  const { summary, loading } = useFinancialSummary(selectedPeriod);

  if (loading) {
    return <LoadingSpinner label="Cargando resumen financiero..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Header
          title="Resumen Financiero Global"
          subtitle={`Analítica consolidada para ${formatPeriodLabel(selectedPeriod)}`}
          moduleImage="/resumen.png"
          onOpenMobileSidebar={onOpenMobileSidebar}
        />
        <div className="shrink-0 flex items-center justify-end">
          <MonthSelector selectedPeriod={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
      </div>

      <ResumenOverview summary={summary} />
    </div>
  );
}

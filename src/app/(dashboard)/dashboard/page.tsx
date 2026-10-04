'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/layout/Header';
import { FinancialCards } from '@/components/dashboard/FinancialCards';
import { ActivityList } from '@/components/dashboard/ActivityList';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ExpenseDonutChart = dynamic(
  () => import('@/components/dashboard/ExpenseDonutChart').then((mod) => mod.ExpenseDonutChart),
  {
    ssr: false,
    loading: () => <div className="p-8 text-xs text-slate-500 text-center">Cargando gráfica...</div>
  }
);

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function DashboardPage({ onOpenMobileSidebar }: PageProps) {
  const { summary, last10DaysActivities, loading, refreshAll } = useFinancialSummary();
  const { addExpense } = useExpenses();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner label="Cargando tu dashboard financiero..." />;
  }

  const handleAddExpense = async (data: any) => {
    await addExpense(data);
    await refreshAll();
  };

  return (
    <div className="space-y-8">
      <Header
        title="Dashboard Financiero"
        subtitle="Monitoreo en tiempo real de tu salario, gastos e inversión"
        moduleImage="/dashboard.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
        onQuickAction={() => setIsExpenseModalOpen(true)}
        quickActionLabel="Registrar gasto"
      />

      {/* Top Summarized Metric Cards */}
      <FinancialCards summary={summary} />

      {/* Middle Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <ExpenseDonutChart categoryBreakdown={summary.categoryBreakdown} />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <ActivityList activities={last10DaysActivities} />
        </div>
      </div>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}

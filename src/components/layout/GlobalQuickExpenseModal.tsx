'use client';

import React from 'react';
import { useDashboardLayout } from './DashboardLayoutContext';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { useExpenses } from '@/hooks/useExpenses';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';

export const GlobalQuickExpenseModal: React.FC = () => {
  const { isQuickExpenseOpen, closeQuickExpense } = useDashboardLayout();
  const { addExpense } = useExpenses();
  const { refreshAll } = useFinancialSummary();

  const handleAddExpense = async (data: any) => {
    await addExpense(data);
    await refreshAll();
  };

  return (
    <ExpenseModal
      isOpen={isQuickExpenseOpen}
      onClose={closeQuickExpense}
      onSubmit={handleAddExpense}
    />
  );
};

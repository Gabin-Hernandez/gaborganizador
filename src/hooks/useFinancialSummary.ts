'use client';

import { useMemo } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { useExpenses } from './useExpenses';
import { useExtraIncomes } from './useExtraIncomes';
import { useInvestment } from './useInvestment';
import { FinancialCalculator, FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { FinancialActivityItem } from '@/domain/entities/Activity';

export function useFinancialSummary() {
  const { profile, loading: profileLoading } = useAuth();
  const { expenses, loading: expensesLoading, refresh: refreshExpenses } = useExpenses();
  const { extraIncomes, loading: incomesLoading, refresh: refreshIncomes } = useExtraIncomes();
  const { config: investmentConfig, contributions: investmentContribs, loading: investmentLoading, refresh: refreshInvestment } = useInvestment();

  const salary = profile?.salary || 0;

  const summary: FinancialPeriodSummary = useMemo(() => {
    return FinancialCalculator.calculateSummary(
      salary,
      expenses,
      extraIncomes,
      investmentConfig,
      investmentContribs
    );
  }, [salary, expenses, extraIncomes, investmentConfig, investmentContribs]);

  // Compute Last 10 Days Activity timeline
  const last10DaysActivities: FinancialActivityItem[] = useMemo(() => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const tenDaysAgoStr = tenDaysAgo.toISOString().split('T')[0];

    const items: FinancialActivityItem[] = [];

    expenses.forEach((e) => {
      if (e.date >= tenDaysAgoStr) {
        items.push({
          id: `exp-${e.id}`,
          type: 'EXPENSE',
          title: e.description || e.categoryName,
          categoryOrConcept: e.categoryName,
          description: e.isRecurring ? `Gasto Recurrente (${e.frequencyName || 'Frecuente'})` : undefined,
          amount: e.amount,
          date: e.date
        });
      }
    });

    extraIncomes.forEach((i) => {
      if (i.date >= tenDaysAgoStr) {
        items.push({
          id: `inc-${i.id}`,
          type: 'EXTRA_INCOME',
          title: i.concept,
          categoryOrConcept: 'Ingreso Extra',
          description: i.description,
          amount: i.amount,
          date: i.date
        });
      }
    });

    investmentContribs.forEach((c) => {
      if (c.date >= tenDaysAgoStr) {
        items.push({
          id: `inv-${c.id}`,
          type: 'INVESTMENT',
          title: 'Aporte a Inversión',
          categoryOrConcept: 'Inversión',
          description: c.note,
          amount: c.amount,
          date: c.date
        });
      }
    });

    // Sort descending by date
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, extraIncomes, investmentContribs]);

  const loading = profileLoading || expensesLoading || incomesLoading || investmentLoading;

  const refreshAll = async () => {
    await Promise.all([refreshExpenses(), refreshIncomes(), refreshInvestment()]);
  };

  return {
    summary,
    last10DaysActivities,
    expenses,
    extraIncomes,
    investmentConfig,
    investmentContribs,
    loading,
    refreshAll
  };
}

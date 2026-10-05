'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { useExpenses } from './useExpenses';
import { useExtraIncomes } from './useExtraIncomes';
import { useInvestment } from './useInvestment';
import { FinancialCalculator, FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { FinancialActivityItem } from '@/domain/entities/Activity';

export function useFinancialSummary(periodParam?: string) {
  const { profile, loading: profileLoading } = useAuth();
  const { expenses, loading: expensesLoading, refresh: refreshExpenses } = useExpenses();
  const { extraIncomes, loading: incomesLoading, refresh: refreshIncomes } = useExtraIncomes();
  const { config: investmentConfig, contributions: investmentContribs, loading: investmentLoading, refresh: refreshInvestment } = useInvestment();

  const [internalPeriod, setInternalPeriod] = useState<string>(() => {
    return periodParam || new Date().toISOString().slice(0, 7);
  });

  const selectedPeriod = periodParam || internalPeriod;

  const salary = profile?.salary || 0;

  // Filter expenses strictly by financial date (date / expenseDate) belonging to selectedPeriod (YYYY-MM)
  const filteredExpenses = useMemo(() => {
    if (!selectedPeriod) return expenses;
    return expenses.filter((e) => e.date && e.date.startsWith(selectedPeriod));
  }, [expenses, selectedPeriod]);

  // Filter extra incomes strictly by financial date (date) belonging to selectedPeriod (YYYY-MM)
  const filteredExtraIncomes = useMemo(() => {
    if (!selectedPeriod) return extraIncomes;
    return extraIncomes.filter((i) => i.date && i.date.startsWith(selectedPeriod));
  }, [extraIncomes, selectedPeriod]);

  // Filter investment contributions strictly by financial date (date) belonging to selectedPeriod (YYYY-MM)
  const filteredInvestmentContribs = useMemo(() => {
    if (!selectedPeriod) return investmentContribs;
    return investmentContribs.filter((c) => c.date && c.date.startsWith(selectedPeriod));
  }, [investmentContribs, selectedPeriod]);

  const summary: FinancialPeriodSummary = useMemo(() => {
    return FinancialCalculator.calculateSummary(
      salary,
      filteredExpenses,
      filteredExtraIncomes,
      investmentConfig,
      filteredInvestmentContribs
    );
  }, [salary, filteredExpenses, filteredExtraIncomes, investmentConfig, filteredInvestmentContribs]);

  // Compute Period Activity timeline based strictly on financial date
  const last10DaysActivities: FinancialActivityItem[] = useMemo(() => {
    const items: FinancialActivityItem[] = [];

    filteredExpenses.forEach((e) => {
      items.push({
        id: `exp-${e.id}`,
        type: 'EXPENSE',
        title: e.description || e.categoryName,
        categoryOrConcept: e.categoryName,
        description: e.isRecurring ? `Gasto Recurrente (${e.frequencyName || 'Frecuente'})` : undefined,
        amount: e.amount,
        date: e.date
      });
    });

    filteredExtraIncomes.forEach((i) => {
      items.push({
        id: `inc-${i.id}`,
        type: 'EXTRA_INCOME',
        title: i.concept,
        categoryOrConcept: 'Ingreso Extra',
        description: i.description,
        amount: i.amount,
        date: i.date
      });
    });

    filteredInvestmentContribs.forEach((c) => {
      items.push({
        id: `inv-${c.id}`,
        type: 'INVESTMENT',
        title: 'Aporte a Inversión',
        categoryOrConcept: 'Inversión',
        description: c.note,
        amount: c.amount,
        date: c.date
      });
    });

    // Sort descending by financial date
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredExpenses, filteredExtraIncomes, filteredInvestmentContribs]);

  const loading = profileLoading || expensesLoading || incomesLoading || investmentLoading;

  const refreshAll = async () => {
    await Promise.all([refreshExpenses(), refreshIncomes(), refreshInvestment()]);
  };

  return {
    selectedPeriod,
    setSelectedPeriod: setInternalPeriod,
    summary,
    last10DaysActivities,
    allExpenses: expenses,
    expenses: filteredExpenses,
    extraIncomes: filteredExtraIncomes,
    investmentContribs: filteredInvestmentContribs,
    investmentConfig,
    loading,
    refreshAll
  };
}

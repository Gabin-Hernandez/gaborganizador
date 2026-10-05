'use client';

import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { GastosOverviewCards } from '@/components/gastos/GastosOverviewCards';
import { GastosFilterBar, GastosFilterState } from '@/components/gastos/GastosFilterBar';
import { GastosCardList } from '@/components/gastos/GastosCardList';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { MonthSelector, formatPeriodLabel } from '@/components/ui/MonthSelector';
import { Expense } from '@/domain/entities/Expense';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function GastosPage({ onOpenMobileSidebar }: PageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() =>
    new Date().toISOString().slice(0, 7)
  );

  const { expenses: allExpenses, loading, addExpense, updateExpense, deleteExpense, refresh } = useExpenses();
  const { refreshAll } = useFinancialSummary(selectedPeriod);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [filters, setFilters] = useState<GastosFilterState>({
    search: '',
    category: 'TODAS',
    period: 'ESTE_MES',
    type: 'TODOS',
    sort: 'RECENT'
  });

  // Filter expenses strictly by financial date (date) matching selectedPeriod
  const periodExpenses = useMemo(() => {
    return allExpenses.filter((e) => e.date && e.date.startsWith(selectedPeriod));
  }, [allExpenses, selectedPeriod]);

  // Apply secondary filters (search, category, recurrence type, sorting)
  const filteredExpenses = useMemo(() => {
    let result = [...periodExpenses];

    // Search filter (concept / category / description)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.categoryName.toLowerCase().includes(query) ||
          (e.description && e.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category !== 'TODAS') {
      result = result.filter((e) => e.categoryName === filters.category);
    }

    // Recurrence Type filter
    if (filters.type === 'UNICOS') {
      result = result.filter((e) => !e.isRecurring);
    } else if (filters.type === 'RECURRENTES') {
      result = result.filter((e) => e.isRecurring);
    }

    // Sort by financial date or amount
    result.sort((a, b) => {
      if (filters.sort === 'RECENT') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sort === 'OLD') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sort === 'AMOUNT_DESC') {
        return b.amount - a.amount;
      }
      if (filters.sort === 'AMOUNT_ASC') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [periodExpenses, filters]);

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (data: any) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
    }
    await refresh();
    await refreshAll();
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    await refresh();
    await refreshAll();
  };

  if (loading && allExpenses.length === 0) {
    return <LoadingSpinner label="Cargando tu centro de gastos..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Header
          title="Registro de Gastos"
          subtitle={`Movimientos financieros del periodo: ${formatPeriodLabel(selectedPeriod)}`}
          moduleImage="/salario.png"
          onOpenMobileSidebar={onOpenMobileSidebar}
          onQuickAction={handleOpenCreate}
          quickActionLabel="Registrar gasto"
        />
        <div className="shrink-0 flex items-center justify-end">
          <MonthSelector selectedPeriod={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
      </div>

      {/* Summary Cards for Selected Period */}
      <GastosOverviewCards expenses={periodExpenses} selectedPeriod={selectedPeriod} />

      {/* Filters Bar */}
      <GastosFilterBar filters={filters} onChange={setFilters} />

      {/* Card List / Empty State */}
      <GastosCardList
        expenses={filteredExpenses}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteExpense}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Create / Edit Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
      />
    </div>
  );
}

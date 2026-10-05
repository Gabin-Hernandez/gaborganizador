'use client';

import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { Header } from '@/components/layout/Header';
import { GastosOverviewCards } from '@/components/gastos/GastosOverviewCards';
import { GastosFilterBar, GastosFilterState } from '@/components/gastos/GastosFilterBar';
import { GastosCardList } from '@/components/gastos/GastosCardList';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { Expense } from '@/domain/entities/Expense';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function GastosPage({ onOpenMobileSidebar }: PageProps) {
  const { expenses, loading, addExpense, updateExpense, deleteExpense, refresh } = useExpenses();
  const { refreshAll } = useFinancialSummary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [filters, setFilters] = useState<GastosFilterState>({
    search: '',
    category: 'TODAS',
    period: 'ESTE_MES',
    type: 'TODOS',
    sort: 'RECENT'
  });

  // Calculate filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

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

    // Period filter
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM

    if (filters.period === 'ESTE_MES') {
      result = result.filter((e) => e.date.startsWith(currentMonthStr));
    } else if (filters.period === 'MES_ANTERIOR') {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthStr = prevMonth.toISOString().slice(0, 7);
      result = result.filter((e) => e.date.startsWith(prevMonthStr));
    } else if (filters.period === '30_DIAS') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      result = result.filter((e) => e.date >= thirtyDaysAgoStr);
    }

    // Sort
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
  }, [expenses, filters]);

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

  if (loading && expenses.length === 0) {
    return <LoadingSpinner label="Cargando tu centro de gastos..." />;
  }

  return (
    <div className="space-y-6">
      <Header
        title="Registro de Gastos"
        subtitle="Administra, consulta y filtra el historial de tus movimientos"
        moduleImage="/salario.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
        onQuickAction={handleOpenCreate}
        quickActionLabel="Registrar gasto"
      />

      {/* Summary Cards */}
      <GastosOverviewCards expenses={expenses} />

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

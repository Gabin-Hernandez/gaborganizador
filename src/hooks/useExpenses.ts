'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { Expense } from '@/domain/entities/Expense';
import { ExpenseRepositoryFirebase } from '@/infrastructure/firebase/expenseRepositoryFirebase';

const repo = new ExpenseRepositoryFirebase();

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.getExpenses(user.uid);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      const created = await repo.createExpense(user.uid, expenseData);
      setExpenses((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Error al agregar gasto');
      throw err;
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    if (!user) return;
    try {
      await repo.updateExpense(user.uid, id, data);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar gasto');
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    try {
      await repo.deleteExpense(user.uid, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar gasto');
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
}

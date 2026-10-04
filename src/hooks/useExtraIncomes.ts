'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { ExtraIncome } from '@/domain/entities/ExtraIncome';
import { ExtraIncomeRepositoryFirebase } from '@/infrastructure/firebase/extraIncomeRepositoryFirebase';

const repo = new ExtraIncomeRepositoryFirebase();

export function useExtraIncomes() {
  const { user } = useAuth();
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    if (!user) {
      setExtraIncomes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.getExtraIncomes(user.uid);
      setExtraIncomes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ingresos extra');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const addExtraIncome = async (data: Omit<ExtraIncome, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      const created = await repo.createExtraIncome(user.uid, data);
      setExtraIncomes((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Error al guardar ingreso extra');
      throw err;
    }
  };

  const deleteExtraIncome = async (id: string) => {
    if (!user) return;
    try {
      await repo.deleteExtraIncome(user.uid, id);
      setExtraIncomes((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar ingreso extra');
      throw err;
    }
  };

  return {
    extraIncomes,
    loading,
    error,
    refresh: fetchIncomes,
    addExtraIncome,
    deleteExtraIncome
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { InvestmentConfig, InvestmentContribution, InvestmentType } from '@/domain/entities/InvestmentConfig';
import { InvestmentRepositoryFirebase } from '@/infrastructure/firebase/investmentRepositoryFirebase';

const repo = new InvestmentRepositoryFirebase();

export function useInvestment() {
  const { user } = useAuth();
  const [config, setConfig] = useState<InvestmentConfig | null>(null);
  const [contributions, setContributions] = useState<InvestmentContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setConfig(null);
      setContributions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [cfg, contribs] = await Promise.all([
        repo.getInvestmentConfig(user.uid),
        repo.getInvestmentContributions(user.uid)
      ]);
      setConfig(cfg);
      setContributions(contribs);
    } catch (err: any) {
      setError(err.message || 'Error al cargar información de inversión');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveConfig = async (type: InvestmentType, value: number) => {
    if (!user) return;
    try {
      const updated = await repo.saveInvestmentConfig(user.uid, { type, value });
      setConfig(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Error al guardar configuración de inversión');
      throw err;
    }
  };

  const addContribution = async (amount: number, note?: string, date?: string) => {
    if (!user) return;
    try {
      const created = await repo.addInvestmentContribution(user.uid, {
        amount,
        note,
        date: date || new Date().toISOString().split('T')[0]
      });
      setContributions((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Error al registrar contribución de inversión');
      throw err;
    }
  };

  const deleteContribution = async (id: string) => {
    if (!user) return;
    try {
      await repo.deleteInvestmentContribution(user.uid, id);
      setContributions((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar contribución');
      throw err;
    }
  };

  return {
    config,
    contributions,
    loading,
    error,
    refresh: fetchData,
    saveConfig,
    addContribution,
    deleteContribution
  };
}

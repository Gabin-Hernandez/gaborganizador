'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { Frequency } from '@/domain/entities/Frequency';
import { FrequencyRepositoryFirebase } from '@/infrastructure/firebase/frequencyRepositoryFirebase';

const repo = new FrequencyRepositoryFirebase();

export function useFrequencies() {
  const { user } = useAuth();
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFrequencies = useCallback(async () => {
    if (!user) {
      setFrequencies([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.getFrequencies(user.uid);
      setFrequencies(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar frecuencias');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFrequencies();
  }, [fetchFrequencies]);

  const addFrequency = async (name: string, daysInterval: number) => {
    if (!user) return;
    try {
      const newFreq = await repo.createFrequency(user.uid, name, daysInterval);
      setFrequencies((prev) => [...prev, newFreq]);
      return newFreq;
    } catch (err: any) {
      setError(err.message || 'Error al agregar frecuencia');
      throw err;
    }
  };

  return {
    frequencies,
    loading,
    error,
    refresh: fetchFrequencies,
    addFrequency
  };
}

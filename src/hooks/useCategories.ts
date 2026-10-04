'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { Category } from '@/domain/entities/Category';
import { CategoryRepositoryFirebase } from '@/infrastructure/firebase/categoryRepositoryFirebase';

const repo = new CategoryRepositoryFirebase();

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await repo.getCategories(user.uid);
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string, icon?: string, color?: string) => {
    if (!user) return;
    try {
      const newCat = await repo.createCategory(user.uid, name, icon, color);
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    } catch (err: any) {
      setError(err.message || 'Error al crear categoría');
      throw err;
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    if (!user) return;
    try {
      await repo.updateCategory(user.uid, id, data);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar categoría');
      throw err;
    }
  };

  const deactivateCategory = async (id: string) => {
    if (!user) return;
    try {
      await repo.deleteCategoryIfUnused(user.uid, id);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Error al desactivar categoría');
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    updateCategory,
    deactivateCategory
  };
}

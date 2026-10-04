'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useFrequencies } from '@/hooks/useFrequencies';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CategoryModal } from './CategoryModal';
import { Plus, Tag, Clock, Archive } from 'lucide-react';

export const CategoryList: React.FC = () => {
  const { categories, loading: loadingCats, addCategory, deactivateCategory } = useCategories();
  const { frequencies, loading: loadingFreqs, addFrequency } = useFrequencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFreqName, setNewFreqName] = useState('');
  const [newFreqDays, setNewFreqDays] = useState('');

  if (loadingCats || loadingFreqs) {
    return <LoadingSpinner label="Cargando categorías y frecuencias..." />;
  }

  const handleAddCategory = async (name: string) => {
    await addCategory(name);
  };

  const handleAddFrequency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFreqName || !newFreqDays) return;
    await addFrequency(newFreqName, parseInt(newFreqDays));
    setNewFreqName('');
    setNewFreqDays('');
  };

  const activeCategories = categories.filter((c) => c.isActive !== false);

  return (
    <div className="space-y-8">
      {/* Categories Header & Grid */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            Categorías de Gastos Configuradas
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Categorías activas asociadas a tus movimientos de gastos.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Nueva categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCategories.map((cat) => (
          <Card key={cat.id} hoverEffect className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                {cat.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{cat.name}</h4>
                <p className="text-[11px] text-slate-500">{cat.isDefault ? 'Por defecto' : 'Personalizada'}</p>
              </div>
            </div>

            <button
              onClick={() => deactivateCategory(cat.id)}
              title="Archivar / Desactivar categoría"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>

      {/* Frequencies Section */}
      <div className="pt-8 border-t border-slate-800">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            Frecuencias de Gastos Recurrentes
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Frecuencias disponibles para programar gastos periódicos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {frequencies.map((f) => (
            <Card key={f.id} className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Frecuencia</span>
              <h4 className="text-base font-bold text-slate-100 mt-1">{f.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cada {f.daysInterval} día(s)</p>
            </Card>
          ))}
        </div>

        {/* Add custom frequency form */}
        <Card className="p-5 max-w-md">
          <h4 className="text-xs font-bold text-slate-300 uppercase mb-3">Agregar nueva frecuencia</h4>
          <form onSubmit={handleAddFrequency} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. Bimensual"
              value={newFreqName}
              onChange={(e) => setNewFreqName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Días (60)"
              value={newFreqDays}
              onChange={(e) => setNewFreqDays(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Button type="submit" size="sm">
              Agregar
            </Button>
          </form>
        </Card>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};
